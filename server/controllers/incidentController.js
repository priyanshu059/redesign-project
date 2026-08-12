// ============================================================
// controllers/incidentController.js - Incident Report CRUD
// ============================================================
import Incident from '../models/Incident.js';

export const getIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find()
      .populate('event', 'title')
      .populate('reportedBy', 'name email');
    res.json(incidents);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const getIncidentById = async (req, res) => {
  try {
    const inc = await Incident.findById(req.params.id)
      .populate('event', 'title')
      .populate('reportedBy', 'name email');
    if (!inc) return res.status(404).json({ message: 'Incident not found' });
    res.json(inc);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const createIncident = async (req, res) => {
  try {
    const inc = await Incident.create({ ...req.body, reportedBy: req.user._id });
    res.status(201).json(inc);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const updateIncident = async (req, res) => {
  try {
    const inc = await Incident.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!inc) return res.status(404).json({ message: 'Incident not found' });
    res.json(inc);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const deleteIncident = async (req, res) => {
  try {
    await Incident.findByIdAndDelete(req.params.id);
    res.json({ message: 'Incident deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
