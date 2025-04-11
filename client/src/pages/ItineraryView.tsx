import { useEffect, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, Calendar, Clock, DollarSign, Globe, 
  Lock, ArrowLeft, Share2, Pencil, Bookmark, BookmarkCheck
} from 'lucide-react';

interface Activity {
  time: string;
  title: string;
  description: string;
  location?: string;
  coordinates?: { lat: number; lng: number };
  duration?: number;
  cost?: number;
  transportMode?: string;
  travelTime?: number;
}

interface ItineraryDay {
  day: number;
  date?: string;
  activities: Activity[];
}

interface Itinerary {
  id: number;
  userId: number;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  budget?: number;
  currency?: string;
  travelStyle?: string;
  statusComplete: boolean;
  content: {
    days: ItineraryDay[];
    notes?: string;
    totalCost?: number;
    recommendedAccommodations?: Array<{ id: number; name: string }>;
  };
  isPublic: boolean;
  isBookmarked: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ItineraryView(props: { params: { id: string } }) {
  const [, setLocation] = useLocation();
  const itineraryId = parseInt(props.params.id);
  
  // Fetch itinerary data
  const { data: itinerary, isLoading, error } = useQuery({
    queryKey: [`/api/itineraries/${itineraryId}`],
    retry: false,
  });

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount?: number, currency = 'USD') => {
    if (amount === undefined) return '-';
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="h-screen flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !itinerary) {
    return (
      <Layout>
        <div className="container mx-auto py-8 max-w-4xl">
          <div className="text-center py-12 bg-red-50 rounded-lg">
            <h3 className="text-lg font-medium mb-2 text-red-700">Error Loading Itinerary</h3>
            <p className="text-gray-500 mb-4">
              This itinerary could not be found or you don't have permission to view it.
            </p>
            <Button variant="outline" onClick={() => setLocation('/itineraries')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Itineraries
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const itineraryData = itinerary as Itinerary;
  
  return (
    <Layout>
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="sm" onClick={() => setLocation('/itineraries')} className="mr-2">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <h1 className="text-3xl font-bold flex-1">{itineraryData.title}</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              {itineraryData.isBookmarked ? (
                <>
                  <BookmarkCheck className="w-4 h-4 mr-1" />
                  Bookmarked
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 mr-1" />
                  Bookmark
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setLocation(`/itineraries/${itineraryId}/edit`)}>
              <Pencil className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
        </div>

        {/* Itinerary summary card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-2">Trip Overview</h2>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-primary" />
                    <span>
                      <strong>Destination:</strong> {itineraryData.destination}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-primary" />
                    <span>
                      <strong>Dates:</strong> {formatDate(itineraryData.startDate)} - {formatDate(itineraryData.endDate)}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-primary" />
                    <span>
                      <strong>Duration:</strong> {itineraryData.totalDays} days
                    </span>
                  </li>
                  {itineraryData.budget && (
                    <li className="flex items-center">
                      <DollarSign className="w-5 h-5 mr-2 text-primary" />
                      <span>
                        <strong>Budget:</strong> {formatCurrency(itineraryData.budget, itineraryData.currency)}
                      </span>
                    </li>
                  )}
                  {itineraryData.content.totalCost && (
                    <li className="flex items-center">
                      <DollarSign className="w-5 h-5 mr-2 text-primary" />
                      <span>
                        <strong>Estimated Cost:</strong> {formatCurrency(itineraryData.content.totalCost, itineraryData.currency)}
                      </span>
                    </li>
                  )}
                  <li className="flex items-center">
                    {itineraryData.isPublic ? (
                      <>
                        <Globe className="w-5 h-5 mr-2 text-primary" />
                        <span>
                          <strong>Status:</strong> Public itinerary
                        </span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5 mr-2 text-primary" />
                        <span>
                          <strong>Status:</strong> Private itinerary
                        </span>
                      </>
                    )}
                  </li>
                </ul>
              </div>
              
              <div>
                {itineraryData.content.notes && (
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">Trip Notes</h2>
                    <p className="text-gray-700">{itineraryData.content.notes}</p>
                  </div>
                )}
                
                {itineraryData.content.recommendedAccommodations && 
                 itineraryData.content.recommendedAccommodations.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Recommended Accommodations</h2>
                    <ul className="list-disc list-inside">
                      {itineraryData.content.recommendedAccommodations.map((acc) => (
                        <li key={acc.id} className="text-gray-700">{acc.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Itinerary days */}
        <h2 className="text-2xl font-bold mb-4">Itinerary</h2>
        <div className="space-y-6">
          {itineraryData.content.days.map((day) => (
            <Card key={day.day} className="overflow-hidden">
              <CardHeader className="bg-gray-50 pb-3">
                <CardTitle className="flex items-center">
                  <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-2">
                    {day.day}
                  </span>
                  Day {day.day}
                  {day.date && (
                    <span className="ml-2 text-gray-500 font-normal text-sm">
                      ({new Date(day.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })})
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative pl-10">
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  
                  {day.activities.map((activity, activityIdx) => (
                    <div key={activityIdx} className="relative py-6 px-6">
                      <div className="absolute left-[-26px] top-8 w-4 h-4 rounded-full bg-primary border-4 border-white"></div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-start">
                        <div className="font-medium text-lg mb-1 sm:mb-0 sm:w-36 sm:flex-shrink-0">
                          {activity.time}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg">{activity.title}</h4>
                          <p className="text-gray-600 my-1">{activity.description}</p>
                          
                          <div className="mt-3 flex flex-wrap gap-3">
                            {activity.location && (
                              <div className="flex items-center text-sm text-gray-500">
                                <MapPin className="w-4 h-4 mr-1" />
                                {activity.location}
                              </div>
                            )}
                            
                            {activity.duration && (
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="w-4 h-4 mr-1" />
                                {Math.floor(activity.duration / 60)} hours
                              </div>
                            )}
                            
                            {activity.cost !== undefined && activity.cost > 0 && (
                              <div className="flex items-center text-sm text-gray-500">
                                <DollarSign className="w-4 h-4 mr-1" />
                                {formatCurrency(activity.cost, itineraryData.currency || 'USD')}
                              </div>
                            )}
                            
                            {activity.transportMode && (
                              <Badge variant="outline" className="text-xs">
                                Transport: {activity.transportMode}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {activityIdx < day.activities.length - 1 && (
                        <div className="absolute left-6 bottom-0 h-0.5 w-0.5 bg-gray-300"></div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-8 flex justify-center">
          <Button variant="outline" onClick={() => setLocation('/itineraries')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Itineraries
          </Button>
        </div>
      </div>
    </Layout>
  );
}