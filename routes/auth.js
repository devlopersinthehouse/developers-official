const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const validateBody = require("../middleware/validate");
const Joi = require("joi");

// ✅ Replaceable: frontend registration/login form fields
const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// REGISTER
router.post("/register", validateBody(registerSchema), async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" }); 
    // ✅ Replaceable: frontend alert message

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    // ✅ Replaceable: payload me frontend ke hisaab se fields add kar sakte ho

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    // ✅ Replaceable: frontend me jo fields chahiye, wahi send karo
  } catch (err) {
    res.status(500).json({ message: err.message || "Server Error" });
  }
});

// LOGIN
router.post("/login", validateBody(loginSchema), async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" }); 
    // ✅ Replaceable: frontend alert message

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" }); 
    // ✅ Replaceable: frontend alert message

    const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    // ✅ Replaceable: frontend required fields
  } catch (err) {
    res.status(500).json({ message: err.message || "Server Error" });
  }
});

module.exports = router; 
// ❌ Nahi replace karna
