// src/pages/Profile.jsx - User Profile Page
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import Spinner from '../components/common/Spinner';

const Profile = () => {
  const { user, login, token } = useContext(AuthContext);
  const [form, setForm] = useState({ name: user?.name || '', phone: '', organization: '', bio: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // ✅ Fixed: Fetch full profile from /auth/me on mount so phone/org/bio
  // are hydrated from the database (they are NOT stored in the JWT token)
  useEffect(() => {
    api.get('/auth/me')
      .then(({ data }) => {
        setForm({
          name: data.name || '',
          phone: data.phone || '',
          organization: data.organization || '',
          bio: data.bio || '',
        });
      })
      .catch(() => {}) // silently fail if offline
      .finally(() => setFetching(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError(''); setSuccess('');
    try {
      const { data } = await api.put('/auth/profile', form);
      login(data, token);
      setSuccess('Profile updated successfully!');
    } catch (err) { setError(err.response?.data?.message || 'Update failed'); }
    finally { setLoading(false); }
  };

  if (fetching) return <div className="min-h-screen bg-[#09090b] flex items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-screen bg-[#09090b] py-12 px-4 font-sans selection:bg-indigo-500/30">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 tracking-tight">My Profile</h1>
        
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10 pb-8 border-b border-zinc-800/80">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-indigo-500/20 shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-white font-bold text-2xl mb-1">{user?.name}</h2>
              <p className="text-zinc-400 text-sm mb-4">{user?.email}</p>
              <span className="inline-block text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full capitalize">
                {user?.role} Account
              </span>
            </div>
          </div>

          <div className="relative z-10">
            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-4 rounded-xl mb-6 text-sm flex items-start gap-3">
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {success}
              </div>
            )}
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-4 rounded-xl mb-6 text-sm flex items-start gap-3">
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Jane Doe' },
                  { label: 'Phone', name: 'phone', type: 'text', placeholder: '+1 234 567 890' },
                ].map(({ label, name, type, placeholder }) => (
                  <div key={name} className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-300">{label}</label>
                    <input type={type} name={name} value={form[name]} placeholder={placeholder}
                      onChange={e => setForm({ ...form, [name]: e.target.value })}
                      className="w-full bg-zinc-950/50 border border-zinc-800 text-white placeholder-zinc-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm" />
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300">Organization / Company</label>
                <input type="text" name="organization" value={form.organization} placeholder="Acme Inc."
                  onChange={e => setForm({ ...form, organization: e.target.value })}
                  className="w-full bg-zinc-950/50 border border-zinc-800 text-white placeholder-zinc-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm" />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300">Bio</label>
                <textarea name="bio" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={4} placeholder="Tell us a bit about yourself..."
                  className="w-full bg-zinc-950/50 border border-zinc-800 text-white placeholder-zinc-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm resize-none" />
              </div>

              <button type="submit" disabled={loading}
                className="w-full sm:w-auto mt-4 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 focus:ring-4 focus:ring-indigo-500/20 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Saving...
                  </>
                ) : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
