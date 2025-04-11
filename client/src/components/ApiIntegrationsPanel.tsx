import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface ApiStatus {
  api: string;
  keyPresent: boolean;
  notes: string;
  category: 'Travel' | 'Accommodation' | 'Experience' | 'Transport' | 'Location' | 
            'Weather' | 'Payment' | 'Voice' | 'Calendar' | 'Document' | 'Loyalty' | 
            'Auth' | 'Communication' | 'Language' | 'Search' | 'AI' | 'Vision' | 'Wearable';
}

interface ApiVerificationResponse {
  apiStatuses: ApiStatus[];
  nextConnections: string[];
  message: string;
}

export default function ApiIntegrationsPanel() {
  const { toast } = useToast();

  const { data, isLoading, error, refetch } = useQuery<ApiVerificationResponse>({
    queryKey: ["/api/system/verify-integrations"],
    refetchInterval: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleRefresh = async () => {
    await refetch();
    toast({
      title: "Integration Status Refreshed",
      description: "The latest API integration status has been retrieved.",
    });
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>API Integration Status</CardTitle>
          <CardDescription>Loading integration status...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center p-6">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>API Integration Status</CardTitle>
          <CardDescription>
            There was an error loading the integration status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : "Unknown error"}
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button onClick={() => refetch()}>Try Again</Button>
        </CardFooter>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>API Integration Status</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTitle>No Integration Data</AlertTitle>
            <AlertDescription>
              The system could not retrieve API integration status.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button onClick={handleRefresh}>Refresh</Button>
        </CardFooter>
      </Card>
    );
  }

  const connectedApis = data.apiStatuses.filter(api => api.keyPresent);
  const missingApis = data.apiStatuses.filter(api => !api.keyPresent);
  const connectionPercent = Math.round(
    (connectedApis.length / data.apiStatuses.length) * 100
  );

  // Group APIs by category
  const groupApisByCategory = (apis: ApiStatus[]) => {
    const grouped: Record<string, ApiStatus[]> = {};
    
    apis.forEach(api => {
      if (!grouped[api.category]) {
        grouped[api.category] = [];
      }
      grouped[api.category].push(api);
    });
    
    return grouped;
  };

  const connectedByCategory = groupApisByCategory(connectedApis);
  const missingByCategory = groupApisByCategory(missingApis);
  
  // Categories in a specific order of importance
  const categoryOrder = [
    'Travel', 'Accommodation', 'Experience', 'Transport', 'Location', 
    'Weather', 'Payment', 'AI', 'Language', 'Voice', 'Vision',
    'Calendar', 'Document', 'Loyalty', 'Auth', 'Communication', 
    'Search', 'Wearable'
  ];
  
  // Function to get a color for each category
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Travel': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Accommodation': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Experience': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Transport': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Location': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      'Weather': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
      'Payment': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      'Voice': 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
      'Calendar': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Document': 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200',
      'Loyalty': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
      'Auth': 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
      'Communication': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'Language': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
      'Search': 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200',
      'AI': 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-200',
      'Vision': 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200',
      'Wearable': 'bg-stone-100 text-stone-800 dark:bg-stone-900 dark:text-stone-200'
    };
    
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>API Integration Status</CardTitle>
            <CardDescription>
              JetAI connectivity to external services
            </CardDescription>
          </div>
          <Badge 
            variant={connectionPercent > 70 ? "default" : connectionPercent > 30 ? "outline" : "destructive"}
            className="text-sm"
          >
            {connectionPercent}% Connected
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <AlertTitle>{data.message}</AlertTitle>
          <AlertDescription>
            {data.nextConnections.length > 0 ? (
              <>
                <span className="block mb-2">
                  Recommended next integrations:
                </span>
                <div className="flex flex-wrap gap-2">
                  {data.nextConnections.map((api) => (
                    <Badge key={api} variant="outline">
                      {api}
                    </Badge>
                  ))}
                </div>
              </>
            ) : (
              "All critical integrations are connected."
            )}
          </AlertDescription>
        </Alert>

        {/* API Category Legend */}
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">API Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categoryOrder.map((category) => (
              <span 
                key={category}
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryColor(category)}`}
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-4">Connected Services ({connectedApis.length})</h3>
        
        {Object.keys(connectedByCategory).length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No connected services found
          </div>
        ) : (
          categoryOrder
            .filter(category => connectedByCategory[category]?.length > 0)
            .map(category => (
              <div key={category} className="mb-6">
                <h4 className="text-md font-medium mb-2 flex items-center">
                  <span className={`w-3 h-3 rounded-full mr-2 ${getCategoryColor(category)}`}></span>
                  {category} ({connectedByCategory[category].length})
                </h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">API</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead className="w-[100px] text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {connectedByCategory[category].map((api) => (
                      <TableRow key={api.api}>
                        <TableCell className="font-medium">{api.api}</TableCell>
                        <TableCell>{api.notes}</TableCell>
                        <TableCell className="text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            <Check size={12} className="mr-1" />
                            Active
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))
        )}

        <Separator className="my-6" />
        
        <h3 className="text-lg font-semibold mb-4">Missing Integrations ({missingApis.length})</h3>
        
        {Object.keys(missingByCategory).length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            All services are connected
          </div>
        ) : (
          categoryOrder
            .filter(category => missingByCategory[category]?.length > 0)
            .map(category => (
              <div key={category} className="mb-6">
                <h4 className="text-md font-medium mb-2 flex items-center">
                  <span className={`w-3 h-3 rounded-full mr-2 ${getCategoryColor(category)}`}></span>
                  {category} ({missingByCategory[category].length})
                </h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">API</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead className="w-[100px] text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {missingByCategory[category].map((api) => (
                      <TableRow key={api.api}>
                        <TableCell className="font-medium">{api.api}</TableCell>
                        <TableCell>{api.notes}</TableCell>
                        <TableCell className="text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            <X size={12} className="mr-1" />
                            Missing
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleRefresh} variant="outline">
          Refresh Status
        </Button>
        <Button variant="ghost" size="sm" className="text-xs">
          <ExternalLink size={14} className="mr-1" />
          Manage API keys
        </Button>
      </CardFooter>
    </Card>
  );
}