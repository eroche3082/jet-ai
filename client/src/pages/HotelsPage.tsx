import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import HotelSearchResults from '@/components/HotelSearchResults';

export default function HotelsPage() {
  const [location, setLocation] = useState<string>('');
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState<number>(2);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [rating, setRating] = useState<number>(0);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = () => {
    if (!location || !checkIn || !checkOut) return;
    
    setLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      setShowResults(true);
      setLoading(false);
    }, 1000);
  };

  const toggleAmenity = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter(a => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Find Your Perfect Stay</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Search Panel */}
        <Card className="md:col-span-1">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <Input 
                  placeholder="City, region, or hotel name" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Check-in</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !checkIn && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkIn ? format(checkIn, "PPP") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={checkIn}
                      onSelect={setCheckIn}
                      initialFocus
                      disabled={(date) => 
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Check-out</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !checkOut && "text-muted-foreground"
                      )}
                      disabled={!checkIn}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkOut ? format(checkOut, "PPP") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={checkOut}
                      onSelect={setCheckOut}
                      initialFocus
                      disabled={(date) => 
                        !checkIn || date <= checkIn || date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Guests</label>
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                  >
                    -
                  </Button>
                  <span className="mx-4">{guests}</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setGuests(guests + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <Slider
                  value={[priceRange[0], priceRange[1]]}
                  min={0}
                  max={1000}
                  step={10}
                  onValueChange={(value) => setPriceRange([value[0], value[1]])}
                  className="mt-3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Amenities</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Wi-Fi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Parking'].map((amenity) => (
                    <div
                      key={amenity}
                      className={`p-2 text-xs border rounded-md cursor-pointer text-center ${
                        amenities.includes(amenity) 
                          ? 'bg-primary/10 border-primary' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => toggleAmenity(amenity)}
                    >
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
              
              <Button
                onClick={handleSearch}
                disabled={!location || !checkIn || !checkOut || loading}
                className="w-full"
              >
                {loading ? 'Searching...' : 'Search Hotels'}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Results */}
        <div className="md:col-span-3">
          {showResults ? (
            <HotelSearchResults 
              location={location}
              checkIn={checkIn ? format(checkIn, 'yyyy-MM-dd') : ''}
              checkOut={checkOut ? format(checkOut, 'yyyy-MM-dd') : ''}
              guests={guests}
              priceRange={priceRange}
              amenities={amenities}
              onBookHotel={() => {}}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-center">
                <h3 className="text-xl font-medium mb-2">Ready to find your perfect stay?</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Search for hotels, apartments, and unique accommodations
                </p>
                <img 
                  src="/images/hotel-illustration.svg" 
                  alt="Hotel illustration" 
                  className="mx-auto w-64 h-64 opacity-75"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/400x400/d1d5db/6b7280?text=JetAI+Hotels';
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}