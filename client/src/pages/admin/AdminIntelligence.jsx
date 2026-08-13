// src/pages/admin/AdminIntelligence.jsx — AI-Powered Platform Intelligence Dashboard
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Sidebar from '../../components/admin/Sidebar';
import Spinner from '../../components/common/Spinner';
import { BrainCircuit, Calendar, ClipboardList, Star, Bot, HeartPulse, LineChart, Zap, Bell, Mic, ArrowRight, DollarSign, AlertTriangle } from 'lucide-react';

const formatInsights = (text) => {
  if (!text) return [];
  // Split on numbered items or double newlines
  return text.split(/\n\n+|\n(?=\d\.)/).map(p => p.trim()).filter(Boolean);
};

// ─── Pure-SVG Bar Chart ────────────────────────────────────────────────────────
const BarChart = ({ data }) => {
  if (!data || data.length === 0) return (
    <div className="flex items-center justify-center h-40 text-zinc-600 text-sm">No event data yet</div>
  );
  const maxVal = Math.max(...data.map(d => Math.max(d.registrations, d.capacity, 1)));
  const W = 460, H = 160, pad = 40, barGroup = (W - pad * 2) / data.length;
  const scaleY = (v) => H - 20 - (v / maxVal) * (H - 30);
  const COLORS = { reg: '#6366f1', cap: '#334155' };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 180 }}>
      {/* Y gridlines */}
      {[0, 0.25, 0.5, 0.75, 1].map(f => (
        <line key={f} x1={pad} x2={W - pad} y1={scaleY(maxVal * f)} y2={scaleY(maxVal * f)}
          stroke="#27272a" strokeWidth="1" strokeDasharray="3 3" />
      ))}
      {data.map((d, i) => {
        const x = pad + i * barGroup + barGroup * 0.1;
        const bw = barGroup * 0.35;
        const capH = H - 20 - scaleY(d.capacity);
        const regH = H - 20 - scaleY(d.registrations);
        return (
          <g key={i}>
            {/* Capacity bar (lighter) */}
            <rect x={x} y={scaleY(d.capacity)} width={bw} height={capH < 0 ? 0 : capH}
              rx="3" fill={COLORS.cap} opacity="0.7" />
            {/* Registration bar */}
            <rect x={x + bw + 2} y={scaleY(d.registrations)} width={bw} height={regH < 0 ? 0 : regH}
              rx="3" fill={COLORS.reg} />
            {/* X label */}
            <text x={x + bw} y={H - 4} textAnchor="middle" fontSize="9" fill="#71717a"
              style={{ fontFamily: 'inherit' }}>
              {d.name}
            </text>
          </g>
        );
      })}
      {/* Legend */}
      <rect x={W - pad - 80} y={6} width={10} height={10} rx="2" fill={COLORS.cap} opacity="0.7" />
      <text x={W - pad - 67} y={15} fontSize="9" fill="#71717a" style={{ fontFamily: 'inherit' }}>Capacity</text>
      <rect x={W - pad - 80} y={22} width={10} height={10} rx="2" fill={COLORS.reg} />
      <text x={W - pad - 67} y={31} fontSize="9" fill="#a5b4fc" style={{ fontFamily: 'inherit' }}>Registrations</text>
    </svg>
  );
};

// ─── Pure-SVG Donut Chart ─────────────────────────────────────────────────────
const DonutChart = ({ data }) => {
  if (!data || data.length === 0) return (
    <div className="flex items-center justify-center h-40 text-zinc-600 text-sm">No incident data yet</div>
  );
  const COLORS_MAP = { Low: '#22d3ee', Medium: '#f59e0b', High: '#f97316', Critical: '#ef4444' };
  const total = data.reduce((s, d) => s + d.value, 0);
  const cx = 70, cy = 70, r = 55, innerR = 34;
  let startAngle = -Math.PI / 2;
  const slices = data.map(d => {
    const angle = (d.value / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    startAngle += angle;
    const x2 = cx + r * Math.cos(startAngle);
    const y2 = cy + r * Math.sin(startAngle);
    const xi1 = cx + innerR * Math.cos(startAngle - angle);
    const yi1 = cy + innerR * Math.sin(startAngle - angle);
    const xi2 = cx + innerR * Math.cos(startAngle);
    const yi2 = cy + innerR * Math.sin(startAngle);
    const large = angle > Math.PI ? 1 : 0;
    return {
      path: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${innerR} ${innerR} 0 ${large} 0 ${xi1} ${yi1} Z`,
      color: COLORS_MAP[d.label] || '#6366f1',
      label: d.label,
      value: d.value,
    };
  });

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 140 140" className="w-28 h-28 shrink-0">
        {slices.map((s, i) => <path key={i} d={s.path} fill={s.color} opacity="0.9" />)}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="18" fontWeight="bold" fill="white"
          style={{ fontFamily: 'inherit' }}>{total}</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="8" fill="#71717a"
          style={{ fontFamily: 'inherit' }}>total</text>
      </svg>
      <div className="space-y-2">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ background: s.color }} />
            <span className="text-zinc-400 text-xs font-medium">{s.label}</span>
            <span className="text-white text-xs font-bold ml-auto pl-4">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};


// Inline modern StatCard for this specific page
const AIStatCard = ({ title, value, icon, color }) => {
  const colors = {
    purple: 'from-indigo-500 to-purple-500 text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    blue: 'from-blue-500 to-cyan-500 text-blue-400 bg-blue-500/10 border-blue-500/20',
    yellow: 'from-amber-500 to-orange-500 text-amber-400 bg-amber-500/10 border-amber-500/20',
    emerald: 'from-emerald-500 to-teal-500 text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  };
  const theme = colors[color] || colors.purple;
  
  return (
    <div className={`bg-zinc-900/50 backdrop-blur-xl border rounded-3xl p-6 shadow-sm relative overflow-hidden group ${theme.split(' ')[3]} ${theme.split(' ')[4]}`}>
      <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${theme.split(' ')[0]} ${theme.split(' ')[1]} rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity`}></div>
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">{title}</p>
          <h3 className={`text-3xl font-bold tracking-tight ${theme.split(' ')[2]}`}>{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-zinc-950/50 border border-zinc-800 shadow-inner`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const AdminIntelligence = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastFetched, setLastFetched] = useState(null);

  const fetchIntelligence = async () => {
    setLoading(true);
    setError('');
    try {
      const { data: res } = await api.get('/intelligence');
      setData(res);
      setLastFetched(new Date());
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate AI insights. Check your Gemini API key.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchIntelligence(); }, []);

  const insights = data ? formatInsights(data.insights) : [];

  return (
    <div className="flex min-h-screen bg-[#09090b] font-sans selection:bg-indigo-500/30">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                <BrainCircuit className="w-8 h-8 text-indigo-400" /> AI Intelligence
              </h1>
              <p className="text-zinc-400 mt-2 text-sm flex items-center gap-2">
                Real-time platform insights powered by Gemini AI
                {lastFetched && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-zinc-700 mx-1"></span>
                    <span className="text-emerald-400 font-medium">Updated {lastFetched.toLocaleTimeString()}</span>
                  </>
                )}
              </p>
            </div>
            <button
              onClick={fetchIntelligence}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Analyzing Data...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  Refresh Insights
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl px-5 py-4 mb-8 text-sm flex items-start gap-3 shadow-sm">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <div>
                <p className="font-bold mb-1">Error Loading Insights</p>
                <p className="opacity-80">{error}</p>
              </div>
            </div>
          )}

          {/* Stats */}
          {data?.stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 relative z-10">
              <AIStatCard title="Total Events" value={data.stats.totalEvents} icon={<Calendar className="w-6 h-6" />} color="purple" />
              <AIStatCard title="Total Registrations" value={data.stats.totalRegistrations} icon={<ClipboardList className="w-6 h-6" />} color="blue" />
              <AIStatCard title="Avg Feedback Rating" value={`${data.stats.avgRating} / 5`} icon={<Star className="w-6 h-6" />} color="yellow" />
              <AIStatCard title="Sponsorship Revenue" value={`$${(data.stats.totalSponsorAmount || 0).toLocaleString()}`} icon={<DollarSign className="w-6 h-6" />} color="emerald" />
            </div>
          )}

          {loading && !data ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
              <Spinner size="lg" />
              <p className="text-indigo-400 font-medium animate-pulse relative z-10">Gemini is analyzing your platform data...</p>
            </div>
          ) : (
            <>
              {/* Main Content Area */}
              {data && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
                  
                  {/* AI Insights Panel */}
                  {data?.insights && (
                    <div className="lg:col-span-2 bg-zinc-900/50 backdrop-blur-xl border border-indigo-500/30 rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(99,102,241,0.05)] flex flex-col h-full">
                      {/* Header */}
                      <div className="bg-gradient-to-r from-zinc-900 to-zinc-900/80 px-6 py-5 border-b border-indigo-500/20 flex items-center gap-4 relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none"></div>
                        <div className="w-12 h-12 bg-indigo-500/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center shadow-inner relative z-10"><Bot className="w-7 h-7 text-indigo-400" /></div>
                        <div className="relative z-10">
                          <h2 className="text-white font-bold text-lg">Gemini Analysis</h2>
                          <p className="text-indigo-400 text-xs font-medium uppercase tracking-wider mt-0.5">Executive Summary</p>
                        </div>
                      </div>

                      {/* Insights Content */}
                      <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                        {insights.length > 0 ? (
                          insights.map((paragraph, i) => (
                            <div key={i} className="flex gap-4 group">
                              <div className="w-8 h-8 bg-zinc-950/50 border border-zinc-800 rounded-xl flex items-center justify-center text-xs text-zinc-500 flex-shrink-0 font-bold group-hover:border-indigo-500/50 group-hover:text-indigo-400 transition-colors shadow-inner">
                                {i + 1}
                              </div>
                              <p className="text-zinc-300 text-sm leading-relaxed pt-1.5">{paragraph}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-zinc-400 text-sm whitespace-pre-line leading-relaxed">{data.insights}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Sidebar Setup */}
                  <div className="space-y-6">
                    {/* Platform Health */}
                    {data?.stats && (
                      <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-6 flex items-center gap-2">
                          <HeartPulse className="w-5 h-5 text-emerald-400" /> Platform Health
                        </h3>
                        {(() => {
                          const avg = parseFloat(data.stats.avgRating);
                          const score = avg >= 4 ? 'Excellent' : avg >= 3 ? 'Good' : avg >= 2 ? 'Fair' : 'Poor';
                          const color = avg >= 4 ? 'text-emerald-400' : avg >= 3 ? 'text-amber-400' : 'text-rose-400';
                          const gradient = avg >= 4 ? 'from-emerald-600 to-teal-500' : avg >= 3 ? 'from-amber-500 to-orange-500' : 'from-rose-500 to-red-600';
                          const pct = avg !== 'N/A' && !isNaN(avg) ? Math.round((avg / 5) * 100) : 0;
                          return (
                            <>
                              <div className="flex items-end justify-between mb-2">
                                <div className={`text-5xl font-bold tracking-tight ${color}`}>{pct}%</div>
                                <p className={`font-bold ${color} mb-1.5 px-3 py-1 rounded-lg bg-zinc-950/50 border border-zinc-800`}>{score}</p>
                              </div>
                              <div className="h-3 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800 mt-4 shadow-inner">
                                <div className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${pct}%` }} />
                              </div>
                              <p className="text-zinc-500 text-xs mt-3 font-medium">Based on aggregated user feedback</p>
                            </>
                          );
                        })()}
                      </div>
                    )}

                    {/* Key Metrics Summary */}
                    {data?.stats && (
                      <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-sm">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-5 flex items-center gap-2">
                          <LineChart className="w-5 h-5 text-blue-400" /> Key Metrics
                        </h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/50">
                            <span className="text-zinc-400 text-sm font-medium">Total Events</span>
                            <span className="text-white font-bold">{data.stats.totalEvents}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/50">
                            <span className="text-zinc-400 text-sm font-medium">Registrations</span>
                            <span className="text-white font-bold">{data.stats.totalRegistrations}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/50">
                            <span className="text-zinc-400 text-sm font-medium">Avg Rating</span>
                            <span className="text-amber-400 font-bold flex items-center gap-1">{data.stats.avgRating} <Star className="w-3 h-3" /></span>
                          </div>
                          {data.stats.totalEvents > 0 && (
                            <div className="flex justify-between items-center p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                              <span className="text-indigo-300 text-sm font-medium">Regs/Event</span>
                              <span className="text-indigo-400 font-bold text-lg">
                                {(data.stats.totalRegistrations / data.stats.totalEvents).toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border border-indigo-500/20 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-5 flex items-center gap-2 relative z-10">
                        <Zap className="w-5 h-5" /> Recommended Actions
                      </h3>
                      <div className="space-y-3 relative z-10">
                        {[
                          { icon: <Calendar className="w-5 h-5" />, label: 'Schedule new events', link: '/admin/events/add' },
                          { icon: <Bell className="w-5 h-5" />, label: 'Send notifications', link: '/admin/notifications/send' },
                          { icon: <Mic className="w-5 h-5" />, label: 'Add speakers', link: '/admin/speakers/add' },
                        ].map(({ icon, label, link }) => (
                          <Link key={link} to={link}
                            className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950/50 hover:bg-indigo-500/20 border border-zinc-800 hover:border-indigo-500/30 text-sm text-zinc-300 hover:text-white transition-all group">
                            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:border-indigo-500/50 transition-colors shadow-inner">{icon}</div>
                            <span className="font-medium">{label}</span>
                            <ArrowRight className="ml-auto w-4 h-4 text-zinc-500 group-hover:text-indigo-400 transition-colors group-hover:translate-x-1 transform duration-300" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Charts Row ──────────────────────────────────────────────── */}
              {data?.chartData && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 relative z-10">

                  {/* Event Registrations vs Capacity Bar Chart */}
                  <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-5 flex items-center gap-2">
                      <LineChart className="w-5 h-5 text-indigo-400" /> Registrations vs Capacity
                    </h3>
                    <BarChart data={data.chartData.eventBarData} />
                  </div>

                  {/* Incident Severity Donut */}
                  <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-5 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-400" /> Incident Severity Breakdown
                    </h3>
                    <DonutChart data={data.chartData.incidentDonut} />
                  </div>

                </div>
              )}

              {/* Empty state */}
              {!data && !error && !loading && (
                  <div className="text-center py-32 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="flex justify-center mb-6 relative z-10"><BrainCircuit className="w-16 h-16 text-indigo-500/50 filter drop-shadow-lg" /></div>
                  <h3 className="text-2xl font-bold text-white mb-2 relative z-10 tracking-tight">Intelligence Ready</h3>
                  <p className="text-zinc-500 mb-8 max-w-md mx-auto relative z-10">
                    Click "Refresh Insights" to generate a comprehensive AI analysis of your platform's current state.
                  </p>
                  <button
                    onClick={fetchIntelligence}
                    className="inline-flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-500/20 hover:-translate-y-1 relative z-10 focus:ring-4 focus:ring-indigo-500/30"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Generate Initial Insights
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminIntelligence;
