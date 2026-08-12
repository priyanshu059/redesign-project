// ============================================================
// controllers/registrationController.js - Event Registration Logic
// ============================================================
import Registration from '../models/Registration.js';
import Event from '../models/Event.js';

// ✅ Fix 10: Central error handler — avoids leaking raw DB errors
const handleError = (res, error) => {
  if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid ID format' });
  if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
  if (error.code === 11000) return res.status(400).json({ message: 'Already registered for this event' });
  return res.status(500).json({ message: 'Server error' });
};

// POST /api/registrations - Register current user for an event
export const registerForEvent = async (req, res) => {
  try {
    const { eventId, ticketType } = req.body;

    // Check if already registered (application-level, DB unique index is the real guard)
    const existing = await Registration.findOne({ event: eventId, user: req.user._id });
    if (existing) return res.status(400).json({ message: 'Already registered for this event' });

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // ✅ Fix 3 / Fix 5: Reject registrations for non-upcoming events
    if (event.status === 'cancelled') {
      return res.status(400).json({ message: 'This event has been cancelled' });
    }
    if (event.status === 'completed') {
      return res.status(400).json({ message: 'This event has already ended' });
    }

    // Capacity enforcement
    const registrationCount = await Registration.countDocuments({ event: eventId, status: 'registered' });
    if (event.capacity && registrationCount >= event.capacity) {
      return res.status(400).json({ message: 'This event is fully booked' });
    }

    const registration = await Registration.create({
      event: eventId,
      user: req.user._id,
      ticketType: ticketType || 'Standard',
    });

    res.status(201).json(registration);
  } catch (error) {
    handleError(res, error);  // catches duplicate key (11000) from the unique index
  }
};

// GET /api/registrations/my - Get current user's registrations
export const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate('event', 'title date location status');
    res.json(registrations);
  } catch (error) {
    handleError(res, error);
  }
};

// GET /api/registrations - Get all registrations (admin only)
export const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate('event', 'title date')
      .populate('user', 'name email');
    res.json(registrations);
  } catch (error) {
    handleError(res, error);
  }
};

// PUT /api/registrations/:id - Update registration (owner or admin only)
export const updateRegistration = async (req, res) => {
  try {
    const reg = await Registration.findById(req.params.id);
    if (!reg) return res.status(404).json({ message: 'Registration not found' });

    // Ownership check
    const isOwner = reg.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this registration' });
    }

    // ✅ Fix 3: Strict allow-list — owners can ONLY change ticketType.
    // Admins can also change status. Nobody can change event, user, or checkedIn via this route.
    const allowedUpdate = {};
    if (req.body.ticketType !== undefined) allowedUpdate.ticketType = req.body.ticketType;
    if (isAdmin && req.body.status !== undefined) allowedUpdate.status = req.body.status;

    const updated = await Registration.findByIdAndUpdate(
      req.params.id,
      allowedUpdate,
      { new: true, runValidators: true }
    );
    res.json(updated);
  } catch (error) {
    handleError(res, error);
  }
};

// DELETE /api/registrations/:id - Cancel/delete registration (owner or admin only)
export const deleteRegistration = async (req, res) => {
  try {
    const reg = await Registration.findById(req.params.id);
    if (!reg) return res.status(404).json({ message: 'Registration not found' });

    const isOwner = reg.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to cancel this registration' });
    }

    await Registration.findByIdAndDelete(req.params.id);
    res.json({ message: 'Registration cancelled' });
  } catch (error) {
    handleError(res, error);
  }
};

// PATCH /api/registrations/:id/checkin - Toggle check-in status (admin only)
export const checkinRegistration = async (req, res) => {
  try {
    const reg = await Registration.findById(req.params.id);
    if (!reg) return res.status(404).json({ message: 'Registration not found' });
    reg.checkedIn = !reg.checkedIn;
    await reg.save();
    res.json(reg);
  } catch (error) {
    handleError(res, error);
  }
};
