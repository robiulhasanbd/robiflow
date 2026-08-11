import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';

export default function RobiWidget({ darkMode = true }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'robi',
      text: "Hi! I'm Robi from IT team. 👋\n\nHow can I help you with your Odoo project today?\n\nIf you face any technical problems, contact my admin Robiul Hasan.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const theme = darkMode
    ? {
        bg: '#161b22',
        border: '#30363d',
        text: '#c9d1d9',
        textSecondary: '#8b949e',
        accent: '#6366f1',
        userBg: '#6366f1',
        robiBg: '#0d1117',
      }
    : {
        bg: '#ffffff',
        border: '#e2e8f0',
        text: '#1e293b',
        textSecondary: '#64748b',
        accent: '#0891b2',
        userBg: '#0891b2',
        robiBg: '#f8fafc',
      };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages(prev => [...prev, { type: 'user', text: trimmed }]);
    setInput('');
    setLoading(true);

    // Simulate AI response (replace with Ollama later)
    setTimeout(() => {
      let reply = "That sounds interesting! Let me check the Odoo documentation for you. In the meantime, is there anything else I can help with?";
      if (trimmed.toLowerCase().includes('requirement') || trimmed.toLowerCase().includes('create')) {
        reply = "Sure! To create a new requirement, you can click the '+ New Requirement' button on the dashboard, or just tell me the details and I'll prepare it.";
      } else if (trimmed.toLowerCase().includes('status') || trimmed.toLowerCase().includes('progress')) {
        reply = "Your projects are 65% complete on average. The VAT Customization is in development and should be finished this week. 📊";
      } else if (trimmed.toLowerCase().includes('admin') || trimmed.toLowerCase().includes('contact')) {
        reply = "You can reach my admin Robiul Hasan at the IT department. He'll sort out any technical issues. 📞";
      }
      setMessages(prev => [...prev, { type: 'robi', text: reply }]);
      setLoading(false);
    }, 1500);
  };

  const quickActions = [
    { label: '📋 New Requirement', action: () => setInput('Create a new requirement for Odoo') },
    { label: '📊 Project Status', action: () => setInput('Show me the current project status') },
    { label: '👤 Contact Admin', action: () => setInput('How can I contact the admin?') },
  ];

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Chat popup */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 92,
            right: 24,
            zIndex: 9999,
            width: 380,
            height: 520,
            background: theme.bg,
            border: `1px solid ${theme.border}`,
            borderRadius: 16,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              color: 'white',
            }}
          >
            <Bot size={20} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Robi AI</div>
              <div style={{ fontSize: 11, opacity: 0.85 }}>IT Support Assistant</div>
            </div>
            <span style={{ fontSize: 10, background: '#10b981', padding: '2px 8px', borderRadius: 10 }}>Online</span>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 16,
              background: theme.bg,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '10px 14px',
                    borderRadius: msg.type === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: msg.type === 'user' ? theme.userBg : theme.robiBg,
                    color: msg.type === 'user' ? 'white' : theme.text,
                    border: msg.type === 'robi' ? `1px solid ${theme.border}` : 'none',
                    fontSize: 13,
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {msg.type === 'robi' && (
                    <div style={{ fontSize: 10, color: theme.textSecondary, marginBottom: 4 }}>🤖 Robi</div>
                  )}
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: theme.textSecondary, fontSize: 12 }}>
                <Sparkles size={14} color="#6366f1" /> Thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick actions */}
          <div style={{ padding: '8px 14px', display: 'flex', gap: 8, flexWrap: 'wrap', background: theme.bg, borderTop: `1px solid ${theme.border}` }}>
            {quickActions.map((qa, i) => (
              <button
                key={i}
                onClick={() => {
                  qa.action();
                  // Optionally auto-send after setting input; we'll just set input and let user press send
                }}
                style={{
                  background: theme.robiBg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 16,
                  padding: '5px 12px',
                  fontSize: 11,
                  cursor: 'pointer',
                  color: theme.accent,
                  fontWeight: 500,
                }}
              >
                {qa.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '10px 14px', background: theme.bg, borderTop: `1px solid ${theme.border}`, display: 'flex', gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: '10px 14px',
                background: theme.robiBg,
                border: `1px solid ${theme.border}`,
                borderRadius: 20,
                fontSize: 13,
                color: theme.text,
                outline: 'none',
              }}
            />
            <button
              onClick={handleSend}
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
