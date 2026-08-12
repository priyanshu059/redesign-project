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
        <li key={i} className="ml-4 list-disc mt-1 text-zinc-300">
          {renderBold(content)}
        </li>
      );
    } else if (line.trim()) {
      elements.push(<span key={i} className="block mt-2 text-zinc-300">{renderBold(line)}</span>);
    }
  });

  return <div className="space-y-1">{elements}</div>;
};

// Convert **bold** and *bold* to <strong> tags safely
const renderBold = (text) => {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <strong key={i} className="font-bold text-white">{part.slice(1, -1)}</strong>;
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
    <div className="min-h-screen bg-[#09090b] py-8 px-4 font-sans selection:bg-indigo-500/30">
      <div className="max-w-4xl mx-auto h-[85vh] flex flex-col relative z-10">
        
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-full bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

        {/* Header */}
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-t-3xl px-6 py-5 flex items-center justify-between flex-shrink-0 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-80"></div>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
              🤖
            </div>
            <div>
              <h1 className="text-white font-bold text-xl tracking-tight">EventOps AI</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                <p className="text-zinc-400 text-xs font-medium">Powered by Gemini 2.0 Flash</p>
              </div>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-600 text-sm px-4 py-2 rounded-xl transition-all shadow-sm"
            title="Clear chat"
          >
            Clear Chat
          </button>
        </div>

        {/* Quick Actions */}
        <div className="bg-zinc-900/60 backdrop-blur-md border-x border-zinc-800 px-6 py-4 flex flex-wrap gap-2.5 flex-shrink-0">
          {QUICK_ACTIONS.map(({ label, msg }) => (
            <button
              key={msg}
              onClick={() => sendMessage(msg)}
              disabled={sending}
              className="bg-zinc-950/50 hover:bg-indigo-500/10 border border-zinc-800 hover:border-indigo-500/40 text-zinc-400 hover:text-indigo-300 text-xs font-medium px-4 py-2 rounded-xl transition-all duration-200 disabled:opacity-50 whitespace-nowrap shadow-sm hover:shadow-indigo-500/5 hover:-translate-y-0.5"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 bg-zinc-950/80 backdrop-blur-xl border-x border-zinc-800 overflow-y-auto px-4 sm:px-6 py-6 space-y-6 scrollbar-hide">
          {messages.map((msg) => {
            if (msg.sender === 'typing') return (
              <div key={msg.id} className="flex items-end gap-3 animate-fade-in-up">
                <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center text-lg flex-shrink-0">🤖</div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl rounded-bl-sm px-5 py-4 flex gap-1.5 items-center shadow-md">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-2.5 h-2.5 bg-indigo-500/50 rounded-full inline-block animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            );

            const isUser = msg.sender === 'user';
            return (
              <div key={msg.id} className={`flex items-end gap-3 ${isUser ? 'flex-row-reverse' : 'animate-fade-in-up'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 border shadow-sm ${
                  isUser 
                    ? 'bg-indigo-500 text-white border-indigo-600' 
                    : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                }`}>
                  {isUser ? '👤' : '🤖'}
                </div>
                
                <div className={`group max-w-[80%] sm:max-w-[70%] relative ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className={`px-5 py-4 rounded-3xl text-[15px] leading-relaxed shadow-md ${
                    isUser
                      ? 'bg-indigo-500 text-white rounded-br-sm border border-indigo-600'
                      : 'bg-zinc-900 border border-zinc-800 rounded-bl-sm'
                  }`}>
                    {isUser ? msg.text : <SafeMessage text={msg.text} />}
                  </div>
                  
                  <div className={`flex items-center gap-2 mt-1.5 px-1 ${isUser ? 'flex-row-reverse' : ''}`}>
                    <span className="text-zinc-500 text-xs font-medium">{msg.time}</span>
                    {!isUser && (
                      <button
                        onClick={() => copyText(msg.text)}
                        className="opacity-0 group-hover:opacity-100 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-xs px-2 py-1 rounded transition-all"
                        title="Copy text"
                      >
                        Copy
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
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-b-3xl p-4 flex gap-3 items-center flex-shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
            placeholder="Ask EventOps AI anything..."
            disabled={sending}
            className="flex-1 bg-zinc-950/50 border border-zinc-800 focus:border-indigo-500 text-white placeholder-zinc-500 rounded-2xl px-5 py-4 text-[15px] outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={sending || !input.trim()}
            className="bg-indigo-500 hover:bg-indigo-600 text-white p-4 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 focus:ring-4 focus:ring-indigo-500/30 flex items-center justify-center shrink-0"
            title="Send Message"
          >
            {sending ? (
              <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              <svg className="w-6 h-6 ml-1 -mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
