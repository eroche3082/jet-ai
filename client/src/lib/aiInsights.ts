/**
 * JetAI Smart Insights Engine
 * Phase 4: Automation & Predictive Intelligence
 * 
 * This module provides AI-powered analytics for travel data:
 * - Spending pattern analysis
 * - Weather trend forecasting
 * - Destination recommendations
 * - Travel behavior predictions
 * - Budget optimization suggestions
 */

import { AIInsight, Expense, Itinerary, TravelDestination, WeatherInfo } from '@/types';
import { getCurrentTimeOfDay } from '@/lib/dateUtils';

// Destination affinity scores by interest
const INTEREST_DESTINATION_AFFINITIES: Record<string, string[]> = {
  'beach': ['Maldives', 'Hawaii', 'Bali', 'Cancun', 'Phuket'],
  'culture': ['Rome', 'Kyoto', 'Paris', 'Istanbul', 'Cairo'],
  'food': ['Tokyo', 'Bangkok', 'Barcelona', 'New Orleans', 'Singapore'],
  'nature': ['Costa Rica', 'Norway', 'New Zealand', 'Switzerland', 'Iceland'],
  'adventure': ['Nepal', 'Peru', 'South Africa', 'Australia', 'Tanzania'],
  'relaxation': ['Santorini', 'Seychelles', 'Bora Bora', 'Tuscany', 'Tahiti'],
  'history': ['Athens', 'Jerusalem', 'Beijing', 'Vienna', 'Mexico City'],
  'architecture': ['Barcelona', 'Prague', 'Dubai', 'Chicago', 'St. Petersburg'],
  'nightlife': ['Las Vegas', 'Berlin', 'Ibiza', 'Rio de Janeiro', 'Amsterdam'],
  'shopping': ['New York', 'Milan', 'London', 'Hong Kong', 'Dubai']
};

// Budget categories and associated warning thresholds
const BUDGET_WARNING_THRESHOLDS: Record<string, number> = {
  'accommodation': 0.4, // if accommodation takes >40% of total budget
  'dining': 0.3,        // if dining takes >30% of total budget
  'transportation': 0.25, // if transportation takes >25% of total budget
  'activities': 0.25,   // if activities take >25% of total budget
  'shopping': 0.15      // if shopping takes >15% of total budget
};

// Weather patterns for warning generation
const WEATHER_CONCERNS: Record<string, (info: WeatherInfo) => boolean> = {
  'rain': (w) => w.condition.toLowerCase().includes('rain') && w.precipitationChance > 0.5,
  'extreme_heat': (w) => w.temperature > 35 && w.temperatureUnit === 'celsius',
  'extreme_cold': (w) => w.temperature < 0 && w.temperatureUnit === 'celsius',
  'high_winds': (w) => w.windSpeed > 30,
  'storm': (w) => w.condition.toLowerCase().includes('storm') || w.condition.toLowerCase().includes('thunder')
};

/**
 * Generate insights from user spending patterns
 */
export function generateSpendingInsights(expenses: Expense[], budget?: number): AIInsight[] {
  const insights: AIInsight[] = [];
  
  if (!expenses.length) return insights;
  
  // Group expenses by category
  const byCategory: Record<string, Expense[]> = {};
  expenses.forEach(expense => {
    if (!byCategory[expense.category]) {
      byCategory[expense.category] = [];
    }
    byCategory[expense.category].push(expense);
  });
  
  // Calculate total spend
  const totalSpend = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Check category ratios and generate insights
  Object.entries(byCategory).forEach(([category, categoryExpenses]) => {
    const categoryTotal = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const categoryRatio = categoryTotal / totalSpend;
    
    // Check if spending in this category exceeds thresholds
    const threshold = BUDGET_WARNING_THRESHOLDS[category];
    if (threshold && categoryRatio > threshold) {
      insights.push({
        id: `spend-category-${category}-${Date.now()}`,
        type: 'spending',
        title: `High ${category} spending detected`,
        description: `Your ${category} expenses represent ${Math.round(categoryRatio * 100)}% of your total spending, which is higher than the recommended ${Math.round(threshold * 100)}%.`,
        severity: 'warning',
        data: {
          category,
          ratio: categoryRatio,
          threshold,
          amount: categoryTotal
        },
        timestamp: new Date(),
        isRead: false,
        sourceData: 'expense_analysis',
        confidenceScore: 0.9
      });
    }
  });
  
  // Check overall budget (if provided)
  if (budget && totalSpend > budget) {
    insights.push({
      id: `budget-exceeded-${Date.now()}`,
      type: 'spending',
      title: 'Budget exceeded',
      description: `You've spent ${totalSpend} which exceeds your budget of ${budget}.`,
      severity: 'warning',
      data: {
        budget,
        spent: totalSpend,
        difference: totalSpend - budget
      },
      timestamp: new Date(),
      isRead: false,
      sourceData: 'budget_analysis',
      confidenceScore: 1.0
    });
  }
  
  // Look for spending trends
  if (expenses.length >= 5) {
    const sortedByDate = [...expenses].sort((a, b) => a.date.getTime() - b.date.getTime());
    const recentExpenses = sortedByDate.slice(-5);
    
    // Check for increasing spending pattern
    let increasingCount = 0;
    for (let i = 1; i < recentExpenses.length; i++) {
      if (recentExpenses[i].amount > recentExpenses[i-1].amount) {
        increasingCount++;
      }
    }
    
    if (increasingCount >= 3) {
      insights.push({
        id: `spending-trend-${Date.now()}`,
        type: 'trend',
        title: 'Increasing spending pattern',
        description: 'Your recent expenses show an upward trend. Consider reviewing your spending habits.',
        severity: 'info',
        data: {
          recentExpenses: recentExpenses.map(e => ({
            amount: e.amount,
            date: e.date.toISOString(),
            category: e.category
          }))
        },
        timestamp: new Date(),
        isRead: false,
        sourceData: 'spending_trend_analysis',
        confidenceScore: 0.75
      });
    }
  }
  
  return insights;
}

/**
 * Generate destination recommendations based on interests
 */
export function generateDestinationInsights(
  interests: string[],
  pastDestinations: TravelDestination[]
): AIInsight[] {
  const insights: AIInsight[] = [];
  
  if (!interests.length) return insights;
  
  // Find the most relevant interests that have destination data
  const relevantInterests = interests.filter(interest => 
    INTEREST_DESTINATION_AFFINITIES[interest] !== undefined
  );
  
  if (!relevantInterests.length) return insights;
  
  // Select a random interest to focus on
  const selectedInterest = relevantInterests[
    Math.floor(Math.random() * relevantInterests.length)
  ];
  
  // Get destination recommendations for this interest
  const recommendations = INTEREST_DESTINATION_AFFINITIES[selectedInterest];
  
  // Filter out destinations the user has already visited
  const pastDestinationNames = pastDestinations.map(d => d.name);
  const newRecommendations = recommendations.filter(
    r => !pastDestinationNames.includes(r)
  );
  
  if (newRecommendations.length) {
    // Select up to 3 recommendations
    const finalRecommendations = newRecommendations.slice(0, 3);
    
    insights.push({
      id: `destination-rec-${selectedInterest}-${Date.now()}`,
      type: 'destination',
      title: `Perfect destinations for ${selectedInterest} lovers`,
      description: `Based on your interest in ${selectedInterest}, you might enjoy visiting ${finalRecommendations.join(', ')}.`,
      severity: 'info',
      data: {
        interest: selectedInterest,
        recommendations: finalRecommendations
      },
      timestamp: new Date(),
      isRead: false,
      sourceData: 'interest_destination_matching',
      confidenceScore: 0.8
    });
  }
  
  return insights;
}

/**
 * Generate weather-related travel insights
 */
export function generateWeatherInsights(
  weatherInfo: WeatherInfo[], 
  itineraries: Itinerary[]
): AIInsight[] {
  const insights: AIInsight[] = [];
  
  if (!weatherInfo.length || !itineraries.length) return insights;
  
  // Get upcoming itineraries
  const now = new Date();
  const upcomingItineraries = itineraries.filter(i => i.startDate > now);
  
  // Check weather forecasts against itineraries
  upcomingItineraries.forEach(itinerary => {
    // Find weather info for this destination
    const destinationWeather = weatherInfo.filter(w => 
      w.location.toLowerCase().includes(itinerary.destination.name.toLowerCase()) ||
      itinerary.destination.name.toLowerCase().includes(w.location.toLowerCase())
    );
    
    if (!destinationWeather.length) return;
    
    // Check for weather concerns
    for (const weather of destinationWeather) {
      for (const [concernType, checkFn] of Object.entries(WEATHER_CONCERNS)) {
        if (checkFn(weather)) {
          insights.push({
            id: `weather-alert-${itinerary.id}-${concernType}-${Date.now()}`,
            type: 'weather',
            title: `Weather alert for ${itinerary.destination.name}`,
            description: `${weather.condition} is forecasted during your trip to ${itinerary.destination.name} (${weather.date.toLocaleDateString()}).`,
            severity: 'warning',
            data: {
              itineraryId: itinerary.id,
              destination: itinerary.destination.name,
              weatherDate: weather.date.toISOString(),
              condition: weather.condition,
              temperature: weather.temperature,
              temperatureUnit: weather.temperatureUnit,
              concernType
            },
            timestamp: new Date(),
            isRead: false,
            sourceData: 'weather_forecast_analysis',
            confidenceScore: 0.85
          });
          
          // Only generate one alert per weather condition
          break;
        }
      }
    }
  });
  
  return insights;
}

/**
 * Generate comprehensive insights across all data
 */
export function generateAllInsights(
  expenses: Expense[],
  itineraries: Itinerary[],
  interests: string[],
  pastDestinations: TravelDestination[],
  weatherInfo: WeatherInfo[],
  budget?: number
): AIInsight[] {
  // Combine insights from all analysis functions
  const spendingInsights = generateSpendingInsights(expenses, budget);
  const destinationInsights = generateDestinationInsights(interests, pastDestinations);
  const weatherInsights = generateWeatherInsights(weatherInfo, itineraries);
  
  // Add a personalized time-of-day recommendation
  const timeOfDay = getCurrentTimeOfDay();
  let timeBasedInsight: AIInsight | null = null;
  
  if (timeOfDay === 'morning' && itineraries.length > 0) {
    // Find the next upcoming itinerary
    const now = new Date();
    const upcomingItineraries = itineraries
      .filter(i => i.startDate > now)
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    
    if (upcomingItineraries.length > 0) {
      const nextTrip = upcomingItineraries[0];
      timeBasedInsight = {
        id: `morning-checklist-${Date.now()}`,
        type: 'recommendation',
        title: 'Morning Trip Preparation Checklist',
        description: `Good morning! Your trip to ${nextTrip.destination.name} is coming up in ${Math.ceil((nextTrip.startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))} days. Would you like to review your travel checklist?`,
        severity: 'info',
        data: {
          itineraryId: nextTrip.id,
          destination: nextTrip.destination.name,
          departureDate: nextTrip.startDate.toISOString(),
          timeOfDay
        },
        timestamp: new Date(),
        isRead: false,
        sourceData: 'time_based_recommendation',
        confidenceScore: 0.9
      };
    }
  } else if (timeOfDay === 'evening' && expenses.length > 0) {
    // Suggest an evening budget review
    timeBasedInsight = {
      id: `evening-budget-${Date.now()}`,
      type: 'recommendation',
      title: 'Evening Budget Review',
      description: 'Good evening! Now might be a good time to review your travel budget and recent expenses.',
      severity: 'info',
      data: {
        timeOfDay,
        expenseCount: expenses.length,
        hasRecentExpenses: expenses.some(e => {
          const today = new Date();
          const expenseDate = new Date(e.date);
          return expenseDate.getDate() === today.getDate() &&
                 expenseDate.getMonth() === today.getMonth() &&
                 expenseDate.getFullYear() === today.getFullYear();
        })
      },
      timestamp: new Date(),
      isRead: false,
      sourceData: 'time_based_recommendation',
      confidenceScore: 0.85
    };
  }
  
  const allInsights = [
    ...spendingInsights,
    ...destinationInsights,
    ...weatherInsights
  ];
  
  if (timeBasedInsight) {
    allInsights.push(timeBasedInsight);
  }
  
  return allInsights;
}

/**
 * Get active insights (not read yet)
 */
export function getActiveInsights(insights: AIInsight[]): AIInsight[] {
  return insights.filter(insight => !insight.isRead);
}

/**
 * Mark an insight as read
 */
export function markInsightAsRead(insights: AIInsight[], insightId: string): AIInsight[] {
  return insights.map(insight => 
    insight.id === insightId
      ? { ...insight, isRead: true }
      : insight
  );
}