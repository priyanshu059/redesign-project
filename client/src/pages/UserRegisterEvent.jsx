// src/pages/UserRegisterEvent.jsx - Event Registration Form Page
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Spinner from '../components/common/Spinner';
import { formatDate, formatPrice } from '../utils/helpers';

const UserRegisterEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/events/${id}`).then(({ data }) => setEvent(data)).finally(() => setLoading(false));
  }, [id]);

  const handleRegister = async () => {
    setSubmitting(true); setError('');
    try {
      await api.post('/registrations', { eventId: id });
      navigate('/my-registrations');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-2">Confirm Registration</h1>
        <p className="text-gray-400 mb-6 text-sm">You're about to register for:</p>

        <div className="bg-gray-800 rounded-xl p-5 mb-6">
          <h2 className="text-white font-semibold text-lg">{event?.title}</h2>
          <div className="mt-3 space-y-2 text-sm">
            <p className="text-gray-400">📅 {formatDate(event?.date)}</p>
            <p className="text-gray-400">📍 {event?.location}</p>
            <p className="text-gray-400">💰 {formatPrice(event?.price)}</p>
          </div>
        </div>

        {error && <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

        <div className="flex gap-3">
          <button onClick={() => navigate(-1)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors">
            Cancel
          </button>
          <button onClick={handleRegister} disabled={submitting}
            className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-3 rounded-lg font-medium transition-colors">
            {submitting ? 'Registering...' : 'Confirm Registration'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default UserRegisterEvent;
