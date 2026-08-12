// src/pages/admin/AdminIncidentForm.jsx — Add / Edit Incident
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import Sidebar from '../../components/admin/Sidebar';
import Spinner from '../../components/common/Spinner';

const EMPTY = { title: '', description: '', severity: 'Low', status: 'Open', resolution: '', event: '' };

const AdminIncidentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(EMPTY);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const reqs = [api.get('/events')];
    if (isEdit) reqs.push(api.get(`/incidents/${id}`));
    Promise.all(reqs)
      .then(([eventsRes, incRes]) => {
        setEvents(eventsRes.data);
        if (incRes) {
          const d = incRes.data;
          setForm({ title: d.title || '', description: d.description || '', severity: d.severity || 'Low', status: d.status || 'Open', resolution: d.resolution || '', event: d.event?._id || d.event || '' });
        }
      })
      .catch(() => setError('Failed to load data.'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.event) { setError('Title, description and event are required.'); return; }
    setSubmitting(true); setError('');
    try {
      if (isEdit) await api.put(`/incidents/${id}`, form);
      else await api.post('/incidents', form);
      navigate('/admin/incidents');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save incident.');
      setSubmitting(false);
    }
  };

  const inputCls = "w-full bg-zinc-950/50 border border-zinc-800 focus:border-rose-500 text-white placeholder-zinc-600 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-500/20 transition-all shadow-inner";
  const selectCls = "w-full bg-zinc-950/50 border border-zinc-800 focus:border-rose-500 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-500/20 transition-all shadow-inner appearance-none cursor-pointer";

  const SEVERITY_OPTS = [
    { v: 'Low', color: 'emerald' }, 
    { v: 'Medium', color: 'amber' }, 
    { v: 'High', color: 'orange' }, 
    { v: 'Critical', color: 'rose' },
  ];

  return (
    <div className="flex min-h-screen bg-[#09090b] font-sans selection:bg-rose-500/30">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/admin/incidents" className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 transition-all shadow-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                {isEdit ? '✏️ Edit Incident' : '⚠️ Report Incident'}
              </h1>
              <p className="text-zinc-500 text-sm mt-1">Record issues, track severity, and manage resolutions</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Spinner size="lg" /></div>
          ) : (
            <form onSubmit={handleSubmit} className="relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl pointer-events-none z-0"></div>
              
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
                      <span className="text-rose-400">📄</span> Incident Report
                    </h3>
                    
                    <div className="space-y-5">
                      <div>
                        <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Target Event <span className="text-rose-500">*</span></label>
                        <div className="relative">
                          <select name="event" value={form.event} onChange={handleChange} required className={selectCls}>
                            <option value="">Select an event…</option>
                            {events.map(e => <option key={e._id} value={e._id}>{e.title}</option>)}
                          </select>
                          <svg className="w-4 h-4 text-zinc-500 absolute right-4 top-4 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>

                      <div>
                        <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Incident Title <span className="text-rose-500">*</span></label>
                        <input name="title" value={form.title} onChange={handleChange} placeholder="Brief title of the incident" required className={inputCls} />
                      </div>

                      <div>
                        <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Detailed Description <span className="text-rose-500">*</span></label>
                        <textarea 
                          name="description" value={form.description} onChange={handleChange} rows={5} 
                          placeholder="Provide a detailed description of what happened, who was involved, and any immediate actions taken..." required
                          className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-rose-500 text-white placeholder-zinc-600 rounded-xl px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-rose-500/20 transition-all shadow-inner" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar Setup */}
                <div className="space-y-6">
                  <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                      <span className="text-rose-400">⚙️</span> Assessment
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-3">Severity Level</label>
                        <div className="flex flex-col gap-2">
                          {SEVERITY_OPTS.map(({ v, color }) => (
                            <label key={v} className={`relative flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                              form.severity === v 
                                ? `bg-${color}-500/10 border-${color}-500/30 text-${color}-400 shadow-sm` 
                                : 'bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800/50 hover:border-zinc-700'
                            }`}>
                              <div className="flex items-center gap-3">
                                <span className={`w-2 h-2 rounded-full bg-${color}-500 ${form.severity === v && v === 'Critical' ? 'animate-pulse' : ''}`}></span>
                                <span className="font-bold text-sm">{v}</span>
                              </div>
                              <input type="radio" name="severity" value={v} checked={form.severity === v} onChange={handleChange} className="sr-only" />
                              {form.severity === v && (
                                <svg className={`w-4 h-4 text-${color}-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                              )}
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Resolution Status</label>
                        <div className="relative">
                          <select name="status" value={form.status} onChange={handleChange} className={selectCls}>
                            {['Open', 'In Progress', 'Resolved', 'Closed'].map(s => <option key={s}>{s}</option>)}
                          </select>
                          <svg className="w-4 h-4 text-zinc-500 absolute right-4 top-4 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                      <span className="text-rose-400">✅</span> Resolution
                    </h3>
                    
                    <div>
                      <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Resolution Notes</label>
                      <textarea 
                        name="resolution" value={form.resolution} onChange={handleChange} rows={4} 
                        placeholder="How was this incident resolved? (fill in when resolved)"
                        className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-rose-500 text-white placeholder-zinc-600 rounded-xl px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-rose-500/20 transition-all shadow-inner" 
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col gap-3">
                    <button 
                      type="submit" disabled={submitting} 
                      className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3.5 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-rose-500/20 hover:-translate-y-0.5 focus:ring-4 focus:ring-rose-500/30 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <svg className="animate-spin -ml-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          Saving...
                        </>
                      ) : (
                        isEdit ? 'Update Incident' : 'Report Incident'
                      )}
                    </button>
                    <Link 
                      to="/admin/incidents" 
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

export default AdminIncidentForm;
