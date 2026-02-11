const express = require('express');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const LeaveBalance = require('../models/LeaveBalance');
const { authenticate } = require('../middleware/auth');
const sendEmail = require('../utils/email');

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

// Register
router.post('/register', async (req, res) => {
  try {
    const { full_name, email, password, role } = req.body;
    console.log('REGISTER BODY:', req.body); 
    if (!full_name || !email || !password) {
      return res.status(400).json({ message: 'Full name, email and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }
    const userRole = (role && String(role).toLowerCase() === 'admin') ? 'admin' : 'employee';
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered.' });
    }
    const user = await User.create({
      full_name: full_name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: userRole,
    });
    await LeaveBalance.create({ user_id: user._id });
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    // Send Welcome Email
    const emailSubject = 'Welcome to HR Harmony!';
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #2563eb;">Welcome to HR Harmony!</h2>
        <p>Hi ${user.full_name},</p>
        <p>Thank you for registering with us. We are excited to have you on board.</p>
        <p>Your account has been successfully created.</p>
        <br>
        <p>Best regards,</p>
        <p><strong>The HR Harmony Team</strong></p>
      </div>
    `;
    await sendEmail(user.email, emailSubject, emailHtml);

    res.status(201).json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        date_of_joining: user.date_of_joining,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Registration failed.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        date_of_joining: user.date_of_joining,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Login failed.' });
  }
});

// Google Login
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email, sub } = ticket.getPayload();

    let user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      // Create new user if not exists
      user = await User.create({
        full_name: name,
        email: email.toLowerCase(),
        googleId: sub,
        role: 'employee', // Default role
      });
      await LeaveBalance.create({ user_id: user._id });

      // Send Welcome Email for Google Sign-up
      const emailSubject = 'Welcome to HR Harmony!';
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #2563eb;">Welcome to HR Harmony!</h2>
          <p>Hi ${user.full_name},</p>
          <p>Thank you for signing in with Google. Your account has been successfully created.</p>
          <br>
          <p>Best regards,</p>
          <p><strong>The HR Harmony Team</strong></p>
        </div>
      `;
      await sendEmail(user.email, emailSubject, emailHtml);

    } else {
      // Link Google ID if not linked
      if (!user.googleId) {
        user.googleId = sub;
        await user.save();
      }
    }

    const jwtToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    
    res.json({
      token: jwtToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        date_of_joining: user.date_of_joining,
      },
    });
  } catch (err) {
    console.error('Google Auth Error:', err);
    res.status(401).json({ message: 'Google authentication failed' });
  }
});

// Get current user profile
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = req.user;
    res.json({
      id: user._id.toString(),
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      date_of_joining: user.date_of_joining,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch profile.' });
  }
});

module.exports = router;
