// models/Notification.js - Notification Model
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  // Which user this notification is for
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  // Legacy field alias (kept for compatibility)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  // Short title for the notification
  title: { type: String, default: '' },
  // Main body of the notification message
  message: { type: String, default: '' },
  // How it was delivered
  channel: {
    type: String,
    enum: ['email', 'sms', 'push', 'in-app'],
    default: 'in-app',
  },
  // Has the user read this notification?
  isRead: { type: Boolean, default: false },
  // Legacy read field (kept for compatibility)
  read: { type: Boolean, default: false },
  // Recipient email/phone for external channels
  recipient: { type: String, default: '' },
  sentAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
