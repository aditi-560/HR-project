const express = require('express');
const User = require('../models/User');
const LeaveBalance = require('../models/LeaveBalance');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Admin: Get all employees
router.get('/admin/all', authenticate, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').lean();
    const balances = await LeaveBalance.find().lean();
    const balanceMap = {};
    balances.forEach((b) => {
      balanceMap[b.user_id.toString()] = b;
    });
    const result = users.map((u) => {
      const bal = balanceMap[u._id.toString()] || { total_balance: 20, used_balance: 0 };
      return {
        ...u,
        id: u._id.toString(),
        user_roles: [{ role: u.role }],
        leave_balances: [bal],
      };
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch employees.' });
  }
});

module.exports = router;
