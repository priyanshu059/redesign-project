// src/pages/Home.jsx - Home / Landing Page
import { Link } from 'react-router-dom';
import { ClipboardList, Building2, Mic, Trophy, AlertTriangle, LayoutGrid, ArrowRight } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const Home = () => {
  const { user } = useAuth();

  // Feature agent cards (same as original)
  const agents = [
    { icon: <ClipboardList className="w-8 h-8 text-blue-400" />, title: 'Registration Agent', desc: 'Automates attendee registration, ticket allocation, and check-in workflows.', color: 'from-blue-500/10 to-blue-500/5', badge: 'bg-blue-500/20 text-blue-300', border: 'border-blue-500/20' },
    { icon: <Building2 className="w-8 h-8 text-emerald-400" />, title: 'Venue Agent', desc: 'Optimizes venue utilization, layout, and capacity management in real time.', color: 'from-emerald-500/10 to-emerald-500/5', badge: 'bg-emerald-500/20 text-emerald-300', border: 'border-emerald-500/20' },
    { icon: <Mic className="w-8 h-8 text-purple-400" />, title: 'Speaker Agent', desc: 'Coordinates speaker schedules, bios, and session assignments seamlessly.', color: 'from-purple-500/10 to-purple-500/5', badge: 'bg-purple-500/20 text-purple-300', border: 'border-purple-500/20' },
    { icon: <Trophy className="w-8 h-8 text-amber-400" />, title: 'Sponsorship Agent', desc: 'Tracks sponsor commitments, ROI metrics, and deliverable completion.', color: 'from-amber-500/10 to-amber-500/5', badge: 'bg-amber-500/20 text-amber-300', border: 'border-amber-500/20' },
    { icon: <AlertTriangle className="w-8 h-8 text-rose-400" />, title: 'Incident Agent', desc: 'Monitors and responds to on-site incidents with smart prioritization.', color: 'from-rose-500/10 to-rose-500/5', badge: 'bg-rose-500/20 text-rose-300', border: 'border-rose-500/20' },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] font-sans selection:bg-indigo-500/30 pb-20">
      {/* ---- Hero Section ---- */}
      <div className="relative overflow-hidden border-b border-zinc-800 bg-zinc-950">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/80 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-40">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              EventOps AI 2.0 is live
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6">
              Autonomous events,<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                engineered for perfection.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl leading-relaxed">
              The premier event management platform powered by AI agents. Orchestrate everything from ticketing to on-site incident response without lifting a finger.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              {user ? (
                <>
                  <Link to="/dashboard" className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2">
                    <LayoutGrid className="w-5 h-5" />
                    Go to Dashboard
                  </Link>
                  <Link to="/events" className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-8 py-4 rounded-xl transition-all border border-zinc-700">
                    Browse Events
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="bg-white text-zinc-950 hover:bg-zinc-200 font-semibold px-8 py-4 rounded-xl transition-all shadow-lg flex items-center gap-2">
                    Get Started Free
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to="/login" className="bg-zinc-900/50 hover:bg-zinc-800 text-white font-semibold px-8 py-4 rounded-xl transition-all border border-zinc-800 backdrop-blur-sm">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 mb-24">
        {/* ---- Stats Section ---- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
          {[['340+', 'Registrations'], ['5', 'AI Agents'], ['99.9%', 'Uptime'], ['12', 'Events']].map(([val, label]) => (
            <div key={label} className="text-center p-4">
              <div className="text-3xl font-bold text-white mb-1">{val}</div>
              <div className="text-sm font-medium text-zinc-500 uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        {/* ---- AI Agents Cards ---- */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Autonomous AI Agents</h2>
          <p className="text-zinc-400 text-lg">Five specialized agents work 24/7 to manage every aspect of your event, seamlessly passing context to one another.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div key={agent.title} className={`bg-gradient-to-br ${agent.color} border ${agent.border} rounded-2xl p-8 transition-transform hover:-translate-y-1 backdrop-blur-sm`}>
              <div className="text-4xl mb-6 bg-zinc-900/50 w-16 h-16 rounded-xl flex items-center justify-center border border-zinc-800/50 shadow-inner">
                {agent.icon}
              </div>
              <div className="flex items-center gap-2 mb-4">
                <h5 className="font-bold text-white text-xl">{agent.title}</h5>
              </div>
              <div className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold mb-4 ${agent.badge}`}>
                AI Powered
              </div>
              <p className="text-zinc-400 leading-relaxed">{agent.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ---- CTA Section ---- */}
      {!user && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-900 border border-indigo-500/30 p-12 text-center">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">Ready to transform your events?</h3>
              <p className="text-indigo-200 text-lg mb-10">
                Join EventOps AI and let intelligent automation handle the hard work, so you can focus on delivering an incredible experience.
              </p>
              <Link to="/register" className="bg-white text-indigo-900 hover:bg-zinc-100 font-semibold px-10 py-4 rounded-xl transition-all shadow-xl hover:shadow-indigo-500/25 inline-flex items-center gap-2">
                Start Free Today
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Home;
