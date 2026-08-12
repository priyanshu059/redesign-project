// src/pages/UserRegistrations.jsx — My Registrations page
import { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import Spinner from '../components/common/Spinner';
import StatCard from '../components/common/StatCard';
import { formatDate } from '../utils/helpers';

const TICKET_TYPES = ['Standard', 'VIP', 'Speaker', 'Press'];

const UserRegistrations = () => {
  const location = useLocation();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(location.state?.success || '');
  const [editingReg, setEditingReg] = useState(null);
  const [editTicket, setEditTicket] = useState('');

  const fetchRegs = () => {
    setLoading(true);
    api.get('/registrations/my')
      .then(({ data }) => setRegistrations(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRegs(); }, []);
  useEffect(() => { if (message) { const t = setTimeout(() => setMessage(''), 4000); return () => clearTimeout(t); } }, [message]);

  const handleCancel = async (id, title) => {
    if (!window.confirm(`Cancel registration for "${title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/registrations/${id}`);
      setMessage('Registration cancelled successfully.');
      fetchRegs();
    } catch (err) {
      setMessage('Failed to cancel registration.');
    }
  };

  const handleEditOpen = (reg) => {
    setEditingReg(reg);
    setEditTicket(reg.ticketType || 'Standard');
  };

  const handleEditSave = async () => {
    try {
      await api.put(`/registrations/${editingReg._id}`, { ticketType: editTicket });
      setMessage('Ticket type updated successfully.');
      setEditingReg(null);
      fetchRegs();
    } catch {
      setMessage('Failed to update ticket type.');
    }
  };

  if (loading) return <div className="min-h-screen bg-[#09090b] flex items-center justify-center"><Spinner size="lg" /></div>;

  const checkedIn = registrations.filter(r => r.checkedIn).length;
  const pending = registrations.filter(r => !r.checkedIn).length;

  return (
    <div className="min-h-screen bg-[#09090b] py-12 px-4 font-sans selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight flex items-center gap-3">
              My Registrations
            </h1>
            <p className="text-zinc-400 mt-2 text-lg">Manage your event tickets and statuses</p>
          </div>
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-zinc-400 hover:text-indigo-400 text-sm font-medium transition-colors group">
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Dashboard
          </Link>
        </div>

        {/* Alert */}
        {message && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl px-5 py-4 mb-8 text-sm flex items-start gap-3 shadow-lg">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            {message}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <StatCard title="Total Tickets" value={registrations.length} icon="🎟️" color="purple" />
          <StatCard title="Checked In" value={checkedIn} icon="✅" color="green" />
          <StatCard title="Pending" value={pending} icon="⏳" color="yellow" />
        </div>

        {/* Table */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          {registrations.length === 0 ? (
            <div className="text-center py-20 relative z-10">
              <div className="text-6xl mb-6 filter drop-shadow-lg">📭</div>
              <h3 className="text-xl font-bold text-white mb-2">No registrations found</h3>
              <p className="text-zinc-500 mb-8 max-w-md mx-auto">You haven't registered for any events yet. Discover upcoming events and secure your spot.</p>
              <Link to="/events" className="inline-flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5">
                Browse Events
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto relative z-10">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-950/80 border-b border-zinc-800/80">
                    <th className="text-zinc-400 text-xs font-bold uppercase tracking-wider px-6 py-5 rounded-tl-3xl">Event details</th>
                    <th className="text-zinc-400 text-xs font-bold uppercase tracking-wider px-6 py-5">Ticket Type</th>
                    <th className="text-zinc-400 text-xs font-bold uppercase tracking-wider px-6 py-5">Status</th>
                    <th className="text-zinc-400 text-xs font-bold uppercase tracking-wider px-6 py-5 hidden sm:table-cell">Registered Date</th>
                    <th className="text-zinc-400 text-xs font-bold uppercase tracking-wider px-6 py-5 text-right rounded-tr-3xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80">
                  {registrations.map((reg) => (
                    <tr key={reg._id} className="hover:bg-zinc-800/30 transition-colors group">
                      <td className="px-6 py-5 align-middle">
                        {reg.event ? (
                          <div className="flex flex-col">
                            <p className="text-white font-semibold text-base mb-1 group-hover:text-indigo-300 transition-colors">{reg.event.title}</p>
                            <p className="text-zinc-500 text-sm flex items-center gap-1.5">
                              <span>{formatDate(reg.event.date)}</span>
                              <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>
                              <span className="truncate max-w-[150px] md:max-w-xs">{reg.event.location}</span>
                            </p>
                          </div>
                        ) : (
                          <span className="text-zinc-500 italic flex items-center gap-2"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Event removed</span>
                        )}
                      </td>
                      <td className="px-6 py-5 align-middle">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {reg.ticketType || 'Standard'}
                        </span>
                      </td>
                      <td className="px-6 py-5 align-middle">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${
                          reg.checkedIn
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                        }`}>
                          {reg.checkedIn ? '✅ Checked In' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-5 align-middle text-zinc-400 text-sm hidden sm:table-cell">
                        {reg.registeredAt ? new Date(reg.registeredAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                      </td>
                      <td className="px-6 py-5 align-middle">
                        <div className="flex justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          {reg.event && (
                            <Link
                              to={`/events/${reg.event._id}`}
                              className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-indigo-500/20 text-zinc-400 hover:text-indigo-400 border border-zinc-700 hover:border-indigo-500/30 flex items-center justify-center transition-all shadow-sm"
                              title="View Event"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            </Link>
                          )}
                          {reg.event && (
                            <button
                              onClick={() => handleEditOpen(reg)}
                              className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-amber-500/20 text-zinc-400 hover:text-amber-400 border border-zinc-700 hover:border-amber-500/30 flex items-center justify-center transition-all shadow-sm"
                              title="Edit Ticket"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </button>
                          )}
                          <button
                            onClick={() => handleCancel(reg._id, reg.event?.title || 'this event')}
                            className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 border border-zinc-700 hover:border-rose-500/30 flex items-center justify-center transition-all shadow-sm"
                            title="Cancel Registration"
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

        {/* Actions */}
        {registrations.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-8">
            <Link to="/events" className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Register for New Event
            </Link>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#09090b]/80 backdrop-blur-md px-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 w-full max-w-sm shadow-2xl relative overflow-hidden animate-fade-in-up">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-white font-bold text-xl mb-1">Edit Ticket</h3>
                  <p className="text-zinc-400 text-sm truncate max-w-[200px]">{editingReg.event?.title}</p>
                </div>
                <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center text-xl">
                  🎫
                </div>
              </div>
              
              <div className="space-y-2 mb-8">
                <label className="block text-sm font-medium text-zinc-300">Ticket Type</label>
                <div className="relative">
                  <select
                    value={editTicket}
                    onChange={e => setEditTicket(e.target.value)}
                    className="w-full appearance-none bg-zinc-950/50 border border-zinc-800 text-white rounded-xl pl-4 pr-10 py-3.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
                  >
                    {TICKET_TYPES.map(t => <option key={t} value={t} className="bg-zinc-900">{t}</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-zinc-500">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setEditingReg(null)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-xl font-medium transition-colors border border-zinc-700 hover:border-zinc-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRegistrations;
