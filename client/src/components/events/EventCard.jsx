// src/components/events/EventCard.jsx - Event Display Card
import { Link } from 'react-router-dom';
import { getStatusColor } from '../../utils/helpers';

const EventCard = ({ event }) => {
  return (
    <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1 group flex flex-col h-full">
      <div className="p-6 flex flex-col h-full">
        {/* Status badge */}
        <div className="flex justify-between items-start mb-4">
          <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(event.status).replace('bg-', 'text-').replace('text-white', '')} bg-opacity-10 border border-current bg-zinc-800/50`}>
            {event.status}
          </span>
          <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{event.date}</span>
        </div>

        {/* Title */}
        <h5 className="font-bold text-lg text-white mb-2 group-hover:text-indigo-400 transition-colors">{event.title}</h5>

        {/* Description (truncated) */}
        <p className="text-sm text-zinc-400 mb-6 line-clamp-2 leading-relaxed flex-grow">{event.description}</p>

        {/* Details */}
        <div className="space-y-2 mb-6 mt-auto">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span className="w-6 h-6 flex items-center justify-center bg-zinc-800 rounded-md text-xs border border-zinc-700/50">📍</span>
            <span className="truncate">{event.location || 'TBD'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span className="w-6 h-6 flex items-center justify-center bg-zinc-800 rounded-md text-xs border border-zinc-700/50">🕐</span>
            <span>{event.time || 'TBD'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span className="w-6 h-6 flex items-center justify-center bg-zinc-800 rounded-md text-xs border border-zinc-700/50">👥</span>
            <span>Capacity: {event.capacity}</span>
          </div>
        </div>

        {/* Action button */}
        <Link 
          to={`/events/${event._id}`} 
          className="block w-full py-2.5 text-center bg-zinc-800 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors border border-zinc-700 hover:border-indigo-500"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};
export default EventCard;
