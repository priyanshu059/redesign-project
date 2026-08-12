// src/components/chatbot/ChatBubble.jsx - Single chat message bubble
const ChatBubble = ({ message, isUser }) => (
  <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
    {!isUser && (
      <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm mr-2 flex-shrink-0">
        🤖
      </div>
    )}
    <div
      className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
        isUser
          ? 'bg-purple-600 text-white rounded-br-sm'
          : 'bg-gray-700 text-gray-100 rounded-bl-sm'
      }`}
    >
      {message}
    </div>
    {isUser && (
      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm ml-2 flex-shrink-0">
        👤
      </div>
    )}
  </div>
);
export default ChatBubble;
