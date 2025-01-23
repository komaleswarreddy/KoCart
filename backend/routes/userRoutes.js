const express = require('express');
const router = express.Router();
const {
  registerUser,
  registerAdmin,
  loginUser,
  getUserProfile,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.post('/register-admin', protect, admin, registerAdmin);

module.exports = router;
