// src/pages/admin/AdminEvents.jsx - Admin Manage Events
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Sidebar from '../../components/admin/Sidebar';
import Spinner from '../../components/common/Spinner';
import { getStatusColor } from '../../utils/helpers';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchEvents = () => api.get('/events').then(({ data }) => setEvents(data)).finally(() => setLoading(false));
  useEffect(() => { fetchEvents(); }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete event "${title}"?`)) return;
    try {
      await api.delete(`/events/${id}`);
      setMessage('Event deleted successfully');
      fetchEvents();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to delete event.');
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 page-container fade-in">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">📅 Manage Events</h1>
          <Link to="/admin/events/add" className="btn-primary text-sm">+ Add Event</Link>
        </div>
        {message && <div className="alert alert-success mb-4">✅ {message}</div>}
        {loading ? <Spinner /> : (
          <div className="table-container">
            <table className="table bg-white">
              <thead><tr><th>#</th><th>Title</th><th>Date</th><th>Location</th><th>Capacity</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {events.map((ev, i) => (
                  <tr key={ev._id}>
                    <td className="text-gray-400">{i + 1}</td>
                    <td className="font-medium">{ev.title}</td>
                    <td className="text-gray-500">{ev.date}</td>
                    <td className="text-gray-500">{ev.location}</td>
                    <td>{ev.capacity}</td>
                    <td><span className={`badge ${getStatusColor(ev.status)} capitalize`}>{ev.status}</span></td>
                    <td className="flex gap-2">
                      <Link to={`/admin/events/edit/${ev._id}`} className="text-blue-600 hover:underline text-sm">Edit</Link>
                      <button onClick={() => handleDelete(ev._id, ev.title)} className="text-red-500 hover:underline text-sm">Delete</button>
                    </td>
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
export default AdminEvents;
