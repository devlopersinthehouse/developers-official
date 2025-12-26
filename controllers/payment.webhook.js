// controllers/payment.webhook.js
const Order = require('../models/order');

// NOTE:
// Ye file payment gateway se call hoti hai (Razorpay / Stripe webhook)

exports.handlePaymentWebhook = async (req, res) => {
  try {
    // PAYMENT GATEWAY ke according payload change hoga
    const { orderId, paymentStatus } = req.body;

    // SECURITY:
    // Yahan webhook signature verify karna hota hai
    // (payment.service.js ke logic ke saath)

    if (paymentStatus === 'success') {
      await Order.update(
        { status: 'paid' },
        { where: { id: orderId } }
      );
    }

    res.status(200).send('OK');
  } catch (err) {
    res.status(500).send('Webhook Error');
  }
};
