// ============================================================
// controllers/dashboardController.js - Admin Dashboard Stats
// ============================================================
import User from '../models/User.js';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import Feedback from '../models/Feedback.js';
import Incident from '../models/Incident.js';

// GET /api/dashboard/stats - Returns summary counts for admin dashboard
export const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalEvents, totalRegistrations, totalFeedback, openIncidents] =
      await Promise.all([
        User.countDocuments({ role: 'user' }),
        Event.countDocuments(),
        Registration.countDocuments(),
        Feedback.countDocuments(),
        Incident.countDocuments({ status: 'Open' }),
      ]);

    // ✅ Fixed: Event.date is stored as a String ("2026-09-15"), so MongoDB $gte: new Date()
    // never matches (different BSON types). Fetch all and filter in JS instead.
    const allEvents = await Event.find()
      .sort({ date: 1 })
      .select('title date location status');
    const today = new Date().toISOString().split('T')[0]; // "2026-08-11"
    const upcomingEvents = allEvents.filter(e => e.date >= today).slice(0, 5);

    // Get recent registrations
    const recentRegistrations = await Registration.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .populate('event', 'title');

    res.json({
      stats: {
        totalUsers,
        totalEvents,
        totalRegistrations,
        totalFeedback,
        openIncidents,
      },
      upcomingEvents,
      recentRegistrations,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
