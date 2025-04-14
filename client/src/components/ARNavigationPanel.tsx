import React, { useState, useRef } from 'react';
import { Map as MapIcon, Camera, Navigation, Search, Compass, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const ARNavigationPanel: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('map');
  const [isLoading, setIsLoading] = useState(false);
  const [landmarks, setLandmarks] = useState<any[]>([]);
  const [directions, setDirections] = useState<any>(null);
  const [nearby, setNearby] = useState<any[]>([]);
  const [immersiveDescription, setImmersiveDescription] = useState('');
  const [audioSrc, setAudioSrc] = useState('');
  const [originLocation, setOriginLocation] = useState('');
  const [destinationLocation, setDestinationLocation] = useState('');
  const [locationName, setLocationName] = useState('');
  const [language, setLanguage] = useState('en');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [currentCoords, setCurrentCoords] = useState({ lat: 0, lng: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentCoords({ lat: latitude, lng: longitude });
          setIsLoading(false);
          toast({
            title: "Location detected",
            description: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoading(false);
          toast({
            title: "Location error",
            description: "Could not get your current location",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive",
      });
    }
  };
  
  // Handle file upload for landmark recognition
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('image', file);
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/ar-navigation/landmark-recognition', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to recognize landmarks');
      }
      
      const data = await response.json();
      setLandmarks(data.landmarks || []);
      
      if (data.landmarks.length === 0) {
        toast({
          title: "No landmarks detected",
          description: "Try uploading a clearer image of a recognizable landmark",
        });
      } else {
        toast({
          title: "Landmarks detected",
          description: `Found ${data.landmarks.length} landmarks in the image`,
        });
      }
    } catch (error) {
      console.error('Error recognizing landmarks:', error);
      toast({
        title: "Recognition failed",
        description: "Failed to analyze the image",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get directions
  const getDirections = async () => {
    if (!destinationLocation) {
      toast({
        title: "Destination required",
        description: "Please enter a destination",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const origin = useCurrentLocation 
        ? `${currentCoords.lat},${currentCoords.lng}` 
        : originLocation;
      
      if (!origin) {
        throw new Error('Origin location is required');
      }
      
      const response = await apiRequest('POST', '/api/ar-navigation/directions', {
        origin: origin,
        destination: destinationLocation,
        mode: 'walking',
        language: language
      });
      
      const data = await response.json();
      setDirections(data);
      
      toast({
        title: "Directions found",
        description: `${data.distance} (${data.duration})`,
      });
    } catch (error) {
      console.error('Error getting directions:', error);
      toast({
        title: "Directions failed",
        description: "Could not get directions for the specified locations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get spoken directions
  const getSpeechDirections = async (instruction: string) => {
    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/ar-navigation/spoken-directions', {
        instruction,
        language
      });
      
      const data = await response.json();
      
      // Create audio from base64
      const audioContent = data.audioContent;
      const audioBlob = new Blob(
        [Buffer.from(audioContent, 'base64')], 
        { type: 'audio/mp3' }
      );
      const audioUrl = URL.createObjectURL(audioBlob);
      
      setAudioSrc(audioUrl);
      
      // Auto-play the audio
      const audioElement = new Audio(audioUrl);
      audioElement.play();
      
      toast({
        title: "Speech generated",
        description: "Playing audio instructions",
      });
    } catch (error) {
      console.error('Error getting speech:', error);
      toast({
        title: "Speech failed",
        description: "Could not generate speech for the directions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get nearby places
  const getNearbyPlaces = async () => {
    if (!useCurrentLocation && (!currentCoords.lat || !currentCoords.lng)) {
      toast({
        title: "Location required",
        description: "Please enable current location or set coordinates",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/ar-navigation/nearby?lat=${currentCoords.lat}&lng=${currentCoords.lng}&radius=500&types=tourist_attraction,museum,restaurant`
      );
      
      if (!response.ok) {
        throw new Error('Failed to get nearby places');
      }
      
      const data = await response.json();
      setNearby(data.places || []);
      
      toast({
        title: "Places found",
        description: `Found ${data.places.length} interesting places nearby`,
      });
    } catch (error) {
      console.error('Error getting nearby places:', error);
      toast({
        title: "Search failed",
        description: "Could not find nearby places",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get immersive description
  const getImmersiveDescription = async () => {
    if (!locationName) {
      toast({
        title: "Location name required",
        description: "Please enter a location name",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/ar-navigation/immersive-description', {
        locationName,
        language
      });
      
      const data = await response.json();
      setImmersiveDescription(data.translatedDescription || data.originalDescription);
      
      toast({
        title: "Description generated",
        description: "Immersive description created successfully",
      });
    } catch (error) {
      console.error('Error getting description:', error);
      toast({
        title: "Description failed",
        description: "Could not generate description for the location",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="border-primary/10 bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold flex items-center">
            <Compass className="mr-2 h-6 w-6 text-primary" />
            AR Travel Navigation
          </CardTitle>
          <CardDescription>
            Explore the world with augmented reality navigation tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="map" onValueChange={setActiveTab} value={activeTab}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="map">
                <MapIcon className="mr-2 h-4 w-4" />
                Map
              </TabsTrigger>
              <TabsTrigger value="ar-cam">
                <Camera className="mr-2 h-4 w-4" />
                Landmark AR
              </TabsTrigger>
              <TabsTrigger value="nearby">
                <Search className="mr-2 h-4 w-4" />
                Nearby
              </TabsTrigger>
              <TabsTrigger value="immersive">
                <Info className="mr-2 h-4 w-4" />
                Immersive
              </TabsTrigger>
            </TabsList>
            
            {/* Map & Directions Tab */}
            <TabsContent value="map">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Switch 
                    id="use-current" 
                    checked={useCurrentLocation} 
                    onCheckedChange={setUseCurrentLocation}
                  />
                  <Label htmlFor="use-current">Use current location</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={getCurrentLocation}
                    className="ml-auto"
                  >
                    <Compass className="h-4 w-4 mr-2" />
                    Get location
                  </Button>
                </div>
                
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="origin">Origin</Label>
                    <Input
                      id="origin"
                      placeholder={useCurrentLocation ? "Using current location" : "Enter starting point"}
                      value={originLocation}
                      onChange={(e) => setOriginLocation(e.target.value)}
                      disabled={useCurrentLocation}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="destination">Destination</Label>
                    <Input
                      id="destination"
                      placeholder="Enter destination"
                      value={destinationLocation}
                      onChange={(e) => setDestinationLocation(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <select
                      id="language"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="it">Italian</option>
                      <option value="ja">Japanese</option>
                      <option value="ko">Korean</option>
                      <option value="zh">Chinese</option>
                    </select>
                  </div>
                  
                  <Button 
                    onClick={getDirections} 
                    disabled={isLoading || (!destinationLocation)}
                  >
                    {isLoading ? 'Getting directions...' : 'Get Directions'}
                  </Button>
                </div>
                
                {directions && (
                  <div className="mt-4 border rounded-md p-4 space-y-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium">Distance</p>
                        <p className="text-xl font-bold">{directions.distance}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Duration</p>
                        <p className="text-xl font-bold">{directions.duration}</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-2">Route: {directions.summary}</h3>
                      <div className="space-y-4">
                        {directions.steps.map((step: any, i: number) => (
                          <div key={i} className="flex border-l-2 border-primary pl-4 ml-2">
                            <div>
                              <div 
                                dangerouslySetInnerHTML={{ __html: step.instruction }} 
                                className="mb-1"
                              />
                              <div className="flex items-center text-sm text-muted-foreground">
                                <span>{step.distance} ({step.duration})</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="ml-2 h-6 text-xs"
                                  onClick={() => getSpeechDirections(step.instruction.replace(/<[^>]*>/g, ''))}
                                >
                                  🔊 Speak
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Landmark AR Camera Tab */}
            <TabsContent value="ar-cam">
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex justify-center items-center border-2 border-dashed rounded-md p-8 h-40">
                    <div className="text-center">
                      <Camera className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                      <h3 className="font-medium">Upload a landmark image</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Upload a photo to identify landmarks
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Choose Image
                      </Button>
                    </div>
                  </div>
                  
                  {landmarks.length > 0 && (
                    <div className="border rounded-md p-4 space-y-4">
                      <h3 className="font-medium">Recognized Landmarks</h3>
                      <div className="space-y-4">
                        {landmarks.map((landmark, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className="bg-primary/10 p-2 rounded-full">
                              <MapIcon className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium">{landmark.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                Confidence: {(landmark.confidence * 100).toFixed(1)}%
                              </p>
                              {landmark.locations && landmark.locations.length > 0 && (
                                <p className="text-sm">
                                  Location: {landmark.locations[0].latitude.toFixed(4)}, {landmark.locations[0].longitude.toFixed(4)}
                                </p>
                              )}
                              <Button
                                variant="link"
                                size="sm"
                                className="p-0 h-6"
                                onClick={() => {
                                  // Set this landmark's location for directions
                                  if (landmark.locations && landmark.locations.length > 0) {
                                    setActiveTab('map');
                                    setDestinationLocation(`${landmark.locations[0].latitude},${landmark.locations[0].longitude}`);
                                    setLocationName(landmark.name);
                                  }
                                }}
                              >
                                Get directions
                              </Button>
                              {' | '}
                              <Button
                                variant="link"
                                size="sm"
                                className="p-0 h-6"
                                onClick={() => {
                                  // Set for immersive description
                                  setActiveTab('immersive');
                                  setLocationName(landmark.name);
                                }}
                              >
                                Get description
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            {/* Nearby Tab */}
            <TabsContent value="nearby">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={getCurrentLocation}
                    className="mr-2"
                  >
                    <Compass className="h-4 w-4 mr-2" />
                    Get location
                  </Button>
                  
                  <p className="text-sm">
                    {currentCoords.lat
                      ? `Current: ${currentCoords.lat.toFixed(4)}, ${currentCoords.lng.toFixed(4)}`
                      : 'No location set'}
                  </p>
                  
                  <Button 
                    onClick={getNearbyPlaces} 
                    disabled={isLoading || (!currentCoords.lat)} 
                    className="ml-auto"
                  >
                    Find Nearby
                  </Button>
                </div>
                
                {nearby.length > 0 && (
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-4">Places Near You</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {nearby.map((place, i) => (
                        <div key={i} className="border rounded-md p-3 hover:bg-muted/50 transition">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{place.name}</h4>
                            {place.rating && (
                              <div className="flex items-center">
                                <span>⭐ {place.rating}</span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{place.address}</p>
                          <div className="flex items-center gap-2 text-sm">
                            <p className="bg-primary/10 px-2 py-1 rounded text-xs">
                              {place.types && place.types[0].replace(/_/g, ' ')}
                            </p>
                            {place.openNow !== undefined && (
                              <p className={`text-xs ${place.openNow ? 'text-green-600' : 'text-red-600'}`}>
                                {place.openNow ? 'Open now' : 'Closed'}
                              </p>
                            )}
                          </div>
                          <div className="mt-2 flex">
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0 h-6"
                              onClick={() => {
                                // Set this place for directions
                                setActiveTab('map');
                                setDestinationLocation(`${place.location.lat},${place.location.lng}`);
                              }}
                            >
                              Get directions
                            </Button>
                            {' | '}
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0 h-6"
                              onClick={() => {
                                // Set for immersive description
                                setActiveTab('immersive');
                                setLocationName(place.name);
                              }}
                            >
                              Description
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Immersive Tab */}
            <TabsContent value="immersive">
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="location-name">Location Name</Label>
                    <Input
                      id="location-name"
                      placeholder="Enter a location or landmark name"
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="immersive-language">Language</Label>
                    <select
                      id="immersive-language"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="it">Italian</option>
                      <option value="ja">Japanese</option>
                      <option value="ko">Korean</option>
                      <option value="zh">Chinese</option>
                    </select>
                  </div>
                  
                  <Button 
                    onClick={getImmersiveDescription} 
                    disabled={isLoading || !locationName}
                  >
                    {isLoading ? 'Generating...' : 'Generate Description'}
                  </Button>
                </div>
                
                {immersiveDescription && (
                  <div className="mt-4 border rounded-md p-6 bg-primary/5">
                    <h3 className="font-medium mb-2 text-lg">{locationName}</h3>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      {immersiveDescription.split('\n\n').map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </div>
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => getSpeechDirections(immersiveDescription)}
                      >
                        🔊 Listen to description
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ARNavigationPanel;