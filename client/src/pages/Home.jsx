// src/pages/Home.jsx - Home / Landing Page
// Matches the original index.html with hero gradient + feature cards
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Home = () => {
  const { user } = useAuth();

  // Feature agent cards (same as original)
  const agents = [
    { icon: '📋', title: 'Registration Agent', desc: 'Automates attendee registration, ticket allocation, and check-in workflows.', color: 'bg-blue-50', badge: 'bg-blue-100 text-blue-700' },
    { icon: '🏢', title: 'Venue Agent', desc: 'Optimizes venue utilization, layout, and capacity management in real time.', color: 'bg-green-50', badge: 'bg-green-100 text-green-700' },
    { icon: '🎤', title: 'Speaker Agent', desc: 'Coordinates speaker schedules, bios, and session assignments seamlessly.', color: 'bg-purple-50', badge: 'bg-purple-100 text-purple-700' },
    { icon: '🏆', title: 'Sponsorship Agent', desc: 'Tracks sponsor commitments, ROI metrics, and deliverable completion.', color: 'bg-yellow-50', badge: 'bg-yellow-100 text-yellow-700' },
    { icon: '⚠️', title: 'Incident Agent', desc: 'Monitors and responds to on-site incidents with smart prioritization.', color: 'bg-red-50', badge: 'bg-red-100 text-red-700' },
  ];

  return (
    <div className="page-container">
      {/* ---- Hero Section ---- */}
      <div className="hero-gradient text-white text-center mb-10 relative">
        {/* Animated rotating circle (like original) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-radial opacity-10 animate-spin" style={{ animationDuration: '20s' }} />
        </div>
        <div className="relative z-10">
          <div className="text-6xl mb-4">🤖</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">EventOps AI</h1>
          <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
            Autonomous Event Management Intelligence Platform — powered by AI agents that handle every aspect of your event.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {user ? (
              <>
                <Link to="/dashboard" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105">
                  📊 Go to Dashboard
                </Link>
                <Link to="/events" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105">
                  📅 Browse Events
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105">
                  🚀 Get Started
                </Link>
                <Link to="/login" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105">
                  🔑 Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ---- Stats Section ---- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[['340+', 'Registrations'], ['5', 'AI Agents'], ['99.9%', 'Uptime'], ['12', 'Events']].map(([val, label]) => (
          <div key={label} className="card text-center p-4">
            <div className="text-3xl font-bold text-blue-600">{val}</div>
            <div className="text-sm text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* ---- AI Agents Cards ---- */}
      <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">🤖 Autonomous AI Agents</h2>
      <p className="text-gray-500 text-center mb-6">Five specialized agents work 24/7 to manage every aspect of your event</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {agents.map((agent) => (
          <div key={agent.title} className={`agent-card ${agent.color} p-6 border border-transparent`}>
            <div className="text-5xl mb-3">{agent.icon}</div>
            <span className={`badge ${agent.badge} mb-2`}>AI Powered</span>
            <h5 className="font-semibold text-gray-800 text-lg mb-2">{agent.title}</h5>
            <p className="text-gray-600 text-sm">{agent.desc}</p>
          </div>
        ))}
      </div>

      {/* ---- CTA Section ---- */}
      {!user && (
        <div className="card p-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <h3 className="text-2xl font-bold mb-3">Ready to transform your events?</h3>
          <p className="text-blue-100 mb-5">Join EventOps AI and let intelligent automation handle the hard work.</p>
          <Link to="/register" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 rounded-xl transition-all duration-200 hover:scale-105 inline-block">
            Start Free Today →
          </Link>
        </div>
      )}
    </div>
  );
};
export default Home;
