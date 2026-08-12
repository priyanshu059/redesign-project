// src/pages/Dashboard.jsx - User Dashboard
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import StatCard from '../components/common/StatCard';
import Spinner from '../components/common/Spinner';
import { formatDate } from '../utils/helpers';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/registrations/my')
      .then(({ data }) => setRegistrations(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const upcoming = registrations.filter(r => new Date(r.event?.date) >= new Date());
  const past = registrations.filter(r => new Date(r.event?.date) < new Date());

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-gray-400 mt-1">Here's what's happening with your events.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Registrations" value={registrations.length} icon="📋" color="purple" />
          <StatCard title="Upcoming Events" value={upcoming.length} icon="🗓️" color="blue" />
          <StatCard title="Past Events" value={past.length} icon="✅" color="green" />
        </div>

        {/* My Upcoming Events */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-white font-semibold text-lg">My Upcoming Events</h2>
            <Link to="/events" className="text-purple-400 hover:text-purple-300 text-sm">Browse More →</Link>
          </div>
          {upcoming.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No upcoming events.</p>
              <Link to="/events" className="text-purple-400 hover:text-purple-300 text-sm mt-2 inline-block">Browse Events →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map(reg => (
                <div key={reg._id} className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-3">
                  <div>
                    <p className="text-white font-medium">{reg.event?.title}</p>
                    <p className="text-gray-400 text-sm">{formatDate(reg.event?.date)} · {reg.event?.location}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${reg.status === 'registered' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                    {reg.status || 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { to: '/events', icon: '🔍', label: 'Browse Events' },
            { to: '/my-registrations', icon: '📋', label: 'My Registrations' },
            { to: '/assistant', icon: '🤖', label: 'AI Assistant' },
            { to: '/profile', icon: '👤', label: 'My Profile' },
          ].map(({ to, icon, label }) => (
            <Link key={to} to={to} className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl p-4 text-center transition-colors">
              <div className="text-2xl mb-2">{icon}</div>
              <p className="text-gray-300 text-sm font-medium">{label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
