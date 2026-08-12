// src/pages/admin/AdminEventForm.jsx — Add / Edit Event form
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import Sidebar from '../../components/admin/Sidebar';
import Spinner from '../../components/common/Spinner';

const STATUS_OPTIONS = ['upcoming', 'ongoing', 'completed', 'cancelled'];
const STATUS_ICONS = { upcoming: '🔵', ongoing: '🟢', completed: '⚪', cancelled: '🔴' };

const EMPTY = { title: '', description: '', date: '', time: '', location: '', capacity: 100, status: 'upcoming' };

const AdminEventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/events/${id}`)
      .then(({ data }) => setForm({
        title: data.title || '',
        description: data.description || '',
        date: data.date ? data.date.slice(0, 10) : '',
        time: data.time || '',
        location: data.location || '',
        capacity: data.capacity || 100,
        status: data.status || 'upcoming',
      }))
      .catch(() => setError('Failed to load event.'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'capacity' ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.time) { setError('Title, Date and Time are required.'); return; }
    setSubmitting(true);
    setError('');
    try {
      if (isEdit) await api.put(`/events/${id}`, form);
      else await api.post('/events', form);
      navigate('/admin/events');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save event.');
      setSubmitting(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-950 p-8">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <Link to="/admin/events" className="text-gray-500 hover:text-white transition-colors">←</Link>
            <div>
              <h1 className="text-2xl font-bold text-white">{isEdit ? '✏️ Edit Event' : '➕ Create New Event'}</h1>
              <p className="text-gray-400 text-sm mt-0.5">Fields marked * are required</p>
            </div>
          </div>

          {loading ? <Spinner /> : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-900/40 border border-red-500/50 text-red-300 rounded-xl px-4 py-3 text-sm">⚠️ {error}</div>
              )}

              <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">🏷️ Event Title *</label>
                  <input
                    name="title" value={form.title} onChange={handleChange}
                    placeholder="e.g., AI Summit 2026" required
                    className="w-full bg-gray-800 border border-gray-700 focus:border-purple-500 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">📝 Description</label>
                  <textarea
                    name="description" value={form.description} onChange={handleChange}
                    rows={3} placeholder="Describe your event…"
                    className="w-full bg-gray-800 border border-gray-700 focus:border-purple-500 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none resize-none transition-colors"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">📅 Date *</label>
                  <input
                    type="date" name="date" value={form.date} onChange={handleChange} required
                    className="w-full bg-gray-800 border border-gray-700 focus:border-purple-500 text-white rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">⏰ Time *</label>
                  <input
                    type="time" name="time" value={form.time} onChange={handleChange} required
                    className="w-full bg-gray-800 border border-gray-700 focus:border-purple-500 text-white rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">📍 Location</label>
                  <input
                    name="location" value={form.location} onChange={handleChange}
                    placeholder="e.g., Main Hall, San Francisco"
                    className="w-full bg-gray-800 border border-gray-700 focus:border-purple-500 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                  />
                </div>

                {/* Capacity */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">
                    👥 Capacity: <span className="text-purple-400 font-bold">{form.capacity}</span>
                  </label>
                  <input
                    type="range" name="capacity" value={form.capacity} onChange={handleChange}
                    min={10} max={2000} step={10}
                    className="w-full accent-purple-500"
                  />
                  <div className="flex justify-between text-gray-600 text-xs mt-1">
                    <span>10</span><span>2000</span>
                  </div>
                </div>

                {/* Status */}
                <div className="md:col-span-2">
                  <label className="block text-gray-300 text-sm font-medium mb-2">📊 Status</label>
                  <div className="flex flex-wrap gap-3">
                    {STATUS_OPTIONS.map(s => (
                      <label
                        key={s}
                        className={`cursor-pointer px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                          form.status === s
                            ? 'border-purple-500 bg-purple-600/20 text-purple-300'
                            : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500'
                        }`}
                      >
                        <input type="radio" name="status" value={s} checked={form.status === s} onChange={handleChange} className="sr-only" />
                        {STATUS_ICONS[s]} {s.charAt(0).toUpperCase() + s.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Preview */}
              <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
                <h3 className="text-gray-400 text-sm font-medium mb-3">👁️ Live Preview</h3>
                <div className="bg-gray-800 rounded-xl p-4">
                  <h4 className="text-white font-bold text-lg">{form.title || 'Event Title'}</h4>
                  <p className="text-gray-400 text-sm mt-1">
                    {form.date || 'Date'} · {form.time || 'Time'} · {form.location || 'Location'}
                  </p>
                  <p className="text-gray-500 text-sm">👥 Capacity: {form.capacity}</p>
                  <span className={`inline-block mt-2 text-xs px-3 py-1 rounded-full ${
                    form.status === 'upcoming' ? 'bg-blue-900/50 text-blue-300' :
                    form.status === 'ongoing' ? 'bg-green-900/50 text-green-300' :
                    form.status === 'completed' ? 'bg-gray-700 text-gray-400' :
                    'bg-red-900/50 text-red-300'
                  }`}>
                    {STATUS_ICONS[form.status]} {form.status}
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit" disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-3 rounded-xl font-bold transition-all duration-200 disabled:opacity-60 hover:-translate-y-0.5"
                >
                  {submitting ? '⏳ Saving...' : isEdit ? '✅ Update Event' : '✅ Create Event'}
                </button>
                <Link
                  to="/admin/events"
                  className="flex-1 text-center border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white py-3 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEventForm;
