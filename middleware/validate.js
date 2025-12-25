const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body); 
    // ✅ Replaceable: schema ke andar frontend ke form fields ke hisaab se keys define karna (example: email, password)

    if (error) {
      return res.status(400).json({ 
        message: error.details[0].message 
        // ✅ Replaceable: frontend me display karne ke liye user-friendly error message set kar sakte ho
      });
    }
    next();
  };
};

module.exports = validateBody; 
// ❌ Nahi replace karna, sirf export ke liye hai
