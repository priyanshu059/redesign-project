// ============================================================
// models/User.js - User Database Schema
// ============================================================
// This defines what a "User" looks like in our MongoDB database.
// Mongoose uses this schema to create, read, update, delete users.
// ============================================================

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Full name of the user
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },

  // Email must be unique (no two users can have the same email)
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },

  // Hashed password (we never store plain text passwords!)
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },

  // Role: either 'user' (regular) or 'admin'
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },

  // Optional profile info
  phone: { type: String, default: '' },
  organization: { type: String, default: '' },
  bio: { type: String, default: '' },

}, { timestamps: true }); // timestamps adds createdAt and updatedAt automatically

// --- Pre-save hook ---
// Before saving a user to the database, hash their password.
// This runs automatically whenever a user is created or password is changed.
userSchema.pre('save', async function (next) {
  // Only hash if password was actually modified
  if (!this.isModified('password')) return next();

  // bcrypt.hash(password, saltRounds) - saltRounds=10 is a good balance of security/speed
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// --- Method: matchPassword ---
// Call this to compare a plain-text password to the hashed one in the DB.
// Returns true if they match, false if not.
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
