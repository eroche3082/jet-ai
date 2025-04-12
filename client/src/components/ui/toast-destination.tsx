import React from 'react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MapPin, Calendar, Users, Star } from 'lucide-react';

interface DestinationToastProps {
  title: string;
  description?: string;
  imageUrl?: string;
  rating?: number;
  location?: string;
  price?: string;
  onViewDetails?: () => void;
}

export const showDestinationToast = ({
  title,
  description,
  imageUrl,
  rating = 4.5,
  location,
  price,
  onViewDetails,
}: DestinationToastProps) => {
  toast({
    title: 'Destination Found',
    description: (
      <Card className="w-full border-none p-0 shadow-none">
        <div className="overflow-hidden rounded-t-lg">
          {imageUrl && (
            <img 
              src={imageUrl} 
              alt={title} 
              className="h-32 w-full object-cover transition-transform duration-300 hover:scale-105" 
            />
          )}
        </div>
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-base">{title}</CardTitle>
          {location && (
            <CardDescription className="flex items-center text-xs">
              <MapPin className="mr-1 h-3 w-3" /> {location}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="p-3 pt-0 pb-2">
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
          
          <div className="mt-2 flex items-center">
            {rating && (
              <div className="flex items-center">
                <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">{rating.toFixed(1)}</span>
              </div>
            )}
            {price && (
              <div className="ml-auto">
                <span className="text-sm font-semibold">{price}</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end p-3 pt-0">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 text-xs"
            onClick={onViewDetails}
          >
            View Details
          </Button>
        </CardFooter>
      </Card>
    ),
    variant: 'default',
    duration: 5000,
  });
};

export const showDestinationErrorToast = (error: string) => {
  toast({
    title: 'Location Search Error',
    description: (
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{error}</p>
        <p className="text-xs">Try a different search term or check your connection.</p>
      </div>
    ),
    variant: 'destructive',
    duration: 4000,
  });
};