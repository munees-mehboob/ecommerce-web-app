const express = require('express');
const router = express.Router();
const { register, login, getProfile, getUsers } = require('../controllers/authController');

// Combine these into ONE line to stop the crash
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);

// Admin route
router.get('/users', protect, adminOnly, getUsers);

module.exports = router;