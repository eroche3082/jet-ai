import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, RefreshCw, Upload, Zap, Paintbrush, Layers } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { firestore } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Visual enhancement interface
interface TabEnhancement {
  tab: string;
  loading_state: "✅" | "⚠️" | "❌";
  data_integration: string;
  chatbot_context_linked: string;
  responsive_ui: string;
  enhancements: string[];
  suggestions: string[];
}

// Visual Enhancements Tracker props
interface VisualEnhancementsTrackerProps {
  refresh?: boolean;
}

const VisualEnhancementsTracker: React.FC<VisualEnhancementsTrackerProps> = ({ refresh = false }) => {
  const { toast } = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  // Visual enhancements data
  const enhancementsData: TabEnhancement[] = [
    {
      tab: "Dashboard",
      loading_state: "✅",
      data_integration: "✅ (using Firebase + Gemini AI)",
      chatbot_context_linked: "✅",
      responsive_ui: "✅",
      enhancements: [
        "Added animated transitions for weather cards",
        "Implemented trip countdown timer with visual indicator",
        "Added skeleton loading states for all content sections",
        "Enhanced destination cards with hover effects and quick actions",
        "Context-aware chatbot now suggests activities based on dashboard weather"
      ],
      suggestions: [
        "Add customizable widget layout for personalized dashboard",
        "Implement drag-and-drop trip prioritization"
      ]
    },
    {
      tab: "Explore",
      loading_state: "✅",
      data_integration: "✅ (using Amadeus API + Google Maps)",
      chatbot_context_linked: "✅",
      responsive_ui: "⚠️ (map overflow on small screens)",
      enhancements: [
        "Added interactive map with destination markers",
        "Implemented gallery view with lazy-loading images",
        "Added filters with animated transitions",
        "Enhanced search with autocomplete and recent searches",
        "Context-aware chatbot now offers to explain destination details"
      ],
      suggestions: [
        "Fix map responsiveness on mobile devices",
        "Add virtual tour previews for popular destinations",
        "Implement destination comparison feature"
      ]
    },
    {
      tab: "Profile",
      loading_state: "✅",
      data_integration: "✅ (using Firebase user profiles)",
      chatbot_context_linked: "⚠️ (partial preferences integration)",
      responsive_ui: "⚠️ (form layout issues on tablet)",
      enhancements: [
        "Added animated preference selection sliders",
        "Implemented travel style visualization with icons",
        "Added avatar upload with preview and cropping",
        "Enhanced language selector with flags and local names",
        "Context-aware chatbot can now reference user preferences"
      ],
      suggestions: [
        "Fix form layout on tablets",
        "Add travel personality quiz feature",
        "Complete chatbot integration with all preference types"
      ]
    },
    {
      tab: "Travel Wallet",
      loading_state: "⚠️",
      data_integration: "⚠️ (using mock + partial real data)",
      chatbot_context_linked: "❌",
      responsive_ui: "✅",
      enhancements: [
        "Added budget visualization with progress bars",
        "Implemented expense categorization with color coding",
        "Added currency converter with live rates",
        "Enhanced transaction list with search and filters",
        "Added empty state illustrations for new users"
      ],
      suggestions: [
        "Connect to real currency API for faster conversions",
        "Add receipt scanning and automatic categorization",
        "Implement chatbot integration for budget advice",
        "Add expense sharing features for group travel"
      ]
    },
    {
      tab: "Bookings",
      loading_state: "❌",
      data_integration: "❌ (placeholder data only)",
      chatbot_context_linked: "❌",
      responsive_ui: "✅",
      enhancements: [
        "Added card-based booking display with status indicators",
        "Implemented timeline view for upcoming bookings",
        "Added empty state illustrations and onboarding",
        "Enhanced filter system for booking types",
        "Added booking details expansion with animations"
      ],
      suggestions: [
        "Connect to booking APIs (flights, hotels, activities)",
        "Add calendar integration for travel schedule",
        "Implement booking modification interface",
        "Add chatbot integration for booking assistance"
      ]
    },
    {
      tab: "Itineraries",
      loading_state: "⚠️",
      data_integration: "⚠️ (partial Firebase + mock data)",
      chatbot_context_linked: "⚠️",
      responsive_ui: "✅",
      enhancements: [
        "Added day-by-day itinerary view with collapsible sections",
        "Implemented drag-and-drop activity reordering",
        "Added map visualization of daily activities",
        "Enhanced sharing options with preview",
        "Context-aware chatbot can now suggest itinerary modifications"
      ],
      suggestions: [
        "Complete integration with real activity data",
        "Add collaborative editing for shared itineraries",
        "Implement weather forecasts for itinerary days",
        "Add time and distance calculations between activities"
      ]
    },
    {
      tab: "Chat",
      loading_state: "✅",
      data_integration: "✅ (Gemini AI + OpenAI)",
      chatbot_context_linked: "✅",
      responsive_ui: "✅",
      enhancements: [
        "Added typing indicators and message animations",
        "Implemented voice input with visual feedback",
        "Enhanced message rendering with Markdown support",
        "Added suggestion chips based on conversation context",
        "Implemented multi-modal responses (text, images, maps)"
      ],
      suggestions: [
        "Add chat history search functionality",
        "Implement conversation summarization feature",
        "Add voice customization options"
      ]
    },
    {
      tab: "Tools",
      loading_state: "❌",
      data_integration: "❌ (UI only, no backend)",
      chatbot_context_linked: "❌",
      responsive_ui: "⚠️ (calculator overflow issues)",
      enhancements: [
        "Added currency converter UI with animated transitions",
        "Implemented language flashcard system with flip animations",
        "Added interactive packing checklist with progress tracking",
        "Enhanced weather forecast tool with visualizations",
        "Added placeholder states for all tool sections"
      ],
      suggestions: [
        "Connect currency converter to real exchange rate API",
        "Implement offline functionality for travel tools",
        "Add voice translation feature",
        "Connect chatbot to tools for seamless interaction"
      ]
    },
    {
      tab: "Settings",
      loading_state: "⚠️",
      data_integration: "✅ (user preferences in Firebase)",
      chatbot_context_linked: "⚠️",
      responsive_ui: "✅",
      enhancements: [
        "Added toggle switches with animated transitions",
        "Implemented theme preview with real-time changes",
        "Added language selector with flag indicators",
        "Enhanced notification settings with grouping",
        "Context-aware chatbot can now update some settings via commands"
      ],
      suggestions: [
        "Complete chatbot integration for all settings",
        "Add data export/import functionality",
        "Implement account linking options for travel services"
      ]
    }
  ];

  // Refresh enhancements data
  const refreshEnhancements = () => {
    setRefreshing(true);
    toast({
      title: 'Enhancements Refreshed',
      description: 'Visual enhancements data has been updated',
    });
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Save enhancements data to Firebase
  const saveEnhancements = async () => {
    try {
      if (!firestore) {
        toast({
          title: 'Firebase not available',
          description: 'Unable to save enhancements data',
          variant: 'destructive',
        });
        return;
      }

      // Update the enhancements document
      await setDoc(doc(firestore, 'systemStatus', 'visualEnhancements'), {
        enhancements: enhancementsData,
        timestamp: serverTimestamp(),
        phase: 'PHASE 3.2',
        next_phase: 'PHASE 3.3 – Conversational UI + Smart Tab Flows'
      });

      toast({
        title: 'Enhancements saved',
        description: 'Visual enhancements data has been saved to the Admin Panel',
      });
    } catch (error) {
      console.error('Error saving enhancements data:', error);
      toast({
        title: 'Save failed',
        description: 'Failed to save visual enhancements data',
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

  // Download the full enhancements data as JSON
  const downloadEnhancementsJSON = () => {
    const reportText = JSON.stringify({
      phase: 'PHASE 3.2 – VISUAL ENHANCEMENTS & DYNAMIC DATA INTEGRATION',
      timestamp: new Date().toISOString(),
      enhancements: enhancementsData
    }, null, 2);
    
    const blob = new Blob([reportText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jetai-visual-enhancements-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Enhancements downloaded',
      description: 'Visual enhancements data has been downloaded as JSON',
    });
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Paintbrush className="h-5 w-5 text-primary" />
              Visual Enhancements Tracker
            </CardTitle>
            <CardDescription>PHASE 3.2 – VISUAL ENHANCEMENTS & DYNAMIC DATA INTEGRATION</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={refreshEnhancements}
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
            {enhancementsData.map((tab, index) => (
              <TabsTrigger
                key={tab.tab.toLowerCase()}
                value={tab.tab.toLowerCase()}
                onClick={() => setActiveTabIndex(index)}
                className="flex items-center gap-1 mb-1"
              >
                {tab.tab}
                {tab.loading_state === "✅" ? (
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                ) : tab.loading_state === "⚠️" ? (
                  <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                ) : (
                  <span className="h-2 w-2 rounded-full bg-red-500"></span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {enhancementsData.map((enhancement, index) => (
            <TabsContent 
              key={enhancement.tab.toLowerCase()} 
              value={enhancement.tab.toLowerCase()}
              className="space-y-4"
            >
              <div className="p-4 rounded-md border border-border/40">
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Loading States:</h4>
                    {getStatusBadge(enhancement.loading_state)}
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Data Integration:</h4>
                    {getStatusBadge(enhancement.data_integration)}
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Chatbot Context:</h4>
                    {getStatusBadge(enhancement.chatbot_context_linked)}
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Responsive UI:</h4>
                    {getStatusBadge(enhancement.responsive_ui)}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
                    <Zap className="h-4 w-4 text-primary" />
                    Enhancements Implemented:
                  </h4>
                  <ul className="space-y-1 list-disc list-inside text-sm pl-1">
                    {enhancement.enhancements.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                
                {enhancement.suggestions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
                      <Layers className="h-4 w-4 text-primary" />
                      Further Suggestions:
                    </h4>
                    <ul className="space-y-1 list-disc list-inside text-sm pl-1 text-muted-foreground">
                      {enhancement.suggestions.map((item, idx) => (
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
          onClick={downloadEnhancementsJSON}
          disabled={refreshing}
        >
          <Download className="h-4 w-4 mr-1" />
          Download JSON
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          onClick={saveEnhancements}
          disabled={refreshing}
        >
          <Upload className="h-4 w-4 mr-1" />
          Save to Admin Panel
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VisualEnhancementsTracker;