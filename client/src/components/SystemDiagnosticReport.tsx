import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clipboard, Download, RefreshCw, Lock, Bell, MessageSquare, Upload, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { auth, firestore } from '@/lib/firebase';
import { getDocs, collection, query, where, doc, setDoc, serverTimestamp, addDoc } from 'firebase/firestore';

// Phase item interface
interface PhaseItem {
  [key: string]: "✅" | "❌" | "⚠️";
}

// Phase interface
interface Phase {
  [key: string]: any;
  suggestions: string[];
}

// Current phase info
interface CurrentPhaseInfo {
  current_phase: string;
  next_focus: string;
  priority_actions: string[];
}

// System report interface
interface SystemReport {
  [key: string]: Phase | CurrentPhaseInfo;
  phase_0_initialization: Phase;
  phase_1_ui_layout: Phase;
  phase_2_chatbot_core: Phase;
  phase_3_tab_modules: Phase;
  phase_4_user_personalization: Phase;
  phase_5_external_integrations: Phase;
  phase_6_testing_qa: Phase;
  phase_7_admin_tools: Phase;
  phase_8_prelaunch: Phase;
  phase_9_deployment: Phase;
  current_phase: CurrentPhaseInfo;
}

const SystemDiagnosticReport: React.FC = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [report, setReport] = useState<SystemReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Function to get live system statistics
  const fetchSystemStats = async () => {
    try {
      // This would normally pull from Firebase or an API
      // For now, we'll use our default report data
      setReport(systemReport);
      
      // Real implementation would look something like this:
      /*
      // Count active users
      const userCount = await getDocs(query(collection(firestore, 'users'), where('lastActive', '>', new Date(Date.now() - 86400000))));
      
      // Count total chat messages
      const chatMessages = await getDocs(collection(firestore, 'chatMessages'));
      
      // Check API services status
      const apiServiceStatus = await checkAPIServicesStatus();
      
      // Update the report with live data
      */
    } catch (error) {
      console.error('Error fetching system stats:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch system statistics',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchSystemStats();
  }, []);

  // Refresh report data
  const refreshReport = () => {
    setRefreshing(true);
    fetchSystemStats();
    toast({
      title: 'Report refreshed',
      description: 'System diagnostic data has been updated',
    });
  };

  // Get system status based on completion percentage
  const getSystemStatus = (report: SystemReport): { status: 'ok' | 'warning' | 'error', percentage: number } => {
    let totalItems = 0;
    let completedItems = 0;

    // Count all items and completed items
    Object.keys(report).forEach(phaseKey => {
      if (phaseKey !== 'current_phase') {
        const phase = report[phaseKey];
        Object.keys(phase).forEach(itemKey => {
          if (itemKey !== 'suggestions') {
            const item = phase[itemKey as keyof typeof phase];
            if (typeof item === 'string') {
              totalItems++;
              if (item === '✅') {
                completedItems++;
              }
            } else if (typeof item === 'object') {
              Object.values(item).forEach(status => {
                totalItems++;
                if (status === '✅') {
                  completedItems++;
                }
              });
            }
          }
        });
      }
    });

    const percentage = Math.round((completedItems / totalItems) * 100);
    
    if (percentage >= 80) return { status: 'ok', percentage };
    if (percentage >= 40) return { status: 'warning', percentage };
    return { status: 'error', percentage };
  };

  // Current system report data - FULL PHASE EXECUTION MODE
  const systemReport: SystemReport = {
    phase_0_initialization: {
      app_skeleton_created: "✅",
      env_and_secrets_loaded: "✅",
      firebase_connected: "✅",
      replit_initialized: "✅", 
      github_repo_linked: "❌",
      api_keys_secured: "✅",
      project_structure_defined: "✅",
      suggestions: [
        "Link GitHub repo for backup and version control",
        "Implement dev/prod environment separation",
        "Add automated CI/CD pipeline"
      ]
    },
    phase_1_ui_layout: {
      header_navbar: "✅",
      side_panel_tabs: "✅",
      footer_with_admin_panel: "✅",
      responsive_layout: "⚠️",
      route_navigation: "✅",
      mobile_optimization: "⚠️",
      chat_bubble_ui: "✅",
      theme_consistency: "✅",
      suggestions: [
        "Add dark mode toggle in navigation",
        "Improve tablet responsiveness",
        "Fix minor mobile UI issues in chat interface"
      ]
    },
    phase_2_chatbot_core: {
      chatbot_visible: "✅",
      vertex_ai_connected: "✅",
      openai_fallback: "✅",
      anthropic_integration: "✅",
      voice_input: "✅",
      voice_output: "✅",
      multilingual_support: "✅",
      firebase_context_memory: "⚠️",
      onboarding_flow_active: "✅",
      dashboard_linked_to_profile: "⚠️",
      emoji_sentiment: "✅",
      conversation_history: "✅",
      suggestions: [
        "Improve Firebase context memory for longer conversations",
        "Add loading animation during onboarding steps",
        "Implement enhanced error handling for voice input/output",
        "Create automated memory pruning for long-term users"
      ]
    },
    phase_3_tab_modules: {
      dashboard_tab: "✅",
      analytics_tab: "⚠️",
      explore_tab: "⚠️",
      profile_tab: "⚠️",
      smart_tools_tab: "❌",
      travel_wallet_tab: "⚠️",
      itinerary_builder: "⚠️",
      booking_management: "❌",
      destination_discovery: "⚠️",
      real_time_alerts: "❌",
      suggestions: [
        "Complete profile tab functionality",
        "Group tabs into collapsible sections for mobile",
        "Add skeleton loading states for all tabs",
        "Implement real-time alerts for travel notifications"
      ]
    },
    phase_4_user_personalization: {
      subscriber_profile_system: "⚠️",
      user_data_firebase_storage: "✅",
      personalized_dashboard: "⚠️",
      avatar_name_by_chatbot: "✅",
      smart_recommendations: "❌",
      user_preferences_storage: "✅",
      travel_style_quiz: "⚠️",
      loyalty_points_system: "❌",
      travel_history_tracking: "⚠️",
      suggestions: [
        "Complete travel style preference quiz",
        "Add preference wizard in profile settings",
        "Implement AI-powered itinerary recommendations",
        "Build loyalty points system for repeat users"
      ]
    },
    phase_5_external_integrations: {
      stripe_connected: "✅",
      maps_apis_working: "✅",
      google_apis_connected: "✅",
      amadeus_integration: "⚠️",
      third_party_apis: "⚠️",
      weather_service: "⚠️",
      flight_booking_api: "❌",
      hotel_booking_api: "❌",
      car_rental_api: "❌",
      suggestions: [
        "Complete Amadeus API integration for flights",
        "Add hotel booking API integration",
        "Implement fallback providers for critical APIs",
        "Create retry mechanism for failed API calls"
      ]
    },
    phase_6_testing_qa: {
      mobile_testing: "⚠️",
      tablet_testing: "⚠️",
      multibrowser_testing: "❌",
      error_handling: "⚠️",
      chatbot_qa: "✅",
      performance_testing: "❌",
      security_testing: "❌",
      load_testing: "❌",
      usability_testing: "⚠️",
      suggestions: [
        "Create automated test suite for core features",
        "Add error boundary components throughout app",
        "Implement performance monitoring and optimization",
        "Complete cross-browser compatibility testing"
      ]
    },
    phase_7_admin_tools: {
      admin_dashboard: "✅",
      log_viewer: "⚠️",
      user_management: "❌",
      subscriber_list: "❌",
      onboarding_override: "❌",
      ai_prompt_tester: "⚠️",
      system_diagnostics: "✅",
      chatbot_performance_monitor: "⚠️",
      phase_tracker: "✅",
      suggestions: [
        "Develop complete user management interface",
        "Add analytics dashboard for admin",
        "Create user impersonation tool for debugging",
        "Implement API usage monitoring dashboard"
      ]
    },
    phase_8_prelaunch: {
      seo_basics: "❌",
      privacy_terms: "⚠️",
      social_links: "✅",
      contact_form: "⚠️",
      marketing_pages: "❌",
      analytics_setup: "⚠️",
      demo_accounts: "❌",
      performance_optimization: "❌",
      suggestions: [
        "Create SEO-optimized landing pages",
        "Add structured data for rich snippets",
        "Complete legal documents (privacy policy, terms)",
        "Set up demo accounts for different user types"
      ]
    },
    phase_9_deployment: {
      firebase_hosting: "❌",
      custom_domain: "❌",
      ssl_active: "❌",
      post_deploy_test: "❌",
      final_checklist: "❌",
      monitoring_setup: "❌",
      backup_system: "❌",
      scaling_plan: "❌",
      suggestions: [
        "Configure Firebase hosting with custom domain",
        "Set up monitoring and alerting system",
        "Create automated backup system",
        "Implement CDN for static assets"
      ]
    },
    current_phase: {
      current_phase: "PHASE 3 – Tab Modules Integration",
      next_focus: "PHASE 4 – User Personalization Enhancement",
      priority_actions: [
        "Complete Profile Tab with preferences interface",
        "Enhance Firebase context memory for chatbot", 
        "Implement travel style recommendation system"
      ]
    }
  };

  const systemStatus = getSystemStatus(systemReport);
  
  const getStatusColor = (status: 'ok' | 'warning' | 'error') => {
    switch (status) {
      case 'ok': return 'bg-green-500 hover:bg-green-600';
      case 'warning': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'error': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getStatusMessage = (status: 'ok' | 'warning' | 'error') => {
    switch (status) {
      case 'ok': return 'System OK';
      case 'warning': return 'System Warning';
      case 'error': return 'System Error';
      default: return 'Unknown Status';
    }
  };

  const copyReportToClipboard = () => {
    const reportText = JSON.stringify(systemReport, null, 2);
    navigator.clipboard.writeText(reportText).then(() => {
      setCopied(true);
      toast({
        title: 'Copied to clipboard',
        description: 'System diagnostic report has been copied to your clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy report to clipboard: ' + err.message,
        variant: 'destructive',
      });
    });
  };

  const downloadReportAsJSON = () => {
    const reportText = JSON.stringify(systemReport, null, 2);
    const blob = new Blob([reportText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jetai-diagnostic-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Report downloaded',
      description: 'System diagnostic report has been downloaded as JSON',
    });
  };

  // Sync report to Firebase
  const syncReportToFirebase = async () => {
    try {
      if (!firestore) {
        toast({
          title: 'Firebase not available',
          description: 'Unable to sync report to Firebase',
          variant: 'destructive',
        });
        return;
      }

      // Save report to Firebase
      const reportDocRef = doc(firestore, 'systemReports', 'latest');
      await setDoc(reportDocRef, {
        ...systemReport, 
        timestamp: serverTimestamp(),
        status_percentage: systemStatus.percentage,
        system_status: systemStatus.status.toUpperCase(),
        status_reason: "The system is functional but several modules are still in progress. Core components are working but need optimization."
      });

      // Create report history entry
      await addDoc(collection(firestore, 'systemReportHistory'), {
        report: systemReport,
        timestamp: serverTimestamp(),
        status_percentage: systemStatus.percentage,
        system_status: systemStatus.status.toUpperCase(),
        status_reason: "The system is functional but several modules are still in progress. Core components are working but need optimization."
      });

      toast({
        title: 'Report synced',
        description: 'System diagnostic report has been synced to Firebase',
      });

      return true;
    } catch (error) {
      console.error('Error syncing report:', error);
      toast({
        title: 'Sync failed',
        description: 'Failed to sync report to Firebase',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Send notifications to development team
  const triggerPhaseReminder = async () => {
    try {
      if (!firestore) {
        toast({
          title: 'Firebase not available',
          description: 'Unable to send phase reminder',
          variant: 'destructive',
        });
        return;
      }

      // Create notification
      await addDoc(collection(firestore, 'notifications'), {
        title: `PHASE ${systemReport.current_phase.current_phase.split(' – ')[0].split(' ')[1]} REMINDER`,
        message: `Current focus: ${systemReport.current_phase.current_phase}\nNext phase: ${systemReport.current_phase.next_focus}\nPriority actions: ${systemReport.current_phase.priority_actions.join(', ')}`,
        type: 'phase_reminder',
        read: false,
        timestamp: serverTimestamp(),
      });

      toast({
        title: 'Reminder sent',
        description: 'Phase reminder notification has been sent to the development team',
      });

      return true;
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast({
        title: 'Reminder failed',
        description: 'Failed to send phase reminder',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Update chatbot to be phase-aware
  const enableChatbotPhaseAwareness = async () => {
    try {
      if (!firestore) {
        toast({
          title: 'Firebase not available',
          description: 'Unable to update chatbot phase awareness',
          variant: 'destructive',
        });
        return;
      }

      // Update chatbot configuration
      await setDoc(doc(firestore, 'chatbotConfig', 'phaseSettings'), {
        isPhaseAware: true,
        currentPhase: systemReport.current_phase.current_phase.split(' – ')[0].split(' ')[1],
        currentPhaseDescription: systemReport.current_phase.current_phase.split(' – ')[1],
        nextPhase: systemReport.current_phase.next_focus.split(' – ')[0].split(' ')[1],
        phaseMessage: `I'm currently in ${systemReport.current_phase.current_phase} – still learning!`,
        updatedAt: serverTimestamp(),
      });

      toast({
        title: 'Chatbot updated',
        description: 'Chatbot is now phase-aware and will inform users of its development stage',
      });

      return true;
    } catch (error) {
      console.error('Error updating chatbot:', error);
      toast({
        title: 'Update failed',
        description: 'Failed to update chatbot phase awareness',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Render phase items
  const renderPhaseItems = (phase: Phase, phaseKey: string) => {
    return Object.entries(phase).map(([key, value]) => {
      if (key === 'suggestions') return null;
      
      // Skip if not a string status indicator
      if (typeof value !== 'string' || !['✅', '❌', '⚠️'].includes(value)) return null;
      
      return (
        <div key={`${phaseKey}-${key}`} className="flex items-center justify-between py-1">
          <span className="text-sm capitalize">{key.replace(/_/g, ' ')}</span>
          <Badge variant={
            value === '✅' ? 'outline' : 
            value === '⚠️' ? 'secondary' : 'destructive'
          }>
            {value}
          </Badge>
        </div>
      );
    });
  };

  // Render phase suggestions
  const renderPhaseSuggestions = (suggestions: string[]) => {
    if (!suggestions.length) return null;
    
    return (
      <div className="mt-2 pt-2 border-t border-border/30">
        <h4 className="text-xs font-medium text-muted-foreground mb-1">Suggestions:</h4>
        <ul className="text-xs space-y-1 list-disc list-inside">
          {suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      </div>
    );
  };

  // Use default report if state is null
  const reportData = report || systemReport;
  const status = reportData ? getSystemStatus(reportData) : { status: 'warning' as const, percentage: 0 };

  if (isLoading) {
    return (
      <Card className="w-full shadow-md">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>System Diagnostic Report</CardTitle>
            <div className="animate-pulse">
              <Badge variant="outline">Loading...</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="py-10">
          <div className="flex flex-col items-center justify-center">
            <RefreshCw className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading system diagnostic data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>System Diagnostic Report</CardTitle>
            <CardDescription>Current status and progress of JetAI platform</CardDescription>
          </div>
          <Badge 
            className={`${getStatusColor(status.status)} text-white`}
          >
            {getStatusMessage(status.status)}: {status.percentage}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        {/* Current Phase Summary */}
        <div className="mb-4 p-3 rounded-md bg-muted/50">
          <h3 className="font-bold">{reportData.current_phase.current_phase}</h3>
          <p className="text-sm text-muted-foreground">Next focus: {reportData.current_phase.next_focus}</p>
          <div className="mt-2">
            <span className="text-xs font-semibold">Priority Actions:</span>
            <ul className="text-xs mt-1 space-y-1 list-disc list-inside">
              {reportData.current_phase.priority_actions.map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Phase Reports */}
        <div className="space-y-4">
          {Object.entries(reportData).map(([phaseKey, phase]) => {
            if (phaseKey === 'current_phase') return null;
            
            // Type guard to ensure we only render Phase objects
            const phaseObj = phase as Phase;
            
            return (
              <div key={phaseKey} className="p-3 rounded-md border border-border/40">
                <h3 className="font-medium capitalize mb-2">{phaseKey.replace(/_/g, ' ')}</h3>
                <div className="space-y-1">
                  {renderPhaseItems(phaseObj, phaseKey)}
                  {phaseObj.suggestions && renderPhaseSuggestions(phaseObj.suggestions)}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-3 pt-2">
        <div className="flex justify-between w-full">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={copyReportToClipboard}
            disabled={refreshing}
          >
            <Clipboard className="h-4 w-4 mr-1" />
            {copied ? 'Copied!' : 'Copy Report'}
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={downloadReportAsJSON}
              disabled={refreshing}
            >
              <Download className="h-4 w-4 mr-1" />
              Download JSON
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={refreshReport}
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
                  Refresh Report
                </>
              )}
            </Button>
          </div>
        </div>
        
        {/* PHASE EXECUTION MODE Synchronization Buttons */}
        <div className="w-full pt-2 border-t border-border/30">
          <p className="text-xs font-medium text-muted-foreground mb-2">Phase Execution Mode:</p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={syncReportToFirebase}
              disabled={refreshing}
              className="text-xs"
            >
              <Upload className="h-3 w-3 mr-1" />
              Sync to Firebase
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={triggerPhaseReminder}
              disabled={refreshing}
              className="text-xs"
            >
              <Bell className="h-3 w-3 mr-1" />
              Send Phase Reminder
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={enableChatbotPhaseAwareness}
              disabled={refreshing}
              className="text-xs"
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              Enable Chatbot Phase Awareness
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              disabled={true}
              className="text-xs text-muted-foreground"
            >
              <Clock className="h-3 w-3 mr-1" />
              Auto-sync: Inactive
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SystemDiagnosticReport;