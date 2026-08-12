// src/pages/admin/AdminEvents.jsx - Admin Manage Events
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Sidebar from '../../components/admin/Sidebar';
import Spinner from '../../components/common/Spinner';
import { getStatusColor, formatDate } from '../../utils/helpers';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchEvents = () => api.get('/events').then(({ data }) => setEvents(data)).finally(() => setLoading(false));
  useEffect(() => { fetchEvents(); }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete event "${title}"?`)) return;
    try {
      await api.delete(`/events/${id}`);
      setMessage('Event deleted successfully');
      fetchEvents();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to delete event.');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#09090b] font-sans selection:bg-indigo-500/30">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                <span className="text-3xl">📅</span> Manage Events
              </h1>
              <p className="text-zinc-400 mt-2 text-sm">Create, edit, and organize all events</p>
            </div>
            <Link to="/admin/events/add" className="inline-flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add Event
            </Link>
          </div>

          {message && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl px-5 py-4 mb-6 text-sm flex items-start gap-3 shadow-sm">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              {message}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-20"><Spinner size="lg" /></div>
          ) : (
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
              
              {events.length === 0 ? (
                <div className="text-center py-20 relative z-10">
                  <div className="text-6xl mb-6 filter drop-shadow-lg opacity-50">📋</div>
                  <h3 className="text-xl font-bold text-white mb-2">No events found</h3>
                  <p className="text-zinc-500 mb-8 max-w-md mx-auto">You haven't created any events yet.</p>
                  <Link to="/admin/events/add" className="inline-flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-xl font-medium transition-colors border border-zinc-700">
                    Create your first event
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto relative z-10">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-950/80 border-b border-zinc-800/80">
                        <th className="text-zinc-500 text-xs font-bold uppercase tracking-wider px-6 py-5 w-16 text-center rounded-tl-3xl">#</th>
                        <th className="text-zinc-400 text-xs font-bold uppercase tracking-wider px-6 py-5">Event Title</th>
                        <th className="text-zinc-400 text-xs font-bold uppercase tracking-wider px-6 py-5">Date & Time</th>
                        <th className="text-zinc-400 text-xs font-bold uppercase tracking-wider px-6 py-5">Location</th>
                        <th className="text-zinc-400 text-xs font-bold uppercase tracking-wider px-6 py-5">Capacity</th>
                        <th className="text-zinc-400 text-xs font-bold uppercase tracking-wider px-6 py-5">Status</th>
                        <th className="text-zinc-400 text-xs font-bold uppercase tracking-wider px-6 py-5 text-right rounded-tr-3xl">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/80">
                      {events.map((ev, i) => (
                        <tr key={ev._id} className="hover:bg-zinc-800/30 transition-colors group">
                          <td className="px-6 py-4 align-middle text-center text-zinc-500 text-sm font-medium">{i + 1}</td>
                          <td className="px-6 py-4 align-middle">
                            <p className="text-white font-semibold text-sm group-hover:text-indigo-300 transition-colors">{ev.title}</p>
                          </td>
                          <td className="px-6 py-4 align-middle">
                            <p className="text-zinc-300 text-sm">{formatDate(ev.date)}</p>
                            <p className="text-zinc-500 text-xs mt-0.5">{ev.time || '—'}</p>
                          </td>
                          <td className="px-6 py-4 align-middle">
                            <div className="text-zinc-400 text-sm flex items-center gap-1.5 max-w-[150px] truncate" title={ev.location}>
                              <span className="text-indigo-400/70">📍</span> {ev.location}
                            </div>
                          </td>
                          <td className="px-6 py-4 align-middle">
                            <div className="flex items-center gap-1.5">
                              <span className="text-zinc-300 text-sm font-medium">{ev.capacity}</span>
                              <span className="text-zinc-600 text-xs">seats</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 align-middle">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border capitalize ${
                              ev.status === 'upcoming' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                              ev.status === 'ongoing' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                              ev.status === 'completed' ? 'bg-zinc-800 text-zinc-400 border-zinc-700' :
                              'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}>
                              {ev.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 align-middle">
                            <div className="flex justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                              <Link
                                to={`/admin/events/edit/${ev._id}`}
                                className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-indigo-500/20 text-zinc-400 hover:text-indigo-400 border border-zinc-700 hover:border-indigo-500/30 flex items-center justify-center transition-all shadow-sm"
                                title="Edit Event"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                              </Link>
                              <button
                                onClick={() => handleDelete(ev._id, ev.title)}
                                className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 border border-zinc-700 hover:border-rose-500/30 flex items-center justify-center transition-all shadow-sm"
                                title="Delete Event"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default AdminEvents;
