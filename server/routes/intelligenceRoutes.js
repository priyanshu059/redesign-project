// routes/intelligenceRoutes.js
import express from 'express';
import { getIntelligence } from '../controllers/intelligenceController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', protect, adminOnly, getIntelligence);

export default router;
