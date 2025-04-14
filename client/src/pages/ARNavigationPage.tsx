import React, { useEffect, useState } from 'react';
import ARNavigationPanel from '@/components/ARNavigationPanel';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const ARNavigationPage: React.FC = () => {
  const { toast } = useToast();
  const [serviceStatus, setServiceStatus] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Test AR Navigation services when the component mounts
    const testServices = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/ar-navigation/test');
        
        if (!response.ok) {
          throw new Error('Failed to test AR navigation services');
        }
        
        const data = await response.json();
        
        // Create a map of service status
        const statusMap: Record<string, boolean> = {};
        data.testResults.forEach((result: { service: string; status: string }) => {
          statusMap[result.service] = result.status === 'SUCCESS';
        });
        
        setServiceStatus(statusMap);
        setHasError(false);
        
        // Show toast with success rate
        toast({
          title: "AR Services Check",
          description: `${data.summary.successCount}/${data.summary.totalTests} services operational (${data.summary.successRate})`,
          variant: data.summary.successRate === "100.0%" ? "default" : "destructive",
        });
      } catch (error) {
        console.error('Error testing AR services:', error);
        setHasError(true);
        toast({
          title: "Service Test Failed",
          description: "Could not check AR navigation services",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    testServices();
  }, [toast]);

  const renderServiceStatus = () => {
    if (isLoading) {
      return (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Checking services...</AlertTitle>
          <AlertDescription>
            Verifying AR navigation services...
          </AlertDescription>
        </Alert>
      );
    }
    
    if (hasError) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Service Status Unavailable</AlertTitle>
          <AlertDescription>
            Could not check AR navigation services. Some features may not work properly.
          </AlertDescription>
        </Alert>
      );
    }
    
    return (
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">AR Navigation Service Status</CardTitle>
          <CardDescription>
            Real-time status of services powering the AR navigation features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(serviceStatus).map(([service, isActive]) => (
              <div key={service} className="flex flex-col items-center border rounded-md p-3 bg-card">
                <div className={`rounded-full p-1 ${isActive ? 'text-green-500' : 'text-red-500'}`}>
                  {isActive ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <AlertCircle className="h-5 w-5" />
                  )}
                </div>
                <div className="text-sm font-medium mt-1 text-center">
                  {service.replace('API', '').trim()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-2">
          Augmented Reality Travel Companion
        </h1>
        <p className="text-muted-foreground mb-6">
          Navigate and explore destinations with AR-powered features and real-time information
        </p>
        
        <Separator className="my-6" />
        
        {renderServiceStatus()}
        
        <ARNavigationPanel />
      </div>
    </MainLayout>
  );
};

export default ARNavigationPage;