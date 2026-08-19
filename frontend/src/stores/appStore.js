import { create } from 'zustand';

export const useAppStore = create((set) => ({
  // UI State
  sidebarOpen: true,
  chatOpen: false,
  theme: localStorage.getItem('theme') || 'dark',
  
  // Data State
  requirements: [],
  modules: [],
  stats: null,
  loading: false,

  // Actions
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleChat: () => set((s) => ({ chatOpen: !s.chatOpen })),
  toggleTheme: () => set((s) => {
    const t = s.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', t);
    return { theme: t };
  }),
  
  setRequirements: (requirements) => set({ requirements }),
  setModules: (modules) => set({ modules }),
  setStats: (stats) => set({ stats }),
  setLoading: (loading) => set({ loading }),
}));
