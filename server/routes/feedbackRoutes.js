// routes/feedbackRoutes.js
import express from 'express';
import { getFeedbackForEvent, getMyFeedback, getAllFeedback, createFeedback, updateFeedback, deleteFeedback } from '../controllers/feedbackController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', protect, adminOnly, getAllFeedback);
router.get('/my', protect, getMyFeedback);
router.get('/event/:eventId', getFeedbackForEvent);
router.post('/', protect, createFeedback);
router.put('/:id', protect, updateFeedback);
router.delete('/:id', protect, adminOnly, deleteFeedback);

export default router;

