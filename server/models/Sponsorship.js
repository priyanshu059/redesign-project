// ============================================================
// models/Sponsorship.js - Sponsorship Database Schema
// ============================================================
import mongoose from 'mongoose';

const sponsorshipSchema = new mongoose.Schema({
  // Which event this sponsorship is for
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  sponsorName: { type: String, required: true },
  sponsorType: {
    type: String,
    enum: ['Gold', 'Silver', 'Bronze', 'Platinum', 'Other'],
    default: 'Other',
  },
  amount: { type: Number, required: true },
  contactEmail: { type: String, default: '' },
  contactPhone: { type: String, default: '' },
  description: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Pending',
  },
}, { timestamps: true });

const Sponsorship = mongoose.model('Sponsorship', sponsorshipSchema);
export default Sponsorship;
