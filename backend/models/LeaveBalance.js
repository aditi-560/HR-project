const mongoose = require('mongoose');

const leaveBalanceSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  total_balance: {
    type: Number,
    default: 20,
  },
  used_balance: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('LeaveBalance', leaveBalanceSchema);
