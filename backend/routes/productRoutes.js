const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProductById, 
  createProduct, 
  deleteProduct, 
  updateProduct,
  createReview
} = require('../controllers/productController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

// --- ADMIN ONLY DATA ACCESS ---
// Added adminOnly here so regular users cannot fetch the product list or details
router.get('/',  getProducts);
router.get('/:id', getProductById);

// --- ADMIN ACTIONS ---
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct); 
router.delete('/:id', protect, adminOnly, deleteProduct); 

// --- USER ACTIONS ---
// Usually, reviews are for regular users, so we only use protect here
router.post('/:id/reviews', protect, createReview);

module.exports = router;
