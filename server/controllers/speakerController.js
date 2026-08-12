// controllers/speakerController.js
import Speaker from '../models/Speaker.js';
export const getSpeakers = async (req, res) => { try { res.json(await Speaker.find()); } catch (e) { res.status(500).json({ message: e.message }); } };
export const getSpeakerById = async (req, res) => { try { const s = await Speaker.findById(req.params.id); if (!s) return res.status(404).json({ message: 'Not found' }); res.json(s); } catch (e) { res.status(500).json({ message: e.message }); } };
export const createSpeaker = async (req, res) => { try { res.status(201).json(await Speaker.create(req.body)); } catch (e) { res.status(500).json({ message: e.message }); } };
export const updateSpeaker = async (req, res) => { try { const s = await Speaker.findByIdAndUpdate(req.params.id, req.body, { new: true }); if (!s) return res.status(404).json({ message: 'Not found' }); res.json(s); } catch (e) { res.status(500).json({ message: e.message }); } };
export const deleteSpeaker = async (req, res) => { try { await Speaker.findByIdAndDelete(req.params.id); res.json({ message: 'Speaker deleted' }); } catch (e) { res.status(500).json({ message: e.message }); } };
