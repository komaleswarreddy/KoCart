const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/userModel');
const connectDB = require('../config/db');

dotenv.config();

connectDB();

const makeUserAdmin = async () => {
  try {
    const email = 'komal@gmail.com';
    let user = await User.findOne({ email });

    if (!user) {
      // Create the user if it doesn't exist
      user = await User.create({
        name: 'Komal',
        email: 'komal@gmail.com',
        password: 'komal123', // Will be hashed by the pre-save middleware
        role: 'admin',
      });
      console.log('Created new admin user:', user.email);
    } else {
      // Update existing user to admin and password
      user.role = 'admin';
      user.password = 'komal123'; // Will be hashed by the pre-save middleware
      await user.save();
      console.log('Updated user to admin:', user.email);
    }

    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

makeUserAdmin();
