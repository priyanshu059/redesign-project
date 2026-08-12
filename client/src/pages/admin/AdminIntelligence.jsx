// src/pages/admin/AdminIntelligence.jsx — AI-Powered Platform Intelligence Dashboard
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Sidebar from '../../components/admin/Sidebar';
import Spinner from '../../components/common/Spinner';
import StatCard from '../../components/common/StatCard';

const formatInsights = (text) => {
  if (!text) return [];
  // Split on numbered items or double newlines
  return text.split(/\n\n+|\n(?=\d\.)/).map(p => p.trim()).filter(Boolean);
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
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-950 p-8">

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">🧠 AI Intelligence</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              Real-time platform insights powered by Gemini AI
              {lastFetched && <span className="ml-2 text-gray-600">· Updated {lastFetched.toLocaleTimeString()}</span>}
            </p>
          </div>
          <button
            onClick={fetchIntelligence}
            disabled={loading}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-60 hover:-translate-y-0.5"
          >
            {loading ? '⏳ Analysing…' : '🔄 Refresh Insights'}
          </button>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-500/50 text-red-300 rounded-2xl px-6 py-4 mb-6">
            <p className="font-semibold">⚠️ Error Loading Insights</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Stats */}
        {data?.stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatCard title="Total Events" value={data.stats.totalEvents} icon="📅" color="purple" />
            <StatCard title="Total Registrations" value={data.stats.totalRegistrations} icon="📋" color="blue" />
            <StatCard title="Avg Feedback Rating" value={`${data.stats.avgRating} / 5`} icon="⭐" color="yellow" />
          </div>
        )}

        {loading && !data ? <Spinner /> : (
          <>
            {/* AI Insights Panel */}
            {data?.insights && (
              <div className="bg-gray-900 border border-indigo-500/30 rounded-2xl overflow-hidden mb-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 px-6 py-4 border-b border-indigo-500/20 flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600/30 rounded-xl flex items-center justify-center text-xl">🤖</div>
                  <div>
                    <h2 className="text-white font-bold">Gemini AI Analysis</h2>
                    <p className="text-indigo-300 text-xs">Based on your current platform data</p>
                  </div>
                </div>

                {/* Insights Content */}
                <div className="p-6 space-y-4">
                  {insights.length > 0 ? (
                    insights.map((paragraph, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-6 h-6 bg-indigo-600/20 rounded-full flex items-center justify-center text-xs text-indigo-400 flex-shrink-0 mt-0.5 font-bold">
                          {i + 1}
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">{paragraph}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm whitespace-pre-line">{data.insights}</p>
                  )}
                </div>
              </div>
            )}

            {/* Quick Metrics Grid */}
            {data?.stats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Platform Health */}
                <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
                  <h3 className="text-white font-semibold mb-4">💚 Platform Health</h3>
                  {(() => {
                    const avg = parseFloat(data.stats.avgRating);
                    const score = avg >= 4 ? 'Excellent' : avg >= 3 ? 'Good' : avg >= 2 ? 'Fair' : 'Poor';
                    const color = avg >= 4 ? 'text-green-400' : avg >= 3 ? 'text-yellow-400' : 'text-red-400';
                    const pct = avg !== 'N/A' ? Math.round((avg / 5) * 100) : 0;
                    return (
                      <>
                        <div className={`text-4xl font-bold ${color} mb-1`}>{pct}%</div>
                        <p className={`text-sm ${color} mb-4`}>{score}</p>
                        <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-green-600 to-emerald-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                        </div>
                        <p className="text-gray-500 text-xs mt-2">Based on avg feedback rating</p>
                      </>
                    );
                  })()}
                </div>

                {/* Event Stats */}
                <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
                  <h3 className="text-white font-semibold mb-4">📈 Key Numbers</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Total Events</span>
                      <span className="text-white font-bold">{data.stats.totalEvents}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Registrations</span>
                      <span className="text-white font-bold">{data.stats.totalRegistrations}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Avg Rating</span>
                      <span className="text-yellow-400 font-bold">{data.stats.avgRating}⭐</span>
                    </div>
                    {data.stats.totalEvents > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Regs/Event</span>
                        <span className="text-purple-400 font-bold">
                          {(data.stats.totalRegistrations / data.stats.totalEvents).toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recommendations hint */}
                <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-500/30 rounded-2xl p-6">
                  <h3 className="text-white font-semibold mb-4">🎯 Next Actions</h3>
                  <div className="space-y-3">
                    {[
                      { icon: '📅', label: 'Schedule new events', link: '/admin/events/add' },
                      { icon: '🔔', label: 'Send notifications', link: '/admin/notifications/send' },
                      { icon: '🎤', label: 'Add speakers', link: '/admin/speakers/add' },
                    ].map(({ icon, label, link }) => (
                      <Link key={link} to={link}
                        className="flex items-center gap-2 text-sm text-purple-300 hover:text-white transition-colors group">
                        <span className="text-lg">{icon}</span>
                        <span className="group-hover:underline">{label}</span>
                        <span className="ml-auto">→</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!data && !error && !loading && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🧠</div>
                <h3 className="text-white font-bold text-xl mb-2">No data yet</h3>
                <p className="text-gray-400">Click "Refresh Insights" to generate AI analysis.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminIntelligence;
