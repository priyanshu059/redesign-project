// src/pages/admin/AdminFeedback.jsx — Admin View All Feedback
import { useState, useEffect } from 'react';
import api from '../../services/api';
import Sidebar from '../../components/admin/Sidebar';
import Spinner from '../../components/common/Spinner';
import StatCard from '../../components/common/StatCard';

const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(s => (
      <span key={s} className={s <= rating ? 'text-yellow-400' : 'text-gray-700'}>★</span>
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
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-950 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">⭐ Feedback & Reviews</h1>
            <p className="text-gray-400 text-sm mt-0.5">{feedback.length} review{feedback.length !== 1 ? 's' : ''} · Avg: {avgRating}★</p>
          </div>
        </div>

        {message && <div className="bg-green-900/40 border border-green-500/50 text-green-300 rounded-xl px-4 py-3 mb-4 text-sm">✅ {message}</div>}

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Reviews" value={feedback.length} icon="⭐" color="yellow" />
          <StatCard title="Average Rating" value={`${avgRating}/5`} icon="📊" color="blue" />
          <StatCard title="5-Star Reviews" value={ratingDist[0].count} icon="🌟" color="green" />
          <StatCard title="Critical (1-2★)" value={ratingDist[3].count + ratingDist[4].count} icon="⚠️" color="red" />
        </div>

        {/* Rating Distribution */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 mb-6">
          <h3 className="text-white font-semibold text-sm mb-4">📊 Rating Distribution</h3>
          <div className="space-y-2">
            {ratingDist.map(({ star, count, pct }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-yellow-400 text-sm w-4">{star}★</span>
                <div className="flex-1 h-2.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-gray-400 text-xs w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4 items-center">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search…"
            className="bg-gray-900 border border-gray-700 focus:border-yellow-500 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors w-full max-w-xs" />
          <div className="flex gap-2">
            {[0, 5, 4, 3, 2, 1].map(r => (
              <button key={r} onClick={() => setFilterRating(r)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterRating === r ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                {r === 0 ? 'All' : `${r}★`}
              </button>
            ))}
          </div>
        </div>

        {loading ? <Spinner /> : (
          <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-3">⭐</div>
                <p className="text-gray-400">No feedback found.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {filtered.map((f) => (
                  <div key={f._id} className="px-6 py-4 hover:bg-gray-800/40 transition-colors">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-white font-semibold text-sm">{f.user?.name || 'Anonymous'}</span>
                          <StarRating rating={f.rating} />
                          <span className="text-gray-500 text-xs">{f.createdAt ? new Date(f.createdAt).toLocaleDateString() : ''}</span>
                        </div>
                        <p className="text-purple-400 text-xs mt-1">Event: {f.event?.title || '—'}</p>
                        {f.comment && <p className="text-gray-300 text-sm mt-2 leading-relaxed">"{f.comment}"</p>}
                      </div>
                      <button onClick={() => handleDelete(f._id)} className="text-red-400 hover:text-red-300 text-xs border border-red-500/30 px-2 py-1 rounded-lg transition-colors flex-shrink-0">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFeedback;
