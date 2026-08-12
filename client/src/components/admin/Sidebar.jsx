// src/components/admin/Sidebar.jsx - Admin Navigation Sidebar
import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/admin/events', icon: '🗓️', label: 'Events' },
  { to: '/admin/registrations', icon: '📋', label: 'Registrations' },
  { to: '/admin/venues', icon: '🏛️', label: 'Venues' },
  { to: '/admin/speakers', icon: '🎤', label: 'Speakers' },
  { to: '/admin/sponsorships', icon: '💰', label: 'Sponsorships' },
  { to: '/admin/incidents', icon: '⚠️', label: 'Incidents' },
  { to: '/admin/notifications', icon: '🔔', label: 'Notifications' },
  { to: '/admin/feedback', icon: '⭐', label: 'Feedback' },
  { to: '/admin/intelligence', icon: '🤖', label: 'AI Intelligence' },
];

const Sidebar = () => {
  const location = useLocation();
  return (
    <aside className="bg-gray-900 border-r border-gray-700 w-64 min-h-screen flex flex-col">
      <div className="p-5 border-b border-gray-700">
        <p className="text-purple-400 font-semibold text-sm uppercase tracking-wider">Admin Panel</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
              location.pathname === to
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span>{icon}</span>
            <span>{label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <Link to="/" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">← Back to Site</Link>
      </div>
    </aside>
  );
};
export default Sidebar;
