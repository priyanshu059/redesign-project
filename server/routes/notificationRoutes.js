// routes/notificationRoutes.js
import express from 'express';
import { getMyNotifications, getAllNotifications, createNotification, markAsRead, deleteNotification } from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';
const router = express.Router();
router.get('/', protect, adminOnly, getAllNotifications);
router.get('/my', protect, getMyNotifications);
router.post('/', protect, adminOnly, createNotification);
router.put('/:id/read', protect, markAsRead);
router.delete('/:id', protect, adminOnly, deleteNotification);
export default router;

