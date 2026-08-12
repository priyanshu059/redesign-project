// src/pages/About.jsx — About EventOps AI
import { useEffect, useRef, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const STATS = [
  { count: 150, label: 'Events Managed', suffix: '+' },
  { count: 12450, label: 'Attendees', suffix: '+' },
  { count: 98, label: 'Speakers', suffix: '' },
  { count: 64, label: 'Sponsors', suffix: '' },
];

const VALUES = [
  { icon: '🤖', title: 'AI-Powered', desc: 'Six specialised agents work autonomously to handle every aspect of event operations.', gradient: 'from-indigo-500 to-violet-500' },
  { icon: '📊', title: 'Real-time Intelligence', desc: 'Event health scores, bottleneck predictions, and optimisation recommendations in real time.', gradient: 'from-blue-500 to-cyan-500' },
  { icon: '👥', title: 'Attendee Centric', desc: 'Seamless experiences with automated registration, check-in, and personalised notifications.', gradient: 'from-emerald-500 to-teal-500' },
  { icon: '🛡️', title: 'Enterprise Ready', desc: 'Scalable, secure, with executive dashboards and multi-event management.', gradient: 'from-amber-500 to-orange-500' },
];

const TEAM = [
  { name: 'Sarah Johnson', role: 'CEO & Co-founder', color: '4f46e5' },
  { name: 'Michael Chen', role: 'CTO', color: '0ea5e9' },
  { name: 'Emily Rodriguez', role: 'Head of Product', color: '10b981' },
  { name: 'David Kim', role: 'Lead AI Engineer', color: 'f59e0b' },
];

const TIMELINE = [
  { year: '2024', title: 'EventOps AI Founded', desc: 'We started with a vision to revolutionise event management using AI agents.' },
  { year: '2025', title: 'Alpha Launch', desc: 'First version of the platform with Registration and Venue agents deployed.' },
  { year: '2026', title: 'Full Platform Release', desc: 'Complete suite of six AI agents, Intelligence Engine, and enterprise dashboards.' },
];

function useCountUp(target, shouldStart) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!shouldStart) return;
    let current = 0;
    const speed = Math.max(1, Math.floor(target / 100));
    const timer = setInterval(() => {
      current += speed;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(current);
    }, 15);
    return () => clearInterval(timer);
  }, [target, shouldStart]);
  return count;
}

const StatItem = ({ count, label, suffix }) => {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const val = useCountUp(count, started);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl lg:text-5xl font-bold text-white mb-2">{val.toLocaleString()}{suffix}</div>
      <div className="text-zinc-400 text-sm font-medium uppercase tracking-wider">{label}</div>
    </div>
  );
};

const About = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-[#09090b] font-sans selection:bg-indigo-500/30">
      {/* Hero */}
      <div className="relative overflow-hidden bg-zinc-950 border-b border-zinc-800">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-transparent to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium px-4 py-2 rounded-full mb-8">
                🤖 About EventOps AI
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
                Transforming Events with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">AI Intelligence</span>
              </h1>
              <p className="text-zinc-400 text-lg leading-relaxed mb-8 max-w-xl">
                We are on a mission to transform event management through intelligent automation.
                EventOps AI is an agentic AI-powered platform where specialised AI agents collaborate
                to automate event planning, attendee management, venue operations, speaker coordination,
                sponsorship tracking, and incident handling — all in real time.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm px-4 py-2 rounded-full font-medium shadow-sm">🤖 AI Agents</span>
                <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm px-4 py-2 rounded-full font-medium shadow-sm">⚡ Real-time</span>
                <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm px-4 py-2 rounded-full font-medium shadow-sm">📊 Intelligence</span>
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center relative">
              <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full"></div>
              <div className="w-80 h-80 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl flex items-center justify-center text-9xl shadow-2xl relative z-10 rotate-3 transition-transform hover:rotate-0 duration-500">
                🤖
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-32">
        {/* Stats */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-12 grid grid-cols-2 md:grid-cols-4 gap-12 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-cyan-500/5"></div>
          {STATS.map(s => <StatItem key={s.label} {...s} />)}
        </div>

        {/* Values */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Our Core Values</h2>
            <p className="text-zinc-400 text-lg">The principles that guide everything we build</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon, title, desc, gradient }) => (
              <div key={title} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 text-center hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm group">
                <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {icon}
                </div>
                <h3 className="text-white font-bold mb-3 text-lg">{title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Meet the Team</h2>
            <p className="text-zinc-400 text-lg">The innovators behind EventOps AI</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {TEAM.map(({ name, role, color }) => (
              <div key={name} className="text-center group">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <div className={`absolute inset-0 bg-zinc-800 rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-300`} style={{ backgroundColor: `#${color}` }}></div>
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200&background=${color}&color=fff&bold=true`}
                    alt={name}
                    className="relative w-32 h-32 rounded-full border-4 border-[#09090b] shadow-xl group-hover:scale-105 transition-transform duration-300 object-cover"
                  />
                </div>
                <h3 className="text-white font-bold text-lg">{name}</h3>
                <p className="text-zinc-400 text-sm mt-1">{role}</p>
                <div className="flex justify-center gap-3 mt-4">
                  <a href="#" className="text-zinc-500 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto bg-zinc-900/30 border border-zinc-800 rounded-3xl p-12 lg:p-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Our Journey</h2>
            <p className="text-zinc-400 text-lg">How we got here</p>
          </div>
          <div className="relative pl-8 md:pl-0">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-zinc-800 -translate-x-1/2"></div>
            <div className="md:hidden absolute left-0 top-0 bottom-0 w-px bg-zinc-800"></div>
            
            <div className="space-y-12">
              {TIMELINE.map(({ year, title, desc }, idx) => (
                <div key={year} className={`relative flex flex-col md:flex-row items-start md:items-center ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="absolute -left-[33px] md:left-1/2 md:-translate-x-1/2 w-4 h-4 bg-indigo-500 rounded-full border-4 border-[#09090b] shadow-lg shadow-indigo-500/50 mt-1.5 md:mt-0 z-10" />
                  
                  <div className={`w-full md:w-1/2 ${idx % 2 === 0 ? 'md:pl-12' : 'md:pr-12 text-left md:text-right'}`}>
                    <div className="text-indigo-400 font-bold text-xl mb-1">{year}</div>
                    <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
                    <p className="text-zinc-400 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-900 rounded-3xl p-16 text-center max-w-5xl mx-auto shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">Join the future of event management</h2>
            <p className="text-indigo-200 text-lg mb-10 max-w-2xl mx-auto">Experience the power of autonomous AI agents. Start automating your events today.</p>
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 bg-white text-indigo-900 hover:bg-zinc-100 font-bold px-10 py-4 rounded-xl transition-all shadow-xl hover:shadow-indigo-500/25"
              >
                Go to Dashboard
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            ) : (
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-white text-indigo-900 hover:bg-zinc-100 font-bold px-10 py-4 rounded-xl transition-all shadow-xl hover:shadow-indigo-500/25"
              >
                Get Started Now
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
