import { useState, useMemo } from 'react';
import { Search, Filter, AlertCircle, Edit2, ChevronRight, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import useStore from '../store/useStore';

export default function Requirements() {
  const { darkMode } = useTheme();
  const { requirements, updateRequirement, addRequirement } = useStore();
  const [search, setSearch] = useState('');
  const [filterCompany, setFilterCompany] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const companies = [...new Set(requirements.map(r => r.company))];
  const statuses = [...new Set(requirements.map(r => r.status))];
  const priorities = [...new Set(requirements.map(r => r.priority))];

  const t = darkMode ? {
    card: 'rgba(10, 14, 23, 0.9)', border: 'rgba(255,255,255,0.06)', text: '#e4e4e7', text2: '#a1a1aa', text3: '#52525b',
    accent: '#06b6d4', accentBg: 'rgba(6,182,212,0.08)', shadow: '0 0 40px rgba(6,182,212,0.05)', mutedBg: 'rgba(255,255,255,0.03)',
  } : {
    card: 'rgba(255,255,255,0.95)', border: 'rgba(0,0,0,0.06)', text: '#18181b', text2: '#71717a', text3: '#a1a1aa',
    accent: '#0891b2', accentBg: 'rgba(8,145,178,0.06)', shadow: '0 1px 3px rgba(0,0,0,0.04)', mutedBg: 'rgba(0,0,0,0.02)',
  };

  const filtered = useMemo(() => {
    return requirements.filter(r => {
      if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterCompany && r.company !== filterCompany) return false;
      if (filterStatus && r.status !== filterStatus) return false;
      if (filterPriority && r.priority !== filterPriority) return false;
      return true;
    });
  }, [requirements, search, filterCompany, filterStatus, filterPriority]);

  const startEdit = (id, currentProgress) => {
    setEditingId(id);
    setEditValue(String(currentProgress));
  };

  const saveProgress = (id) => {
    const newVal = Math.min(100, Math.max(0, Number(editValue) || 0));
    updateRequirement(id, { progress: newVal });
    setEditingId(null);
  };

  const updateStatus = (id, newStatus) => {
    updateRequirement(id, { status: newStatus });
  };

  const addNew = () => {
    addRequirement({
      title: 'New Requirement',
      company: 'JK Tech Ltd',
      priority: 'Medium',
      status: 'Development',
      progress: 0,
      module: 'Accounting',
      subModule: 'General'
    });
  };

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Requirements</h1>
        <p style={{ color: t.text2, fontSize: 13 }}>Manage and track Odoo customization requests</p>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: t.text3 }} />
          <input type="text" placeholder="Search requirements..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '9px 12px 9px 36px', background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text, fontSize: 13, outline: 'none' }} />
        </div>

        <select value={filterCompany} onChange={e => setFilterCompany(e.target.value)}
          style={{ padding: '9px 12px', background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text, fontSize: 13 }}>
          <option value="">All Companies</option>
          {companies.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          style={{ padding: '9px 12px', background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text, fontSize: 13 }}>
          <option value="">All Status</option>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
          style={{ padding: '9px 12px', background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text, fontSize: 13 }}>
          <option value="">All Priority</option>
          {priorities.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        <button onClick={addNew} style={{
          padding: '9px 16px', background: t.accentBg, color: t.accent,
          border: `1px solid ${t.border}`, borderRadius: 8, fontSize: 13,
          display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
        }}>
          <Plus size={14} /> New
        </button>
      </div>

      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, overflowX: 'auto', boxShadow: t.shadow }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${t.border}` }}>
              <th style={{ textAlign: 'left', padding: '12px 16px', color: t.text2, fontWeight: 500, fontSize: 11, textTransform: 'uppercase' }}>Requirement</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', color: t.text2, fontWeight: 500, fontSize: 11, textTransform: 'uppercase' }}>Company</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', color: t.text2, fontWeight: 500, fontSize: 11, textTransform: 'uppercase' }}>Priority</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', color: t.text2, fontWeight: 500, fontSize: 11, textTransform: 'uppercase' }}>Status</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', color: t.text2, fontWeight: 500, fontSize: 11, textTransform: 'uppercase' }}>Progress</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', color: t.text2, fontWeight: 500, fontSize: 11, textTransform: 'uppercase' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(req => (
              <motion.tr key={req.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'}` }}>
                <td style={{ padding: '12px 16px', fontWeight: 500 }}>{req.title}</td>
                <td style={{ padding: '12px 16px', color: t.text2 }}>{req.company}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: req.priority === 'Critical' ? '#ef4444' : req.priority === 'High' ? '#f59e0b' : req.priority === 'Medium' ? '#3b82f6' : '#10b981' }}>
                    <AlertCircle size={12} /> {req.priority}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <select value={req.status} onChange={e => updateStatus(req.id, e.target.value)}
                    style={{ padding: '4px 8px', borderRadius: 6, background: t.mutedBg, border: `1px solid ${t.border}`, color: t.text, fontSize: 12 }}>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {editingId === req.id ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input type="number" value={editValue} onChange={e => setEditValue(e.target.value)}
                        onBlur={() => saveProgress(req.id)} onKeyDown={e => { if (e.key === 'Enter') saveProgress(req.id); }}
                        style={{ width: 50, padding: '4px', borderRadius: 4, background: t.mutedBg, border: `1px solid ${t.border}`, color: t.text, fontSize: 12, textAlign: 'center' }} autoFocus />
                      <span style={{ fontSize: 12, color: t.text2 }}>%</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 5, background: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${req.progress}%`, background: req.progress === 100 ? '#10b981' : req.progress > 50 ? '#06b6d4' : '#f59e0b', borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 12, color: t.text2, minWidth: 30 }}>{req.progress}%</span>
                      <button onClick={() => startEdit(req.id, req.progress)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.text2, padding: 2 }}><Edit2 size={13} /></button>
                    </div>
                  )}
                </td>
                <td style={{ padding: '12px 16px' }}><ChevronRight size={16} color={t.text3} style={{ cursor: 'pointer' }} /></td>
              </motion.tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: t.text3 }}>No requirements match the current filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
