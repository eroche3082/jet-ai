import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as currency
 */
export function formatCurrency(
  amount: number,
  currency = "USD",
  locale = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats a large number with abbreviations (K, M, B, T)
 */
export function formatLargeNumber(num: number): string {
  if (num < 1000) return num.toString();
  
  const abbreviations = ["", "K", "M", "B", "T"];
  const tier = Math.floor(Math.log10(Math.abs(num)) / 3);
  
  if (tier >= abbreviations.length) return num.toString();
  
  const suffix = abbreviations[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = num / scale;
  
  return scaled.toFixed(1).replace(/\.0$/, "") + suffix;
}

/**
 * Formats a percentage value
 */
export function formatPercentage(value: number, decimals = 2): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(decimals)}%`;
}

/**
 * Truncates long text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

/**
 * Generates a gradient class based on value change (positive/negative)
 */
export function getChangeGradient(change: number): string {
  return change >= 0
    ? "bg-gradient-to-r from-green-500/20 to-green-500/5"
    : "bg-gradient-to-r from-red-500/20 to-red-500/5";
}

/**
 * Get class name for positive/negative values
 */
export function getChangeTextColor(change: number): string {
  return change >= 0 ? "text-green-500" : "text-red-500";
}

/**
 * Format date to human readable string
 */
export function formatDate(date: Date | string): string {
  if (typeof date === "string") {
    date = new Date(date);
  }
  
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format time ago (e.g., "2 hours ago")
 */
export function timeAgo(date: Date | string): string {
  const now = new Date();
  const pastDate = typeof date === "string" ? new Date(date) : date;
  
  const seconds = Math.floor((now.getTime() - pastDate.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  
  const years = Math.floor(days / 365);
  return `${years}y ago`;
}