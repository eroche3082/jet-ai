import React, { useState, useEffect } from 'react';
import { AlertTriangle, Check, X, RefreshCw, ExternalLink } from 'lucide-react';
import { auditTab, formatAuditResults, TabAuditResult } from '@/lib/tabAudit';
import { getApiStatusSummary } from '@/lib/apiVerification';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TabAuditPanelProps {
  tabName: string;
  onClose?: () => void;
}

export default function TabAuditPanel({ tabName, onClose }: TabAuditPanelProps) {
  const [auditResult, setAuditResult] = useState<TabAuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState('summary');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'issues': true,
    'apis': true,
    'status': true
  });

  // Run the audit when the component mounts or when the tab name changes
  useEffect(() => {
    runAudit();
  }, [tabName]);

  const runAudit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await auditTab(tabName);
      setAuditResult(result);
    } catch (err) {
      console.error('Error running tab audit:', err);
      setError(err.message || 'An error occurred during the audit');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OK':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Partial':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Broken':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OK':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'Partial':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'Broken':
        return <X className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden border shadow-lg">
      <div className="flex items-center justify-between p-4 bg-muted/30">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          Tab Audit: "{tabName}"
          {auditResult && getStatusIcon(auditResult.status)}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={runAudit}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Running...' : 'Run Again'}
          </Button>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="summary" value={activeView} onValueChange={setActiveView} className="w-full">
        <div className="px-4 pt-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="apis">API Status</TabsTrigger>
            <TabsTrigger value="json">JSON Report</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="summary" className="p-4 pt-2">
          {error ? (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Audit Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-sm text-muted-foreground">Auditing tab "{tabName}"...</p>
            </div>
          ) : auditResult ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Overall Status</h3>
                <Badge 
                  variant="outline" 
                  className={`${getStatusColor(auditResult.status)} px-3 py-1 text-xs font-medium`}
                >
                  {auditResult.status}
                </Badge>
              </div>

              <Separator />

              <div>
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection('issues')}
                >
                  <h3 className="text-lg font-medium">Issues Found ({auditResult.issues.length})</h3>
                  <span className="text-sm text-muted-foreground">
                    {expandedSections.issues ? 'Hide' : 'Show'}
                  </span>
                </div>
                
                {expandedSections.issues && (
                  <div className="mt-2">
                    {auditResult.issues.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No issues found. Everything looks good!</p>
                    ) : (
                      <ScrollArea className="h-32 rounded-md border p-2">
                        <ul className="text-sm space-y-1">
                          {auditResult.issues.map((issue, index) => (
                            <li key={index} className="py-1 flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
                              <span>{issue}</span>
                            </li>
                          ))}
                        </ul>
                      </ScrollArea>
                    )}
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection('apis')}
                >
                  <h3 className="text-lg font-medium">APIs</h3>
                  <span className="text-sm text-muted-foreground">
                    {expandedSections.apis ? 'Hide' : 'Show'}
                  </span>
                </div>
                
                {expandedSections.apis && (
                  <div className="mt-2 space-y-2">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Connected APIs</h4>
                      <div className="flex flex-wrap gap-1">
                        {auditResult.APIs_used.length === 0 ? (
                          <span className="text-sm text-muted-foreground">No connected APIs detected</span>
                        ) : (
                          auditResult.APIs_used.map((api, index) => (
                            <Badge key={index} variant="outline" className="bg-green-100 text-green-800 border-green-300">
                              {api}
                            </Badge>
                          ))
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Missing or Disconnected APIs</h4>
                      <div className="flex flex-wrap gap-1">
                        {auditResult.APIs_missing_or_disconnected.length === 0 ? (
                          <span className="text-sm text-muted-foreground">All required APIs are connected</span>
                        ) : (
                          auditResult.APIs_missing_or_disconnected.map((api, index) => (
                            <Badge key={index} variant="outline" className="bg-red-100 text-red-800 border-red-300">
                              {api}
                            </Badge>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-4">
              No audit data available. Click "Run Again" to audit this tab.
            </p>
          )}
        </TabsContent>

        <TabsContent value="apis" className="p-4 pt-2">
          <APIsStatusPanel />
        </TabsContent>

        <TabsContent value="json" className="p-4 pt-2">
          {auditResult ? (
            <div className="relative">
              <pre className="text-xs bg-muted p-4 rounded-md overflow-auto max-h-96">
                {formatAuditResults(auditResult)}
              </pre>
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => {
                  navigator.clipboard.writeText(formatAuditResults(auditResult));
                }}
              >
                Copy
              </Button>
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-4">
              No JSON report available yet.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}

function APIsStatusPanel() {
  const [apiSummary, setApiSummary] = useState<{
    connected: string[];
    limited: string[];
    disconnected: string[];
    unknown: string[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchApiStatus = async () => {
      setIsLoading(true);
      try {
        const summary = await getApiStatusSummary();
        setApiSummary(summary);
      } catch (error) {
        console.error('Error fetching API status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApiStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="ml-2 text-sm text-muted-foreground">Loading API status...</p>
      </div>
    );
  }

  if (!apiSummary) {
    return (
      <p className="text-center text-sm text-muted-foreground py-4">
        Unable to fetch API status information.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-md font-medium mb-2">Connected APIs</h3>
        <div className="flex flex-wrap gap-1">
          {apiSummary.connected.length === 0 ? (
            <p className="text-sm text-muted-foreground">No connected APIs detected</p>
          ) : (
            apiSummary.connected.map((api, index) => (
              <Badge key={index} variant="outline" className="bg-green-100 text-green-800 border-green-300">
                {api}
              </Badge>
            ))
          )}
        </div>
      </div>

      <div>
        <h3 className="text-md font-medium mb-2">Limited APIs</h3>
        <div className="flex flex-wrap gap-1">
          {apiSummary.limited.length === 0 ? (
            <p className="text-sm text-muted-foreground">No APIs with limited access</p>
          ) : (
            apiSummary.limited.map((api, index) => (
              <Badge key={index} variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                {api}
              </Badge>
            ))
          )}
        </div>
      </div>

      <div>
        <h3 className="text-md font-medium mb-2">Disconnected APIs</h3>
        <div className="flex flex-wrap gap-1">
          {apiSummary.disconnected.length === 0 ? (
            <p className="text-sm text-muted-foreground">No disconnected APIs</p>
          ) : (
            apiSummary.disconnected.map((api, index) => (
              <Badge key={index} variant="outline" className="bg-red-100 text-red-800 border-red-300">
                {api}
              </Badge>
            ))
          )}
        </div>
      </div>

      <div>
        <h3 className="text-md font-medium mb-2">Unknown Status</h3>
        <div className="flex flex-wrap gap-1">
          {apiSummary.unknown.length === 0 ? (
            <p className="text-sm text-muted-foreground">No APIs with unknown status</p>
          ) : (
            apiSummary.unknown.map((api, index) => (
              <Badge key={index} variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">
                {api}
              </Badge>
            ))
          )}
        </div>
      </div>
    </div>
  );
}