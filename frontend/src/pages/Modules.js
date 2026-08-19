import { useState } from 'react';
import toast from 'react-hot-toast';
import { Search, Sparkles, Zap, Star, Download, ArrowRight } from 'lucide-react';
import './Modules.css';

// JKFlow Signature Apps
const APPS = [
  { name: 'CRM', color: '#6366f1', icon: '🤝', desc: 'Customer Relationship', features: 4, category: 'Sales' },
  { name: 'Sales', color: '#10b981', icon: '💎', desc: 'Sales Pipeline & Orders', features: 6, category: 'Sales' },
  { name: 'Accounting', color: '#8b5cf6', icon: '⚡', desc: 'Financial Management', features: 5, category: 'Finance' },
  { name: 'Inventory', color: '#f59e0b', icon: '🎯', desc: 'Smart Stock Management', features: 4, category: 'Operations' },
  { name: 'HR', color: '#ef4444', icon: '🌟', desc: 'People & Culture', features: 5, category: 'HR' },
  { name: 'Marketing', color: '#06b6d4', icon: '🔥', desc: 'Campaign Automation', features: 4, category: 'Marketing' },
  { name: 'Website', color: '#ec4899', icon: '🌍', desc: 'Website Builder', features: 3, category: 'Website' },
  { name: 'Project', color: '#14b8a6', icon: '🚀', desc: 'Project Management', features: 6, category: 'Operations' },
  { name: 'Documents', color: '#a855f7', icon: '📑', desc: 'Document Hub', features: 4, category: 'Productivity' },
  { name: 'eCommerce', color: '#f97316', icon: '🛍️', desc: 'Online Store', features: 5, category: 'Website' },
  { name: 'Helpdesk', color: '#22c55e', icon: '💬', desc: 'Support System', features: 4, category: 'Services' },
  { name: 'POS', color: '#3b82f6', icon: '🏬', desc: 'Point of Sale', features: 3, category: 'Sales' },
];

const COMPANIES = [
  { id: 'all', name: 'All', color: '#6366f1' },
  { id: 'jk-lifestyle', name: 'JK Lifestyle', color: '#6366f1' },
  { id: 'jk-tech', name: 'JK Tech', color: '#8b5cf6' },
  { id: 'health-rev', name: 'Health Revolution', color: '#10b981' },
  { id: 'organic-life', name: 'Organic Life', color: '#f59e0b' },
  { id: 'food-arena', name: 'Food Arena', color: '#ef4444' },
  { id: 'fitness-arena', name: 'Fitness Arena', color: '#ec4899' },
];

const INSTALLED_DATA = [
  { company: 'jk-lifestyle', app: 'CRM', progress: 78 },
  { company: 'jk-lifestyle', app: 'Sales', progress: 62 },
  { company: 'jk-lifestyle', app: 'Website', progress: 91 },
  { company: 'jk-tech', app: 'Project', progress: 55 },
  { company: 'jk-tech', app: 'Helpdesk', progress: 84 },
  { company: 'jk-tech', app: 'Documents', progress: 73 },
  { company: 'health-rev', app: 'Accounting', progress: 95 },
  { company: 'health-rev', app: 'HR', progress: 67 },
  { company: 'organic-life', app: 'Inventory', progress: 44 },
  { company: 'organic-life', app: 'eCommerce', progress: 52 },
  { company: 'food-arena', app: 'POS', progress: 61 },
  { company: 'food-arena', app: 'Marketing', progress: 38 },
  { company: 'fitness-arena', app: 'Marketing', progress: 57 },
  { company: 'fitness-arena', app: 'CRM', progress: 81 },
];

export default function Modules() {
  const [activeCompany, setActiveCompany] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState('');
  const [installed, setInstalled] = useState(INSTALLED_DATA);

  const companyApps = activeCompany === 'all' 
    ? installed 
    : installed.filter(i => i.company === activeCompany);

  const installedNames = companyApps.map(i => i.app);

  const availableApps = APPS.filter(app => {
    if (installedNames.includes(app.name)) return false;
    if (search && !app.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleInstall = (appName) => {
    setInstalled(prev => [...prev, {
      company: activeCompany === 'all' ? 'jk-lifestyle' : activeCompany,
      app: appName,
      progress: 0
    }]);
    toast.success(`${appName} installed! 🚀`);
  };

  return (
    <div className="jk-modules">
      {/* Animated Background */}
      <div className="jk-bg-glow">
        <div className="glow-orb glow-1" />
        <div className="glow-orb glow-2" />
        <div className="glow-orb glow-3" />
      </div>

      <div className="jk-content">
        {/* Header with Sparkle */}
        <div className="jk-header">
          <div className="jk-title-group">
            <h1 className="jk-title">
              <Sparkles size={28} className="jk-sparkle" />
              App Universe
            </h1>
            <p className="jk-subtitle">Power your business with smart apps</p>
          </div>
          <div className="jk-search-wrap">
            <Search size={16} className="jk-search-icon" />
            <input 
              placeholder="Find your perfect app..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Company Selector */}
        <div className="jk-company-row">
          {COMPANIES.map((c) => (
            <button
              key={c.id}
              className={`jk-company-btn ${activeCompany === c.id ? 'active' : ''}`}
              onClick={() => setActiveCompany(c.id)}
              style={{
                '--company-color': c.color,
                background: activeCompany === c.id ? c.color : undefined,
                borderColor: activeCompany === c.id ? c.color : undefined,
              }}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Installed Apps */}
        {companyApps.length > 0 && (
          <div className="jk-section">
            <div className="jk-section-header">
              <h2>
                <Zap size={20} className="jk-section-icon" />
                Active Apps
              </h2>
              <span className="jk-section-count">{companyApps.length}</span>
            </div>

            <div className="jk-app-grid">
              {companyApps.map((item) => {
                const app = APPS.find(a => a.name === item.app);
                if (!app) return null;
                const isOpen = expanded === item.app;

                return (
                  <div 
                    key={`${item.company}-${item.app}`} 
                    className={`jk-app-card ${isOpen ? 'expanded' : ''}`}
                    style={{ '--accent': app.color }}
                    onClick={() => setExpanded(isOpen ? null : item.app)}
                  >
                    {/* Glow on hover */}
                    <div className="jk-card-glow" style={{ background: app.color }} />

                    <div className="jk-card-main">
                      {/* Icon */}
                      <div className="jk-app-icon-wrap">
                        <div className="jk-app-icon-bg" style={{ background: app.color }} />
                        <span className="jk-app-emoji">{app.icon}</span>
                      </div>

                      {/* Info */}
                      <div className="jk-app-info">
                        <h3 className="jk-app-name">{app.name}</h3>
                        <p className="jk-app-desc">{app.desc}</p>
                      </div>

                      {/* Progress Ring */}
                      <div className="jk-progress-ring" style={{ '--progress': item.progress }}>
                        <svg viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="14" fill="none" stroke="#e9ecef" strokeWidth="3" />
                          <circle 
                            cx="18" cy="18" r="14" fill="none" 
                            stroke={app.color} strokeWidth="3"
                            strokeDasharray={`${item.progress * 0.88} 88`}
                            strokeLinecap="round"
                            transform="rotate(-90 18 18)"
                          />
                        </svg>
                        <span className="jk-ring-text">{item.progress}%</span>
                      </div>

                      {/* Arrow */}
                      <ArrowRight size={16} className={`jk-card-arrow ${isOpen ? 'open' : ''}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Available Apps */}
        <div className="jk-section">
          <div className="jk-section-header">
            <h2>
              <Star size={20} className="jk-section-icon" />
              Discover More
            </h2>
            <span className="jk-section-count">{availableApps.length}</span>
          </div>

          <div className="jk-app-grid">
            {availableApps.map((app) => (
              <div key={app.name} className="jk-app-card jk-available" style={{ '--accent': app.color }}>
                <div className="jk-card-glow" style={{ background: app.color }} />
                <div className="jk-card-main">
                  <div className="jk-app-icon-wrap">
                    <div className="jk-app-icon-bg" style={{ background: app.color, opacity: 0.8 }} />
                    <span className="jk-app-emoji">{app.icon}</span>
                  </div>
                  <div className="jk-app-info">
                    <h3 className="jk-app-name">{app.name}</h3>
                    <p className="jk-app-desc">{app.desc}</p>
                  </div>
                  <button 
                    className="jk-install-btn"
                    style={{ background: app.color }}
                    onClick={() => handleInstall(app.name)}
                  >
                    <Download size={14} /> Install
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
