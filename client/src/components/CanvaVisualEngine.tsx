import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { DatePicker } from '@/components/ui/date-picker';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { AlertTriangle, Check, Download, Trash, Plus, ArrowRightCircle, Calendar, MapPin, Loader2, Globe, Plane } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';

// Interface for activity in travel itinerary
interface Activity {
  day: number;
  title: string;
  description: string;
  location?: string;
}

// Interface for the form data
const formSchema = z.object({
  destination: z.string().min(2, { message: "Destination is required" }),
  startDate: z.date(),
  endDate: z.date(),
  activities: z.array(
    z.object({
      day: z.number().min(1),
      title: z.string().min(2, { message: "Title is required" }),
      description: z.string().min(2, { message: "Description is required" }),
      location: z.string().optional(),
    })
  ).min(1, { message: "At least one activity is required" }),
  accommodation: z.object({
    name: z.string().min(2, { message: "Accommodation name is required" }),
    location: z.string().min(2, { message: "Accommodation location is required" }),
    imageUrl: z.string().url().optional(),
  }),
  travelStyle: z.string().min(2, { message: "Travel style is required" }),
  travelerName: z.string().optional(),
  budget: z.string().optional(),
  coverImageUrl: z.string().url().optional(),
  tripId: z.number().optional(),
});

type FormData = z.infer<typeof formSchema>;

// Travel styles options
const travelStyles = [
  { value: "luxury", label: "Luxury" },
  { value: "adventure", label: "Adventure" },
  { value: "family", label: "Family" },
  { value: "budget", label: "Budget" },
  { value: "cultural", label: "Cultural" },
  { value: "business", label: "Business" },
  { value: "solo", label: "Solo" },
  { value: "romantic", label: "Romantic" },
  { value: "eco", label: "Eco-friendly" },
];

export default function CanvaVisualEngine() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [canvaDesignId, setCanvaDesignId] = useState<string | null>(null);

  // Form setup with react-hook-form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      activities: [
        {
          day: 1,
          title: "",
          description: "",
          location: "",
        },
      ],
      accommodation: {
        name: "",
        location: "",
        imageUrl: "",
      },
      travelStyle: "adventure",
      travelerName: "",
      budget: "",
      coverImageUrl: "",
    },
  });

  // Generate visual itinerary mutation
  const generateItineraryMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/canva/generate-itinerary", data);
      return response.json();
    },
    onSuccess: (data) => {
      setPreviewUrl(data.viewUrl);
      setCanvaDesignId(data.designId);
      toast({
        title: "Visual itinerary created!",
        description: "Your visual travel itinerary has been generated successfully.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error generating itinerary",
        description: error.message || "There was an error creating your visual itinerary",
        variant: "destructive",
      });
    },
  });

  // Generate AI image for cover
  const generateCoverImageMutation = useMutation({
    mutationFn: async (prompt: string) => {
      const response = await apiRequest("POST", "/api/canva/generate-image", { prompt });
      return response.json();
    },
    onSuccess: (data) => {
      form.setValue("coverImageUrl", data.imageUrl);
      setIsGeneratingCover(false);
      toast({
        title: "Cover image generated",
        description: "Your AI-generated cover image is ready!",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      setIsGeneratingCover(false);
      toast({
        title: "Error generating image",
        description: error.message || "Failed to generate cover image",
        variant: "destructive",
      });
    },
  });

  // Helper function to generate cover image
  const generateCoverImage = () => {
    const destination = form.getValues("destination");
    const travelStyle = form.getValues("travelStyle");
    
    if (!destination) {
      toast({
        title: "Missing information",
        description: "Please enter a destination first",
        variant: "destructive",
      });
      return;
    }
    
    setIsGeneratingCover(true);
    generateCoverImageMutation.mutate(`scenic travel destination ${destination} in ${travelStyle} style`);
  };

  // Add a new activity
  const addActivity = () => {
    const activities = form.getValues("activities");
    form.setValue("activities", [
      ...activities,
      {
        day: activities.length + 1,
        title: "",
        description: "",
        location: "",
      },
    ]);
  };

  // Remove an activity
  const removeActivity = (index: number) => {
    const activities = form.getValues("activities");
    if (activities.length <= 1) {
      toast({
        title: "Cannot remove",
        description: "You need at least one activity in your itinerary",
        variant: "destructive",
      });
      return;
    }
    form.setValue(
      "activities",
      activities.filter((_, i) => i !== index)
    );
  };

  // Download PDF of the itinerary
  const downloadPdf = async () => {
    if (!canvaDesignId) return;
    
    try {
      // Use fetch directly to get the blob
      const response = await fetch(`/api/canva/download-pdf/${canvaDesignId}`);
      if (!response.ok) throw new Error('Failed to download PDF');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Create temporary link element to trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `travel-itinerary-${form.getValues("destination").replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download started",
        description: "Your itinerary PDF is downloading...",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "Failed to download PDF",
        variant: "destructive",
      });
    }
  };

  // Submit form handler
  const onSubmit = (data: FormData) => {
    // If user is logged in, add tripId (if available)
    if (user) {
      data.tripId = form.getValues("tripId");
    }
    
    generateItineraryMutation.mutate(data);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col space-y-6">
        {/* Header section */}
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Visual Itinerary Creator</h2>
          <p className="text-muted-foreground">
            Create beautiful visual travel itineraries with Canva integration
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section - Left 2 columns */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Create Your Visual Itinerary</CardTitle>
                <CardDescription>
                  Fill in the details of your trip to generate a beautiful visual itinerary
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Destination and dates */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="destination"
                        render={({ field }) => (
                          <FormItem className="md:col-span-1">
                            <FormLabel>Destination</FormLabel>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <Globe className="h-5 w-5 text-muted-foreground" />
                                <Input placeholder="Paris, France" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem className="md:col-span-1">
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <DatePicker
                                date={field.value}
                                setDate={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem className="md:col-span-1">
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                              <DatePicker
                                date={field.value}
                                setDate={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Travel style and traveler name */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="travelStyle"
                        render={({ field }) => (
                          <FormItem className="md:col-span-1">
                            <FormLabel>Travel Style</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a travel style" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {travelStyles.map((style) => (
                                  <SelectItem key={style.value} value={style.value}>
                                    {style.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="travelerName"
                        render={({ field }) => (
                          <FormItem className="md:col-span-1">
                            <FormLabel>Traveler Name (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="John's Adventure" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem className="md:col-span-1">
                            <FormLabel>Budget (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="$1,000 - $2,000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Accommodation */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Accommodation</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="accommodation.name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Accommodation Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Grand Hotel" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="accommodation.location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Accommodation Location</FormLabel>
                              <FormControl>
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-5 w-5 text-muted-foreground" />
                                  <Input placeholder="123 Boulevard, Paris" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="accommodation.imageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Accommodation Image URL (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/hotel.jpg" {...field} />
                            </FormControl>
                            <FormDescription>
                              Add a URL to an image of your accommodation
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Cover Image */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Cover Image</h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={generateCoverImage}
                          disabled={isGeneratingCover}
                        >
                          {isGeneratingCover ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>Generate with AI</>
                          )}
                        </Button>
                      </div>

                      <FormField
                        control={form.control}
                        name="coverImageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="https://example.com/cover.jpg" {...field} />
                            </FormControl>
                            <FormDescription>
                              {field.value ? (
                                <div className="mt-2 relative w-full h-40 bg-muted rounded-md overflow-hidden">
                                  <img
                                    src={field.value}
                                    alt="Cover Preview"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                "Add a URL to an image or generate one with AI"
                              )}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Activities */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Activities</h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addActivity}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Activity
                        </Button>
                      </div>

                      {form.watch("activities").map((activity, index) => (
                        <Card key={index} className="border-dashed">
                          <CardHeader className="py-4 px-5">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-sm font-medium">
                                Day {activity.day}
                              </CardTitle>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeActivity(index)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="py-0 px-5 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <FormField
                                control={form.control}
                                name={`activities.${index}.day`}
                                render={({ field }) => (
                                  <FormItem className="md:col-span-1">
                                    <FormLabel>Day</FormLabel>
                                    <FormControl>
                                      <div className="flex items-center space-x-2">
                                        <Calendar className="h-5 w-5 text-muted-foreground" />
                                        <Input
                                          type="number"
                                          min={1}
                                          placeholder="1"
                                          {...field}
                                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`activities.${index}.title`}
                                render={({ field }) => (
                                  <FormItem className="md:col-span-2">
                                    <FormLabel>Activity Title</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Visit the Eiffel Tower"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name={`activities.${index}.description`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Enjoy the breathtaking views of Paris from the top of the iconic Eiffel Tower..."
                                      className="resize-none"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`activities.${index}.location`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Location (Optional)</FormLabel>
                                  <FormControl>
                                    <div className="flex items-center space-x-2">
                                      <MapPin className="h-5 w-5 text-muted-foreground" />
                                      <Input
                                        placeholder="Champ de Mars, 5 Avenue Anatole France, Paris"
                                        {...field}
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="pt-4">
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={generateItineraryMutation.isPending}
                      >
                        {generateItineraryMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Visual Itinerary...
                          </>
                        ) : (
                          <>
                            <Plane className="mr-2 h-4 w-4" />
                            Create Visual Itinerary
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Preview section - Right column */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Preview & Actions</CardTitle>
                <CardDescription>
                  See your visual itinerary and download options
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center space-y-4">
                {generateItineraryMutation.isPending ? (
                  <div className="flex flex-col items-center justify-center h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-4 text-sm text-muted-foreground">
                      Creating your visual itinerary...
                    </p>
                  </div>
                ) : previewUrl ? (
                  <div className="space-y-4 w-full">
                    <div className="relative border rounded-md overflow-hidden aspect-[3/4] w-full">
                      <iframe 
                        src={previewUrl} 
                        className="absolute inset-0 w-full h-full"
                        title="Itinerary Preview"
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button onClick={downloadPdf} className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => window.open(previewUrl, '_blank')}
                      >
                        <ArrowRightCircle className="mr-2 h-4 w-4" />
                        Open in Canva
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-4 h-[400px] text-center">
                    <div className="rounded-full bg-muted p-6">
                      <Plane className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">No Itinerary Yet</h3>
                      <p className="text-sm text-muted-foreground max-w-[200px] mx-auto mt-2">
                        Fill out the form and click "Create Visual Itinerary" to generate your design
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}