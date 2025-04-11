import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names and tailwind classes efficiently
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extracts the subdomain from the current hostname
 * Returns null if there's no subdomain (or if it's www)
 */
export function getSubdomain(): string | null {
  // In development, we get the subdomain from localStorage if available for testing
  if (process.env.NODE_ENV === 'development') {
    const testSubdomain = localStorage.getItem('testSubdomain');
    if (testSubdomain) return testSubdomain;
  }
  
  // Extract the hostname parts
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  
  // Check if there's a subdomain
  if (parts.length > 2) {
    const subdomain = parts[0];
    // Ignore www as it's not a real subdomain for our purposes
    if (subdomain !== 'www') {
      return subdomain;
    }
  }
  
  // If we're using a localhost domain with ports, check for subdomain format
  if (hostname === 'localhost' || hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
    // Check in query params for dev testing
    const params = new URLSearchParams(window.location.search);
    const subdomain = params.get('subdomain');
    if (subdomain) return subdomain;
  }
  
  return null;
}

/**
 * Gets the affiliate ID from various sources
 * Priority: URL params > cookies > localStorage
 */
export function getAffiliateId(): string | null {
  // Check URL parameters first
  const params = new URLSearchParams(window.location.search);
  const refParam = params.get('ref');
  if (refParam) {
    // Store for future use
    localStorage.setItem('affiliateId', refParam);
    return refParam;
  }
  
  // Check localStorage
  const storedId = localStorage.getItem('affiliateId');
  if (storedId) return storedId;
  
  // Check cookies (fallback)
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'affiliateId') {
      return value;
    }
  }
  
  return null;
}

/**
 * Format a number as currency
 * @param amount Number to format
 * @param currency Currency code (default: USD)
 * @param locale Locale for formatting (default: en-US)
 * @param decimals Number of decimal places
 */
export function formatCurrency(
  amount: number, 
  currency = 'USD', 
  locale = 'en-US', 
  decimals?: number
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: typeof decimals === 'number' ? decimals : 2,
    maximumFractionDigits: typeof decimals === 'number' ? decimals : 2,
  }).format(amount);
}

/**
 * Clean and format a subdomain string
 * Removes special characters, spaces, etc.
 */
export function formatSubdomain(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '') // Only allow lowercase alphanumeric and dash
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
}

/**
 * Format a date to a readable string
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  return new Intl.DateTimeFormat('en-US', options || defaultOptions).format(dateObj);
}