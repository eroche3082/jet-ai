import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Types for the white-label theming system
export interface BrandTheme {
  name: string;
  subdomain: string;
  logo: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  tagline: string;
  tone: 'friendly' | 'professional' | 'luxurious' | 'adventurous';
  partnerId: string;
  affiliateId?: string;
  contactInfo?: {
    email: string;
    phone?: string;
    website?: string;
  };
}

// Default theme for main JetAI branding
export const defaultTheme: BrandTheme = {
  name: 'JetAI',
  subdomain: 'app',
  logo: '/assets/logo.svg',
  colors: {
    primary: 'hsl(var(--primary))', 
    secondary: 'hsl(var(--secondary))',
    accent: 'hsl(var(--accent))',
    background: 'hsl(var(--background))',
    text: 'hsl(var(--foreground))'
  },
  fonts: {
    heading: 'var(--font-heading)',
    body: 'var(--font-sans)'
  },
  tagline: 'Your AI-powered travel companion',
  tone: 'friendly',
  partnerId: 'jetai-main',
}

// White-label partner themes
export const partnerThemes: Record<string, BrandTheme> = {
  'luxury': {
    name: 'Luxury Journeys AI',
    subdomain: 'luxury',
    logo: '/assets/partners/luxury-logo.svg',
    colors: {
      primary: '#c9a66b',
      secondary: '#14151a',
      accent: '#c9a66b',
      background: '#14151a',
      text: '#ffffff'
    },
    fonts: {
      heading: 'Playfair Display, serif',
      body: 'Montserrat, sans-serif'
    },
    tagline: 'Elevate your travel experience with AI',
    tone: 'luxurious',
    partnerId: 'luxury-travel',
    contactInfo: {
      email: 'concierge@luxuryjourneys.example',
      website: 'https://luxury.jetai.app'
    }
  },
  'backpackers': {
    name: 'Backpacker\'s Buddy',
    subdomain: 'backpackers',
    logo: '/assets/partners/backpacker-logo.svg',
    colors: {
      primary: '#5ec593',
      secondary: '#2e4052',
      accent: '#ff7e5f',
      background: '#f8f9fa',
      text: '#2e4052'
    },
    fonts: {
      heading: 'Poppins, sans-serif',
      body: 'Roboto, sans-serif'
    },
    tagline: 'Budget-friendly adventures powered by AI',
    tone: 'adventurous',
    partnerId: 'backpackers-hub',
    contactInfo: {
      email: 'hello@backpackerbuddy.example',
      website: 'https://backpackers.jetai.app'
    }
  },
  'miami': {
    name: 'Miami Explorer AI',
    subdomain: 'miami',
    logo: '/assets/partners/miami-logo.svg',
    colors: {
      primary: '#fc6471',
      secondary: '#00c1b5',
      accent: '#ffbe0b',
      background: '#ffffff',
      text: '#1e2022'
    },
    fonts: {
      heading: 'DM Sans, sans-serif',
      body: 'Inter, sans-serif'
    },
    tagline: 'Discover Miami with AI-powered insights',
    tone: 'friendly',
    partnerId: 'miami-tourism',
    contactInfo: {
      email: 'hola@miamiexplorer.example',
      website: 'https://miami.jetai.app'
    }
  }
};

// Get the current subdomain from the URL
export function getCurrentSubdomain(): string {
  if (typeof window === 'undefined') return 'app';
  
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '0.0.0.0') {
    // For development, use query param ?brand=subdomain
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('brand') || 'app';
  }
  
  // Extract subdomain from hostname (e.g., luxury.jetai.app -> luxury)
  const parts = hostname.split('.');
  return parts.length > 2 ? parts[0] : 'app';
}

// Get the active theme based on subdomain
export function getActiveTheme(): BrandTheme {
  const subdomain = getCurrentSubdomain();
  return subdomain !== 'app' && partnerThemes[subdomain]
    ? partnerThemes[subdomain]
    : defaultTheme;
}

// Get affiliate ID from URL or localStorage
export function getAffiliateId(): string | null {
  if (typeof window === 'undefined') return null;
  
  // Check URL first
  const urlParams = new URLSearchParams(window.location.search);
  const urlRef = urlParams.get('ref');
  
  if (urlRef) {
    // Save the affiliate ID to localStorage for attribution
    localStorage.setItem('jetai_affiliate', urlRef);
    return urlRef;
  }
  
  // Check localStorage as fallback
  return localStorage.getItem('jetai_affiliate');
}

// Format currency based on locale and currency
export function formatCurrency(amount: number, currency = 'USD', locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(amount);
}

// Generate a unique session ID for tracking
export function generateSessionId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
