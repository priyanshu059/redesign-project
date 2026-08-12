// src/pages/admin/AdminRegistrations.jsx - Admin View All Registrations
import { useState, useEffect } from 'react';
import api from '../../services/api';
import Sidebar from '../../components/admin/Sidebar';
import Spinner from '../../components/common/Spinner';

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
    } catch (err) {
      setMessage(err.response?.data?.message || 'Check-in failed.');
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 page-container fade-in">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">👥 All Registrations</h1>
        {message && <div className="alert alert-success mb-4">✅ {message}</div>}
        {loading ? <Spinner /> : (
          <div className="table-container">
            <table className="table bg-white">
              <thead><tr><th>#</th><th>User</th><th>Event</th><th>Date</th><th>Ticket</th><th>Checked In</th><th>Actions</th></tr></thead>
              <tbody>
                {regs.map((r, i) => (
                  <tr key={r._id}>
                    <td className="text-gray-400">{i + 1}</td>
                    <td><div className="font-medium">{r.user?.name}</div><div className="text-xs text-gray-400">{r.user?.email}</div></td>
                    <td className="font-medium">{r.event?.title}</td>
                    <td className="text-gray-500">{r.event?.date}</td>
                    <td><span className={`badge ${r.ticketType === 'VIP' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{r.ticketType}</span></td>
                    <td>{r.checkedIn ? <span className="text-green-600 font-medium">✅ Yes</span> : <span className="text-gray-400">❌ No</span>}</td>
                    <td><button onClick={() => handleCheckin(r._id)} className={`text-sm font-medium ${r.checkedIn ? 'text-orange-500' : 'text-green-600'} hover:underline`}>{r.checkedIn ? 'Undo' : 'Check In'}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminRegistrations;
