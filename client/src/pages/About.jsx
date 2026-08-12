// src/pages/About.jsx — About EventOps AI
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const STATS = [
  { count: 150, label: 'Events Managed', suffix: '+' },
  { count: 12450, label: 'Attendees', suffix: '+' },
  { count: 98, label: 'Speakers', suffix: '' },
  { count: 64, label: 'Sponsors', suffix: '' },
];

const VALUES = [
  { icon: '🤖', title: 'AI-Powered', desc: 'Six specialised agents work autonomously to handle every aspect of event operations.', gradient: 'from-purple-600 to-violet-600' },
  { icon: '📊', title: 'Real-time Intelligence', desc: 'Event health scores, bottleneck predictions, and optimisation recommendations in real time.', gradient: 'from-blue-600 to-indigo-600' },
  { icon: '👥', title: 'Attendee Centric', desc: 'Seamless experiences with automated registration, check-in, and personalised notifications.', gradient: 'from-emerald-600 to-teal-600' },
  { icon: '🛡️', title: 'Enterprise Ready', desc: 'Scalable, secure, with executive dashboards and multi-event management.', gradient: 'from-orange-500 to-amber-500' },
];

const TEAM = [
  { name: 'Sarah Johnson', role: 'CEO & Co-founder', color: '6f42c1' },
  { name: 'Michael Chen', role: 'CTO', color: '0d6efd' },
  { name: 'Emily Rodriguez', role: 'Head of Product', color: '198754' },
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
      <div className="text-4xl font-bold text-purple-400">{val.toLocaleString()}{suffix}</div>
      <div className="text-gray-400 text-sm mt-1">{label}</div>
    </div>
  );
};

const About = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-950">

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900/50 via-gray-950 to-indigo-900/30 py-20 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.15),transparent_60%)]" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-600/20 border border-purple-500/30 text-purple-400 text-sm px-4 py-2 rounded-full mb-6">
                🤖 About EventOps AI
              </div>
              <h1 className="text-5xl font-bold text-white leading-tight mb-4">
                Transforming Events with <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">AI Intelligence</span>
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                We are on a mission to transform event management through intelligent automation.
                EventOps AI is an agentic AI-powered platform where specialised AI agents collaborate
                to automate event planning, attendee management, venue operations, speaker coordination,
                sponsorship tracking, and incident handling — all in real time.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="bg-purple-600/20 border border-purple-500/30 text-purple-300 text-sm px-4 py-2 rounded-full">🤖 AI Agents</span>
                <span className="bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-sm px-4 py-2 rounded-full">⚡ Real-time</span>
                <span className="bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 text-sm px-4 py-2 rounded-full">📊 Intelligence</span>
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <div className="w-64 h-64 bg-gradient-to-br from-purple-600/30 to-indigo-600/20 rounded-3xl border border-purple-500/20 flex items-center justify-center text-9xl shadow-2xl shadow-purple-900/30">
                🤖
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16 space-y-20">

        {/* Stats */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(s => <StatItem key={s.label} {...s} />)}
        </div>

        {/* Values */}
        <div>
          <h2 className="text-3xl font-bold text-white text-center mb-2">💜 Our Values</h2>
          <p className="text-gray-400 text-center mb-10">The principles that guide everything we build</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon, title, desc, gradient }) => (
              <div key={title} className="bg-gray-900 border border-gray-700 rounded-2xl p-6 text-center hover:-translate-y-2 hover:border-purple-500/50 transition-all duration-300">
                <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg`}>
                  {icon}
                </div>
                <h3 className="text-white font-bold mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <h2 className="text-3xl font-bold text-white text-center mb-2">👥 Meet the Team</h2>
          <p className="text-gray-400 text-center mb-10">The people behind EventOps AI</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TEAM.map(({ name, role, color }) => (
              <div key={name} className="bg-gray-900 border border-gray-700 rounded-2xl p-6 text-center hover:-translate-y-2 hover:border-purple-500/50 transition-all duration-300">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=120&background=${color}&color=fff&bold=true`}
                  alt={name}
                  className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-gray-700 hover:border-purple-500 transition-colors"
                />
                <h3 className="text-white font-bold text-sm">{name}</h3>
                <p className="text-gray-400 text-xs mt-1">{role}</p>
                <div className="flex justify-center gap-3 mt-3">
                  <a href="#" className="text-gray-500 hover:text-purple-400 transition-colors text-lg">🔗</a>
                  <a href="#" className="text-gray-500 hover:text-purple-400 transition-colors text-lg">⚡</a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <h2 className="text-3xl font-bold text-white text-center mb-2">🕐 Our Journey</h2>
          <p className="text-gray-400 text-center mb-10">How we got here</p>
          <div className="max-w-xl mx-auto">
            <div className="relative pl-8 border-l-2 border-purple-600 space-y-10">
              {TIMELINE.map(({ year, title, desc }) => (
                <div key={year} className="relative">
                  <div className="absolute -left-[2.6rem] top-0.5 w-5 h-5 bg-purple-600 rounded-full border-4 border-gray-950 shadow-lg shadow-purple-900/50" />
                  <div className="text-purple-400 font-bold text-lg">{year}</div>
                  <h3 className="text-white font-semibold mt-0.5">{title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border border-purple-500/30 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Join the future of event management</h2>
          <p className="text-gray-400 mb-6">Experience the power of autonomous AI agents.</p>
          {user ? (
            <Link
              to="/dashboard"
              className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all duration-200 hover:-translate-y-0.5 shadow-lg hover:shadow-purple-900/40"
            >
              Go to Dashboard →
            </Link>
          ) : (
            <Link
              to="/register"
              className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all duration-200 hover:-translate-y-0.5 shadow-lg hover:shadow-purple-900/40"
            >
              Get Started Now →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default About;
