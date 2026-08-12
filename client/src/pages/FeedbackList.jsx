// src/pages/FeedbackList.jsx - My Feedback List
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import Spinner from '../components/common/Spinner';
import { formatDate } from '../utils/helpers';

const FeedbackList = () => {
  const location = useLocation();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(location.state?.success || '');

  useEffect(() => { 
    api.get('/feedback/my').then(({ data }) => setFeedbacks(data)).finally(() => setLoading(false)); 
  }, []);

  useEffect(() => { 
    if (message) { 
      const t = setTimeout(() => setMessage(''), 4000); 
      return () => clearTimeout(t); 
    } 
  }, [message]);

  const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

  if (loading) return <div className="min-h-screen bg-[#09090b] flex items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-screen bg-[#09090b] py-12 px-4 font-sans selection:bg-amber-500/30">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight flex items-center gap-3">
              <span className="text-3xl">⭐</span> My Feedback
            </h1>
            <p className="text-zinc-400 mt-2 text-lg">Reviews and ratings you've shared</p>
          </div>
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-zinc-400 hover:text-amber-400 text-sm font-medium transition-colors group">
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Dashboard
          </Link>
        </div>

        {message && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl px-5 py-4 mb-8 text-sm flex items-start gap-3 shadow-lg">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            {message}
          </div>
        )}

        {feedbacks.length === 0 ? (
          <div className="bg-zinc-900/30 border-2 border-dashed border-zinc-800 rounded-3xl p-16 text-center">
            <div className="text-5xl mb-4 opacity-50">💭</div>
            <h3 className="text-xl font-bold text-white mb-2">No feedback yet</h3>
            <p className="text-zinc-500 mb-6 max-w-md mx-auto">You haven't submitted feedback for any events yet.</p>
            <Link to="/events" className="inline-flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-xl font-medium transition-colors border border-zinc-700">
              Browse past events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {feedbacks.map(fb => (
              <div key={fb._id} className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:border-amber-500/30 hover:-translate-y-1 relative group">
                <div className="flex justify-between items-start mb-4">
                  <div className="pr-4">
                    <Link to={fb.event ? `/events/${fb.event._id}` : '#'} className="font-bold text-lg text-white mb-1 group-hover:text-amber-400 transition-colors block line-clamp-1">
                      {fb.event?.title || 'Unknown Event'}
                    </Link>
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                      <span>{fb.event?.date ? formatDate(fb.event.date) : 'Date Unknown'}</span>
                    </p>
                  </div>
                  <div className="text-amber-400 text-xl tracking-widest shrink-0 filter drop-shadow-[0_0_4px_rgba(251,191,36,0.3)]">{stars(fb.rating)}</div>
                </div>
                
                <div className="bg-zinc-950/50 rounded-xl p-4 border border-zinc-800/50 h-32 overflow-y-auto mb-4">
                  {fb.comment ? (
                    <p className="text-zinc-300 text-sm leading-relaxed italic relative">
                      <span className="text-3xl text-zinc-800 absolute -top-2 -left-2 leading-none font-serif">"</span>
                      <span className="relative z-10 pl-3">{fb.comment}</span>
                    </p>
                  ) : (
                    <p className="text-zinc-600 text-sm italic">No written comment provided.</p>
                  )}
                </div>
                
                <div className="flex justify-between items-center border-t border-zinc-800/80 pt-4">
                  <p className="text-xs text-zinc-500 flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {new Date(fb.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                  
                  {fb.event && (
                    <Link to={`/events/${fb.event._id}/feedback`} className="text-xs font-medium text-amber-500 hover:text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 transition-colors">
                      Edit
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default FeedbackList;
