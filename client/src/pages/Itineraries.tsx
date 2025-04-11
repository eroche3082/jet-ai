import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { 
  MapPin, Calendar, MoreVertical, Share2, Bookmark, 
  BookmarkCheck, Edit, Trash2, Plus, Globe, Lock, Plane,
  ArrowUpRight, Clock
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

export default function Itineraries() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Fetch user's itineraries
  const { data: itineraries, isLoading } = useQuery({
    queryKey: ['/api/user/itineraries'],
    retry: false,
  });

  // Toggle public/private status
  const shareItinerary = useMutation({
    mutationFn: async ({ id, isPublic }: { id: number; isPublic: boolean }) => {
      const response = await apiRequest('PATCH', `/api/itineraries/${id}/share`, { isPublic });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/itineraries'] });
      toast({
        title: 'Itinerary Updated',
        description: `Sharing preferences updated successfully.`,
      });
      setIsShareDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update sharing preferences.',
        variant: 'destructive',
      });
    },
  });

  // Toggle bookmark
  const toggleBookmark = useMutation({
    mutationFn: async ({ id, isBookmarked }: { id: number; isBookmarked: boolean }) => {
      const response = await apiRequest('PATCH', `/api/itineraries/${id}/bookmark`, { isBookmarked });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/itineraries'] });
      toast({
        title: 'Itinerary Updated',
        description: `Bookmark updated successfully.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update bookmark.',
        variant: 'destructive',
      });
    },
  });

  // Delete itinerary
  const deleteItinerary = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/itineraries/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/itineraries'] });
      toast({
        title: 'Itinerary Deleted',
        description: 'The itinerary has been successfully deleted.',
      });
      setIsDeleteDialogOpen(false);
      setConfirmDeleteId(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete itinerary.',
        variant: 'destructive',
      });
    },
  });

  // Handle itinerary actions
  const handleShareToggle = (itinerary: Itinerary) => {
    setSelectedItinerary(itinerary);
    setIsShareDialogOpen(true);
  };

  const handleBookmarkToggle = (itinerary: Itinerary) => {
    toggleBookmark.mutate({ id: itinerary.id, isBookmarked: !itinerary.isBookmarked });
  };

  const handleDelete = (itinerary: Itinerary) => {
    setConfirmDeleteId(itinerary.id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (confirmDeleteId) {
      deleteItinerary.mutate(confirmDeleteId);
    }
  };

  const handleEditItinerary = (itinerary: Itinerary) => {
    setLocation(`/itineraries/${itinerary.id}/edit`);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Filter itineraries based on active tab
  const filteredItineraries = itineraries ? 
    (itineraries as Itinerary[]).filter(itinerary => {
      if (activeTab === 'all') return true;
      if (activeTab === 'bookmarked') return itinerary.isBookmarked;
      if (activeTab === 'public') return itinerary.isPublic;
      if (activeTab === 'private') return !itinerary.isPublic;
      return true;
    }) : [];

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

  return (
    <Layout>
      <div className="container mx-auto py-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">My Itineraries</h1>
            <p className="text-gray-500 mt-1">Manage and organize your travel plans</p>
          </div>
          <Button className="mt-4 sm:mt-0" onClick={() => setLocation('/itineraries/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Itinerary
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All ({(itineraries as Itinerary[])?.length || 0})</TabsTrigger>
            <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
            <TabsTrigger value="public">Public</TabsTrigger>
            <TabsTrigger value="private">Private</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            {filteredItineraries.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Plane className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <h3 className="text-lg font-medium mb-2">No itineraries found</h3>
                <p className="text-gray-500 mb-4">
                  {activeTab === 'all' 
                    ? "You haven't created any itineraries yet." 
                    : `You don't have any ${activeTab} itineraries.`}
                </p>
                <Button onClick={() => setLocation('/itineraries/new')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Itinerary
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItineraries.map((itinerary) => (
                  <Card key={itinerary.id} className="overflow-hidden group">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div className="flex-1">
                          <CardTitle className="truncate">{itinerary.title}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                            {itinerary.destination}
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditItinerary(itinerary)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleShareToggle(itinerary)}>
                              <Share2 className="mr-2 h-4 w-4" />
                              <span>{itinerary.isPublic ? 'Make Private' : 'Make Public'}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleBookmarkToggle(itinerary)}>
                              {itinerary.isBookmarked ? (
                                <>
                                  <BookmarkCheck className="mr-2 h-4 w-4" />
                                  <span>Remove Bookmark</span>
                                </>
                              ) : (
                                <>
                                  <Bookmark className="mr-2 h-4 w-4" />
                                  <span>Add Bookmark</span>
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(itinerary)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pb-4">
                      <div className="flex items-center gap-2 text-sm mb-4">
                        <div className="flex items-center mr-1">
                          <Calendar className="w-3.5 h-3.5 mr-1" />
                          <span>
                            {formatDate(itinerary.startDate)} - {formatDate(itinerary.endDate)}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs ml-auto">
                          {itinerary.totalDays} days
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {itinerary.isPublic ? (
                          <Badge variant="outline" className="flex items-center bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
                            <Globe className="w-3 h-3 mr-1" />
                            Public
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="flex items-center">
                            <Lock className="w-3 h-3 mr-1" />
                            Private
                          </Badge>
                        )}
                        
                        {itinerary.isBookmarked && (
                          <Badge variant="outline" className="flex items-center bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200">
                            <BookmarkCheck className="w-3 h-3 mr-1" />
                            Bookmarked
                          </Badge>
                        )}
                        
                        {itinerary.travelStyle && (
                          <Badge variant="outline" className="flex items-center">
                            {itinerary.travelStyle}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          <span>Created {new Date(itinerary.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="pt-0">
                      <Button 
                        onClick={() => setLocation(`/itineraries/${itinerary.id}`)} 
                        className="w-full"
                      >
                        View Itinerary
                        <ArrowUpRight className="w-4 h-4 ml-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Itinerary</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this itinerary? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteItinerary.isPending}>
              {deleteItinerary.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Itinerary</DialogTitle>
            <DialogDescription>
              {selectedItinerary?.isPublic 
                ? 'Your itinerary is currently public. Anyone with the link can view it.'
                : 'Your itinerary is currently private. Only you can see it.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-4">
              <h3 className="font-medium mb-2">Visibility Settings</h3>
              <div className="flex flex-col gap-3">
                <Button 
                  variant={selectedItinerary?.isPublic ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => selectedItinerary && shareItinerary.mutate({ id: selectedItinerary.id, isPublic: true })}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Public
                  <span className="ml-2 text-xs opacity-70">(Anyone with the link)</span>
                </Button>
                
                <Button 
                  variant={!selectedItinerary?.isPublic ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => selectedItinerary && shareItinerary.mutate({ id: selectedItinerary.id, isPublic: false })}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Private
                  <span className="ml-2 text-xs opacity-70">(Only you)</span>
                </Button>
              </div>
            </div>
            
            {selectedItinerary?.isPublic && (
              <div className="mt-6">
                <h3 className="font-medium mb-2">Shareable Link</h3>
                <div className="flex">
                  <input 
                    type="text"
                    value={`${window.location.origin}/itineraries/${selectedItinerary.id}`}
                    className="flex-1 p-2 border rounded-l-md bg-gray-50"
                    readOnly
                  />
                  <Button 
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/itineraries/${selectedItinerary.id}`);
                      toast({
                        title: 'Link Copied',
                        description: 'Shareable link copied to clipboard!',
                      });
                    }}
                    className="rounded-l-none"
                  >
                    Copy
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsShareDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}