const express = require("express");
const router = express.Router();

const Payment = require("../models/Payment");
const authMiddleware = require("../middleware/auth");
const validateBody = require("../middleware/validate");
const Joi = require("joi");

// ✅ Replaceable: frontend payment form fields
const paymentSchema = Joi.object({
  amount: Joi.number().required(),
  method: Joi.string().required()
  // ✅ Optional: agar frontend aur fields bhejta hai jaise transactionId, add here
});

// CREATE PAYMENT
router.post("/create", authMiddleware, validateBody(paymentSchema), async (req, res) => {
  const { amount, method } = req.body;

  try {
    const payment = new Payment({
      user: req.user.id, // ❌ Nahi replace karna, backend sets user from JWT
      amount,
      method,
      status: "pending" // ✅ Replaceable: frontend ya backend initial status set kar sakte ho
    });

    await payment.save();
    res.json(payment); 
    // ✅ Replaceable: frontend me jo fields chahiye, wahi send karo
  } catch (err) {
    res.status(500).json({ message: err.message || "Server Error" });
  }
});

// GET PAYMENT HISTORY FOR LOGGED-IN USER
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id });
    res.json(payments); 
    // ✅ Replaceable: frontend fields adjust kar sakte ho
  } catch (err) {
    res.status(500).json({ message: err.message || "Server Error" });
  }
});

module.exports = router; 
// ❌ Nahi replace karna
