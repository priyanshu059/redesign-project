// src/pages/EventRegister.jsx — Register for a specific event
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Spinner from '../components/common/Spinner';
import { formatDate } from '../utils/helpers';

const TICKET_TYPES = [
  { value: 'Standard', icon: '🎟️', desc: 'General admission' },
  { value: 'VIP', icon: '⭐', desc: 'Premium experience' },
  { value: 'Speaker', icon: '🎤', desc: 'Speaker access' },
  { value: 'Press', icon: '📰', desc: 'Media / Press' },
];

const EventRegister = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [ticketType, setTicketType] = useState('Standard');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/events/${id}`)
      .then(({ data }) => setEvent(data))
      .catch(() => setError('Event not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.post('/registrations', { eventId: id, ticketType });
      navigate('/my-registrations', { state: { success: 'Successfully registered!' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎟️</div>
          <h1 className="text-3xl font-bold text-white">Event Registration</h1>
          <p className="text-gray-400 mt-1">Confirm your spot for this event</p>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-500/50 text-red-300 rounded-xl px-4 py-3 mb-6 text-sm">
            ⚠️ {error}
          </div>
        )}

        {event && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Info Card */}
            <div className="bg-gray-900 border border-purple-500/30 rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">📅</div>
                <div>
                  <h2 className="text-white font-bold text-lg">{event.title}</h2>
                  <p className="text-gray-400 text-sm mt-1">
                    📆 {formatDate(event.date)} &nbsp;·&nbsp; ⏰ {event.time}
                  </p>
                  <p className="text-gray-400 text-sm">
                    📍 {event.location} &nbsp;·&nbsp; 👥 Capacity: {event.capacity}
                  </p>
                  {event.description && (
                    <p className="text-gray-500 text-sm mt-2">{event.description}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Ticket Type Selection */}
            <div>
              <label className="block text-white font-semibold mb-3">🎫 Select Ticket Type</label>
              <div className="grid grid-cols-2 gap-3">
                {TICKET_TYPES.map(({ value, icon, desc }) => (
                  <label
                    key={value}
                    className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all duration-200 ${
                      ticketType === value
                        ? 'border-purple-500 bg-purple-600/20 shadow-lg shadow-purple-900/30'
                        : 'border-gray-700 bg-gray-800 hover:border-gray-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="ticketType"
                      value={value}
                      checked={ticketType === value}
                      onChange={() => setTicketType(value)}
                      className="sr-only"
                    />
                    <div className="text-3xl mb-1">{icon}</div>
                    <div className="text-white font-semibold text-sm">{value}</div>
                    <div className="text-gray-400 text-xs mt-0.5">{desc}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-900/40 hover:-translate-y-0.5"
            >
              {submitting ? '⏳ Registering...' : '✅ Confirm Registration'}
            </button>

            <div className="text-center">
              <Link
                to={`/events/${id}`}
                className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
              >
                ← Back to Event Details
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EventRegister;
