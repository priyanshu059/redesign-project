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
      <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <input
        type={type} name={name} value={form[name]} onChange={handleChange}
        placeholder={placeholder} required={required}
        className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-indigo-500 text-white placeholder-zinc-600 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
      />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#09090b] font-sans selection:bg-indigo-500/30">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/admin/venues" className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 transition-all shadow-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                {isEdit ? '✏️ Edit Venue' : '➕ Add New Venue'}
              </h1>
              <p className="text-zinc-500 text-sm mt-1">Configure venue details and contact information</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Spinner size="lg" /></div>
          ) : (
            <form onSubmit={handleSubmit} className="relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none z-0"></div>
              
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl px-5 py-4 text-sm flex items-start gap-3 shadow-sm relative z-10 mb-6">
                  <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                      <span className="text-indigo-400">🏢</span> Location Details
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Field label="Venue Name" name="name" placeholder="e.g., Grand Convention Hall" required span2 />
                      <Field label="Address" name="address" placeholder="Full street address" required span2 />
                      <Field label="City" name="city" placeholder="e.g., San Francisco" required />
                      <Field label="Facilities" name="facilities" placeholder="WiFi, Projector, Stage..." />
                    </div>
                  </div>

                  <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                      <span className="text-indigo-400">📝</span> About
                    </h3>
                    
                    <div>
                      <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Description</label>
                      <textarea 
                        name="description" value={form.description} onChange={handleChange} rows={4} 
                        placeholder="Brief description of the venue, its history, or special features..." 
                        className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-indigo-500 text-white placeholder-zinc-600 rounded-xl px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner" 
                      />
                    </div>
                  </div>
                </div>

                {/* Sidebar Setup */}
                <div className="space-y-6">
                  <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                      <span className="text-indigo-400">⚙️</span> Capacity
                    </h3>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider">Max Attendees</label>
                        <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded text-xs font-bold">{form.capacity}</span>
                      </div>
                      <input 
                        type="range" name="capacity" value={form.capacity} onChange={handleChange} 
                        min={10} max={5000} step={10} 
                        className="w-full accent-indigo-500 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer mt-2" 
                      />
                      <div className="flex justify-between text-zinc-500 text-xs mt-2 font-medium">
                        <span>10</span><span>5000</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                      <span className="text-indigo-400">👤</span> Contact Info
                    </h3>
                    
                    <div className="space-y-5">
                      <Field label="Contact Person" name="contactPerson" placeholder="e.g., John Doe" />
                      <Field label="Contact Phone" name="contactPhone" placeholder="+1 800 123 4567" />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col gap-3">
                    <button 
                      type="submit" disabled={submitting} 
                      className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3.5 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 focus:ring-4 focus:ring-indigo-500/30 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <svg className="animate-spin -ml-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          Saving...
                        </>
                      ) : (
                        isEdit ? 'Update Venue' : 'Add Venue'
                      )}
                    </button>
                    <Link 
                      to="/admin/venues" 
                      className="w-full text-center border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white py-3.5 rounded-xl font-medium transition-colors"
                    >
                      Cancel
                    </Link>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminVenueForm;
