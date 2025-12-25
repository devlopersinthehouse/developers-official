const mongoose = require("mongoose");

// ✅ Replaceable: yaha schema fields tumhare frontend form fields ke hisaab se adjust kar sakte ho
// Example: name, email, password, role etc.
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // ✅ Required: agar frontend me name mandatory hai
  },
  email: {
    type: String,
    required: true, // ✅ Required: frontend email input
    unique: true,   // ✅ Optional: duplicate email allow nahi karna
  },
  password: {
    type: String,
    required: true, // ✅ Required: frontend password field
  },
  role: {
    type: String,
    default: "user", // ✅ Replaceable: agar frontend me admin/user role define karna hai
  },
}, { timestamps: true }); // timestamps automatic createdAt / updatedAt

// ✅ Replaceable: agar tumhe extra methods chahiye, like password compare, yaha add kar sakte ho
// Example: userSchema.methods.matchPassword = function(enteredPassword){...}

const User = mongoose.model("User", userSchema);

module.exports = User; // ❌ Nahi replace karna, export ke liye
