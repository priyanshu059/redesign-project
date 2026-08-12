// ============================================================
// controllers/eventController.js - Event CRUD Operations
// ============================================================
import Event from '../models/Event.js';

// GET /api/events - Get all events (public)
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('venue', 'name city').sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/events/:id - Get single event by ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('venue', 'name city address');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/events - Create a new event (admin only)
export const createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    // ✅ Fixed: return 400 for validation errors (e.g. invalid status enum)
    if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/events/:id - Update an event (admin only)
export const updateEvent = async (req, res) => {
  try {
    // ✅ Fixed: runValidators ensures enum/type validation runs on update too
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/events/:id - Delete an event (admin only)
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
