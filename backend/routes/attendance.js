const express = require('express');
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get my attendance (employee)
router.get('/my', authenticate, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 30;
    const attendance = await Attendance.find({ user_id: req.user._id })
      .sort({ date: -1 })
      .limit(limit)
      .lean();
    res.json(attendance.map((a) => ({
      ...a,
      id: a._id.toString(),
      user_id: a.user_id.toString(),
    })));
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch attendance.' });
  }
});

// Get today's attendance (employee)
router.get('/my/today', authenticate, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const att = await Attendance.findOne({
      user_id: req.user._id,
      date: { $gte: today, $lt: tomorrow },
    }).lean();
    if (!att) return res.json(null);
    res.json({
      ...att,
      id: att._id.toString(),
      user_id: att.user_id.toString(),
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch attendance.' });
  }
});

// Mark attendance (employee)
router.post('/', authenticate, async (req, res) => {
  try {
    const { date, status } = req.body;
    if (!date || !status || !['present', 'absent'].includes(status)) {
      return res.status(400).json({ message: 'Valid date and status (present/absent) are required.' });
    }
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (d > today) {
      return res.status(400).json({ message: 'Cannot mark attendance for future dates.' });
    }
    const existing = await Attendance.findOne({
      user_id: req.user._id,
      date: { $gte: d, $lt: new Date(d.getTime() + 24 * 60 * 60 * 1000) },
    });
    if (existing) {
      return res.status(400).json({ message: 'Attendance already marked for this date.' });
    }
    const att = await Attendance.create({
      user_id: req.user._id,
      date: d,
      status,
    });
    res.status(201).json({
      ...att.toObject(),
      id: att._id.toString(),
      user_id: att.user_id.toString(),
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Attendance already marked for this date.' });
    }
    res.status(500).json({ message: err.message || 'Failed to mark attendance.' });
  }
});

// Admin: Update attendance (mark absent with reason, or mark present)
router.patch('/update/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    if (!status || !['present', 'absent'].includes(status)) {
      return res.status(400).json({ message: 'Valid status (present/absent) is required.' });
    }
    if (status === 'absent' && !reason) {
      return res.status(400).json({ message: 'Reason is required when marking absent.' });
    }
    const att = await Attendance.findById(id);
    if (!att) return res.status(404).json({ message: 'Attendance record not found.' });
    att.status = status;
    att.reason = status === 'absent' ? (reason || null) : null;
    await att.save();
    const populated = await Attendance.findById(id).populate('user_id', 'full_name email').lean();
    res.json({
      ...populated,
      id: populated._id.toString(),
      user_id: populated.user_id._id.toString(),
      profiles: { full_name: populated.user_id.full_name, email: populated.user_id.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to update attendance.' });
  }
});

// Admin: Create attendance (for employees who have no record yet)
router.post('/admin/mark', authenticate, requireAdmin, async (req, res) => {
  try {
    const { user_id, date, status, reason } = req.body;
    
    if (!user_id || !date || !status || !['present', 'absent'].includes(status)) {
      return res.status(400).json({ message: 'User ID, date, and status are required.' });
    }

    // Check if exists
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const end = new Date(d);
    end.setHours(23, 59, 59, 999);

    const existing = await Attendance.findOne({
      user_id,
      date: { $gte: d, $lte: end }
    });

    if (existing) {
      return res.status(400).json({ message: 'Attendance already exists for this user and date.' });
    }

    const att = await Attendance.create({
      user_id,
      date: d,
      status,
      reason: status === 'absent' ? reason : null
    });

    const populated = await Attendance.findById(att._id).populate('user_id', 'full_name email').lean();
    
    res.status(201).json({
      ...populated,
      id: populated._id.toString(),
      user_id: populated.user_id._id.toString(),
      profiles: { full_name: populated.user_id.full_name, email: populated.user_id.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to mark attendance.' });
  }
});

// Admin: Get all attendance with filters (Daily Report)
router.get('/admin/all', authenticate, requireAdmin, async (req, res) => {
  try {
    const { date, name } = req.query;
    
    // Default to today if date is not provided
    let targetDate = new Date();
    if (date && typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [year, month, day] = date.split('-').map(Number);
      targetDate = new Date(year, month - 1, day);
    }
    
    // Set time boundaries for the selected date
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // 1. Fetch all employees
    const employees = await User.find({ role: 'employee' })
      .select('full_name email _id')
      .lean();

    // 2. Fetch attendance records for the date
    const attendanceRecords = await Attendance.find({
      date: { $gte: startOfDay, $lte: endOfDay }
    }).lean();

    // Map attendance by user_id for O(1) lookup
    const attendanceMap = new Map();
    attendanceRecords.forEach(att => {
      attendanceMap.set(att.user_id.toString(), att);
    });

    // 3. Merge results
    let mergedData = employees.map(emp => {
      const att = attendanceMap.get(emp._id.toString());
      return {
        id: att ? att._id.toString() : `temp-${emp._id}`, // Use existing ID or temp ID
        employeeId: emp._id.toString(),
        name: emp.full_name,
        email: emp.email,
        status: att ? att.status : 'absent', // Default to absent
        reason: att ? att.reason : null,
        profiles: { // Keep backward compatibility structure if needed, or just for UI consistency
            full_name: emp.full_name,
            email: emp.email
        }
      };
    });

    // Filter by name if provided
    if (name) {
      const n = name.toLowerCase();
      mergedData = mergedData.filter(item => 
        item.name.toLowerCase().includes(n) || 
        item.email.toLowerCase().includes(n)
      );
    }

    // 4. Calculate stats
    const totalEmployees = mergedData.length;
    const presentCount = mergedData.filter(item => item.status === 'present').length;
    const absentCount = mergedData.filter(item => item.status === 'absent').length;

    // 5. Return structured response
    res.json({
      date: targetDate.toISOString().split('T')[0],
      totalEmployees,
      presentCount,
      absentCount,
      attendanceData: mergedData
    });

  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch attendance.' });
  }
});

module.exports = router;
