// ============================================================
// middleware/roleMiddleware.js - Role-Based Access Control
// ============================================================
// This middleware checks if the logged-in user has the "admin" role.
// It must be used AFTER the protect middleware (which sets req.user).
// ============================================================

// --- adminOnly ---
// Only allows users with role === 'admin' to proceed.
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    // User is admin, allow them to continue
    next();
  } else {
    // User is not admin, reject with 403 Forbidden
    res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};
