import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) { setError('Please enter username and password'); return; }
    setError(''); setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1000));
      const success = login(username, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) { setError('Connection error'); }
    finally { setLoading(false); }
  };

  // ... rest of JSX unchanged (the same as your existing Login component)
  return (
    <div className="login-page">
      <div className="code-background">
        {/* LEFT SIDE */}
        <div className="code-block">
          <span className="code-comment">/* JK Tech Limited */</span><br />
          <span className="code-keyword">import</span> {'{'} <span className="code-variable">RobiAI</span> {'}'} <span className="code-keyword">from</span> <span className="code-string">'jkflow'</span>;
        </div>
        <div className="code-block">
          <span className="code-comment">// Leadership</span><br />
          <span className="code-keyword">const</span> <span className="code-variable">DMD</span> = <span className="code-string">"Ariful Islam"</span>;<br />
          <span className="code-keyword">const</span> <span className="code-variable">HR</span> = <span className="code-string">"Leena Chowdhury"</span>;
        </div>
        <div className="code-block">
          <span className="code-comment">// Development Team</span><br />
          <span className="code-variable">developers</span> = [<span className="code-string">"Alamin"</span>, <span className="code-string">"Kaushik"</span>];<br />
          <span className="code-variable">bugs</span> = <span className="code-variable">devs</span>.<span className="code-function">length</span> * <span className="code-variable">100</span>; <span className="code-comment">// 😆</span>
        </div>
        <div className="code-block">
          <span className="code-comment">// IT Team (4 Members)</span><br />
          <span className="code-variable">Robiul Hasan</span> → <span className="code-string">"JK Lifestyle, JK Tech"</span><br />
          <span className="code-variable">Aminur Rahman</span> → <span className="code-string">"JK Tech"</span>;
        </div>
        <div className="code-block">
          <span className="code-comment">// Health Revolution</span><br />
          <span className="code-variable">Salim</span> → <span className="code-string">"Sr Executive"</span><br />
          <span className="code-variable">Aziz</span> → <span className="code-string">"Junior (Future Senior 😎)"</span>;
        </div>
        <div className="code-block">
          <span className="code-comment">// আজিজ মাথা মোটা 😂</span><br />
          <span className="code-keyword">if</span> (<span className="code-variable">aziz</span>.<span className="code-function">understands</span>()) {'{'}<br />
          &nbsp;&nbsp;<span className="code-function">miracle</span>();<br />
          {'}'}
        </div>
        <div className="code-block">
          <span className="code-comment">// আমিনুর অলস কিন্তু কাজের 😎</span><br />
          <span className="code-variable">aminur</span>.<span className="code-variable">lazy</span> = <span className="code-keyword">true</span>;<br />
          <span className="code-variable">aminur</span>.<span className="code-variable">productive</span> = <span className="code-keyword">true</span>; <span className="code-comment">// 🤷</span>
        </div>

        {/* RIGHT SIDE */}
        <div className="code-block">
          <span className="code-comment">// 6 Companies</span><br />
          <span className="code-variable">companies</span> = [<span className="code-string">"JK Lifestyle"</span>, <span className="code-string">"JK Tech"</span>,<br />
          &nbsp;&nbsp;<span className="code-string">"Health Revolution"</span>, <span className="code-string">"Organic Life"</span>,<br />
          &nbsp;&nbsp;<span className="code-string">"Food Arena"</span>, <span className="code-string">"Fitness Arena"</span>];
        </div>
        <div className="code-block">
          <span className="code-comment">// DMD Sir says:</span><br />
          <span className="code-keyword">if</span> (<span className="code-variable">deadline</span> == <span className="code-string">"কাল"</span>) {'{'}<br />
          &nbsp;&nbsp;<span className="code-function">panic</span>(); <span className="code-comment">// দৌড়াও 🏃</span><br />
          {'}'}
        </div>
        <div className="code-block">
          <span className="code-keyword">SELECT</span> * <span className="code-keyword">FROM</span> <span className="code-variable">requirements</span><br />
          <span className="code-keyword">WHERE</span> status = <span className="code-string">'development'</span><br />
          <span className="code-keyword">AND</span> company = <span className="code-string">'JKTech'</span>;
        </div>
        <div className="code-block">
          <span className="code-comment">// সেলিম ভাই ক্রিয়েটিভ 🎨</span><br />
          <span className="code-variable">selim</span>.<span className="code-variable">creativity</span> = <span className="code-variable">100</span>;<br />
          <span className="code-variable">selim</span>.<span className="code-function">needsBreak</span>(<span className="code-string">"every 30 min"</span>);
        </div>
        <div className="code-block">
          <span className="code-comment">// জাওয়াদ ভাই কাম চোর 🏃</span><br />
          <span className="code-keyword">try</span> {'{'}<br />
          &nbsp;&nbsp;<span className="code-variable">zawad</span>.<span className="code-function">doWork</span>();<br />
          {'}'} <span className="code-keyword">catch</span> {'{'}<br />
          &nbsp;&nbsp;<span className="code-function">escape</span>();<br />
          {'}'}
        </div>
        <div className="code-block">
          <span className="code-comment">// রবিউল busy person 😤</span><br />
          <span className="code-variable">robiul</span>.<span className="code-variable">status</span> = <span className="code-string">"always busy"</span>;<br />
          <span className="code-variable">robiul</span>.<span className="code-function">preferHomeOffice</span>();
        </div>
        <div className="code-block">
          <span className="code-comment">/* JK Tech × SoftSync */</span><br />
          <span className="code-keyword">npm</span> run dev<br />
          <span className="code-variable">Server</span> <span className="code-function">started</span> on :3000
        </div>
      </div>

      <div className="login-card">
        <div className="login-logo">
          <img src="/logo.png" alt="JK Tech" />
          <h1>JKFlow</h1>
          <p>Sign in to your account</p>
        </div>

        {error && <div className="error-message">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username" disabled={loading} autoFocus />
            </div>
          </div>
          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" disabled={loading} />
            </div>
          </div>
          <div className="form-row">
            <label className="remember-me"><input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} /> Remember me</label>
            <a href="#" className="forgot-link">Forgot password?</a>
          </div>
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? <><span className="spinner" /> Signing in...</> : 'Sign In'}
          </button>
        </form>
        <div className="login-footer"><strong>JK Tech Limited</strong> × SoftSync</div>
      </div>
    </div>
  );
}
