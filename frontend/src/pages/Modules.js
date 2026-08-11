import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import {
  Plus, Pencil, Trash2, X, Save, RefreshCw, Zap, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import { OdooIcons } from '../components/OdooIcons';

export default function Modules() {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [selectedCompany, setSelectedCompany] = useState('JK Tech Ltd');
  const [expandedModules, setExpandedModules] = useState([]);
  const [editingModule, setEditingModule] = useState(null);
  const [editingSub, setEditingSub] = useState(null);
  const [editValues, setEditValues] = useState({});

  const { companies, addModule, updateModule, deleteModule, addSubModule, updateSubModule, deleteSubModule } = useStore();

  const modules = companies[selectedCompany] || [];

  const toggleModule = (name) => {
    setExpandedModules(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  };

  const startEditModule = (index, mod) => {
    setEditingModule(index);
    setEditValues({ name: mod.name, icon: mod.icon, color: mod.color });
  };
  const saveModule = (index) => {
    updateModule(selectedCompany, index, editValues);
    setEditingModule(null);
  };
  const startEditSub = (moduleIndex, subIndex, sub) => {
    setEditingSub({ moduleIndex, subIndex });
    setEditValues({ name: sub.name, status: sub.status });
  };
  const saveSub = () => {
    if (!editingSub) return;
    updateSubModule(selectedCompany, editingSub.moduleIndex, editingSub.subIndex, editValues);
    setEditingSub(null);
  };

  const getProgress = (children) => {
    if (!children.length) return 0;
    const done = children.filter(c => c.status === 'done').length;
    return Math.round((done / children.length) * 100);
  };

  const getIcon = (iconName) => {
    const IconComponent = OdooIcons[iconName];
    return IconComponent ? <IconComponent /> : <OdooIcons.Settings />;
  };

  const t = darkMode ? {
    bg: '#0a0e17', cardBg: '#141a24', border: '#2a3140', text: '#e2e8f0', text2: '#94a3b8', text3: '#64748b',
    accent: '#818cf8', accentBg: 'rgba(129,140,248,0.1)', progressBg: '#1e293b',
  } : {
    bg: '#f9fafb', cardBg: '#ffffff', border: '#e5e7eb', text: '#1e293b', text2: '#6b7280', text3: '#9ca3af',
    accent: '#6366f1', accentBg: 'rgba(99,102,241,0.06)', progressBg: '#f3f4f6',
  };

  return (
    <main style={{ minHeight: '100vh', background: t.bg, color: t.text, fontFamily: "'Inter', sans-serif", padding: '32px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Odoo Modules</h1>
          <p style={{ color: t.text2, fontSize: 14 }}>All default Odoo apps with customization status {isAdmin && '· Admin mode'}</p>
        </div>

        {/* Company Selector */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {Object.keys(companies).map(c => (
            <button key={c} onClick={() => { setSelectedCompany(c); setExpandedModules([]); }}
              style={{
                padding: '8px 18px', borderRadius: 24, fontSize: 13, fontWeight: 500,
                cursor: 'pointer', background: selectedCompany === c ? t.accentBg : t.cardBg,
                border: `1.5px solid ${selectedCompany === c ? t.accent : t.border}`,
                color: selectedCompany === c ? t.accent : t.text2,
                transition: 'all 0.2s',
              }}>{c}</button>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          {isAdmin && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => addModule(selectedCompany, { name: 'New Module', icon: 'Settings', color: '#6366f1', children: [] })}
              style={{
                padding: '10px 20px', borderRadius: 12, background: t.accent, color: 'white', border: 'none',
                display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600,
                boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
              }}
            >
              <Plus size={18} /> Add Module
            </motion.button>
          )}
        </div>

        {/* Module Grid */}
        <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          <AnimatePresence>
            {modules.map((mod, idx) => {
              const progress = getProgress(mod.children);
              const isExpanded = expandedModules.includes(mod.name);
              return (
                <motion.div
                  key={mod.name + idx}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    layout
                    whileHover={{ y: -4, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
                    onClick={() => toggleModule(mod.name)}
                    style={{
                      background: t.cardBg,
                      border: `1px solid ${isExpanded ? mod.color + '40' : t.border}`,
                      borderRadius: 16,
                      padding: 20,
                      cursor: 'pointer',
                      boxShadow: isExpanded ? `0 0 0 1px ${mod.color}20` : 'none',
                      transition: 'box-shadow 0.2s, border 0.2s',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Admin controls */}
                    {isAdmin && !editingModule && (
                      <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => startEditModule(idx, mod)} style={{ background: 'none', border: 'none', color: t.text3, cursor: 'pointer', padding: 4 }}><Pencil size={14} /></button>
                        <button onClick={() => { if (window.confirm('Delete module?')) deleteModule(selectedCompany, idx); }} style={{ background: 'none', border: 'none', color: t.text3, cursor: 'pointer', padding: 4 }}><Trash2 size={14} /></button>
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                      {getIcon(mod.icon)}
                      {editingModule === idx ? (
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }} onClick={e => e.stopPropagation()}>
                          <input value={editValues.name} onChange={e => setEditValues({...editValues, name: e.target.value})}
                            style={{ padding: '4px 8px', borderRadius: 6, border: `1px solid ${t.border}`, background: t.bg, color: t.text, fontSize: 14, fontWeight: 600, width: 120 }} autoFocus />
                          <button onClick={() => saveModule(idx)} style={{ background: t.accent, color: 'white', border: 'none', borderRadius: 6, padding: '4px 8px', cursor: 'pointer' }}><Save size={14} /></button>
                          <button onClick={() => setEditingModule(null)} style={{ background: 'transparent', border: 'none', color: t.text3, cursor: 'pointer' }}><X size={14} /></button>
                        </div>
                      ) : (
                        <h3 style={{ fontSize: 16, fontWeight: 600 }}>{mod.name}</h3>
                      )}
                    </div>

                    <div style={{ marginBottom: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: t.text2 }}>Progress</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: mod.color }}>{progress}%</span>
                      </div>
                      <div style={{ height: 6, background: t.progressBg, borderRadius: 3, overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          style={{ height: '100%', background: mod.color, borderRadius: 3 }}
                        />
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: t.text2 }}>
                      {mod.children.filter(c => c.status === 'done').length} / {mod.children.length} completed
                    </div>

                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                      <ChevronDown size={16} color={t.text3} />
                    </motion.div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{ overflow: 'hidden', marginTop: 16, borderTop: `1px solid ${t.border}`, paddingTop: 12 }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {mod.children.map((child, childIdx) => (
                              <motion.div
                                key={child.name + childIdx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: childIdx * 0.05 }}
                                style={{
                                  background: t.cardBg,
                                  border: `1px solid ${t.border}`,
                                  borderRadius: 10,
                                  padding: '10px 14px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                }}
                              >
                                {editingSub?.moduleIndex === idx && editingSub?.subIndex === childIdx ? (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                                    <input value={editValues.name} onChange={e => setEditValues({...editValues, name: e.target.value})}
                                      style={{ flex: 1, padding: '4px', borderRadius: 4, border: `1px solid ${t.border}`, background: t.bg, color: t.text }} />
                                    <select value={editValues.status} onChange={e => setEditValues({...editValues, status: e.target.value})}
                                      style={{ padding: '4px', borderRadius: 4, border: `1px solid ${t.border}`, background: t.bg, color: t.text }}>
                                      <option value="done">Done</option>
                                      <option value="pending">Pending</option>
                                    </select>
                                    <button onClick={saveSub} style={{ background: t.accent, color: 'white', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer' }}><Save size={14} /></button>
                                    <button onClick={() => setEditingSub(null)} style={{ background: 'transparent', border: 'none', color: t.text3, cursor: 'pointer' }}><X size={14} /></button>
                                  </div>
                                ) : (
                                  <>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: child.status === 'done' ? '#10b981' : '#f59e0b' }} />
                                      <span style={{ fontSize: 14 }}>{child.name}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                      <span style={{
                                        fontSize: 12, padding: '2px 8px', borderRadius: 12,
                                        background: child.status === 'done' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                                        color: child.status === 'done' ? '#10b981' : '#f59e0b',
                                      }}>
                                        {child.status === 'done' ? 'Done' : 'Pending'}
                                      </span>
                                      {isAdmin && (
                                        <div style={{ display: 'flex', gap: 2 }}>
                                          <button onClick={() => startEditSub(idx, childIdx, child)} style={{ background: 'none', border: 'none', color: t.text3, cursor: 'pointer', padding: 2 }}><Pencil size={13} /></button>
                                          <button onClick={() => { if (window.confirm('Delete?')) deleteSubModule(selectedCompany, idx, childIdx); }} style={{ background: 'none', border: 'none', color: t.text3, cursor: 'pointer', padding: 2 }}><Trash2 size={13} /></button>
                                        </div>
                                      )}
                                    </div>
                                  </>
                                )}
                              </motion.div>
                            ))}
                            {isAdmin && (
                              <motion.button
                                whileHover={{ scale: 1.01 }}
                                onClick={() => addSubModule(selectedCompany, idx, { name: 'New Item', status: 'pending' })}
                                style={{
                                  padding: '8px 16px', borderRadius: 8,
                                  background: t.accentBg, border: `1px dashed ${t.accent}40`,
                                  color: t.accent, display: 'flex', alignItems: 'center', gap: 6,
                                  cursor: 'pointer', fontSize: 13, marginTop: 4,
                                }}
                              >
                                <Plus size={14} /> Add sub-module
                              </motion.button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {modules.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: t.text3 }}>
            No modules yet. {isAdmin && 'Click "Add Module" to start!'}
          </div>
        )}
      </div>
    </main>
  );
}
