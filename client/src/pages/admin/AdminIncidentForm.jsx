// src/pages/admin/AdminIncidentForm.jsx — Add / Edit Incident
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import Sidebar from '../../components/admin/Sidebar';
import Spinner from '../../components/common/Spinner';

const EMPTY = { title: '', description: '', severity: 'Low', status: 'Open', resolution: '', event: '' };

const AdminIncidentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(EMPTY);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const reqs = [api.get('/events')];
    if (isEdit) reqs.push(api.get(`/incidents/${id}`));
    Promise.all(reqs)
      .then(([eventsRes, incRes]) => {
        setEvents(eventsRes.data);
        if (incRes) {
          const d = incRes.data;
          setForm({ title: d.title || '', description: d.description || '', severity: d.severity || 'Low', status: d.status || 'Open', resolution: d.resolution || '', event: d.event?._id || d.event || '' });
        }
      })
      .catch(() => setError('Failed to load data.'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.event) { setError('Title, description and event are required.'); return; }
    setSubmitting(true); setError('');
    try {
      if (isEdit) await api.put(`/incidents/${id}`, form);
      else await api.post('/incidents', form);
      navigate('/admin/incidents');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save incident.');
      setSubmitting(false);
    }
  };

  const inputCls = "w-full bg-gray-800 border border-gray-700 focus:border-red-500 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none transition-colors";
  const selectCls = "w-full bg-gray-800 border border-gray-700 focus:border-red-500 text-white rounded-xl px-4 py-3 text-sm outline-none transition-colors";

  const SEVERITY_OPTS = [
    { v: 'Low', icon: '🟢' }, { v: 'Medium', icon: '🟡' }, { v: 'High', icon: '🟠' }, { v: 'Critical', icon: '🔴' },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-950 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Link to="/admin/incidents" className="text-gray-500 hover:text-white transition-colors">←</Link>
            <h1 className="text-2xl font-bold text-white">{isEdit ? '✏️ Edit Incident' : '⚠️ Report Incident'}</h1>
          </div>
          {loading ? <Spinner /> : (
            <form onSubmit={handleSubmit}>
              {error && <div className="bg-red-900/40 border border-red-500/50 text-red-300 rounded-xl px-4 py-3 text-sm mb-4">⚠️ {error}</div>}
              <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-4 mb-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">🎯 Related Event *</label>
                  <select name="event" value={form.event} onChange={handleChange} required className={selectCls}>
                    <option value="">Select an event…</option>
                    {events.map(e => <option key={e._id} value={e._id}>{e.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">📌 Title *</label>
                  <input name="title" value={form.title} onChange={handleChange} placeholder="Brief title of the incident" required className={inputCls} />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">📝 Description *</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Detailed description of what happened…" required
                    className="w-full bg-gray-800 border border-gray-700 focus:border-red-500 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none resize-none transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">🚦 Severity</label>
                    <div className="flex flex-wrap gap-2">
                      {SEVERITY_OPTS.map(({ v, icon }) => (
                        <label key={v} className={`cursor-pointer px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${form.severity === v ? 'border-red-500 bg-red-600/20 text-red-300' : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500'}`}>
                          <input type="radio" name="severity" value={v} checked={form.severity === v} onChange={handleChange} className="sr-only" />
                          {icon} {v}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1.5">📊 Status</label>
                    <select name="status" value={form.status} onChange={handleChange} className={selectCls}>
                      {['Open', 'In Progress', 'Resolved', 'Closed'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">✅ Resolution Notes</label>
                  <textarea name="resolution" value={form.resolution} onChange={handleChange} rows={3} placeholder="How was this incident resolved? (fill in when resolved)"
                    className="w-full bg-gray-800 border border-gray-700 focus:border-red-500 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none resize-none transition-colors" />
                </div>
              </div>
              <div className="flex gap-4">
                <button type="submit" disabled={submitting} className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-60">
                  {submitting ? '⏳ Saving...' : isEdit ? '✅ Update Incident' : '⚠️ Report Incident'}
                </button>
                <Link to="/admin/incidents" className="flex-1 text-center border border-gray-600 hover:border-gray-400 text-gray-300 py-3 rounded-xl font-medium transition-colors">Cancel</Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminIncidentForm;
