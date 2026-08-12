// src/pages/admin/AdminSpeakerForm.jsx — Add / Edit Speaker
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import Sidebar from '../../components/admin/Sidebar';
import Spinner from '../../components/common/Spinner';

const EMPTY = { name: '', bio: '', sessionTitle: '', schedule: '', availability: true };

const AdminSpeakerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/speakers/${id}`)
      .then(({ data }) => setForm({ name: data.name || '', bio: data.bio || '', sessionTitle: data.sessionTitle || '', schedule: data.schedule || '', availability: data.availability ?? true }))
      .catch(() => setError('Failed to load speaker.'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) { setError('Speaker name is required.'); return; }
    setSubmitting(true); setError('');
    try {
      if (isEdit) await api.put(`/speakers/${id}`, form);
      else await api.post('/speakers', form);
      navigate('/admin/speakers');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save speaker.');
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#09090b] font-sans selection:bg-indigo-500/30">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/admin/speakers" className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 transition-all shadow-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                {isEdit ? '✏️ Edit Speaker' : '➕ Add New Speaker'}
              </h1>
              <p className="text-zinc-500 text-sm mt-1">Configure speaker profile and session details</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Spinner size="lg" /></div>
          ) : (
            <form onSubmit={handleSubmit} className="relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-full bg-indigo-500/5 rounded-full blur-3xl pointer-events-none z-0"></div>
              
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl px-5 py-4 text-sm flex items-start gap-3 shadow-sm relative z-10 mb-6">
                  <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {error}
                </div>
              )}

              <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm relative z-10 mb-6 space-y-6">
                
                {/* Profile Section */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2 border-b border-zinc-800/80 pb-3">
                    <span className="text-indigo-400">👤</span> Profile Details
                  </h3>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Full Name <span className="text-rose-500">*</span></label>
                      <input 
                        name="name" value={form.name} onChange={handleChange} 
                        placeholder="e.g., Dr. Jane Smith" required
                        className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-indigo-500 text-white placeholder-zinc-600 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner" 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Bio / Description</label>
                      <textarea 
                        name="bio" value={form.bio} onChange={handleChange} rows={4} 
                        placeholder="Brief biography, expertise, or background of the speaker..."
                        className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-indigo-500 text-white placeholder-zinc-600 rounded-xl px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner" 
                      />
                    </div>
                  </div>
                </div>

                {/* Session Section */}
                <div className="pt-4">
                  <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2 border-b border-zinc-800/80 pb-3">
                    <span className="text-indigo-400">🎙️</span> Session & Availability
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                    <div>
                      <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Session Title</label>
                      <input 
                        name="sessionTitle" value={form.sessionTitle} onChange={handleChange} 
                        placeholder="e.g., The Future of AI in Events"
                        className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-indigo-500 text-white placeholder-zinc-600 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner" 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Schedule / Timing</label>
                      <input 
                        name="schedule" value={form.schedule} onChange={handleChange} 
                        placeholder="e.g., Day 1 — 10:00 AM"
                        className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-indigo-500 text-white placeholder-zinc-600 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner" 
                      />
                    </div>
                  </div>

                  <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    form.availability 
                      ? 'bg-emerald-500/10 border-emerald-500/20 shadow-sm' 
                      : 'bg-zinc-950/50 border-zinc-800 hover:border-zinc-700'
                  }`}>
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" name="availability" checked={form.availability} onChange={handleChange}
                        className="w-6 h-6 appearance-none rounded-lg border-2 border-zinc-600 checked:border-emerald-500 checked:bg-emerald-500 outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all cursor-pointer" 
                      />
                      {form.availability && (
                        <svg className="w-4 h-4 text-white absolute left-1 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      )}
                    </div>
                    <div>
                      <div className={`font-bold ${form.availability ? 'text-emerald-400' : 'text-zinc-400'}`}>Available to speak</div>
                      <div className="text-zinc-500 text-xs mt-0.5">Toggle if the speaker is confirmed and available</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                <button 
                  type="submit" disabled={submitting} 
                  className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-3.5 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 focus:ring-4 focus:ring-indigo-500/30 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Saving...
                    </>
                  ) : (
                    isEdit ? 'Update Speaker' : 'Add Speaker'
                  )}
                </button>
                <Link 
                  to="/admin/speakers" 
                  className="flex-1 text-center border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white py-3.5 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSpeakerForm;
