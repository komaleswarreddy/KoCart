const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

// Image optimization function
const optimizeAndSaveImage = async (file) => {
  if (!file) return null;

  try {
    // Generate a unique filename
    const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    const uploadDir = path.join(__dirname, '..', 'uploads');
    const uploadPath = path.join(uploadDir, filename);

    // Create uploads directory if it doesn't exist
    await fs.mkdir(uploadDir, { recursive: true });

    // Optimize and save image
    await sharp(file.buffer)
      .resize(800, 800, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .webp({ quality: 85 })
      .toFile(uploadPath);

    return `/uploads/${filename}`;
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error('Failed to process image');
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const { search, category, sortBy } = req.query;
  let query = {};

  // Search filter
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  // Category filter
  if (category) {
    query.category = category;
  }

  // Get products
  let products = await Product.find(query).populate('user', 'name email');

  // Sorting
  if (sortBy) {
    switch (sortBy) {
      case 'price_asc':
        products = products.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        products = products.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        products = products.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
  }

  // Format products to include absolute image URLs
  const formattedProducts = products.map(product => {
    const productObj = product.toObject();
    if (productObj.image && !productObj.image.startsWith('http')) {
      productObj.image = `http://localhost:5000${productObj.image.startsWith('/') ? '' : '/'}${productObj.image}`;
    }
    return productObj;
  });

  res.json(formattedProducts);
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (product) {
    const productObj = product.toObject();
    if (productObj.image && !productObj.image.startsWith('http')) {
      productObj.image = `http://localhost:5000${productObj.image.startsWith('/') ? '' : '/'}${productObj.image}`;
    }
    res.json(productObj);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, category, countInStock } = req.body;

  const product = new Product({
    name,
    price,
    user: req.user._id,
    image: image || '/placeholder.png',
    category,
    countInStock,
    description,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, category, countInStock } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.image = image || product.image;
    product.category = category || product.category;
    product.countInStock = countInStock || product.countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Delete product image if it exists and is not the default image
    if (product.image && !product.image.includes('placeholder')) {
      try {
        const imagePath = path.join(__dirname, '..', product.image);
        await fs.access(imagePath); // Check if file exists
        await fs.unlink(imagePath);
      } catch (error) {
        console.error('Error deleting product image:', error);
        // Continue even if image deletion fails
      }
    }

    await product.deleteOne();
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(error.kind === 'ObjectId' ? 404 : 500);
    throw new Error(error.message || 'Failed to delete product');
  }
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
