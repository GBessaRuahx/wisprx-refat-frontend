import { create } from 'zustand';

export interface Setting {
  id: number;
  key: string;
  value: string;
}

interface SettingsState {
  settings: Setting[];
  loading: boolean;
  error: Error | null;
  setSettings: (settings: Setting[] | ((prev: Setting[]) => Setting[])) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings:
    typeof window !== 'undefined'
      ? (() => {
          try {
            return JSON.parse(localStorage.getItem('settings') || '[]');
          } catch (e) {
            console.error('Failed to parse settings from localStorage:', e);
            return [];
          }
        })()
      : [],
  loading: false,
  error: null,
  setSettings: updater =>
    set(state => {
      const next = typeof updater === 'function' ? (updater as (prev: Setting[]) => Setting[])(state.settings) : updater;
      if (typeof window !== 'undefined') {
        localStorage.setItem('settings', JSON.stringify(next));
      }
      return { settings: next };
    }),
  setLoading: loading => set({ loading }),
  setError: error => set({ error }),
}));

export default useSettingsStore;
