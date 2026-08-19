import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  Plus, Search, Filter, X, Edit2, Trash2, 
  ChevronDown, Calendar, User, CheckCircle2 
} from 'lucide-react';
import toast from 'react-hot-toast';
import './Requirements.css';

const COMPANIES = [
  'JK Lifestyle', 'JK Tech', 'Health Revolution',
  'Organic Life', 'Food Arena', 'Fitness Arena'
];

const STATUS_OPTIONS = ['backlog', 'todo', 'in_progress', 'review', 'completed', 'blocked'];
const PRIORITY_OPTIONS = ['urgent', 'high', 'medium', 'low'];

const STATUS_COLORS = {
  backlog: '#64748b',
  todo: '#4dabf7',
  in_progress: '#ffd43b',
  review: '#da77f2',
  completed: '#69db7c',
  blocked: '#ff6b6b',
};

const PRIORITY_COLORS = {
  urgent: '#ff6b6b',
  high: '#ff922b',
  medium: '#ffd43b',
  low: '#69db7c',
};

export default function Requirements() {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCompany, setFilterCompany] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  // New requirement form
  const [newReq, setNewReq] = useState({
    title: '', company: 'JK Tech', priority: 'medium', dueDate: '', assignee: ''
  });

  // Demo data
  const demoRequirements = [
    { id: '1', title: 'CRM Dashboard Redesign', company: 'JK Lifestyle', status: 'in_progress', priority: 'high', progress: 65, dueDate: '2026-08-20', assignee: 'Robiul' },
    { id: '2', title: 'AI-Powered Lead Scoring', company: 'JK Tech', status: 'review', priority: 'high', progress: 85, dueDate: '2026-08-15', assignee: 'Aminur' },
    { id: '3', title: 'Payment Gateway bKash/Nagad', company: 'Food Arena', status: 'todo', priority: 'urgent', progress: 0, dueDate: '2026-09-01', assignee: 'Aziz' },
    { id: '4', title: 'Mobile Navigation Fix', company: 'JK Lifestyle', status: 'completed', priority: 'medium', progress: 100, dueDate: '2026-07-30', assignee: 'Robiul' },
    { id: '5', title: 'API Rate Limiting', company: 'JK Tech', status: 'blocked', priority: 'low', progress: 30, dueDate: '2026-08-10', assignee: 'Zawad' },
    { id: '6', title: 'Inventory Tracking Module', company: 'Health Revolution', status: 'in_progress', priority: 'medium', progress: 45, dueDate: '2026-08-25', assignee: 'Salim' },
    { id: '7', title: 'Sales Report Dashboard', company: 'Organic Life', status: 'todo', priority: 'high', progress: 0, dueDate: '2026-09-05', assignee: 'Robiul' },
    { id: '8', title: 'Member Management System', company: 'Fitness Arena', status: 'backlog', priority: 'low', progress: 0, dueDate: '2026-10-01', assignee: 'Aziz' },
  ];

  useEffect(() => {
    loadRequirements();
  }, []);

  const loadRequirements = async () => {
    try {
      const res = await api.get('/requirements');
      setRequirements(res.data);
    } catch {
      setRequirements(demoRequirements);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!newReq.title.trim()) {
      toast.error('Title required!');
      return;
    }
    const newId = Date.now().toString();
    setRequirements(prev => [
      { id: newId, ...newReq, status: 'todo', progress: 0 },
      ...prev
    ]);
    setShowAddModal(false);
    setNewReq({ title: '', company: 'JK Tech', priority: 'medium', dueDate: '', assignee: '' });
    toast.success('Requirement added! 🎉');
  };

  const handleStatusChange = (id, newStatus) => {
    setRequirements(prev =>
      prev.map(r => r.id === id ? { ...r, status: newStatus } : r)
    );
    toast.success('Status updated');
  };

  const handleProgressChange = (id, progress) => {
    setRequirements(prev =>
      prev.map(r => r.id === id ? { ...r, progress: Math.min(100, Math.max(0, progress)) } : r)
    );
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this requirement?')) return;
    setRequirements(prev => prev.filter(r => r.id !== id));
    toast.success('Deleted!');
  };

  // Filter
  const filtered = requirements.filter(r => {
    if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterCompany && r.company !== filterCompany) return false;
    if (filterStatus && r.status !== filterStatus) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner" />
        <p>Loading requirements...</p>
      </div>
    );
  }

  return (
    <div className="req-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Requirements</h1>
          <p className="page-subtitle">{filtered.length} total requirements</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> Add Requirement
        </button>
      </div>

      {/* Search & Filters */}
      <div className="req-toolbar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search requirements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          {search && (
            <button onClick={() => setSearch('')} className="clear-btn"><X size={14} /></button>
          )}
        </div>
        <button
          className={`filter-btn ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={16} />
          Filters
          <ChevronDown size={14} className={`chevron ${showFilters ? 'rotated' : ''}`} />
        </button>
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="filter-panel">
          <div className="filter-group">
            <label>Company</label>
            <select value={filterCompany} onChange={(e) => setFilterCompany(e.target.value)}>
              <option value="">All Companies</option>
              {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label>Status</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">All Status</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
          </div>
          {(filterCompany || filterStatus) && (
            <button className="clear-filters" onClick={() => { setFilterCompany(''); setFilterStatus(''); }}>
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Requirements Table */}
      <div className="req-table-wrap">
        <table className="req-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Company</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Progress</th>
              <th>Due Date</th>
              <th>Assignee</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="empty-row">
                  <CheckCircle2 size={40} style={{color: '#64748b', marginBottom: 8}} />
                  <p>No requirements found</p>
                </td>
              </tr>
            ) : (
              filtered.map((req) => (
                <tr key={req.id} className="req-row">
                  <td className="req-title-cell">{req.title}</td>
                  <td>{req.company}</td>
                  <td>
                    <select
                      value={req.status}
                      onChange={(e) => handleStatusChange(req.id, e.target.value)}
                      className="status-select"
                      style={{ color: STATUS_COLORS[req.status], borderColor: STATUS_COLORS[req.status] + '40' }}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{s.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <span className="priority-badge" style={{ color: PRIORITY_COLORS[req.priority] }}>
                      {req.priority}
                    </span>
                  </td>
                  <td>
                    <div className="progress-cell">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${req.progress}%` }} />
                      </div>
                      <span className="progress-num">{req.progress}%</span>
                    </div>
                  </td>
                  <td className="date-cell"><Calendar size={12} /> {req.dueDate || 'N/A'}</td>
                  <td className="assignee-cell"><User size={12} /> {req.assignee || 'Unassigned'}</td>
                  <td>
                    <button className="action-btn" onClick={() => handleDelete(req.id)}>
                      <Trash2 size={16} className="delete-icon" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">New Requirement</h2>
            
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={newReq.title}
                onChange={(e) => setNewReq({ ...newReq, title: e.target.value })}
                placeholder="What needs to be done?"
                autoFocus
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Company</label>
                <select value={newReq.company} onChange={(e) => setNewReq({ ...newReq, company: e.target.value })}>
                  {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select value={newReq.priority} onChange={(e) => setNewReq({ ...newReq, priority: e.target.value })}>
                  {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={newReq.dueDate}
                  onChange={(e) => setNewReq({ ...newReq, dueDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Assignee</label>
                <select value={newReq.assignee} onChange={(e) => setNewReq({ ...newReq, assignee: e.target.value })}>
                  <option value="">Select</option>
                  <option value="Robiul">Robiul</option>
                  <option value="Aminur">Aminur</option>
                  <option value="Aziz">Aziz</option>
                  <option value="Zawad">Zawad</option>
                  <option value="Salim">Salim</option>
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleAdd}>
                <Plus size={16} /> Create Requirement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
