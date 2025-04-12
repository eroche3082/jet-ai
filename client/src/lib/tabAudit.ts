/**
 * Tab Audit System for JetAI
 * 
 * This module provides functionality to validate and audit tabs in the JetAI interface,
 * ensuring they are properly functioning with all connected APIs and components.
 */

import { ApiStatus, checkApiStatus } from './apiVerification';

export interface TabAuditResult {
  tab: string;
  status: 'OK' | 'Partial' | 'Broken';
  issues: string[];
  APIs_used: string[];
  APIs_missing_or_disconnected: string[];
}

export interface ComponentStatus {
  name: string;
  isVisible: boolean;
  isInteractive: boolean;
  hasErrors: boolean;
  errorDetails?: string;
}

/**
 * Perform a comprehensive audit of a specified tab
 */
export async function auditTab(tabName: string): Promise<TabAuditResult> {
  console.log(`Starting audit for tab: ${tabName}`);
  
  // Initialize audit result
  const result: TabAuditResult = {
    tab: tabName,
    status: 'OK',
    issues: [],
    APIs_used: [],
    APIs_missing_or_disconnected: []
  };
  
  try {
    // Step 1: Verify tab visibility and properties
    const tabStatus = await verifyTabVisibility(tabName);
    if (!tabStatus.isVisible) {
      result.status = 'Broken';
      result.issues.push(`Tab "${tabName}" is not visible in the sidebar/menu`);
    }
    
    if (!tabStatus.isInteractive) {
      result.status = 'Partial';
      result.issues.push(`Tab "${tabName}" is visible but not interactive (not clickable)`);
    }
    
    // Step 2: Verify components within the tab
    const componentStatuses = await verifyTabComponents(tabName);
    const failedComponents = componentStatuses.filter(c => c.hasErrors);
    
    if (failedComponents.length > 0) {
      result.status = result.status === 'OK' ? 'Partial' : result.status;
      failedComponents.forEach(c => {
        result.issues.push(`Component "${c.name}" failed: ${c.errorDetails || 'Unknown error'}`);
      });
    }
    
    // Step 3: Verify API integrations
    const apiStatuses = await verifyApiIntegrations(tabName);
    result.APIs_used = apiStatuses
      .filter(api => api.status === 'connected')
      .map(api => api.name);
      
    result.APIs_missing_or_disconnected = apiStatuses
      .filter(api => api.status !== 'connected')
      .map(api => api.name);
      
    if (result.APIs_missing_or_disconnected.length > 0) {
      result.status = result.status === 'OK' ? 'Partial' : result.status;
      result.issues.push(`APIs not connected: ${result.APIs_missing_or_disconnected.join(', ')}`);
    }
    
    // Step 4: Verify chatbot integration (if applicable)
    const chatbotStatus = await verifyChatbotIntegration(tabName);
    if (tabName === 'Explore' || tabName === 'Chat') {
      if (!chatbotStatus.isVisible) {
        result.status = result.status === 'OK' ? 'Partial' : result.status;
        result.issues.push('Chatbot is not visible in this tab');
      }
      
      if (!chatbotStatus.isInteractive) {
        result.status = result.status === 'OK' ? 'Partial' : result.status;
        result.issues.push('Chatbot is visible but not interactive');
      }
      
      if (chatbotStatus.hasErrors) {
        result.status = 'Broken';
        result.issues.push(`Chatbot error: ${chatbotStatus.errorDetails}`);
      }
    }
    
    console.log(`Audit completed for tab: ${tabName}`, result);
    return result;
    
  } catch (error) {
    console.error(`Audit failed for tab: ${tabName}`, error);
    result.status = 'Broken';
    result.issues.push(`Critical error during audit: ${error.message || 'Unknown error'}`);
    return result;
  }
}

/**
 * Verify if a tab is visible and clickable in the UI
 */
async function verifyTabVisibility(tabName: string): Promise<ComponentStatus> {
  // This would be implemented differently in a real app with proper DOM access
  // For the demo, we'll simulate success for certain tabs
  const knownTabs = ['Explore', 'Itineraries', 'Bookings', 'Profile', 'Settings'];
  
  return {
    name: tabName,
    isVisible: knownTabs.includes(tabName),
    isInteractive: knownTabs.includes(tabName),
    hasErrors: false
  };
}

/**
 * Verify all components within a tab function properly
 */
async function verifyTabComponents(tabName: string): Promise<ComponentStatus[]> {
  const componentMap: Record<string, string[]> = {
    'Explore': ['SearchBox', 'DestinationGrid', 'FilterPanel', 'RecommendationCarousel'],
    'Itineraries': ['ItineraryList', 'FilterPanel', 'SortDropdown'],
    'Bookings': ['BookingList', 'CalendarView', 'StatusFilter'],
    'Profile': ['UserInfo', 'PreferencePanel', 'ActivityHistory'],
    'Settings': ['GeneralSettings', 'PrivacySettings', 'NotificationSettings', 'LanguageSelector'],
  };
  
  const components = componentMap[tabName] || [];
  
  // Simulate component verification
  return components.map(component => ({
    name: component,
    isVisible: true,
    isInteractive: true,
    hasErrors: false
  }));
}

/**
 * Verify API integrations required for the specified tab
 */
async function verifyApiIntegrations(tabName: string): Promise<ApiStatus[]> {
  // Define which APIs are required for each tab
  const apiRequirements: Record<string, string[]> = {
    'Explore': ['Google Maps', 'Gemini AI', 'TripAdvisor', 'Firebase'],
    'Itineraries': ['Google Maps', 'Gemini AI', 'Amadeus', 'Firebase'],
    'Bookings': ['Amadeus', 'RapidAPI', 'Firebase'],
    'Profile': ['Firebase', 'Stripe'],
    'Settings': ['Firebase'],
  };
  
  const requiredApis = apiRequirements[tabName] || [];
  
  try {
    // This would actually check API connectivity in a real implementation
    // For demo purposes, we'll use our checkApiStatus function
    const apiStatuses = await Promise.all(
      requiredApis.map(async (api) => {
        try {
          return await checkApiStatus(api);
        } catch (error) {
          console.error(`Error checking API status for ${api}:`, error);
          return { name: api, status: 'unknown', message: 'Error checking status' };
        }
      })
    );
    
    return apiStatuses;
  } catch (error) {
    console.error('Error verifying API integrations:', error);
    return requiredApis.map(api => ({ 
      name: api, 
      status: 'unknown',
      message: 'Error occurred during API verification' 
    }));
  }
}

/**
 * Verify chatbot integration and functionality
 */
async function verifyChatbotIntegration(tabName: string): Promise<ComponentStatus> {
  // Simulate chatbot verification
  // In a real app, this would check if the chat component is rendered and functional
  const chatEnabledTabs = ['Explore', 'Itineraries', 'Chat'];
  
  const isEnabled = chatEnabledTabs.includes(tabName);
  
  return {
    name: 'Chatbot',
    isVisible: isEnabled,
    isInteractive: isEnabled,
    hasErrors: false
  };
}

/**
 * Format audit results as a JSON string for display
 */
export function formatAuditResults(results: TabAuditResult): string {
  return JSON.stringify(results, null, 2);
}