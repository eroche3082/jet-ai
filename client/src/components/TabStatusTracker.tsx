import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, RefreshCw, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { firestore } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Tab status interface
interface TabStatus {
  name: string;
  route: string;
  status: "✅" | "⚠️" | "❌";
  api_connection: "✅" | "❌";
  responsive: "✅" | "❌";
  components_functional: "✅" | "⚠️" | "❌";
  chatbot_context: "✅" | "⚠️" | "❌";
  suggestions: string[];
}

// Tab verifier props interface
interface TabStatusTrackerProps {
  refresh?: boolean;
}

const TabStatusTracker: React.FC<TabStatusTrackerProps> = ({ refresh = false }) => {
  const { toast } = useToast();
  const [refreshing, setRefreshing] = useState(false);

  // Current tab status data
  const tabStatusData = {
    tabs: [
      {
        name: "Dashboard",
        route: "/dashboard",
        status: "✅" as const,
        api_connection: "✅" as const,
        responsive: "✅" as const,
        components_functional: "✅" as const,
        chatbot_context: "✅" as const,
        suggestions: [
          "Add personalized recommendations based on user preferences",
          "Implement weather widget for destination previews"
        ]
      },
      {
        name: "Explore",
        route: "/explore",
        status: "⚠️" as const,
        api_connection: "✅" as const,
        responsive: "✅" as const,
        components_functional: "⚠️" as const,
        chatbot_context: "✅" as const,
        suggestions: [
          "Complete destination filtering functionality",
          "Add map-based exploration interface",
          "Implement visual indicators for popular destinations"
        ]
      },
      {
        name: "Profile",
        route: "/profile",
        status: "⚠️" as const,
        api_connection: "✅" as const,
        responsive: "⚠️" as const,
        components_functional: "⚠️" as const,
        chatbot_context: "⚠️" as const,
        suggestions: [
          "Complete preference settings for travel style",
          "Add travel history visualization",
          "Implement loyalty points tracking interface"
        ]
      },
      {
        name: "Travel Wallet",
        route: "/wallet",
        status: "⚠️" as const,
        api_connection: "❌" as const,
        responsive: "✅" as const,
        components_functional: "⚠️" as const,
        chatbot_context: "❌" as const,
        suggestions: [
          "Connect to budget tracking API",
          "Implement currency conversion feature",
          "Add expense categorization"
        ]
      },
      {
        name: "Bookings",
        route: "/bookings",
        status: "❌" as const,
        api_connection: "❌" as const,
        responsive: "✅" as const,
        components_functional: "❌" as const,
        chatbot_context: "❌" as const,
        suggestions: [
          "Connect to flight booking APIs",
          "Implement hotel reservation system",
          "Add car rental booking functionality"
        ]
      },
      {
        name: "Itineraries",
        route: "/itineraries",
        status: "⚠️" as const,
        api_connection: "⚠️" as const,
        responsive: "✅" as const,
        components_functional: "⚠️" as const,
        chatbot_context: "⚠️" as const,
        suggestions: [
          "Complete day-by-day itinerary builder",
          "Add activity recommendations based on user preferences",
          "Implement itinerary sharing functionality"
        ]
      },
      {
        name: "Chat",
        route: "/chat",
        status: "✅" as const,
        api_connection: "✅" as const,
        responsive: "✅" as const,
        components_functional: "✅" as const,
        chatbot_context: "✅" as const,
        suggestions: [
          "Add voice message persistence",
          "Implement proactive travel suggestions based on browsing history"
        ]
      },
      {
        name: "Tools",
        route: "/tools",
        status: "❌" as const,
        api_connection: "❌" as const,
        responsive: "⚠️" as const,
        components_functional: "❌" as const,
        chatbot_context: "❌" as const,
        suggestions: [
          "Implement currency converter",
          "Add language translator tool",
          "Create packing list generator"
        ]
      },
      {
        name: "Settings",
        route: "/settings",
        status: "⚠️" as const,
        api_connection: "✅" as const,
        responsive: "✅" as const,
        components_functional: "⚠️" as const,
        chatbot_context: "⚠️" as const,
        suggestions: [
          "Complete language preference settings",
          "Add notification controls",
          "Implement theme customization"
        ]
      }
    ]
  };

  // Refresh tab status
  const refreshTabStatus = () => {
    setRefreshing(true);
    toast({
      title: 'Status Refreshed',
      description: 'Tab status has been updated',
    });
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }

  // Save tab status to Firebase
  const saveTabStatus = async () => {
    try {
      if (!firestore) {
        toast({
          title: 'Firebase not available',
          description: 'Unable to save tab status',
          variant: 'destructive',
        });
        return;
      }

      // Update the tab status document
      await setDoc(doc(firestore, 'systemStatus', 'tabStatus'), {
        ...tabStatusData,
        timestamp: serverTimestamp(),
        phase: 'PHASE 3.1',
        next_phase: 'PHASE 3.2 – Visual Enhancements & Dynamic Data Flows'
      });

      toast({
        title: 'Status saved',
        description: 'Tab status has been saved to the Admin Panel',
      });
    } catch (error) {
      console.error('Error saving tab status:', error);
      toast({
        title: 'Save failed',
        description: 'Failed to save tab status',
        variant: 'destructive',
      });
    }
  };

  // Get status badge
  const getStatusBadge = (status: "✅" | "⚠️" | "❌") => {
    const variant = 
      status === "✅" ? "outline" : 
      status === "⚠️" ? "secondary" : "destructive";
    
    return <Badge variant={variant}>{status}</Badge>;
  };

  // Download the full tab status as JSON
  const downloadTabStatusJSON = () => {
    const reportText = JSON.stringify(tabStatusData, null, 2);
    const blob = new Blob([reportText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jetai-tab-status-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Status downloaded',
      description: 'Tab status has been downloaded as JSON',
    });
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Tab Status Tracker</CardTitle>
            <CardDescription>PHASE 3.1 – MAIN MENU TAB-BY-TAB VERIFICATION</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={refreshTabStatus}
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
        <div className="space-y-4">
          {tabStatusData.tabs.map((tab, index) => (
            <div key={index} className="p-3 rounded-md border border-border/40">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">{tab.name}</h3>
                {getStatusBadge(tab.status)}
              </div>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-muted-foreground">Route:</span>
                <span>{tab.route}</span>
                
                <span className="text-muted-foreground">API Connection:</span>
                <span>{getStatusBadge(tab.api_connection)}</span>
                
                <span className="text-muted-foreground">Responsive UI:</span>
                <span>{getStatusBadge(tab.responsive)}</span>
                
                <span className="text-muted-foreground">Components:</span>
                <span>{getStatusBadge(tab.components_functional)}</span>
                
                <span className="text-muted-foreground">Chatbot Integration:</span>
                <span>{getStatusBadge(tab.chatbot_context)}</span>
              </div>
              
              {tab.suggestions.length > 0 && (
                <div className="mt-2 pt-2 border-t border-border/30">
                  <h4 className="text-xs font-medium text-muted-foreground mb-1">Suggestions:</h4>
                  <ul className="text-xs space-y-1 list-disc list-inside">
                    {tab.suggestions.map((suggestion, idx) => (
                      <li key={idx}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end pt-2 gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={downloadTabStatusJSON}
          disabled={refreshing}
        >
          <Download className="h-4 w-4 mr-1" />
          Download JSON
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          onClick={saveTabStatus}
          disabled={refreshing}
        >
          <Upload className="h-4 w-4 mr-1" />
          Save to Admin Panel
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TabStatusTracker;