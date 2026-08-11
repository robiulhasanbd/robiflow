import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const defaultModules = [
  { name: 'CRM', icon: 'CRM', color: '#f97316', children: [
    { name: 'Leads', status: 'done' }, { name: 'Opportunities', status: 'done' }, { name: 'Activities', status: 'pending' },
  ]},
  { name: 'Sales', icon: 'Sales', color: '#3b82f6', children: [
    { name: 'Quotations', status: 'done' }, { name: 'Orders', status: 'pending' }, { name: 'Products', status: 'done' },
  ]},
  { name: 'Accounting', icon: 'Accounting', color: '#6366f1', children: [
    { name: 'Invoicing', status: 'done' }, { name: 'Payments', status: 'done' }, { name: 'Tax Management', status: 'pending' },
  ]},
  { name: 'Inventory', icon: 'Inventory', color: '#10b981', children: [
    { name: 'Products', status: 'done' }, { name: 'Warehouse', status: 'pending' }, { name: 'Barcode', status: 'done' },
  ]},
  { name: 'HR', icon: 'HR', color: '#8b5cf6', children: [
    { name: 'Employees', status: 'done' }, { name: 'Leave', status: 'done' }, { name: 'Payroll', status: 'pending' },
  ]},
  { name: 'Purchase', icon: 'Purchase', color: '#ec4899', children: [
    { name: 'Vendors', status: 'done' }, { name: 'RFQs', status: 'pending' }, { name: 'Orders', status: 'done' },
  ]},
  { name: 'Manufacturing', icon: 'Manufacturing', color: '#06b6d4', children: [
    { name: 'BOM', status: 'done' }, { name: 'Work Orders', status: 'pending' }, { name: 'Quality', status: 'done' },
  ]},
  { name: 'Project', icon: 'Project', color: '#14b8a6', children: [
    { name: 'Tasks', status: 'done' }, { name: 'Timesheets', status: 'pending' },
  ]},
];

const initialCompanies = Object.fromEntries(
  ['JK Lifestyle Ltd', 'Health Revolution Ltd', 'Ultimate Organic Life Ltd', 'JK Tech Ltd', 'JK Food Arena Ltd', 'JK Fitness Arena Ltd']
    .map(c => [c, JSON.parse(JSON.stringify(defaultModules))])
);

const initialRequirements = [
  { id: 1, title: 'VAT Customization', company: 'JK Tech Ltd', module: 'Accounting', subModule: 'Tax Management', status: 'Development', progress: 65, priority: 'Critical', assignee: 'Karim' },
  { id: 2, title: 'Leave Management', company: 'Health Revolution Ltd', module: 'HR', subModule: 'Leave', status: 'Testing', progress: 85, priority: 'Medium', assignee: 'Nabila' },
  { id: 3, title: 'Invoice Template', company: 'JK Lifestyle Ltd', module: 'Accounting', subModule: 'Invoicing', status: 'UAT', progress: 40, priority: 'High', assignee: 'Tanvir' },
  { id: 4, title: 'Barcode Scanner', company: 'JK Food Arena Ltd', module: 'Inventory', subModule: 'Barcode', status: 'Development', progress: 25, priority: 'High', assignee: 'Alamin' },
  { id: 5, title: 'Payroll Report', company: 'JK Tech Ltd', module: 'HR', subModule: 'Payroll', status: 'Deployed', progress: 100, priority: 'Medium', assignee: 'Karim' },
  { id: 6, title: 'Inventory Sync', company: 'Ultimate Organic Life Ltd', module: 'Inventory', subModule: 'Products', status: 'Development', progress: 50, priority: 'Medium', assignee: 'Nabila' },
];

const useStore = create(
  persist(
    (set, get) => ({
      companies: initialCompanies,
      requirements: initialRequirements,
      team: [
        { name: 'Karim', role: 'Developer', color: '#06b6d4', avatar: '🧑‍💻', streak: 3, companies: ['JK Tech Ltd'] },
        { name: 'Nabila', role: 'Developer', color: '#8b5cf6', avatar: '👩‍💻', streak: 5, companies: ['JK Lifestyle Ltd'] },
        { name: 'Tanvir', role: 'Developer', color: '#f59e0b', avatar: '🧑‍💻', streak: 2, companies: ['Health Revolution Ltd'] },
        { name: 'Alamin', role: 'Developer', color: '#10b981', avatar: '🧑‍💻', streak: 4, companies: ['JK Food Arena Ltd'] },
        { name: 'Robiul Hasan', role: 'IT Admin', color: '#6366f1', avatar: '👑', streak: 99, companies: ['JK Lifestyle Ltd', 'JK Tech Ltd'] },
        { name: 'Salim', role: 'Sr Executive', color: '#ef4444', avatar: '🏥', streak: 0, companies: ['Health Revolution Ltd'] },
        { name: 'Aziz', role: 'Junior (Future Senior 😎)', color: '#ec4899', avatar: '😎', streak: 1, companies: ['Health Revolution Ltd'], azizMeter: 42 },
      ],
      activityFeed: [
        { id: 1, type: 'deploy', message: 'Payroll Report deployed at JK Tech Ltd', time: Date.now() - 86400000 },
        { id: 2, type: 'sync', message: 'Module tree synced for JK Lifestyle Ltd', time: Date.now() - 172800000 },
      ],
      notifications: [],
      glowingSubModules: [],
      celebration: null,
      robiOpen: false,
      robiPrefill: '',
      lastUndo: null,
      briefingShown: false,

      addModule: (company, newModule) => set(state => ({
        companies: { ...state.companies, [company]: [...state.companies[company], newModule] },
      })),
      updateModule: (company, moduleIndex, payload) => set(state => {
        const modules = [...state.companies[company]];
        modules[moduleIndex] = { ...modules[moduleIndex], ...payload };
        return { companies: { ...state.companies, [company]: modules } };
      }),
      deleteModule: (company, moduleIndex) => set(state => ({
        companies: { ...state.companies, [company]: state.companies[company].filter((_, i) => i !== moduleIndex) },
      })),
      addSubModule: (company, moduleIndex, subModule) => set(state => {
        const modules = [...state.companies[company]];
        modules[moduleIndex] = { ...modules[moduleIndex], children: [...modules[moduleIndex].children, subModule] };
        return { companies: { ...state.companies, [company]: modules } };
      }),
      updateSubModule: (company, moduleIndex, subIndex, payload) => set(state => {
        const modules = [...state.companies[company]];
        const children = [...modules[moduleIndex].children];
        children[subIndex] = { ...children[subIndex], ...payload };
        modules[moduleIndex] = { ...modules[moduleIndex], children };
        return { companies: { ...state.companies, [company]: modules } };
      }),
      deleteSubModule: (company, moduleIndex, subIndex) => set(state => {
        const modules = [...state.companies[company]];
        modules[moduleIndex] = {
          ...modules[moduleIndex],
          children: modules[moduleIndex].children.filter((_, i) => i !== subIndex),
        };
        return { companies: { ...state.companies, [company]: modules } };
      }),

      addRequirement: (req) => {
        const id = Date.now();
        const newReq = { id, assignee: 'Karim', priority: 'Medium', ...req };
        set(state => ({
          requirements: [...state.requirements, newReq],
          activityFeed: [
            { id: Date.now(), type: 'create', message: `New requirement: ${newReq.title}`, time: Date.now() },
            ...state.activityFeed,
          ].slice(0, 50),
          lastUndo: { type: 'requirement', id },
        }));
        get().syncWithAI(newReq.company);
        return newReq;
      },

      removeRequirement: (id) => set(state => ({
        requirements: state.requirements.filter(r => r.id !== id),
        lastUndo: null,
      })),

      updateRequirement: (id, payload) => {
        const state = get();
        const prev = state.requirements.find(r => r.id === id);
        if (!prev) return;

        const updates = { ...payload };
        if (payload.status === 'Deployed' && prev.progress < 100) updates.progress = 100;
        if (payload.progress === 100 && !payload.status) updates.status = 'Deployed';

        let celebration = null;
        let glowingSubModules = [...state.glowingSubModules];
        const feedEntry = { id: Date.now(), time: Date.now() };

        if (payload.status === 'UAT' && prev.status !== 'UAT') {
          celebration = { type: 'uat', title: prev.title, company: prev.company };
          feedEntry.type = 'uat';
          feedEntry.message = `${prev.title} entered UAT at ${prev.company}`;
          glowingSubModules.push({
            company: prev.company, module: prev.module, subModule: prev.subModule,
            until: Date.now() + 15000, kind: 'uat',
          });
        }
        if ((payload.status === 'Deployed' || updates.status === 'Deployed') && prev.status !== 'Deployed') {
          celebration = { type: 'deploy', title: prev.title, company: prev.company };
          feedEntry.type = 'deploy';
          feedEntry.message = `🚀 ${prev.title} deployed at ${prev.company}!`;
          glowingSubModules.push({
            company: prev.company, module: prev.module, subModule: prev.subModule,
            until: Date.now() + 20000, kind: 'deploy',
          });
        }

        set({
          requirements: state.requirements.map(r => r.id === id ? { ...r, ...updates } : r),
          celebration,
          glowingSubModules,
          activityFeed: feedEntry.message
            ? [feedEntry, ...state.activityFeed].slice(0, 50)
            : state.activityFeed,
          notifications: celebration
            ? [{ id: Date.now(), text: feedEntry.message, read: false }, ...state.notifications].slice(0, 20)
            : state.notifications,
        });

        if (updates.status === 'Deployed' || updates.progress === 100) {
          get().syncWithAI(prev.company);
        }
      },

      clearCelebration: () => set({ celebration: null }),

      syncWithAI: (company) => {
        const state = get();
        const requirements = state.requirements.filter(r => r.company === company);
        const modules = [...state.companies[company]];
        let created = 0;
        let updated = 0;

        requirements.forEach(req => {
          let moduleIndex = modules.findIndex(m => m.name.toLowerCase() === req.module?.toLowerCase());
          if (moduleIndex === -1) {
            modules.push({ name: req.module, icon: req.module, color: '#6366f1', children: [] });
            moduleIndex = modules.length - 1;
            created += 1;
          }
          const mod = modules[moduleIndex];
          let subIndex = mod.children.findIndex(s => s.name.toLowerCase() === req.subModule?.toLowerCase());
          if (subIndex === -1) {
            mod.children.push({
              name: req.subModule,
              status: req.status === 'Deployed' || req.progress === 100 ? 'done' : 'pending',
            });
            created += 1;
          } else {
            const newStatus = req.progress === 100 || req.status === 'Deployed' ? 'done' : 'pending';
            if (mod.children[subIndex].status !== newStatus) updated += 1;
            mod.children[subIndex].status = newStatus;
          }
        });

        set(state => ({
          companies: { ...state.companies, [company]: modules },
          activityFeed: [
            { id: Date.now(), type: 'sync', message: `Synced ${company}: ${created} created, ${updated} updated`, time: Date.now() },
            ...state.activityFeed,
          ].slice(0, 50),
        }));
        return { created, updated };
      },

      setRobiOpen: (open, prefill = '') => set({ robiOpen: open, robiPrefill: prefill }),
      setBriefingShown: (v) => set({ briefingShown: v }),
      markNotificationsRead: () => set(state => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
      })),
      dismissGlow: (company, module, subModule) => set(state => ({
        glowingSubModules: state.glowingSubModules.filter(
          g => !(g.company === company && g.module === module && g.subModule === subModule)
        ),
      })),
    }),
    { name: 'jkflow-storage', partialize: (s) => ({
      companies: s.companies,
      requirements: s.requirements,
      activityFeed: s.activityFeed,
      team: s.team,
    }) },
  )
);

export default useStore;
