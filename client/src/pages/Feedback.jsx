// src/pages/Feedback.jsx — Submit / Update event feedback with star rating
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Spinner from '../components/common/Spinner';
import { formatDate } from '../utils/helpers';
import { Star, AlertCircle, Calendar, MapPin, Lightbulb, Loader2, ArrowLeft } from 'lucide-react';

const Feedback = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [existing, setExisting] = useState(null);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get(`/events/${eventId}`),
      api.get('/feedback/my').catch(() => ({ data: [] })),
    ])
      .then(([eventRes, feedbackRes]) => {
        setEvent(eventRes.data);
        const myFeedback = feedbackRes.data.find(f => f.event?._id === eventId || f.event === eventId);
        if (myFeedback) {
          setExisting(myFeedback);
          setRating(myFeedback.rating);
          setComment(myFeedback.comment || '');
        }
      })
      .catch(() => setError('Could not load event details.'))
      .finally(() => setLoading(false));
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { setError('Please select a star rating.'); return; }
    setSubmitting(true);
    setError('');
    try {
      if (existing) {
        await api.put(`/feedback/${existing._id}`, { rating, comment });
      } else {
        await api.post('/feedback', { eventId, rating, comment });
      }
      navigate('/my-feedback', { state: { success: 'Feedback submitted!' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback.');
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#09090b] flex items-center justify-center"><Spinner size="lg" /></div>;

  const starLabels = ['', 'Terrible', 'Poor', 'Average', 'Good', 'Excellent'];

  return (
    <div className="min-h-screen bg-[#09090b] py-12 px-4 font-sans selection:bg-amber-500/30">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-500/10 rounded-3xl mb-6 shadow-lg shadow-amber-500/10 border border-amber-500/20">
            <Star className="w-10 h-10 text-amber-500" fill="currentColor" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">Event Feedback</h1>
          <p className="text-zinc-400 text-lg">
            {existing ? 'Update your review for this event' : 'Share your experience with us'}
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl px-5 py-4 mb-8 text-sm flex items-start gap-3 shadow-lg">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {event && (
          <form onSubmit={handleSubmit} className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 space-y-8">
              {/* Event Info */}
              <div className="bg-zinc-950/50 border border-amber-500/20 rounded-2xl p-6 transition-all hover:border-amber-500/40">
                <h2 className="text-white font-bold text-lg mb-2">{event.title}</h2>
                <div className="flex flex-col gap-1.5">
                  <p className="text-zinc-400 text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-500" /> {formatDate(event.date)} &nbsp;·&nbsp; {event.time}
                  </p>
                  <p className="text-zinc-400 text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-500" /> {event.location}
                  </p>
                </div>
              </div>

              {existing && (
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-5 py-4 text-indigo-300 text-sm flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>You previously rated this event <strong className="text-white">{existing.rating}/5</strong>. Feel free to update your review.</p>
                </div>
              )}

              {/* Star Rating */}
              <div className="bg-zinc-950/30 rounded-2xl p-6 border border-zinc-800/80 text-center">
                <label className="block text-white font-bold mb-4 tracking-tight">How would you rate this event?</label>
                <div className="flex gap-2 justify-center mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHovered(star)}
                      onMouseLeave={() => setHovered(0)}
                      className={`text-4xl sm:text-5xl transition-all duration-300 focus:outline-none ${star <= (hovered || rating) ? 'scale-110' : 'hover:scale-110'}`}
                      title={starLabels[star]}
                    >
                      <Star className={`w-10 h-10 ${star <= (hovered || rating) ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'text-zinc-800'}`} />
                    </button>
                  ))}
                </div>
                <div className="h-6">
                  {(hovered || rating) > 0 && (
                    <p className="text-amber-400 text-sm font-bold tracking-wider uppercase animate-fade-in">
                      {starLabels[hovered || rating]}
                    </p>
                  )}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label htmlFor="comment" className="block text-white font-bold mb-3 tracking-tight">
                  Additional Comments <span className="text-zinc-500 font-normal text-sm">(optional)</span>
                </label>
                <textarea
                  id="comment"
                  rows={5}
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="What did you love? What could we improve?"
                  className="w-full bg-zinc-950/50 border border-zinc-800 text-white placeholder-zinc-600 rounded-2xl px-5 py-4 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-sm resize-none"
                />
              </div>

              {/* Submit */}
              <div className="pt-4 border-t border-zinc-800/80">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl font-bold text-zinc-900 bg-amber-400 hover:bg-amber-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20 hover:-translate-y-0.5 focus:ring-4 focus:ring-amber-500/30 flex items-center justify-center gap-2 text-lg"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-zinc-900" />
                      Submitting...
                    </>
                  ) : (existing ? 'Update Feedback' : 'Submit Feedback')}
                </button>

                <div className="text-center mt-6">
                  <Link to={`/events/${eventId}`} className="inline-flex items-center gap-2 text-zinc-500 hover:text-amber-400 text-sm font-medium transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Event
                  </Link>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Feedback;
