const mongoose = require('mongoose');
const Product = require('../models/productModel');
const User = require('../models/userModel');
require('dotenv').config({ path: '../.env' });

const products = [
  // Electronics Category
  {
    name: "MacBook Pro M2",
    price: 1299.99,
    description: "Latest MacBook Pro with M2 chip, featuring incredible performance and battery life",
    category: "Electronics",
    countInStock: 10,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=800&h=600&fit=crop"
  },
  {
    name: "iPhone 14 Pro",
    price: 999.99,
    description: "Latest iPhone with dynamic island and pro camera system",
    category: "Electronics",
    countInStock: 15,
    image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&h=600&fit=crop"
  },
  {
    name: "Samsung 4K Smart TV",
    price: 799.99,
    description: "55-inch 4K Ultra HD Smart LED TV with HDR",
    category: "Electronics",
    countInStock: 8,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=600&fit=crop"
  },
  {
    name: "Sony WH-1000XM4",
    price: 349.99,
    description: "Premium noise-cancelling headphones with exceptional sound quality",
    category: "Electronics",
    countInStock: 12,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&h=600&fit=crop"
  },
  {
    name: "iPad Air",
    price: 599.99,
    description: "Powerful and versatile iPad Air with stunning Retina display",
    category: "Electronics",
    countInStock: 15,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=600&fit=crop"
  },

  // Fashion Category
  {
    name: "Nike Air Max 270",
    price: 149.99,
    description: "Stylish and comfortable sneakers with Air Max cushioning",
    category: "Fashion",
    countInStock: 15,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop"
  },
  {
    name: "Classic Denim Jacket",
    price: 59.99,
    description: "Timeless denim jacket, perfect for any casual outfit",
    category: "Fashion",
    countInStock: 25,
    image: "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=800&h=600&fit=crop"
  },
  {
    name: "Ray-Ban Sunglasses",
    price: 149.99,
    description: "Classic Ray-Ban Aviator sunglasses with UV protection",
    category: "Fashion",
    countInStock: 30,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=600&fit=crop"
  },
  {
    name: "Leather Crossbody Bag",
    price: 89.99,
    description: "Elegant leather crossbody bag for everyday use",
    category: "Fashion",
    countInStock: 20,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=600&fit=crop"
  },
  {
    name: "Designer Watch",
    price: 299.99,
    description: "Luxury analog watch with genuine leather strap",
    category: "Fashion",
    countInStock: 10,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=600&fit=crop"
  },

  // Home & Living
  {
    name: "Smart Home Hub",
    price: 129.99,
    description: "Control your entire home with this smart hub",
    category: "Home & Living",
    countInStock: 18,
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&h=600&fit=crop"
  },
  {
    name: "Coffee Maker",
    price: 79.99,
    description: "Premium coffee maker with built-in grinder",
    category: "Home & Living",
    countInStock: 22,
    image: "https://images.unsplash.com/photo-1517914309068-0db3b47715cc?w=800&h=600&fit=crop"
  },
  {
    name: "Robot Vacuum",
    price: 299.99,
    description: "Smart robot vacuum with mapping technology",
    category: "Home & Living",
    countInStock: 15,
    image: "https://images.unsplash.com/photo-1573396840111-ffc2f7a60f42?w=800&h=600&fit=crop"
  },
  {
    name: "Air Purifier",
    price: 199.99,
    description: "HEPA air purifier for cleaner indoor air",
    category: "Home & Living",
    countInStock: 20,
    image: "https://images.unsplash.com/photo-1626436629565-8a147b9636a9?w=800&h=600&fit=crop"
  },
  {
    name: "Standing Desk",
    price: 399.99,
    description: "Electric adjustable standing desk",
    category: "Home & Living",
    countInStock: 8,
    image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=800&h=600&fit=crop"
  },

  // Sports & Outdoors
  {
    name: "Mountain Bike",
    price: 799.99,
    description: "Professional mountain bike with 21 speeds",
    category: "Sports",
    countInStock: 5,
    image: "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800&h=600&fit=crop"
  },
  {
    name: "Yoga Mat",
    price: 29.99,
    description: "Non-slip yoga mat with carrying strap",
    category: "Sports",
    countInStock: 30,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&h=600&fit=crop"
  },
  {
    name: "Dumbbells Set",
    price: 149.99,
    description: "Adjustable dumbbells set with stand",
    category: "Sports",
    countInStock: 12,
    image: "https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=800&h=600&fit=crop"
  },
  {
    name: "Tennis Racket",
    price: 89.99,
    description: "Professional tennis racket with cover",
    category: "Sports",
    countInStock: 15,
    image: "https://images.unsplash.com/photo-1617083934555-5f2f550d1a5f?w=800&h=600&fit=crop"
  },
  {
    name: "Camping Tent",
    price: 199.99,
    description: "4-person waterproof camping tent",
    category: "Sports",
    countInStock: 10,
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop"
  },

  // Books & Stationery
  {
    name: "Kindle Paperwhite",
    price: 139.99,
    description: "E-reader with adjustable warm light",
    category: "Books",
    countInStock: 20,
    image: "https://images.unsplash.com/photo-1594497652558-40d66b035fba?w=800&h=600&fit=crop"
  },
  {
    name: "Premium Notebook",
    price: 24.99,
    description: "Leather-bound notebook with premium paper",
    category: "Books",
    countInStock: 35,
    image: "https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?w=800&h=600&fit=crop"
  },
  {
    name: "Art Set",
    price: 49.99,
    description: "Complete art set with carrying case",
    category: "Books",
    countInStock: 15,
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop"
  },
  {
    name: "Fountain Pen",
    price: 79.99,
    description: "Luxury fountain pen with ink cartridges",
    category: "Books",
    countInStock: 25,
    image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=800&h=600&fit=crop"
  }
];

const seedProducts = async () => {
  try {
    const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/kocart';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find admin user or create one
    let adminUser = await User.findOne({ email: 'admin@example.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin123',
        isAdmin: true
      });
      console.log('Admin user created');
    }

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Add user field to each product
    const productsWithUser = products.map(product => ({
      ...product,
      user: adminUser._id
    }));

    // Insert sample products
    await Product.insertMany(productsWithUser);
    console.log('Sample products added successfully');

    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
