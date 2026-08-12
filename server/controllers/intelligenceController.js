// ============================================================
// controllers/intelligenceController.js - AI Event Intelligence
// ============================================================
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import Feedback from '../models/Feedback.js';
import { askGemini } from '../services/geminiService.js';

// GET /api/intelligence - Generate AI insights for admin
export const getIntelligence = async (req, res) => {
  try {
    const [events, registrations, feedback] = await Promise.all([
      Event.find().select('title date status'),
      Registration.countDocuments(),
      Feedback.find().select('rating comment'),
    ]);

    // Build a summary to send to Gemini
    const avgRating = feedback.length
      ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
      : 'N/A';

    const prompt = `
      You are an event management AI assistant. Here is the current platform data:
      - Total Events: ${events.length}
      - Total Registrations: ${registrations}
      - Average Feedback Rating: ${avgRating}/5
      - Upcoming Events: ${events.filter(e => new Date(e.date) >= new Date()).length}
      
      Please provide:
      1. A brief overall health assessment of the platform (2-3 sentences)
      2. 3 actionable recommendations to improve engagement
      3. One positive highlight
      
      Keep it concise and professional.
    `;

    const insights = await askGemini(prompt);
    res.json({ insights, stats: { totalEvents: events.length, totalRegistrations: registrations, avgRating } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
