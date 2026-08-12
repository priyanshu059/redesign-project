// src/pages/Profile.jsx - User Profile Page
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { user, login, token } = useContext(AuthContext);
  const [form, setForm] = useState({ name: user?.name || '', phone: '', organization: '', bio: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      .catch(() => {}); // silently fail if offline
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

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">My Profile</h1>
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-700">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">{user?.name}</h2>
              <p className="text-gray-400 text-sm">{user?.email}</p>
              <span className="text-xs bg-purple-900 text-purple-300 px-2 py-0.5 rounded-full capitalize">{user?.role}</span>
            </div>
          </div>

          {success && <div className="bg-green-900/50 border border-green-700 text-green-300 px-4 py-3 rounded-lg mb-4 text-sm">{success}</div>}
          {error && <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Full Name', name: 'name', type: 'text' },
              { label: 'Phone', name: 'phone', type: 'text' },
              { label: 'Organization', name: 'organization', type: 'text' },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
                <input type={type} name={name} value={form[name]}
                  onChange={e => setForm({ ...form, [name]: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-500" />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Bio</label>
              <textarea name="bio" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3}
                className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-500 resize-none" />
            </div>
            <button type="submit" disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Profile;
