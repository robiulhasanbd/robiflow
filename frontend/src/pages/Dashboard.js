import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAppStore } from '../stores/appStore';
import { 
  TrendingUp, Clock, CheckCircle2, AlertTriangle,
  Plus, Activity, Users, Calendar, ArrowUpRight,
  Building2, ListTodo, Target
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import './Dashboard.css';

const STAT_CARDS = [
  { key: 'total', label: 'Total Requirements', icon: ListTodo, color: '#4dabf7', bg: 'rgba(77,171,247,0.1)' },
  { key: 'inProgress', label: 'In Progress', icon: Clock, color: '#ffd43b', bg: 'rgba(255,212,59,0.1)' },
  { key: 'completed', label: 'Completed', icon: CheckCircle2, color: '#69db7c', bg: 'rgba(105,219,124,0.1)' },
  { key: 'blocked', label: 'Blocked', icon: AlertTriangle, color: '#ff6b6b', bg: 'rgba(255,107,107,0.1)' },
];

const COMPANIES = [
  { name: 'JK Lifestyle', color: '#4dabf7' },
  { name: 'JK Tech', color: '#da77f2' },
  { name: 'Health Revolution', color: '#69db7c' },
  { name: 'Organic Life', color: '#ffd43b' },
  { name: 'Food Arena', color: '#ff6b6b' },
  { name: 'Fitness Arena', color: '#ff922b' },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [requirements, setRequirements] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, reqRes, actRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/requirements'),
        api.get('/dashboard/activities'),
      ]);
      setStats(statsRes.data);
      setRequirements(reqRes.data);
      setActivities(actRes.data);
    } catch (err) {
      // Demo data fallback
      setStats({
        total: 42, inProgress: 15, completed: 22, blocked: 5,
        byStatus: { backlog: 8, todo: 12, in_progress: 15, review: 4, completed: 22, blocked: 5 },
        byPriority: { urgent: 3, high: 10, medium: 20, low: 9 },
        completionRate: 52,
      });
      setRequirements([
        { id: '1', title: 'CRM Dashboard Redesign', status: 'in_progress', priority: 'high', progress: 65, dueDate: '2026-08-20', company: 'JK Lifestyle', assignee: 'Robiul' },
        { id: '2', title: 'AI Lead Scoring', status: 'review', priority: 'high', progress: 85, dueDate: '2026-08-15', company: 'JK Tech', assignee: 'Aminur' },
        { id: '3', title: 'Payment Gateway', status: 'todo', priority: 'urgent', progress: 0, dueDate: '2026-09-01', company: 'Food Arena', assignee: 'Aziz' },
        { id: '4', title: 'Mobile Responsive Fix', status: 'completed', priority: 'medium', progress: 100, dueDate: '2026-07-30', company: 'JK Lifestyle', assignee: 'Robiul' },
        { id: '5', title: 'API Rate Limiting', status: 'blocked', priority: 'low', progress: 30, dueDate: '2026-08-10', company: 'JK Tech', assignee: 'Zawad' },
      ]);
      setActivities([
        { id: '1', user: 'Robiul', action: 'created', target: 'CRM Dashboard', time: '2 min ago', avatar: '👨‍💻' },
        { id: '2', user: 'Aminur', action: 'completed', target: 'Mobile Fix', time: '1 hour ago', avatar: '😎' },
        { id: '3', user: 'Aziz', action: 'commented', target: 'Payment Gateway', time: '3 hours ago', avatar: '😂' },
        { id: '4', user: 'Zawad', action: 'started', target: 'API Rate Limiting', time: '5 hours ago', avatar: '🏃' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const statusData = stats.byStatus ? 
    Object.entries(stats.byStatus).map(([key, val]) => ({ name: key.replace('_', ' '), value: val })) :
    [];
  const COLORS = ['#64748b', '#4dabf7', '#ffd43b', '#da77f2', '#69db7c', '#ff6b6b'];

  const priorityData = stats.byPriority ?
    Object.entries(stats.byPriority).map(([key, val]) => ({ name: key, value: val })) :
    [];

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of your enterprise requirements</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/requirements')}>
          <Plus size={18} /> New Requirement
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          const value = stats?.[card.key] || 0;
          return (
            <div key={card.key} className="stat-card" style={{ borderColor: `${card.color}20` }}>
              <div className="stat-icon" style={{ background: card.bg, color: card.color }}>
                <Icon size={22} />
              </div>
              <div className="stat-info">
                <h3 className="stat-value">{value}</h3>
                <p className="stat-label">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="charts-grid">
        {/* Status Chart */}
        <div className="chart-card">
          <h3 className="chart-title">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%" cy="50%"
                innerRadius={60} outerRadius={100}
                paddingAngle={4} dataKey="value"
              >
                {statusData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#0d1117', border: '1px solid #1e293b', borderRadius: '8px', color: '#e2e8f0' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="chart-legend">
            {statusData.map((item, idx) => (
              <span key={item.name} className="legend-item">
                <span className="legend-dot" style={{ background: COLORS[idx] }} />
                {item.name} ({item.value})
              </span>
            ))}
          </div>
        </div>

        {/* Priority Chart */}
        <div className="chart-card">
          <h3 className="chart-title">Priority Breakdown</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={priorityData}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{ background: '#0d1117', border: '1px solid #1e293b', borderRadius: '8px', color: '#e2e8f0' }}
              />
              <Bar dataKey="value" fill="#06b6d4" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="bottom-grid">
        {/* Companies */}
        <div className="card">
          <h3 className="card-title"><Building2 size={18} /> Companies</h3>
          <div className="company-list">
            {COMPANIES.map((comp) => (
              <div key={comp.name} className="company-item">
                <div className="company-dot" style={{ background: comp.color }} />
                <span className="company-name">{comp.name}</span>
                <span className="company-count">
                  {Math.floor(Math.random() * 10) + 3} reqs
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Requirements */}
        <div className="card">
          <h3 className="card-title"><ListTodo size={18} /> Recent Requirements</h3>
          <div className="req-list">
            {requirements.slice(0, 5).map((req) => (
              <div key={req.id} className="req-item">
                <div className="req-info">
                  <p className="req-title">{req.title}</p>
                  <span className={`req-status status-${req.status}`}>{req.status.replace('_', ' ')}</span>
                </div>
                <div className="req-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${req.progress}%` }} />
                  </div>
                  <span className="progress-text">{req.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="card">
          <h3 className="card-title"><Activity size={18} /> Recent Activity</h3>
          <div className="activity-list">
            {activities.map((act) => (
              <div key={act.id} className="activity-item">
                <span className="activity-avatar">{act.avatar}</span>
                <div className="activity-info">
                  <p><strong>{act.user}</strong> {act.action} <span className="activity-target">{act.target}</span></p>
                  <span className="activity-time">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
