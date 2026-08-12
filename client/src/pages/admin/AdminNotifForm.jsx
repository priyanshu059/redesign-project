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

  const inputCls = "w-full bg-zinc-950/50 border border-zinc-800 focus:border-indigo-500 text-white placeholder-zinc-600 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner";
  const selectCls = "w-full bg-zinc-950/50 border border-zinc-800 focus:border-indigo-500 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner appearance-none cursor-pointer";

  return (
    <div className="flex min-h-screen bg-[#09090b] font-sans selection:bg-indigo-500/30">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/admin/notifications" className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 transition-all shadow-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                📤 Send Notification
              </h1>
              <p className="text-zinc-500 text-sm mt-1">Broadcast messages to users across multiple channels</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none z-0"></div>
            
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl px-5 py-4 text-sm flex items-start gap-3 shadow-sm relative z-10 mb-6">
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                    <span className="text-indigo-400">📝</span> Message Details
                  </h3>
                  
                  <div className="space-y-5">
                    {/* Recipient */}
                    <div>
                      <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Recipient <span className="text-rose-500">*</span></label>
                      {loadingUsers ? (
                        <div className="w-full bg-zinc-950/50 border border-zinc-800 text-zinc-500 rounded-xl px-4 py-3 text-sm animate-pulse">Loading users...</div>
                      ) : users.length > 0 ? (
                        <div className="relative">
                          <select name="user" value={form.user} onChange={handleChange} required className={selectCls}>
                            <option value="">Select a user…</option>
                            {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
                          </select>
                          <svg className="w-4 h-4 text-zinc-500 absolute right-4 top-4 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      ) : (
                        <input name="user" value={form.user} onChange={handleChange} placeholder="Enter User ID" className={inputCls} required />
                      )}
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Title <span className="text-rose-500">*</span></label>
                      <input name="title" value={form.title} onChange={handleChange} placeholder="Notification title" required className={inputCls} />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Message Body <span className="text-rose-500">*</span></label>
                      <textarea 
                        name="message" value={form.message} onChange={handleChange} rows={5}
                        placeholder="Write your notification message here…" required
                        className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-indigo-500 text-white placeholder-zinc-600 rounded-xl px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Setup */}
              <div className="space-y-6">
                <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                    <span className="text-indigo-400">📡</span> Delivery Options
                  </h3>
                  
                  <div>
                    <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-3">Channel</label>
                    <div className="flex flex-col gap-2">
                      {[
                        { v: 'in-app', icon: '🔔', label: 'In-App Alert' },
                        { v: 'email', icon: '✉️', label: 'Email Dispatch' },
                        { v: 'sms', icon: '📱', label: 'SMS Text' },
                      ].map(({ v, icon, label }) => (
                        <label key={v} className={`relative flex items-center p-3 rounded-xl border cursor-pointer transition-all ${
                          form.channel === v 
                            ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 shadow-sm' 
                            : 'bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800/50 hover:border-zinc-700'
                        }`}>
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{icon}</span>
                            <span className="font-bold text-sm">{label}</span>
                          </div>
                          <input type="radio" name="channel" value={v} checked={form.channel === v} onChange={handleChange} className="sr-only" />
                          {form.channel === v && (
                            <svg className="w-4 h-4 text-indigo-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Preview Panel */}
                {(form.title || form.message) && (
                  <div className="bg-zinc-900/50 backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-6 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-4 flex items-center gap-2">
                      <span>👁️</span> Live Preview
                    </h3>
                    <div className="bg-zinc-950/80 rounded-2xl p-4 border border-zinc-800">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center text-xl flex-shrink-0 text-indigo-400 shadow-inner">
                          {form.channel === 'email' ? '✉️' : form.channel === 'sms' ? '📱' : '🔔'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-bold text-sm truncate">{form.title || 'Untitled Notification'}</p>
                          <p className="text-zinc-400 text-sm mt-1 break-words">{form.message || 'Message preview will appear here...'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col gap-3">
                  <button 
                    type="submit" disabled={submitting} 
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3.5 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 focus:ring-4 focus:ring-indigo-500/30 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin -ml-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Sending...
                      </>
                    ) : (
                      'Send Notification'
                    )}
                  </button>
                  <Link 
                    to="/admin/notifications" 
                    className="w-full text-center border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white py-3.5 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifForm;
