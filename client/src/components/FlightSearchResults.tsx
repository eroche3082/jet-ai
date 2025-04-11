import React, { useState, useEffect } from 'react';
import { format, parseISO, addMinutes } from 'date-fns';
import { searchFlights, type FlightResult, type FlightSearchParams } from '../lib/flights';
import { 
  Plane,
  Clock,
  ArrowRight, 
  CalendarDays, 
  ChevronDown, 
  ChevronUp,
  Loader2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface FlightSearchResultsProps {
  origin: string | null;
  destination: string | null;
  departureDate?: string | null;
  returnDate?: string | null;
  travelers?: string | null;
  cabinClass?: string | null;
  onClose?: () => void;
  onBookFlight?: (flight: FlightResult) => void;
}

export default function FlightSearchResults({ 
  origin, 
  destination, 
  departureDate, 
  returnDate, 
  travelers,
  cabinClass,
  onClose,
  onBookFlight 
}: FlightSearchResultsProps) {
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [flights, setFlights] = useState<FlightResult[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<FlightResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<FlightResult | null>(null);
  
  // Filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedAirlines, setSelectedAirlines] = useState<Set<string>>(new Set());
  const [directOnly, setDirectOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'departure' | 'arrival'>('price');
  const [filterVisible, setFilterVisible] = useState(true);
  const [searchFormData, setSearchFormData] = useState({
    origin: origin || '',
    destination: destination || '',
    departureDate: departureDate || '',
    returnDate: returnDate || '',
    travelers: travelers || '1',
    cabinClass: cabinClass || 'economy'
  });

  // Search flights on component mount
  useEffect(() => {
    if (origin && destination) {
      fetchFlights();
    } else {
      setIsLoading(false);
    }
  }, [origin, destination, departureDate, returnDate]);

  // Apply filters whenever they change
  useEffect(() => {
    applyFilters();
  }, [flights, priceRange, selectedAirlines, directOnly, sortBy]);

  // Fetch flights from the API
  const fetchFlights = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Create search params
      const params: FlightSearchParams = {
        origin: origin || '',
        destination: destination || '',
        departureDate: departureDate || new Date().toISOString().split('T')[0],
        returnDate: returnDate || undefined,
        adults: travelers ? parseInt(travelers) : 1,
        cabinClass: cabinClass === 'business' ? 'business' : 
                   cabinClass === 'first' ? 'first' : 
                   cabinClass === 'premium_economy' ? 'premium_economy' : 'economy',
      };

      const results = await searchFlights(params);
      setFlights(results);
      
      // Set initial price range based on results
      if (results.length > 0) {
        const prices = results.map(f => f.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPriceRange([minPrice, maxPrice]);
      }

    } catch (err) {
      console.error('Error fetching flights:', err);
      setError('Unable to load flight data. Please try again.');
      setFlights([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters to the flight results
  const applyFilters = () => {
    if (!flights.length) {
      setFilteredFlights([]);
      return;
    }

    let filtered = [...flights];

    // Apply price filter
    filtered = filtered.filter(
      flight => flight.price >= priceRange[0] && flight.price <= priceRange[1]
    );

    // Apply airline filter
    if (selectedAirlines.size > 0) {
      filtered = filtered.filter(
        flight => selectedAirlines.has(flight.airline)
      );
    }

    // Apply direct filter
    if (directOnly) {
      filtered = filtered.filter(flight => flight.stops === 0);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'duration':
        filtered.sort((a, b) => a.duration - b.duration);
        break;
      case 'departure':
        filtered.sort((a, b) => new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime());
        break;
      case 'arrival':
        filtered.sort((a, b) => new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime());
        break;
    }

    setFilteredFlights(filtered);
  };

  // Format duration from minutes to hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Format date and time
  const formatDateTime = (dateTimeString: string, formatString = 'MMM d, h:mm a') => {
    try {
      const date = parseISO(dateTimeString);
      return format(date, formatString);
    } catch (e) {
      return dateTimeString;
    }
  };

  // Handle search form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchFormData.origin || !searchFormData.destination) {
      setError('Origin and destination are required.');
      return;
    }

    setIsLoading(true);
    
    // Update the parameters for the new search
    const params: FlightSearchParams = {
      origin: searchFormData.origin,
      destination: searchFormData.destination,
      departureDate: searchFormData.departureDate || new Date().toISOString().split('T')[0],
      returnDate: searchFormData.returnDate || undefined,
      adults: parseInt(searchFormData.travelers) || 1,
      cabinClass: searchFormData.cabinClass === 'business' ? 'business' : 
                  searchFormData.cabinClass === 'first' ? 'first' : 
                  searchFormData.cabinClass === 'premium_economy' ? 'premium_economy' : 'economy',
    };

    // Perform the search
    searchFlights(params)
      .then(results => {
        setFlights(results);
        
        // Reset filters
        if (results.length > 0) {
          const prices = results.map(f => f.price);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          setPriceRange([minPrice, maxPrice]);
        }
        
        setSelectedAirlines(new Set());
        setDirectOnly(false);
        setError(null);
      })
      .catch(err => {
        console.error('Error fetching flights:', err);
        setError('Unable to load flight data. Please try again.');
        setFlights([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Toggle an airline in the filter
  const toggleAirline = (airline: string) => {
    const newSelectedAirlines = new Set(selectedAirlines);
    if (newSelectedAirlines.has(airline)) {
      newSelectedAirlines.delete(airline);
    } else {
      newSelectedAirlines.add(airline);
    }
    setSelectedAirlines(newSelectedAirlines);
  };

  // Get unique airlines from results
  const getUniqueAirlines = () => {
    const airlines = new Set<string>();
    flights.forEach(flight => airlines.add(flight.airline));
    return Array.from(airlines);
  };

  // Calculate the price range
  const getPriceRange = () => {
    if (!flights.length) return [0, 0];
    const prices = flights.map(f => f.price);
    return [Math.min(...prices), Math.max(...prices)];
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Searching for the best flights...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-lg bg-red-50 text-red-800">
        <h3 className="font-semibold">Error</h3>
        <p>{error}</p>
        <Button 
          variant="outline" 
          onClick={fetchFlights} 
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!origin || !destination) {
    return (
      <div className="p-6 border rounded-lg bg-muted/50">
        <h3 className="text-lg font-semibold mb-4">Search for Flights</h3>
        <p className="mb-6 text-muted-foreground">Please specify your travel details to search for flights.</p>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="origin">Origin</Label>
              <Input 
                id="origin"
                name="origin"
                placeholder="City or airport code"
                value={searchFormData.origin}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="destination">Destination</Label>
              <Input 
                id="destination"
                name="destination"
                placeholder="City or airport code"
                value={searchFormData.destination}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="departureDate">Departure Date</Label>
              <Input 
                id="departureDate"
                name="departureDate"
                type="date"
                value={searchFormData.departureDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="returnDate">Return Date (Optional)</Label>
              <Input 
                id="returnDate"
                name="returnDate"
                type="date"
                value={searchFormData.returnDate}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="travelers">Travelers</Label>
              <Input 
                id="travelers"
                name="travelers"
                type="number"
                min="1"
                value={searchFormData.travelers}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="cabinClass">Cabin Class</Label>
              <Select 
                name="cabinClass" 
                value={searchFormData.cabinClass}
                onValueChange={(value) => setSearchFormData(prev => ({ ...prev, cabinClass: value }))}
              >
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
          </div>
          
          <Button type="submit" className="w-full">
            <Plane className="h-4 w-4 mr-2" />
            Search Flights
          </Button>
        </form>
      </div>
    );
  }

  if (flights.length === 0) {
    return (
      <div className="p-6 border rounded-lg bg-muted/50 text-center">
        <h3 className="text-lg font-semibold mb-4">No Flights Found</h3>
        <p className="text-muted-foreground mb-6">
          We couldn't find any flights matching your criteria. Try adjusting your search parameters.
        </p>
        <Button onClick={() => {
          setSearchFormData({
            origin: origin || '',
            destination: destination || '',
            departureDate: departureDate || '',
            returnDate: returnDate || '',
            travelers: travelers || '1',
            cabinClass: cabinClass || 'economy'
          });
        }}>
          Back to Search
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold">
            <span className="mr-1">{origin}</span>
            <ArrowRight className="h-4 w-4 inline mx-1" />
            <span>{destination}</span>
          </h2>
          <p className="text-sm text-muted-foreground flex items-center mt-1">
            <CalendarDays className="h-3 w-3 mr-1" />
            {departureDate ? formatDateTime(departureDate, 'MMMM d, yyyy') : 'Flexible dates'}
            {returnDate && (
              <>
                <span className="mx-1">—</span>
                {formatDateTime(returnDate, 'MMMM d, yyyy')}
              </>
            )}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setFilterVisible(!filterVisible)}
          >
            {filterVisible ? 'Hide Filters' : 'Show Filters'}
            {filterVisible ? (
              <ChevronUp className="ml-1 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-1 h-4 w-4" />
            )}
          </Button>
          
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price">Price (Lowest)</SelectItem>
              <SelectItem value="duration">Duration (Shortest)</SelectItem>
              <SelectItem value="departure">Departure (Earliest)</SelectItem>
              <SelectItem value="arrival">Arrival (Earliest)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Filters section */}
      {filterVisible && (
        <div className="bg-muted/50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Price Range Filter */}
            <div>
              <h3 className="text-sm font-medium mb-2">Price Range</h3>
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
              <Slider
                value={[priceRange[0], priceRange[1]]}
                min={getPriceRange()[0]}
                max={getPriceRange()[1]}
                step={10}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                className="my-4"
              />
            </div>
            
            {/* Airlines Filter */}
            <div>
              <h3 className="text-sm font-medium mb-2">Airlines</h3>
              <div className="space-y-2 max-h-36 overflow-y-auto">
                {getUniqueAirlines().map(airline => (
                  <div key={airline} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`airline-${airline}`}
                      checked={selectedAirlines.has(airline)}
                      onChange={() => toggleAirline(airline)}
                      className="mr-2 h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor={`airline-${airline}`} className="text-sm">
                      {airline}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Stop Filter */}
            <div>
              <h3 className="text-sm font-medium mb-4">Stops</h3>
              <div className="flex items-center space-x-2">
                <Switch
                  id="direct-only"
                  checked={directOnly}
                  onCheckedChange={setDirectOnly}
                />
                <Label htmlFor="direct-only">Direct flights only</Label>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Flight results list */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {filteredFlights.length === 0 ? (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-muted-foreground">No flights match your filters.</p>
            <Button 
              variant="link" 
              onClick={() => {
                setPriceRange(getPriceRange());
                setSelectedAirlines(new Set());
                setDirectOnly(false);
              }}
              className="mt-2"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          filteredFlights.map(flight => (
            <Card key={flight.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                {/* Airline and flight number */}
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center mr-3">
                      <Plane className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{flight.airline}</p>
                      <p className="text-xs text-muted-foreground">{flight.flightNumber}</p>
                    </div>
                  </div>
                  {flight.cabinClass && (
                    <Badge variant="outline" className="mt-2 self-start">
                      {flight.cabinClass.replace('_', ' ')}
                    </Badge>
                  )}
                </div>
                
                {/* Flight times */}
                <div className="col-span-2 flex items-center justify-between">
                  <div className="text-center">
                    <p className="font-bold">{formatDateTime(flight.departureTime, 'h:mm a')}</p>
                    <p className="text-xs text-muted-foreground">{flight.origin}</p>
                  </div>
                  
                  <div className="flex flex-col items-center mx-4">
                    <p className="text-xs text-muted-foreground">
                      {formatDuration(flight.duration)}
                    </p>
                    <div className="relative w-24 md:w-36 h-[2px] bg-muted my-2">
                      <div className="absolute top-1/2 left-0 w-2 h-2 -mt-1 bg-primary rounded-full" />
                      <div className="absolute top-1/2 right-0 w-2 h-2 -mt-1 bg-primary rounded-full" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="font-bold">{formatDateTime(flight.arrivalTime, 'h:mm a')}</p>
                    <p className="text-xs text-muted-foreground">{flight.destination}</p>
                  </div>
                </div>
                
                {/* Price and book button */}
                <div className="flex flex-col items-end">
                  <p className="font-bold text-xl">${flight.price}</p>
                  <p className="text-xs text-muted-foreground mb-2">{flight.currency}</p>
                  
                  <Button 
                    size="sm" 
                    onClick={() => {
                      setSelectedFlight(flight);
                      if (onBookFlight) {
                        onBookFlight(flight);
                      }
                    }}
                  >
                    Select
                  </Button>
                </div>
              </div>
              
              {/* Flight details */}
              {selectedFlight?.id === flight.id && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Flight Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm"><span className="font-medium">Departure:</span> {formatDateTime(flight.departureTime, 'MMMM d, yyyy h:mm a')}</p>
                      <p className="text-sm"><span className="font-medium">Arrival:</span> {formatDateTime(flight.arrivalTime, 'MMMM d, yyyy h:mm a')}</p>
                      <p className="text-sm"><span className="font-medium">Duration:</span> {formatDuration(flight.duration)}</p>
                    </div>
                    <div>
                      <p className="text-sm"><span className="font-medium">Aircraft:</span> {flight.airlineCode} {flight.flightNumber}</p>
                      <p className="text-sm"><span className="font-medium">Cabin:</span> {flight.cabinClass.replace('_', ' ')}</p>
                      {flight.availableSeats && (
                        <p className="text-sm"><span className="font-medium">Available seats:</span> {flight.availableSeats}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}