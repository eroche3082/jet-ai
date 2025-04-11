import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HotelResult, HotelSearchParams, searchHotels } from '../lib/hotels';
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Star, Calendar, Users, Wifi, Waves, Utensils, Dumbbell } from 'lucide-react';

interface HotelSearchResultsProps {
  destination: string | null;
  dates?: string | null;
  travelers?: string | null;
  budget?: string | null;
  onClose?: () => void;
  onBookHotel?: (hotel: HotelResult) => void;
}

export default function HotelSearchResults({ 
  destination, 
  dates, 
  travelers, 
  budget, 
  onClose, 
  onBookHotel 
}: HotelSearchResultsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hotels, setHotels] = useState<HotelResult[]>([]);
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 1000,
    stars: [] as number[],
    amenities: [] as string[]
  });
  const [viewType, setViewType] = useState<'list' | 'grid'>('grid');

  useEffect(() => {
    if (destination) {
      searchHotelsForDestination();
    }
  }, [destination]);

  const searchHotelsForDestination = async () => {
    if (!destination) return;
    
    setIsLoading(true);
    try {
      // Convert budget to price range
      let priceMin = 0;
      let priceMax = 1000;
      
      if (budget?.toLowerCase().includes('budget')) {
        priceMax = 100;
      } else if (budget?.toLowerCase().includes('mid')) {
        priceMin = 100;
        priceMax = 250;
      } else if (budget?.toLowerCase().includes('luxury')) {
        priceMin = 250;
      }
      
      // Parse travelers
      let adults = 1;
      if (travelers?.toLowerCase().includes('couple')) {
        adults = 2;
      } else if (travelers?.toLowerCase().includes('family')) {
        adults = 4;
      } else if (travelers?.toLowerCase().includes('group')) {
        adults = 4;
      } else if (travelers) {
        const match = travelers.match(/(\d+)/);
        if (match && match[1]) {
          adults = parseInt(match[1]);
        }
      }
      
      // Build search params
      const searchParams: HotelSearchParams = {
        destination: destination,
        priceMin,
        priceMax,
        adults
      };
      
      // Add dates if provided
      if (dates) {
        // For now, just use demo dates
        searchParams.checkIn = '2025-06-01';
        searchParams.checkOut = '2025-06-08';
      }
      
      const results = await searchHotels(searchParams);
      setHotels(results);
    } catch (error) {
      console.error('Error searching hotels:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePriceChange = (value: number[]) => {
    setFilters({
      ...filters,
      priceMin: value[0],
      priceMax: value[1]
    });
  };

  const handleStarFilterChange = (star: number) => {
    setFilters(prev => {
      const newStars = prev.stars.includes(star)
        ? prev.stars.filter(s => s !== star)
        : [...prev.stars, star];
      return { ...prev, stars: newStars };
    });
  };

  const handleAmenityFilterChange = (amenity: string) => {
    setFilters(prev => {
      const newAmenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities: newAmenities };
    });
  };

  // Filter hotels based on user selections
  const filteredHotels = hotels.filter(hotel => {
    // Price filter
    if (hotel.pricePerNight < filters.priceMin || hotel.pricePerNight > filters.priceMax) {
      return false;
    }
    
    // Star rating filter
    if (filters.stars.length > 0 && !filters.stars.includes(hotel.stars)) {
      return false;
    }
    
    // Amenities filter
    if (filters.amenities.length > 0) {
      const hasAllAmenities = filters.amenities.every(amenity => 
        hotel.amenities.some(a => a.toLowerCase().includes(amenity.toLowerCase()))
      );
      if (!hasAllAmenities) return false;
    }
    
    return true;
  });

  const getAmenityIcon = (amenity: string) => {
    const lowerAmenity = amenity.toLowerCase();
    if (lowerAmenity.includes('wifi')) return <Wifi className="h-4 w-4 mr-1" />;
    if (lowerAmenity.includes('pool')) return <Waves className="h-4 w-4 mr-1" />;
    if (lowerAmenity.includes('restaurant') || lowerAmenity.includes('dining')) return <Utensils className="h-4 w-4 mr-1" />;
    if (lowerAmenity.includes('fitness') || lowerAmenity.includes('gym')) return <Dumbbell className="h-4 w-4 mr-1" />;
    return null;
  };

  return (
    <div className="hotel-search-results w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Hotels in {destination}</h2>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => setViewType('list')}>List</Button>
          <Button variant="outline" size="sm" onClick={() => setViewType('grid')}>Grid</Button>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
          )}
        </div>
      </div>
      
      <div className="flex gap-4">
        {/* Filters sidebar */}
        <div className="w-1/4 bg-card p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Filters</h3>
          
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-2">Price Range (per night)</h4>
            <div className="flex justify-between mb-2">
              <span>${filters.priceMin}</span>
              <span>${filters.priceMax}</span>
            </div>
            <Slider
              defaultValue={[filters.priceMin, filters.priceMax]}
              max={1000}
              step={10}
              onValueChange={handlePriceChange}
              className="mb-2"
            />
          </div>
          
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-2">Star Rating</h4>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(star => (
                <div key={star} className="flex items-center">
                  <Checkbox 
                    id={`star-${star}`} 
                    checked={filters.stars.includes(star)}
                    onCheckedChange={() => handleStarFilterChange(star)}
                  />
                  <Label htmlFor={`star-${star}`} className="ml-2 flex">
                    {Array(star).fill(0).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Amenities</h4>
            <div className="space-y-2">
              {['WiFi', 'Pool', 'Restaurant', 'Fitness Center'].map(amenity => (
                <div key={amenity} className="flex items-center">
                  <Checkbox 
                    id={`amenity-${amenity}`} 
                    checked={filters.amenities.includes(amenity)}
                    onCheckedChange={() => handleAmenityFilterChange(amenity)}
                  />
                  <Label htmlFor={`amenity-${amenity}`} className="ml-2">
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Results area */}
        <div className="w-3/4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredHotels.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-lg text-muted-foreground">No hotels found matching your criteria</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setFilters({
                    priceMin: 0,
                    priceMax: 1000,
                    stars: [],
                    amenities: []
                  });
                }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-[500px]">
              <div className={viewType === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-4'}>
                {filteredHotels.map(hotel => (
                  <Card key={hotel.id} className={viewType === 'grid' ? '' : 'flex flex-row h-48'}>
                    <div className={viewType === 'grid' ? '' : 'w-1/3'}>
                      <img 
                        src={hotel.imageUrl} 
                        alt={hotel.name}
                        className={
                          viewType === 'grid' 
                            ? 'w-full h-40 object-cover rounded-t-lg' 
                            : 'w-full h-full object-cover rounded-l-lg'
                        }
                      />
                    </div>
                    <div className={viewType === 'grid' ? '' : 'w-2/3'}>
                      <CardHeader className={viewType === 'grid' ? '' : 'pb-0'}>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{hotel.name}</CardTitle>
                          <div className="flex">
                            {Array(hotel.stars).fill(0).map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          <CardDescription className="inline">
                            {hotel.address}, {hotel.city}
                          </CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className={viewType === 'grid' ? '' : 'py-2'}>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {hotel.amenities.slice(0, 3).map(amenity => (
                            <Badge key={amenity} variant="outline" className="flex items-center text-xs">
                              {getAmenityIcon(amenity)}
                              {amenity}
                            </Badge>
                          ))}
                          {hotel.amenities.length > 3 && (
                            <Badge variant="outline" className="text-xs">+{hotel.amenities.length - 3} more</Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-lg">${hotel.pricePerNight}</span>
                            <span className="text-sm text-muted-foreground"> /night</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{hotel.rating}</span>
                            <span className="text-xs text-muted-foreground">({hotel.ratingCount})</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className={viewType === 'grid' ? '' : 'pt-0'}>
                        <Button 
                          className="w-full" 
                          onClick={() => onBookHotel && onBookHotel(hotel)}
                        >
                          View Deal
                        </Button>
                      </CardFooter>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
}