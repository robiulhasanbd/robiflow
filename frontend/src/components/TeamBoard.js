import { motion } from 'framer-motion';
import { Trophy, Bug, Brain } from 'lucide-react';
import { getTeamWorkload } from '../utils/storeHelpers';

export default function TeamBoard({ team, requirements, darkMode, t }) {
  const workload = getTeamWorkload(requirements, team);
  const aziz = team.find(m => m.name === 'Aziz');
  const devCount = team.filter(m => m.role === 'Developer').length;
  const bugCount = devCount * 100;

  return (
    <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: 20, boxShadow: t.shadow }}>
      <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, color: t.text2, display: 'flex', alignItems: 'center', gap: 6 }}>
        <Trophy size={15} color="#f59e0b" /> Team Board
      </h4>

      <div style={{
        background: darkMode ? 'rgba(239,68,68,0.08)' : 'rgba(239,68,68,0.06)',
        border: '1px dashed rgba(239,68,68,0.3)', borderRadius: 10,
        padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <Bug size={18} color="#ef4444" />
        <div>
          <div style={{ fontSize: 11, color: t.text3 }}>bugs = devs.length × 100</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#ef4444' }}>{bugCount} bugs 😆</div>
        </div>
      </div>

      {aziz && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Brain size={14} color="#ec4899" /> Aziz Understanding Meter™
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#ec4899' }}>{aziz.azizMeter}%</span>
          </div>
          <div style={{ height: 8, background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', borderRadius: 4, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${aziz.azizMeter}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{ height: '100%', background: 'linear-gradient(90deg, #ec4899, #8b5cf6)', borderRadius: 4 }}
            />
          </div>
          <div style={{ fontSize: 10, color: t.text3, marginTop: 4 }}>if (aziz.understands()) miracle(); 😂</div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {workload.map(dev => (
          <div key={dev.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20, width: 28, textAlign: 'center' }}>{dev.avatar}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: 12, fontWeight: 500 }}>{dev.name}</span>
                <span style={{ fontSize: 10, color: t.text3 }}>
                  🔥 {dev.streak} streak · {dev.activeCount} active
                </span>
              </div>
              <div style={{ height: 4, background: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${dev.load}%`, background: dev.color, borderRadius: 2 }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
