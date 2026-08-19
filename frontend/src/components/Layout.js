import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAppStore } from '../stores/appStore';
import Sidebar from './Sidebar';
import ChatWidget from './ChatWidget';
import './Layout.css';

export default function Layout() {
  const { user } = useAuth();
  const { sidebarOpen } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="app-layout">
      <Sidebar />
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Outlet />
      </main>
      <ChatWidget />
    </div>
  );
}
