const mongoose = require("mongoose");

// ✅ Replaceable: fields tumhare frontend payment form / gateway ke hisaab se define kar sakte ho
// Example: amount, user, status, transactionId, method
const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // ❌ Nahi replace karna, backend User reference ke liye
    required: true, // ✅ Required: frontend JWT se current user id assign hoga
  },
  amount: {
    type: Number,
    required: true, // ✅ Required: frontend payment amount
  },
  status: {
    type: String,
    default: "pending", // ✅ Replaceable: frontend ya backend set kar sakte ho (pending, success, failed)
  },
  transactionId: {
    type: String,
    default: "", // ✅ Replaceable: frontend / payment gateway transaction id
  },
  method: {
    type: String,
    default: "", // ✅ Replaceable: payment method from frontend (card, UPI, wallet etc.)
  }
}, { timestamps: true }); // timestamps automatic createdAt / updatedAt

// ✅ Replaceable: extra methods agar frontend ko refund, verification, history chahiye
// Example: paymentSchema.methods.markSuccess = function(){ this.status = "success"; this.save(); }

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment; // ❌ Nahi replace karna, export ke liye
