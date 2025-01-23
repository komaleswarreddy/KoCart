const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate({
        path: 'items.product',
        select: 'name price imageUrl stock' // Only select needed fields
      });
    
    if (!cart) {
      const newCart = await Cart.create({
        user: req.user._id,
        items: [],
        totalAmount: 0
      });
      return res.json(newCart);
    }

    // Filter out items with null products (in case products were deleted)
    cart.items = cart.items.filter(item => item.product != null);
    await cart.save();
    
    res.json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500);
    throw new Error('Error fetching cart: ' + error.message);
  }
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      res.status(400);
      throw new Error('Product ID and quantity are required');
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(400);
      throw new Error('Invalid product ID');
    }

    // Validate product exists and has enough stock
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    if (product.stock < quantity) {
      res.status(400);
      throw new Error('Not enough stock');
    }

    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
        totalAmount: 0
      });
    }

    // Check if product already in cart
    const existingItem = cart.items.find(
      item => item.product?.toString() === productId
    );

    if (existingItem) {
      // Check if adding more would exceed stock
      if (existingItem.quantity + quantity > product.stock) {
        res.status(400);
        throw new Error('Adding more would exceed available stock');
      }
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    // Calculate total amount
    cart.totalAmount = await calculateTotal(cart.items);
    await cart.save();
    
    // Populate product details before sending response
    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name price imageUrl stock'
    });

    res.json(populatedCart);
  } catch (error) {
    console.error('Add to cart error:', error);
    if (!res.statusCode || res.statusCode === 200) {
      res.status(500);
    }
    throw error;
  }
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const item = cart.items.find(
    item => item._id.toString() === req.params.id
  );

  if (!item) {
    res.status(404);
    throw new Error('Item not found in cart');
  }

  // Validate stock
  const product = await Product.findById(item.product);
  if (product.stock < quantity) {
    res.status(400);
    throw new Error('Not enough stock');
  }

  item.quantity = quantity;
  cart.totalAmount = await calculateTotal(cart.items);
  
  await cart.save();
  
  const populatedCart = await Cart.findById(cart._id).populate('items.product');
  res.json(populatedCart);
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  cart.items = cart.items.filter(
    item => item._id.toString() !== req.params.id
  );
  
  cart.totalAmount = await calculateTotal(cart.items);
  
  await cart.save();
  
  const populatedCart = await Cart.findById(cart._id).populate('items.product');
  res.json(populatedCart);
});

// Helper function to calculate total
const calculateTotal = async (items) => {
  let total = 0;
  for (const item of items) {
    const product = await Product.findById(item.product);
    total += product.price * item.quantity;
  }
  return total;
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
};
