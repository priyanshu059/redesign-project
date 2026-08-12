// ============================================================
// services/geminiService.js - Google Gemini AI Integration
// ============================================================
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const askGemini = async (prompt) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: [
        {
          role: 'user',
          parts: [{ text: `You are EventOps AI, a helpful assistant for an event management platform. ${prompt}` }],
        },
      ],
    });
    return response.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini AI error:', error.message);
    throw new Error('AI service is currently unavailable. Please try again later.');
  }
};