// src/pages/Feedback.jsx — Submit / Update event feedback with star rating
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Spinner from '../components/common/Spinner';
import { formatDate } from '../utils/helpers';

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

  if (loading) return <Spinner />;

  const starLabels = ['', 'Terrible', 'Poor', 'Average', 'Good', 'Excellent'];

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">⭐</div>
          <h1 className="text-3xl font-bold text-white">Your Feedback</h1>
          <p className="text-gray-400 mt-1">
            {existing ? 'Update your review for this event' : 'Share your experience'}
          </p>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-500/50 text-red-300 rounded-xl px-4 py-3 mb-6 text-sm">
            ⚠️ {error}
          </div>
        )}

        {event && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Info */}
            <div className="bg-gray-900 border border-yellow-500/20 rounded-2xl p-5">
              <h2 className="text-white font-bold text-lg">{event.title}</h2>
              <p className="text-gray-400 text-sm mt-1">
                📆 {formatDate(event.date)} &nbsp;·&nbsp; ⏰ {event.time} &nbsp;·&nbsp; 📍 {event.location}
              </p>
            </div>

            {/* Existing feedback note */}
            {existing && (
              <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-xl px-4 py-3 text-indigo-300 text-sm">
                ℹ️ You previously rated this event <strong>{existing.rating}/5</strong>. Update your feedback below.
              </div>
            )}

            {/* Star Rating */}
            <div>
              <label className="block text-white font-semibold mb-4">How would you rate this event?</label>
              <div className="flex gap-3 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    className="text-5xl transition-transform duration-150 hover:scale-110 focus:outline-none"
                    title={starLabels[star]}
                  >
                    <span className={star <= (hovered || rating) ? 'text-yellow-400' : 'text-gray-700'}>★</span>
                  </button>
                ))}
              </div>
              {(hovered || rating) > 0 && (
                <p className="text-center text-yellow-400 text-sm mt-2 font-medium">
                  {starLabels[hovered || rating]}
                </p>
              )}
              <p className="text-center text-gray-500 text-xs mt-1">Click a star to rate (1 = Terrible, 5 = Excellent)</p>
            </div>

            {/* Comment */}
            <div>
              <label htmlFor="comment" className="block text-white font-semibold mb-2">
                Comments <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <textarea
                id="comment"
                rows={4}
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Share your experience, what you loved, what could be improved…"
                className="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500/60 resize-none transition-colors"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:-translate-y-0.5"
            >
              {submitting ? '⏳ Submitting...' : existing ? '🔄 Update Feedback' : '📤 Submit Feedback'}
            </button>

            <div className="text-center">
              <Link to={`/events/${eventId}`} className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                ← Back to Event
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Feedback;
