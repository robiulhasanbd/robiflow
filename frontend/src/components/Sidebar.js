import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAppStore } from '../stores/appStore';
import { LayoutDashboard, ListTodo, Blocks, ChevronLeft, ChevronRight, Sun, Moon, LogOut } from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/requirements', icon: ListTodo, label: 'Requirements' },
  { to: '/modules', icon: Blocks, label: 'Modules' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { sidebarOpen, toggleSidebar, theme, toggleTheme } = useAppStore();
  const location = useLocation();

  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      <div className="sidebar-brand">
        <div className="brand-logo">JF</div>
        {sidebarOpen && <span className="brand-text">JKFlow</span>}
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="footer-btn" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          {sidebarOpen && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {sidebarOpen && user && (
          <div className="user-info">
            <span className="user-avatar">{user.avatar}</span>
            <div>
              <p className="user-name">{user.username}</p>
              <p className="user-role">{user.role}</p>
            </div>
          </div>
        )}

        <button className="footer-btn logout-btn" onClick={logout}>
          <LogOut size={18} />
          {sidebarOpen && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
