import { create } from 'zustand';
import { UserProfile, User } from '../api/types';
import { getCurrentUser } from '../api/shows';
import { mockFriends } from '../data/users';

interface UserState {
  currentUser: UserProfile | null;
  friends: User[];
  loading: boolean;

  fetchCurrentUser: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  friends: mockFriends,
  loading: false,

  fetchCurrentUser: async () => {
    set({ loading: true });
    const response = await getCurrentUser();
    if (response.success) {
      set({ currentUser: response.data, loading: false });
    } else {
      set({ loading: false });
    }
  },
}));
