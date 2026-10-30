import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

// LEFT SIDE snippets
const LEFT_SNIPPETS = [
  {
    lines: [
      '<span class="c-comment">// আজিজ ভাই আবার বাগ বানাইছে 😂</span>',
      '<span class="c-keyword">if</span> (<span class="c-var">aziz</span>.<span class="c-func">code</span> === <span class="c-string">"kaj kore"</span>) {',
      '  <span class="c-func">celebrate</span>();',
      '} <span class="c-keyword">else</span> {',
      '  <span class="c-func">ghor e jao</span>(); <span class="c-comment">// 😆</span>',
      '}',
    ],
  },
  {
    lines: [
      '<span class="c-comment">// রবিউলের লাইফ 🥲</span>',
      '<span class="c-keyword">while</span> (<span class="c-var">alive</span>) {',
      '  <span class="c-func">code</span>();',
      '  <span class="c-func">sleep</span>(<span class="c-num">4</span>); <span class="c-comment">// ঘন্টা</span>',
      '}',
    ],
  },
  {
    lines: [
      '<span class="c-comment">// আমিনুরের অলস কোড 😎</span>',
      '<span class="c-keyword">const</span> <span class="c-var">aminur</span> = {',
      '  <span class="c-var">status</span>: <span class="c-string">"lazy"</span>,',
      '  <span class="c-var">chai</span>: <span class="c-string">"always"</span>',
      '};',
    ],
  },
];

// RIGHT SIDE snippets (different!)
const RIGHT_SNIPPETS = [
  {
    lines: [
      '<span class="c-comment">// DMD Sir deadline 😱</span>',
      '<span class="c-keyword">if</span> (<span class="c-var">deadline</span> === <span class="c-string">"কাল"</span>) {',
      '  <span class="c-func">panic</span>();',
      '  <span class="c-func">chai khaw</span>(); <span class="c-comment">// ☕</span>',
      '}',
    ],
  },
  {
    lines: [
      '<span class="c-comment">// ক্লায়েন্টের কথা 💀</span>',
      '<span class="c-var">client</span>.<span class="c-func">says</span>(<span class="c-string">"এইটুকু change"</span>);',
      '<span class="c-comment">// বাস্তবে: পুরা রিরাইট 😭</span>',
      '<span class="c-func">rewrite</span>(<span class="c-var">everything</span>);',
    ],
  },
  {
    lines: [
      '<span class="c-comment">// IT টিমের অবস্থা 😅</span>',
      '<span class="c-var">bugs</span> = <span class="c-var">bugs</span> + <span class="c-num">1</span>;',
      '<span class="c-keyword">while</span> (<span class="c-var">bugs</span> &gt; <span class="c-num">0</span>) {',
      '  <span class="c-func">fix</span>();',
      '  <span class="c-var">bugs</span> = <span class="c-var">bugs</span> + <span class="c-num">1</span>;',
      '}',
    ],
  },
];

const LiveCode = ({ side, snippets }) => {
  const [currentSnippet, setCurrentSnippet] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const snippet = snippets[currentSnippet];
    
    if (isTyping && visibleLines < snippet.lines.length) {
      const timer = setTimeout(() => {
        setVisibleLines(v => v + 1);
      }, 400);
      return () => clearTimeout(timer);
    } else if (!isTyping) {
      const timer = setTimeout(() => {
        const next = (currentSnippet + 1) % snippets.length;
        setCurrentSnippet(next);
        setVisibleLines(0);
        setIsTyping(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (visibleLines === snippet.lines.length) {
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visibleLines, isTyping, currentSnippet, snippets]);

  const snippet = snippets[currentSnippet];

  return (
    <div className={`live-code ${side}`}>
      {snippet.lines.slice(0, visibleLines).map((line, i) => (
        <div
          key={`${currentSnippet}-${i}`}
          className="code-line"
          dangerouslySetInnerHTML={{ __html: line }}
        />
      ))}
      {visibleLines < snippet.lines.length && (
        <span className="typing-cursor">▊</span>
      )}
    </div>
  );
};

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState('username');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', text: 'RobiFlow Terminal v2.0.1' },
    { type: 'system', text: 'Connecting to secure server...' },
    { type: 'success', text: '✓ Connection established' },
    { type: 'system', text: '' },
    { type: 'system', text: 'Type your username to authenticate' },
  ]);
  const inputRef = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
  }, [step]);

  const addLine = (type, text) => {
    setHistory(prev => [...prev, { type, text }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (step === 'username') {
      if (!username.trim()) {
        setError('Username cannot be empty');
        return;
      }
      addLine('input', `$ login --user ${username}`);
      addLine('success', `✓ User "${username}" found`);
      setStep('password');
      return;
    }

    if (step === 'password') {
      if (!password.trim()) {
        setError('Password cannot be empty');
        return;
      }
      addLine('input', `$ login --password ********`);
      addLine('system', 'Authenticating...');
      setLoading(true);

      try {
        await new Promise(r => setTimeout(r, 1200));
        const success = login(username, password);
        
        if (success) {
          addLine('success', '✓ Authentication successful');
          addLine('success', '✓ Session created');
          addLine('system', '');
          addLine('success', `Welcome back, ${username}!`);
          addLine('system', 'Redirecting to dashboard...');
          await new Promise(r => setTimeout(r, 800));
          navigate('/dashboard');
        } else {
          addLine('error', '✗ Authentication failed');
          addLine('error', 'Invalid credentials. Please try again.');
          setError('Invalid credentials');
          setStep('username');
          setUsername('');
          setPassword('');
        }
      } catch (err) {
        addLine('error', '✗ Connection error');
        setError('Connection error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReset = () => {
    setStep('username');
    setUsername('');
    setPassword('');
    setError('');
    setHistory([
      { type: 'system', text: 'RobiFlow Terminal v2.0.1' },
      { type: 'system', text: '' },
      { type: 'system', text: 'Type your username to authenticate' },
    ]);
  };

  return (
    <div className="terminal-login">
      <div className="scanlines"></div>

      {/* LEFT side - different snippets */}
      <LiveCode side="left" snippets={LEFT_SNIPPETS} />

      {/* RIGHT side - different snippets */}
      <LiveCode side="right" snippets={RIGHT_SNIPPETS} />

      <div className="terminal-window">
        <div className="terminal-titlebar">
          <div className="titlebar-buttons">
            <span className="btn close"></span>
            <span className="btn minimize"></span>
            <span className="btn maximize"></span>
          </div>
          <div className="titlebar-text">
            <span className="path">~/robiflow</span>
            <span className="branch">⎇ main</span>
          </div>
          <div className="titlebar-right">
            <span className="status-dot"></span>
            <span className="status-text">connected</span>
          </div>
        </div>

        <div className="terminal-body">
          <div className="terminal-header">
            <pre className="ascii-logo">
{` ██████╗  ██████╗ ██████╗ ██╗    ███████╗██╗      ██████╗ ██╗    ██╗
 ██╔══██╗██╔═══██╗██╔══██╗██║    ██╔════╝██║     ██╔═══██╗██║    ██║
 ██████╔╝██║   ██║██████╔╝██║    █████╗  ██║     ██║   ██║██║ █╗ ██║
 ██╔══██╗██║   ██║██╔══██╗██║    ██╔══╝  ██║     ██║   ██║██║███╗██║
 ██║  ██║╚██████╔╝██████╔╝██║    ██║     ███████╗╚██████╔╝╚███╔███╔╝
 ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═╝    ╚═╝     ╚══════╝ ╚═════╝  ╚══╝╚══╝ `}
            </pre>
            <p className="terminal-tagline">Enterprise Requirements Management</p>
          </div>

          <div className="terminal-history">
            {history.map((line, i) => (
              <div key={i} className={`history-line ${line.type}`}>
                {line.text || '\u00A0'}
              </div>
            ))}
          </div>

          {error && (
            <div className="terminal-error">
              <span className="error-icon">✗</span>
              <span>{error}</span>
            </div>
          )}

          {!loading && (
            <form onSubmit={handleSubmit} className="terminal-input-line">
              <span className="prompt">
                {step === 'username' ? 'robi@robiflow:~$' : 'password@robiflow:~$'}
              </span>
              {step === 'username' ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="enter username"
                  className="terminal-input"
                  disabled={loading}
                  autoComplete="username"
                />
              ) : (
                <input
                  ref={inputRef}
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="enter password"
                  className="terminal-input"
                  disabled={loading}
                  autoComplete="current-password"
                />
              )}
              <span className="cursor">▊</span>
            </form>
          )}

          {loading && (
            <div className="terminal-loading">
              <span className="prompt">robi@robiflow:~$</span>
              <span className="loading-text"> authenticating</span>
              <span className="dots">
                <span>.</span><span>.</span><span>.</span>
              </span>
            </div>
          )}

          <div className="terminal-footer">
            <div className="footer-hints">
              <span className="hint">
                <kbd>Enter</kbd> {step === 'username' ? 'next step' : 'login'}
              </span>
              <span className="hint">
                <kbd>Tab</kbd> autocomplete
              </span>
              <span className="hint">
                <kbd>Ctrl+C</kbd> cancel
              </span>
            </div>
            <button type="button" className="reset-btn" onClick={handleReset}>
              ↻ Reset
            </button>
          </div>
        </div>

        <div className="terminal-statusbar">
          <div className="status-left">
            <span>🔒 SSL Enabled</span>
            <span>•</span>
            <span>UTF-8</span>
            <span>•</span>
            <span>JavaScript</span>
          </div>
          <div className="status-right">
            <span>Ln {history.length}, Col 1</span>
            <span>•</span>
            <span>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>

      <div className="terminal-info">
        <div className="info-item">
          <span className="info-dot"></span>
          <span>Secure Connection</span>
        </div>
        <div className="info-item">
          <span className="info-dot"></span>
          <span>6 Companies</span>
        </div>
        <div className="info-item">
          <span className="info-dot"></span>
          <span>Robi Flow</span>
        </div>
      </div>
    </div>
  );
}
