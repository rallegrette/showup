export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  coordinates: Coordinates;
  imageUrl: string;
}

export interface Artist {
  id: string;
  name: string;
  genre: string;
  imageUrl: string;
}

export type ReactionType = 'fire' | 'heart' | 'guitar' | 'mindblown' | 'dancing' | 'clap';

export interface Reaction {
  type: ReactionType;
  count: number;
  userReacted: boolean;
}

export type AttendanceStatus = 'going' | 'interested' | null;

export interface Show {
  id: string;
  title: string;
  artists: Artist[];
  venue: Venue;
  date: string;
  doorsOpen: string;
  startTime: string;
  endTime?: string;
  imageUrl: string;
  genre: string;
  price: string;
  ticketUrl: string;
  reactions: Reaction[];
  attendanceStatus: AttendanceStatus;
  friendsGoing: User[];
  friendsInterested: User[];
  totalGoing: number;
  totalInterested: number;
  isPast: boolean;
}

export interface User {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  isOnline: boolean;
}

export type ActivityType = 'going' | 'interested' | 'reacted';

export interface Activity {
  id: string;
  user: User;
  type: ActivityType;
  reactionType?: ReactionType;
  show: Show;
  timestamp: string;
}

export interface UserProfile extends User {
  bio: string;
  showsAttended: number;
  totalReactions: number;
  friendCount: number;
  topReactions: ReactionType[];
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}
