// routes/contactRoutes.js - Contact Form Routes
import express from 'express';
import { submitContact } from '../controllers/contactController.js';

const router = express.Router();

// Public route — anyone (including non-logged-in visitors) can send a message
router.post('/', submitContact);

export default router;
