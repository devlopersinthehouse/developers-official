// controllers/service.controller.js
const Service = require('../models/service');
const response = require('../utils/response');

exports.getAllServices = async (req, res, next) => {
  try {
    const services = await Service.findAll({ where: { isActive: true } });
    return response.success(res, services);
  } catch (err) {
    next(err);
  }
};

// ADMIN ONLY
exports.createService = async (req, res, next) => {
  try {
    // FRONTEND/ADMIN PANEL:
    // req.body = { title, description, price }
    const service = await Service.create(req.body);
    return response.success(res, service, 'Service created');
  } catch (err) {
    next(err);
  }
};
