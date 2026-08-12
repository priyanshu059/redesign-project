// ============================================================
// controllers/assistantController.js - AI Assistant (Gemini)
// ============================================================
import { askGemini } from '../services/geminiService.js';

// POST /api/assistant - Send a message to the AI assistant
export const askAssistant = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });

    // Call the Gemini AI service with the user's message
    const reply = await askGemini(message);
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
