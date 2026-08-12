// ============================================================
// controllers/contactController.js - Contact Form Submission
// ============================================================
import mongoose from 'mongoose';

// Inline schema — simple, no need for a separate model file
const contactSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  email:   { type: String, required: true, trim: true },
  subject: { type: String, default: '' },
  message: { type: String, required: true },
}, { timestamps: true });

const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

// POST /api/contact - Save a contact form message
export const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    const submission = await Contact.create({
      name: name.trim(),
      email: email.trim(),
      subject: req.body.subject?.trim() || '',
      message: message.trim(),
    });

    res.status(201).json({ message: 'Message received! We\'ll get back to you within 24 hours.', id: submission._id });
  } catch (error) {
    if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
    res.status(500).json({ message: 'Server error submitting message' });
  }
};
