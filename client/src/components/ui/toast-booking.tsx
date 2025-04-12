import React from 'react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Check, Clock, Calendar, MapPin, AlertTriangle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface BookingConfirmationProps {
  bookingType: 'flight' | 'hotel' | 'activity';
  bookingId: string;
  title: string;
  details: {
    location?: string;
    dates?: {
      start: string;
      end?: string;
    };
    provider?: string;
    price?: string;
    confirmation?: string;
  };
  onViewBooking?: () => void;
}

export const showBookingConfirmation = ({
  bookingType,
  bookingId,
  title,
  details,
  onViewBooking,
}: BookingConfirmationProps) => {
  toast({
    title: (
      <div className="flex items-center">
        <Check className="mr-2 h-5 w-5 text-green-500" />
        <span>Booking Confirmed</span>
      </div>
    ),
    description: (
      <Card className="border-none p-0 shadow-none">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>
            {bookingType.charAt(0).toUpperCase() + bookingType.slice(1)} • Confirmation #{bookingId.slice(-6)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1 p-3 pt-0">
          {details.location && (
            <div className="flex items-center text-sm">
              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
              {details.location}
            </div>
          )}
          {details.dates && (
            <div className="flex items-center text-sm">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              {details.dates.start}
              {details.dates.end && ` - ${details.dates.end}`}
            </div>
          )}
          {details.price && (
            <div className="flex items-center justify-between text-sm pt-2">
              <span className="font-medium">Total Price:</span>
              <span className="font-bold">{details.price}</span>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end p-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={onViewBooking}
          >
            View Booking
          </Button>
        </CardFooter>
      </Card>
    ),
    variant: 'default',
    duration: 5000,
  });
};

export const showBookingPendingToast = (bookingType: string, message: string) => {
  toast({
    title: 'Booking in Progress',
    description: (
      <div className="space-y-2">
        <div className="flex items-center">
          <Clock className="mr-2 h-4 w-4 text-muted-foreground animate-pulse" />
          <span className="text-sm">{message}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          We're processing your {bookingType} booking. This might take a moment...
        </p>
      </div>
    ),
    variant: 'default',
    duration: 10000,
  });
};

export const showBookingErrorToast = (error: string, suggestion?: string) => {
  toast({
    title: (
      <div className="flex items-center">
        <AlertTriangle className="mr-2 h-5 w-5 text-destructive" />
        <span>Booking Failed</span>
      </div>
    ),
    description: (
      <div className="space-y-2">
        <p className="text-sm">{error}</p>
        {suggestion && (
          <p className="text-xs text-muted-foreground">{suggestion}</p>
        )}
      </div>
    ),
    variant: 'destructive',
    duration: 5000,
  });
};