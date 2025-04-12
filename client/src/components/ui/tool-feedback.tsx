import React from 'react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, AlertTriangle, Smartphone, Globe, Compass, RefreshCw, Volume2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Tool type definitions
export type ToolType = 
  | 'translate' 
  | 'currency' 
  | 'phrasebook' 
  | 'weather' 
  | 'locator' 
  | 'safety' 
  | 'pronunciation';

interface ToolIconProps {
  tool: ToolType;
  className?: string;
}

// Tool icon component
export const ToolIcon: React.FC<ToolIconProps> = ({ tool, className }) => {
  switch (tool) {
    case 'translate':
      return <Globe className={className} />;
    case 'currency':
      return <RefreshCw className={className} />;
    case 'phrasebook':
      return <Volume2 className={className} />;
    case 'weather':
      return <Compass className={className} />;
    case 'locator':
      return <Smartphone className={className} />;
    case 'safety':
      return <AlertTriangle className={className} />;
    case 'pronunciation':
      return <Volume2 className={className} />;
    default:
      return <Globe className={className} />;
  }
};

interface ToolFeedbackProps {
  title: string;
  description?: string;
  toolType: ToolType;
  status: 'loading' | 'success' | 'error' | 'offline' | 'fallback';
  details?: React.ReactNode;
  onAction?: () => void;
  actionLabel?: string;
}

// Loading state feedback
export const showToolLoading = (toolType: ToolType, title: string, description?: string) => {
  const id = toast({
    title: (
      <div className="flex items-center">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        <span>{title}</span>
      </div>
    ),
    description: description,
    duration: 30000, // Long duration as we'll dismiss it manually
  });
  
  return id;
};

// Success feedback
export const showToolSuccess = (
  toolType: ToolType, 
  title: string, 
  details?: React.ReactNode,
  onAction?: () => void,
  actionLabel?: string
) => {
  toast({
    title: (
      <div className="flex items-center">
        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
        <span>{title}</span>
      </div>
    ),
    description: (
      <div className="space-y-2">
        {details && (
          <Card className="border-none p-0 shadow-none">
            <CardContent className="p-3 pt-2">
              {details}
            </CardContent>
            {onAction && actionLabel && (
              <CardFooter className="p-3 pt-0 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-xs"
                  onClick={onAction}
                >
                  {actionLabel}
                </Button>
              </CardFooter>
            )}
          </Card>
        )}
      </div>
    ),
    duration: 6000,
  });
};

// Error feedback
export const showToolError = (
  toolType: ToolType, 
  errorMessage: string, 
  suggestion?: string,
  onRetry?: () => void
) => {
  toast({
    title: (
      <div className="flex items-center">
        <AlertTriangle className="mr-2 h-4 w-4 text-destructive" />
        <span>Tool Error</span>
      </div>
    ),
    description: (
      <div className="space-y-2">
        <p className="text-sm">{errorMessage}</p>
        {suggestion && (
          <p className="text-xs text-muted-foreground">{suggestion}</p>
        )}
        {onRetry && (
          <div className="pt-2 flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 text-xs"
              onClick={onRetry}
            >
              Try Again
            </Button>
          </div>
        )}
      </div>
    ),
    variant: 'destructive',
    duration: 5000,
  });
};

// Fallback feedback
export const showToolFallback = (
  toolType: ToolType, 
  title: string, 
  fallbackMessage: string,
  details?: React.ReactNode
) => {
  toast({
    title: (
      <div className="flex items-center">
        <ToolIcon tool={toolType} className="mr-2 h-4 w-4" />
        <span>{title}</span>
      </div>
    ),
    description: (
      <div className="space-y-2">
        <p className="text-sm text-amber-600">{fallbackMessage}</p>
        {details && (
          <Card className="mt-2 border-none p-0 shadow-none">
            <CardContent className="p-3 pt-0">
              {details}
            </CardContent>
          </Card>
        )}
      </div>
    ),
    duration: 5000,
  });
};

// Offline feedback
export const showToolOffline = (
  toolType: ToolType, 
  offlineCapabilities: string
) => {
  toast({
    title: (
      <div className="flex items-center">
        <Smartphone className="mr-2 h-4 w-4" />
        <span>Offline Mode</span>
      </div>
    ),
    description: (
      <div className="space-y-2">
        <p className="text-sm">You appear to be offline. Limited functionality available.</p>
        <p className="text-xs text-muted-foreground">{offlineCapabilities}</p>
      </div>
    ),
    duration: 4000,
  });
};

// Status feedback component
export const ToolFeedback: React.FC<ToolFeedbackProps> = ({
  title,
  description,
  toolType,
  status,
  details,
  onAction,
  actionLabel,
}) => {
  switch (status) {
    case 'loading':
      return (
        <div className="p-4 bg-card rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-muted-foreground" />
            <div>
              <h3 className="font-medium">{title}</h3>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
          </div>
        </div>
      );
    
    case 'success':
      return (
        <div className="p-4 bg-card rounded-lg shadow-sm border">
          <div className="flex items-start">
            <CheckCircle2 className="mr-3 h-5 w-5 text-green-500 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium">{title}</h3>
              {description && (
                <p className="text-sm text-muted-foreground mb-2">{description}</p>
              )}
              
              {details && (
                <div className="mt-2 mb-2">{details}</div>
              )}
              
              {onAction && actionLabel && (
                <div className="mt-3 flex justify-end">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={onAction}
                  >
                    {actionLabel}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    
    case 'error':
      return (
        <div className="p-4 bg-destructive/10 rounded-lg shadow-sm border border-destructive/20">
          <div className="flex items-start">
            <AlertTriangle className="mr-3 h-5 w-5 text-destructive mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium">{title}</h3>
              {description && (
                <p className="text-sm text-muted-foreground mb-2">{description}</p>
              )}
              
              {details && (
                <div className="mt-2 mb-2">{details}</div>
              )}
              
              {onAction && actionLabel && (
                <div className="mt-3 flex justify-end">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={onAction}
                  >
                    {actionLabel}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    
    case 'offline':
      return (
        <div className="p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg shadow-sm border border-orange-200 dark:border-orange-800">
          <div className="flex items-start">
            <Smartphone className="mr-3 h-5 w-5 text-orange-500 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium">Offline Mode</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Limited functionality available while offline
              </p>
              
              {details && (
                <div className="mt-2 mb-2">{details}</div>
              )}
            </div>
          </div>
        </div>
      );
    
    case 'fallback':
      return (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg shadow-sm border border-amber-200 dark:border-amber-800">
          <div className="flex items-start">
            <ToolIcon 
              tool={toolType} 
              className="mr-3 h-5 w-5 text-amber-500 mt-0.5"
            />
            <div className="flex-1">
              <h3 className="font-medium">{title}</h3>
              {description && (
                <p className="text-sm text-muted-foreground mb-2">{description}</p>
              )}
              
              {details && (
                <div className="mt-2 mb-2">{details}</div>
              )}
              
              {onAction && actionLabel && (
                <div className="mt-3 flex justify-end">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={onAction}
                  >
                    {actionLabel}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      );
  }
};

export default ToolFeedback;