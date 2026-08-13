// src/pages/UserRegisterEvent.jsx - Event Registration Form Page
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Spinner from '../components/common/Spinner';
import { formatDate, formatPrice } from '../utils/helpers';
import { Ticket, Calendar, MapPin, DollarSign } from 'lucide-react';

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

  if (loading) return <div className="min-h-screen bg-[#09090b] flex items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 font-sans selection:bg-indigo-500/30 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
      
      <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 sm:p-10 w-full max-w-md shadow-2xl relative z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-500/10 rounded-2xl mb-4 border border-indigo-500/20 shadow-sm">
            <Ticket className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">Confirm Registration</h1>
          <p className="text-zinc-400 text-sm">You're about to register for this event</p>
        </div>

        <div className="bg-zinc-950/50 border border-zinc-800/80 rounded-2xl p-5 mb-6">
          <h2 className="text-white font-semibold text-lg mb-4">{event?.title}</h2>
          <div className="space-y-3 text-sm">
            <p className="text-zinc-300 flex items-center gap-3 border-b border-zinc-800/50 pb-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20 shrink-0"><Calendar className="w-4 h-4" /></span> 
              {formatDate(event?.date)}
            </p>
            <p className="text-zinc-300 flex items-center gap-3 border-b border-zinc-800/50 pb-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20 shrink-0"><MapPin className="w-4 h-4" /></span> 
              <span className="truncate">{event?.location}</span>
            </p>
            <p className="text-zinc-300 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20 shrink-0"><DollarSign className="w-4 h-4" /></span> 
              {formatPrice(event?.price)}
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-start gap-2 shadow-sm">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={() => navigate(-1)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3.5 rounded-xl font-medium transition-colors border border-zinc-700 hover:border-zinc-600 text-sm">
            Cancel
          </button>
          <button onClick={handleRegister} disabled={submitting}
            className="flex-1 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white py-3.5 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 text-sm flex items-center justify-center gap-2">
            {submitting ? (
              <>
                <svg className="animate-spin -ml-1 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Processing...
              </>
            ) : 'Confirm Registration'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default UserRegisterEvent;
