// ============================================================
// models/Venue.js - Venue Database Schema
// ============================================================
import mongoose from 'mongoose';

const venueSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  capacity: { type: Number, required: true },
  facilities: { type: String, default: '' }, // e.g. "WiFi, Projector, Stage"
  contactPerson: { type: String, default: '' },
  contactPhone: { type: String, default: '' },
  description: { type: String, default: '' },
}, { timestamps: true });

const Venue = mongoose.model('Venue', venueSchema);
export default Venue;
