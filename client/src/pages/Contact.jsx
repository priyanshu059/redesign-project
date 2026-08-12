// src/pages/Contact.jsx — Contact Us page
import { useState } from 'react';
import api from '../services/api';

const CONTACT_INFO = [
  { icon: '📍', label: 'Address', value: '123 AI Boulevard, San Francisco, CA 94105' },
  { icon: '✉️', label: 'Email', value: 'support@eventops.ai' },
  { icon: '📞', label: 'Phone', value: '+1 (800) 123-4567' },
  { icon: '🕐', label: 'Business Hours', value: 'Mon–Fri: 9:00 AM – 6:00 PM (PST)' },
];

const SOCIAL = [
  { icon: '🔗', label: 'LinkedIn', href: '#' },
  { icon: '🐦', label: 'Twitter / X', href: '#' },
  { icon: '▶️', label: 'YouTube', href: '#' },
  { icon: '⚡', label: 'GitHub', href: '#' },
];

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.post('/contact', form);
      setSubmitted(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] font-sans selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium px-4 py-2 rounded-full mb-6">
            💬 We'd love to hear from you
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Get in Touch</h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Have questions about EventOps AI? Drop us a message and our dedicated team will get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 max-w-6xl mx-auto">
          
          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-2xl h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <h2 className="text-white font-bold text-2xl mb-2">Send a Message</h2>
                <p className="text-zinc-400 text-sm mb-8">Fill in the form below and we'll respond within 24 hours.</p>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-4 rounded-xl mb-6 text-sm flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {error}
                  </div>
                )}

                {submitted ? (
                  <div className="text-center py-16 animate-fade-in">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                      <span className="text-4xl">✅</span>
                    </div>
                    <h3 className="text-white font-bold text-2xl mb-3">Message Sent Successfully!</h3>
                    <p className="text-zinc-400 max-w-sm mx-auto mb-8 leading-relaxed">Thank you for reaching out. A member of our team will get back to you shortly.</p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors border border-zinc-700"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="block text-zinc-300 text-sm font-medium">Full Name <span className="text-indigo-400">*</span></label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Jane Doe"
                          required
                          className="w-full bg-zinc-950/50 border border-zinc-800 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder-zinc-600 rounded-xl px-4 py-3.5 text-sm outline-none transition-all shadow-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-zinc-300 text-sm font-medium">Email Address <span className="text-indigo-400">*</span></label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="jane@company.com"
                          required
                          className="w-full bg-zinc-950/50 border border-zinc-800 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder-zinc-600 rounded-xl px-4 py-3.5 text-sm outline-none transition-all shadow-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-zinc-300 text-sm font-medium">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        placeholder="How can we help?"
                        className="w-full bg-zinc-950/50 border border-zinc-800 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder-zinc-600 rounded-xl px-4 py-3.5 text-sm outline-none transition-all shadow-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-zinc-300 text-sm font-medium">Message <span className="text-indigo-400">*</span></label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Write your message here…"
                        required
                        className="w-full bg-zinc-950/50 border border-zinc-800 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder-zinc-600 rounded-xl px-4 py-3.5 text-sm outline-none resize-none transition-all shadow-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3.5 rounded-xl font-semibold transition-all duration-200 disabled:opacity-60 shadow-lg shadow-indigo-500/20 mt-2 flex items-center justify-center gap-2 focus:ring-4 focus:ring-indigo-500/20"
                    >
                      {submitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* Contact Info */}
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
              <h2 className="text-white font-bold text-xl mb-6 relative z-10">Direct Contact</h2>
              <div className="space-y-6 relative z-10">
                {CONTACT_INFO.map(({ icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-zinc-800/50 border border-zinc-700/50 rounded-xl flex items-center justify-center text-lg flex-shrink-0 shadow-sm">
                      {icon}
                    </div>
                    <div>
                      <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
                      <p className="text-white text-sm font-medium">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <hr className="border-zinc-800 my-8 relative z-10" />
              <div className="relative z-10">
                <h3 className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-4">Connect Socially</h3>
                <div className="flex gap-3">
                  {SOCIAL.map(({ icon, label, href }) => (
                    <a
                      key={label}
                      href={href}
                      title={label}
                      className="w-10 h-10 bg-zinc-800/50 hover:bg-indigo-500/20 border border-zinc-700/50 hover:border-indigo-500/50 rounded-xl flex items-center justify-center text-lg transition-all duration-200 hover:-translate-y-1 shadow-sm"
                    >
                      {icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-xl flex-grow flex flex-col">
              <h3 className="text-white font-bold text-xl mb-6">Our Headquarters</h3>
              <div className="bg-zinc-950/50 border border-dashed border-zinc-700 rounded-2xl flex-grow flex flex-col items-center justify-center min-h-[200px] p-6 text-center group transition-colors hover:border-zinc-500">
                <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  📍
                </div>
                <p className="text-zinc-300 font-medium">Interactive Map View</p>
                <p className="text-zinc-500 text-sm mt-2">Map embedding area</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
