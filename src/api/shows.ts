import { apiGet } from './client';
import { Show, Venue, Activity, UserProfile, ApiResponse } from './types';
import { mockShows } from '../data/shows';
import { mockVenues } from '../data/venues';
import { mockActivities } from '../data/activities';
import { mockCurrentUser } from '../data/users';

export async function getShows(): Promise<ApiResponse<Show[]>> {
  return apiGet(() => mockShows);
}

export async function getShowById(id: string): Promise<ApiResponse<Show | undefined>> {
  return apiGet(() => mockShows.find((s) => s.id === id));
}

export async function getUpcomingShows(): Promise<ApiResponse<Show[]>> {
  return apiGet(() => mockShows.filter((s) => !s.isPast));
}

export async function getPastShows(): Promise<ApiResponse<Show[]>> {
  return apiGet(() => mockShows.filter((s) => s.isPast));
}

export async function getVenues(): Promise<ApiResponse<Venue[]>> {
  return apiGet(() => mockVenues);
}

export async function getActivities(): Promise<ApiResponse<Activity[]>> {
  return apiGet(() => mockActivities);
}

export async function getCurrentUser(): Promise<ApiResponse<UserProfile>> {
  return apiGet(() => mockCurrentUser);
}
