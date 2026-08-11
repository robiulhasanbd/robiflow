import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutTemplate, Activity, ShieldCheck, Rocket,
  ChevronRight, CheckCircle, Clock, Plus, GitBranch, Sparkles,
} from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useTheme } from '../contexts/ThemeContext';
import useStore from '../store/useStore';
import { getAllCompanySummaries, getOverallProgress } from '../utils/storeHelpers';
import ActivityFeed from '../components/ActivityFeed';
import TeamBoard from '../components/TeamBoard';
import CompanyDNARadar from '../components/CompanyDNARadar';
import UATCelebration from '../components/UATCelebration';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const {
    companies, requirements, team, activityFeed,
    celebration, clearCelebration, addRequirement, setRobiOpen,
  } = useStore();

  const t = darkMode ? {
    bg: '#06080d', card: 'rgba(10, 14, 23, 0.9)', border: 'rgba(255,255,255,0.06)',
    text: '#e4e4e7', text2: '#a1a1aa', text3: '#52525b', accent: '#06b6d4',
    accentBg: 'rgba(6,182,212,0.08)', shadow: '0 0 40px rgba(6,182,212,0.05)', mutedBg: 'rgba(255,255,255,0.03)',
  } : {
    bg: '#fafbfc', card: 'rgba(255,255,255,0.95)', border: 'rgba(0,0,0,0.06)',
    text: '#18181b', text2: '#71717a', text3: '#a1a1aa', accent: '#0891b2',
    accentBg: 'rgba(8,145,178,0.06)', shadow: '0 1px 3px rgba(0,0,0,0.04)', mutedBg: 'rgba(0,0,0,0.02)',
  };

  const companySummaries = useMemo(() => getAllCompanySummaries(companies, requirements), [companies, requirements]);
  const overallPercent = getOverallProgress(companies);
  const totalDone = companySummaries.reduce((s, c) => s + c.done, 0);
  const totalAll = companySummaries.reduce((s, c) => s + c.total, 0);
  const pendingReqs = requirements.filter(r => r.status !== 'Deployed').length;
  const deployedReqs = requirements.filter(r => r.status === 'Deployed').length;
  const fullyDoneCompanies = companySummaries.filter(c => c.pending === 0 && c.total > 0).length;

  const chartData = {
    labels: companySummaries.map(c => c.short),
    datasets: [{
      data: companySummaries.map(c => c.total || 1),
      backgroundColor: companySummaries.map(c => c.color + '30'),
      borderColor: companySummaries.map(c => c.color),
      borderWidth: 2, hoverBorderWidth: 3, borderRadius: 6, spacing: 4,
    }],
  };

  const chartOptions = {
    responsive: true, maintainAspectRatio: false, cutout: '75%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: darkMode ? '#0a0e17' : '#fff',
        borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        borderWidth: 1, padding: 12, cornerRadius: 8,
        titleFont: { size: 12, weight: '600' }, bodyFont: { size: 11 },
        titleColor: darkMode ? '#e4e4e7' : '#18181b',
        bodyColor: darkMode ? '#a1a1aa' : '#71717a',
      },
    },
  };

  const centerTextPlugin = {
    id: 'centerText',
    beforeDraw(chart) {
      const { ctx, width, height } = chart;
      ctx.restore();
      ctx.font = '700 32px Inter, sans-serif';
      ctx.fillStyle = t.text;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${overallPercent}%`, width / 2, height / 2 - 10);
      ctx.font = '500 12px Inter, sans-serif';
      ctx.fillStyle = t.text2;
      ctx.fillText('Overall', width / 2, height / 2 + 14);
      ctx.save();
    },
  };

  const selected = companySummaries.find(c => c.name === selectedCompany);
  const selectedReqs = selected ? requirements.filter(r => r.company === selected.name) : [];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px' }}>
      <UATCelebration celebration={celebration} onClose={clearCelebration} darkMode={darkMode} />

      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4, letterSpacing: '-0.3px' }}>
          {greeting}, Team! 👋
        </h1>
        <p style={{ fontSize: 13, color: t.text2 }}>Odoo customization tracker · live from Zustand</p>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
        <button onClick={() => {
          addRequirement({ title: 'New Requirement', company: 'JK Tech Ltd', module: 'Accounting', subModule: 'General', status: 'Development', progress: 0, priority: 'Medium' });
          navigate('/requirements');
        }} style={{
          padding: '8px 18px', background: t.accentBg, border: `1px solid ${t.border}`,
          borderRadius: 8, color: t.accent, fontSize: 12.5, fontWeight: 500, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <Plus size={16} /> New Requirement
        </button>
        <button onClick={() => navigate('/constellation')} style={{
          padding: '8px 18px', background: t.accentBg, border: `1px solid ${t.border}`,
          borderRadius: 8, color: t.accent, fontSize: 12.5, fontWeight: 500, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <Sparkles size={16} /> Constellation View
        </button>
        <button onClick={() => setRobiOpen(true, 'Show me the current project status')} style={{
          padding: '8px 18px', background: t.accentBg, border: `1px solid ${t.border}`,
          borderRadius: 8, color: t.accent, fontSize: 12.5, fontWeight: 500, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <GitBranch size={16} /> Ask Robi
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 14, marginBottom: 28 }}>
        {[
          { icon: <LayoutTemplate size={22} />, value: requirements.length, label: 'Requirements', color: '#06b6d4' },
          { icon: <Activity size={22} />, value: pendingReqs, label: 'Pending', color: '#f59e0b' },
          { icon: <ShieldCheck size={22} />, value: deployedReqs, label: 'Deployed', color: '#10b981' },
          { icon: <Rocket size={22} />, value: fullyDoneCompanies, label: 'Cos. Complete', color: '#8b5cf6' },
        ].map((stat, i) => (
          <div key={i} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: 22, boxShadow: t.shadow }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color, marginBottom: 12 }}>
              {stat.icon}
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: t.text2, marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 24, boxShadow: t.shadow }}>
          <div style={{ height: 300 }}>
            <Doughnut data={chartData} options={chartOptions} plugins={[centerTextPlugin]} />
          </div>
          <div style={{ textAlign: 'center', fontSize: 11, color: t.text3, marginTop: 8 }}>
            {totalDone} / {totalAll} sub-modules complete
          </div>
        </div>

        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 24, boxShadow: t.shadow }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: t.text2 }}>Companies</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {companySummaries.map(c => {
              const pct = c.total ? Math.round((c.done / c.total) * 100) : 0;
              return (
                <button key={c.name} onClick={() => setSelectedCompany(c.name)} style={{
                  width: '100%', padding: 12, background: selectedCompany === c.name ? t.accentBg : 'transparent',
                  border: `1.5px solid ${selectedCompany === c.name ? c.color : t.border}`,
                  borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: 12, color: t.text, fontSize: 13,
                }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: c.color, boxShadow: `0 0 6px ${c.color}80` }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontWeight: 500 }}>{c.short}</span>
                      <span style={{ fontWeight: 600, color: c.color }}>{pct}%</span>
                    </div>
                    <div style={{ height: 4, background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: c.color, borderRadius: 2 }} />
                    </div>
                  </div>
                  <ChevronRight size={14} color={t.text3} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 28, boxShadow: t.shadow, marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <LayoutTemplate size={18} color={selected.color} />
              {selected.name} • Requirements
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
              {selectedReqs.map(req => (
                <div key={req.id} style={{
                  background: t.mutedBg, border: `1px solid ${t.border}`, borderRadius: 10, padding: 14,
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  {req.status === 'Deployed' ? <CheckCircle size={18} color="#10b981" /> : <Clock size={18} color="#f59e0b" />}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{req.title}</div>
                    <div style={{ fontSize: 11, color: t.text2 }}>{req.assignee} · {req.module}</div>
                  </div>
                  <span style={{
                    fontSize: 11, padding: '3px 8px', borderRadius: 10,
                    background: req.status === 'Deployed' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                    color: req.status === 'Deployed' ? '#10b981' : '#f59e0b',
                  }}>{req.status}</span>
                </div>
              ))}
              {!selectedReqs.length && <div style={{ color: t.text3, fontSize: 13 }}>No requirements for this company yet.</div>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: 16, marginBottom: 24 }}>
        <ActivityFeed feed={activityFeed} darkMode={darkMode} t={t} />
        <TeamBoard team={team} requirements={requirements} darkMode={darkMode} t={t} />
        <CompanyDNARadar
          companies={companies} requirements={requirements}
          companyName={selectedCompany || 'JK Tech Ltd'} darkMode={darkMode} t={t}
        />
      </div>

      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 24, boxShadow: t.shadow }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Recent Requirements</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                {['Title', 'Company', 'Priority', 'Status', 'Progress'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: t.text2, fontWeight: 500, fontSize: 11, textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requirements.slice(0, 8).map(r => (
                <tr key={r.id} style={{ borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'}` }}>
                  <td style={{ padding: '10px 12px', fontWeight: 500 }}>{r.title}</td>
                  <td style={{ padding: '10px 12px', color: t.text2 }}>{r.company.split(' ').slice(0, 2).join(' ')}</td>
                  <td style={{ padding: '10px 12px', color: r.priority === 'Critical' ? '#ef4444' : r.priority === 'High' ? '#f59e0b' : '#3b82f6' }}>{r.priority}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ padding: '3px 8px', borderRadius: 10, fontSize: 11, background: t.accentBg, color: t.accent }}>{r.status}</span>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 5, background: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', borderRadius: 3, overflow: 'hidden', minWidth: 60 }}>
                        <div style={{ height: '100%', width: `${r.progress}%`, background: r.progress === 100 ? '#10b981' : t.accent, borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 11, color: t.text2 }}>{r.progress}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
