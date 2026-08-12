// ============================================================
// controllers/notificationController.js - Notifications CRUD
// ============================================================
import Notification from '../models/Notification.js';

export const getMyNotifications = async (req, res) => {
  try {
    // ✅ Fix 9: query both 'user' and legacy 'userId' fields so older notifications still appear
    const notifications = await Notification.find({
      $or: [{ user: req.user._id }, { userId: req.user._id }]
    }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

export const createNotification = async (req, res) => {
  try {
    const notif = await Notification.create(req.body);
    res.status(201).json(notif);
  } catch (error) {
    if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
    res.status(500).json({ message: 'Server error' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notif = await Notification.findById(req.params.id);
    if (!notif) return res.status(404).json({ message: 'Notification not found' });

    // ✅ Fix 9: check ownership against both 'user' and legacy 'userId' fields
    const ownerId = notif.user?.toString() || notif.userId?.toString();
    const isOwner = ownerId === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorised to update this notification' });
    }

    // ✅ Fix 9: update both isRead and the legacy 'read' field together
    notif.isRead = true;
    notif.read = true;
    await notif.save();
    res.json(notif);
  } catch (error) {
    if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid notification ID' });
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid notification ID' });
    res.status(500).json({ message: 'Server error' });
  }
};
