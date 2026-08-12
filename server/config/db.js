// ============================================================
// config/db.js - MongoDB Database Connection
// ============================================================
// This file connects our Express app to MongoDB using Mongoose.
// Mongoose is a library that makes it easy to work with MongoDB
// using JavaScript objects (called "models" or "schemas").
//
// We call this function once when the server starts.
// ============================================================

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Try to connect using the URI from our .env file
    // family: 4 → forces Node.js to use IPv4 (fixes Windows DNS SRV issue)
    // serverSelectionTimeoutMS → wait 10s before giving up
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      family: 4,
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If connection fails, print the error and stop the server
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1); // Exit the process with failure code
  }
};

export default connectDB;
