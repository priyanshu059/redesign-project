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
      // ✅ Fix 15: Real API call — message is saved to MongoDB
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
    <div className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-sm px-4 py-2 rounded-full mb-4">
            💬 We'd love to hear from you
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Contact Us</h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Drop us a message and our team will get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
              <h2 className="text-white font-bold text-xl mb-1">✉️ Send a Message</h2>
              <p className="text-gray-400 text-sm mb-6">Fill in the form and we'll respond within 24 hours.</p>

              {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>
              )}

              {submitted ? (
                <div className="text-center py-10">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-white font-bold text-lg mb-2">Message Sent!</h3>
                  <p className="text-gray-400">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        required
                        className="w-full bg-gray-800 border border-gray-700 focus:border-purple-500 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                        className="w-full bg-gray-800 border border-gray-700 focus:border-purple-500 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1.5">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      className="w-full bg-gray-800 border border-gray-700 focus:border-purple-500 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1.5">Message *</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Write your message here…"
                      required
                      className="w-full bg-gray-800 border border-gray-700 focus:border-purple-500 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none resize-none transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-3 rounded-xl font-bold transition-all duration-200 disabled:opacity-60 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-900/40"
                  >
                    {submitting ? '⏳ Sending...' : '📤 Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">

            {/* Contact Info */}
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-4">📞 Get in Touch</h2>
              <div className="space-y-4">
                {CONTACT_INFO.map(({ icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-purple-600/20 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                      {icon}
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">{label}</p>
                      <p className="text-white text-sm font-medium">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <hr className="border-gray-700 my-4" />
              <h3 className="text-white font-semibold text-sm mb-3">Follow Us</h3>
              <div className="flex gap-3">
                {SOCIAL.map(({ icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    title={label}
                    className="w-10 h-10 bg-gray-800 hover:bg-purple-600/30 hover:border-purple-500 border border-gray-700 rounded-xl flex items-center justify-center text-lg transition-all duration-200 hover:-translate-y-1"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-white font-semibold text-sm mb-3">🗺️ Find Us</h3>
              <div className="bg-gray-800 border-2 border-dashed border-gray-600 rounded-xl py-10 text-center">
                <div className="text-4xl mb-2">📍</div>
                <p className="text-gray-400 text-sm">Interactive Map</p>
                <p className="text-gray-600 text-xs mt-1">Google Maps embed goes here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
