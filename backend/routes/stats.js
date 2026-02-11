const express = require('express');
const User = require('../models/User');
const Leave = require('../models/Leave');
const Attendance = require('../models/Attendance');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Admin: Dashboard stats
router.get('/admin', authenticate, requireAdmin, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [totalEmployees, pendingLeaves, todayAttendance] = await Promise.all([
      User.countDocuments(),
      Leave.countDocuments({ status: 'pending' }),
      Attendance.countDocuments({ date: { $gte: today, $lt: tomorrow } }),
    ]);
    res.json({
      totalEmployees,
      pendingLeaves,
      todayAttendance,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch stats.' });
  }
});

module.exports = router;
