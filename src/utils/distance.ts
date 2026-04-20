import { Coordinates } from '../api/types';

export function calculateDistance(from: Coordinates, to: Coordinates): number {
  const R = 3959; // earth radius in miles
  const dLat = toRad(to.latitude - from.latitude);
  const dLon = toRad(to.longitude - from.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(from.latitude)) * Math.cos(toRad(to.latitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function formatDistance(miles: number): string {
  if (miles < 0.1) return 'Right here';
  if (miles < 1) return `${(miles * 5280 / 5280).toFixed(1)} mi`;
  return `${miles.toFixed(1)} mi`;
}
