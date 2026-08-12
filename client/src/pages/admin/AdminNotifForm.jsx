// src/pages/admin/AdminNotifForm.jsx — Send a Notification to a User
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import Sidebar from '../../components/admin/Sidebar';

const AdminNotifForm = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ user: '', title: '', message: '', channel: 'in-app' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    // Try to load users from an admin endpoint, fall back gracefully
    api.get('/auth/users').then(({ data }) => setUsers(data)).catch(() => setUsers([])).finally(() => setLoadingUsers(false));
  }, []);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.user || !form.title || !form.message) { setError('Recipient, title and message are required.'); return; }
    setSubmitting(true); setError('');
    try {
      await api.post('/notifications', { user: form.user, title: form.title, message: form.message, channel: form.channel });
      navigate('/admin/notifications');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send notification.');
      setSubmitting(false);
    }
  };

  const inputCls = "w-full bg-gray-800 border border-gray-700 focus:border-purple-500 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none transition-colors";

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-950 p-8">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Link to="/admin/notifications" className="text-gray-500 hover:text-white transition-colors">←</Link>
            <div>
              <h1 className="text-2xl font-bold text-white">📤 Send Notification</h1>
              <p className="text-gray-400 text-sm">Send a message to a user on the platform</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <div className="bg-red-900/40 border border-red-500/50 text-red-300 rounded-xl px-4 py-3 text-sm mb-4">⚠️ {error}</div>}

            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-4 mb-6">
              {/* Recipient */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">👤 Recipient *</label>
                {loadingUsers ? (
                  <p className="text-gray-500 text-sm">Loading users…</p>
                ) : users.length > 0 ? (
                  <select name="user" value={form.user} onChange={handleChange} required
                    className="w-full bg-gray-800 border border-gray-700 focus:border-purple-500 text-white rounded-xl px-4 py-3 text-sm outline-none transition-colors">
                    <option value="">Select a user…</option>
                    {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
                  </select>
                ) : (
                  <input name="user" value={form.user} onChange={handleChange} placeholder="Enter User ID"
                    className={inputCls} required />
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">📌 Title *</label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="Notification title" required className={inputCls} />
              </div>

              {/* Message */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">💬 Message *</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={4}
                  placeholder="Write your notification message here…" required
                  className="w-full bg-gray-800 border border-gray-700 focus:border-purple-500 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none resize-none transition-colors" />
              </div>

              {/* Channel */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">📡 Channel</label>
                <div className="flex gap-3">
                  {[
                    { v: 'in-app', icon: '🔔', label: 'In-App' },
                    { v: 'email', icon: '✉️', label: 'Email' },
                    { v: 'sms', icon: '📱', label: 'SMS' },
                  ].map(({ v, icon, label }) => (
                    <label key={v} className={`cursor-pointer flex-1 text-center py-2 rounded-xl border text-xs font-medium transition-all ${form.channel === v ? 'border-purple-500 bg-purple-600/20 text-purple-300' : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500'}`}>
                      <input type="radio" name="channel" value={v} checked={form.channel === v} onChange={handleChange} className="sr-only" />
                      {icon} {label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview */}
            {(form.title || form.message) && (
              <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 mb-6">
                <p className="text-gray-400 text-xs mb-2">👁️ Preview</p>
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-purple-600/30 rounded-full flex items-center justify-center text-xl flex-shrink-0">🔔</div>
                  <div>
                    <p className="text-white font-semibold text-sm">{form.title || 'Title'}</p>
                    <p className="text-gray-400 text-sm mt-0.5">{form.message || 'Message'}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button type="submit" disabled={submitting}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-60">
                {submitting ? '⏳ Sending...' : '📤 Send Notification'}
              </button>
              <Link to="/admin/notifications" className="flex-1 text-center border border-gray-600 hover:border-gray-400 text-gray-300 py-3 rounded-xl font-medium transition-colors">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifForm;
