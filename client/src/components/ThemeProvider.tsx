import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrandTheme, getActiveTheme, getAffiliateId } from '@/lib/utils';

interface ThemeContextType {
  theme: BrandTheme;
  affiliateId: string | null;
  isCustomTheme: boolean;
  setThemeOverride: (subdomain: string | null) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: getActiveTheme(),
  affiliateId: null,
  isCustomTheme: false,
  setThemeOverride: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [activeTheme, setActiveTheme] = useState<BrandTheme>(getActiveTheme());
  const [affiliateId, setAffiliateId] = useState<string | null>(null);
  const [themeOverride, setThemeOverride] = useState<string | null>(null);
  
  useEffect(() => {
    // Get theme based on subdomain
    const theme = themeOverride ? 
      getActiveTheme() : // Use override if set
      getActiveTheme();  // Or get from current subdomain
    
    setActiveTheme(theme);
    
    // Apply theme CSS variables to document root
    const root = document.documentElement;
    
    // Apply custom colors if not using default CSS variables
    if (theme.subdomain !== 'app') {
      root.style.setProperty('--primary', theme.colors.primary);
      root.style.setProperty('--secondary', theme.colors.secondary);
      root.style.setProperty('--accent', theme.colors.accent);
      root.style.setProperty('--background', theme.colors.background);
      root.style.setProperty('--foreground', theme.colors.text);
      
      // Add custom fonts if needed
      if (theme.fonts.heading !== 'var(--font-heading)') {
        document.head.insertAdjacentHTML(
          'beforeend',
          `<style>
            @import url('https://fonts.googleapis.com/css2?family=${theme.fonts.heading.replace(' ', '+')}&family=${theme.fonts.body.replace(' ', '+')}&display=swap');
            :root {
              --font-heading: ${theme.fonts.heading};
              --font-sans: ${theme.fonts.body};
            }
          </style>`
        );
      }
      
      // Update favicon and title
      const favicon = document.querySelector('link[rel="icon"]');
      if (favicon) {
        favicon.setAttribute('href', theme.logo);
      }
      
      document.title = theme.name + ' - ' + theme.tagline;
    }
    
    // Get and store affiliate ID
    const currentAffiliateId = getAffiliateId();
    setAffiliateId(currentAffiliateId);
    
    // Track affiliate visit if exists
    if (currentAffiliateId) {
      // In a real app, this would call an API to track the visit
      console.log(`Tracking visit from affiliate: ${currentAffiliateId}`);
    }
  }, [themeOverride]);
  
  // Provide theme context to the app
  const contextValue = {
    theme: activeTheme,
    affiliateId,
    isCustomTheme: activeTheme.subdomain !== 'app',
    setThemeOverride: (subdomain: string | null) => setThemeOverride(subdomain),
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}