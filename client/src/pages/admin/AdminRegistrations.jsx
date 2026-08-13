// src/pages/admin/AdminRegistrations.jsx - Admin View All Registrations
import { useState, useEffect } from 'react';
import api from '../../services/api';
import Sidebar from '../../components/admin/Sidebar';
import Spinner from '../../components/common/Spinner';
import { formatDate } from '../../utils/helpers';
import { Users, Ticket, Calendar } from 'lucide-react';

const AdminRegistrations = () => {
  const [regs, setRegs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetch = () => api.get('/registrations').then(({ data }) => setRegs(data)).finally(() => setLoading(false));
  useEffect(() => { fetch(); }, []);

  const handleCheckin = async (id) => {
    try {
      await api.patch(`/registrations/${id}/checkin`);
      setMessage('Check-in status updated');
      fetch();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Check-in failed.');
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
                <Users className="w-8 h-8 text-indigo-400" /> All Registrations
              </h1>
              <p className="text-zinc-400 mt-2 text-sm">Manage attendee check-ins and tickets across all events</p>
            </div>
            
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 flex items-center gap-3 shadow-sm">
              <span className="text-zinc-400 text-sm font-medium">Total:</span>
              <span className="text-white font-bold">{regs.length}</span>
            </div>
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
              
              {regs.length === 0 ? (
                <div className="text-center py-20 relative z-10">
                  <div className="flex justify-center mb-6 opacity-50"><Ticket className="w-16 h-16 filter drop-shadow-lg" /></div>
                  <h3 className="text-xl font-bold text-white mb-2">No registrations yet</h3>
                  <p className="text-zinc-500">When users register for events, they will appear here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto relative z-10">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-950/80 border-b border-zinc-800/80">
                        <th className="text-zinc-500 text-xs font-bold uppercase tracking-wider px-6 py-5 w-16 text-center rounded-tl-3xl">#</th>
                        <th className="text-zinc-400 text-xs font-bold uppercase tracking-wider px-6 py-5">Attendee Info</th>
                        <th className="text-zinc-400 text-xs font-bold uppercase tracking-wider px-6 py-5">Event</th>
                        <th className="text-zinc-400 text-xs font-bold uppercase tracking-wider px-6 py-5">Date</th>
                        <th className="text-zinc-400 text-xs font-bold uppercase tracking-wider px-6 py-5">Ticket Type</th>
                        <th className="text-zinc-400 text-xs font-bold uppercase tracking-wider px-6 py-5">Status</th>
                        <th className="text-zinc-400 text-xs font-bold uppercase tracking-wider px-6 py-5 text-right rounded-tr-3xl">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/80">
                      {regs.map((r, i) => (
                        <tr key={r._id} className="hover:bg-zinc-800/30 transition-colors group">
                          <td className="px-6 py-4 align-middle text-center text-zinc-500 text-sm font-medium">{i + 1}</td>
                          <td className="px-6 py-4 align-middle">
                            <div className="font-semibold text-white group-hover:text-indigo-300 transition-colors">{r.user?.name || 'Unknown'}</div>
                            <div className="text-xs text-zinc-500 mt-0.5">{r.user?.email || 'No email'}</div>
                          </td>
                          <td className="px-6 py-4 align-middle">
                            <span className="font-medium text-zinc-300 flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-indigo-400" /> {r.event?.title || 'Unknown Event'}
                            </span>
                          </td>
                          <td className="px-6 py-4 align-middle text-sm text-zinc-400">
                            {r.event?.date ? formatDate(r.event.date) : '—'}
                          </td>
                          <td className="px-6 py-4 align-middle">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${
                              r.ticketType === 'VIP' 
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            }`}>
                              {r.ticketType || 'Standard'}
                            </span>
                          </td>
                          <td className="px-6 py-4 align-middle">
                            {r.checkedIn ? (
                              <div className="inline-flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg text-xs font-bold border border-emerald-500/20">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                Checked In
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1.5 text-zinc-500 bg-zinc-900 px-2.5 py-1 rounded-lg text-xs font-bold border border-zinc-800">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Pending
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 align-middle text-right">
                            <button 
                              onClick={() => handleCheckin(r._id)} 
                              className={`inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm border ${
                                r.checkedIn 
                                  ? 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 border-zinc-700 hover:border-zinc-600' 
                                  : 'bg-indigo-500 hover:bg-indigo-600 text-white border-transparent hover:-translate-y-0.5 hover:shadow-indigo-500/20'
                              }`}
                            >
                              {r.checkedIn ? 'Undo Check-in' : 'Check In'}
                            </button>
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
export default AdminRegistrations;
