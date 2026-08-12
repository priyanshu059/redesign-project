// src/pages/admin/AdminSponsorships.jsx — Admin Manage Sponsorships
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Sidebar from '../../components/admin/Sidebar';
import Spinner from '../../components/common/Spinner';

const TYPE_COLORS = {
  Platinum: 'bg-blue-900/50 text-blue-300 border-blue-500/30',
  Gold: 'bg-yellow-900/50 text-yellow-300 border-yellow-500/30',
  Silver: 'bg-gray-700/50 text-gray-300 border-gray-500/30',
  Bronze: 'bg-orange-900/50 text-orange-300 border-orange-500/30',
  Other: 'bg-purple-900/50 text-purple-300 border-purple-500/30',
};
const STATUS_COLORS = {
  Confirmed: 'bg-green-900/50 text-green-300 border-green-500/30',
  Pending: 'bg-yellow-900/50 text-yellow-300 border-yellow-500/30',
  Cancelled: 'bg-red-900/50 text-red-300 border-red-500/30',
};

const AdminSponsorships = () => {
  const [sponsorships, setSponsorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchSponsorships = () => {
    setLoading(true);
    api.get('/sponsorships').then(({ data }) => setSponsorships(data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchSponsorships(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete sponsorship from "${name}"?`)) return;
    await api.delete(`/sponsorships/${id}`);
    setMessage('Sponsorship deleted.');
    fetchSponsorships();
    setTimeout(() => setMessage(''), 3000);
  };

  const totalAmount = sponsorships.reduce((sum, s) => sum + (s.amount || 0), 0);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-950 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">🤝 Manage Sponsorships</h1>
            <p className="text-gray-400 text-sm mt-0.5">{sponsorships.length} sponsorship{sponsorships.length !== 1 ? 's' : ''} · Total: ${totalAmount.toLocaleString()}</p>
          </div>
          <Link to="/admin/sponsorships/add" className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">+ Add Sponsorship</Link>
        </div>

        {message && <div className="bg-green-900/40 border border-green-500/50 text-green-300 rounded-xl px-4 py-3 mb-4 text-sm">✅ {message}</div>}

        {loading ? <Spinner /> : (
          <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">
            {sponsorships.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-3">🤝</div>
                <p className="text-gray-400">No sponsorships yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      {['#', 'Sponsor', 'Event', 'Type', 'Amount', 'Status', 'Actions'].map(h => (
                        <th key={h} className="text-left text-gray-400 text-xs uppercase px-6 py-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sponsorships.map((s, i) => (
                      <tr key={s._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4 text-gray-500 text-sm">{i + 1}</td>
                        <td className="px-6 py-4">
                          <p className="text-white font-semibold">{s.sponsorName}</p>
                          <p className="text-gray-500 text-xs">{s.contactEmail}</p>
                        </td>
                        <td className="px-6 py-4 text-gray-300 text-sm">{s.event?.title || '—'}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2 py-1 rounded-full border ${TYPE_COLORS[s.sponsorType] || TYPE_COLORS.Other}`}>{s.sponsorType}</span>
                        </td>
                        <td className="px-6 py-4 text-emerald-400 font-semibold text-sm">${s.amount?.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2 py-1 rounded-full border ${STATUS_COLORS[s.status] || ''}`}>{s.status}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Link to={`/admin/sponsorships/edit/${s._id}`} className="text-blue-400 hover:text-blue-300 text-xs border border-blue-500/30 px-2 py-1 rounded-lg transition-colors">✏️ Edit</Link>
                            <button onClick={() => handleDelete(s._id, s.sponsorName)} className="text-red-400 hover:text-red-300 text-xs border border-red-500/30 px-2 py-1 rounded-lg transition-colors">🗑️ Delete</button>
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

export default AdminSponsorships;
