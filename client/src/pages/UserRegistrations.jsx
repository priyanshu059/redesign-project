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

  if (loading) return <Spinner />;

  const checkedIn = registrations.filter(r => r.checkedIn).length;
  const pending = registrations.filter(r => !r.checkedIn).length;

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">📋 My Registrations</h1>
            <p className="text-gray-400 mt-1">Manage your event registrations</p>
          </div>
          <Link to="/dashboard" className="text-gray-400 hover:text-white text-sm transition-colors">
            ← Dashboard
          </Link>
        </div>

        {/* Alert */}
        {message && (
          <div className="bg-green-900/40 border border-green-500/50 text-green-300 rounded-xl px-4 py-3 mb-6 text-sm">
            ✅ {message}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatCard title="Total" value={registrations.length} icon="🎟️" color="purple" />
          <StatCard title="Checked In" value={checkedIn} icon="✅" color="green" />
          <StatCard title="Pending" value={pending} icon="⏳" color="yellow" />
        </div>

        {/* Table */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">
          {registrations.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-gray-400 mb-4">You haven't registered for any events yet.</p>
              <Link to="/events" className="inline-block bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-xl transition-colors">
                Browse Events
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left text-gray-400 text-xs uppercase px-6 py-4">Event</th>
                    <th className="text-left text-gray-400 text-xs uppercase px-6 py-4">Ticket</th>
                    <th className="text-left text-gray-400 text-xs uppercase px-6 py-4">Status</th>
                    <th className="text-left text-gray-400 text-xs uppercase px-6 py-4">Registered</th>
                    <th className="text-left text-gray-400 text-xs uppercase px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg) => (
                    <tr key={reg._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        {reg.event ? (
                          <>
                            <p className="text-purple-400 font-semibold">{reg.event.title}</p>
                            <p className="text-gray-500 text-xs mt-0.5">{formatDate(reg.event.date)} · {reg.event.location}</p>
                          </>
                        ) : (
                          <span className="text-gray-500 italic">Event removed</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-indigo-900/50 text-indigo-300 text-xs px-2 py-1 rounded-full border border-indigo-500/30">
                          {reg.ticketType || 'Standard'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          reg.checkedIn
                            ? 'bg-green-900/50 text-green-300 border border-green-500/30'
                            : 'bg-gray-700 text-gray-400'
                        }`}>
                          {reg.checkedIn ? '✅ Checked In' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {reg.registeredAt ? new Date(reg.registeredAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {reg.event && (
                            <Link
                              to={`/events/${reg.event._id}`}
                              className="text-blue-400 hover:text-blue-300 text-xs border border-blue-500/30 px-2 py-1 rounded-lg transition-colors"
                            >
                              👁️ View
                            </Link>
                          )}
                          {reg.event && (
                            <button
                              onClick={() => handleEditOpen(reg)}
                              className="text-yellow-400 hover:text-yellow-300 text-xs border border-yellow-500/30 px-2 py-1 rounded-lg transition-colors"
                            >
                              ✏️ Edit
                            </button>
                          )}
                          <button
                            onClick={() => handleCancel(reg._id, reg.event?.title || 'this event')}
                            className="text-red-400 hover:text-red-300 text-xs border border-red-500/30 px-2 py-1 rounded-lg transition-colors"
                          >
                            🗑️ Cancel
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
        <div className="flex gap-3 mt-4">
          <Link to="/events" className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
            + Register for New Event
          </Link>
          <Link to="/events" className="border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
            Browse Events
          </Link>
        </div>
      </div>

      {/* Edit Modal */}
      {editingReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-white font-bold text-lg mb-1">✏️ Edit Ticket Type</h3>
            <p className="text-gray-400 text-sm mb-4">{editingReg.event?.title}</p>
            <select
              value={editTicket}
              onChange={e => setEditTicket(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-purple-500"
            >
              {TICKET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <div className="flex gap-3">
              <button
                onClick={handleEditSave}
                className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-2.5 rounded-xl font-medium transition-colors"
              >
                Update
              </button>
              <button
                onClick={() => setEditingReg(null)}
                className="flex-1 border border-gray-600 hover:border-gray-400 text-gray-300 py-2.5 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRegistrations;
