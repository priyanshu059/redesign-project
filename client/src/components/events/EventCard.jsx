// src/components/events/EventCard.jsx - Event Display Card
import { Link } from 'react-router-dom';
import { getStatusColor } from '../../utils/helpers';

const EventCard = ({ event }) => {
  return (
    <div className="card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="card-body">
        {/* Status badge */}
        <div className="flex justify-between items-start mb-2">
          <span className={`badge ${getStatusColor(event.status)} capitalize`}>
            {event.status}
          </span>
          <span className="text-xs text-gray-400">{event.date}</span>
        </div>

        {/* Title */}
        <h5 className="font-semibold text-gray-800 mb-1">{event.title}</h5>

        {/* Description (truncated) */}
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{event.description}</p>

        {/* Details */}
        <div className="text-xs text-gray-500 space-y-1 mb-3">
          <div>📍 {event.location || 'TBD'}</div>
          <div>🕐 {event.time || 'TBD'}</div>
          <div>👥 Capacity: {event.capacity}</div>
        </div>

        {/* Action button */}
        <Link to={`/events/${event._id}`} className="btn-primary w-full justify-center text-sm">
          View Details
        </Link>
      </div>
    </div>
  );
};
export default EventCard;
