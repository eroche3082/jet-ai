import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Plane, RotateCw } from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import FlightSearchResults from '@/components/FlightSearchResults';

export default function FlightsPage() {
  const [tripType, setTripType] = useState<'roundtrip' | 'oneway'>('roundtrip');
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [departureDate, setDepartureDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [travelers, setTravelers] = useState<number>(1);
  const [cabinClass, setCabinClass] = useState<string>('economy');
  const [showResults, setShowResults] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = () => {
    if (!origin || !destination || !departureDate || (tripType === 'roundtrip' && !returnDate)) return;
    
    setLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      setShowResults(true);
      setLoading(false);
    }, 1000);
  };

  const swapOriginDestination = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Find Flights</h1>
      
      <Card className="mb-8">
        <CardContent className="p-6">
          <Tabs defaultValue="roundtrip" onValueChange={(v) => setTripType(v as 'roundtrip' | 'oneway')}>
            <TabsList className="mb-6">
              <TabsTrigger value="roundtrip">Round Trip</TabsTrigger>
              <TabsTrigger value="oneway">One Way</TabsTrigger>
            </TabsList>
            
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {/* Origin */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">From</label>
                <div className="relative">
                  <Input 
                    placeholder="City or airport" 
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="pr-10"
                  />
                  <button 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={swapOriginDestination}
                    type="button"
                  >
                    <RotateCw className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Destination */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">To</label>
                <Input 
                  placeholder="City or airport" 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
              
              {/* Departure Date */}
              <div className="md:col-span-1">
                <label className="block text-sm font-medium mb-1">Departure</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !departureDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {departureDate ? format(departureDate, "MMM d, yyyy") : <span>Select</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={departureDate}
                      onSelect={setDepartureDate}
                      initialFocus
                      disabled={(date) => 
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              {/* Return Date */}
              {tripType === 'roundtrip' && (
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium mb-1">Return</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !returnDate && "text-muted-foreground"
                        )}
                        disabled={!departureDate}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {returnDate ? format(returnDate, "MMM d, yyyy") : <span>Select</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={returnDate}
                        onSelect={setReturnDate}
                        initialFocus
                        disabled={(date) => 
                          !departureDate || date <= departureDate || date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
              
              {/* Search button for small screens */}
              <div className="md:hidden mt-2">
                <Button
                  onClick={handleSearch}
                  disabled={!origin || !destination || !departureDate || (tripType === 'roundtrip' && !returnDate) || loading}
                  className="w-full"
                >
                  {loading ? 'Searching...' : 'Search Flights'}
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-4">
              {/* Travelers */}
              <div className="md:col-span-1">
                <label className="block text-sm font-medium mb-1">Travelers</label>
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setTravelers(Math.max(1, travelers - 1))}
                  >
                    -
                  </Button>
                  <span className="mx-4">{travelers}</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setTravelers(travelers + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
              
              {/* Cabin Class */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Cabin Class</label>
                <Select value={cabinClass} onValueChange={setCabinClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cabin class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economy">Economy</SelectItem>
                    <SelectItem value="premium_economy">Premium Economy</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="first">First Class</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Search button for larger screens */}
              <div className="hidden md:block md:col-span-3 flex items-end">
                <Button
                  onClick={handleSearch}
                  disabled={!origin || !destination || !departureDate || (tripType === 'roundtrip' && !returnDate) || loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? 'Searching...' : 'Search Flights'}
                </Button>
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Flight Search Results */}
      {showResults ? (
        <FlightSearchResults 
          origin={origin}
          destination={destination}
          departureDate={departureDate ? format(departureDate, 'yyyy-MM-dd') : null}
          returnDate={returnDate ? format(returnDate, 'yyyy-MM-dd') : null}
          travelers={travelers}
          cabinClass={cabinClass}
          onBookFlight={() => {}}
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 text-primary opacity-75">
              <Plane className="w-full h-full" />
            </div>
            <h3 className="text-xl font-medium mb-2">Ready for takeoff?</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Search for flights to your destination. Enter your travel details above and click "Search Flights" to begin.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}