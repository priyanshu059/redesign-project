// ============================================================
// models/Event.js - Event Model
// ============================================================
import mongoose from 'mongoose';
import Registration from './Registration.js';
import Feedback from './Feedback.js';
import Reminder from './Reminder.js';
import Incident from './Incident.js';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
  },

  description: {
    type: String,
    default: '',
  },

  date: {
    type: String,
    default: '',
  },

  time: {
    type: String,
    default: '',
  },

  location: {
    type: String,
    default: '',
  },

  // ✅ Fix 6: added min:0 — negative capacity is now rejected by Mongoose validation
  capacity: {
    type: Number,
    default: 100,
    min: [0, 'Capacity cannot be negative'],
  },

  category: {
    type: String,
    default: '',
  },

  // ✅ Fix 6: added min:0 — negative price is now rejected by Mongoose validation
  price: {
    type: Number,
    default: 0,
    min: [0, 'Price cannot be negative'],
  },

  venue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue',
    default: null,
  },

  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming',
  },

}, {
  timestamps: true,
});

// ✅ Fix 7: Cascade delete — when an event is deleted, remove all related documents.
// This prevents orphaned registrations, feedback, reminders, and incidents pointing at non-existent events.
eventSchema.pre('findOneAndDelete', async function (next) {
  try {
    const eventId = this.getQuery()['_id'];
    if (eventId) {
      await Promise.all([
        Registration.deleteMany({ event: eventId }),
        Feedback.deleteMany({ event: eventId }),
        Reminder.deleteMany({ event: eventId }),
        Incident.deleteMany({ event: eventId }),
      ]);
    }
    next();
  } catch (err) {
    next(err);
  }
});

const Event = mongoose.model('Event', eventSchema);
export default Event;
