const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const auth = require('../middleware/auth');       // Already exists
const admin = require('../middleware/admin');     // STEP 2 ke baad add kiya

// Protected route: only admin
router.get('/orders', auth, admin, adminController.getAllOrders);
router.patch('/orders/:id', auth, admin, adminController.updateOrderStatus);

module.exports = router;
