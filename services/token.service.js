const jwt = require("jsonwebtoken");

// Token generate karne ka function
const generateToken = (payload) => {
  // ❌ Replaceable: JWT_SECRET from .env
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Token verify function
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
