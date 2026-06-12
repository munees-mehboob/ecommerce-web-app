const express = require('express');
const router = express.Router();
const { 
  addOrderItems, 
  getMyOrders, 
  getOrders, 
  updateOrderToDelivered,
  updateOrderToPaid,
  getAdminStats // 1. Import the new stats controller
} = require('../controllers/orderController'); 
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Admin Analytics Route (Add this BEFORE general routes)
router.get('/stats', protect, adminOnly, getAdminStats);

// User Routes
router.get('/myorders', protect, getMyOrders);

// General Order Routes
router.route('/')
  .post(protect, addOrderItems)
  .get(protect, adminOnly, getOrders);

// Order Fulfillment Route
router.put('/:id/deliver', protect, adminOnly, updateOrderToDelivered, );

router.put('/:id/pay', protect, adminOnly, updateOrderToPaid);

module.exports = router;
