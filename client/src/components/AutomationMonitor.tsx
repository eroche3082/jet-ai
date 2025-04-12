/**
 * JetAI Automation Monitor
 * Phase 4: Automation & Predictive Intelligence
 * 
 * This component tracks the status of all automation features
 * and provides a dashboard for monitoring system health
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowUpRight,
  Brain,
  Calendar,
  BarChart3,
  BellRing,
  RefreshCw,
  Zap
} from 'lucide-react';
import { SmartSuggestion } from '@/lib/smartAutomation';

// Status type for features
type FeatureStatus = 'active' | 'pending' | 'error';

// Feature component definition
interface AutomationFeature {
  id: string;
  name: string;
  description: string;
  status: FeatureStatus;
  confidence: number;
  lastUpdated: Date;
  metrics: {
    triggers: number;
    activations: number;
    accuracy: number;
  };
  category: 'suggestion' | 'scheduler' | 'analytics' | 'trigger' | 'memory';
}

// Mock data for initial state - in real app would come from API
const INITIAL_FEATURES: AutomationFeature[] = [
  {
    id: 'smart-suggestions',
    name: 'Smart Suggestions',
    description: 'Proactive chatbot suggestions based on user patterns',
    status: 'active',
    confidence: 0.85,
    lastUpdated: new Date(),
    metrics: {
      triggers: 24,
      activations: 8,
      accuracy: 0.76
    },
    category: 'suggestion'
  },
  {
    id: 'time-awareness',
    name: 'Time-of-day Awareness',
    description: 'Contextual suggestions based on time',
    status: 'active',
    confidence: 0.92,
    lastUpdated: new Date(),
    metrics: {
      triggers: 12,
      activations: 5,
      accuracy: 0.83
    },
    category: 'suggestion'
  },
  {
    id: 'scheduled-prompts',
    name: 'Scheduled Prompts',
    description: 'Time-based automated reminders and prompts',
    status: 'active',
    confidence: 0.78,
    lastUpdated: new Date(),
    metrics: {
      triggers: 18,
      activations: 14,
      accuracy: 0.92
    },
    category: 'scheduler'
  },
  {
    id: 'travel-automation',
    name: 'Travel Event Automation',
    description: 'Automatic scheduling based on travel dates',
    status: 'active',
    confidence: 0.81,
    lastUpdated: new Date(),
    metrics: {
      triggers: 7,
      activations: 6,
      accuracy: 0.88
    },
    category: 'scheduler'
  },
  {
    id: 'behavioral-analytics',
    name: 'Behavioral Analytics',
    description: 'User behavior pattern recognition',
    status: 'active',
    confidence: 0.73,
    lastUpdated: new Date(),
    metrics: {
      triggers: 56,
      activations: 22,
      accuracy: 0.68
    },
    category: 'analytics'
  },
  {
    id: 'predictive-needs',
    name: 'Predictive Needs',
    description: 'Forecasting user requirements before they ask',
    status: 'active',
    confidence: 0.64,
    lastUpdated: new Date(),
    metrics: {
      triggers: 31,
      activations: 12,
      accuracy: 0.65
    },
    category: 'analytics'
  },
  {
    id: 'weather-triggers',
    name: 'Weather Alert Triggers',
    description: 'Automated alerts based on weather data',
    status: 'active',
    confidence: 0.88,
    lastUpdated: new Date(),
    metrics: {
      triggers: 9,
      activations: 7,
      accuracy: 0.95
    },
    category: 'trigger'
  },
  {
    id: 'budget-triggers',
    name: 'Budget Alert Triggers',
    description: 'Alerts based on spending patterns and limits',
    status: 'active',
    confidence: 0.82,
    lastUpdated: new Date(),
    metrics: {
      triggers: 14,
      activations: 9,
      accuracy: 0.86
    },
    category: 'trigger'
  },
  {
    id: 'memory-persistence',
    name: 'Memory Persistence',
    description: 'Cross-session conversation context retention',
    status: 'active',
    confidence: 0.94,
    lastUpdated: new Date(),
    metrics: {
      triggers: 42,
      activations: 38,
      accuracy: 0.97
    },
    category: 'memory'
  },
  {
    id: 'cross-tab-sync',
    name: 'Cross-tab Synchronization',
    description: 'Seamless context sharing between app features',
    status: 'active',
    confidence: 0.89,
    lastUpdated: new Date(),
    metrics: {
      triggers: 26,
      activations: 24,
      accuracy: 0.92
    },
    category: 'memory'
  }
];

// Mock recent suggestions - in real app would come from smartAutomation's getActiveSuggestions
const MOCK_SUGGESTIONS: SmartSuggestion[] = [
  {
    id: 'sug-1',
    message: "I notice you've been researching beach destinations. Would you like recommendations for tropical getaways?",
    triggerType: 'ai_prediction',
    priority: 'medium',
    context: { interest: 'beaches' }
  },
  {
    id: 'sug-2',
    message: "Your trip to Barcelona is in 3 days. Would you like to check the current weather forecast?",
    triggerType: 'scheduled_event',
    priority: 'high',
    tabTarget: 'tools'
  },
  {
    id: 'sug-3',
    message: "Good morning! Here's your day's travel agenda and local weather at your destination.",
    triggerType: 'time_of_day',
    priority: 'medium'
  }
];

// Status badge component
const StatusBadge: React.FC<{ status: FeatureStatus }> = ({ status }) => {
  const colors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
  };
  
  const labels = {
    active: 'Active',
    pending: 'Pending',
    error: 'Error'
  };
  
  const icons = {
    active: <CheckCircle2 className="w-3.5 h-3.5 mr-1" />,
    pending: <AlertTriangle className="w-3.5 h-3.5 mr-1" />,
    error: <XCircle className="w-3.5 h-3.5 mr-1" />
  };
  
  return (
    <Badge className={`flex items-center ${colors[status]}`}>
      {icons[status]}
      {labels[status]}
    </Badge>
  );
};

// Category icon component
const CategoryIcon: React.FC<{ category: string }> = ({ category }) => {
  const icons: Record<string, JSX.Element> = {
    suggestion: <Brain className="w-4 h-4" />,
    scheduler: <Calendar className="w-4 h-4" />,
    analytics: <BarChart3 className="w-4 h-4" />,
    trigger: <BellRing className="w-4 h-4" />,
    memory: <RefreshCw className="w-4 h-4" />
  };
  
  return icons[category] || <Zap className="w-4 h-4" />;
};

const AutomationMonitor: React.FC = () => {
  const [features, setFeatures] = useState<AutomationFeature[]>(INITIAL_FEATURES);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>(MOCK_SUGGESTIONS);
  
  // Calculate overall system health
  const calculateSystemHealth = (): number => {
    const activeFeatures = features.filter(f => f.status === 'active').length;
    return (activeFeatures / features.length) * 100;
  };
  
  // Calculate average confidence score
  const calculateAverageConfidence = (): number => {
    const sum = features.reduce((acc, feature) => acc + feature.confidence, 0);
    return sum / features.length;
  };
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const systemHealth = calculateSystemHealth();
  const avgConfidence = calculateAverageConfidence();
  
  const getHealthColor = (health: number): string => {
    if (health >= 90) return 'text-green-600';
    if (health >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const healthColor = getHealthColor(systemHealth);
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground">Loading automation system status...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Automation & Prediction Center</h2>
        <p className="text-muted-foreground">
          Phase 4 - Smart Automation System Status
        </p>
      </div>
      
      <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
        <CardContent className="pt-6 pb-4">
          <div className="flex items-center mb-2">
            <CheckCircle2 className="h-6 w-6 text-green-600 mr-2" />
            <h3 className="text-xl font-medium text-green-800 dark:text-green-400">PHASE 4 ACTIVE</h3>
          </div>
          <p className="text-green-700 dark:text-green-300">
            All automation and predictive intelligence systems are online. Smart suggestions, scheduled automations, and predictive analytics are operational.
          </p>
        </CardContent>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Overall status of automation features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <span>System Status:</span>
              <span className={`font-bold text-lg ${healthColor}`}>
                {systemHealth === 100 ? 'OPTIMAL' : systemHealth >= 80 ? 'GOOD' : 'DEGRADED'}
              </span>
            </div>
            <Progress value={systemHealth} className="h-2 mb-6" />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Active Features</span>
                <span className="text-2xl font-bold">{features.filter(f => f.status === 'active').length}/{features.length}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Avg. Confidence</span>
                <span className="text-2xl font-bold">{(avgConfidence * 100).toFixed(0)}%</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Total Triggers</span>
                <span className="text-2xl font-bold">
                  {features.reduce((sum, f) => sum + f.metrics.triggers, 0)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Activations</span>
                <span className="text-2xl font-bold">
                  {features.reduce((sum, f) => sum + f.metrics.activations, 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Smart Suggestions</CardTitle>
            <CardDescription>AI-generated prompts based on user behavior</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suggestions.map(suggestion => (
                <div key={suggestion.id} className="p-3 border rounded-lg bg-background">
                  <div className="flex items-start mb-2">
                    <div className={`w-2 h-2 rounded-full mt-1.5 mr-2 ${
                      suggestion.priority === 'high' 
                        ? 'bg-red-500' 
                        : suggestion.priority === 'medium' 
                          ? 'bg-yellow-500' 
                          : 'bg-blue-500'
                    }`} />
                    <p className="text-sm">{suggestion.message}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {suggestion.triggerType.replace('_', ' ')}
                    </Badge>
                    <Button variant="ghost" size="sm" className="h-7 px-2">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Features</TabsTrigger>
            <TabsTrigger value="suggestion">Suggestions</TabsTrigger>
            <TabsTrigger value="scheduler">Scheduling</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="trigger">Triggers</TabsTrigger>
            <TabsTrigger value="memory">Memory</TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
        
        <TabsContent value="all" className="m-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map(feature => (
              <Card key={feature.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="mr-2 p-1.5 bg-primary/10 rounded-md">
                        <CategoryIcon category={feature.category} />
                      </div>
                      <CardTitle className="text-base">{feature.name}</CardTitle>
                    </div>
                    <StatusBadge status={feature.status} />
                  </div>
                  <CardDescription className="mt-1.5">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-lg font-semibold">{feature.metrics.triggers}</div>
                      <div className="text-xs text-muted-foreground">Triggers</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold">{feature.metrics.activations}</div>
                      <div className="text-xs text-muted-foreground">Activations</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold">{Math.round(feature.metrics.accuracy * 100)}%</div>
                      <div className="text-xs text-muted-foreground">Accuracy</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="w-full">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Confidence</span>
                      <span>{Math.round(feature.confidence * 100)}%</span>
                    </div>
                    <Progress value={feature.confidence * 100} className="h-1.5" />
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {['suggestion', 'scheduler', 'analytics', 'trigger', 'memory'].map(category => (
          <TabsContent key={category} value={category} className="m-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {features
                .filter(feature => feature.category === category)
                .map(feature => (
                  <Card key={feature.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <div className="mr-2 p-1.5 bg-primary/10 rounded-md">
                            <CategoryIcon category={feature.category} />
                          </div>
                          <CardTitle className="text-base">{feature.name}</CardTitle>
                        </div>
                        <StatusBadge status={feature.status} />
                      </div>
                      <CardDescription className="mt-1.5">{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <div className="text-lg font-semibold">{feature.metrics.triggers}</div>
                          <div className="text-xs text-muted-foreground">Triggers</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold">{feature.metrics.activations}</div>
                          <div className="text-xs text-muted-foreground">Activations</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold">{Math.round(feature.metrics.accuracy * 100)}%</div>
                          <div className="text-xs text-muted-foreground">Accuracy</div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <div className="w-full">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Confidence</span>
                          <span>{Math.round(feature.confidence * 100)}%</span>
                        </div>
                        <Progress value={feature.confidence * 100} className="h-1.5" />
                      </div>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AutomationMonitor;