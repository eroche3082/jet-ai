/**
 * Date and time utility functions for JetAI
 */

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

/**
 * Get the current time of day based on hour
 */
export function getCurrentTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return 'morning';
  } else if (hour >= 12 && hour < 17) {
    return 'afternoon';
  } else if (hour >= 17 && hour < 22) {
    return 'evening';
  } else {
    return 'night';
  }
}

/**
 * Format a date in a user-friendly way
 */
export function formatDate(date: Date, format: 'short' | 'long' = 'short'): string {
  if (format === 'short') {
    return date.toLocaleDateString();
  } else {
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

/**
 * Format a time in a user-friendly way
 */
export function formatTime(date: Date, format: '12h' | '24h' = '12h'): string {
  if (format === '12h') {
    return date.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } else {
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }
}

/**
 * Calculate days remaining until a target date
 */
export function daysUntil(targetDate: Date): number {
  const now = new Date();
  const diffTime = targetDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if a date is in the past
 */
export function isPastDate(date: Date): boolean {
  return date.getTime() < Date.now();
}

/**
 * Get a date range description (e.g., "May 15-20, 2025")
 */
export function getDateRangeDescription(startDate: Date, endDate: Date): string {
  // Same month and year
  if (
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getFullYear() === endDate.getFullYear()
  ) {
    return `${startDate.toLocaleDateString(undefined, { month: 'short' })} ${startDate.getDate()}-${endDate.getDate()}, ${startDate.getFullYear()}`;
  }
  
  // Same year, different month
  if (startDate.getFullYear() === endDate.getFullYear()) {
    return `${startDate.toLocaleDateString(undefined, { month: 'short' })} ${startDate.getDate()} - ${endDate.toLocaleDateString(undefined, { month: 'short' })} ${endDate.getDate()}, ${startDate.getFullYear()}`;
  }
  
  // Different year
  return `${startDate.toLocaleDateString(undefined, { month: 'short' })} ${startDate.getDate()}, ${startDate.getFullYear()} - ${endDate.toLocaleDateString(undefined, { month: 'short' })} ${endDate.getDate()}, ${endDate.getFullYear()}`;
}

/**
 * Get relative time description (e.g., "2 days ago", "in 3 hours")
 */
export function getRelativeTimeDescription(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);
  
  if (diffSec < 0) {
    // Past
    if (diffSec > -60) return 'just now';
    if (diffMin > -60) return `${Math.abs(diffMin)} minute${Math.abs(diffMin) === 1 ? '' : 's'} ago`;
    if (diffHour > -24) return `${Math.abs(diffHour)} hour${Math.abs(diffHour) === 1 ? '' : 's'} ago`;
    if (diffDay > -7) return `${Math.abs(diffDay)} day${Math.abs(diffDay) === 1 ? '' : 's'} ago`;
    return formatDate(date);
  } else {
    // Future
    if (diffSec < 60) return 'in a moment';
    if (diffMin < 60) return `in ${diffMin} minute${diffMin === 1 ? '' : 's'}`;
    if (diffHour < 24) return `in ${diffHour} hour${diffHour === 1 ? '' : 's'}`;
    if (diffDay < 7) return `in ${diffDay} day${diffDay === 1 ? '' : 's'}`;
    return `on ${formatDate(date)}`;
  }
}