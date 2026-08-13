// src/pages/admin/AdminSponsorshipForm.jsx — Add / Edit Sponsorship
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import Sidebar from '../../components/admin/Sidebar';
import Spinner from '../../components/common/Spinner';
import { Edit2, PlusCircle, Handshake, DollarSign, User } from 'lucide-react';

const EMPTY = { sponsorName: '', sponsorType: 'Gold', amount: '', contactEmail: '', contactPhone: '', description: '', status: 'Pending', event: '' };

const AdminSponsorshipForm = () => {
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
    if (isEdit) reqs.push(api.get(`/sponsorships/${id}`));
    Promise.all(reqs)
      .then(([eventsRes, sponsorRes]) => {
        setEvents(eventsRes.data);
        if (sponsorRes) {
          const d = sponsorRes.data;
          setForm({ sponsorName: d.sponsorName || '', sponsorType: d.sponsorType || 'Gold', amount: d.amount || '', contactEmail: d.contactEmail || '', contactPhone: d.contactPhone || '', description: d.description || '', status: d.status || 'Pending', event: d.event?._id || d.event || '' });
        }
      })
      .catch(() => setError('Failed to load data.'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.sponsorName || !form.amount || !form.event) { setError('Sponsor name, amount and event are required.'); return; }
    setSubmitting(true); setError('');
    try {
      if (isEdit) await api.put(`/sponsorships/${id}`, form);
      else await api.post('/sponsorships', form);
      navigate('/admin/sponsorships');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save sponsorship.');
      setSubmitting(false);
    }
  };

  const inputCls = "w-full bg-zinc-950/50 border border-zinc-800 focus:border-indigo-500 text-white placeholder-zinc-600 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner";
  const selectCls = "w-full bg-zinc-950/50 border border-zinc-800 focus:border-indigo-500 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner appearance-none cursor-pointer";

  return (
    <div className="flex min-h-screen bg-[#09090b] font-sans selection:bg-indigo-500/30">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/admin/sponsorships" className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 transition-all shadow-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <>{isEdit ? <Edit2 className="w-6 h-6 mr-2 inline" /> : <PlusCircle className="w-6 h-6 mr-2 inline" />} {isEdit ? 'Edit Sponsorship' : 'Add Sponsorship'}</>
              </h1>
              <p className="text-zinc-500 text-sm mt-1">Configure sponsor tiers and financial contributions</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Spinner size="lg" /></div>
          ) : (
            <form onSubmit={handleSubmit} className="relative">
              <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none z-0"></div>
              
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
                      <Handshake className="w-5 h-5 text-indigo-400" /> Sponsor Details
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Sponsor Name <span className="text-rose-500">*</span></label>
                          <input name="sponsorName" value={form.sponsorName} onChange={handleChange} placeholder="Company name" required className={inputCls} />
                        </div>
                        <div>
                          <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Sponsor Tier</label>
                          <div className="relative">
                            <select name="sponsorType" value={form.sponsorType} onChange={handleChange} className={selectCls}>
                              {['Platinum', 'Gold', 'Silver', 'Bronze', 'Other'].map(t => <option key={t}>{t}</option>)}
                            </select>
                            <svg className="w-4 h-4 text-zinc-500 absolute right-4 top-4 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Description & Notes</label>
                        <textarea 
                          name="description" value={form.description} onChange={handleChange} rows={4} 
                          placeholder="Notes about this sponsorship, deliverables, or agreements..."
                          className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-indigo-500 text-white placeholder-zinc-600 rounded-xl px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar Setup */}
                <div className="space-y-6">
                  <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-indigo-400" /> Value & Status
                    </h3>
                    
                    <div className="space-y-5">
                      <div>
                        <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Amount (USD) <span className="text-rose-500">*</span></label>
                        <div className="relative">
                          <span className="absolute left-4 top-3 text-zinc-500 font-bold">$</span>
                          <input type="number" name="amount" value={form.amount} onChange={handleChange} placeholder="5000" required min={0} className={`${inputCls} pl-8`} />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Status</label>
                        <div className="relative">
                          <select name="status" value={form.status} onChange={handleChange} className={selectCls}>
                            {['Pending', 'Confirmed', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                          </select>
                          <svg className="w-4 h-4 text-zinc-500 absolute right-4 top-4 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                      <User className="w-5 h-5 text-indigo-400" /> Contact Info
                    </h3>
                    
                    <div className="space-y-5">
                      <div>
                        <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Email Address</label>
                        <input type="email" name="contactEmail" value={form.contactEmail} onChange={handleChange} placeholder="sponsor@company.com" className={inputCls} />
                      </div>
                      <div>
                        <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Phone Number</label>
                        <input name="contactPhone" value={form.contactPhone} onChange={handleChange} placeholder="+1 800 123 4567" className={inputCls} />
                      </div>
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
                        isEdit ? 'Update Sponsorship' : 'Add Sponsorship'
                      )}
                    </button>
                    <Link 
                      to="/admin/sponsorships" 
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

export default AdminSponsorshipForm;
