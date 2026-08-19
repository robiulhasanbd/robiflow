import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../stores/appStore';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import './ChatWidget.css';

export default function ChatWidget() {
  const { chatOpen, toggleChat } = useAppStore();
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! 👋 I'm Robi AI. How can I help you?", sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || loading) return;

    setMessages(prev => [...prev, { id: Date.now(), text: input, sender: 'user' }]);
    setInput('');
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I can help you with requirements tracking! 📋",
        "Check the dashboard for latest stats 📊",
        "Need to create a new requirement? Just ask! ✨",
        "Aminur is lazy but productive 😎",
        "Aziz is trying his best! 😂",
        "DMD Sir says: Complete the project ASAP! 🏃",
      ];
      const randomReply = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { id: Date.now(), text: randomReply, sender: 'bot' }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      {/* Floating Button */}
      <button className="chat-fab" onClick={toggleChat}>
        <MessageCircle size={24} />
      </button>

      {/* Chat Window */}
      {chatOpen && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-left">
              <Bot size={20} />
              <span>Robi AI</span>
            </div>
            <button className="chat-close" onClick={toggleChat}>
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="chat-body">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-message ${msg.sender}`}>
                <p>{msg.text}</p>
              </div>
            ))}
            {loading && (
              <div className="chat-message bot typing">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chat-footer">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              className="chat-input"
            />
            <button className="chat-send" onClick={handleSend} disabled={!input.trim()}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
