/**
 * Type definitions for JetAI application
 */

import { TimeOfDay } from '@/lib/dateUtils';

// User profile data
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatar?: string;
  membershipTier: 'free' | 'premium' | 'business';
  createdAt: Date;
  lastLogin: Date;
}

// User preferences
export interface UserPreferences {
  interests?: string[];
  languages?: string[];
  dietaryRestrictions?: string[];
  mobilityNeeds?: string[];
  budgetPreference?: 'budget' | 'moderate' | 'luxury';
  travelStyle?: 'solo' | 'couple' | 'family' | 'business';
  notificationPreferences: {
    email: boolean;
    push: boolean;
    promotions: boolean;
  };
  currency: string;
  temperatureUnit: 'celsius' | 'fahrenheit';
  distanceUnit: 'km' | 'miles';
}

// Travel destination data
export interface TravelDestination {
  id: string;
  name: string;
  country: string;
  region?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  type: 'city' | 'landmark' | 'country' | 'region';
  description?: string;
  imageUrl?: string;
  tags?: string[];
}

// Message in chat interface
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    tabContext?: string;
    intent?: string;
    entities?: Record<string, any>;
    confidence?: number;
    suggestedActions?: ChatAction[];
  };
}

// Action in chat interface
export interface ChatAction {
  id: string;
  label: string;
  type: 'tab_switch' | 'api_call' | 'form_fill' | 'suggestion_accept' | 'url_open';
  payload: Record<string, any>;
}

// Expense entry for travel wallet
export interface Expense {
  id: string;
  amount: number;
  currency: string;
  category: string;
  description: string;
  date: Date;
  location?: string;
  tripId?: string;
  paymentMethod?: string;
  isReimbursable?: boolean;
  attachmentUrl?: string;
  convertedAmount?: number;
  convertedCurrency?: string;
}

// Trip itinerary
export interface Itinerary {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  destination: TravelDestination;
  activities: ItineraryActivity[];
  accommodation?: Accommodation;
  transportation?: Transportation[];
  notes?: string;
  budget?: {
    total: number;
    spent: number;
    currency: string;
  };
  sharedWith?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Itinerary activity
export interface ItineraryActivity {
  id: string;
  title: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  location?: string;
  description?: string;
  cost?: number;
  currency?: string;
  isBooked?: boolean;
  bookingReference?: string;
  category: 'sightseeing' | 'dining' | 'transport' | 'entertainment' | 'event' | 'other';
}

// Accommodation details
export interface Accommodation {
  id: string;
  name: string;
  type: 'hotel' | 'hostel' | 'apartment' | 'resort' | 'other';
  address: string;
  checkIn: Date;
  checkOut: Date;
  price: number;
  currency: string;
  bookingReference?: string;
  amenities?: string[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  contactInfo?: string;
}

// Transportation details
export interface Transportation {
  id: string;
  type: 'flight' | 'train' | 'bus' | 'car' | 'ferry' | 'other';
  departureLocation: string;
  arrivalLocation: string;
  departureTime: Date;
  arrivalTime: Date;
  provider?: string;
  bookingReference?: string;
  price?: number;
  currency?: string;
  seatInfo?: string;
}

// Weather information
export interface WeatherInfo {
  location: string;
  date: Date;
  condition: string;
  temperature: number;
  temperatureUnit: 'celsius' | 'fahrenheit';
  humidity: number;
  windSpeed: number;
  windUnit: 'kph' | 'mph';
  precipitationChance: number;
  icon: string;
}

// Currency conversion rates
export interface CurrencyRates {
  base: string;
  date: string;
  rates: Record<string, number>;
}

// Language translation result
export interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  detectedLanguage?: string;
}

// App notification
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  isRead: boolean;
  link?: string;
  source: 'system' | 'travel_alert' | 'booking' | 'social' | 'promotion';
}

// Travel safety advisory
export interface SafetyAdvisory {
  countryCode: string;
  country: string;
  advisoryLevel: 'safe' | 'low_risk' | 'medium_risk' | 'high_risk' | 'avoid_travel';
  advisoryText: string;
  lastUpdated: Date;
  source: string;
  details?: {
    crime?: string;
    terrorism?: string;
    healthRisks?: string;
    naturalDisasters?: string;
    localLaws?: string;
  };
}

// Booking preference
export interface BookingPreference {
  id: string;
  userId: string;
  accommodationType: string[];
  roomType: string[];
  mealPlan: string[];
  amenities: string[];
  transportPreference: string[];
  seatPreference: string;
  maxBudgetPerNight: number;
  currency: string;
  priorityFactors: string[];
  savedAt: Date;
}

// Smart automation task
export interface AutomationTask {
  id: string;
  type: 'reminder' | 'alert' | 'sync' | 'backup' | 'notification';
  triggerTime: Date | 'recurring';
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    dayOfWeek?: number;
    dayOfMonth?: number;
    time?: string;
  };
  action: {
    type: string;
    parameters: Record<string, any>;
  };
  lastRun?: Date;
  createdAt: Date;
  isActive: boolean;
}

// AI Insight for data analysis
export interface AIInsight {
  id: string;
  type: 'spending' | 'destination' | 'weather' | 'recommendation' | 'trend';
  title: string;
  description: string;
  severity: 'info' | 'suggestion' | 'warning';
  data: Record<string, any>;
  timestamp: Date;
  isRead: boolean;
  sourceData: string;
  confidenceScore: number;
}

// Memory context for conversational AI
export interface MemoryContext {
  userId: string;
  sessionId: string;
  currentTab: string;
  activeItineraryId?: string;
  recentSearches: string[];
  recentDestinations: TravelDestination[];
  conversationFocus?: string;
  detectedIntents: string[];
  lastUpdateTime: Date;
  customValues: Record<string, any>;
}