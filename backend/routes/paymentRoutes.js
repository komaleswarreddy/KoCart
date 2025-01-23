const express = require('express');
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getRazorpayKey,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// Routes
router.route('/create-order').post(protect, createOrder);
router.route('/verify').post(protect, verifyPayment);
router.route('/key').get(protect, getRazorpayKey);

module.exports = router;
