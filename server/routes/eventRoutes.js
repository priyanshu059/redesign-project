// routes/eventRoutes.js - Event API Routes
import express from 'express';
import { getEvents, getEventById, createEvent, updateEvent, deleteEvent } from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', getEvents);                               // Public - browse events
router.get('/:id', getEventById);                         // Public - view event
router.post('/', protect, adminOnly, createEvent);        // Admin only
router.put('/:id', protect, adminOnly, updateEvent);      // Admin only
router.delete('/:id', protect, adminOnly, deleteEvent);   // Admin only

export default router;
