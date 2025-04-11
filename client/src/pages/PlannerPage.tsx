import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, MapPin, Calendar as CalendarIcon2, Users, Briefcase, Plus, Trash } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Types
interface Activity {
  id: string;
  time: string;
  title: string;
  description: string;
  location?: string;
}

interface ItineraryDay {
  date: Date;
  activities: Activity[];
}

export default function PlannerPage() {
  // Form states
  const [destination, setDestination] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [travelers, setTravelers] = useState<number>(2);
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState<string>('');
  
  // Itinerary states
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  // Activity dialog states
  const [showActivityDialog, setShowActivityDialog] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [activityTime, setActivityTime] = useState<string>('');
  const [activityTitle, setActivityTitle] = useState<string>('');
  const [activityDesc, setActivityDesc] = useState<string>('');
  const [activityLocation, setActivityLocation] = useState<string>('');

  // Handle adding a new interest
  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  // Handle removing an interest
  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };

  // Generate itinerary
  const handleGenerateItinerary = () => {
    if (!destination || !startDate || !endDate) return;
    
    setIsGenerating(true);
    
    // Calculate number of days
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    // Create empty itinerary
    const newItinerary: ItineraryDay[] = [];
    
    for (let i = 0; i < diffDays; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      newItinerary.push({
        date,
        activities: []
      });
    }
    
    setItinerary(newItinerary);
    
    // Simulate AI generation
    setTimeout(() => {
      // In a real app, this would call your AI service
      const sampleItinerary = generateSampleItinerary(newItinerary);
      setItinerary(sampleItinerary);
      setIsGenerating(false);
      setIsEditing(true);
    }, 2000);
  };

  // Simulate AI-generated itinerary for demo purposes
  const generateSampleItinerary = (days: ItineraryDay[]) => {
    return days.map((day, index) => {
      const activities: Activity[] = [];
      
      // Morning
      activities.push({
        id: crypto.randomUUID(),
        time: '09:00',
        title: index === 0 ? 'Arrival and Check-in' : 'Breakfast',
        description: index === 0 
          ? 'Arrive at your accommodation and get settled in.' 
          : 'Start your day with breakfast at a local café.',
        location: index === 0 ? 'Hotel' : 'Local café'
      });
      
      // Midday
      activities.push({
        id: crypto.randomUUID(),
        time: '12:00',
        title: 'Lunch and Exploration',
        description: 'Enjoy lunch at a local restaurant and explore the surrounding area.',
        location: 'City center'
      });
      
      // Afternoon
      activities.push({
        id: crypto.randomUUID(),
        time: '15:00',
        title: index % 2 === 0 ? 'Cultural Visit' : 'Nature Experience',
        description: index % 2 === 0 
          ? 'Visit a museum or historical site.' 
          : 'Explore natural attractions in the area.',
        location: index % 2 === 0 ? 'Museum' : 'Park'
      });
      
      // Evening
      activities.push({
        id: crypto.randomUUID(),
        time: '19:00',
        title: 'Dinner',
        description: 'Enjoy dinner at a recommended restaurant.',
        location: 'Restaurant'
      });
      
      return {
        ...day,
        activities
      };
    });
  };

  // Handle add activity dialog
  const openAddActivityDialog = (dayIndex: number) => {
    setSelectedDay(dayIndex);
    setActivityTime('');
    setActivityTitle('');
    setActivityDesc('');
    setActivityLocation('');
    setShowActivityDialog(true);
  };

  // Add new activity to itinerary
  const handleAddActivity = () => {
    if (selectedDay === null || !activityTime || !activityTitle) return;
    
    const newActivity: Activity = {
      id: crypto.randomUUID(),
      time: activityTime,
      title: activityTitle,
      description: activityDesc,
      location: activityLocation || undefined
    };
    
    const updatedItinerary = [...itinerary];
    updatedItinerary[selectedDay].activities.push(newActivity);
    
    // Sort activities by time
    updatedItinerary[selectedDay].activities.sort((a, b) => {
      return a.time.localeCompare(b.time);
    });
    
    setItinerary(updatedItinerary);
    setShowActivityDialog(false);
  };

  // Remove activity
  const handleRemoveActivity = (dayIndex: number, activityId: string) => {
    const updatedItinerary = [...itinerary];
    updatedItinerary[dayIndex].activities = updatedItinerary[dayIndex].activities.filter(
      (activity) => activity.id !== activityId
    );
    setItinerary(updatedItinerary);
  };

  // Save itinerary
  const handleSaveItinerary = () => {
    // In a real app, this would save to your backend
    alert('Itinerary saved successfully!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Travel Trip Planner</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Planning Form */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Trip Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Destination</label>
                <Input
                  placeholder="Where are you going?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  disabled={isEditing}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                      disabled={isEditing}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      disabled={(date) => 
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                      disabled={!startDate || isEditing}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      disabled={(date) => 
                        !startDate || date <= startDate || date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Travelers</label>
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setTravelers(Math.max(1, travelers - 1))}
                    disabled={isEditing}
                  >
                    -
                  </Button>
                  <span className="mx-4">{travelers}</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setTravelers(travelers + 1)}
                    disabled={isEditing}
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Travel Interests</label>
                <div className="flex">
                  <Input
                    placeholder="Add interests (food, history, etc.)"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    className="flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddInterest()}
                    disabled={isEditing}
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleAddInterest}
                    disabled={!newInterest.trim() || isEditing}
                    className="ml-2"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {interests.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {interests.map((interest) => (
                      <Badge key={interest} variant="secondary" className="gap-1">
                        {interest}
                        {!isEditing && (
                          <button
                            className="ml-1 text-gray-500 hover:text-gray-700"
                            onClick={() => handleRemoveInterest(interest)}
                          >
                            ×
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              {!isEditing ? (
                <Button
                  onClick={handleGenerateItinerary}
                  disabled={!destination || !startDate || !endDate || isGenerating}
                  className="w-full"
                >
                  {isGenerating ? 'Generating...' : 'Generate Itinerary'}
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveItinerary}
                    className="flex-1"
                  >
                    Save Itinerary
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setItinerary([]);
                    }}
                  >
                    Start Over
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Itinerary View */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              {itinerary.length === 0 
                ? 'Your Itinerary' 
                : `${destination} Trip: ${format(itinerary[0].date, 'MMM d')} - ${format(itinerary[itinerary.length - 1].date, 'MMM d, yyyy')}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {itinerary.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 h-[500px] text-center">
                {isGenerating ? (
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 dark:text-gray-400">
                      Generating your personalized itinerary...
                    </p>
                  </div>
                ) : (
                  <>
                    <Briefcase className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4" />
                    <h3 className="text-xl font-medium mb-2">Plan Your Adventure</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md">
                      Fill in your trip details on the left and click "Generate Itinerary" to create a personalized travel plan.
                    </p>
                  </>
                )}
              </div>
            ) : (
              <ScrollArea className="h-[600px] pr-4">
                {itinerary.map((day, dayIndex) => (
                  <div key={dayIndex} className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <CalendarIcon2 className="mr-2 h-5 w-5 text-primary" />
                        <h3 className="text-lg font-medium">
                          Day {dayIndex + 1}: {format(day.date, 'EEEE, MMMM d')}
                        </h3>
                      </div>
                      {isEditing && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openAddActivityDialog(dayIndex)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Activity
                        </Button>
                      )}
                    </div>
                    
                    {day.activities.length === 0 ? (
                      <p className="text-gray-500 dark:text-gray-400 text-sm italic py-3">
                        No activities planned for this day yet.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {day.activities.map((activity) => (
                          <div 
                            key={activity.id} 
                            className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-start">
                                <div className="bg-primary/10 text-primary font-medium px-2 py-1 rounded text-sm mr-3 whitespace-nowrap">
                                  {activity.time}
                                </div>
                                <div>
                                  <h4 className="font-medium text-base">{activity.title}</h4>
                                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                    {activity.description}
                                  </p>
                                  {activity.location && (
                                    <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                                      <MapPin className="h-3.5 w-3.5 mr-1" />
                                      {activity.location}
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {isEditing && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveActivity(dayIndex, activity.id)}
                                  className="text-gray-400 hover:text-red-500"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {dayIndex < itinerary.length - 1 && <Separator className="mt-6" />}
                  </div>
                ))}
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Add Activity Dialog */}
      <Dialog open={showActivityDialog} onOpenChange={setShowActivityDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Activity</DialogTitle>
            <DialogDescription>
              Add details for the new activity in your itinerary.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <Input
                  type="time"
                  value={activityTime}
                  onChange={(e) => setActivityTime(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Location (optional)</label>
                <Input
                  placeholder="e.g. Restaurant name, Museum, etc."
                  value={activityLocation}
                  onChange={(e) => setActivityLocation(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Activity Title</label>
              <Input
                placeholder="e.g. Breakfast, Museum Visit, etc."
                value={activityTitle}
                onChange={(e) => setActivityTitle(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                placeholder="Describe the activity..."
                value={activityDesc}
                onChange={(e) => setActivityDesc(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActivityDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddActivity} disabled={!activityTime || !activityTitle}>
              Add Activity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}