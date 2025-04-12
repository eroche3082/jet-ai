/**
 * JetAI Smart Suggestions Component
 * Phase 4: Automation & Predictive Intelligence
 * 
 * This component displays AI-generated personalized suggestions
 * based on user behavior and predictive models
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Brain,
  Calendar,
  Clock,
  ThumbsUp,
  X,
  ChevronUp,
  ChevronDown,
  BellRing,
  Lightbulb,
  ArrowRight,
  AlertTriangle,
  AlertCircle,
  CloudLightning,
  CreditCard,
  MapPin,
  Globe,
  Search
} from 'lucide-react';
import type { SmartSuggestion } from '@/lib/smartAutomation';
import { 
  getActiveSuggestions, 
  dismissSuggestion, 
  executeSuggestionAction 
} from '@/lib/smartAutomation';

// Default suggestions for initial state
const DEFAULT_SUGGESTIONS: SmartSuggestion[] = [
  {
    id: 'morning-greeting',
    message: "Good morning! Would you like to check today's weather for your destination?",
    triggerType: 'time_of_day',
    priority: 'medium',
    tabTarget: 'tools'
  },
  {
    id: 'explore-beach-destinations',
    message: "Based on your recent searches, you might enjoy exploring these beach destinations.",
    triggerType: 'ai_prediction',
    priority: 'low',
    tabTarget: 'explore',
    context: { interest: 'beaches' }
  },
  {
    id: 'budget-alert',
    message: "You're within 15% of your accommodation budget limit. Would you like some budget-friendly options?",
    triggerType: 'budget_alert',
    priority: 'high',
    tabTarget: 'travel-wallet'
  }
];

// Helper component for suggestion icon
const SuggestionIcon: React.FC<{ triggerType: string }> = ({ triggerType }) => {
  const iconMap: Record<string, JSX.Element> = {
    'time_of_day': <Clock className="h-4 w-4" />,
    'ai_prediction': <Brain className="h-4 w-4" />,
    'scheduled_event': <Calendar className="h-4 w-4" />,
    'budget_alert': <CreditCard className="h-4 w-4" />,
    'weather_alert': <CloudLightning className="h-4 w-4" />,
    'location_change': <MapPin className="h-4 w-4" />,
    'data_sync': <Globe className="h-4 w-4" />,
    'user_milestone': <ThumbsUp className="h-4 w-4" />,
    'external_api': <Search className="h-4 w-4" />
  };
  
  return iconMap[triggerType] || <BellRing className="h-4 w-4" />;
};

// Component for individual suggestion
interface SuggestionItemProps {
  suggestion: SmartSuggestion;
  onDismiss: (id: string) => void;
  onExecute: (id: string) => void;
}

const SuggestionItem: React.FC<SuggestionItemProps> = ({
  suggestion,
  onDismiss,
  onExecute
}) => {
  return (
    <div className="p-4 border rounded-lg mb-3 bg-card">
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <div className={`p-1.5 rounded-full mr-3 mt-0.5 ${
            suggestion.priority === 'high'
              ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
              : suggestion.priority === 'medium'
                ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300'
                : 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
          }`}>
            <SuggestionIcon triggerType={suggestion.triggerType} />
          </div>
          <div>
            <p className="text-sm font-medium">{suggestion.message}</p>
            <div className="flex mt-1.5">
              <Badge variant="outline" className="mr-1 text-xs">
                {suggestion.triggerType.replace(/_/g, ' ')}
              </Badge>
              {suggestion.tabTarget && (
                <Badge variant="secondary" className="text-xs">
                  {suggestion.tabTarget}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7 -mt-1 -mr-1" 
          onClick={() => onDismiss(suggestion.id)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="mt-3 flex justify-end">
        <Button 
          variant="default" 
          size="sm" 
          className="text-xs h-8"
          onClick={() => onExecute(suggestion.id)}
        >
          {suggestion.tabTarget ? 'Go to ' + suggestion.tabTarget : 'Take action'}
          <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

// Main component
const SmartSuggestions: React.FC = () => {
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  
  // Initially load suggestions
  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        // In a real implementation, this would get data from the automation system
        // For demo purposes, we're using hardcoded suggestions
        setTimeout(() => {
          setSuggestions(DEFAULT_SUGGESTIONS);
          setLoading(false);
        }, 1200);
      } catch (error) {
        console.error('Error loading suggestions:', error);
        setLoading(false);
      }
    };
    
    loadSuggestions();
    
    // Set up listener for new suggestions
    const handleNewSuggestion = (event: CustomEvent) => {
      const newSuggestion = event.detail.suggestion;
      setSuggestions(prevSuggestions => [...prevSuggestions, newSuggestion]);
    };
    
    window.addEventListener('jetai:new-automation', handleNewSuggestion as EventListener);
    
    // Clean up listener
    return () => {
      window.removeEventListener('jetai:new-automation', handleNewSuggestion as EventListener);
    };
  }, []);
  
  // Handle suggestion dismissal
  const handleDismiss = (id: string) => {
    dismissSuggestion(id);
    setSuggestions(prevSuggestions => 
      prevSuggestions.filter(s => s.id !== id)
    );
  };
  
  // Handle suggestion execution
  const handleExecute = (id: string) => {
    executeSuggestionAction(id);
    
    // In a real app, this would navigate to the tab or perform the action
    // For demo purposes, we'll just remove the suggestion
    handleDismiss(id);
  };
  
  // Show loading state
  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <Lightbulb className="h-4 w-4 mr-2" />
            Smart Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-4">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Show empty state or collapsed state
  if (suggestions.length === 0 || collapsed) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base flex items-center">
              <Lightbulb className="h-4 w-4 mr-2" />
              Smart Suggestions
            </CardTitle>
            {suggestions.length > 0 && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7"
                onClick={() => setCollapsed(false)}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        {suggestions.length === 0 && (
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Brain className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                No suggestions right now. Check back later!
              </p>
            </div>
          </CardContent>
        )}
        {collapsed && suggestions.length > 0 && (
          <CardFooter className="py-2">
            <Badge variant="outline" className="w-full justify-center">
              {suggestions.length} suggestion{suggestions.length !== 1 ? 's' : ''}
            </Badge>
          </CardFooter>
        )}
      </Card>
    );
  }
  
  // Show suggestions
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base flex items-center">
            <Lightbulb className="h-4 w-4 mr-2" />
            Smart Suggestions
          </CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            onClick={() => setCollapsed(true)}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="max-h-80 overflow-y-auto">
          {suggestions.map(suggestion => (
            <SuggestionItem
              key={suggestion.id}
              suggestion={suggestion}
              onDismiss={handleDismiss}
              onExecute={handleExecute}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartSuggestions;