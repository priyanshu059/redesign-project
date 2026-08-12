// routes/registrationRoutes.js - Registration API Routes
import express from 'express';
import { registerForEvent, getMyRegistrations, getAllRegistrations, updateRegistration, deleteRegistration, checkinRegistration } from '../controllers/registrationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, registerForEvent);
router.get('/my', protect, getMyRegistrations);
router.get('/', protect, adminOnly, getAllRegistrations);
router.put('/:id', protect, updateRegistration);
router.delete('/:id', protect, deleteRegistration);
router.patch('/:id/checkin', protect, adminOnly, checkinRegistration);

export default router;
