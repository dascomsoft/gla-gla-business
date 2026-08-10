const express = require('express');
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public route (for customers)
router.post('/', createOrder);

// Protected routes (admin only)
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);
router.patch('/:id/status', protect, updateOrderStatus);

module.exports = router;
