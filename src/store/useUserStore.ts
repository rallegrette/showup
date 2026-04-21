import { create } from 'zustand';
import { UserProfile, User } from '../api/types';
import { getCurrentUser } from '../api/shows';
import { mockFriends, mockAllUsers, mockUserProfiles, mockCurrentUser } from '../data/users';

interface UserState {
  currentUser: UserProfile | null;
  friends: User[];
  allUsers: User[];
  loading: boolean;

  fetchCurrentUser: () => Promise<void>;
  getUserProfile: (id: string) => UserProfile | null;
  searchUsers: (query: string) => User[];
}

export const useUserStore = create<UserState>((set, get) => ({
  currentUser: null,
  friends: mockFriends,
  allUsers: mockAllUsers,
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

  getUserProfile: (id: string) => {
    if (id === 'u1') return mockCurrentUser;
    return mockUserProfiles[id] ?? null;
  },

  searchUsers: (query: string) => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return get().allUsers.filter(
      (u) =>
        u.id !== 'u1' &&
        (u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q))
    );
  },
}));
