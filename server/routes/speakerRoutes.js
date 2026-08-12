// routes/speakerRoutes.js
import express from 'express';
import { getSpeakers, getSpeakerById, createSpeaker, updateSpeaker, deleteSpeaker } from '../controllers/speakerController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';
const router = express.Router();
router.get('/', protect, getSpeakers);
router.get('/:id', protect, getSpeakerById);
router.post('/', protect, adminOnly, createSpeaker);
router.put('/:id', protect, adminOnly, updateSpeaker);
router.delete('/:id', protect, adminOnly, deleteSpeaker);
export default router;
