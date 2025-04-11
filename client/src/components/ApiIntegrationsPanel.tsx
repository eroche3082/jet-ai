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

        <h3 className="text-lg font-semibold mb-2">Connected Services</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">API</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead className="w-[100px] text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {connectedApis.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                  No connected services found
                </TableCell>
              </TableRow>
            ) : (
              connectedApis.map((api) => (
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
              ))
            )}
          </TableBody>
        </Table>

        <Separator className="my-6" />
        
        <h3 className="text-lg font-semibold mb-2">Missing Integrations</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">API</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead className="w-[100px] text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {missingApis.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                  All services are connected
                </TableCell>
              </TableRow>
            ) : (
              missingApis.map((api) => (
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
              ))
            )}
          </TableBody>
        </Table>
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