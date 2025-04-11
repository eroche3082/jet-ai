/**
 * Tipos para el manejo de conversaciones en JetAI
 */

/**
 * Estructura de la memoria de conversación
 */
export interface ConversationMemory {
  destination: string;
  budget: string;
  dates: string;
  travelers: string;
  interests: string[];
  currentQuestion: 'greeting' | 'destination' | 'budget' | 'dates' | 'travelers' | 'interests' | 'summary';
  conversationStarted: boolean;
}

/**
 * Estructura de una sugerencia contextual
 */
export interface ChatSuggestion {
  text: string;
  type: 'destination' | 'activity' | 'accommodation' | 'budget' | 'date' | 'general';
  metadata?: Record<string, any>;
}

/**
 * Estructura de la respuesta del chat
 */
export interface ChatResponse {
  message: string;
  memory?: ConversationMemory;
  suggestions?: string[] | ChatSuggestion[];
  destinations?: {
    id: string;
    name: string;
    country: string;
    description: string;
    imageUrl: string;
    rating: number;
  }[];
  itinerary?: {
    days: {
      day: number;
      activities: {
        time: string;
        title: string;
        description: string;
        location?: string;
      }[];
    }[];
  };
  enhancedData?: {
    weather?: any;
    route?: any;
    location?: any;
  };
}