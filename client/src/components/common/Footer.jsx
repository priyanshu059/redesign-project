// src/components/common/Footer.jsx
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-[#09090b] border-t border-zinc-800 mt-auto font-sans">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-4 group inline-flex">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:bg-indigo-600 transition-colors">
              <span className="text-white text-sm font-bold">E</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">EventOps AI</span>
          </Link>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
            The intelligent event management platform powered by autonomous AI agents. Automate the hard work and focus on creating unforgettable experiences.
          </p>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Platform</h4>
          <div className="flex flex-col gap-3">
            <Link to="/events" className="text-zinc-400 hover:text-indigo-400 text-sm font-medium transition-colors">Browse Events</Link>
            <Link to="/about" className="text-zinc-400 hover:text-indigo-400 text-sm font-medium transition-colors">About Us</Link>
            <Link to="/contact" className="text-zinc-400 hover:text-indigo-400 text-sm font-medium transition-colors">Contact</Link>
          </div>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Account</h4>
          <div className="flex flex-col gap-3">
            <Link to="/login" className="text-zinc-400 hover:text-indigo-400 text-sm font-medium transition-colors">Log In</Link>
            <Link to="/register" className="text-zinc-400 hover:text-indigo-400 text-sm font-medium transition-colors">Create Account</Link>
          </div>
        </div>
      </div>
      
      <div className="border-t border-zinc-800/80 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-zinc-500 text-sm font-medium">
          © {new Date().getFullYear()} EventOps AI. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link to="/privacy" className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm font-medium">Privacy Policy</Link>
          <span className="text-zinc-700">•</span>
          <Link to="/terms" className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm font-medium">Terms of Service</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
