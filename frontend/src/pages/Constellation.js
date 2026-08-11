import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import useStore from '../store/useStore';
import { COMPANY_META } from '../utils/storeHelpers';
import { Sparkles } from 'lucide-react';

export default function Constellation() {
  const { darkMode } = useTheme();
  const { companies, glowingSubModules } = useStore();
  const [selectedCompany, setSelectedCompany] = useState('JK Tech Ltd');
  const [expandedModule, setExpandedModule] = useState(null);

  const t = darkMode ? {
    bg: '#06080d', card: 'rgba(10, 14, 23, 0.9)', border: 'rgba(255,255,255,0.06)',
    text: '#e4e4e7', text2: '#a1a1aa', text3: '#52525b', accent: '#06b6d4',
  } : {
    bg: '#fafbfc', card: 'rgba(255,255,255,0.95)', border: 'rgba(0,0,0,0.06)',
    text: '#18181b', text2: '#71717a', text3: '#a1a1aa', accent: '#0891b2',
  };

  const companyNames = Object.keys(companies);
  const modules = companies[selectedCompany] || [];
  const meta = COMPANY_META[selectedCompany] || { color: '#6366f1' };

  const isGlowing = (modName, subName) =>
    glowingSubModules.some(g =>
      g.company === selectedCompany && g.module === modName && g.subModule === subName && g.until > Date.now()
    );

  const cx = 400;
  const cy = 320;
  const moduleRadius = 180;

  return (
    <main style={{
      minHeight: 'calc(100vh - 60px)', background: t.bg, color: t.text,
      fontFamily: "'Inter', sans-serif", padding: '24px', overflow: 'hidden',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={22} color={t.accent} /> Module Constellation
          </h1>
          <p style={{ color: t.text2, fontSize: 13 }}>Galaxy view of Odoo customizations — click planets to explore moons</p>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {companyNames.map(name => {
            const c = COMPANY_META[name]?.color || '#6366f1';
            return (
              <button
                key={name}
                onClick={() => { setSelectedCompany(name); setExpandedModule(null); }}
                style={{
                  padding: '6px 14px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
                  background: selectedCompany === name ? `${c}20` : t.card,
                  border: `1.5px solid ${selectedCompany === name ? c : t.border}`,
                  color: selectedCompany === name ? c : t.text2,
                }}
              >
                {COMPANY_META[name]?.short || name}
              </button>
            );
          })}
        </div>

        <div style={{
          background: t.card, border: `1px solid ${t.border}`, borderRadius: 20,
          position: 'relative', height: 640, overflow: 'hidden',
          boxShadow: darkMode ? 'inset 0 0 80px rgba(99,102,241,0.05)' : 'none',
        }}>
          {/* Stars */}
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${(i * 17 + 3) % 100}%`,
              top: `${(i * 23 + 7) % 100}%`,
              width: i % 3 === 0 ? 2 : 1,
              height: i % 3 === 0 ? 2 : 1,
              borderRadius: '50%',
              background: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.15)',
              opacity: 0.3 + (i % 5) * 0.1,
            }} />
          ))}

          <svg width="100%" height="100%" viewBox="0 0 800 640" style={{ position: 'absolute', inset: 0 }}>
            {/* Orbit rings */}
            <circle cx={cx} cy={cy} r={moduleRadius} fill="none" stroke={t.border} strokeWidth="1" strokeDasharray="4 6" opacity="0.5" />
            {expandedModule !== null && (
              <circle cx={cx} cy={cy} r={moduleRadius * 0.55} fill="none" stroke={meta.color} strokeWidth="1" strokeDasharray="2 4" opacity="0.4" />
            )}

            {/* Sun — company center */}
            <motion.circle
              cx={cx} cy={cy} r={36}
              fill={meta.color}
              animate={{ opacity: [0.85, 1, 0.85] }}
              transition={{ repeat: Infinity, duration: 3 }}
              style={{ filter: `drop-shadow(0 0 20px ${meta.color})` }}
            />
            <text x={cx} y={cy + 4} textAnchor="middle" fill="white" fontSize="10" fontWeight="600">
              {COMPANY_META[selectedCompany]?.short?.slice(0, 8) || 'Co'}
            </text>

            {/* Planets — modules */}
            {modules.map((mod, i) => {
              const angle = (i / modules.length) * Math.PI * 2 - Math.PI / 2;
              const px = cx + Math.cos(angle) * moduleRadius;
              const py = cy + Math.sin(angle) * moduleRadius;
              const done = mod.children.filter(c => c.status === 'done').length;
              const total = mod.children.length;
              const pct = total ? done / total : 0;
              const planetR = 14 + pct * 8;
              const isExpanded = expandedModule === mod.name;

              return (
                <g key={mod.name}>
                  <line x1={cx} y1={cy} x2={px} y2={py} stroke={mod.color} strokeWidth="1" opacity="0.2" />
                  <motion.circle
                    cx={px} cy={py} r={planetR}
                    fill={mod.color}
                    opacity={0.7 + pct * 0.3}
                    style={{ cursor: 'pointer', filter: isExpanded ? `drop-shadow(0 0 12px ${mod.color})` : 'none' }}
                    whileHover={{ scale: 1.15 }}
                    onClick={() => setExpandedModule(isExpanded ? null : mod.name)}
                  />
                  <text x={px} y={py + planetR + 14} textAnchor="middle" fill={t.text2} fontSize="9" fontWeight="500">
                    {mod.name}
                  </text>

                  {/* Moons — sub-modules when expanded */}
                  <AnimatePresence>
                    {isExpanded && mod.children.map((sub, si) => {
                      const moonAngle = angle + ((si - (mod.children.length - 1) / 2) * 0.35);
                      const mx = cx + Math.cos(moonAngle) * moduleRadius * 0.55;
                      const my = cy + Math.sin(moonAngle) * moduleRadius * 0.55;
                      const glow = isGlowing(mod.name, sub.name);
                      const moonColor = sub.status === 'done' ? '#10b981' : '#f59e0b';
                      return (
                        <motion.g key={sub.name} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}>
                          <line x1={px} y1={py} x2={mx} y2={my} stroke={moonColor} strokeWidth="0.5" opacity="0.4" />
                          <circle
                            cx={mx} cy={my} r={glow ? 8 : 5}
                            fill={moonColor}
                            opacity={sub.status === 'done' ? 1 : 0.7}
                            style={{ filter: glow ? `drop-shadow(0 0 8px ${moonColor})` : 'none' }}
                          />
                          <text x={mx} y={my + 16} textAnchor="middle" fill={t.text3} fontSize="7">{sub.name}</text>
                        </motion.g>
                      );
                    })}
                  </AnimatePresence>
                </g>
              );
            })}
          </svg>

          <div style={{
            position: 'absolute', bottom: 16, left: 16, right: 16,
            display: 'flex', gap: 16, fontSize: 11, color: t.text3,
          }}>
            <span>🟢 Done moon</span>
            <span>🟡 Pending moon</span>
            <span>✨ Glowing = recent UAT/Deploy</span>
          </div>
        </div>
      </div>
    </main>
  );
}
