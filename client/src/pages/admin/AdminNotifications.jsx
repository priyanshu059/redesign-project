// src/pages/admin/AdminNotifications.jsx — Admin View All Notifications
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Sidebar from '../../components/admin/Sidebar';
import Spinner from '../../components/common/Spinner';

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
    setMessage('Notification deleted.');
    fetchNotifications();
    setTimeout(() => setMessage(''), 3000);
  };

  const filtered = notifications.filter(n =>
    n.title?.toLowerCase().includes(search.toLowerCase()) ||
    n.message?.toLowerCase().includes(search.toLowerCase()) ||
    n.user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-950 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">🔔 Notifications</h1>
            <p className="text-gray-400 text-sm mt-0.5">{notifications.length} notification{notifications.length !== 1 ? 's' : ''} total</p>
          </div>
          <Link to="/admin/notifications/send" className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
            + Send Notification
          </Link>
        </div>

        {message && <div className="bg-green-900/40 border border-green-500/50 text-green-300 rounded-xl px-4 py-3 mb-4 text-sm">✅ {message}</div>}

        <div className="mb-4">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search notifications…"
            className="bg-gray-900 border border-gray-700 focus:border-purple-500 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors w-full max-w-xs" />
        </div>

        {loading ? <Spinner /> : (
          <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-3">🔔</div>
                <p className="text-gray-400">No notifications found.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {filtered.map((n) => (
                  <div key={n._id} className="flex items-start justify-between gap-4 px-6 py-4 hover:bg-gray-800/40 transition-colors">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${n.isRead ? 'bg-gray-700' : 'bg-purple-600/30'}`}>
                        🔔
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-white font-semibold text-sm">{n.title || 'Notification'}</p>
                          {!n.isRead && (
                            <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">New</span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm mt-0.5 line-clamp-2">{n.message}</p>
                        <p className="text-gray-600 text-xs mt-1">
                          To: {n.user?.name || 'N/A'} · {n.createdAt ? new Date(n.createdAt).toLocaleString() : '—'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(n._id)}
                      className="text-red-400 hover:text-red-300 text-xs border border-red-500/30 px-2 py-1 rounded-lg transition-colors flex-shrink-0"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
