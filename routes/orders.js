const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const auth = require('../middleware/auth');

router.post('/', auth, orderController.createOrder);
router.get('/my', auth, orderController.getMyOrders);

module.exports = router;
