// src/pages/Assistant.jsx — AI Chat Assistant (Gemini-powered)
import { useState, useRef, useEffect } from 'react';
import api from '../services/api';

const QUICK_ACTIONS = [
  { label: '📅 Upcoming Events', msg: 'Show me upcoming events' },
  { label: '📋 My Registrations', msg: 'Show my registrations' },
  { label: '🏢 Venues', msg: 'List all venues' },
  { label: '🎤 Speakers', msg: 'List all speakers' },
  { label: '⏰ Set Reminder', msg: 'Remind me about the next event 1 hour before' },
];

// ✅ Fixed: Safe renderer — converts markdown to React elements WITHOUT dangerouslySetInnerHTML
// Previously used dangerouslySetInnerHTML which allowed <img onerror=...> to steal JWTs
const SafeMessage = ({ text }) => {
  if (!text) return null;

  // Process line by line into React elements
  const lines = text.split('\n');
  const elements = [];

  lines.forEach((line, i) => {
    // Detect bullet points
    if (line.trim().startsWith('• ') || line.trim().startsWith('- ')) {
      const content = line.replace(/^[•\-]\s*/, '');
      elements.push(
        <li key={i} className="ml-4 list-disc">
          {renderBold(content)}
        </li>
      );
    } else if (line.trim()) {
      elements.push(<span key={i}>{renderBold(line)}<br /></span>);
    }
  });

  return <>{elements}</>;
};

// Convert **bold** and *bold* to <strong> tags safely
const renderBold = (text) => {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <strong key={i}>{part.slice(1, -1)}</strong>;
    }
    return part;
  });
};

const Assistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 0,
      sender: 'assistant',
      text: "👋 Hello! I'm your EventOps AI assistant. I can help you with event details, registrations, venues, speakers, and reminders. Just ask or click a quick action!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const trimmed = text?.trim();
    if (!trimmed || sending) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSending(true);

    const typingId = Date.now() + 1;
    setMessages(prev => [...prev, { id: typingId, sender: 'typing' }]);

    try {
      const { data } = await api.post('/assistant', { message: trimmed });
      setMessages(prev => [
        ...prev.filter(m => m.id !== typingId),
        {
          id: Date.now() + 2,
          sender: 'assistant',
          text: data.reply || '🤖 No response.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      setMessages(prev => [
        ...prev.filter(m => m.id !== typingId),
        {
          id: Date.now() + 2,
          sender: 'assistant',
          text: '⚠️ Sorry, I encountered an error. Please try again.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 0,
      sender: 'assistant',
      text: "👋 Hello! I'm your EventOps AI assistant. How can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text).catch(() => {});
  };

  return (
    <div className="min-h-screen bg-gray-950 py-6 px-4">
      <div className="max-w-3xl mx-auto h-[85vh] flex flex-col">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-2xl px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-2xl">🤖</div>
            <div>
              <h1 className="text-white font-bold">EventOps AI Assistant</h1>
              <p className="text-indigo-200 text-xs">Powered by Gemini 2.0 Flash</p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="bg-white/10 hover:bg-white/20 text-white text-sm px-3 py-1.5 rounded-lg transition-colors"
            title="Clear chat"
          >
            🗑️ Clear
          </button>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900 border-x border-gray-700 px-4 py-3 flex flex-wrap gap-2 flex-shrink-0">
          {QUICK_ACTIONS.map(({ label, msg }) => (
            <button
              key={msg}
              onClick={() => sendMessage(msg)}
              disabled={sending}
              className="bg-gray-800 hover:bg-indigo-600 border border-gray-700 hover:border-indigo-500 text-gray-300 hover:text-white text-xs px-3 py-1.5 rounded-full transition-all duration-200 disabled:opacity-50"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 bg-gray-900 border-x border-gray-700 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((msg) => {
            if (msg.sender === 'typing') return (
              <div key={msg.id} className="flex items-end gap-2">
                <div className="w-8 h-8 bg-indigo-600/30 rounded-full flex items-center justify-center text-sm flex-shrink-0">🤖</div>
                <div className="bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-2 h-2 bg-gray-500 rounded-full inline-block animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              </div>
            );

            const isUser = msg.sender === 'user';
            return (
              <div key={msg.id} className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${isUser ? 'bg-purple-600' : 'bg-indigo-600/30'}`}>
                  {isUser ? '👤' : '🤖'}
                </div>
                <div className={`group max-w-[75%] relative ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? 'bg-purple-600 text-white rounded-br-sm'
                      : 'bg-gray-800 text-gray-200 rounded-bl-sm'
                  }`}>
                    {isUser ? msg.text : <SafeMessage text={msg.text} />}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-600 text-xs">{msg.time}</span>
                    {!isUser && (
                      <button
                        onClick={() => copyText(msg.text)}
                        className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-gray-300 text-xs transition-opacity"
                        title="Copy"
                      >
                        📋
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="bg-gray-900 border border-gray-700 rounded-b-2xl px-4 py-3 flex gap-3 items-center flex-shrink-0">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
            placeholder="Type your question…"
            disabled={sending}
            className="flex-1 bg-gray-800 border border-gray-700 focus:border-indigo-500 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={sending || !input.trim()}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-5 py-3 rounded-xl font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-indigo-900/40"
          >
            {sending ? '⏳' : '📤 Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
