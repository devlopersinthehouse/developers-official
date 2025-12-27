const express = require('express');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');  // ← NAYA ADD
const User = require('../models/User');

const { register, login, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Register route
router.post('/register', async (req, res, next) => {
  try {
    await register(req, res, next);
  } catch (err) {
    next(err);
  }
});

// Login route
router.post('/login', async (req, res, next) => {
  try {
    await login(req, res, next);
  } catch (err) {
    next(err);
  }
});

// Profile route (protected)
router.get('/profile', protect, getProfile);

// Logout route
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.json({ message: 'Logged out successfully' });
});

// Forgot Password Route
router.post('/forgot', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token (15 minutes expiry)
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    // Reset link
    const resetLink = `http://localhost:5000/reset-password.html?token=${resetToken}`;

    // Send email using nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request - MyApp',
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Click the link below to set a new password:</p>
        <p><a href="${resetLink}" style="color: blue; text-decoration: underline;">${resetLink}</a></p>
        <p>This link will expire in 15 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr>
        <small>MyApp Team</small>
      `
    });

    res.json({ message: 'Reset link sent to your email successfully' });
  } catch (err) {
    console.error('Email sending error:', err);
    res.status(500).json({ message: 'Error sending email. Check server logs.' });
  }
});

// Reset Password Route
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Update password (pre-save hook will hash it)
    user.password = password;
    await user.save();

    res.json({ message: 'Password updated successfully. You can now login.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

module.exports = router;