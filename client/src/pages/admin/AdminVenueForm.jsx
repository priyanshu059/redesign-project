// src/pages/admin/AdminVenueForm.jsx — Add / Edit Venue
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import Sidebar from '../../components/admin/Sidebar';
import Spinner from '../../components/common/Spinner';

const EMPTY = { name: '', address: '', city: '', capacity: 100, facilities: '', contactPerson: '', contactPhone: '', description: '' };

const AdminVenueForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/venues/${id}`)
      .then(({ data }) => setForm({ name: data.name || '', address: data.address || '', city: data.city || '', capacity: data.capacity || 100, facilities: data.facilities || '', contactPerson: data.contactPerson || '', contactPhone: data.contactPhone || '', description: data.description || '' }))
      .catch(() => setError('Failed to load venue.'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'capacity' ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.address || !form.city) { setError('Name, Address and City are required.'); return; }
    setSubmitting(true); setError('');
    try {
      if (isEdit) await api.put(`/venues/${id}`, form);
      else await api.post('/venues', form);
      navigate('/admin/venues');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save venue.');
      setSubmitting(false);
    }
  };

  const Field = ({ label, name, type = 'text', placeholder, required, span2 }) => (
    <div className={span2 ? 'md:col-span-2' : ''}>
      <label className="block text-gray-300 text-sm font-medium mb-1.5">{label}{required ? ' *' : ''}</label>
      <input
        type={type} name={name} value={form[name]} onChange={handleChange}
        placeholder={placeholder} required={required}
        className="w-full bg-gray-800 border border-gray-700 focus:border-purple-500 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
      />
    </div>
  );

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-950 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Link to="/admin/venues" className="text-gray-500 hover:text-white transition-colors">←</Link>
            <h1 className="text-2xl font-bold text-white">{isEdit ? '✏️ Edit Venue' : '➕ Add Venue'}</h1>
          </div>

          {loading ? <Spinner /> : (
            <form onSubmit={handleSubmit}>
              {error && <div className="bg-red-900/40 border border-red-500/50 text-red-300 rounded-xl px-4 py-3 text-sm mb-4">⚠️ {error}</div>}
              <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <Field label="🏢 Venue Name" name="name" placeholder="e.g., Grand Convention Hall" required />
                <Field label="🏙️ City" name="city" placeholder="e.g., San Francisco" required />
                <Field label="📍 Address" name="address" placeholder="Full address" required span2 />
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">👥 Capacity: <span className="text-purple-400 font-bold">{form.capacity}</span></label>
                  <input type="range" name="capacity" value={form.capacity} onChange={handleChange} min={10} max={5000} step={10} className="w-full accent-purple-500" />
                </div>
                <Field label="🛠️ Facilities" name="facilities" placeholder="WiFi, Projector, Stage…" />
                <Field label="👤 Contact Person" name="contactPerson" placeholder="e.g., John Doe" />
                <Field label="📞 Contact Phone" name="contactPhone" placeholder="+1 800 123 4567" />
                <div className="md:col-span-2">
                  <label className="block text-gray-300 text-sm font-medium mb-1.5">📝 Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Brief description of the venue…" className="w-full bg-gray-800 border border-gray-700 focus:border-purple-500 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none resize-none transition-colors" />
                </div>
              </div>
              <div className="flex gap-4">
                <button type="submit" disabled={submitting} className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-60">
                  {submitting ? '⏳ Saving...' : isEdit ? '✅ Update Venue' : '✅ Add Venue'}
                </button>
                <Link to="/admin/venues" className="flex-1 text-center border border-gray-600 hover:border-gray-400 text-gray-300 py-3 rounded-xl font-medium transition-colors">Cancel</Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminVenueForm;
