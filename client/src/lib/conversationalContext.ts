/**
 * JetAI Conversational Context Manager
 * Phase 4: Automation & Predictive Intelligence
 * 
 * This module implements a memory and context system for maintaining
 * conversational state across tab switches and user sessions
 */

import { MemoryContext, TravelDestination, ChatMessage } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Memory storage key in localStorage
const MEMORY_STORAGE_KEY = 'jetai_memory_context';

// Default memory context
const DEFAULT_MEMORY_CONTEXT: MemoryContext = {
  userId: '',
  sessionId: '',
  currentTab: 'chat',
  recentSearches: [],
  recentDestinations: [],
  detectedIntents: [],
  lastUpdateTime: new Date(),
  customValues: {}
};

// Maximum items to store in various context collections
const MEMORY_LIMITS = {
  recentSearches: 10,
  recentDestinations: 5,
  detectedIntents: 15,
  conversationTurns: 20 // For conversation history
};

// Intent detection patterns (simplified - in a real app, use NLP)
const INTENT_PATTERNS: Record<string, RegExp[]> = {
  'search_flights': [
    /\b(?:find|search|look\s+for|get|book)\s+(?:a\s+)?(?:flights?|planes?)\b/i,
    /\bfly(?:ing)?\s+(?:to|from|between)\b/i
  ],
  'search_hotels': [
    /\b(?:find|search|look\s+for|get|book)\s+(?:a\s+)?(?:hotels?|accommodations?|rooms?|places?\s+to\s+stay)\b/i
  ],
  'check_weather': [
    /\b(?:what'?s\s+the\s+)?weather\b/i,
    /\b(?:temperature|forecast|rain|sunny|cloudy)\b/i
  ],
  'budget_inquiry': [
    /\b(?:budget|cost|price|expensive|cheap|spending|money)\b/i
  ],
  'itinerary_request': [
    /\b(?:itinerary|schedule|plan|agenda|activities)\b/i
  ],
  'transport_options': [
    /\b(?:transport|taxi|uber|bus|train|subway|metro|car\s+rental)\b/i
  ],
  'food_recommendations': [
    /\b(?:food|restaurant|eat|dinner|lunch|breakfast|cuisine|dining)\b/i
  ],
  'attraction_inquiry': [
    /\b(?:attractions?|landmarks?|museums?|things\s+to\s+do|places\s+to\s+visit|sights?|sightseeing)\b/i
  ],
  'translation_request': [
    /\b(?:translate|translation|language|say\s+in|speak\s+in)\b/i
  ]
};

// Singleton instance
let memoryContext: MemoryContext | null = null;

/**
 * Initialize the memory context system
 */
export function initializeMemoryContext(userId: string = ''): MemoryContext {
  // Generate a unique session ID
  const sessionId = uuidv4();
  
  // Try to load existing memory from localStorage
  try {
    const savedMemory = localStorage.getItem(MEMORY_STORAGE_KEY);
    if (savedMemory) {
      const parsed = JSON.parse(savedMemory);
      
      // Convert date strings back to Date objects
      const restored = {
        ...parsed,
        lastUpdateTime: new Date(parsed.lastUpdateTime)
      };
      
      // If the user ID matches, use the saved memory
      if (userId && restored.userId === userId) {
        // Update the session ID to the new one
        restored.sessionId = sessionId;
        memoryContext = restored;
        return memoryContext;
      }
    }
  } catch (error) {
    console.error('Error loading memory context:', error);
  }
  
  // If we couldn't load a saved context or the user ID doesn't match,
  // create a new context
  memoryContext = {
    ...DEFAULT_MEMORY_CONTEXT,
    userId,
    sessionId,
    lastUpdateTime: new Date()
  };
  
  // Save it to localStorage
  saveMemoryContext();
  
  return memoryContext;
}

/**
 * Save the current memory context to localStorage
 */
function saveMemoryContext(): void {
  if (!memoryContext) return;
  
  try {
    // Update the last update time
    memoryContext.lastUpdateTime = new Date();
    
    // Serialize and save
    localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(memoryContext));
  } catch (error) {
    console.error('Error saving memory context:', error);
  }
}

/**
 * Get the current memory context
 */
export function getMemoryContext(): MemoryContext {
  if (!memoryContext) {
    return initializeMemoryContext();
  }
  return memoryContext;
}

/**
 * Reset the memory context
 */
export function resetMemoryContext(): void {
  const userId = memoryContext?.userId || '';
  memoryContext = initializeMemoryContext(userId);
}

/**
 * Update current active tab
 */
export function updateCurrentTab(tabName: string): void {
  if (!memoryContext) initializeMemoryContext();
  if (memoryContext) {
    memoryContext.currentTab = tabName;
    saveMemoryContext();
  }
}

/**
 * Add a search term to recent searches
 */
export function addRecentSearch(searchTerm: string): void {
  if (!memoryContext) initializeMemoryContext();
  if (!memoryContext || !searchTerm.trim()) return;
  
  // Remove the term if it already exists to avoid duplicates
  memoryContext.recentSearches = memoryContext.recentSearches.filter(
    s => s.toLowerCase() !== searchTerm.toLowerCase()
  );
  
  // Add the new term at the beginning
  memoryContext.recentSearches.unshift(searchTerm);
  
  // Trim the list if needed
  if (memoryContext.recentSearches.length > MEMORY_LIMITS.recentSearches) {
    memoryContext.recentSearches = memoryContext.recentSearches.slice(
      0, MEMORY_LIMITS.recentSearches
    );
  }
  
  saveMemoryContext();
}

/**
 * Add a destination to recent destinations
 */
export function addRecentDestination(destination: TravelDestination): void {
  if (!memoryContext) initializeMemoryContext();
  if (!memoryContext || !destination) return;
  
  // Remove the destination if it already exists to avoid duplicates
  memoryContext.recentDestinations = memoryContext.recentDestinations.filter(
    d => d.id !== destination.id
  );
  
  // Add the new destination at the beginning
  memoryContext.recentDestinations.unshift(destination);
  
  // Trim the list if needed
  if (memoryContext.recentDestinations.length > MEMORY_LIMITS.recentDestinations) {
    memoryContext.recentDestinations = memoryContext.recentDestinations.slice(
      0, MEMORY_LIMITS.recentDestinations
    );
  }
  
  saveMemoryContext();
}

/**
 * Update active itinerary ID
 */
export function updateActiveItinerary(itineraryId?: string): void {
  if (!memoryContext) initializeMemoryContext();
  if (memoryContext) {
    memoryContext.activeItineraryId = itineraryId;
    saveMemoryContext();
  }
}

/**
 * Detect user intents from message content
 */
export function detectIntents(message: string): string[] {
  const detectedIntents: string[] = [];
  
  // Check each intent pattern
  Object.entries(INTENT_PATTERNS).forEach(([intent, patterns]) => {
    for (const pattern of patterns) {
      if (pattern.test(message)) {
        detectedIntents.push(intent);
        break; // Only add each intent once
      }
    }
  });
  
  // If any intents were detected, add them to the memory
  if (detectedIntents.length > 0) {
    addDetectedIntents(detectedIntents);
  }
  
  return detectedIntents;
}

/**
 * Add detected intents to memory
 */
function addDetectedIntents(intents: string[]): void {
  if (!memoryContext) initializeMemoryContext();
  if (!memoryContext || !intents.length) return;
  
  // Add new intents to the beginning of the list
  const uniqueIntents = intents.filter(
    i => !memoryContext?.detectedIntents.includes(i)
  );
  
  if (uniqueIntents.length > 0) {
    memoryContext.detectedIntents = [
      ...uniqueIntents,
      ...memoryContext.detectedIntents
    ];
    
    // Trim the list if needed
    if (memoryContext.detectedIntents.length > MEMORY_LIMITS.detectedIntents) {
      memoryContext.detectedIntents = memoryContext.detectedIntents.slice(
        0, MEMORY_LIMITS.detectedIntents
      );
    }
    
    saveMemoryContext();
  }
}

/**
 * Focus conversation on a specific topic
 */
export function setConversationFocus(focus?: string): void {
  if (!memoryContext) initializeMemoryContext();
  if (memoryContext) {
    memoryContext.conversationFocus = focus;
    saveMemoryContext();
  }
}

/**
 * Set a custom memory value
 */
export function setCustomMemoryValue(key: string, value: any): void {
  if (!memoryContext) initializeMemoryContext();
  if (memoryContext && key) {
    memoryContext.customValues[key] = value;
    saveMemoryContext();
  }
}

/**
 * Get a custom memory value
 */
export function getCustomMemoryValue(key: string): any {
  if (!memoryContext) initializeMemoryContext();
  if (memoryContext && key && key in memoryContext.customValues) {
    return memoryContext.customValues[key];
  }
  return undefined;
}

/**
 * Process a new message to update context
 */
export function processMessage(message: ChatMessage): void {
  if (message.role === 'user') {
    // Detect intents in user messages
    detectIntents(message.content);
  }
}

/**
 * Synchronize memory between tabs
 */
export function setupCrossTabSync(): void {
  window.addEventListener('storage', (event) => {
    if (event.key === MEMORY_STORAGE_KEY && event.newValue) {
      try {
        const newContext = JSON.parse(event.newValue);
        
        // Only update if the user is the same
        if (memoryContext && newContext.userId === memoryContext.userId) {
          // Preserve our current session ID
          const sessionId = memoryContext.sessionId;
          
          // Update our context with the new values
          memoryContext = {
            ...newContext,
            sessionId,
            lastUpdateTime: new Date(newContext.lastUpdateTime)
          };
          
          // Dispatch an event so components can react to memory changes
          window.dispatchEvent(new CustomEvent('jetai:memory-updated', {
            detail: { memoryContext }
          }));
        }
      } catch (error) {
        console.error('Error processing cross-tab memory sync:', error);
      }
    }
  });
}

/**
 * Subscribe to memory updates
 */
export function subscribeToMemoryUpdates(
  callback: (context: MemoryContext) => void
): () => void {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent;
    if (customEvent.detail && customEvent.detail.memoryContext) {
      callback(customEvent.detail.memoryContext);
    }
  };
  
  window.addEventListener('jetai:memory-updated', handler as EventListener);
  
  // Return unsubscribe function
  return () => {
    window.removeEventListener('jetai:memory-updated', handler as EventListener);
  };
}

// Initialize cross-tab synchronization
setupCrossTabSync();