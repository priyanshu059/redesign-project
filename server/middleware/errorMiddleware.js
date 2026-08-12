// middleware/errorMiddleware.js - Global Error Handler
// This catches any unhandled errors in the app and returns a clean JSON response
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // ❌ Print the error to the terminal so it's visible during development
  console.error(`❌ [${req.method}] ${req.originalUrl} → ${statusCode}: ${err.message}`);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    message: err.message,
    // Only show error stack trace in development (not in production)
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
