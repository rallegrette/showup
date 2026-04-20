import { create } from 'zustand';
import { Show, ReactionType, AttendanceStatus } from '../api/types';
import { getUpcomingShows, getPastShows, getShowById } from '../api/shows';

interface ShowState {
  shows: Show[];
  pastShows: Show[];
  loading: boolean;
  error: string | null;

  fetchShows: () => Promise<void>;
  fetchPastShows: () => Promise<void>;
  getShow: (id: string) => Show | undefined;
  toggleReaction: (showId: string, reactionType: ReactionType) => void;
  setAttendance: (showId: string, status: AttendanceStatus) => void;
}

export const useShowStore = create<ShowState>((set, get) => ({
  shows: [],
  pastShows: [],
  loading: false,
  error: null,

  fetchShows: async () => {
    set({ loading: true, error: null });
    const response = await getUpcomingShows();
    if (response.success) {
      set({ shows: response.data, loading: false });
    } else {
      set({ error: response.error ?? 'Failed to load shows', loading: false });
    }
  },

  fetchPastShows: async () => {
    const response = await getPastShows();
    if (response.success) {
      set({ pastShows: response.data });
    }
  },

  getShow: (id: string) => {
    const { shows, pastShows } = get();
    return [...shows, ...pastShows].find((s) => s.id === id);
  },

  toggleReaction: (showId: string, reactionType: ReactionType) => {
    set((state) => ({
      shows: state.shows.map((show) => {
        if (show.id !== showId) return show;
        return {
          ...show,
          reactions: show.reactions.map((r) => {
            if (r.type !== reactionType) return r;
            return {
              ...r,
              userReacted: !r.userReacted,
              count: r.userReacted ? r.count - 1 : r.count + 1,
            };
          }),
        };
      }),
      pastShows: state.pastShows.map((show) => {
        if (show.id !== showId) return show;
        return {
          ...show,
          reactions: show.reactions.map((r) => {
            if (r.type !== reactionType) return r;
            return {
              ...r,
              userReacted: !r.userReacted,
              count: r.userReacted ? r.count - 1 : r.count + 1,
            };
          }),
        };
      }),
    }));
  },

  setAttendance: (showId: string, status: AttendanceStatus) => {
    set((state) => ({
      shows: state.shows.map((show) => {
        if (show.id !== showId) return show;
        const prevStatus = show.attendanceStatus;
        let { totalGoing, totalInterested } = show;

        if (prevStatus === 'going') totalGoing--;
        if (prevStatus === 'interested') totalInterested--;
        if (status === 'going') totalGoing++;
        if (status === 'interested') totalInterested++;

        return {
          ...show,
          attendanceStatus: show.attendanceStatus === status ? null : status,
          totalGoing,
          totalInterested,
        };
      }),
    }));
  },
}));
