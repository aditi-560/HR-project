const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const LeaveBalance = require('../models/LeaveBalance');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@test.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin123!';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin User';

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      if (existing.role === 'admin') {
        console.log('Admin user already exists:', ADMIN_EMAIL);
      } else {
        existing.role = 'admin';
        await existing.save();
        console.log('Updated existing user to admin:', ADMIN_EMAIL);
      }
    } else {
      const user = await User.create({
        full_name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin',
      });
      await LeaveBalance.create({ user_id: user._id });
      console.log('Admin created:', ADMIN_EMAIL);
      console.log('Password:', ADMIN_PASSWORD);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedAdmin();
