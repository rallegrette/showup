import { User, UserProfile, ReactionType } from '../api/types';

export const mockFriends: User[] = [
  {
    id: 'u2',
    name: 'Alex Chen',
    username: 'alexc',
    avatarUrl: 'https://i.pravatar.cc/150?img=3',
    isOnline: true,
  },
  {
    id: 'u3',
    name: 'Jordan Lee',
    username: 'jordanl',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    isOnline: true,
  },
  {
    id: 'u4',
    name: 'Sam Rivera',
    username: 'samr',
    avatarUrl: 'https://i.pravatar.cc/150?img=8',
    isOnline: false,
  },
  {
    id: 'u5',
    name: 'Maya Patel',
    username: 'mayap',
    avatarUrl: 'https://i.pravatar.cc/150?img=9',
    isOnline: true,
  },
  {
    id: 'u6',
    name: 'Chris Wong',
    username: 'chrisw',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
    isOnline: false,
  },
  {
    id: 'u7',
    name: 'Nia Thompson',
    username: 'niat',
    avatarUrl: 'https://i.pravatar.cc/150?img=16',
    isOnline: true,
  },
];

export const mockCurrentUser: UserProfile = {
  id: 'u1',
  name: 'Rose Allegrette',
  username: 'rose',
  avatarUrl: 'https://i.pravatar.cc/150?img=1',
  isOnline: true,
  bio: 'live music is the only music',
  showsAttended: 47,
  totalReactions: 182,
  friendCount: mockFriends.length,
  topReactions: ['fire', 'heart', 'dancing'] as ReactionType[],
};
