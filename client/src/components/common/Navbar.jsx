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
    <nav className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <span className="text-white font-bold text-xl">EventOps AI</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/events" className="text-gray-300 hover:text-white transition-colors">Browse Events</Link>
            {isLoggedIn && <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>}
            {isLoggedIn && <Link to="/assistant" className="text-gray-300 hover:text-white transition-colors">AI Assistant</Link>}
            {isAdmin && <Link to="/admin/events" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">Admin Panel</Link>}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link>
                <Link to="/register" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-gray-300 text-sm hidden md:block">Hi, {user?.name?.split(' ')[0]}</span>
                <Link to="/profile" className="text-gray-300 hover:text-white transition-colors text-sm">Profile</Link>
                <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors">
                  Logout
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
