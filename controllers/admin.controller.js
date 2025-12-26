// controllers/admin.controller.js
const Order = require('../models/order');
const User = require('../models/User');
const response = require('../utils/response');

// ADMIN DASHBOARD
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({ include: [User] });
    return response.success(res, orders);
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    // FRONTEND ADMIN PANEL: dropdown se status aayega

    await Order.update(
      { status },
      { where: { id: req.params.id } }
    );

    return response.success(res, null, 'Order updated');
  } catch (err) {
    next(err);
  }
};
