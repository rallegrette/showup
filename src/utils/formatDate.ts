import { format, isToday, isTomorrow, isThisWeek, differenceInDays, parseISO, formatDistanceToNow } from 'date-fns';

export function formatShowDate(dateStr: string): string {
  const date = parseISO(dateStr);

  if (isToday(date)) return 'Tonight';
  if (isTomorrow(date)) return 'Tomorrow';
  if (isThisWeek(date, { weekStartsOn: 1 })) return format(date, 'EEEE');

  const daysAway = differenceInDays(date, new Date());
  if (daysAway <= 14) return format(date, 'EEE, MMM d');

  return format(date, 'MMM d');
}

export function formatShowTime(time: string): string {
  return time;
}

export function formatRelativeTime(timestamp: string): string {
  return formatDistanceToNow(parseISO(timestamp), { addSuffix: true });
}

export function getDateGroup(dateStr: string): string {
  const date = parseISO(dateStr);

  if (isToday(date)) return 'Tonight';
  if (isTomorrow(date)) return 'Tomorrow';
  if (isThisWeek(date, { weekStartsOn: 1 })) return 'This Week';

  const daysAway = differenceInDays(date, new Date());
  if (daysAway <= 14) return 'Next Week';

  return 'Coming Up';
}
