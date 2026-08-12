// src/utils/helpers.js - Utility Helper Functions

// Format a date to a readable string: "15 Sep 2026"
export const formatDate = (dateString) => {
  if (!dateString) return 'TBD';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
};

// Format price: 0 → "Free", 999 → "₹999"
export const formatPrice = (price) => {
  if (!price || price === 0) return 'Free';
  return `₹${price.toLocaleString('en-IN')}`;
};

// Get badge color class based on event status
export const getStatusColor = (status) => {
  const colors = {
    'upcoming': 'bg-blue-100 text-blue-800',
    'ongoing': 'bg-green-100 text-green-800',
    'completed': 'bg-gray-100 text-gray-800',
    'cancelled': 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

// Truncate text to a max length with "..."
export const truncate = (text, maxLength = 100) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};
