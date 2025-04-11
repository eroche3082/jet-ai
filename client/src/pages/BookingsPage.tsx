import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription, 
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar as CalendarIcon,
  Clock,
  FileText, 
  Hotel, 
  Luggage, 
  MapPin, 
  Plane,
  Users,
  DownloadCloud,
  Printer,
  Mail,
  Info
} from 'lucide-react';
import { format, addDays } from 'date-fns';

// Types
interface Booking {
  id: string;
  type: 'flight' | 'hotel' | 'experience';
  status: 'upcoming' | 'completed' | 'cancelled';
  title: string;
  location: string;
  startDate: Date;
  endDate?: Date;
  bookingDate: Date;
  bookingRef: string;
  price: number;
  image?: string;
  details: {
    [key: string]: string | number | boolean;
  };
}

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<string>('upcoming');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState<boolean>(false);
  
  // Generate sample bookings for demonstration
  const generateSampleBookings = (): Booking[] => {
    const now = new Date();
    const bookings: Booking[] = [
      {
        id: '1',
        type: 'flight',
        status: 'upcoming',
        title: 'Flight to Paris',
        location: 'Paris, France',
        startDate: addDays(now, 15),
        endDate: addDays(now, 22),
        bookingDate: new Date(now.setDate(now.getDate() - 30)),
        bookingRef: 'FL928374',
        price: 580,
        details: {
          airline: 'Air France',
          flightNumber: 'AF1234',
          departureTime: '14:30',
          departureAirport: 'JFK',
          arrivalTime: '06:45',
          arrivalAirport: 'CDG',
          seats: '12C, 12D',
          class: 'Economy',
        }
      },
      {
        id: '2',
        type: 'hotel',
        status: 'upcoming',
        title: 'Grand Hotel Paris',
        location: 'Paris, France',
        startDate: addDays(now, 15),
        endDate: addDays(now, 22),
        bookingDate: new Date(now.setDate(now.getDate() - 30)),
        bookingRef: 'HT283947',
        price: 1200,
        image: 'https://placehold.co/600x400/d1d5db/6b7280?text=Grand+Hotel',
        details: {
          roomType: 'Deluxe Double',
          guests: 2,
          beds: 'King Size',
          checkInTime: '15:00',
          checkOutTime: '11:00',
          breakfast: true,
          wifiIncluded: true,
          policyNumber: 'POL-2345-HOT',
        }
      },
      {
        id: '3',
        type: 'experience',
        status: 'upcoming',
        title: 'Louvre Museum Tour',
        location: 'Paris, France',
        startDate: addDays(now, 17),
        bookingDate: new Date(now.setDate(now.getDate() - 15)),
        bookingRef: 'EX192837',
        price: 75,
        details: {
          duration: '3 hours',
          startTime: '10:00',
          meetingPoint: 'Louvre Pyramid',
          guideLanguage: 'English',
          includedItems: 'Skip-the-line ticket, Guided tour',
          maxGroupSize: 8,
        }
      },
      {
        id: '4',
        type: 'flight',
        status: 'completed',
        title: 'Flight to Rome',
        location: 'Rome, Italy',
        startDate: addDays(now, -45),
        endDate: addDays(now, -38),
        bookingDate: addDays(now, -90),
        bookingRef: 'FL746352',
        price: 420,
        details: {
          airline: 'Alitalia',
          flightNumber: 'AZ1234',
          departureTime: '10:15',
          departureAirport: 'JFK',
          arrivalTime: '12:30',
          arrivalAirport: 'FCO',
          seats: '18A, 18B',
          class: 'Economy',
        }
      },
      {
        id: '5',
        type: 'hotel',
        status: 'completed',
        title: 'Hotel Colosseum',
        location: 'Rome, Italy',
        startDate: addDays(now, -45),
        endDate: addDays(now, -38),
        bookingDate: addDays(now, -90),
        bookingRef: 'HT638294',
        price: 880,
        image: 'https://placehold.co/600x400/d1d5db/6b7280?text=Hotel+Colosseum',
        details: {
          roomType: 'Superior Room',
          guests: 2,
          beds: 'Queen Size',
          checkInTime: '14:00',
          checkOutTime: '10:00',
          breakfast: true,
          wifiIncluded: true,
          policyNumber: 'POL-7821-HOT',
        }
      },
      {
        id: '6',
        type: 'flight',
        status: 'cancelled',
        title: 'Flight to Tokyo',
        location: 'Tokyo, Japan',
        startDate: addDays(now, -20),
        endDate: addDays(now, -10),
        bookingDate: addDays(now, -120),
        bookingRef: 'FL928374',
        price: 1280,
        details: {
          airline: 'JAL',
          flightNumber: 'JL5678',
          departureTime: '13:45',
          departureAirport: 'JFK',
          arrivalTime: '17:30',
          arrivalAirport: 'NRT',
          cancellationReason: 'Flight canceled due to operational constraints',
          refundStatus: 'Refunded on ' + format(addDays(now, -15), 'MMM d, yyyy'),
        }
      },
    ];
    
    return bookings;
  };
  
  const bookings = generateSampleBookings();
  
  // Filter bookings based on active tab
  const filteredBookings = bookings.filter(booking => booking.status === activeTab);
  
  // View booking details
  const viewBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetailDialog(true);
  };
  
  // Get appropriate icon for booking type
  const getBookingTypeIcon = (type: string) => {
    switch (type) {
      case 'flight':
        return <Plane className="h-5 w-5" />;
      case 'hotel':
        return <Hotel className="h-5 w-5" />;
      case 'experience':
        return <Luggage className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  // Format date range
  const formatDateRange = (startDate: Date, endDate?: Date) => {
    if (!endDate) {
      return format(startDate, 'MMM d, yyyy');
    }
    
    if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
      return `${format(startDate, 'MMM d')} - ${format(endDate, 'd, yyyy')}`;
    }
    
    return `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`;
  };
  
  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full sm:w-[400px]">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          {filteredBookings.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">No {activeTab} bookings</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  {activeTab === 'upcoming'
                    ? "You don't have any upcoming bookings. Start planning your next adventure!"
                    : activeTab === 'completed'
                    ? "You don't have any completed bookings yet."
                    : "You don't have any cancelled bookings."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden">
                  {booking.image && (
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={booking.image} 
                        alt={booking.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `https://placehold.co/600x400/d1d5db/6b7280?text=${encodeURIComponent(booking.title)}`;
                        }}
                      />
                    </div>
                  )}
                  
                  <CardContent className={booking.image ? 'pt-4' : 'pt-6'}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <div className={`mr-3 p-2 rounded-full ${
                          booking.type === 'flight'
                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                            : booking.type === 'hotel'
                            ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                          {getBookingTypeIcon(booking.type)}
                        </div>
                        <div>
                          <h3 className="font-medium">{booking.title}</h3>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            {booking.location}
                          </div>
                        </div>
                      </div>
                      
                      <Badge className={getStatusBadgeColor(booking.status)}>
                        {booking.status === 'upcoming' ? 'Upcoming' : 
                         booking.status === 'completed' ? 'Completed' : 'Cancelled'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center text-sm">
                        <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{formatDateRange(booking.startDate, booking.endDate)}</span>
                      </div>
                      
                      {booking.type === 'flight' && (
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{booking.details.departureTime as string} - {booking.details.arrivalTime as string}</span>
                        </div>
                      )}
                      
                      {booking.type === 'hotel' && (
                        <div className="flex items-center text-sm">
                          <Users className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{booking.details.guests} guests, {booking.details.roomType}</span>
                        </div>
                      )}
                      
                      {booking.type === 'experience' && (
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{booking.details.startTime}, {booking.details.duration}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-sm">
                        <FileText className="h-4 w-4 mr-2 text-gray-500" />
                        <span>Booking Ref: {booking.bookingRef}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-3 border-t">
                      <span className="font-medium">${booking.price.toFixed(2)}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewBookingDetails(booking)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Booking Details Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  {getBookingTypeIcon(selectedBooking.type)}
                  <span className="ml-2">{selectedBooking.title}</span>
                </DialogTitle>
                <DialogDescription>
                  Booking reference: {selectedBooking.bookingRef}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Booking Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex">
                      <span className="font-medium w-1/2">Status:</span>
                      <Badge className={getStatusBadgeColor(selectedBooking.status)}>
                        {selectedBooking.status === 'upcoming' ? 'Upcoming' : 
                         selectedBooking.status === 'completed' ? 'Completed' : 'Cancelled'}
                      </Badge>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-1/2">Date:</span>
                      <span>{formatDateRange(selectedBooking.startDate, selectedBooking.endDate)}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-1/2">Location:</span>
                      <span>{selectedBooking.location}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-1/2">Booking Date:</span>
                      <span>{format(selectedBooking.bookingDate, 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-1/2">Total Price:</span>
                      <span>${selectedBooking.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2 space-y-4">
                  <h4 className="text-sm font-medium">Details</h4>
                  <div className="space-y-2 text-sm">
                    {Object.entries(selectedBooking.details).map(([key, value]) => (
                      <div key={key} className="flex">
                        <span className="font-medium w-1/3 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span className="w-2/3">
                          {typeof value === 'boolean' 
                            ? value ? 'Yes' : 'No' 
                            : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {selectedBooking.status === 'cancelled' && (
                    <div className="p-3 bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-300 rounded-md flex">
                      <Info className="h-5 w-5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Booking Cancelled</p>
                        <p className="text-sm mt-1">
                          {selectedBooking.details.cancellationReason || 'This booking has been cancelled.'}
                        </p>
                        {selectedBooking.details.refundStatus && (
                          <p className="text-sm mt-1">
                            Refund status: {selectedBooking.details.refundStatus}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <DialogFooter className="sm:justify-between">
                <div className="hidden sm:flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm">
                    <DownloadCloud className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                </div>
                <Button onClick={() => setShowDetailDialog(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}