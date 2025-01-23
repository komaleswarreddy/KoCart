const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const razorpay = require('../config/razorpay');
const Order = require('../models/orderModel');

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount) {
      res.status(400);
      throw new Error('Amount is required');
    }

    // Convert amount to paise (Razorpay expects amount in smallest currency unit)
    const amountInPaise = Math.round(amount * 100);

    const options = {
      amount: amountInPaise,
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      throw new Error('Error creating Razorpay order');
    }

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500);
    throw new Error(error.message || 'Error creating payment order');
  }
});

// @desc    Verify Razorpay payment
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = asyncHandler(async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400);
      throw new Error('Missing required payment verification parameters');
    }

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      res.status(400);
      throw new Error('Invalid payment signature');
    }

    // Update order status
    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: razorpay_payment_id,
      status: 'completed',
      update_time: Date.now(),
      email_address: req.user.email,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(error.status || 500);
    throw new Error(error.message || 'Error verifying payment');
  }
});

// @desc    Handle Razorpay webhook
// @route   POST /api/payment/webhook
// @access  Public
const handleWebhook = asyncHandler(async (req, res) => {
  const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');

  if (digest !== req.headers['x-razorpay-signature']) {
    res.status(400);
    throw new Error('Invalid webhook signature');
  }

  const { payload } = req.body;
  const { payment } = payload;

  if (payment && payment.entity) {
    const paymentId = payment.entity.id;
    try {
      // Find order by payment reference
      const order = await Order.findOne({
        'paymentResult.id': paymentId,
      });

      if (order) {
        if (payment.entity.status === 'captured') {
          order.isPaid = true;
          order.paidAt = Date.now();
          await order.save();
        } else if (payment.entity.status === 'failed') {
          order.isPaid = false;
          order.paymentResult.status = 'failed';
          await order.save();
        }
      }
    } catch (error) {
      console.error('Webhook processing error:', error);
    }
  }

  res.json({ status: 'ok' });
});

// @desc    Get Razorpay key
// @route   GET /api/payment/key
// @access  Private
const getRazorpayKey = asyncHandler(async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_ID) {
      throw new Error('Razorpay key not configured');
    }
    res.json({ key: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    console.error('Get Razorpay key error:', error);
    res.status(500);
    throw new Error('Error getting Razorpay key');
  }
});

module.exports = {
  createOrder,
  verifyPayment,
  handleWebhook,
  getRazorpayKey,
};
