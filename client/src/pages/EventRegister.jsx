// src/pages/EventRegister.jsx — Register for a specific event
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Spinner from '../components/common/Spinner';
import { formatDate } from '../utils/helpers';
import { Ticket, Star, Mic, Newspaper, AlertCircle, Calendar, MapPin, Loader2, ArrowLeft } from 'lucide-react';

const TICKET_TYPES = [
  { value: 'Standard', icon: <Ticket className="w-8 h-8 mx-auto" />, desc: 'General admission' },
  { value: 'VIP', icon: <Star className="w-8 h-8 mx-auto text-amber-400" />, desc: 'Premium experience' },
  { value: 'Speaker', icon: <Mic className="w-8 h-8 mx-auto text-purple-400" />, desc: 'Speaker access' },
  { value: 'Press', icon: <Newspaper className="w-8 h-8 mx-auto text-blue-400" />, desc: 'Media / Press' },
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

  if (loading) return <div className="min-h-screen bg-[#09090b] flex items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-screen bg-[#09090b] py-12 px-4 font-sans selection:bg-indigo-500/30">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-500/10 rounded-3xl mb-6 shadow-lg shadow-indigo-500/10 border border-indigo-500/20">
            <Ticket className="w-10 h-10 text-indigo-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">Event Registration</h1>
          <p className="text-zinc-400 text-lg">Secure your spot for this event</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl px-5 py-4 mb-8 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {event && (
          <form onSubmit={handleSubmit} className="space-y-8 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-6 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            {/* Event Info Card */}
            <div className="relative z-10 bg-zinc-950/50 border border-indigo-500/20 rounded-2xl p-6 transition-all hover:border-indigo-500/40">
              <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 border border-indigo-500/20"><Calendar className="w-8 h-8 text-indigo-400" /></div>
                <div>
                  <h2 className="text-white font-bold text-xl mb-2">{event.title}</h2>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-zinc-400 text-sm flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-indigo-400" /> {formatDate(event.date)} &nbsp;·&nbsp; {event.time}
                    </p>
                    <p className="text-zinc-400 text-sm flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-indigo-400" /> {event.location} &nbsp;·&nbsp; Capacity: {event.capacity}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Type Selection */}
            <div className="relative z-10">
              <label className="block text-white font-bold mb-4 tracking-tight">Select Ticket Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {TICKET_TYPES.map(({ value, icon, desc }) => (
                  <label
                    key={value}
                    className={`cursor-pointer rounded-2xl border-2 p-5 flex flex-col items-center text-center transition-all duration-300 ${
                      ticketType === value
                        ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20 -translate-y-1'
                        : 'border-zinc-800 bg-zinc-950/50 hover:border-zinc-600 hover:bg-zinc-800/50'
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
                    <div className="mb-3 filter drop-shadow-sm">{icon}</div>
                    <div className={`font-bold text-lg mb-1 ${ticketType === value ? 'text-indigo-300' : 'text-white'}`}>{value}</div>
                    <div className="text-zinc-500 text-xs font-medium">{desc}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="relative z-10 pt-4 border-t border-zinc-800/80">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl font-bold text-white bg-indigo-500 hover:bg-indigo-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 focus:ring-4 focus:ring-indigo-500/30 flex items-center justify-center gap-2 text-lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Processing...
                  </>
                ) : 'Confirm Registration'}
              </button>

              <div className="text-center mt-6">
                <Link
                  to={`/events/${id}`}
                  className="inline-flex items-center gap-2 text-zinc-500 hover:text-indigo-400 text-sm font-medium transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Back to Event Details
                </Link>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EventRegister;
