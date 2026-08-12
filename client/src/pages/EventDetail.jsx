// src/pages/EventDetail.jsx - Single Event Detail Page
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Spinner from '../components/common/Spinner';
import { formatDate, formatPrice } from '../utils/helpers';

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

  if (loading) return <Spinner />;
  if (!event) return null;

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/events" className="text-gray-400 hover:text-white text-sm mb-6 inline-block">← Back to Events</Link>

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 to-blue-900 border border-gray-700 rounded-2xl p-8 mb-6">
          <div className="flex gap-3 mb-4">
            <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full">{event.category}</span>
            <span className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full">{event.status}</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">{event.title}</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><p className="text-gray-400">Date</p><p className="text-white font-medium">{formatDate(event.date)}</p></div>
            <div><p className="text-gray-400">Location</p><p className="text-white font-medium">{event.location}</p></div>
            <div><p className="text-gray-400">Capacity</p><p className="text-white font-medium">{event.capacity}</p></div>
            <div><p className="text-gray-400">Price</p><p className="text-white font-medium">{formatPrice(event.price)}</p></div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-6">
          <h2 className="text-white font-semibold text-lg mb-3">About This Event</h2>
          <p className="text-gray-300 leading-relaxed">{event.description}</p>
        </div>

        {/* Venue */}
        {event.venue && (
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-6">
            <h2 className="text-white font-semibold text-lg mb-3">📍 Venue</h2>
            <p className="text-white font-medium">{event.venue.name}</p>
            <p className="text-gray-400">{event.venue.address}, {event.venue.city}</p>
          </div>
        )}

        {/* Register Button */}
        <Link to={`/events/${id}/register`}
          className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center font-semibold py-4 rounded-xl transition-colors text-lg">
          Register for This Event →
        </Link>
      </div>
    </div>
  );
};
export default EventDetail;
