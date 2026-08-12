// src/pages/admin/AdminSpeakerForm.jsx — Add / Edit Speaker
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import Sidebar from '../../components/admin/Sidebar';
import Spinner from '../../components/common/Spinner';

const EMPTY = { name: '', bio: '', sessionTitle: '', schedule: '', availability: true };

const AdminSpeakerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/speakers/${id}`)
      .then(({ data }) => setForm({ name: data.name || '', bio: data.bio || '', sessionTitle: data.sessionTitle || '', schedule: data.schedule || '', availability: data.availability ?? true }))
      .catch(() => setError('Failed to load speaker.'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) { setError('Speaker name is required.'); return; }
    setSubmitting(true); setError('');
    try {
      if (isEdit) await api.put(`/speakers/${id}`, form);
      else await api.post('/speakers', form);
      navigate('/admin/speakers');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save speaker.');
      setSubmitting(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-950 p-8">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Link to="/admin/speakers" className="text-gray-500 hover:text-white transition-colors">←</Link>
            <h1 className="text-2xl font-bold text-white">{isEdit ? '✏️ Edit Speaker' : '➕ Add Speaker'}</h1>
          </div>

          {loading ? <Spinner /> : (
            <form onSubmit={handleSubmit}>
              {error && <div className="bg-red-900/40 border border-red-500/50 text-red-300 rounded-xl px-4 py-3 text-sm mb-4">⚠️ {error}</div>}
              <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-4 mb-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">👤 Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="e.g., Dr. Jane Smith" required
                    className="w-full bg-gray-800 border border-gray-700 focus:border-purple-500 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">📝 Bio</label>
                  <textarea name="bio" value={form.bio} onChange={handleChange} rows={3} placeholder="Brief biography of the speaker…"
                    className="w-full bg-gray-800 border border-gray-700 focus:border-purple-500 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none resize-none transition-colors" />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">🎙️ Session Title</label>
                  <input name="sessionTitle" value={form.sessionTitle} onChange={handleChange} placeholder="e.g., The Future of AI in Events"
                    className="w-full bg-gray-800 border border-gray-700 focus:border-purple-500 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">📅 Schedule</label>
                  <input name="schedule" value={form.schedule} onChange={handleChange} placeholder="e.g., Day 1 — 10:00 AM"
                    className="w-full bg-gray-800 border border-gray-700 focus:border-purple-500 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none transition-colors" />
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" name="availability" checked={form.availability} onChange={handleChange} id="avail"
                    className="w-5 h-5 accent-purple-500 rounded" />
                  <label htmlFor="avail" className="text-gray-300 text-sm cursor-pointer">✅ Available to speak</label>
                </div>
              </div>
              <div className="flex gap-4">
                <button type="submit" disabled={submitting} className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-60">
                  {submitting ? '⏳ Saving...' : isEdit ? '✅ Update Speaker' : '✅ Add Speaker'}
                </button>
                <Link to="/admin/speakers" className="flex-1 text-center border border-gray-600 hover:border-gray-400 text-gray-300 py-3 rounded-xl font-medium transition-colors">Cancel</Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSpeakerForm;
