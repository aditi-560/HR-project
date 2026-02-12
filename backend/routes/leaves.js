const express = require('express');
const Leave = require('../models/Leave');
const LeaveBalance = require('../models/LeaveBalance');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get my leaves (employee)
router.get('/my', authenticate, async (req, res) => {
  try {
    const leaves = await Leave.find({ user_id: req.user._id })
      .sort({ applied_date: -1 })
      .lean();
    res.json(leaves.map((l) => ({
      ...l,
      id: l._id.toString(),
      user_id: l.user_id.toString(),
    })));
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch leaves.' });
  }
});

// Apply leave (employee)
router.post('/', authenticate, async (req, res) => {
  try {
    const { leave_type, start_date, end_date, reason } = req.body;
    if (!leave_type || !start_date || !end_date) {
      return res.status(400).json({ message: 'Leave type, start date and end date are required.' });
    }
    const start = new Date(start_date);
    const end = new Date(end_date);
    if (end < start) {
      return res.status(400).json({ message: 'End date must be after start date.' });
    }
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const leave = await Leave.create({
      user_id: req.user._id,
      leave_type,
      start_date: start,
      end_date: end,
      total_days: totalDays,
      reason: reason || null,
      status: 'pending',
    });
    res.status(201).json({
      ...leave.toObject(),
      id: leave._id.toString(),
      user_id: leave.user_id.toString(),
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to apply leave.' });
  }
});

// Update leave (employee - pending only)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Leave not found.' });
    if (leave.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this leave.' });
    }
    if (leave.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending leaves can be edited.' });
    }
    const { leave_type, start_date, end_date, reason } = req.body;
    if (leave_type) leave.leave_type = leave_type;
    if (start_date) leave.start_date = new Date(start_date);
    if (end_date) leave.end_date = new Date(end_date);
    if (reason !== undefined) leave.reason = reason || null;
    if (leave.end_date < leave.start_date) {
      return res.status(400).json({ message: 'End date must be after start date.' });
    }
    leave.total_days = Math.ceil((leave.end_date - leave.start_date) / (1000 * 60 * 60 * 24)) + 1;
    await leave.save();
    res.json({
      ...leave.toObject(),
      id: leave._id.toString(),
      user_id: leave.user_id.toString(),
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to update leave.' });
  }
});

// Delete leave (employee - pending only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Leave not found.' });
    if (leave.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this leave.' });
    }
    if (leave.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending leaves can be cancelled.' });
    }
    await Leave.findByIdAndDelete(req.params.id);
    res.json({ message: 'Leave cancelled.' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to delete leave.' });
  }
});

// Admin: Get all leaves
router.get('/admin/all', authenticate, requireAdmin, async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate('user_id', 'full_name email')
      .sort({ applied_date: -1 })
      .lean();

    const validLeaves = leaves.filter(l => l.user_id);

    res.json(validLeaves.map((l) => ({
      ...l,
      id: l._id.toString(),
      user_id: l.user_id._id.toString(),
      profiles: { full_name: l.user_id.full_name, email: l.user_id.email },
    })));
  } catch (err) {
    console.error('Error fetching admin leaves:', err);
    res.status(500).json({ message: err.message || 'Failed to fetch leaves.' });
  }
});

// Admin: Approve or reject leave
router.patch('/admin/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be approved or rejected.' });
    }
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Leave not found.' });
    if (leave.status !== 'pending') {
      return res.status(400).json({ message: 'Leave is not pending.' });
    }
    leave.status = status;
    await leave.save();
    if (status === 'approved') {
      await LeaveBalance.findOneAndUpdate(
        { user_id: leave.user_id },
        { $inc: { used_balance: leave.total_days } }
      );
    }
    res.json({
      ...leave.toObject(),
      id: leave._id.toString(),
      user_id: leave.user_id.toString(),
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to update leave.' });
  }
});

module.exports = router;
