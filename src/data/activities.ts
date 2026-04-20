import { Activity } from '../api/types';
import { mockShows } from './shows';
import { mockFriends } from './users';
import { subHours, subMinutes } from 'date-fns';

const now = new Date();

export const mockActivities: Activity[] = [
  {
    id: 'act1',
    user: mockFriends[0],
    type: 'going',
    show: mockShows[0], // Chappell Roan
    timestamp: subMinutes(now, 12).toISOString(),
  },
  {
    id: 'act2',
    user: mockFriends[1],
    type: 'reacted',
    reactionType: 'fire',
    show: mockShows[1], // Sabrina Carpenter
    timestamp: subMinutes(now, 28).toISOString(),
  },
  {
    id: 'act3',
    user: mockFriends[3],
    type: 'going',
    show: mockShows[1], // Sabrina Carpenter
    timestamp: subHours(now, 1).toISOString(),
  },
  {
    id: 'act4',
    user: mockFriends[4],
    type: 'interested',
    show: mockShows[2], // Wallows
    timestamp: subHours(now, 2).toISOString(),
  },
  {
    id: 'act5',
    user: mockFriends[2],
    type: 'reacted',
    reactionType: 'heart',
    show: mockShows[3], // Tyler, the Creator
    timestamp: subHours(now, 3).toISOString(),
  },
  {
    id: 'act6',
    user: mockFriends[5],
    type: 'going',
    show: mockShows[4], // Billie Eilish
    timestamp: subHours(now, 4).toISOString(),
  },
  {
    id: 'act7',
    user: mockFriends[0],
    type: 'reacted',
    reactionType: 'dancing',
    show: mockShows[5], // Boygenius
    timestamp: subHours(now, 5).toISOString(),
  },
  {
    id: 'act8',
    user: mockFriends[1],
    type: 'interested',
    show: mockShows[6], // SZA
    timestamp: subHours(now, 7).toISOString(),
  },
  {
    id: 'act9',
    user: mockFriends[3],
    type: 'reacted',
    reactionType: 'mindblown',
    show: mockShows[7], // Tame Impala
    timestamp: subHours(now, 9).toISOString(),
  },
  {
    id: 'act10',
    user: mockFriends[4],
    type: 'going',
    show: mockShows[3], // Tyler, the Creator
    timestamp: subHours(now, 12).toISOString(),
  },
  {
    id: 'act11',
    user: mockFriends[2],
    type: 'interested',
    show: mockShows[5], // Boygenius
    timestamp: subHours(now, 18).toISOString(),
  },
  {
    id: 'act12',
    user: mockFriends[5],
    type: 'reacted',
    reactionType: 'guitar',
    show: mockShows[2], // Wallows
    timestamp: subHours(now, 24).toISOString(),
  },
];
