// ============================================================
// middleware/authMiddleware.js - JWT Authentication Middleware
// ============================================================
// This middleware checks if the user is logged in before
// allowing them to access protected routes.
// It looks for a JWT token in the request headers and verifies it.
// ============================================================

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// --- protect ---
// This function runs before any protected route handler.
// If the token is valid, it adds the user to req.user and moves on.
// If not, it sends a 401 Unauthorized error.
export const protect = async (req, res, next) => {
  let token;

  // JWT tokens are sent in the Authorization header as: "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token part (after "Bearer ")
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using our JWT_SECRET from .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user in the database (exclude password from result)
      req.user = await User.findById(decoded.id).select('-password');

      // Move to the next middleware/route handler
      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If no token was found in the header
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
