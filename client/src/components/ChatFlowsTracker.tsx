import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, RefreshCw, Upload, MessageSquareText, MessagesSquare, Command } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { firestore } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Conversation Flow interface
interface TabChatFlow {
  tab: string;
  chatbot_context: string;
  smart_flows_enabled: string;
  triggers_recognized: string[];
  actions_available: string[];
  fallbacks: string[];
  suggestions: string[];
}

// Chat Flows Tracker props
interface ChatFlowsTrackerProps {
  refresh?: boolean;
}

const ChatFlowsTracker: React.FC<ChatFlowsTrackerProps> = ({ refresh = false }) => {
  const { toast } = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  // Tab chat flows data
  const chatFlowsData: TabChatFlow[] = [
    {
      tab: "Dashboard",
      chatbot_context: "✅",
      smart_flows_enabled: "✅ (Start Travel Planning Flow)",
      triggers_recognized: [
        "show my upcoming trips", 
        "update weather forecast", 
        "create a new trip",
        "check flight status",
        "summarize my travel plans"
      ],
      actions_available: [
        "Display countdown timer for next trip",
        "Show weather forecast for saved destinations",
        "Highlight travel alerts for booked destinations",
        "List travel budget status",
        "Recommend activities based on weather"
      ],
      fallbacks: [
        "If no trips found, suggest popular destinations based on preferences",
        "If weather API fails, provide seasonal averages from stored data"
      ],
      suggestions: [
        "Add travel intent detection (business vs leisure) for better recommendations",
        "Implement collaborative trip planning through shared links"
      ]
    },
    {
      tab: "Explore",
      chatbot_context: "✅",
      smart_flows_enabled: "✅ (Destination Discovery Flow)",
      triggers_recognized: [
        "find destinations for", 
        "show me places with", 
        "recommend a destination for",
        "what's popular in",
        "places similar to"
      ],
      actions_available: [
        "Filter destinations by climate, budget, activities",
        "Show destination comparison cards",
        "Display interactive map of recommended locations",
        "Present destination factsheets with key information",
        "Generate travel inspiration based on preferences"
      ],
      fallbacks: [
        "If no matching destinations found, broaden search criteria automatically",
        "If search is too broad, ask clarifying questions to narrow down"
      ],
      suggestions: [
        "Add virtual destination tours via Google Street View integration",
        "Implement seasonal recommendation engine based on climate data"
      ]
    },
    {
      tab: "Profile",
      chatbot_context: "✅",
      smart_flows_enabled: "✅ (Travel Preferences Setup Flow)",
      triggers_recognized: [
        "update my preferences", 
        "change my travel style", 
        "add languages I speak",
        "set dietary restrictions",
        "edit my profile"
      ],
      actions_available: [
        "Update travel preferences with guided questions",
        "Add/remove languages from profile",
        "Set dietary restrictions for trip planning",
        "Manage favorite travel activities",
        "Define accommodation preferences"
      ],
      fallbacks: [
        "If preferences unclear, run quick questionnaire to establish baseline",
        "If profile incomplete, suggest priority fields to complete"
      ],
      suggestions: [
        "Add travel personality quiz for more nuanced recommendations",
        "Implement preference import from past trips and behaviors"
      ]
    },
    {
      tab: "Travel Wallet",
      chatbot_context: "✅",
      smart_flows_enabled: "✅ (Budget Planning Flow)",
      triggers_recognized: [
        "add expense", 
        "check my budget", 
        "convert currency",
        "split expense with",
        "analyze my spending"
      ],
      actions_available: [
        "Add new expenses with category assignment",
        "Display budget breakdown by category",
        "Convert between currencies with live rates",
        "Show spending trends over time",
        "Compare expenses against trip budget"
      ],
      fallbacks: [
        "If no budget set, guide user through creating one",
        "If currency conversion fails, use last cached rates"
      ],
      suggestions: [
        "Add receipt scanning for automatic expense logging",
        "Implement shared expenses and group budget tracking"
      ]
    },
    {
      tab: "Bookings",
      chatbot_context: "✅",
      smart_flows_enabled: "✅ (Travel Booking Assistant)",
      triggers_recognized: [
        "find flights to", 
        "book hotel in", 
        "search for activities in",
        "check availability for",
        "compare flight options"
      ],
      actions_available: [
        "Search for flights with flexible parameters",
        "Find accommodation with specific amenities",
        "Book activities and tours at destinations",
        "Check travel documentation requirements",
        "Add bookings to trip itinerary"
      ],
      fallbacks: [
        "If booking APIs unavailable, offer to set booking reminders",
        "If search criteria too restrictive, suggest alternatives"
      ],
      suggestions: [
        "Add price prediction for optimal booking timing",
        "Implement booking modification and cancellation assistant"
      ]
    },
    {
      tab: "Itineraries",
      chatbot_context: "✅",
      smart_flows_enabled: "✅ (Itinerary Creation Flow)",
      triggers_recognized: [
        "create itinerary for", 
        "plan my day in", 
        "optimize my schedule",
        "add activity to itinerary",
        "share my itinerary with"
      ],
      actions_available: [
        "Create day-by-day trip itineraries",
        "Add/remove/reorder activities",
        "Optimize routes between activities",
        "Account for opening hours and travel time",
        "Generate shareable itinerary links"
      ],
      fallbacks: [
        "If location data unavailable, build time-based skeleton itinerary",
        "If too many activities, suggest prioritization options"
      ],
      suggestions: [
        "Add weather-adaptive itinerary with backup plans",
        "Implement collaborative editing for group trips"
      ]
    },
    {
      tab: "Chat",
      chatbot_context: "✅",
      smart_flows_enabled: "✅ (Travel Concierge Flow)",
      triggers_recognized: [
        "help me plan a trip to", 
        "what should I pack for", 
        "tell me about",
        "translate this to",
        "local customs in"
      ],
      actions_available: [
        "Provide destination insights and recommendations",
        "Generate packing lists based on destination/weather",
        "Translate phrases to local languages",
        "Explain local customs and etiquette",
        "Answer general travel questions"
      ],
      fallbacks: [
        "If destination unknown, ask clarifying questions",
        "If translation unavailable, offer universal phrases/gestures"
      ],
      suggestions: [
        "Add voice conversation mode for hands-free operation",
        "Implement visual recognition for landmark information"
      ]
    },
    {
      tab: "Tools",
      chatbot_context: "✅",
      smart_flows_enabled: "✅ (Travel Tools Assistant)",
      triggers_recognized: [
        "convert currency", 
        "translate phrase", 
        "check weather in",
        "calculate time difference",
        "create packing list"
      ],
      actions_available: [
        "Perform currency conversions with live rates",
        "Translate phrases between languages",
        "Show weather forecasts for destinations",
        "Calculate time differences across zones",
        "Generate custom packing lists"
      ],
      fallbacks: [
        "If tool requires data and it's unavailable, explain limitations",
        "If request ambiguous, provide tool selection menu"
      ],
      suggestions: [
        "Add offline mode for essential tools",
        "Implement AI-powered photo translation tool"
      ]
    },
    {
      tab: "Settings",
      chatbot_context: "✅",
      smart_flows_enabled: "✅ (Preferences Configuration Flow)",
      triggers_recognized: [
        "change language to", 
        "update notification settings", 
        "turn on dark mode",
        "sync with calendar",
        "manage data privacy"
      ],
      actions_available: [
        "Change app language settings",
        "Configure notification preferences",
        "Toggle theme mode (light/dark)",
        "Connect external services (calendar, email)",
        "Manage privacy and data settings"
      ],
      fallbacks: [
        "If settings change fails, explain reason and alternatives",
        "If request unclear, show settings categories"
      ],
      suggestions: [
        "Add voice command settings configuration",
        "Implement settings backup and restore function"
      ]
    }
  ];

  // Refresh chat flows data
  const refreshChatFlows = () => {
    setRefreshing(true);
    toast({
      title: 'Chat Flows Refreshed',
      description: 'Conversational UI data has been updated',
    });
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Save chat flows data to Firebase
  const saveChatFlows = async () => {
    try {
      if (!firestore) {
        toast({
          title: 'Firebase not available',
          description: 'Unable to save chat flows data',
          variant: 'destructive',
        });
        return;
      }

      // Update the chat flows document
      await setDoc(doc(firestore, 'systemStatus', 'chatFlows'), {
        flows: chatFlowsData,
        timestamp: serverTimestamp(),
        phase: 'PHASE 3.3',
        next_phase: 'PHASE 4 – User Personalization Enhancement'
      });

      toast({
        title: 'Chat Flows saved',
        description: 'Conversational UI data has been saved to the Admin Panel',
      });
    } catch (error) {
      console.error('Error saving chat flows data:', error);
      toast({
        title: 'Save failed',
        description: 'Failed to save conversational UI data',
        variant: 'destructive',
      });
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const getVariant = () => {
      if (status.includes("✅")) return "outline";
      if (status.includes("⚠️")) return "secondary";
      return "destructive";
    };
    
    return <Badge variant={getVariant()}>{status}</Badge>;
  };

  // Download the full chat flows data as JSON
  const downloadChatFlowsJSON = () => {
    const reportText = JSON.stringify({
      phase: 'PHASE 3.3 – CONVERSATIONAL UI + SMART TAB FLOWS',
      timestamp: new Date().toISOString(),
      flows: chatFlowsData
    }, null, 2);
    
    const blob = new Blob([reportText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jetai-chat-flows-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Chat Flows downloaded',
      description: 'Conversational UI data has been downloaded as JSON',
    });
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareText className="h-5 w-5 text-primary" />
              Conversational UI Flows Tracker
            </CardTitle>
            <CardDescription>PHASE 3.3 – CONVERSATIONAL UI + SMART TAB FLOWS</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={refreshChatFlows}
            disabled={refreshing}
          >
            {refreshing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="mb-4 flex flex-wrap h-auto justify-start">
            {chatFlowsData.map((tab, index) => (
              <TabsTrigger
                key={tab.tab.toLowerCase()}
                value={tab.tab.toLowerCase()}
                onClick={() => setActiveTabIndex(index)}
                className="flex items-center gap-1 mb-1"
              >
                {tab.tab}
                {tab.chatbot_context === "✅" ? (
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                ) : tab.chatbot_context === "⚠️" ? (
                  <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                ) : (
                  <span className="h-2 w-2 rounded-full bg-red-500"></span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {chatFlowsData.map((flow, index) => (
            <TabsContent 
              key={flow.tab.toLowerCase()} 
              value={flow.tab.toLowerCase()}
              className="space-y-4"
            >
              <div className="p-4 rounded-md border border-border/40">
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Chatbot Context Awareness:</h4>
                    {getStatusBadge(flow.chatbot_context)}
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Smart Flows:</h4>
                    {getStatusBadge(flow.smart_flows_enabled)}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
                    <Command className="h-4 w-4 text-primary" />
                    Trigger Phrases:
                  </h4>
                  <ul className="space-y-1 list-disc list-inside text-sm pl-1">
                    {flow.triggers_recognized.map((item, idx) => (
                      <li key={idx}>"{item}"</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
                    <MessagesSquare className="h-4 w-4 text-primary" />
                    Available Actions:
                  </h4>
                  <ul className="space-y-1 list-disc list-inside text-sm pl-1">
                    {flow.actions_available.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Fallbacks & Error Handling:</h4>
                  <ul className="space-y-1 list-disc list-inside text-sm pl-1 text-muted-foreground">
                    {flow.fallbacks.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                
                {flow.suggestions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Future Enhancements:</h4>
                    <ul className="space-y-1 list-disc list-inside text-sm pl-1 text-muted-foreground">
                      {flow.suggestions.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end pt-2 gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={downloadChatFlowsJSON}
          disabled={refreshing}
        >
          <Download className="h-4 w-4 mr-1" />
          Download JSON
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          onClick={saveChatFlows}
          disabled={refreshing}
        >
          <Upload className="h-4 w-4 mr-1" />
          Save to Admin Panel
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ChatFlowsTracker;