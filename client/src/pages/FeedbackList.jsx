// src/pages/FeedbackList.jsx - My Feedback List
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Spinner from '../components/common/Spinner';

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/feedback/my').then(({ data }) => setFeedbacks(data)).finally(() => setLoading(false)); }, []);

  const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

  if (loading) return <div className="page-container"><Spinner /></div>;

  return (
    <div className="page-container fade-in">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">⭐ My Feedback</h1>
      {feedbacks.length === 0 ? (
        <div className="card card-body text-center py-12 text-gray-400">
          No feedback submitted yet. <Link to="/events" className="text-blue-600 hover:underline">Browse events</Link> to leave feedback.
        </div>
      ) : (
        <div className="space-y-4">
          {feedbacks.map(fb => (
            <div key={fb._id} className="card card-body">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-semibold text-gray-800">{fb.event?.title || 'Unknown Event'}</h5>
                  <p className="text-sm text-gray-500">{fb.event?.date}</p>
                </div>
                <div className="text-yellow-400 text-lg">{stars(fb.rating)}</div>
              </div>
              {fb.comment && <p className="text-gray-600 text-sm mt-2 italic">"{fb.comment}"</p>}
              <p className="text-xs text-gray-400 mt-2">{new Date(fb.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default FeedbackList;
