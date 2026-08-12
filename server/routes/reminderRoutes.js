// routes/reminderRoutes.js - Reminder API Routes
import express from 'express';
import { createReminder, getMyReminders, deleteReminder } from '../controllers/reminderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createReminder);
router.get('/my', protect, getMyReminders);
router.delete('/:id', protect, deleteReminder);

export default router;
