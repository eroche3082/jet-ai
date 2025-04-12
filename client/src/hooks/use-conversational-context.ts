import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import {
  ConversationMemory,
  TabAction,
  ChatFlow,
  matchTriggerPhrases,
  findMatchingFlow,
  getTabContextPrompt,
  getCurrentFlowStep,
  processStepResponse,
  startConversationFlow,
  loadConversationMemory,
  saveConversationMemory,
  updateActiveTab,
  saveChatMessage
} from '@/lib/conversationalContext';
import { useAuth } from '@/hooks/use-auth';

// Infer the current tab from the location path
function inferCurrentTab(path: string): string {
  // Remove leading slashes and get the first segment
  const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
  const segments = normalizedPath.split('/');
  
  if (segments.length === 0 || segments[0] === '') {
    return 'dashboard'; // Default to dashboard for root path
  }
  
  // Map path segments to tab names if needed
  const pathToTabMap: Record<string, string> = {
    '': 'dashboard',
    'dashboard': 'dashboard',
    'explore': 'explore',
    'profile': 'profile',
    'wallet': 'travel-wallet',
    'bookings': 'bookings',
    'itineraries': 'itineraries',
    'chat': 'chat',
    'tools': 'tools',
    'settings': 'settings'
  };
  
  return pathToTabMap[segments[0]] || segments[0];
}

interface UseConversationalContextProps {
  initialTab?: string;
}

interface UseConversationalContextReturn {
  activeTab: string;
  contextPrompt: string;
  isInFlow: boolean;
  currentFlowName: string | null;
  handleMessage: (message: string) => Promise<{
    responseText: string;
    action?: any;
  }>;
  resetFlow: () => void;
}

export function useConversationalContext({
  initialTab
}: UseConversationalContextProps = {}): UseConversationalContextReturn {
  const [location] = useLocation();
  const { user } = useAuth();
  const [memory, setMemory] = useState<ConversationMemory | null>(null);
  const [activeTab, setActiveTab] = useState<string>(initialTab || inferCurrentTab(location));
  const [contextPrompt, setContextPrompt] = useState<string>(getTabContextPrompt(activeTab));
  
  // Load memory on initial render and when user changes
  useEffect(() => {
    if (user) {
      loadConversationMemory(user.id.toString())
        .then(loadedMemory => {
          setMemory(loadedMemory);
        });
    }
  }, [user]);
  
  // Update active tab when location changes
  useEffect(() => {
    const currentTab = inferCurrentTab(location);
    setActiveTab(currentTab);
    setContextPrompt(getTabContextPrompt(currentTab));
    
    if (user) {
      updateActiveTab(user.id.toString(), currentTab);
    }
  }, [location, user]);
  
  // Save memory changes to Firebase
  useEffect(() => {
    if (user && memory) {
      saveConversationMemory(user.id.toString(), memory);
    }
  }, [memory, user]);
  
  // Handle user messages
  const handleMessage = useCallback(async (message: string): Promise<{
    responseText: string;
    action?: any;
  }> => {
    if (!memory) {
      return { responseText: "I'm still getting ready. Please try again in a moment." };
    }
    
    // If we're in a flow, process the response for the current step
    if (memory.activeFlow && memory.currentStepId) {
      const { memory: updatedMemory, nextQuestion, action } = processStepResponse(
        memory,
        message
      );
      
      setMemory(updatedMemory);
      
      if (user) {
        saveChatMessage(user.id.toString(), message, 'user', {
          tab: activeTab,
          flow: memory.activeFlow,
          stepId: memory.currentStepId
        });
        
        if (nextQuestion) {
          saveChatMessage(user.id.toString(), nextQuestion, 'assistant', {
            tab: activeTab,
            flow: updatedMemory.activeFlow,
            stepId: updatedMemory.currentStepId
          });
        }
      }
      
      return {
        responseText: nextQuestion || "Great! I've saved your preferences. Is there anything else you'd like help with?",
        action
      };
    }
    
    // Check if the message matches an action trigger
    const matchedAction = matchTriggerPhrases(message, activeTab);
    if (matchedAction) {
      try {
        const actionResult = await matchedAction.handler({ message });
        
        if (user) {
          saveChatMessage(user.id.toString(), message, 'user', {
            tab: activeTab,
            actionPerformed: matchedAction.id
          });
        }
        
        return {
          responseText: `I'll ${matchedAction.description.toLowerCase()} for you.`,
          action: actionResult
        };
      } catch (error) {
        console.error('Error executing action:', error);
        return { responseText: "I'm sorry, I couldn't complete that action right now." };
      }
    }
    
    // Check if the message should start a new flow
    const matchedFlow = findMatchingFlow(message, activeTab);
    if (matchedFlow) {
      const { memory: updatedMemory, firstQuestion } = startConversationFlow(
        memory,
        matchedFlow
      );
      
      setMemory(updatedMemory);
      
      if (user) {
        saveChatMessage(user.id.toString(), message, 'user', {
          tab: activeTab
        });
        
        saveChatMessage(user.id.toString(), firstQuestion, 'assistant', {
          tab: activeTab,
          flow: updatedMemory.activeFlow,
          stepId: updatedMemory.currentStepId
        });
      }
      
      return { responseText: firstQuestion };
    }
    
    // If no specific handling, return null to let the AI handle it normally
    if (user) {
      saveChatMessage(user.id.toString(), message, 'user', {
        tab: activeTab
      });
    }
    
    return { responseText: "" };
  }, [memory, activeTab, user]);
  
  // Reset the current flow
  const resetFlow = useCallback(() => {
    if (!memory) return;
    
    setMemory({
      ...memory,
      activeFlow: null,
      currentStepId: null
    });
  }, [memory]);
  
  return {
    activeTab,
    contextPrompt,
    isInFlow: !!(memory?.activeFlow && memory?.currentStepId),
    currentFlowName: memory?.activeFlow || null,
    handleMessage,
    resetFlow
  };
}