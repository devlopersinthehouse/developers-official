// controllers/order.controller.js
const Order = require('../models/order');
const Service = require('../models/service');
const response = require('../utils/response');

exports.createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { serviceId } = req.body; 
    // FRONTEND: serviceId send hoga when user clicks "Hire"

    const service = await Service.findByPk(serviceId);
    if (!service) {
      return response.error(res, 'Service not found', 404);
    }

    const order = await Order.create({
      UserId: userId,
      ServiceId: serviceId,
      totalAmount: service.price
    });

    return response.success(res, order, 'Order created');
  } catch (err) {
    next(err);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: { UserId: req.user.id },
      include: ['Service']
    });

    return response.success(res, orders);
  } catch (err) {
    next(err);
  }
};
