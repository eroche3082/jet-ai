import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clipboard, Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

  // Current system report data
  const systemReport: SystemReport = {
    phase_0_initialization: {
      app_skeleton_created: "✅",
      env_and_secrets_loaded: "✅",
      firebase_connected: "✅",
      replit_initialized: "✅",
      github_repo_linked: "❌",
      suggestions: ["Link GitHub repo for backup and automation"]
    },
    phase_1_ui_layout: {
      header_navbar: "✅",
      side_panel_tabs: "✅",
      footer_with_admin_panel: "✅",
      responsive_layout: "⚠️",
      route_navigation: "✅",
      suggestions: ["Add dark mode switch in navbar"]
    },
    phase_2_chatbot_core: {
      chatbot_visible: "✅",
      vertex_ai_connected: "✅",
      voice_input_output: "✅",
      multilingual_support: "✅",
      firebase_context_memory: "⚠️",
      onboarding_flow_active: "✅",
      dashboard_linked_to_profile: "⚠️",
      suggestions: ["Add loading animation during onboarding", "Improve error handling for voice input"]
    },
    phase_3_tab_modules: {
      dashboard_tab: "✅",
      analytics_tab: "⚠️",
      explore_tab: "⚠️",
      profile_tab: "⚠️",
      smart_tools_tab: "❌",
      suggestions: ["Group tabs into collapsible sections", "Add skeleton loading states for all tabs"]
    },
    phase_4_user_personalization: {
      subscriber_profile_system: "⚠️",
      user_data_firebase_storage: "✅",
      personalized_dashboard: "⚠️",
      avatar_name_by_chatbot: "✅",
      smart_recommendations: "❌",
      suggestions: ["Add preference wizard in profile settings", "Enable user avatar customization"]
    },
    phase_5_external_integrations: {
      stripe_connected: "✅",
      maps_apis_working: "✅",
      google_apis_connected: "✅",
      third_party_apis: "⚠️",
      suggestions: ["Add fallback providers for each API", "Implement retry mechanism for failed API calls"]
    },
    phase_6_testing_qa: {
      mobile_testing: "⚠️",
      tablet_testing: "⚠️",
      multibrowser_testing: "❌",
      error_handling: "⚠️",
      chatbot_tab_testing: "✅",
      suggestions: ["Create automated test suite", "Add error boundary components"]
    },
    phase_7_admin_tools: {
      admin_dashboard: "✅",
      log_viewer: "⚠️",
      subscriber_list: "❌",
      onboarding_override: "❌",
      ai_prompt_tester: "⚠️",
      system_diagnostics: "✅",
      suggestions: ["Add analytics dashboard for admin", "Create user impersonation tool for debugging"]
    },
    phase_8_prelaunch: {
      seo_basics: "❌",
      privacy_terms: "⚠️",
      social_links: "✅",
      contact_form: "⚠️",
      suggestions: ["Add structured data for SEO", "Create sitemap.xml"]
    },
    phase_9_deployment: {
      firebase_hosting: "❌",
      custom_domain: "❌",
      ssl_active: "❌",
      post_deploy_test: "❌",
      final_checklist: "❌",
      suggestions: ["Set up CI/CD pipeline", "Configure server-side caching"]
    },
    current_phase: {
      current_phase: "PHASE 2 – Chatbot Core Implemented",
      next_focus: "PHASE 3 – Complete tab modules integration",
      priority_actions: ["Complete Profile Tab", "Enable Dashboard Analytics", "Improve Firebase Context Memory"]
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

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>System Diagnostic Report</CardTitle>
            <CardDescription>Current status and progress of JetAI platform</CardDescription>
          </div>
          <Badge 
            className={`${getStatusColor(systemStatus.status)} text-white`}
          >
            {getStatusMessage(systemStatus.status)}: {systemStatus.percentage}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        {/* Current Phase Summary */}
        <div className="mb-4 p-3 rounded-md bg-muted/50">
          <h3 className="font-bold">{systemReport.current_phase.current_phase}</h3>
          <p className="text-sm text-muted-foreground">Next focus: {systemReport.current_phase.next_focus}</p>
          <div className="mt-2">
            <span className="text-xs font-semibold">Priority Actions:</span>
            <ul className="text-xs mt-1 space-y-1 list-disc list-inside">
              {systemReport.current_phase.priority_actions.map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Phase Reports */}
        <div className="space-y-4">
          {Object.entries(systemReport).map(([phaseKey, phase]) => {
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
      <CardFooter className="flex justify-between pt-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={copyReportToClipboard}
        >
          <Clipboard className="h-4 w-4 mr-1" />
          {copied ? 'Copied!' : 'Copy Report'}
        </Button>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={downloadReportAsJSON}
          >
            <Download className="h-4 w-4 mr-1" />
            Download JSON
          </Button>
          <Button
            variant="secondary"
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh Report
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SystemDiagnosticReport;