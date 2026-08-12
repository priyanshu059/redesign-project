// ============================================================
// controllers/venueController.js - Venue CRUD Operations
// ============================================================
import Venue from '../models/Venue.js';

export const getVenues = async (req, res) => {
  try {
    const venues = await Venue.find().sort({ name: 1 });
    res.json(venues);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const getVenueById = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) return res.status(404).json({ message: 'Venue not found' });
    res.json(venue);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const createVenue = async (req, res) => {
  try {
    const venue = await Venue.create(req.body);
    res.status(201).json(venue);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const updateVenue = async (req, res) => {
  try {
    const venue = await Venue.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!venue) return res.status(404).json({ message: 'Venue not found' });
    res.json(venue);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const deleteVenue = async (req, res) => {
  try {
    await Venue.findByIdAndDelete(req.params.id);
    res.json({ message: 'Venue deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
