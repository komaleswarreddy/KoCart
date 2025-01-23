const mongoose = require('mongoose');
const Product = require('../models/productModel');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

const products = [
  // Electronics
  {
    name: 'iPhone 14 Pro Max',
    description: 'The latest iPhone with revolutionary camera system and A16 Bionic chip',
    price: 1099.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&q=80',
    countInStock: 15,
    rating: 4.8,
    numReviews: 245,
    discount: 5
  },
  {
    name: 'MacBook Pro M2',
    description: 'Supercharged by M2 Pro and M2 Max, MacBook Pro takes its power and efficiency further than ever',
    price: 2499.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    countInStock: 10,
    rating: 4.9,
    numReviews: 189,
    discount: 0
  },
  {
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise canceling wireless headphones with exceptional sound quality',
    price: 399.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80',
    countInStock: 25,
    rating: 4.7,
    numReviews: 432,
    discount: 15
  },
  {
    name: 'Samsung QLED 4K TV',
    description: '65-inch QLED 4K Smart TV with Quantum HDR',
    price: 1299.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=80',
    countInStock: 8,
    rating: 4.6,
    numReviews: 167,
    discount: 10
  },
  // Clothing
  {
    name: 'Premium Wool Overcoat',
    description: 'Luxurious wool blend coat perfect for winter, featuring a timeless design',
    price: 299.99,
    category: 'Clothing',
    imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80',
    countInStock: 20,
    rating: 4.5,
    numReviews: 156,
    discount: 10
  },
  {
    name: 'Designer Denim Jacket',
    description: 'Classic denim jacket with modern styling and premium quality',
    price: 129.99,
    category: 'Clothing',
    imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80',
    countInStock: 30,
    rating: 4.3,
    numReviews: 98,
    discount: 0
  },
  {
    name: 'Athletic Performance Shoes',
    description: 'High-performance running shoes with advanced cushioning technology',
    price: 159.99,
    category: 'Clothing',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    countInStock: 45,
    rating: 4.7,
    numReviews: 276,
    discount: 15
  },
  {
    name: 'Premium Cotton T-Shirt',
    description: 'Ultra-soft 100% organic cotton t-shirt with perfect fit',
    price: 34.99,
    category: 'Clothing',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    countInStock: 100,
    rating: 4.4,
    numReviews: 324,
    discount: 0
  },
  // Books
  {
    name: 'The Art of Programming',
    description: 'Comprehensive guide to modern programming practices and patterns',
    price: 59.99,
    category: 'Books',
    imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80',
    countInStock: 50,
    rating: 4.6,
    numReviews: 234,
    discount: 0
  },
  {
    name: 'Business Strategy Guide',
    description: 'Essential reading for business professionals and entrepreneurs',
    price: 45.99,
    category: 'Books',
    imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80',
    countInStock: 40,
    rating: 4.4,
    numReviews: 167,
    discount: 5
  },
  {
    name: 'Modern Web Development',
    description: 'Complete guide to modern web development technologies and practices',
    price: 49.99,
    category: 'Books',
    imageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&q=80',
    countInStock: 35,
    rating: 4.8,
    numReviews: 198,
    discount: 0
  },
  // Home & Kitchen
  {
    name: 'Smart Coffee Maker',
    description: 'WiFi-enabled coffee maker with mobile app control and scheduling',
    price: 199.99,
    category: 'Home & Kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1517914309068-0db3b7883b33?w=800&q=80',
    countInStock: 18,
    rating: 4.7,
    numReviews: 289,
    discount: 20
  },
  {
    name: 'Professional Chef Knife Set',
    description: 'Premium 8-piece knife set with wooden block, perfect for professional chefs',
    price: 249.99,
    category: 'Home & Kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1593618998160-c0d677c60425?w=800&q=80',
    countInStock: 15,
    rating: 4.8,
    numReviews: 178,
    discount: 0
  },
  {
    name: 'Stand Mixer Professional',
    description: '5.5-quart stand mixer with multiple attachments and powerful motor',
    price: 399.99,
    category: 'Home & Kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=800&q=80',
    countInStock: 12,
    rating: 4.9,
    numReviews: 145,
    discount: 10
  },
  // Sports
  {
    name: 'Premium Yoga Mat',
    description: 'Extra thick eco-friendly yoga mat with carrying strap',
    price: 79.99,
    category: 'Sports',
    imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf1b1f?w=800&q=80',
    countInStock: 35,
    rating: 4.6,
    numReviews: 245,
    discount: 15
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracker with heart rate monitoring and GPS',
    price: 199.99,
    category: 'Sports',
    imageUrl: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80',
    countInStock: 22,
    rating: 4.5,
    numReviews: 312,
    discount: 10
  },
  {
    name: 'Home Gym Set',
    description: 'Complete home gym set with adjustable weights and bench',
    price: 799.99,
    category: 'Sports',
    imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80',
    countInStock: 8,
    rating: 4.7,
    numReviews: 89,
    discount: 5
  }
];

const seedProducts = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Product.deleteMany();
    console.log('Deleted existing products');

    // Create an admin user for the products
    const adminUserId = '65a85e500000000000000000'; // Replace with your admin user ID
    const productsWithUser = products.map(product => ({
      ...product,
      user: adminUserId
    }));

    await Product.insertMany(productsWithUser);
    console.log('Products seeded successfully');

    mongoose.disconnect();
    process.exit();
  } catch (error) {
    console.error('Error seeding products:', error.message);
    process.exit(1);
  }
};

seedProducts();
