const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

// Image optimization function
const optimizeAndSaveImage = async (file) => {
  if (!file) return null;

  const filename = `${Date.now()}-${path.parse(file.originalname).name}.webp`;
  const uploadPath = path.join(__dirname, '../uploads', filename);

  await sharp(file.buffer)
    .resize(800, 800, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 80 })
    .toFile(uploadPath);

  return `/uploads/${filename}`;
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const { categories, minPrice, maxPrice, sortBy, search } = req.query;
  let query = {};

  // Filter by categories
  if (categories) {
    query.category = { $in: categories.split(',') };
  }

  // Filter by price range
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Search by name or description
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  // Sorting
  let sortOptions = {};
  if (sortBy) {
    switch (sortBy) {
      case 'price_asc':
        sortOptions.price = 1;
        break;
      case 'price_desc':
        sortOptions.price = -1;
        break;
      case 'rating':
        sortOptions.rating = -1;
        break;
      default:
        sortOptions.createdAt = -1;
    }
  }

  const products = await Product.find(query).sort(sortOptions);
  res.json(products);
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, category, countInStock } = req.body;

  if (!name || !price || !description || !category) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }

  try {
    let imageUrl = null;
    if (req.file) {
      imageUrl = await optimizeAndSaveImage(req.file);
    }

    const product = await Product.create({
      name,
      price: Number(price),
      description,
      category,
      countInStock: Number(countInStock) || 0,
      imageUrl: imageUrl || '',
      user: req.user._id,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500);
    throw new Error('Failed to create product. Please try again.');
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  try {
    let imageUrl = product.imageUrl;
    if (req.file) {
      // Delete old image if it exists
      if (product.imageUrl) {
        const oldImagePath = path.join(__dirname, '..', product.imageUrl);
        try {
          await fs.unlink(oldImagePath);
        } catch (err) {
          console.error('Error deleting old image:', err);
        }
      }
      imageUrl = await optimizeAndSaveImage(req.file);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name || product.name,
        price: Number(req.body.price) || product.price,
        description: req.body.description || product.description,
        category: req.body.category || product.category,
        countInStock: Number(req.body.countInStock) ?? product.countInStock,
        imageUrl: imageUrl || product.imageUrl,
      },
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500);
    throw new Error('Failed to update product. Please try again.');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Delete product image if it exists and is not the default image
  if (product.imageUrl && !product.imageUrl.includes('default')) {
    const imagePath = path.join(__dirname, '..', product.imageUrl);
    try {
      await fs.unlink(imagePath);
    } catch (error) {
      console.error('Error deleting product image:', error);
    }
  }

  await product.deleteOne();
  res.json({ message: 'Product removed' });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
