// routes/assistantRoutes.js
import express from 'express';
import rateLimit from 'express-rate-limit';
import { askAssistant } from '../controllers/assistantController.js';
import { protect } from '../middleware/authMiddleware.js';

// ✅ Fixed: Rate limit AI endpoint to prevent Gemini API cost abuse
// Max 20 messages per minute per IP
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: { message: 'Too many AI requests, please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const router = express.Router();

router.post('/', protect, aiLimiter, askAssistant);

export default router;
