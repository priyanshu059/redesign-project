// src/pages/admin/AdminNotifications.jsx — Admin View All Notifications
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Sidebar from '../../components/admin/Sidebar';
import Spinner from '../../components/common/Spinner';
import { Bell } from 'lucide-react';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');

  const fetchNotifications = () => {
    setLoading(true);
    api.get('/notifications').then(({ data }) => setNotifications(data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchNotifications(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notification?')) return;
    await api.delete(`/notifications/${id}`);
    setMessage('Notification deleted successfully.');
    fetchNotifications();
    setTimeout(() => setMessage(''), 3000);
  };

  const filtered = notifications.filter(n =>
    n.title?.toLowerCase().includes(search.toLowerCase()) ||
    n.message?.toLowerCase().includes(search.toLowerCase()) ||
    n.user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#09090b] font-sans selection:bg-indigo-500/30">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                <Bell className="w-8 h-8 text-indigo-400" /> Notifications
              </h1>
              <p className="text-zinc-400 mt-2 text-sm flex items-center gap-2">
                <span className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded font-bold">{notifications.length}</span> total notifications sent
              </p>
            </div>
            <Link to="/admin/notifications/send" className="inline-flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Send Notification
            </Link>
          </div>

          {message && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl px-5 py-4 mb-6 text-sm flex items-start gap-3 shadow-sm">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              {message}
            </div>
          )}

          {/* Search */}
          <div className="mb-6 relative max-w-sm">
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search notifications..."
              className="w-full bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 focus:border-indigo-500 text-white placeholder-zinc-500 rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all shadow-sm focus:ring-2 focus:ring-indigo-500/20"
            />
            <svg className="w-4 h-4 text-zinc-500 absolute left-4 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Spinner size="lg" /></div>
          ) : (
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
              
              {filtered.length === 0 ? (
                <div className="text-center py-20 relative z-10">
                  <div className="flex justify-center mb-6 opacity-50"><Bell className="w-16 h-16 filter drop-shadow-lg" /></div>
                  <h3 className="text-xl font-bold text-white mb-2">No notifications found</h3>
                  <p className="text-zinc-500 mb-8 max-w-md mx-auto">
                    {search ? 'No notifications match your search query.' : "No notifications have been sent yet."}
                  </p>
                  {!search && (
                    <Link to="/admin/notifications/send" className="inline-flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-xl font-medium transition-colors border border-zinc-700">
                      Send your first notification
                    </Link>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-zinc-800/80 relative z-10">
                  {filtered.map((n) => (
                    <div key={n._id} className="flex items-start justify-between gap-4 px-6 py-5 hover:bg-zinc-800/30 transition-colors group">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                          <Bell className="w-6 h-6" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-4 mb-1">
                            <div className="flex items-center gap-3 flex-wrap">
                              <h3 className={`font-bold ${n.isRead ? 'text-zinc-300' : 'text-white'}`}>
                                {n.title || 'Notification'}
                              </h3>
                              {!n.isRead && (
                                <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">New</span>
                              )}
                            </div>
                            <span className="text-zinc-500 text-xs font-medium whitespace-nowrap">
                              {n.createdAt ? new Date(n.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                            </span>
                          </div>
                          <p className={`text-sm mb-2 ${n.isRead ? 'text-zinc-500' : 'text-zinc-300'}`}>{n.message}</p>
                          <div className="flex items-center gap-2 text-xs font-medium">
                            <span className="text-zinc-600">Sent to:</span>
                            <span className="px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-300">
                              {n.user?.name || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(n._id)}
                        className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 border border-zinc-700 hover:border-rose-500/30 flex items-center justify-center transition-all shadow-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 flex-shrink-0"
                        title="Delete Notification"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
