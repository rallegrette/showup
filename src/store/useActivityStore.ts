import { create } from 'zustand';
import { Activity } from '../api/types';
import { getActivities } from '../api/shows';

interface ActivityState {
  activities: Activity[];
  loading: boolean;
  error: string | null;

  fetchActivities: () => Promise<void>;
}

export const useActivityStore = create<ActivityState>((set) => ({
  activities: [],
  loading: false,
  error: null,

  fetchActivities: async () => {
    set({ loading: true, error: null });
    const response = await getActivities();
    if (response.success) {
      set({ activities: response.data, loading: false });
    } else {
      set({ error: response.error ?? 'Failed to load activities', loading: false });
    }
  },
}));
