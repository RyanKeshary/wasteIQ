/**
 * Utility Functions
 * Shared helpers used across the platform.
 */
import { type ClassValue, clsx } from 'clsx';

/**
 * Merge class names with Tailwind conflict resolution.
 * Uses clsx for conditional classes.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Format a date string for display.
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  });
}

/**
 * Format a timestamp for display (date + time).
 */
export function formatTimestamp(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format a relative time string (e.g., "3 hours ago").
 */
export function timeAgo(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return formatDate(d);
}

/**
 * Get bin status color for design system tokens.
 */
export function getBinStatusColor(status: string): {
  bg: string;
  text: string;
  dot: string;
} {
  switch (status) {
    case 'NORMAL':
      return { bg: 'var(--success-container)', text: 'var(--success)', dot: '#00C16A' };
    case 'WARNING':
      return { bg: 'var(--warning-container)', text: 'var(--warning)', dot: '#FF8842' };
    case 'CRITICAL':
      return { bg: '#FFDCC0', text: '#9D4300', dot: '#FF8842' };
    case 'OVERFLOW':
      return { bg: 'var(--error-container)', text: 'var(--error)', dot: '#BA1A1A' };
    case 'OFFLINE':
      return { bg: 'var(--surface-high)', text: 'var(--outline)', dot: '#6F7978' };
    case 'MAINTENANCE':
      return { bg: 'var(--info-container)', text: 'var(--info)', dot: '#006591' };
    default:
      return { bg: 'var(--surface-high)', text: 'var(--outline)', dot: '#6F7978' };
  }
}

/**
 * Get a fill level percentage bar color class.
 */
export function getFillLevelColor(fill: number): string {
  if (fill >= 95) return '#BA1A1A';
  if (fill >= 80) return '#9D4300';
  if (fill >= 60) return '#FF8842';
  return '#00C16A';
}

/**
 * Truncate text with ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '…';
}

/**
 * Generate a random ID (for client-side optimistic updates).
 */
export function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

/**
 * Sleep for a given number of milliseconds.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
