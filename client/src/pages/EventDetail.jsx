// src/pages/EventDetail.jsx - Single Event Detail Page
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Spinner from '../components/common/Spinner';
import { formatDate, formatPrice } from '../utils/helpers';
import { getStatusColor } from '../utils/helpers';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/events/${id}`)
      .then(({ data }) => setEvent(data))
      .catch(() => navigate('/events'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#09090b] flex items-center justify-center"><Spinner size="lg" /></div>;
  if (!event) return null;

  return (
    <div className="min-h-screen bg-[#09090b] py-12 px-4 font-sans selection:bg-indigo-500/30">
      <div className="max-w-4xl mx-auto">
        <Link to="/events" className="inline-flex items-center gap-2 text-zinc-400 hover:text-indigo-400 text-sm font-medium mb-8 transition-colors group">
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Events
        </Link>

        {/* Header */}
        <div className="relative bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 sm:p-12 mb-8 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold px-3 py-1.5 rounded-lg capitalize tracking-wide">{event.category}</span>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-lg capitalize tracking-wide border ${getStatusColor(event.status).replace('bg-', 'text-').replace('text-white', '')} bg-opacity-10 bg-zinc-800/50 border-current`}>{event.status}</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-8 tracking-tight leading-tight">{event.title}</h1>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              <div className="bg-zinc-950/50 border border-zinc-800/80 rounded-xl p-4">
                <p className="text-zinc-500 uppercase tracking-wider text-xs font-semibold mb-1.5">Date</p>
                <p className="text-white font-medium">{formatDate(event.date)}</p>
              </div>
              <div className="bg-zinc-950/50 border border-zinc-800/80 rounded-xl p-4">
                <p className="text-zinc-500 uppercase tracking-wider text-xs font-semibold mb-1.5">Time</p>
                <p className="text-white font-medium">{event.time || 'TBD'}</p>
              </div>
              <div className="bg-zinc-950/50 border border-zinc-800/80 rounded-xl p-4">
                <p className="text-zinc-500 uppercase tracking-wider text-xs font-semibold mb-1.5">Capacity</p>
                <p className="text-white font-medium">{event.capacity} seats</p>
              </div>
              <div className="bg-zinc-950/50 border border-zinc-800/80 rounded-xl p-4">
                <p className="text-zinc-500 uppercase tracking-wider text-xs font-semibold mb-1.5">Price</p>
                <p className="text-white font-medium">{formatPrice(event.price)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-3xl p-8">
              <h2 className="text-white font-bold text-xl mb-4 tracking-tight flex items-center gap-2">
                <span className="text-xl">ℹ️</span> About This Event
              </h2>
              <p className="text-zinc-400 leading-relaxed whitespace-pre-wrap">{event.description}</p>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-8">
            {/* Venue */}
            {event.venue && (
              <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-3xl p-8">
                <h2 className="text-white font-bold text-xl mb-4 tracking-tight flex items-center gap-2">
                  <span className="text-xl">📍</span> Venue
                </h2>
                <div className="bg-zinc-950/50 border border-zinc-800/80 rounded-2xl p-5">
                  <p className="text-white font-semibold text-lg mb-1">{event.venue.name}</p>
                  <p className="text-zinc-400 text-sm leading-relaxed">{event.venue.address}<br/>{event.venue.city}</p>
                  
                  <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between text-sm">
                    <span className="text-zinc-500">Capacity</span>
                    <span className="text-white font-medium">{event.venue.capacity}</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Action Card */}
            <div className="bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 rounded-3xl p-8 text-center sticky top-24">
              <h3 className="text-white font-bold text-xl mb-2">Ready to join?</h3>
              <p className="text-indigo-200/70 text-sm mb-6">Secure your spot before it's too late.</p>
              
              <Link to={`/events/${id}/register`}
                className="block w-full bg-indigo-500 hover:bg-indigo-600 text-white text-center font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 focus:ring-4 focus:ring-indigo-500/20 flex items-center justify-center gap-2">
                Register Now
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EventDetail;
