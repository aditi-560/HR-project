const express = require('express');
const LeaveBalance = require('../models/LeaveBalance');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get my leave balance (employee)
router.get('/my', authenticate, async (req, res) => {
  try {
    let balance = await LeaveBalance.findOne({ user_id: req.user._id }).lean();
    if (!balance) {
      const created = await LeaveBalance.create({ user_id: req.user._id });
      balance = created.toObject();
    }
    res.json({
      user_id: balance.user_id.toString(),
      total_balance: balance.total_balance ?? 20,
      used_balance: balance.used_balance ?? 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch leave balance.' });
  }
});

module.exports = router;
