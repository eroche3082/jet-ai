import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Camera, 
  ScanLine, 
  Share2, 
  Download, 
  LinkIcon, 
  Book, 
  Images, 
  Map,
  MessageCircle,
  Eye,
  Palette,
  QrCode
} from 'lucide-react';
import TravelMemoryScrapbook from '@/components/TravelMemoryScrapbook';

// Dummy data for demonstration purposes
const SAMPLE_MEMORIES = [
  {
    id: '1',
    title: 'Summer in Paris',
    date: new Date('2024-07-15'),
    location: 'Paris, France',
    coverImage: 'https://placehold.co/800x500/d1d5db/6b7280?text=Paris+Memories',
    backgroundColor: '#f3f4f6',
    items: [
      {
        id: '101',
        type: 'photo' as const,
        title: 'Eiffel Tower at Sunset',
        content: '',
        date: new Date('2024-07-16'),
        location: 'Eiffel Tower, Paris',
        imageUrl: 'https://placehold.co/600x400/d1d5db/6b7280?text=Eiffel+Tower',
        position: {
          x: 50,
          y: 50,
          width: 240,
          height: 180,
          rotation: 5,
          zIndex: 1,
        },
        arEnabled: true,
        arData: {
          annotations: [{
            text: 'Eiffel Tower at Sunset',
            position: [0, 0, 0],
          }]
        }
      },
      {
        id: '102',
        type: 'note' as const,
        title: 'First Day in Paris',
        content: 'We arrived early in the morning and checked into our charming hotel near the Seine. The weather was perfect - sunny with a light breeze. We spent the afternoon exploring the neighborhood and enjoying coffee at a local café.',
        date: new Date('2024-07-15'),
        position: {
          x: 320,
          y: 100,
          width: 200,
          height: 220,
          rotation: -3,
          zIndex: 2,
        }
      },
      {
        id: '103',
        type: 'ticket' as const,
        title: 'Louvre Museum',
        content: 'museum ticket',
        date: new Date('2024-07-17'),
        location: 'Louvre Museum, Paris',
        imageUrl: 'https://placehold.co/200x100/d1d5db/6b7280?text=QR+Code',
        position: {
          x: 100,
          y: 260,
          width: 180,
          height: 160,
          rotation: 0,
          zIndex: 3,
        }
      }
    ]
  },
  {
    id: '2',
    title: 'Tokyo Adventure',
    date: new Date('2024-05-10'),
    location: 'Tokyo, Japan',
    coverImage: 'https://placehold.co/800x500/d1d5db/6b7280?text=Tokyo+Memories',
    backgroundColor: '#e7f5ff',
    items: [
      {
        id: '201',
        type: 'photo' as const,
        title: 'Shibuya Crossing',
        content: '',
        date: new Date('2024-05-11'),
        location: 'Shibuya, Tokyo',
        imageUrl: 'https://placehold.co/600x400/d1d5db/6b7280?text=Shibuya',
        position: {
          x: 80,
          y: 60,
          width: 240,
          height: 180,
          rotation: 0,
          zIndex: 1,
        }
      },
      {
        id: '202',
        type: 'location' as const,
        title: 'Tokyo Skytree',
        content: '',
        date: new Date('2024-05-12'),
        location: 'Tokyo Skytree, Sumida, Tokyo',
        imageUrl: 'https://placehold.co/600x400/d1d5db/6b7280?text=Skytree',
        position: {
          x: 350,
          y: 80,
          width: 200,
          height: 150,
          rotation: 2,
          zIndex: 2,
        },
        arEnabled: true
      },
      {
        id: '203',
        type: 'note' as const,
        title: 'Japanese Cuisine',
        content: 'The food here is incredible! Today we tried authentic ramen, sushi, and the most amazing matcha desserts. Every meal has been an adventure.',
        date: new Date('2024-05-13'),
        position: {
          x: 150,
          y: 270,
          width: 220,
          height: 170,
          rotation: -2,
          zIndex: 3,
        }
      }
    ]
  }
];

export default function TravelMemoryPage() {
  const [activeTab, setActiveTab] = useState<string>('scrapbook');
  const [memories, setMemories] = useState(SAMPLE_MEMORIES);
  const [currentMemoryIndex, setCurrentMemoryIndex] = useState(0);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Get memory ID from URL if present
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const memoryId = urlParams.get('id');
    
    if (memoryId) {
      const memoryIndex = memories.findIndex(m => m.id === memoryId);
      if (memoryIndex !== -1) {
        setCurrentMemoryIndex(memoryIndex);
      }
    }
  }, [location]);
  
  // Current memory being viewed/edited
  const currentMemory = memories[currentMemoryIndex];
  
  // Save updated memory
  const saveMemory = (updatedPages: any[]) => {
    const newMemories = [...memories];
    newMemories[currentMemoryIndex] = {
      ...newMemories[currentMemoryIndex],
      ...updatedPages[0],
    };
    
    setMemories(newMemories);
    
    // In a real app, this would save to a backend
    console.log('Saving memory:', newMemories[currentMemoryIndex]);
  };
  
  // Create a new memory
  const createNewMemory = () => {
    const newMemory = {
      id: crypto.randomUUID(),
      title: 'New Memory',
      date: new Date(),
      backgroundColor: '#ffffff',
      items: [],
    };
    
    const newMemories = [...memories, newMemory];
    setMemories(newMemories);
    setCurrentMemoryIndex(newMemories.length - 1);
    setIsCreatingNew(true);
    
    toast({
      title: 'New memory created',
      description: 'Start adding photos, notes, and other items to your travel memory',
    });
  };
  
  // Share memory
  const shareMemory = (memoryId: string) => {
    const shareUrl = `${window.location.origin}/memories?id=${memoryId}`;
    
    if (navigator.share) {
      navigator.share({
        title: currentMemory.title,
        text: `Check out my travel memory: ${currentMemory.title}`,
        url: shareUrl,
      }).catch(err => {
        console.error('Error sharing:', err);
        // Fallback
        copyToClipboard(shareUrl);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      copyToClipboard(shareUrl);
    }
  };
  
  // Helper to copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: 'Link copied',
        description: 'Share link copied to clipboard',
      });
    }).catch(err => {
      console.error('Failed to copy:', err);
      toast({
        title: 'Failed to copy',
        description: 'Could not copy the link to clipboard',
        variant: 'destructive',
      });
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Travel Memory Scrapbook</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Create, explore, and share your travel memories with interactive elements and AR experiences
      </p>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Content Area */}
        <div className="flex-1 order-2 md:order-1">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full sm:w-[400px]">
              <TabsTrigger value="scrapbook">
                <Book className="w-4 h-4 mr-2" />
                Scrapbook
              </TabsTrigger>
              <TabsTrigger value="ar-view">
                <QrCode className="w-4 h-4 mr-2" />
                AR View
              </TabsTrigger>
              <TabsTrigger value="gallery">
                <Images className="w-4 h-4 mr-2" />
                Gallery
              </TabsTrigger>
            </TabsList>
            
            {/* Scrapbook Tab */}
            <TabsContent value="scrapbook" className="space-y-4">
              {currentMemory ? (
                <TravelMemoryScrapbook
                  initialPages={[currentMemory]}
                  onSave={saveMemory}
                  onShare={(pageId) => shareMemory(pageId)}
                />
              ) : (
                <Card className="p-8 text-center">
                  <CardContent className="pt-6">
                    <Book className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Memories Yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                      Create your first travel memory scrapbook to start collecting and organizing your travel experiences.
                    </p>
                    <Button onClick={createNewMemory}>
                      Create New Memory
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            {/* AR View Tab */}
            <TabsContent value="ar-view" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>AR Experience</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg aspect-video flex items-center justify-center">
                    <div className="text-center p-8">
                      <ScanLine className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">AR Viewer</h3>
                      <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto mb-6">
                        Experience your travel memories in augmented reality. Point your camera at the real world to see your memories come to life.
                      </p>
                      <Button asChild>
                        <a href="/ar">Launch AR Experience</a>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">How to use AR with your memories:</h3>
                    <ol className="list-decimal pl-5 space-y-1 text-blue-700 dark:text-blue-400">
                      <li>Look for items with an AR marker in your scrapbook</li>
                      <li>Click the AR icon on those items or use the AR View tab</li>
                      <li>Point your device's camera at the environment</li>
                      <li>See your memories appear in the real world</li>
                      <li>Interact with them for additional information</li>
                    </ol>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                    {currentMemory?.items
                      .filter(item => item.arEnabled)
                      .map(item => (
                        <Card key={item.id} className="overflow-hidden">
                          <div className="h-32 relative">
                            {item.imageUrl ? (
                              <img 
                                src={item.imageUrl} 
                                alt={item.title} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                                <QrCode className="w-10 h-10 text-gray-500" />
                              </div>
                            )}
                            <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                              <QrCode className="w-4 h-4" />
                            </div>
                          </div>
                          <CardContent className="p-3">
                            <h4 className="font-medium text-sm">{item.title}</h4>
                            <Button 
                              variant="link" 
                              size="sm" 
                              className="px-0 h-6" 
                              asChild
                            >
                              <a href={`/ar?itemId=${item.id}`}>View in AR</a>
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Gallery Tab */}
            <TabsContent value="gallery" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Memory Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {memories.length > 0 ? (
                      currentMemory.items
                        .filter(item => item.type === 'photo' || item.type === 'video')
                        .map(item => (
                          <div key={item.id} className="overflow-hidden rounded-lg aspect-square relative group">
                            {item.imageUrl ? (
                              <img 
                                src={item.imageUrl} 
                                alt={item.title} 
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                                {item.type === 'video' ? (
                                  <div className="flex flex-col items-center">
                                    <Eye className="w-10 h-10 text-gray-500" />
                                    <span className="text-xs mt-2">Video</span>
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center">
                                    <Camera className="w-10 h-10 text-gray-500" />
                                    <span className="text-xs mt-2">Photo</span>
                                  </div>
                                )}
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <Button size="sm" variant="secondary" className="mr-2">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="secondary">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="col-span-full text-center p-8">
                        <p>No photos or videos in this memory yet.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar */}
        <div className="md:w-80 order-1 md:order-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Memories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={createNewMemory} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Create New Memory
              </Button>
              
              <Separator />
              
              <ScrollArea className="h-[300px] pr-4">
                {memories.length > 0 ? (
                  <div className="space-y-3">
                    {memories.map((memory, index) => (
                      <div 
                        key={memory.id}
                        className={`p-2 rounded-lg cursor-pointer transition-colors ${
                          index === currentMemoryIndex 
                            ? 'bg-primary/10 ring-1 ring-primary/30' 
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => setCurrentMemoryIndex(index)}
                      >
                        <div className="flex gap-3">
                          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden flex-shrink-0">
                            {memory.coverImage ? (
                              <img 
                                src={memory.coverImage} 
                                alt={memory.title} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Book className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm mb-1 truncate">{memory.title}</h3>
                            {memory.location && (
                              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
                                <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                                <span className="truncate">{memory.location}</span>
                              </div>
                            )}
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                              <span>
                                {memory.date instanceof Date 
                                  ? memory.date.toLocaleDateString()
                                  : new Date(memory.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      No memories yet. Create your first one!
                    </p>
                  </div>
                )}
              </ScrollArea>
              
              {currentMemory && (
                <>
                  <Separator />
                  
                  <div className="space-y-3">
                    <h3 className="font-medium">Memory Actions</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => shareMemory(currentMemory.id)}
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        asChild
                      >
                        <a href={`/ar?memoryId=${currentMemory.id}`}>
                          <ScanLine className="w-4 h-4 mr-2" />
                          AR View
                        </a>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                      >
                        <Map className="w-4 h-4 mr-2" />
                        Map View
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helper component for the "New Memory" button
function Plus({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

// Helper component for the Calendar icon
function Calendar({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}