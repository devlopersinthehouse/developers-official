const jwt = require("jsonwebtoken"); 
// ❌ Nahi replace karna, JWT library ke liye required

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Bearer TOKEN
  // ❌ Nahi replace karna, token extract ke liye standard format

  if (!token) {
    return res.status(401).json({ 
      message: "No token, authorization denied" 
      // ✅ Replaceable: frontend login flow ke hisaab se message customize kar sakte ho
      // Example: "Please login first"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    // ❌ Nahi replace karna, JWT_SECRET environment variable se secure verification hoti hai

    req.user = decoded; 
    // ✅ Replaceable: JWT payload ke hisaab se user object define kar sakte ho
    // Example: req.user = { id: decoded.id, name: decoded.name, email: decoded.email }

    next();
  } catch (err) {
    return res.status(401).json({ 
      message: "Token is not valid" 
      // ✅ Replaceable: frontend user-friendly error message
      // Example: "Session expired, please login again"
    });
  }
};

module.exports = authMiddleware; 
// ❌ Nahi replace karna, middleware export ke liye
