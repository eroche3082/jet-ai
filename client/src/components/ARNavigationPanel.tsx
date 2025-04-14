import React, { useState } from 'react';
import { 
  Camera, 
  Navigation,
  MapPin,
  MicIcon,
  ImageIcon,
  Send,
  Info,
  Languages
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ARNavigationPanel: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [recognizedLandmark, setRecognizedLandmark] = useState<string | null>(null);
  const [directionResults, setDirectionResults] = useState<any>(null);
  const [spokenDirections, setSpokenDirections] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [immersiveDescription, setImmersiveDescription] = useState<string | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImageFile(file);
    
    // Create image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Reset recognition result
    setRecognizedLandmark(null);
  };
  
  // Recognize landmark from image
  const recognizeLandmark = async () => {
    if (!imageFile) {
      toast({
        title: "No Image Selected",
        description: "Please upload an image first",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await fetch('/api/ar-navigation/landmark-recognition', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to recognize landmark');
      }
      
      const data = await response.json();
      
      if (data.landmarks && data.landmarks.length > 0) {
        setRecognizedLandmark(data.landmarks[0].name);
        toast({
          title: "Landmark Recognized",
          description: `Identified as ${data.landmarks[0].name}`,
        });
      } else {
        setRecognizedLandmark(null);
        toast({
          title: "No Landmarks Recognized",
          description: "Could not identify any landmarks in this image",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error recognizing landmark:', error);
      toast({
        title: "Recognition Failed",
        description: "Could not process the image",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get directions between two points
  const getDirections = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const origin = formData.get('origin') as string;
    const destination = formData.get('destination') as string;
    const mode = formData.get('mode') as string;
    const language = selectedLanguage.split('-')[0]; // Get language code without region
    
    if (!origin || !destination) {
      toast({
        title: "Missing Information",
        description: "Please provide both origin and destination",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/ar-navigation/directions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin,
          destination,
          mode,
          language,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get directions');
      }
      
      const data = await response.json();
      setDirectionResults(data);
      
      // Get first instruction for speech synthesis
      if (data.steps && data.steps.length > 0) {
        getSpokenDirections(data.steps[0].instruction);
      }
      
      toast({
        title: "Directions Retrieved",
        description: `Found route from ${origin} to ${destination}`,
      });
    } catch (error) {
      console.error('Error getting directions:', error);
      toast({
        title: "Navigation Failed",
        description: "Could not retrieve directions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get spoken directions in selected language
  const getSpokenDirections = async (instruction: string) => {
    if (!instruction) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/ar-navigation/spoken-directions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instruction,
          language: selectedLanguage,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get spoken directions');
      }
      
      const data = await response.json();
      setSpokenDirections(instruction);
      setAudioUrl(data.audioUrl);
    } catch (error) {
      console.error('Error getting spoken directions:', error);
      toast({
        title: "Speech Synthesis Failed",
        description: "Could not generate audio instructions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get nearby points of interest
  const getNearbyPlaces = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const latitude = parseFloat(formData.get('latitude') as string);
    const longitude = parseFloat(formData.get('longitude') as string);
    const radius = parseInt(formData.get('radius') as string);
    const types = formData.get('types') as string;
    
    if (isNaN(latitude) || isNaN(longitude) || isNaN(radius)) {
      toast({
        title: "Invalid Coordinates",
        description: "Please provide valid latitude, longitude and radius",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/ar-navigation/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}&types=${types}`);
      
      if (!response.ok) {
        throw new Error('Failed to get nearby places');
      }
      
      const data = await response.json();
      setNearbyPlaces(data.places || []);
      
      toast({
        title: "Places Found",
        description: `Found ${data.places?.length || 0} places nearby`,
      });
    } catch (error) {
      console.error('Error getting nearby places:', error);
      toast({
        title: "Search Failed",
        description: "Could not find nearby places",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get immersive description of a location
  const getImmersiveDescription = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const locationName = formData.get('locationName') as string;
    const language = selectedLanguage.split('-')[0]; // Get language code without region
    
    if (!locationName) {
      toast({
        title: "Missing Location",
        description: "Please provide a location name",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/ar-navigation/immersive-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          locationName,
          language,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get immersive description');
      }
      
      const data = await response.json();
      setImmersiveDescription(data.description);
      
      toast({
        title: "Description Generated",
        description: `Generated immersive description for ${locationName}`,
      });
    } catch (error) {
      console.error('Error getting immersive description:', error);
      toast({
        title: "Generation Failed",
        description: "Could not generate immersive description",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Tabs defaultValue="landmark" className="w-full">
      <TabsList className="grid grid-cols-4">
        <TabsTrigger value="landmark" className="flex items-center space-x-2">
          <Camera className="h-4 w-4" />
          <span>Landmark</span>
        </TabsTrigger>
        <TabsTrigger value="directions" className="flex items-center space-x-2">
          <Navigation className="h-4 w-4" />
          <span>Directions</span>
        </TabsTrigger>
        <TabsTrigger value="nearby" className="flex items-center space-x-2">
          <MapPin className="h-4 w-4" />
          <span>Nearby</span>
        </TabsTrigger>
        <TabsTrigger value="immersive" className="flex items-center space-x-2">
          <Info className="h-4 w-4" />
          <span>Immersive</span>
        </TabsTrigger>
      </TabsList>
      
      {/* Language Selector */}
      <div className="flex justify-end mt-4">
        <div className="flex items-center space-x-2">
          <Languages className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en-US">English (US)</SelectItem>
              <SelectItem value="fr-FR">French</SelectItem>
              <SelectItem value="es-ES">Spanish</SelectItem>
              <SelectItem value="de-DE">German</SelectItem>
              <SelectItem value="ja-JP">Japanese</SelectItem>
              <SelectItem value="zh-CN">Chinese</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Landmark Recognition */}
      <TabsContent value="landmark">
        <Card>
          <CardHeader>
            <CardTitle>Landmark Recognition</CardTitle>
            <CardDescription>
              Upload a photo of a landmark to identify it using AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="landmark-image">Upload Image</Label>
                <Input
                  id="landmark-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
              
              {imagePreview && (
                <div className="mt-4">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                    <img 
                      src={imagePreview}
                      alt="Landmark preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              )}
              
              {recognizedLandmark && (
                <div className="p-4 rounded-lg bg-primary/10 mt-4">
                  <h3 className="font-medium text-lg">Recognized Landmark:</h3>
                  <p className="text-primary font-semibold text-xl">{recognizedLandmark}</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={recognizeLandmark} 
              disabled={!imageFile || isLoading}
              className="w-full"
            >
              {isLoading ? 'Processing...' : 'Recognize Landmark'}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      {/* Directions */}
      <TabsContent value="directions">
        <Card>
          <CardHeader>
            <CardTitle>AR Navigation</CardTitle>
            <CardDescription>
              Get detailed directions with AR-powered navigation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={getDirections} className="space-y-4">
              <div className="grid gap-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="origin">Starting Point</Label>
                  <Input
                    id="origin"
                    name="origin"
                    placeholder="Enter your starting point"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    name="destination"
                    placeholder="Enter your destination"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="mode">Travel Mode</Label>
                  <Select name="mode" defaultValue="walking">
                    <SelectTrigger id="mode">
                      <SelectValue placeholder="Select travel mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="walking">Walking</SelectItem>
                      <SelectItem value="driving">Driving</SelectItem>
                      <SelectItem value="bicycling">Bicycling</SelectItem>
                      <SelectItem value="transit">Public Transit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Getting Directions...' : 'Get Directions'}
                </Button>
              </div>
            </form>
            
            {directionResults && (
              <div className="mt-6 space-y-4">
                <Separator />
                <div>
                  <h3 className="font-medium text-lg mb-2">Route Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg p-3 bg-primary/10">
                      <p className="text-sm text-muted-foreground">Distance</p>
                      <p className="text-lg font-semibold">{directionResults.distance}</p>
                    </div>
                    <div className="rounded-lg p-3 bg-primary/10">
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="text-lg font-semibold">{directionResults.duration}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">Navigation Steps</h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {directionResults.steps?.map((step: any, index: number) => (
                      <div key={index} className="p-3 rounded-lg border">
                        <div className="flex justify-between items-start">
                          <div dangerouslySetInnerHTML={{ __html: step.instruction }} />
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => getSpokenDirections(step.instruction)}
                            className="ml-2 flex-shrink-0"
                          >
                            <MicIcon className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {step.distance} · {step.duration}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {audioUrl && (
                  <div className="mt-4">
                    <h3 className="font-medium text-lg mb-2">Spoken Directions</h3>
                    <div className="p-4 rounded-lg bg-primary/10">
                      <p className="text-sm mb-2">{spokenDirections}</p>
                      <audio controls className="w-full">
                        <source src={audioUrl} type="audio/mp3" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* Nearby Places */}
      <TabsContent value="nearby">
        <Card>
          <CardHeader>
            <CardTitle>Points of Interest</CardTitle>
            <CardDescription>
              Find nearby attractions, restaurants, and more
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={getNearbyPlaces} className="space-y-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      name="latitude"
                      type="number"
                      step="any"
                      placeholder="40.7128"
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      name="longitude"
                      type="number"
                      step="any"
                      placeholder="-74.0060"
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="radius">Search Radius (meters)</Label>
                  <Input
                    id="radius"
                    name="radius"
                    type="number"
                    placeholder="1000"
                    defaultValue="1000"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="types">Place Types</Label>
                  <Select name="types" defaultValue="tourist_attraction">
                    <SelectTrigger id="types">
                      <SelectValue placeholder="Select place type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tourist_attraction">Tourist Attractions</SelectItem>
                      <SelectItem value="restaurant">Restaurants</SelectItem>
                      <SelectItem value="museum">Museums</SelectItem>
                      <SelectItem value="hotel">Hotels</SelectItem>
                      <SelectItem value="shopping_mall">Shopping</SelectItem>
                      <SelectItem value="park">Parks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Searching...' : 'Find Nearby Places'}
                </Button>
              </div>
            </form>
            
            {nearbyPlaces.length > 0 && (
              <div className="mt-6">
                <Separator className="my-4" />
                <h3 className="font-medium text-lg mb-3">Nearby Points of Interest</h3>
                <div className="grid gap-4">
                  {nearbyPlaces.map((place, index) => (
                    <div key={index} className="p-4 rounded-lg border">
                      <div className="flex justify-between">
                        <h4 className="font-semibold">{place.name}</h4>
                        <span className="text-sm bg-primary/10 px-2 py-1 rounded-full">
                          {place.rating ? `★ ${place.rating}` : 'No rating'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{place.vicinity}</p>
                      <div className="flex items-center mt-2 text-sm">
                        <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {place.distance ? `${place.distance} away` : 'Distance unavailable'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* Immersive Descriptions */}
      <TabsContent value="immersive">
        <Card>
          <CardHeader>
            <CardTitle>Immersive Descriptions</CardTitle>
            <CardDescription>
              Get detailed AI-generated descriptions of locations for a more immersive experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={getImmersiveDescription} className="space-y-4">
              <div className="grid gap-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="locationName">Location Name</Label>
                  <Input
                    id="locationName"
                    name="locationName"
                    placeholder="e.g., Eiffel Tower, Grand Canyon, Tokyo"
                    required
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Generating...' : 'Generate Immersive Description'}
                </Button>
              </div>
            </form>
            
            {immersiveDescription && (
              <div className="mt-6">
                <Separator className="my-4" />
                <div className="p-4 rounded-lg bg-primary/5">
                  <h3 className="font-medium text-lg mb-2">Immersive Experience</h3>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="whitespace-pre-line">{immersiveDescription}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ARNavigationPanel;