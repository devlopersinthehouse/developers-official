const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Register
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });

    if (user) {
      // Verification Token (1 day expiry)
      const verificationToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

      // Verification Link
      const verificationLink = `http://localhost:5000/api/auth/verify-email?token=${verificationToken}`;

      // Send Verification Email
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
        subject: 'Verify Your Email - MyApp',
        html: `
          <h2>Welcome ${name}!</h2>
          <p>Thank you for registering. Please verify your email to activate your account:</p>
          <p><a href="${verificationLink}" style="background:#764ba2;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Verify Email</a></p>
          <p>Or copy this link: ${verificationLink}</p>
          <p>This link expires in 24 hours.</p>
          <hr>
          <small>MyApp Team</small>
        `
      });

      // COOKIE SET MAT KARO REGISTER PE (ye line delete kar di)
      // Cookie sirf login pe set hoga

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        message: 'Registration successful! Please check your email to verify your account before logging in.'
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verification Check
    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your email first. Check your inbox (and spam folder) for the verification link.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    // Ab cookie set kar do (sirf login pe)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// Get Profile (protected)
exports.getProfile = async (req, res) => {
  res.json(req.user);
};