// src/pages/admin/AdminIncidents.jsx — Admin Manage Incidents
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Sidebar from '../../components/admin/Sidebar';
import Spinner from '../../components/common/Spinner';

const SEVERITY_COLORS = {
  Low: 'bg-green-900/50 text-green-300 border-green-500/30',
  Medium: 'bg-yellow-900/50 text-yellow-300 border-yellow-500/30',
  High: 'bg-orange-900/50 text-orange-300 border-orange-500/30',
  Critical: 'bg-red-900/50 text-red-300 border-red-500/30',
};
const STATUS_COLORS = {
  Open: 'bg-blue-900/50 text-blue-300 border-blue-500/30',
  'In Progress': 'bg-yellow-900/50 text-yellow-300 border-yellow-500/30',
  Resolved: 'bg-green-900/50 text-green-300 border-green-500/30',
  Closed: 'bg-gray-700 text-gray-400 border-gray-600',
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
    setMessage('Incident deleted.');
    fetchIncidents();
    setTimeout(() => setMessage(''), 3000);
  };

  const filtered = filter === 'all' ? incidents : incidents.filter(i => i.status === filter);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-950 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">⚠️ Manage Incidents</h1>
            <p className="text-gray-400 text-sm mt-0.5">{incidents.length} incident{incidents.length !== 1 ? 's' : ''} reported</p>
          </div>
          <Link to="/admin/incidents/add" className="bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">+ Report Incident</Link>
        </div>

        {message && <div className="bg-green-900/40 border border-green-500/50 text-green-300 rounded-xl px-4 py-3 mb-4 text-sm">✅ {message}</div>}

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {['all', 'Open', 'In Progress', 'Resolved', 'Closed'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === s ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
              {s === 'all' ? '🔍 All' : s}
            </button>
          ))}
        </div>

        {loading ? <Spinner /> : (
          <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-3">✅</div>
                <p className="text-gray-400">{filter === 'all' ? 'No incidents reported.' : `No ${filter} incidents.`}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      {['#', 'Title', 'Event', 'Severity', 'Status', 'Reported', 'Actions'].map(h => (
                        <th key={h} className="text-left text-gray-400 text-xs uppercase px-6 py-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((inc, i) => (
                      <tr key={inc._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4 text-gray-500 text-sm">{i + 1}</td>
                        <td className="px-6 py-4">
                          <p className="text-white font-semibold text-sm">{inc.title}</p>
                          <p className="text-gray-500 text-xs mt-0.5">{inc.description?.slice(0, 60)}{inc.description?.length > 60 ? '…' : ''}</p>
                        </td>
                        <td className="px-6 py-4 text-gray-300 text-sm">{inc.event?.title || '—'}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2 py-1 rounded-full border ${SEVERITY_COLORS[inc.severity] || ''}`}>{inc.severity}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2 py-1 rounded-full border ${STATUS_COLORS[inc.status] || ''}`}>{inc.status}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-xs">{inc.createdAt ? new Date(inc.createdAt).toLocaleDateString() : '—'}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Link to={`/admin/incidents/edit/${inc._id}`} className="text-blue-400 hover:text-blue-300 text-xs border border-blue-500/30 px-2 py-1 rounded-lg transition-colors">✏️ Edit</Link>
                            <button onClick={() => handleDelete(inc._id)} className="text-red-400 hover:text-red-300 text-xs border border-red-500/30 px-2 py-1 rounded-lg transition-colors">🗑️</button>
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
  );
};

export default AdminIncidents;
