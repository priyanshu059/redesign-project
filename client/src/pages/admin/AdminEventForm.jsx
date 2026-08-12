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
    <div className="flex min-h-screen bg-[#09090b] font-sans selection:bg-indigo-500/30">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/admin/events" className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 transition-all shadow-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                {isEdit ? '✏️ Edit Event' : '➕ Create New Event'}
              </h1>
              <p className="text-zinc-500 text-sm mt-1">Configure event details and settings</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Spinner size="lg" /></div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none z-0"></div>
              
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl px-5 py-4 text-sm flex items-start gap-3 shadow-sm relative z-10">
                  <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
                
                {/* Main Form Area */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                      <span className="text-indigo-400">📝</span> Basic Info
                    </h3>
                    
                    <div className="space-y-5">
                      <div>
                        <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Event Title <span className="text-rose-500">*</span></label>
                        <input
                          name="title" value={form.title} onChange={handleChange}
                          placeholder="e.g., AI Summit 2026" required
                          className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-indigo-500 text-white placeholder-zinc-600 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
                        />
                      </div>

                      <div>
                        <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Description</label>
                        <textarea
                          name="description" value={form.description} onChange={handleChange}
                          rows={4} placeholder="Describe your event…"
                          className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-indigo-500 text-white placeholder-zinc-600 rounded-xl px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                      <span className="text-indigo-400">📍</span> Timing & Location
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                      <div>
                        <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Date <span className="text-rose-500">*</span></label>
                        <div className="relative">
                          <input
                            type="date" name="date" value={form.date} onChange={handleChange} required
                            className="w-full appearance-none bg-zinc-950/50 border border-zinc-800 focus:border-indigo-500 text-white rounded-xl pl-4 pr-10 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner [color-scheme:dark]"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-zinc-500">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Time <span className="text-rose-500">*</span></label>
                        <div className="relative">
                          <input
                            type="time" name="time" value={form.time} onChange={handleChange} required
                            className="w-full appearance-none bg-zinc-950/50 border border-zinc-800 focus:border-indigo-500 text-white rounded-xl pl-4 pr-10 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner [color-scheme:dark]"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-zinc-500">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Location</label>
                      <input
                        name="location" value={form.location} onChange={handleChange}
                        placeholder="e.g., Main Hall, San Francisco"
                        className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-indigo-500 text-white placeholder-zinc-600 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                {/* Sidebar Configuration */}
                <div className="space-y-6">
                  <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                      <span className="text-indigo-400">⚙️</span> Configuration
                    </h3>
                    
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider">Capacity</label>
                        <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded text-xs font-bold">{form.capacity}</span>
                      </div>
                      <input
                        type="range" name="capacity" value={form.capacity} onChange={handleChange}
                        min={10} max={2000} step={10}
                        className="w-full accent-indigo-500 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-zinc-500 text-xs mt-2 font-medium">
                        <span>10</span><span>2000</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-3">Status</label>
                      <div className="flex flex-col gap-2">
                        {STATUS_OPTIONS.map(s => (
                          <label
                            key={s}
                            className={`cursor-pointer px-4 py-3 rounded-xl border flex items-center gap-3 transition-all ${
                              form.status === s
                                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300 shadow-sm'
                                : 'border-zinc-800 bg-zinc-950/50 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800'
                            }`}
                          >
                            <input type="radio" name="status" value={s} checked={form.status === s} onChange={handleChange} className="sr-only" />
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${form.status === s ? 'border-indigo-400' : 'border-zinc-600'}`}>
                              {form.status === s && <div className="w-2 h-2 rounded-full bg-indigo-400"></div>}
                            </div>
                            <span className="flex items-center gap-2">
                              {STATUS_ICONS[s]} <span className="capitalize font-medium">{s}</span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col gap-3">
                    <button
                      type="submit" disabled={submitting}
                      className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3.5 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 focus:ring-4 focus:ring-indigo-500/30 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <svg className="animate-spin -ml-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          Saving...
                        </>
                      ) : (
                        isEdit ? 'Update Event' : 'Create Event'
                      )}
                    </button>
                    <Link
                      to="/admin/events"
                      className="w-full text-center border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white py-3.5 rounded-xl font-medium transition-colors"
                    >
                      Cancel
                    </Link>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEventForm;
