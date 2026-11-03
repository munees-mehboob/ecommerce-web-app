const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
  updateProduct,
  createReview,
  deleteReview,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public product routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin product routes
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

// Review routes
router.post('/:id/reviews', protect, createReview);
router.delete('/:id/reviews/:reviewId', protect, deleteReview);

module.exports = router;
