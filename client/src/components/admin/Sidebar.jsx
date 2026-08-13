// src/components/admin/Sidebar.jsx - Admin Navigation Sidebar
import { Link, useLocation } from 'react-router-dom';
import { Calendar, ClipboardList, Building2, Mic, DollarSign, AlertTriangle, Bell, Star, Bot, Shield, ArrowLeft } from 'lucide-react';

const links = [
  { to: '/admin/events', icon: <Calendar className="w-5 h-5" />, label: 'Events' },
  { to: '/admin/registrations', icon: <ClipboardList className="w-5 h-5" />, label: 'Registrations' },
  { to: '/admin/venues', icon: <Building2 className="w-5 h-5" />, label: 'Venues' },
  { to: '/admin/speakers', icon: <Mic className="w-5 h-5" />, label: 'Speakers' },
  { to: '/admin/sponsorships', icon: <DollarSign className="w-5 h-5" />, label: 'Sponsorships' },
  { to: '/admin/incidents', icon: <AlertTriangle className="w-5 h-5" />, label: 'Incidents' },
  { to: '/admin/notifications', icon: <Bell className="w-5 h-5" />, label: 'Notifications' },
  { to: '/admin/feedback', icon: <Star className="w-5 h-5" />, label: 'Feedback' },
  { to: '/admin/intelligence', icon: <Bot className="w-5 h-5" />, label: 'AI Intelligence' },
];

const Sidebar = () => {
  const location = useLocation();
  return (
    <aside className="bg-zinc-950/80 backdrop-blur-xl border-r border-zinc-800 w-64 min-h-screen flex flex-col relative z-20">
      <div className="p-6 border-b border-zinc-800/80">
        <Link to="/admin/events" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform">
            <Shield className="w-5 h-5 text-indigo-400" />
          </div>
          <h2 className="text-white font-bold tracking-tight group-hover:text-indigo-400 transition-colors">Admin Panel</h2>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto scrollbar-hide">
        {links.map(({ to, icon, label }) => {
          const isActive = location.pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-sm'
                  : 'text-zinc-400 border border-transparent hover:bg-zinc-900 hover:text-white hover:border-zinc-800/50'
              }`}
            >
              <div className={`transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>{icon}</div>
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-zinc-800/80">
        <Link to="/" className="flex items-center justify-center gap-2 text-zinc-500 hover:text-indigo-400 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/50 hover:border-indigo-500/30 text-sm py-3 rounded-xl transition-all group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Main Site
        </Link>
      </div>
    </aside>
  );
};
export default Sidebar;
