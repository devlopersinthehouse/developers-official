const express = require('express');
const Razorpay = require('razorpay');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order
router.post('/create-order', protect, async (req, res) => {
  const { amount = 49900 } = req.body; // amount in paise (499 rupees = 49900 paise)

  const options = {
    amount,
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error creating order' });
  }
});

// Verify Payment & Upgrade User
router.post('/verify-payment', protect, async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

  const crypto = require('crypto');
  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');

  if (generated_signature === razorpay_signature) {
    // Payment genuine hai
    await User.findByIdAndUpdate(req.user._id, { isPremium: true });
    res.json({ message: 'Payment successful! You are now Premium!' });
  } else {
    res.status(400).json({ message: 'Payment verification failed' });
  }
});

module.exports = router;