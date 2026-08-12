// ============================================================
// controllers/sponsorshipController.js - Sponsorship CRUD
// ============================================================
import Sponsorship from '../models/Sponsorship.js';

export const getSponsorships = async (req, res) => {
  try {
    const sponsorships = await Sponsorship.find().populate('event', 'title date');
    res.json(sponsorships);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const getSponsorshipById = async (req, res) => {
  try {
    const s = await Sponsorship.findById(req.params.id).populate('event', 'title');
    if (!s) return res.status(404).json({ message: 'Sponsorship not found' });
    res.json(s);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const createSponsorship = async (req, res) => {
  try {
    const s = await Sponsorship.create(req.body);
    res.status(201).json(s);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const updateSponsorship = async (req, res) => {
  try {
    const s = await Sponsorship.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!s) return res.status(404).json({ message: 'Sponsorship not found' });
    res.json(s);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const deleteSponsorship = async (req, res) => {
  try {
    await Sponsorship.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sponsorship deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
