// src/pages/Register.jsx - User Registration Page
import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

import { Eye, EyeOff, Loader2 } from 'lucide-react';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/register', { name: form.name, email: form.email, password: form.password });
      login(data, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  return (
    <div className="flex min-h-screen bg-[#09090b] font-sans selection:bg-indigo-500/30">
      {/* Left Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 relative z-10 overflow-y-auto max-h-screen">
        {/* Mobile Branding */}
        <div className="absolute top-8 left-6 sm:left-12 flex lg:hidden items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white text-sm font-bold">E</span>
          </div>
          <span className="text-white text-xl font-bold tracking-tight">EventOps</span>
        </div>

        <div className="w-full max-w-md space-y-8 mt-12 lg:mt-0 py-10">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Create Account</h1>
            <p className="text-zinc-400 text-sm sm:text-base">
              Join EventOps AI today and elevate your event management.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
              <svg className="w-5 h-5 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-red-200/90">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-300">Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required
                className="w-full bg-zinc-900/50 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-zinc-600 shadow-sm"
                placeholder="John Doe" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-300">Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required
                className="w-full bg-zinc-900/50 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-zinc-600 shadow-sm"
                placeholder="you@company.com" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-300">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-zinc-900/50 border border-zinc-800 text-white rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-zinc-600 shadow-sm"
                  placeholder="Min 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-300">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full bg-zinc-900/50 border border-zinc-800 text-white rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-zinc-600 shadow-sm"
                  placeholder="Repeat password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                  tabIndex={-1}
                  aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-500/20 active:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3.5 rounded-xl transition-all flex items-center justify-center shadow-lg shadow-indigo-500/20 mt-6">
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="pt-6 text-center">
            <p className="text-zinc-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-bl from-indigo-900/40 to-zinc-950/90 z-10 mix-blend-overlay" />
        <img 
          src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80" 
          alt="Conference Setup" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        
        <div className="relative z-20 flex flex-col justify-between p-12 lg:p-16 w-full h-full text-right items-end">
          <div className="flex items-center gap-3">
            <span className="text-white text-2xl font-bold tracking-tight">EventOps</span>
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white text-xl font-bold">E</span>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};
export default Register;
