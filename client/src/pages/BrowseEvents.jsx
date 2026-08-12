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

  if (loading) return <div className="page-container"><Spinner size="lg" /></div>;

  return (
    <div className="page-container fade-in">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">📅 Browse Events</h1>
      <p className="text-gray-500 mb-6">Discover and register for upcoming events</p>

      {events.length === 0 ? (
        <div className="card card-body text-center text-gray-400 py-12">No events available at the moment.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => <EventCard key={event._id} event={event} />)}
        </div>
      )}
    </div>
  );
};
export default BrowseEvents;
