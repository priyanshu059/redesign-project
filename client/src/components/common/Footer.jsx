// src/components/common/Footer.jsx
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-gray-900 border-t border-gray-700 mt-auto">
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-bold text-lg mb-3">🎯 EventOps AI</h3>
          <p className="text-gray-400 text-sm">AI-powered event management platform for modern organizers.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <div className="flex flex-col gap-2">
            <Link to="/events" className="text-gray-400 hover:text-white text-sm transition-colors">Browse Events</Link>
            <Link to="/about" className="text-gray-400 hover:text-white text-sm transition-colors">About Us</Link>
            <Link to="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">Contact</Link>
          </div>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Account</h4>
          <div className="flex flex-col gap-2">
            <Link to="/login" className="text-gray-400 hover:text-white text-sm transition-colors">Login</Link>
            <Link to="/register" className="text-gray-400 hover:text-white text-sm transition-colors">Register</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} EventOps AI. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
