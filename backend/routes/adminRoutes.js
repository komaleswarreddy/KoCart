const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} = require('../controllers/adminController');
const {
  getAllOrders,
  updateOrderToDelivered,
  deleteOrder,
} = require('../controllers/orderController');
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes are protected with both protect and admin middleware
router.use(protect);
router.use(admin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// User routes
router.route('/users')
  .get(getUsers);

router.route('/users/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

// Product routes
router.route('/products')
  .get(getProducts)
  .post(createProduct);

router.route('/products/:id')
  .put(updateProduct)
  .delete(deleteProduct);

// Order routes
router.route('/orders')
  .get(getAllOrders);

router.route('/orders/:id')
  .delete(deleteOrder);

router.route('/orders/:id/deliver')
  .put(updateOrderToDelivered);

module.exports = router;
