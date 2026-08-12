// ============================================================
// controllers/feedbackController.js - Feedback CRUD
// ============================================================
import Feedback from '../models/Feedback.js';
import Registration from '../models/Registration.js';

// GET /api/feedback/my - Get current user's own feedback
export const getMyFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ user: req.user._id })
      .populate('event', 'title date location');
    res.json(feedback);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// PUT /api/feedback/:id - Update own feedback
export const updateFeedback = async (req, res) => {
  try {
    const fb = await Feedback.findById(req.params.id);
    if (!fb) return res.status(404).json({ message: 'Feedback not found' });
    // Ensure only owner can update (or admin)
    if (fb.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorised' });
    }

    // ✅ Fixed: explicit allow-list prevents users from reassigning event/user via req.body
    const allowedUpdates = {};
    if (req.body.rating !== undefined) allowedUpdates.rating = req.body.rating;
    if (req.body.comment !== undefined) allowedUpdates.comment = req.body.comment;

    const updated = await Feedback.findByIdAndUpdate(
      req.params.id,
      allowedUpdates,
      { new: true, runValidators: true }  // ✅ Fixed: runValidators catches invalid enum values
    );
    res.json(updated);
  } catch (error) {
    if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
    res.status(500).json({ message: error.message });
  }
};

export const getFeedbackForEvent = async (req, res) => {
  try {
    const feedback = await Feedback.find({ event: req.params.eventId })
      .populate('user', 'name');
    res.json(feedback);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate('event', 'title')
      .populate('user', 'name email');
    res.json(feedback);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const createFeedback = async (req, res) => {
  try {
    const eventId = req.body.eventId || req.body.event;
    if (!eventId) return res.status(400).json({ message: 'eventId is required' });

    // ✅ Fixed: check user has a valid registration before allowing feedback
    const registration = await Registration.findOne({
      event: eventId,
      user: req.user._id,
      status: 'registered',
    });
    if (!registration) {
      return res.status(403).json({ message: 'You must be registered for this event to leave feedback' });
    }

    // Check if user already submitted feedback for this event
    const existing = await Feedback.findOne({ event: eventId, user: req.user._id });
    if (existing) return res.status(400).json({ message: 'You already submitted feedback for this event' });

    // ✅ Fixed: explicit allow-list — user cannot inject arbitrary fields
    const feedback = await Feedback.create({
      event: eventId,
      user: req.user._id,
      rating: req.body.rating,
      comment: req.body.comment,
    });
    res.status(201).json(feedback);
  } catch (error) {
    if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
    res.status(500).json({ message: error.message });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: 'Feedback deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
