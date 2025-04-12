import { firestore } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';

// Types for the conversational context system
export interface ChatFlow {
  id: string;
  tab: string;
  name: string;
  steps: ChatFlowStep[];
  triggers: string[];
  completed?: boolean;
}

export interface ChatFlowStep {
  id: string;
  question: string;
  responseType: 'text' | 'selection' | 'yesno' | 'numeric' | 'date' | 'location';
  options?: string[];
  nextStepId?: string;
  actionType?: 'save' | 'api' | 'redirect' | 'display';
  actionParams?: Record<string, any>;
}

export interface ChatAction {
  type: string;
  params: Record<string, any>;
  tab: string;
  trigger: string;
}

export interface ConversationMemory {
  activeTab: string | null;
  activeFlow: string | null;
  currentStepId: string | null;
  flowResponses: Record<string, any>;
  flowHistory: string[];
  tabContext: Record<string, any>;
}

// TabActionsMap defines the actions available per tab
export interface TabAction {
  id: string;
  trigger: string;
  description: string;
  handler: (params: any) => Promise<any>;
}

// Initial state for a new conversation
const initialConversationMemory: ConversationMemory = {
  activeTab: null,
  activeFlow: null,
  currentStepId: null,
  flowResponses: {},
  flowHistory: [],
  tabContext: {}
};

// Collection of chat flows organized by tab
const chatFlows: Record<string, ChatFlow[]> = {
  dashboard: [
    {
      id: 'travel-planning-flow',
      tab: 'dashboard',
      name: 'Travel Planning Flow',
      triggers: ['plan a trip', 'create trip', 'new journey', 'travel to'],
      steps: [
        {
          id: 'tp-step-1',
          question: 'Great! Let\'s plan your trip. Where would you like to go?',
          responseType: 'location',
          nextStepId: 'tp-step-2'
        },
        {
          id: 'tp-step-2',
          question: 'When are you planning to visit {location}?',
          responseType: 'date',
          nextStepId: 'tp-step-3'
        },
        {
          id: 'tp-step-3',
          question: 'How long will you be staying in {location}?',
          responseType: 'numeric',
          nextStepId: 'tp-step-4'
        },
        {
          id: 'tp-step-4',
          question: 'What\'s your budget for this trip to {location}?',
          responseType: 'numeric',
          nextStepId: 'tp-step-5'
        },
        {
          id: 'tp-step-5',
          question: 'Would you like me to create an itinerary for your {duration} days in {location}?',
          responseType: 'yesno',
          actionType: 'redirect',
          actionParams: { tab: 'itineraries', action: 'create', prepopulate: true }
        }
      ]
    }
  ],
  explore: [
    {
      id: 'destination-discovery-flow',
      tab: 'explore',
      name: 'Destination Discovery Flow',
      triggers: ['find destinations', 'where should I go', 'recommend places', 'discover locations'],
      steps: [
        {
          id: 'dd-step-1',
          question: 'I'd love to help you discover destinations. What type of experience are you looking for? (e.g., beach, mountains, city, cultural)',
          responseType: 'text',
          nextStepId: 'dd-step-2'
        },
        {
          id: 'dd-step-2',
          question: 'What's your rough budget for this trip? (low, medium, high)',
          responseType: 'selection',
          options: ['Low - under $1,000', 'Medium - $1,000 to $3,000', 'High - over $3,000'],
          nextStepId: 'dd-step-3'
        },
        {
          id: 'dd-step-3',
          question: 'When are you planning to travel?',
          responseType: 'date',
          nextStepId: 'dd-step-4'
        },
        {
          id: 'dd-step-4',
          question: 'How long would you like to travel for?',
          responseType: 'numeric',
          nextStepId: 'dd-step-5'
        },
        {
          id: 'dd-step-5',
          question: 'Are you interested in popular tourist destinations or off-the-beaten-path locations?',
          responseType: 'selection',
          options: ['Popular destinations', 'Off-the-beaten-path', 'Mix of both'],
          actionType: 'display',
          actionParams: { component: 'destination-recommendations' }
        }
      ]
    }
  ],
  profile: [
    {
      id: 'preferences-setup-flow',
      tab: 'profile',
      name: 'Travel Preferences Setup Flow',
      triggers: ['update preferences', 'set my travel style', 'travel preferences', 'my profile'],
      steps: [
        {
          id: 'ps-step-1',
          question: 'Let's update your travel preferences. What type of traveler are you?',
          responseType: 'selection',
          options: ['Budget Explorer', 'Comfort Seeker', 'Luxury Traveler', 'Adventure Enthusiast', 'Cultural Immersion'],
          nextStepId: 'ps-step-2'
        },
        {
          id: 'ps-step-2',
          question: 'What types of accommodation do you prefer?',
          responseType: 'selection',
          options: ['Hostels', 'Budget Hotels', 'Mid-range Hotels', 'Luxury Hotels', 'Vacation Rentals', 'Resorts', 'All-Inclusive'],
          nextStepId: 'ps-step-3'
        },
        {
          id: 'ps-step-3',
          question: 'What interests you most when traveling? Select all that apply.',
          responseType: 'selection',
          options: ['History & Culture', 'Food & Cuisine', 'Nature & Outdoors', 'Adventure Activities', 'Relaxation', 'Nightlife', 'Shopping'],
          nextStepId: 'ps-step-4'
        },
        {
          id: 'ps-step-4',
          question: 'Do you have any dietary restrictions I should know about?',
          responseType: 'selection',
          options: ['None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Kosher', 'Halal', 'Other'],
          nextStepId: 'ps-step-5'
        },
        {
          id: 'ps-step-5',
          question: 'What languages do you speak?',
          responseType: 'text',
          actionType: 'save',
          actionParams: { collection: 'userPreferences' }
        }
      ]
    }
  ],
  // Additional flows for other tabs would be defined here
};

// TabActionsMap defines the actions available per tab
interface TabAction {
  id: string;
  trigger: string;
  description: string;
  handler: (params: any) => Promise<any>;
}

// These would be implemented in the actual application
const mockActionHandler = async (params: any) => {
  console.log('Action executed:', params);
  return { success: true, data: {} };
};

// Map of available actions per tab
const tabActionsMap: Record<string, TabAction[]> = {
  dashboard: [
    {
      id: 'show-upcoming-trips',
      trigger: 'show my upcoming trips',
      description: 'Display countdown timer for next trip',
      handler: mockActionHandler
    },
    {
      id: 'update-weather',
      trigger: 'update weather forecast',
      description: 'Show weather forecast for saved destinations',
      handler: mockActionHandler
    },
    {
      id: 'create-new-trip',
      trigger: 'create a new trip',
      description: 'Start trip creation flow',
      handler: mockActionHandler
    },
    {
      id: 'check-flight-status',
      trigger: 'check flight status',
      description: 'Show status of booked flights',
      handler: mockActionHandler
    }
  ],
  // Other tab actions would be defined similarly
};

/**
 * Check if a user message matches any trigger phrases for available actions
 */
export function matchTriggerPhrases(message: string, currentTab: string): TabAction | null {
  const normalizedMessage = message.toLowerCase().trim();
  
  const actions = tabActionsMap[currentTab] || [];
  
  for (const action of actions) {
    if (normalizedMessage.includes(action.trigger)) {
      return action;
    }
  }
  
  return null;
}

/**
 * Find a conversation flow by matching trigger phrases
 */
export function findMatchingFlow(message: string, currentTab: string): ChatFlow | null {
  const normalizedMessage = message.toLowerCase().trim();
  const tabFlows = chatFlows[currentTab] || [];
  
  for (const flow of tabFlows) {
    for (const trigger of flow.triggers) {
      if (normalizedMessage.includes(trigger.toLowerCase())) {
        return flow;
      }
    }
  }
  
  return null;
}

/**
 * Get the current tab context based on the active tab
 */
export function getTabContextPrompt(tab: string): string {
  const contextMap: Record<string, string> = {
    dashboard: "You're viewing the Dashboard where you can see your upcoming trips, weather forecasts, and travel stats. I can help you plan new trips or check details about existing ones.",
    explore: "You're in the Explore section where you can discover new destinations. I can help you find places based on your interests, budget, and travel style.",
    profile: "You're in your Profile section. Here you can update your travel preferences, languages, and dietary restrictions.",
    "travel-wallet": "You're in the Travel Wallet section where you can manage your travel budget and expenses. I can help you track spending, convert currencies, or analyze your expenses.",
    bookings: "You're in the Bookings section where you can manage your flight, hotel, and activity reservations. I can help you find or manage bookings.",
    itineraries: "You're in the Itineraries section where you can create and manage your trip plans. I can help you build day-by-day schedules for your trips.",
    chat: "This is the main Chat interface. I can answer general travel questions or redirect you to specific tools as needed.",
    tools: "You're in the Tools section which offers useful travel utilities like currency conversion, translation, and packing lists.",
    settings: "You're in the Settings section where you can customize your app experience, manage notifications, and control your data."
  };
  
  return contextMap[tab] || "I'm your JetAI travel assistant. How can I help you today?";
}

/**
 * Get the current step in an active flow
 */
export function getCurrentFlowStep(memory: ConversationMemory): ChatFlowStep | null {
  if (!memory.activeFlow || !memory.currentStepId) return null;
  
  const tabFlows = chatFlows[memory.activeTab || ''] || [];
  const activeFlow = tabFlows.find(flow => flow.id === memory.activeFlow);
  
  if (!activeFlow) return null;
  
  return activeFlow.steps.find(step => step.id === memory.currentStepId) || null;
}

/**
 * Process a step response and update the conversation memory
 */
export function processStepResponse(memory: ConversationMemory, response: string): {
  memory: ConversationMemory;
  nextQuestion: string | null;
  action: any | null;
} {
  const currentStep = getCurrentFlowStep(memory);
  if (!currentStep) {
    return { memory, nextQuestion: null, action: null };
  }
  
  // Store the response
  const updatedMemory = {
    ...memory,
    flowResponses: {
      ...memory.flowResponses,
      [currentStep.id]: response
    }
  };
  
  // Check if we should perform an action
  let action = null;
  if (currentStep.actionType && currentStep.actionParams) {
    action = {
      type: currentStep.actionType,
      params: currentStep.actionParams
    };
  }
  
  // Move to next step if available
  let nextQuestion = null;
  if (currentStep.nextStepId) {
    updatedMemory.currentStepId = currentStep.nextStepId;
    
    // Get the next step
    const tabFlows = chatFlows[memory.activeTab || ''] || [];
    const activeFlow = tabFlows.find(flow => flow.id === memory.activeFlow);
    
    if (activeFlow) {
      const nextStep = activeFlow.steps.find(step => step.id === currentStep.nextStepId);
      if (nextStep) {
        // Replace any placeholders in the question with values from responses
        let processedQuestion = nextStep.question;
        for (const [stepId, stepResponse] of Object.entries(updatedMemory.flowResponses)) {
          const step = activeFlow.steps.find(s => s.id === stepId);
          if (step) {
            const placeholder = `{${step.id.split('-').pop()}}`;
            processedQuestion = processedQuestion.replace(placeholder, stepResponse as string);
          }
        }
        nextQuestion = processedQuestion;
      }
    }
  } else {
    // End of flow
    updatedMemory.activeFlow = null;
    updatedMemory.currentStepId = null;
    if (updatedMemory.flowHistory.indexOf(memory.activeFlow as string) === -1) {
      updatedMemory.flowHistory = [...updatedMemory.flowHistory, memory.activeFlow as string];
    }
  }
  
  return { memory: updatedMemory, nextQuestion, action };
}

/**
 * Start a new conversation flow
 */
export function startConversationFlow(memory: ConversationMemory, flow: ChatFlow): {
  memory: ConversationMemory;
  firstQuestion: string;
} {
  const firstStep = flow.steps[0];
  
  const updatedMemory = {
    ...memory,
    activeFlow: flow.id,
    currentStepId: firstStep.id
  };
  
  return {
    memory: updatedMemory,
    firstQuestion: firstStep.question
  };
}

/**
 * Save the conversation memory to Firebase for the user
 */
export async function saveConversationMemory(userId: string, memory: ConversationMemory): Promise<void> {
  try {
    if (!firestore) return;
    
    const userMemoryRef = doc(firestore, 'users', userId, 'conversation', 'memory');
    await setDoc(userMemoryRef, {
      ...memory,
      lastUpdated: serverTimestamp()
    });
  } catch (error) {
    console.error('Error saving conversation memory:', error);
  }
}

/**
 * Load the conversation memory from Firebase for the user
 */
export async function loadConversationMemory(userId: string): Promise<ConversationMemory> {
  try {
    if (!firestore) return initialConversationMemory;
    
    const userMemoryRef = doc(firestore, 'users', userId, 'conversation', 'memory');
    const snapshot = await getDoc(userMemoryRef);
    
    if (snapshot.exists()) {
      return snapshot.data() as ConversationMemory;
    }
    
    return initialConversationMemory;
  } catch (error) {
    console.error('Error loading conversation memory:', error);
    return initialConversationMemory;
  }
}

/**
 * Update the active tab in the conversation memory
 */
export async function updateActiveTab(userId: string, tab: string): Promise<void> {
  try {
    if (!firestore) return;
    
    const userMemoryRef = doc(firestore, 'users', userId, 'conversation', 'memory');
    
    // First check if the document exists
    const snapshot = await getDoc(userMemoryRef);
    
    if (snapshot.exists()) {
      await updateDoc(userMemoryRef, {
        activeTab: tab,
        lastUpdated: serverTimestamp()
      });
    } else {
      await setDoc(userMemoryRef, {
        ...initialConversationMemory,
        activeTab: tab,
        lastUpdated: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error updating active tab:', error);
  }
}

/**
 * Save a chat message to the user's history with context
 */
export async function saveChatMessage(
  userId: string,
  message: string,
  role: 'user' | 'assistant',
  context?: {
    tab?: string;
    flow?: string;
    stepId?: string;
    actionPerformed?: any;
  }
): Promise<void> {
  try {
    if (!firestore) return;
    
    const userChatRef = doc(firestore, 'users', userId, 'conversation', 'history');
    
    await updateDoc(userChatRef, {
      messages: arrayUnion({
        role,
        content: message,
        timestamp: new Date().toISOString(),
        context: context || {}
      })
    });
  } catch (error) {
    console.error('Error saving chat message:', error);
  }
}