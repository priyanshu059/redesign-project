// src/pages/admin/AdminFeedback.jsx — Admin View All Feedback
import { useState, useEffect } from 'react';
import api from '../../services/api';
import Sidebar from '../../components/admin/Sidebar';
import Spinner from '../../components/common/Spinner';
import StatCard from '../../components/common/StatCard';

const StarRating = ({ rating }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map(s => (
      <span key={s} className={`text-base ${s <= rating ? 'text-amber-400 drop-shadow-[0_0_2px_rgba(251,191,36,0.6)]' : 'text-zinc-700'}`}>★</span>
    ))}
  </div>
);

const AdminFeedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [filterRating, setFilterRating] = useState(0);
  const [search, setSearch] = useState('');

  const fetchFeedback = () => {
    setLoading(true);
    api.get('/feedback').then(({ data }) => setFeedback(data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchFeedback(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this feedback?')) return;
    await api.delete(`/feedback/${id}`);
    setMessage('Feedback deleted.');
    fetchFeedback();
    setTimeout(() => setMessage(''), 3000);
  };

  const filtered = feedback.filter(f => {
    const matchRating = filterRating === 0 || f.rating === filterRating;
    const matchSearch = !search ||
      f.event?.title?.toLowerCase().includes(search.toLowerCase()) ||
      f.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      f.comment?.toLowerCase().includes(search.toLowerCase());
    return matchRating && matchSearch;
  });

  const avgRating = feedback.length
    ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
    : 0;

  const ratingDist = [5, 4, 3, 2, 1].map(r => ({
    star: r,
    count: feedback.filter(f => f.rating === r).length,
    pct: feedback.length ? Math.round((feedback.filter(f => f.rating === r).length / feedback.length) * 100) : 0,
  }));

  return (
    <div className="flex min-h-screen bg-[#09090b] font-sans selection:bg-amber-500/30">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                <span className="text-3xl">⭐</span> Feedback & Reviews
              </h1>
              <p className="text-zinc-400 mt-2 text-sm flex items-center gap-2">
                <span className="bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-bold">{feedback.length}</span> reviews total 
                <span className="text-zinc-700">•</span>
                <span className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded font-bold">{avgRating}</span> average rating
              </p>
            </div>
          </div>

          {message && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl px-5 py-4 mb-6 text-sm flex items-start gap-3 shadow-sm">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              {message}
            </div>
          )}

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Reviews" value={feedback.length} icon="📝" color="indigo" />
            <StatCard title="Average Rating" value={`${avgRating} / 5`} icon="⭐" color="amber" />
            <StatCard title="5-Star Reviews" value={ratingDist[0].count} icon="🌟" color="green" />
            <StatCard title="Critical Reviews" value={ratingDist[3].count + ratingDist[4].count} icon="⚠️" color="red" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Filters & Distribution */}
            <div className="lg:col-span-1 space-y-6">
              {/* Filters */}
              <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-sm">
                <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                  <span className="text-indigo-400">🔍</span> Search & Filter
                </h3>
                
                <div className="space-y-5">
                  <div className="relative">
                    <input 
                      type="text" 
                      value={search} 
                      onChange={e => setSearch(e.target.value)} 
                      placeholder="Search reviews..."
                      className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-amber-500 text-white placeholder-zinc-500 rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-colors shadow-inner" 
                    />
                    <svg className="w-4 h-4 text-zinc-500 absolute left-4 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  
                  <div>
                    <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-3">Filter by Rating</label>
                    <div className="flex flex-wrap gap-2">
                      {[0, 5, 4, 3, 2, 1].map(r => (
                        <button 
                          key={r} 
                          onClick={() => setFilterRating(r)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1 ${
                            filterRating === r 
                              ? 'bg-amber-500 text-zinc-900 scale-105' 
                              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 border border-zinc-700'
                          }`}
                        >
                          {r === 0 ? 'All' : <>{r}<span className="text-[10px]">★</span></>}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-sm">
                <h3 className="text-white font-bold text-base mb-5 flex items-center gap-2">
                  <span className="text-indigo-400">📊</span> Rating Distribution
                </h3>
                <div className="space-y-3">
                  {ratingDist.map(({ star, count, pct }) => (
                    <div key={star} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-8">
                        <span className="text-zinc-300 text-sm font-medium">{star}</span>
                        <span className="text-amber-500 text-xs">★</span>
                      </div>
                      <div className="flex-1 h-2.5 bg-zinc-800 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className="h-full bg-amber-500 rounded-full transition-all duration-1000 ease-out" 
                          style={{ width: `${pct}%` }} 
                        />
                      </div>
                      <span className="text-zinc-500 text-xs font-medium w-6 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Feedback List */}
            <div className="lg:col-span-2">
              <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl overflow-hidden shadow-sm h-[calc(100vh-250px)] flex flex-col relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="bg-zinc-950/80 border-b border-zinc-800/80 px-6 py-4 flex justify-between items-center shrink-0">
                  <h3 className="text-white font-bold text-sm">Showing {filtered.length} Reviews</h3>
                  {filterRating > 0 && (
                    <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-1 rounded-lg border border-amber-500/20">
                      {filterRating} Stars Only
                    </span>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                  {loading ? (
                    <div className="flex justify-center py-20"><Spinner /></div>
                  ) : filtered.length === 0 ? (
                    <div className="text-center py-20 relative z-10">
                      <div className="text-6xl mb-6 filter drop-shadow-lg opacity-50">💭</div>
                      <h3 className="text-xl font-bold text-white mb-2">No feedback found</h3>
                      <p className="text-zinc-500">Try adjusting your search or filters.</p>
                      {(search || filterRating > 0) && (
                        <button 
                          onClick={() => { setSearch(''); setFilterRating(0); }}
                          className="mt-6 text-amber-400 hover:text-amber-300 text-sm font-medium hover:underline"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2 p-4">
                      {filtered.map((f) => (
                        <div key={f._id} className="bg-zinc-950/50 border border-zinc-800/50 hover:border-zinc-700 p-5 rounded-2xl transition-all group">
                          <div className="flex justify-between items-start gap-4 mb-3">
                            <div>
                              <div className="flex items-center gap-3 flex-wrap mb-1">
                                <span className="text-white font-bold">{f.user?.name || 'Anonymous User'}</span>
                                <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                                <span className="text-zinc-500 text-xs font-medium">
                                  {f.createdAt ? new Date(f.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
                                </span>
                              </div>
                              <div className="text-xs font-medium text-indigo-400 flex items-center gap-1.5">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                {f.event?.title || 'Unknown Event'}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <StarRating rating={f.rating} />
                              <button 
                                onClick={() => handleDelete(f._id)} 
                                className="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-xs p-1.5 rounded-lg transition-all"
                                title="Delete Review"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </div>
                          </div>
                          
                          {f.comment && (
                            <div className="bg-zinc-900 rounded-xl p-4 mt-2 border border-zinc-800/80">
                              <p className="text-zinc-300 text-sm leading-relaxed italic">"{f.comment}"</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFeedback;
