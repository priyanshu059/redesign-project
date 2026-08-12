// routes/venueRoutes.js
import express from 'express';
import { getVenues, getVenueById, createVenue, updateVenue, deleteVenue } from '../controllers/venueController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';
const router = express.Router();
router.get('/', protect, getVenues);
router.get('/:id', protect, getVenueById);
router.post('/', protect, adminOnly, createVenue);
router.put('/:id', protect, adminOnly, updateVenue);
router.delete('/:id', protect, adminOnly, deleteVenue);
export default router;
