// ============================================================
// models/Incident.js - Incident Report Database Schema
// ============================================================
import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Low',
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open',
  },
  resolution: { type: String, default: '' },
}, { timestamps: true });

const Incident = mongoose.model('Incident', incidentSchema);
export default Incident;
