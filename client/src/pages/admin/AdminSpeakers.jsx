// src/pages/admin/AdminSpeakers.jsx — Admin Manage Speakers
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Sidebar from '../../components/admin/Sidebar';
import Spinner from '../../components/common/Spinner';

const AdminSpeakers = () => {
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');

  const fetchSpeakers = () => {
    setLoading(true);
    api.get('/speakers').then(({ data }) => setSpeakers(data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchSpeakers(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete speaker "${name}"?`)) return;
    await api.delete(`/speakers/${id}`);
    setMessage('Speaker deleted.');
    fetchSpeakers();
    setTimeout(() => setMessage(''), 3000);
  };

  const filtered = speakers.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.sessionTitle?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-950 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">🎤 Manage Speakers</h1>
            <p className="text-gray-400 text-sm mt-0.5">{speakers.length} speaker{speakers.length !== 1 ? 's' : ''}</p>
          </div>
          <Link to="/admin/speakers/add" className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">+ Add Speaker</Link>
        </div>

        {message && <div className="bg-green-900/40 border border-green-500/50 text-green-300 rounded-xl px-4 py-3 mb-4 text-sm">✅ {message}</div>}

        <div className="mb-4">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search speakers…"
            className="bg-gray-900 border border-gray-700 focus:border-purple-500 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors w-full max-w-xs" />
        </div>

        {loading ? <Spinner /> : (
          <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-3">🎤</div>
                <p className="text-gray-400">No speakers found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      {['#', 'Speaker', 'Session', 'Schedule', 'Available', 'Actions'].map(h => (
                        <th key={h} className="text-left text-gray-400 text-xs uppercase px-6 py-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s, i) => (
                      <tr key={s._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4 text-gray-500 text-sm">{i + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-purple-600/30 flex items-center justify-center text-sm font-bold text-purple-300">
                              {s.name?.charAt(0)}
                            </div>
                            <div>
                              <p className="text-white font-semibold text-sm">{s.name}</p>
                              <p className="text-gray-500 text-xs">{s.bio?.slice(0, 50)}{s.bio?.length > 50 ? '…' : ''}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-300 text-sm">{s.sessionTitle || '—'}</td>
                        <td className="px-6 py-4 text-gray-400 text-sm">{s.schedule || '—'}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${s.availability ? 'bg-green-900/50 text-green-300 border border-green-500/30' : 'bg-red-900/50 text-red-300 border border-red-500/30'}`}>
                            {s.availability ? '✅ Yes' : '❌ No'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Link to={`/admin/speakers/edit/${s._id}`} className="text-blue-400 hover:text-blue-300 text-xs border border-blue-500/30 px-2 py-1 rounded-lg transition-colors">✏️ Edit</Link>
                            <button onClick={() => handleDelete(s._id, s.name)} className="text-red-400 hover:text-red-300 text-xs border border-red-500/30 px-2 py-1 rounded-lg transition-colors">🗑️ Delete</button>
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

export default AdminSpeakers;
