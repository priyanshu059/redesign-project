// src/components/chatbot/ChatBubble.jsx - Single chat message bubble
import { Bot, User } from 'lucide-react';

const ChatBubble = ({ message, isUser }) => (
  <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 items-end gap-3`}>
    {!isUser && (
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 border shadow-sm bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
        <Bot className="w-5 h-5" />
      </div>
    )}
    <div
      className={`max-w-xs lg:max-w-md px-5 py-4 rounded-3xl text-[15px] leading-relaxed shadow-md ${
        isUser
          ? 'bg-indigo-500 text-white rounded-br-sm border border-indigo-600'
          : 'bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-bl-sm'
      }`}
    >
      {message}
    </div>
    {isUser && (
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 border shadow-sm bg-indigo-500 text-white border-indigo-600">
        <User className="w-5 h-5" />
      </div>
    )}
  </div>
);
export default ChatBubble;
