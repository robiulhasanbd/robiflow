import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Rocket, ShieldCheck } from 'lucide-react';

export default function UATCelebration({ celebration, onClose, darkMode }) {
  if (!celebration) return null;

  const isDeploy = celebration.type === 'deploy';
  const Icon = isDeploy ? Rocket : ShieldCheck;
  const color = isDeploy ? '#10b981' : '#f59e0b';
  const label = isDeploy ? 'Deployed!' : 'UAT Gate Passed!';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(4px)',
        }}
      >
        <motion.div
          initial={{ scale: 0.5, y: 40 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 12 }}
          onClick={e => e.stopPropagation()}
          style={{
            background: darkMode ? '#141a24' : '#fff',
            border: `2px solid ${color}`,
            borderRadius: 24, padding: '40px 48px', textAlign: 'center',
            boxShadow: `0 0 60px ${color}40`, maxWidth: 400,
          }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: 16 }}
          >
            <Icon size={48} color={color} />
          </motion.div>
          <div style={{ fontSize: 22, fontWeight: 700, color, marginBottom: 8 }}>{label}</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{celebration.title}</div>
          <div style={{ fontSize: 13, color: darkMode ? '#94a3b8' : '#64748b', marginBottom: 20 }}>
            {celebration.company}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12, color: '#6366f1' }}>
            <Sparkles size={14} /> Module tree updated automatically
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
