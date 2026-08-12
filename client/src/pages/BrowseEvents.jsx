// src/pages/BrowseEvents.jsx - Browse All Events
import { useState, useEffect } from 'react';
import api from '../services/api';
import EventCard from '../components/events/EventCard';
import Spinner from '../components/common/Spinner';

const BrowseEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/events').then(({ data }) => setEvents(data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen bg-[#09090b] flex items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-screen bg-[#09090b] py-12 px-4 font-sans selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            📅 Upcoming Events
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Browse Events</h1>
          <p className="text-zinc-400 text-lg max-w-2xl">Discover and register for amazing upcoming events, conferences, and meetups managed by EventOps AI.</p>
        </div>

        {events.length === 0 ? (
          <div className="bg-zinc-900/30 border-2 border-dashed border-zinc-800 rounded-3xl p-16 text-center">
            <div className="text-5xl mb-4">🎫</div>
            <h3 className="text-xl font-bold text-white mb-2">No events found</h3>
            <p className="text-zinc-500">There are currently no events available for registration.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map(event => <EventCard key={event._id} event={event} />)}
          </div>
        )}
      </div>
    </div>
  );
};
export default BrowseEvents;
