import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAffiliateId, getSubdomain } from '@/lib/utils';
import { apiRequest } from '@/lib/queryClient';

// Define theme interfaces
export interface BrandTheme {
  primaryColor: string;
  borderRadius: string;
  fontFamily: string;
  logo: string;
  name: string;
  subdomain: string;
}

interface ThemeContextType {
  theme: BrandTheme;
  affiliateId: string | null;
  isCustomTheme: boolean;
  setThemeOverride: (subdomain: string | null) => void;
}

// Default theme
const defaultTheme: BrandTheme = {
  primaryColor: '#3182ce',
  borderRadius: '0.5rem',
  fontFamily: 'Inter, system-ui, sans-serif',
  logo: '/assets/logo.svg',
  name: 'JetAI',
  subdomain: 'app',
};

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  affiliateId: null,
  isCustomTheme: false,
  setThemeOverride: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<BrandTheme>(defaultTheme);
  const [affiliateId, setAffiliateId] = useState<string | null>(null);
  const [themeOverride, setThemeOverride] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch theme configuration based on subdomain
  useEffect(() => {
    const fetchThemeConfig = async () => {
      try {
        // Get active subdomain, honor override if set
        const subdomain = themeOverride || getSubdomain() || 'app';
        
        // In a real production app, we would make an API call to get the theme config
        // For demo purposes, we'll use a simple mapping
        const response = await apiRequest('GET', `/api/subdomain/config?subdomain=${subdomain}`);
        
        if (response.ok) {
          const data = await response.json();
          
          // If we have a valid config, use it
          if (data && data.config) {
            const brandConfig = data.config;
            
            // Map the brand config to our theme format
            const newTheme: BrandTheme = {
              primaryColor: brandConfig.primaryColor || defaultTheme.primaryColor,
              borderRadius: brandConfig.borderRadius || defaultTheme.borderRadius,
              fontFamily: brandConfig.fontFamily || defaultTheme.fontFamily,
              logo: brandConfig.logo || defaultTheme.logo,
              name: brandConfig.name || defaultTheme.name,
              subdomain: subdomain,
            };
            
            setTheme(newTheme);
            
            // Apply theme to document
            applyThemeToDocument(newTheme);
          }
        } else {
          // Fallback to default theme
          setTheme(defaultTheme);
          applyThemeToDocument(defaultTheme);
        }
      } catch (error) {
        console.error('Error fetching theme:', error);
        setTheme(defaultTheme);
        applyThemeToDocument(defaultTheme);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchThemeConfig();
  }, [themeOverride]);
  
  // Track affiliate ID
  useEffect(() => {
    const currentAffiliateId = getAffiliateId();
    setAffiliateId(currentAffiliateId);
    
    // Track affiliate visit if exists
    if (currentAffiliateId) {
      // In a real app, this would call an API to track the visit
      console.log(`Tracking visit from affiliate: ${currentAffiliateId}`);
      
      // Store in localStorage with timestamp
      const trackingData = {
        id: currentAffiliateId,
        timestamp: new Date().toISOString(),
        isFirstVisit: !localStorage.getItem(`affiliate_visit_${currentAffiliateId}`)
      };
      
      localStorage.setItem(`affiliate_visit_${currentAffiliateId}`, JSON.stringify(trackingData));
    }
  }, []);
  
  // Apply theme to document
  const applyThemeToDocument = (theme: BrandTheme) => {
    const root = document.documentElement;
    
    // Set CSS variables for theme colors
    root.style.setProperty('--primary', theme.primaryColor);
    root.style.setProperty('--radius', theme.borderRadius);
    
    // Update title if custom subdomain
    if (theme.subdomain !== 'app') {
      document.title = `${theme.name} - Smart Travel Assistant`;
      
      // Update favicon if needed
      const favicon = document.querySelector('link[rel="icon"]');
      if (favicon && theme.logo) {
        favicon.setAttribute('href', theme.logo);
      }
    }
  };
  
  // Provide theme context to the app
  const contextValue = {
    theme,
    affiliateId,
    isCustomTheme: theme.subdomain !== 'app',
    setThemeOverride: (subdomain: string | null) => setThemeOverride(subdomain),
  };
  
  // If still loading theme, render empty div to avoid flashing
  if (isLoading) {
    return null;
  }
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}