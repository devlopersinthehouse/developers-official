const User = require('../models/User');
const generateToken = require('../utils/generateToken');

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
      const token = generateToken(user._id);

      // HTTP-only cookie set kar do
      res.cookie('token', token, {
        httpOnly: true,                               // JS se access nahi hoga (secure)
        secure: process.env.NODE_ENV === 'production', // Production mein HTTPS pe true
        sameSite: 'strict',                           // CSRF protection
        maxAge: 30 * 24 * 60 * 60 * 1000               // 30 days expiry
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      const token = generateToken(user._id);

      // HTTP-only cookie set kar do
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000  // 30 days
      });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Profile (protected) - same rahega
exports.getProfile = async (req, res) => {
  res.json(req.user);
};