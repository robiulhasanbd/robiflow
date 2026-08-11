import { Activity, Rocket, RefreshCw, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const TYPE_ICONS = {
  deploy: Rocket,
  uat: Activity,
  sync: RefreshCw,
  create: Plus,
};

const TYPE_COLORS = {
  deploy: '#10b981',
  uat: '#f59e0b',
  sync: '#6366f1',
  create: '#06b6d4',
};

function timeAgo(ts) {
  const diff = Date.now() - ts;
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

export default function ActivityFeed({ feed, darkMode, t }) {
  return (
    <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: 20, boxShadow: t.shadow }}>
      <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, color: t.text2, display: 'flex', alignItems: 'center', gap: 6 }}>
        <Activity size={15} color={t.accent} /> Odoo Pulse
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {feed.slice(0, 6).map((item, i) => {
          const Icon = TYPE_ICONS[item.type] || Activity;
          const color = TYPE_COLORS[item.type] || t.accent;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                display: 'flex', gap: 12, padding: '10px 0',
                borderBottom: i < feed.length - 1 ? `1px solid ${t.border}` : 'none',
                position: 'relative',
              }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: '50%', background: `${color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon size={13} color={color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, lineHeight: 1.4 }}>{item.message}</div>
                <div style={{ fontSize: 10, color: t.text3, marginTop: 2 }}>{timeAgo(item.time)}</div>
              </div>
              {i === 0 && (
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  style={{
                    width: 8, height: 8, borderRadius: '50%', background: color,
                    position: 'absolute', left: 10, top: 14,
                  }}
                />
              )}
            </motion.div>
          );
        })}
        {!feed.length && (
          <div style={{ fontSize: 12, color: t.text3, padding: 12, textAlign: 'center' }}>No activity yet</div>
        )}
      </div>
    </div>
  );
}
