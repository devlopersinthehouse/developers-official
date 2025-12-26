// middleware/admin.js
module.exports = (req, res, next) => {
  // auth middleware ke baad req.user me user object milega
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access only'
    });
  }
  // Admin hai → route aage execute hoga
  next();
};
