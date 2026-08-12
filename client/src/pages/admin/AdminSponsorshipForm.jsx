// src/pages/admin/AdminSponsorshipForm.jsx — Add / Edit Sponsorship
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import Sidebar from '../../components/admin/Sidebar';
import Spinner from '../../components/common/Spinner';

const EMPTY = { sponsorName: '', sponsorType: 'Gold', amount: '', contactEmail: '', contactPhone: '', description: '', status: 'Pending', event: '' };

const AdminSponsorshipForm = () => {
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
    if (isEdit) reqs.push(api.get(`/sponsorships/${id}`));
    Promise.all(reqs)
      .then(([eventsRes, sponsorRes]) => {
        setEvents(eventsRes.data);
        if (sponsorRes) {
          const d = sponsorRes.data;
          setForm({ sponsorName: d.sponsorName || '', sponsorType: d.sponsorType || 'Gold', amount: d.amount || '', contactEmail: d.contactEmail || '', contactPhone: d.contactPhone || '', description: d.description || '', status: d.status || 'Pending', event: d.event?._id || d.event || '' });
        }
      })
      .catch(() => setError('Failed to load data.'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.sponsorName || !form.amount || !form.event) { setError('Sponsor name, amount and event are required.'); return; }
    setSubmitting(true); setError('');
    try {
      if (isEdit) await api.put(`/sponsorships/${id}`, form);
      else await api.post('/sponsorships', form);
      navigate('/admin/sponsorships');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save sponsorship.');
      setSubmitting(false);
    }
  };

  const inputCls = "w-full bg-gray-800 border border-gray-700 focus:border-purple-500 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none transition-colors";
  const selectCls = "w-full bg-gray-800 border border-gray-700 focus:border-purple-500 text-white rounded-xl px-4 py-3 text-sm outline-none transition-colors";

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-950 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Link to="/admin/sponsorships" className="text-gray-500 hover:text-white transition-colors">←</Link>
            <h1 className="text-2xl font-bold text-white">{isEdit ? '✏️ Edit Sponsorship' : '➕ Add Sponsorship'}</h1>
          </div>
          {loading ? <Spinner /> : (
            <form onSubmit={handleSubmit}>
              {error && <div className="bg-red-900/40 border border-red-500/50 text-red-300 rounded-xl px-4 py-3 text-sm mb-4">⚠️ {error}</div>}
              <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="md:col-span-2">
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">🎯 Event *</label>
                  <select name="event" value={form.event} onChange={handleChange} required className={selectCls}>
                    <option value="">Select an event…</option>
                    {events.map(e => <option key={e._id} value={e._id}>{e.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">🏢 Sponsor Name *</label>
                  <input name="sponsorName" value={form.sponsorName} onChange={handleChange} placeholder="Company name" required className={inputCls} />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">🏅 Sponsor Type</label>
                  <select name="sponsorType" value={form.sponsorType} onChange={handleChange} className={selectCls}>
                    {['Platinum', 'Gold', 'Silver', 'Bronze', 'Other'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">💰 Amount ($) *</label>
                  <input type="number" name="amount" value={form.amount} onChange={handleChange} placeholder="e.g., 5000" required min={0} className={inputCls} />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">📊 Status</label>
                  <select name="status" value={form.status} onChange={handleChange} className={selectCls}>
                    {['Pending', 'Confirmed', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">✉️ Contact Email</label>
                  <input type="email" name="contactEmail" value={form.contactEmail} onChange={handleChange} placeholder="sponsor@company.com" className={inputCls} />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">📞 Contact Phone</label>
                  <input name="contactPhone" value={form.contactPhone} onChange={handleChange} placeholder="+1 800 123 4567" className={inputCls} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">📝 Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Notes about this sponsorship…"
                    className="w-full bg-gray-800 border border-gray-700 focus:border-purple-500 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none resize-none transition-colors" />
                </div>
              </div>
              <div className="flex gap-4">
                <button type="submit" disabled={submitting} className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-60">
                  {submitting ? '⏳ Saving...' : isEdit ? '✅ Update' : '✅ Add Sponsorship'}
                </button>
                <Link to="/admin/sponsorships" className="flex-1 text-center border border-gray-600 hover:border-gray-400 text-gray-300 py-3 rounded-xl font-medium transition-colors">Cancel</Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSponsorshipForm;
