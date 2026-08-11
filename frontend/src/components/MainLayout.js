import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Bell, UserCircle, Sun, Moon, LayoutDashboard, ClipboardList, GitBranch } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function MainLayout() {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const t = darkMode ? {
    bg: '#06080d',
    card: 'rgba(10, 14, 23, 0.9)',
    border: 'rgba(255,255,255,0.06)',
    text: '#e4e4e7',
    text2: '#a1a1aa',
  } : {
    bg: '#fafbfc',
    card: 'rgba(255,255,255,0.95)',
    border: 'rgba(0,0,0,0.06)',
    text: '#18181b',
    text2: '#71717a',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: t.bg,
      color: t.text,
      fontFamily: "'Inter', sans-serif",
      transition: 'background 0.4s, color 0.4s',
    }}>
      {/* Header */}
      <header style={{
        background: t.card,
        borderBottom: `1px solid ${t.border}`,
        padding: '0 28px',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logo.png" alt="JK" style={{ width: 28, height: 28, borderRadius: 6 }} />
            <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.3px' }}>JKFlow</span>
          </div>
          <nav style={{ display: 'flex', gap: 4 }}>
            <Link to="/dashboard" style={{
              padding: '6px 14px', borderRadius: 6, fontSize: 13, fontWeight: 500,
              color: t.text2, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
            }}><LayoutDashboard size={16} /> Dashboard</Link>
            <Link to="/requirements" style={{
              padding: '6px 14px', borderRadius: 6, fontSize: 13, fontWeight: 500,
              color: t.text2, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
            }}><ClipboardList size={16} /> Requirements</Link>
            <Link to="/modules" style={{
              padding: '6px 14px', borderRadius: 6, fontSize: 13, fontWeight: 500,
              color: t.text2, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
            }}><GitBranch size={16} /> Modules</Link>
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={toggleDarkMode}
            style={{
              width: 36, height: 36, borderRadius: 8,
              background: darkMode ? 'rgba(6,182,212,0.08)' : 'rgba(8,145,178,0.06)',
              border: `1px solid ${t.border}`, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: t.text2,
            }}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Bell size={18} color={t.text2} style={{ cursor: 'pointer' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={handleLogout}>
            <UserCircle size={28} color={t.text2} />
            <span style={{ fontSize: 12, color: t.text2 }}>{user?.name}</span>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <Outlet />
    </div>
  );
}
