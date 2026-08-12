// src/components/common/Navbar.jsx - Navigation Bar
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { isLoggedIn, isAdmin, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:bg-indigo-600 transition-colors">
              <span className="text-white text-sm font-bold">E</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">EventOps</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/events" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">Browse Events</Link>
            {isLoggedIn && <Link to="/dashboard" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">Dashboard</Link>}
            {isLoggedIn && <Link to="/assistant" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">AI Assistant</Link>}
            {isAdmin && <Link to="/admin/events" className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-medium">Admin Panel</Link>}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">Log in</Link>
                <Link to="/register" className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl transition-colors text-sm font-medium shadow-lg shadow-indigo-500/20">
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-zinc-400 text-sm hidden md:block">Hi, {user?.name?.split(' ')[0]}</span>
                <Link to="/profile" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">Profile</Link>
                <button onClick={handleLogout} className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-zinc-700">
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
