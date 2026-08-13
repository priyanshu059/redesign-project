// ============================================================
// controllers/intelligenceController.js - AI Event Intelligence
// ============================================================
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import Feedback from '../models/Feedback.js';
import Incident from '../models/Incident.js';
import Sponsorship from '../models/Sponsorship.js';
import { askGemini } from '../services/geminiService.js';

// GET /api/intelligence - Generate AI insights for admin
export const getIntelligence = async (req, res) => {
  try {
    const [events, registrations, feedback, incidents, sponsorships] = await Promise.all([
      Event.find().select('title date status capacity'),
      Registration.find().select('event'),
      Feedback.find().select('rating comment'),
      Incident.find().select('severity status'),
      Sponsorship.find().select('amount sponsorName'),
    ]);

    const totalRegistrations = registrations.length;

    // Build a summary to send to Gemini
    const avgRating = feedback.length
      ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
      : 'N/A';

    // --- Chart Data ---
    // 1. Per-event registration bar chart
    const regCountByEvent = {};
    for (const reg of registrations) {
      const eid = reg.event?.toString();
      if (eid) regCountByEvent[eid] = (regCountByEvent[eid] || 0) + 1;
    }
    const eventBarData = events.map(e => ({
      name: e.title.length > 18 ? e.title.slice(0, 18) + '…' : e.title,
      registrations: regCountByEvent[e._id.toString()] || 0,
      capacity: e.capacity || 0,
    }));

    // 2. Incident severity donut
    const incidentSeverity = { Low: 0, Medium: 0, High: 0, Critical: 0 };
    for (const inc of incidents) incidentSeverity[inc.severity] = (incidentSeverity[inc.severity] || 0) + 1;
    const incidentDonut = Object.entries(incidentSeverity)
      .filter(([, v]) => v > 0)
      .map(([label, value]) => ({ label, value }));

    // 3. Total sponsorship money
    const totalSponsorAmount = sponsorships.reduce((sum, s) => sum + (s.amount || 0), 0);

    const prompt = `
      You are an event management AI assistant. Here is the current platform data:
      - Total Events: ${events.length}
      - Total Registrations: ${totalRegistrations}
      - Average Feedback Rating: ${avgRating}/5
      - Upcoming Events: ${events.filter(e => new Date(e.date) >= new Date()).length}
      - Open Incidents: ${incidents.filter(i => i.status === 'Open').length}
      - Total Sponsorship Value: $${totalSponsorAmount.toLocaleString()}
      
      Please provide:
      1. A brief overall health assessment of the platform (2-3 sentences)
      2. 3 actionable recommendations to improve engagement
      3. One positive highlight
      
      Keep it concise and professional.
    `;

    const insights = await askGemini(prompt);
    res.json({
      insights,
      stats: {
        totalEvents: events.length,
        totalRegistrations,
        avgRating,
        totalSponsorAmount,
        openIncidents: incidents.filter(i => i.status === 'Open').length,
      },
      chartData: {
        eventBarData,
        incidentDonut,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
