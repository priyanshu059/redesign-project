// src/pages/admin/AdminVenues.jsx — Admin Manage Venues
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Sidebar from '../../components/admin/Sidebar';
import Spinner from '../../components/common/Spinner';

const AdminVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');

  const fetchVenues = () => {
    setLoading(true);
    api.get('/venues').then(({ data }) => setVenues(data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchVenues(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete venue "${name}"?`)) return;
    await api.delete(`/venues/${id}`);
    setMessage('Venue deleted successfully.');
    fetchVenues();
    setTimeout(() => setMessage(''), 3000);
  };

  const filtered = venues.filter(v =>
    v.name?.toLowerCase().includes(search.toLowerCase()) ||
    v.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-950 p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">🏢 Manage Venues</h1>
            <p className="text-gray-400 text-sm mt-0.5">{venues.length} venue{venues.length !== 1 ? 's' : ''} total</p>
          </div>
          <Link to="/admin/venues/add" className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
            + Add Venue
          </Link>
        </div>

        {message && (
          <div className="bg-green-900/40 border border-green-500/50 text-green-300 rounded-xl px-4 py-3 mb-4 text-sm">✅ {message}</div>
        )}

        {/* Search */}
        <div className="mb-4">
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Search by name or city…"
            className="bg-gray-900 border border-gray-700 focus:border-purple-500 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors w-full max-w-xs"
          />
        </div>

        {loading ? <Spinner /> : (
          <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-3">🏢</div>
                <p className="text-gray-400">{search ? 'No venues match your search.' : 'No venues yet. Add one!'}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left text-gray-400 text-xs uppercase px-6 py-4">#</th>
                      <th className="text-left text-gray-400 text-xs uppercase px-6 py-4">Name</th>
                      <th className="text-left text-gray-400 text-xs uppercase px-6 py-4">City</th>
                      <th className="text-left text-gray-400 text-xs uppercase px-6 py-4">Capacity</th>
                      <th className="text-left text-gray-400 text-xs uppercase px-6 py-4">Contact</th>
                      <th className="text-left text-gray-400 text-xs uppercase px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((v, i) => (
                      <tr key={v._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4 text-gray-500 text-sm">{i + 1}</td>
                        <td className="px-6 py-4">
                          <p className="text-white font-semibold">{v.name}</p>
                          <p className="text-gray-500 text-xs mt-0.5">{v.address}</p>
                        </td>
                        <td className="px-6 py-4 text-gray-300 text-sm">{v.city}</td>
                        <td className="px-6 py-4">
                          <span className="bg-indigo-900/40 text-indigo-300 text-xs px-2 py-1 rounded-full">👥 {v.capacity}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-sm">{v.contactPerson || '—'}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Link to={`/admin/venues/edit/${v._id}`} className="text-blue-400 hover:text-blue-300 text-xs border border-blue-500/30 px-2 py-1 rounded-lg transition-colors">✏️ Edit</Link>
                            <button onClick={() => handleDelete(v._id, v.name)} className="text-red-400 hover:text-red-300 text-xs border border-red-500/30 px-2 py-1 rounded-lg transition-colors">🗑️ Delete</button>
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

export default AdminVenues;
