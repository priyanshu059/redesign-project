// ============================================================
// models/Registration.js - Registration Model
// ============================================================
import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  // Reference to the User who registered
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Reference to the Event they registered for
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },

  // Type of ticket
  ticketType: {
    type: String,
    enum: ['Standard', 'VIP', 'Speaker', 'Press'],
    default: 'Standard',
  },

  // Status of registration
  status: {
    type: String,
    enum: ['registered', 'cancelled'],
    default: 'registered',
  },

  // Whether the user has physically checked in at the event
  checkedIn: {
    type: Boolean,
    default: false,
  },

  // When they registered
  registeredAt: {
    type: Date,
    default: Date.now,
  },

}, {
  timestamps: true,
});

// ✅ Fix 4: Compound unique index prevents race-condition duplicate registrations at the DB level.
// Even if two requests pass the application-layer check simultaneously, MongoDB will reject the second.
registrationSchema.index({ user: 1, event: 1 }, { unique: true });

const Registration = mongoose.model('Registration', registrationSchema);
export default Registration;
