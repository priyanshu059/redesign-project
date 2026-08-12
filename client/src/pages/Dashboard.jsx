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

  if (loading) return <div className="min-h-screen bg-[#09090b] flex items-center justify-center"><Spinner size="lg" /></div>;

  const upcoming = registrations.filter(r => new Date(r.event?.date) >= new Date());
  const past = registrations.filter(r => new Date(r.event?.date) < new Date());

  return (
    <div className="min-h-screen bg-[#09090b] py-12 px-4 font-sans selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">{user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p className="text-zinc-400 mt-2 text-lg">Here's what's happening with your events.</p>
          </div>
          <Link to="/events" className="inline-flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5">
            Discover Events
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <StatCard title="Total Registrations" value={registrations.length} icon="📋" color="purple" />
          <StatCard title="Upcoming Events" value={upcoming.length} icon="🗓️" color="blue" />
          <StatCard title="Past Events" value={past.length} icon="✅" color="green" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* My Upcoming Events */}
          <div className="lg:col-span-2 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex justify-between items-center mb-6">
              <h2 className="text-white font-bold text-xl tracking-tight">My Upcoming Events</h2>
              <Link to="/events" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors flex items-center gap-1">
                Browse More <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
            {upcoming.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-zinc-800 rounded-2xl relative z-10">
                <div className="text-4xl mb-3">🎫</div>
                <p className="text-zinc-400 mb-4">You have no upcoming events.</p>
                <Link to="/events" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Find an event to attend</Link>
              </div>
            ) : (
              <div className="space-y-4 relative z-10">
                {upcoming.map(reg => (
                  <div key={reg._id} className="group flex items-center justify-between bg-zinc-950/50 border border-zinc-800 hover:border-indigo-500/50 rounded-2xl px-5 py-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center font-bold text-xl border border-indigo-500/20 group-hover:scale-110 transition-transform">
                        {new Date(reg.event?.date).getDate()}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-lg mb-0.5 group-hover:text-indigo-300 transition-colors">{reg.event?.title}</p>
                        <p className="text-zinc-500 text-sm flex items-center gap-2">
                          <span>{formatDate(reg.event?.date)}</span>
                          <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>
                          <span className="truncate max-w-[150px] sm:max-w-xs">{reg.event?.location}</span>
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg border ${reg.status === 'registered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                      {reg.status || 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <h2 className="text-white font-bold text-xl tracking-tight mb-2">Quick Actions</h2>
            {[
              { to: '/events', icon: '🔍', label: 'Browse Events', desc: 'Find new events to attend' },
              { to: '/my-registrations', icon: '📋', label: 'My Registrations', desc: 'View all your tickets' },
              { to: '/assistant', icon: '🤖', label: 'AI Assistant', desc: 'Get help from EventOps AI' },
              { to: '/profile', icon: '👤', label: 'My Profile', desc: 'Manage your account' },
            ].map(({ to, icon, label, desc }) => (
              <Link key={to} to={to} className="group bg-zinc-900/50 backdrop-blur-md hover:bg-zinc-800/80 border border-zinc-800 hover:border-indigo-500/30 rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:-translate-x-1">
                <div className="w-12 h-12 bg-zinc-800 border border-zinc-700 text-2xl rounded-xl flex items-center justify-center shadow-sm group-hover:bg-indigo-500/20 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-all">
                  {icon}
                </div>
                <div>
                  <p className="text-white font-semibold group-hover:text-indigo-300 transition-colors">{label}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">{desc}</p>
                </div>
                <div className="ml-auto text-zinc-600 group-hover:text-indigo-400 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
