const errorHandler = (err, req, res, next) => {
  console.error(err.stack); 
  // ❌ Nahi replace karna, backend me developer console ke liye hai

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error" 
    // ✅ Replaceable: frontend me display karne ke liye user-friendly error message set kar sakte ho
    // Example: "Something went wrong, please try again"
  });
};

module.exports = errorHandler; 
// ❌ Nahi replace karna, sirf export ke liye hai
