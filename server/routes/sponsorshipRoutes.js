// routes/sponsorshipRoutes.js
import express from 'express';
import { getSponsorships, getSponsorshipById, createSponsorship, updateSponsorship, deleteSponsorship } from '../controllers/sponsorshipController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', protect, adminOnly, getSponsorships);
router.get('/:id', protect, adminOnly, getSponsorshipById);
router.post('/', protect, adminOnly, createSponsorship);
router.put('/:id', protect, adminOnly, updateSponsorship);
router.delete('/:id', protect, adminOnly, deleteSponsorship);

export default router;
