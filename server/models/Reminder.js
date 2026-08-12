// ============================================================
// models/Reminder.js - Reminder Database Schema
// ============================================================
import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  reminderTime: { type: Date, required: true }, // When to send the reminder
  message: { type: String, default: '' },
  sent: { type: Boolean, default: false }, // Has this reminder been sent yet?
}, { timestamps: true });

const Reminder = mongoose.model('Reminder', reminderSchema);
export default Reminder;
