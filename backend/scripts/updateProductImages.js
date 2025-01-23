const mongoose = require('mongoose');
const Product = require('../models/productModel');
require('dotenv').config({ path: '../.env' });

const productImages = {
  'MacBook Pro M2': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=800&h=600&fit=crop',
  'Nike Air Max 270': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop',
  'Samsung 4K Smart TV': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=600&fit=crop',
  'Leather Messenger Bag': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop',
  'Sony WH-1000XM4': 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&h=600&fit=crop',
  'Classic Denim Jacket': 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=800&h=600&fit=crop',
  'iPad Air': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=600&fit=crop',
  'Ray-Ban Sunglasses': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=600&fit=crop',
  'Gaming Mouse': 'https://images.unsplash.com/photo-1623820919239-0d0ff10797a1?w=800&h=600&fit=crop',
  'Smart Watch': 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&h=600&fit=crop'
};

const updateProductImages = async () => {
  try {
    const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/kocart';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const products = await Product.find({});
    
    for (const product of products) {
      if (productImages[product.name]) {
        product.image = productImages[product.name];
        await product.save();
        console.log(`Updated image for ${product.name}`);
      }
    }

    console.log('All product images updated successfully');
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error updating product images:', error);
    process.exit(1);
  }
};

updateProductImages();
