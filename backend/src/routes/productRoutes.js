const express = require('express');
const {
  createProduct,
  getProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  toggleProductAvailability,
  getFeaturedProducts,
  getNewArrivals
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);

// Protected routes
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);
router.patch('/:id/toggle', protect, toggleProductAvailability);

module.exports = router;