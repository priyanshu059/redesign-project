// models/Speaker.js - Speaker Model
import mongoose from 'mongoose';

const speakerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  // Short biography of the speaker
  bio: { type: String, default: '' },
  // Title of their session/talk
  sessionTitle: { type: String, default: '' },
  // When their session is scheduled (e.g. "Day 1 9:00")
  schedule: { type: String, default: '' },
  // Whether they are available to speak
  availability: { type: Boolean, default: true },
}, { timestamps: true });

const Speaker = mongoose.model('Speaker', speakerSchema);
export default Speaker;
