// src/pages/admin/AdminIncidents.jsx — Admin Manage Incidents
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Sidebar from '../../components/admin/Sidebar';
import Spinner from '../../components/common/Spinner';
import { AlertTriangle, Sparkles } from 'lucide-react';

const SEVERITY_COLORS = {
  Low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  High: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Critical: 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-sm shadow-rose-500/10',
};

const STATUS_COLORS = {
  Open: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  'In Progress': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Resolved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Closed: 'bg-zinc-800 text-zinc-400 border-zinc-700',
};

const AdminIncidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchIncidents = () => {
    setLoading(true);
    api.get('/incidents').then(({ data }) => setIncidents(data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchIncidents(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this incident?')) return;
    await api.delete(`/incidents/${id}`);
    setMessage('Incident deleted successfully.');
    fetchIncidents();
    setTimeout(() => setMessage(''), 3000);
  };

  const filtered = filter === 'all' ? incidents : incidents.filter(i => i.status === filter);

  return (
    <div className="flex min-h-screen bg-[#09090b] font-sans selection:bg-indigo-500/30">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-rose-400" /> Manage Incidents
              </h1>
              <p className="text-zinc-400 mt-2 text-sm flex items-center gap-2">
                <span className="bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded font-bold">{incidents.length}</span> total incidents reported
              </p>
            </div>
            <Link to="/admin/incidents/add" className="inline-flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-rose-500/20 hover:-translate-y-0.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Report Incident
            </Link>
          </div>

          {message && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl px-5 py-4 mb-6 text-sm flex items-start gap-3 shadow-sm">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              {message}
            </div>
          )}

          {/* Filter tabs */}
          <div className="flex gap-2 mb-6 flex-wrap bg-zinc-900/50 p-1.5 rounded-2xl border border-zinc-800 w-fit backdrop-blur-xl">
            {['all', 'Open', 'In Progress', 'Resolved', 'Closed'].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filter === s 
                    ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50 border border-transparent'
                }`}>
                {s === 'all' ? 'All Incidents' : s}
                {s !== 'all' && (
                  <span className={`ml-2 px-1.5 py-0.5 rounded-md text-[10px] ${
                    filter === s ? 'bg-zinc-700 text-white' : 'bg-zinc-800 text-zinc-500'
                  }`}>
                    {incidents.filter(i => i.status === s).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Spinner size="lg" /></div>
          ) : (
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl pointer-events-none"></div>
              
              {filtered.length === 0 ? (
                <div className="text-center py-20 relative z-10">
                  <div className="flex justify-center mb-6 opacity-50"><Sparkles className="w-16 h-16 filter drop-shadow-lg text-emerald-400" /></div>
                  <h3 className="text-xl font-bold text-white mb-2">All clear!</h3>
                  <p className="text-zinc-500 mb-8 max-w-md mx-auto">
                    {filter === 'all' ? 'No incidents have been reported.' : `No ${filter.toLowerCase()} incidents found.`}
                  </p>
                  {filter !== 'all' && (
                    <button onClick={() => setFilter('all')} className="inline-flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-xl font-medium transition-colors border border-zinc-700">
                      View all incidents
                    </button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto relative z-10">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-950/80 border-b border-zinc-800/80">
                        <th className="text-zinc-500 text-xs font-bold uppercase tracking-wider px-6 py-5 w-16 text-center rounded-tl-3xl">#</th>
                        <th className="text-zinc-400 text-xs font-bold uppercase tracking-wider px-6 py-5">Incident Title</th>
                        <th className="text-zinc-400 text-xs font-bold uppercase tracking-wider px-6 py-5">Event</th>
                        <th className="text-zinc-400 text-xs font-bold uppercase tracking-wider px-6 py-5">Severity</th>
                        <th className="text-zinc-400 text-xs font-bold uppercase tracking-wider px-6 py-5">Status</th>
                        <th className="text-zinc-400 text-xs font-bold uppercase tracking-wider px-6 py-5">Reported</th>
                        <th className="text-zinc-400 text-xs font-bold uppercase tracking-wider px-6 py-5 text-right rounded-tr-3xl">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/80">
                      {filtered.map((inc, i) => (
                        <tr key={inc._id} className="hover:bg-zinc-800/30 transition-colors group">
                          <td className="px-6 py-4 align-middle text-center text-zinc-500 text-sm font-medium">{i + 1}</td>
                          <td className="px-6 py-4 align-middle">
                            <p className="text-white font-semibold text-sm group-hover:text-indigo-300 transition-colors">{inc.title}</p>
                            <p className="text-zinc-500 text-xs mt-0.5 truncate max-w-[250px]" title={inc.description}>{inc.description}</p>
                          </td>
                          <td className="px-6 py-4 align-middle">
                            <span className="text-zinc-300 text-sm font-medium">{inc.event?.title || '—'}</span>
                          </td>
                          <td className="px-6 py-4 align-middle">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${SEVERITY_COLORS[inc.severity] || ''}`}>
                              {inc.severity === 'Critical' && <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>}
                              {inc.severity}
                            </span>
                          </td>
                          <td className="px-6 py-4 align-middle">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${STATUS_COLORS[inc.status] || ''}`}>
                              {inc.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 align-middle text-zinc-400 text-xs font-medium">
                            {inc.createdAt ? new Date(inc.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                          </td>
                          <td className="px-6 py-4 align-middle">
                            <div className="flex justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                              <Link
                                to={`/admin/incidents/edit/${inc._id}`}
                                className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-indigo-500/20 text-zinc-400 hover:text-indigo-400 border border-zinc-700 hover:border-indigo-500/30 flex items-center justify-center transition-all shadow-sm"
                                title="Edit Incident"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                              </Link>
                              <button
                                onClick={() => handleDelete(inc._id)}
                                className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 border border-zinc-700 hover:border-rose-500/30 flex items-center justify-center transition-all shadow-sm"
                                title="Delete Incident"
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

export default AdminIncidents;
