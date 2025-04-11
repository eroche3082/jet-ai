import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlightResult, FlightSearchParams, searchFlights } from '../lib/flights';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plane, ArrowRight, Clock, Calendar, Users, Filter, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

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
  const [flights, setFlights] = useState<FlightResult[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<FlightResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [maxStops, setMaxStops] = useState<number>(2);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [directOnly, setDirectOnly] = useState(false);
  
  // Get all available airlines from flight results
  const airlines = [...new Set(flights.map(flight => flight.airline))];
  
  // Find min/max price in results
  const minPrice = flights.length ? Math.min(...flights.map(f => f.price)) : 0;
  const maxPrice = flights.length ? Math.max(...flights.map(f => f.price)) : 2000;
  
  useEffect(() => {
    if (origin && destination && departureDate) {
      searchFlightsData();
    }
  }, [origin, destination, departureDate, returnDate]);
  
  const searchFlightsData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Parse travelers count
      const travelersCount = travelers ? parseInt(travelers) : 1;
      
      const params: FlightSearchParams = {
        origin: origin!,
        destination: destination!,
        departureDate: departureDate!,
        returnDate: returnDate || undefined,
        adults: travelersCount,
        cabinClass: cabinClass as any || 'economy'
      };
      
      const flightResults = await searchFlights(params);
      setFlights(flightResults);
      setFilteredFlights(flightResults);
      
      // Initialize price range based on results
      if (flightResults.length) {
        const min = Math.min(...flightResults.map(f => f.price));
        const max = Math.max(...flightResults.map(f => f.price));
        setPriceRange([min, max]);
      }
    } catch (error) {
      console.error('Error searching flights:', error);
      setError('Unable to fetch flight data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Apply filters when filter state changes
  useEffect(() => {
    const filtered = flights.filter(flight => {
      // Price filter
      const priceInRange = flight.price >= priceRange[0] && flight.price <= priceRange[1];
      
      // Stops filter
      const stopsInRange = flight.stops <= maxStops;
      
      // Direct flights filter
      const meetsDirectFilter = !directOnly || flight.stops === 0;
      
      // Airline filter
      const meetsAirlineFilter = selectedAirlines.length === 0 || 
        selectedAirlines.includes(flight.airline);
      
      return priceInRange && stopsInRange && meetsDirectFilter && meetsAirlineFilter;
    });
    
    setFilteredFlights(filtered);
  }, [priceRange, maxStops, directOnly, selectedAirlines, flights]);
  
  // Helper to format flight duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  // Helper to format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };
  
  // Helper to format time
  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'h:mm a');
    } catch (e) {
      return dateString;
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <div>
          <h2 className="text-xl font-semibold">Flight Search Results</h2>
          <p className="text-sm text-gray-500">
            {origin} to {destination} • {departureDate && formatDate(departureDate)}
            {returnDate && ` - ${formatDate(returnDate)}`}
          </p>
        </div>
        {onClose && (
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        )}
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Filters sidebar */}
        <div className="w-64 border-r p-4 flex-shrink-0">
          <h3 className="font-semibold flex items-center mb-4">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </h3>
          
          <div className="space-y-6">
            {/* Price range */}
            <div>
              <h4 className="text-sm font-medium mb-2">Price Range</h4>
              <div className="mb-4">
                <Slider 
                  min={minPrice} 
                  max={maxPrice} 
                  step={10} 
                  value={[priceRange[0], priceRange[1]]}
                  onValueChange={(value) => setPriceRange([value[0], value[1]])}
                />
                <div className="flex justify-between mt-2 text-sm">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>
            
            {/* Stops */}
            <div>
              <h4 className="text-sm font-medium mb-2">Maximum Stops</h4>
              <div className="flex items-center gap-2">
                <Slider 
                  min={0} 
                  max={2} 
                  step={1} 
                  value={[maxStops]}
                  onValueChange={(value) => setMaxStops(value[0])}
                  className="flex-1"
                />
                <span className="w-6 text-center">{maxStops}</span>
              </div>
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="directOnly" 
                    checked={directOnly}
                    onCheckedChange={(checked) => setDirectOnly(checked === true)}
                  />
                  <Label htmlFor="directOnly">Direct flights only</Label>
                </div>
              </div>
            </div>
            
            {/* Airlines */}
            {airlines.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Airlines</h4>
                <div className="space-y-2">
                  {airlines.map(airline => (
                    <div key={airline} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`airline-${airline}`} 
                        checked={selectedAirlines.includes(airline)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedAirlines([...selectedAirlines, airline]);
                          } else {
                            setSelectedAirlines(selectedAirlines.filter(a => a !== airline));
                          }
                        }}
                      />
                      <Label htmlFor={`airline-${airline}`}>{airline}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Results area */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                  <p>Searching for the best flights...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                  <h3 className="font-semibold text-lg">Unable to fetch flights</h3>
                  <p className="text-gray-500 mt-2">{error}</p>
                  <Button onClick={searchFlightsData} className="mt-4">
                    Try Again
                  </Button>
                </div>
              ) : filteredFlights.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <AlertCircle className="h-12 w-12 text-warning mb-4" />
                  <h3 className="font-semibold text-lg">No flights found</h3>
                  <p className="text-gray-500 mt-2">
                    Try adjusting your filters or search criteria
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">
                    Found {filteredFlights.length} flights
                  </p>
                  
                  {filteredFlights.map((flight) => (
                    <Card key={flight.id} className="overflow-hidden">
                      <div className="flex md:flex-row flex-col">
                        {/* Airline info */}
                        <div className="w-full md:w-1/4 bg-gray-50 dark:bg-gray-800 p-4 flex flex-col justify-center items-center border-r border-gray-200 dark:border-gray-700">
                          <div className="w-12 h-12 mb-2">
                            {flight.logoUrl ? (
                              <img 
                                src={flight.logoUrl} 
                                alt={flight.airline} 
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center">
                                <Plane className="text-primary h-6 w-6" />
                              </div>
                            )}
                          </div>
                          <h3 className="font-semibold">{flight.airline}</h3>
                          <p className="text-sm text-gray-500">{flight.flightNumber}</p>
                          <Badge className="mt-2" variant={flight.stops === 0 ? "outline" : "secondary"}>
                            {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                          </Badge>
                        </div>
                        
                        {/* Flight details */}
                        <div className="flex-1 p-4">
                          <div className="flex flex-col md:flex-row justify-between">
                            {/* Departure & Arrival */}
                            <div className="flex items-center justify-between flex-1 mb-4 md:mb-0">
                              <div className="text-center">
                                <p className="text-2xl font-bold">{formatTime(flight.departureTime)}</p>
                                <p className="text-sm">{flight.origin}</p>
                              </div>
                              
                              <div className="flex flex-col items-center mx-4">
                                <div className="text-xs text-gray-500 mb-1">
                                  {formatDuration(flight.duration)}
                                </div>
                                <div className="relative w-24 md:w-32">
                                  <div className="absolute h-0.5 bg-gray-300 w-full top-1/2 transform -translate-y-1/2"></div>
                                  <div className="absolute h-2 w-2 rounded-full bg-gray-500 left-0 top-1/2 transform -translate-y-1/2"></div>
                                  <div className="absolute h-2 w-2 rounded-full bg-gray-500 right-0 top-1/2 transform -translate-y-1/2"></div>
                                </div>
                              </div>
                              
                              <div className="text-center">
                                <p className="text-2xl font-bold">{formatTime(flight.arrivalTime)}</p>
                                <p className="text-sm">{flight.destination}</p>
                              </div>
                            </div>
                            
                            {/* Price & Book */}
                            <div className="md:ml-6 flex md:flex-col justify-between items-center md:items-end">
                              <div className="text-right mb-2">
                                <p className="text-2xl font-bold">${flight.price}</p>
                                <p className="text-xs text-gray-500">{flight.cabinClass}</p>
                              </div>
                              
                              <Button 
                                className="w-full" 
                                onClick={() => onBookFlight && onBookFlight(flight)}
                              >
                                Book Now
                              </Button>
                            </div>
                          </div>
                          
                          {/* Additional info */}
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(flight.departureTime)}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              Duration: {formatDuration(flight.duration)}
                            </div>
                            {flight.availableSeats && (
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                {flight.availableSeats} seats left
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}