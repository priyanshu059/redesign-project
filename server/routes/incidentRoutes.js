// routes/incidentRoutes.js
import express from 'express';
import { getIncidents, getIncidentById, createIncident, updateIncident, deleteIncident } from '../controllers/incidentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', protect, adminOnly, getIncidents);
router.get('/:id', protect, adminOnly, getIncidentById);
router.post('/', protect, createIncident);
router.put('/:id', protect, adminOnly, updateIncident);
router.delete('/:id', protect, adminOnly, deleteIncident);

export default router;
