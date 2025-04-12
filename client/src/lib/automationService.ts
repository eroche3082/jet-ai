/**
 * JetAI Automation Service
 * Phase 4: Automation & Predictive Intelligence
 * 
 * Central service for managing all Phase 4 automation features
 * and coordinating between different predictive subsystems
 */

import { 
  initializeSmartAutomation,
  trackUserBehavior,
  getActiveSuggestions,
  generatePersonalizedSuggestions,
  scheduleAutomation,
  registerDataTrigger,
  dismissSuggestion,
  executeSuggestionAction,
  SmartSuggestion
} from './smartAutomation';

import {
  generateAllInsights,
  generateSpendingInsights,
  generateDestinationInsights,
  generateWeatherInsights,
  markInsightAsRead,
  getActiveInsights,
  AIInsight
} from './aiInsights';

import {
  initializeMemoryContext,
  getMemoryContext,
  resetMemoryContext,
  updateCurrentTab,
  addRecentSearch,
  addRecentDestination,
  updateActiveItinerary,
  processMessage,
  subscribeToMemoryUpdates,
  setConversationFocus
} from './conversationalContext';

import {
  getCurrentTimeOfDay,
  formatDate,
  formatTime,
  daysUntil,
  getDateRangeDescription,
  getRelativeTimeDescription
} from './dateUtils';

import { 
  UserProfile, 
  UserPreferences, 
  Expense, 
  Itinerary,
  TravelDestination,
  WeatherInfo,
  ChatMessage,
  MemoryContext
} from '@/types';

// Global state for whether Phase 4 is initialized
let isPhase4Initialized = false;

// Event names for pub/sub system
export const AUTOMATION_EVENTS = {
  NEW_SUGGESTION: 'jetai:new-suggestion',
  NEW_INSIGHT: 'jetai:new-insight',
  MEMORY_UPDATED: 'jetai:memory-updated',
  PHASE4_INITIALIZED: 'jetai:phase4-initialized',
  PHASE4_STATUS_CHANGED: 'jetai:phase4-status-changed'
};

// Phase 4 subsystem status tracking
type SubsystemStatus = 'active' | 'inactive' | 'error';

interface Phase4Status {
  isInitialized: boolean;
  smartSuggestions: SubsystemStatus;
  scheduledAutomation: SubsystemStatus;
  predictiveAnalytics: SubsystemStatus;
  dataTriggers: SubsystemStatus;
  memorySync: SubsystemStatus;
  lastUpdated: Date;
}

// Default system status
const defaultStatus: Phase4Status = {
  isInitialized: false,
  smartSuggestions: 'inactive',
  scheduledAutomation: 'inactive',
  predictiveAnalytics: 'inactive',
  dataTriggers: 'inactive',
  memorySync: 'inactive',
  lastUpdated: new Date()
};

// Current system status
let systemStatus: Phase4Status = { ...defaultStatus };

/**
 * Initialize Phase 4 features with user data
 */
export function initializePhase4(
  userProfile?: UserProfile,
  preferences?: UserPreferences
): Phase4Status {
  console.log('🚀 Initializing Phase 4: Automation & Predictive Intelligence');
  
  try {
    // Initialize smart automation system
    initializeSmartAutomation(userProfile, preferences);
    systemStatus.smartSuggestions = 'active';
    
    // Initialize memory context
    const userId = userProfile?.id || '';
    initializeMemoryContext(userId);
    systemStatus.memorySync = 'active';
    
    // Set up scheduled suggestions based on time of day
    const timeOfDay = getCurrentTimeOfDay();
    setupTimeBasedSuggestions(timeOfDay);
    systemStatus.scheduledAutomation = 'active';
    
    // Set up data triggers for weather and budget alerts
    setupDataTriggers();
    systemStatus.dataTriggers = 'active';
    
    // Initialize predictive analytics
    setupPredictiveAnalytics();
    systemStatus.predictiveAnalytics = 'active';
    
    // Update overall status
    systemStatus.isInitialized = true;
    systemStatus.lastUpdated = new Date();
    isPhase4Initialized = true;
    
    // Dispatch initialization event
    window.dispatchEvent(new CustomEvent(AUTOMATION_EVENTS.PHASE4_INITIALIZED, {
      detail: { status: systemStatus }
    }));
    
    // Dispatch status change event
    dispatchStatusChangeEvent();
    
    console.log('✅ Phase 4 initialization complete');
  } catch (error) {
    console.error('❌ Error initializing Phase 4:', error);
    
    // Update status with errors
    systemStatus.isInitialized = false;
    systemStatus.lastUpdated = new Date();
    
    // Dispatch status change event
    dispatchStatusChangeEvent();
  }
  
  return systemStatus;
}

/**
 * Track user activity for improving predictions
 */
export function trackActivity(
  tabVisit: string,
  searchTerm?: string,
  destination?: TravelDestination,
  spendAmount?: number,
  spendCategory?: string
): void {
  if (!isPhase4Initialized) return;
  
  // Track in smart automation system
  trackUserBehavior(tabVisit, searchTerm, destination, spendAmount, spendCategory);
  
  // Update memory context
  updateCurrentTab(tabVisit);
  
  if (searchTerm) {
    addRecentSearch(searchTerm);
  }
  
  if (destination) {
    addRecentDestination(destination);
  }
}

/**
 * Process user message to update context
 */
export function processUserMessage(message: ChatMessage): void {
  if (!isPhase4Initialized) return;
  
  // Update conversational context
  processMessage(message);
  
  // Generate new suggestions based on the message content
  const currentTab = getMemoryContext().currentTab;
  const newSuggestions = generatePersonalizedSuggestions(currentTab);
  
  // Dispatch events for new suggestions
  newSuggestions.forEach(suggestion => {
    window.dispatchEvent(new CustomEvent(AUTOMATION_EVENTS.NEW_SUGGESTION, {
      detail: { suggestion }
    }));
  });
}

/**
 * Generate insights based on user data
 */
export function generateInsights(
  expenses: Expense[] = [],
  itineraries: Itinerary[] = [],
  interests: string[] = [],
  pastDestinations: TravelDestination[] = [],
  weatherInfo: WeatherInfo[] = [],
  budget?: number
): AIInsight[] {
  if (!isPhase4Initialized) return [];
  
  const insights = generateAllInsights(
    expenses,
    itineraries,
    interests,
    pastDestinations,
    weatherInfo,
    budget
  );
  
  // Dispatch events for new insights
  insights.forEach(insight => {
    if (!insight.isRead) {
      window.dispatchEvent(new CustomEvent(AUTOMATION_EVENTS.NEW_INSIGHT, {
        detail: { insight }
      }));
    }
  });
  
  return insights;
}

/**
 * Set up time-based suggestions based on time of day
 */
function setupTimeBasedSuggestions(timeOfDay: TimeOfDay): void {
  // Morning suggestions
  if (timeOfDay === 'morning') {
    scheduleAutomation(
      new Date(Date.now() + 2 * 60 * 1000), // 2 minutes from now
      "Good morning! Would you like to check today's weather for your destinations?",
      'tools'
    );
  }
  
  // Afternoon suggestions
  if (timeOfDay === 'afternoon') {
    scheduleAutomation(
      new Date(Date.now() + 3 * 60 * 1000), // 3 minutes from now
      "Good afternoon! How about checking your travel itinerary for today?",
      'itinerary'
    );
  }
  
  // Evening suggestions
  if (timeOfDay === 'evening') {
    scheduleAutomation(
      new Date(Date.now() + 4 * 60 * 1000), // 4 minutes from now
      "Good evening! Would you like to review your travel expenses for today?",
      'travel-wallet'
    );
  }
}

/**
 * Set up data triggers for external events
 */
function setupDataTriggers(): void {
  // Weather alert triggers
  registerDataTrigger(
    'weather',
    (data: any) => data.condition?.toLowerCase().includes('rain') && data.precipitationChance > 0.7,
    "Weather alert: High chance of rain at your destination. Would you like to see indoor activities?",
    'high'
  );
  
  // Budget alert triggers
  registerDataTrigger(
    'budget',
    (data: any) => data.remaining && data.remaining < (data.total * 0.2),
    "Budget alert: You've used 80% of your travel budget. Would you like to see budget-friendly options?",
    'high'
  );
  
  // Flight status triggers
  registerDataTrigger(
    'flight',
    (data: any) => data.status === 'delayed',
    "Flight alert: Your flight appears to be delayed. Would you like to check alternative options?",
    'high'
  );
}

/**
 * Set up predictive analytics system
 */
function setupPredictiveAnalytics(): void {
  // Scheduled analytics generation
  setInterval(() => {
    const memoryContext = getMemoryContext();
    const currentTab = memoryContext.currentTab;
    
    // Generate new personalized suggestions
    const suggestions = generatePersonalizedSuggestions(currentTab);
    
    // Dispatch events for new suggestions
    suggestions.forEach(suggestion => {
      window.dispatchEvent(new CustomEvent(AUTOMATION_EVENTS.NEW_SUGGESTION, {
        detail: { suggestion }
      }));
    });
  }, 10 * 60 * 1000); // Every 10 minutes
}

/**
 * Dispatch system status change event
 */
function dispatchStatusChangeEvent(): void {
  window.dispatchEvent(new CustomEvent(AUTOMATION_EVENTS.PHASE4_STATUS_CHANGED, {
    detail: { status: systemStatus }
  }));
}

/**
 * Get current Phase 4 system status
 */
export function getPhase4Status(): Phase4Status {
  return { ...systemStatus };
}

/**
 * Check if Phase 4 is initialized
 */
export function isPhase4Active(): boolean {
  return isPhase4Initialized;
}

/**
 * Reset Phase 4 system (for debugging or testing)
 */
export function resetPhase4(): void {
  // Reset memory context
  resetMemoryContext();
  
  // Reset system status
  systemStatus = { ...defaultStatus };
  systemStatus.lastUpdated = new Date();
  isPhase4Initialized = false;
  
  // Dispatch status change event
  dispatchStatusChangeEvent();
  
  console.log('Phase 4 system reset');
}

/**
 * Subscribe to Phase 4 status changes
 */
export function subscribeToPhase4Status(
  callback: (status: Phase4Status) => void
): () => void {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent;
    if (customEvent.detail && customEvent.detail.status) {
      callback(customEvent.detail.status);
    }
  };
  
  window.addEventListener(AUTOMATION_EVENTS.PHASE4_STATUS_CHANGED, handler as EventListener);
  
  // Initial callback with current status
  callback(systemStatus);
  
  // Return unsubscribe function
  return () => {
    window.removeEventListener(AUTOMATION_EVENTS.PHASE4_STATUS_CHANGED, handler as EventListener);
  };
}

// Export all sub-system functions for direct access
export {
  // Smart Suggestions
  getActiveSuggestions,
  dismissSuggestion,
  executeSuggestionAction,
  
  // AI Insights
  getActiveInsights,
  markInsightAsRead,
  
  // Memory Context
  getMemoryContext,
  updateCurrentTab,
  addRecentSearch,
  addRecentDestination,
  updateActiveItinerary,
  subscribeToMemoryUpdates,
  setConversationFocus,
  
  // Date Utilities
  getCurrentTimeOfDay,
  formatDate,
  formatTime,
  daysUntil,
  getDateRangeDescription,
  getRelativeTimeDescription
};