// src/pages/admin/AdminSponsorships.jsx — Admin Manage Sponsorships
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Sidebar from '../../components/admin/Sidebar';
import Spinner from '../../components/common/Spinner';
import { Handshake, CheckCircle, Clock, XCircle } from 'lucide-react';

const TYPE_COLORS = {
  Platinum: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  Gold: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Silver: 'bg-zinc-300/10 text-zinc-300 border-zinc-300/20',
  Bronze: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Other: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

const STATUS_COLORS = {
  Confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Cancelled: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

const STATUS_ICONS = {
  Confirmed: <CheckCircle className="w-4 h-4 text-emerald-400" />,
  Pending: <Clock className="w-4 h-4 text-amber-400" />,
  Cancelled: <XCircle className="w-4 h-4 text-rose-400" />,
};

const AdminSponsorships = () => {
  const [sponsorships, setSponsorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');

  const fetchSponsorships = () => {
    setLoading(true);
    api.get('/sponsorships').then(({ data }) => setSponsorships(data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchSponsorships(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete sponsorship from "${name}"?`)) return;
    await api.delete(`/sponsorships/${id}`);
    setMessage('Sponsorship deleted successfully.');
    fetchSponsorships();
    setTimeout(() => setMessage(''), 3000);
  };

  const filtered = sponsorships.filter(s =>
    s.sponsorName?.toLowerCase().includes(search.toLowerCase()) ||
    s.event?.title?.toLowerCase().includes(search.toLowerCase())
  );

  const totalAmount = filtered.reduce((sum, s) => sum + (s.amount || 0), 0);

  return (
    <div className="flex min-h-screen bg-[#09090b] font-sans selection:bg-indigo-500/30">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                <Handshake className="w-8 h-8 text-indigo-400" /> Manage Sponsorships
              </h1>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <p className="text-zinc-400 flex items-center gap-2">
                  <span className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded font-bold">{filtered.length}</span> sponsorships
                </p>
                <div className="w-1 h-1 rounded-full bg-zinc-700"></div>
                <p className="text-zinc-400 flex items-center gap-2">
                  Total Value: <span className="text-emerald-400 font-bold tracking-wide">${totalAmount.toLocaleString()}</span>
                </p>
              </div>
            </div>
            <Link to="/admin/sponsorships/add" className="inline-flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add Sponsorship
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
              placeholder="Search by sponsor or event..."
              className="w-full bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 focus:border-indigo-500 text-white placeholder-zinc-500 rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all shadow-sm focus:ring-2 focus:ring-indigo-500/20"
            />
            <svg className="w-4 h-4 text-zinc-500 absolute left-4 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Spinner size="lg" /></div>
          ) : (
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
              
              {filtered.length === 0 ? (
                <div className="text-center py-20 relative z-10">
                  <div className="flex justify-center mb-6 opacity-50"><Handshake className="w-16 h-16 filter drop-shadow-lg text-indigo-400" /></div>
                  <h3 className="text-xl font-bold text-white mb-2">No sponsorships found</h3>
                  <p className="text-zinc-500 mb-8 max-w-md mx-auto">
                    {search ? 'No sponsorships match your search criteria.' : "You haven't recorded any sponsorships yet."}
                  </p>
                  {!search && (
                    <Link to="/admin/sponsorships/add" className="inline-flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-xl font-medium transition-colors border border-zinc-700">
                      Record your first sponsorship
                    </Link>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto relative z-10">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-950/80 border-b border-zinc-800/80">
                        <th className="text-zinc-500 text-xs font-bold uppercase tracking-wider px-6 py-5 w-16 text-center rounded-tl-3xl">#</th>
                        <th className="text-zinc-400 text-xs font-bold uppercase tracking-wider px-6 py-5">Sponsor</th>
                        <th className="text-zinc-400 text-xs font-bold uppercase tracking-wider px-6 py-5">Event</th>
                        <th className="text-zinc-400 text-xs font-bold uppercase tracking-wider px-6 py-5">Tier</th>
                        <th className="text-zinc-400 text-xs font-bold uppercase tracking-wider px-6 py-5">Value</th>
                        <th className="text-zinc-400 text-xs font-bold uppercase tracking-wider px-6 py-5">Status</th>
                        <th className="text-zinc-400 text-xs font-bold uppercase tracking-wider px-6 py-5 text-right rounded-tr-3xl">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/80">
                      {filtered.map((s, i) => (
                        <tr key={s._id} className="hover:bg-zinc-800/30 transition-colors group">
                          <td className="px-6 py-4 align-middle text-center text-zinc-500 text-sm font-medium">{i + 1}</td>
                          <td className="px-6 py-4 align-middle">
                            <p className="text-white font-semibold text-sm group-hover:text-indigo-300 transition-colors">{s.sponsorName}</p>
                            <p className="text-zinc-500 text-xs mt-0.5">{s.contactEmail}</p>
                          </td>
                          <td className="px-6 py-4 align-middle">
                            <span className="text-zinc-300 text-sm font-medium">{s.event?.title || '—'}</span>
                          </td>
                          <td className="px-6 py-4 align-middle">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${TYPE_COLORS[s.sponsorType] || TYPE_COLORS.Other}`}>
                              {s.sponsorType}
                            </span>
                          </td>
                          <td className="px-6 py-4 align-middle">
                            <span className="text-emerald-400 font-bold tracking-wide">${s.amount?.toLocaleString()}</span>
                          </td>
                          <td className="px-6 py-4 align-middle">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${STATUS_COLORS[s.status] || ''}`}>
                              <span>{STATUS_ICONS[s.status]}</span> {s.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 align-middle">
                            <div className="flex justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                              <Link
                                to={`/admin/sponsorships/edit/${s._id}`}
                                className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-indigo-500/20 text-zinc-400 hover:text-indigo-400 border border-zinc-700 hover:border-indigo-500/30 flex items-center justify-center transition-all shadow-sm"
                                title="Edit Sponsorship"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                              </Link>
                              <button
                                onClick={() => handleDelete(s._id, s.sponsorName)}
                                className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 border border-zinc-700 hover:border-rose-500/30 flex items-center justify-center transition-all shadow-sm"
                                title="Delete Sponsorship"
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

export default AdminSponsorships;
