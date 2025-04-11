import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import DestinationCard from '@/components/DestinationCard';
import AccommodationCard from '@/components/AccommodationCard';
import ExperienceCard from '@/components/ExperienceCard';

interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  memberSince: string;
  isSubscribed: boolean;
  plan?: string;
}

interface Booking {
  id: string;
  type: 'accommodation' | 'experience';
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'completed' | 'canceled';
  totalAmount: number;
  imageUrl: string;
}

interface SavedItem {
  id: string;
  type: 'destination' | 'accommodation' | 'experience';
  name: string;
  location: string;
  imageUrl: string;
  saved: boolean;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const { toast } = useToast();
  const [_, setLocation] = useLocation();

  // Fetch user data
  const { data: user, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ['/api/user/profile'],
    retry: 1,
  });

  // Fetch bookings
  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['/api/user/bookings'],
    enabled: !!user,
    retry: 1,
  });

  // Fetch saved items
  const { data: savedItems, isLoading: savedItemsLoading } = useQuery({
    queryKey: ['/api/user/saved-items'],
    enabled: !!user,
    retry: 1,
  });
  
  // Mock data for UI display when API returns errors (development only)
  const mockUser: User = {
    id: 1,
    username: 'traveler123',
    email: 'user@example.com',
    fullName: 'Jane Traveler',
    avatarUrl: 'https://randomuser.me/api/portraits/women/32.jpg',
    memberSince: '2023-05-15',
    isSubscribed: true,
    plan: 'Premium'
  };

  const mockBookings: Booking[] = [
    {
      id: 'b1',
      type: 'accommodation',
      title: 'Oceanview Villa',
      location: 'Bali, Indonesia',
      startDate: '2025-07-15',
      endDate: '2025-07-22',
      status: 'upcoming',
      totalAmount: 2450,
      imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'b2',
      type: 'experience',
      title: 'Northern Lights Expedition',
      location: 'Tromsø, Norway',
      startDate: '2025-11-05',
      endDate: '2025-11-05',
      status: 'upcoming',
      totalAmount: 195,
      imageUrl: 'https://images.unsplash.com/photo-1464037946554-55bf5c27f07a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'b3',
      type: 'accommodation',
      title: 'Mountain Chalet',
      location: 'Swiss Alps, Switzerland',
      startDate: '2024-12-10',
      endDate: '2024-12-17',
      status: 'completed',
      totalAmount: 1960,
      imageUrl: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28f17?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    }
  ];

  const mockSavedItems: SavedItem[] = [
    {
      id: 's1',
      type: 'destination',
      name: 'Santorini',
      location: 'Greece',
      imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      saved: true
    },
    {
      id: 's2',
      type: 'accommodation',
      name: 'Urban Penthouse',
      location: 'New York, USA',
      imageUrl: 'https://images.unsplash.com/photo-1560200353-ce0a76b1d438?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      saved: true
    },
    {
      id: 's3',
      type: 'experience',
      name: 'Exclusive Vineyard Tour',
      location: 'Tuscany, Italy',
      imageUrl: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      saved: true
    }
  ];
  
  // Handle unauthorized access or errors
  useEffect(() => {
    if (userError) {
      toast({
        title: "Authentication required",
        description: "Please sign in to access your dashboard.",
        variant: "destructive",
      });
      setLocation('/signin');
    }
  }, [userError, toast, setLocation]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      setLocation('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: "An error occurred during logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Toggle saved item
  const toggleSavedItem = (id: string) => {
    toast({
      title: "Item updated",
      description: "Your saved items have been updated.",
    });
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (userLoading) {
    return (
      <div className="min-h-[calc(100vh-160px)] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
          <p className="text-dark/70">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Use actual data if available, otherwise use mock data for UI display
  const userData = user || mockUser;
  const bookingsData = bookings || mockBookings;
  const savedItemsData = savedItems || mockSavedItems;

  return (
    <div className="bg-light min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* User header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                <img 
                  src={userData.avatarUrl || 'https://randomuser.me/api/portraits/lego/1.jpg'} 
                  alt={userData.username} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-dark">Welcome, {userData.fullName || userData.username}</h1>
                <p className="text-dark/70">Member since {formatDate(userData.memberSince)}</p>
                {userData.isSubscribed && (
                  <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full mt-1">
                    {userData.plan} Plan
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              <Link 
                href="/checkout" 
                className={`bg-primary hover:bg-primary/90 text-white font-accent font-medium px-5 py-2.5 rounded-full transition ${!userData.isSubscribed ? 'animate-pulse' : ''}`}
              >
                {userData.isSubscribed ? 'Manage Subscription' : 'Upgrade to Premium'}
              </Link>
              <button 
                onClick={handleLogout}
                className="bg-gray-100 hover:bg-gray-200 text-dark font-accent font-medium px-5 py-2.5 rounded-full transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
        
        {/* Dashboard tabs */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="border-b border-gray-100">
            <div className="flex overflow-x-auto">
              <button 
                className={`px-6 py-4 font-accent font-medium whitespace-nowrap transition ${activeTab === 'overview' ? 'text-primary border-b-2 border-primary' : 'text-dark/70 hover:text-dark'}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`px-6 py-4 font-accent font-medium whitespace-nowrap transition ${activeTab === 'bookings' ? 'text-primary border-b-2 border-primary' : 'text-dark/70 hover:text-dark'}`}
                onClick={() => setActiveTab('bookings')}
              >
                My Bookings
              </button>
              <button 
                className={`px-6 py-4 font-accent font-medium whitespace-nowrap transition ${activeTab === 'saved' ? 'text-primary border-b-2 border-primary' : 'text-dark/70 hover:text-dark'}`}
                onClick={() => setActiveTab('saved')}
              >
                Saved Items
              </button>
              <button 
                className={`px-6 py-4 font-accent font-medium whitespace-nowrap transition ${activeTab === 'history' ? 'text-primary border-b-2 border-primary' : 'text-dark/70 hover:text-dark'}`}
                onClick={() => setActiveTab('history')}
              >
                Travel History
              </button>
              <button 
                className={`px-6 py-4 font-accent font-medium whitespace-nowrap transition ${activeTab === 'settings' ? 'text-primary border-b-2 border-primary' : 'text-dark/70 hover:text-dark'}`}
                onClick={() => setActiveTab('settings')}
              >
                Account Settings
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="font-display text-xl font-bold text-dark mb-6">Dashboard Overview</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {/* Stats cards */}
                  <div className="bg-primary/5 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-accent font-semibold text-dark">Upcoming Trips</h3>
                      <span className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <i className="fas fa-plane-departure text-primary"></i>
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-dark mb-1">
                      {bookingsData.filter(b => b.status === 'upcoming').length}
                    </p>
                    <Link href="#" className="text-primary text-sm font-medium">
                      View all bookings
                    </Link>
                  </div>
                  
                  <div className="bg-primary/5 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-accent font-semibold text-dark">Saved Items</h3>
                      <span className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <i className="fas fa-heart text-primary"></i>
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-dark mb-1">
                      {savedItemsData.length}
                    </p>
                    <Link href="#" className="text-primary text-sm font-medium">
                      View saved items
                    </Link>
                  </div>
                  
                  <div className="bg-primary/5 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-accent font-semibold text-dark">Reward Points</h3>
                      <span className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <i className="fas fa-gift text-primary"></i>
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-dark mb-1">
                      1,250
                    </p>
                    <Link href="#" className="text-primary text-sm font-medium">
                      Redeem points
                    </Link>
                  </div>
                </div>
                
                {/* Upcoming trips section */}
                <h3 className="font-display text-lg font-bold text-dark mb-4">Upcoming Trips</h3>
                {bookingsData.filter(b => b.status === 'upcoming').length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {bookingsData
                      .filter(b => b.status === 'upcoming')
                      .slice(0, 2)
                      .map(booking => (
                        <div key={booking.id} className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm">
                          <div className="relative h-40">
                            <img 
                              src={booking.imageUrl} 
                              alt={booking.title} 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1">
                              <span className="text-xs font-semibold text-primary">{booking.type === 'accommodation' ? 'Stay' : 'Experience'}</span>
                            </div>
                          </div>
                          <div className="p-5">
                            <h4 className="font-display font-bold text-dark mb-1">{booking.title}</h4>
                            <p className="text-dark/70 text-sm mb-3">{booking.location}</p>
                            <div className="flex items-center mb-3">
                              <i className="fas fa-calendar-alt text-primary mr-2"></i>
                              <span className="text-sm text-dark/70">
                                {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                              </span>
                            </div>
                            <Link 
                              href={`/bookings/${booking.id}`} 
                              className="text-primary hover:text-primary/80 text-sm font-medium"
                            >
                              View details
                            </Link>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 text-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-calendar text-gray-400 text-xl"></i>
                    </div>
                    <h4 className="font-accent font-medium text-dark mb-2">No upcoming trips</h4>
                    <p className="text-dark/70 text-sm mb-4">Start planning your next adventure!</p>
                    <Link 
                      href="/destinations" 
                      className="inline-block bg-primary hover:bg-primary/90 text-white font-accent font-medium px-5 py-2 rounded-full transition"
                    >
                      Explore Destinations
                    </Link>
                  </div>
                )}
                
                {/* Recommended for you */}
                <h3 className="font-display text-lg font-bold text-dark mb-4">Recommended For You</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <DestinationCard
                    id="rec1"
                    name="Kyoto"
                    country="Japan"
                    description="Ancient capital with over 1,600 Buddhist temples and 400 Shinto shrines."
                    imageUrl="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
                    rating={4.8}
                  />
                  <DestinationCard
                    id="rec2"
                    name="Barcelona"
                    country="Spain"
                    description="Vibrant city known for stunning architecture, Mediterranean beaches, and Catalan cuisine."
                    imageUrl="https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
                    rating={4.6}
                  />
                  <DestinationCard
                    id="rec3"
                    name="Amalfi Coast"
                    country="Italy"
                    description="Dramatic coastline with colorful fishing villages and cliffside lemon groves."
                    imageUrl="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
                    rating={4.6}
                  />
                </div>
              </div>
            )}
            
            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                <h2 className="font-display text-xl font-bold text-dark mb-6">My Bookings</h2>
                
                <div className="space-y-4 mb-6">
                  <button 
                    className="bg-primary text-white font-accent font-medium px-5 py-2 rounded-full"
                  >
                    Upcoming
                  </button>
                  <button 
                    className="bg-gray-100 text-dark/70 font-accent font-medium px-5 py-2 rounded-full ml-2"
                  >
                    Completed
                  </button>
                  <button 
                    className="bg-gray-100 text-dark/70 font-accent font-medium px-5 py-2 rounded-full ml-2"
                  >
                    Canceled
                  </button>
                </div>
                
                {bookingsData.filter(b => b.status === 'upcoming').length > 0 ? (
                  <div className="space-y-6">
                    {bookingsData
                      .filter(b => b.status === 'upcoming')
                      .map(booking => (
                        <div key={booking.id} className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm flex flex-col md:flex-row">
                          <div className="md:w-1/4 h-48 md:h-auto">
                            <img 
                              src={booking.imageUrl} 
                              alt={booking.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-6 flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-display font-bold text-dark text-xl">{booking.title}</h3>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                  booking.status === 'upcoming' ? 'bg-green-100 text-green-800' :
                                  booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </span>
                              </div>
                              <p className="text-dark/70 mb-2">{booking.location}</p>
                              <div className="flex items-center mb-3">
                                <i className="fas fa-calendar-alt text-primary mr-2"></i>
                                <span className="text-sm text-dark/70">
                                  {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                              <div>
                                <p className="text-sm text-dark/70">Total Amount</p>
                                <p className="font-accent font-semibold text-dark">${booking.totalAmount.toLocaleString()}</p>
                              </div>
                              <div className="flex gap-3">
                                <button className="text-primary hover:text-primary/80 font-medium text-sm">
                                  View Details
                                </button>
                                <button className="text-gray-500 hover:text-red-500 font-medium text-sm">
                                  Cancel Booking
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-calendar-times text-gray-400 text-xl"></i>
                    </div>
                    <h4 className="font-accent font-medium text-dark mb-2">No upcoming bookings</h4>
                    <p className="text-dark/70 text-sm mb-4">Ready to plan your next adventure?</p>
                    <Link 
                      href="/destinations" 
                      className="inline-block bg-primary hover:bg-primary/90 text-white font-accent font-medium px-5 py-2 rounded-full transition"
                    >
                      Explore Destinations
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {/* Saved Items Tab */}
            {activeTab === 'saved' && (
              <div>
                <h2 className="font-display text-xl font-bold text-dark mb-6">Saved Items</h2>
                
                <div className="space-y-4 mb-6">
                  <button 
                    className="bg-primary text-white font-accent font-medium px-5 py-2 rounded-full"
                  >
                    All
                  </button>
                  <button 
                    className="bg-gray-100 text-dark/70 font-accent font-medium px-5 py-2 rounded-full ml-2"
                  >
                    Destinations
                  </button>
                  <button 
                    className="bg-gray-100 text-dark/70 font-accent font-medium px-5 py-2 rounded-full ml-2"
                  >
                    Accommodations
                  </button>
                  <button 
                    className="bg-gray-100 text-dark/70 font-accent font-medium px-5 py-2 rounded-full ml-2"
                  >
                    Experiences
                  </button>
                </div>
                
                {savedItemsData.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {savedItemsData.map(item => {
                      if (item.type === 'destination') {
                        return (
                          <DestinationCard
                            key={item.id}
                            id={item.id}
                            name={item.name}
                            country={item.location}
                            description="Saved destination"
                            imageUrl={item.imageUrl}
                            rating={4.5}
                          />
                        );
                      } else if (item.type === 'accommodation') {
                        return (
                          <AccommodationCard
                            key={item.id}
                            id={item.id}
                            name={item.name}
                            description="Saved accommodation"
                            imageUrl={item.imageUrl}
                            pricePerNight={350}
                            rating={4.7}
                            isFavorite={item.saved}
                            onToggleFavorite={toggleSavedItem}
                          />
                        );
                      } else {
                        return (
                          <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-lg">
                            <div className="relative aspect-video">
                              <img 
                                src={item.imageUrl} 
                                alt={item.name} 
                                className="w-full h-full object-cover" 
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                              <div className="absolute bottom-4 left-4 right-4">
                                <span className="bg-primary/90 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                  Experience
                                </span>
                                <h3 className="font-display text-white text-xl font-bold mt-2">{item.name}</h3>
                              </div>
                            </div>
                            <div className="p-5">
                              <div className="flex items-center text-sm text-dark/70 mb-3">
                                <i className="fas fa-map-marker-alt text-primary mr-2"></i>
                                <span>{item.location}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center mt-1">
                                  <div className="flex text-yellow-400">
                                    <i className="fas fa-star text-xs"></i>
                                    <i className="fas fa-star text-xs"></i>
                                    <i className="fas fa-star text-xs"></i>
                                    <i className="fas fa-star text-xs"></i>
                                    <i className="fas fa-star-half-alt text-xs"></i>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => toggleSavedItem(item.id)}
                                  className="flex items-center justify-center w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-full text-primary transition"
                                >
                                  <i className="fas fa-heart"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    })}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-heart text-gray-400 text-xl"></i>
                    </div>
                    <h4 className="font-accent font-medium text-dark mb-2">No saved items yet</h4>
                    <p className="text-dark/70 text-sm mb-4">Save destinations, accommodations, and experiences for later.</p>
                    <Link 
                      href="/destinations" 
                      className="inline-block bg-primary hover:bg-primary/90 text-white font-accent font-medium px-5 py-2 rounded-full transition"
                    >
                      Start Exploring
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {/* Travel History Tab */}
            {activeTab === 'history' && (
              <div>
                <h2 className="font-display text-xl font-bold text-dark mb-6">Travel History</h2>
                
                {bookingsData.filter(b => b.status === 'completed').length > 0 ? (
                  <div className="space-y-6">
                    <div className="relative pl-8 pb-8 border-l-2 border-gray-200">
                      <div className="absolute -left-2.5 top-0">
                        <div className="w-5 h-5 rounded-full bg-primary"></div>
                      </div>
                      <div className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm">
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-display font-bold text-dark text-xl">Mountain Chalet</h3>
                            <span className="text-sm text-dark/50">December 2024</span>
                          </div>
                          <p className="text-dark/70 mb-3">Swiss Alps, Switzerland</p>
                          <div className="flex items-center mb-4">
                            <i className="fas fa-calendar-day text-primary mr-2"></i>
                            <span className="text-sm text-dark/70">Dec 10 - Dec 17, 2024</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <button className="text-primary hover:text-primary/80 font-medium text-sm">
                              View Details
                            </button>
                            <button className="bg-gray-100 hover:bg-gray-200 text-dark font-accent text-sm px-4 py-2 rounded-full transition">
                              Leave a Review
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative pl-8 border-l-2 border-gray-200">
                      <div className="absolute -left-2.5 top-0">
                        <div className="w-5 h-5 rounded-full bg-gray-300"></div>
                      </div>
                      <div className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm">
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-display font-bold text-dark text-xl">Tokyo Food Tour</h3>
                            <span className="text-sm text-dark/50">August 2024</span>
                          </div>
                          <p className="text-dark/70 mb-3">Tokyo, Japan</p>
                          <div className="flex items-center mb-4">
                            <i className="fas fa-calendar-day text-primary mr-2"></i>
                            <span className="text-sm text-dark/70">Aug 5, 2024</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <button className="text-primary hover:text-primary/80 font-medium text-sm">
                              View Details
                            </button>
                            <div className="flex items-center text-sm text-dark/70">
                              <span className="mr-2">Your rating:</span>
                              <div className="flex text-yellow-400">
                                <i className="fas fa-star text-xs"></i>
                                <i className="fas fa-star text-xs"></i>
                                <i className="fas fa-star text-xs"></i>
                                <i className="fas fa-star text-xs"></i>
                                <i className="fas fa-star text-xs"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-history text-gray-400 text-xl"></i>
                    </div>
                    <h4 className="font-accent font-medium text-dark mb-2">No travel history yet</h4>
                    <p className="text-dark/70 text-sm mb-4">Your completed trips will appear here.</p>
                    <Link 
                      href="/destinations" 
                      className="inline-block bg-primary hover:bg-primary/90 text-white font-accent font-medium px-5 py-2 rounded-full transition"
                    >
                      Start Planning
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {/* Account Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="font-display text-xl font-bold text-dark mb-6">Account Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <form className="space-y-6">
                      <h3 className="font-accent font-semibold text-dark mb-4">Personal Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="fullname" className="block text-sm font-medium text-dark/70 mb-1">
                            Full Name
                          </label>
                          <input 
                            type="text" 
                            id="fullname" 
                            defaultValue={userData.fullName || ''}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label htmlFor="username" className="block text-sm font-medium text-dark/70 mb-1">
                            Username
                          </label>
                          <input 
                            type="text" 
                            id="username" 
                            defaultValue={userData.username}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
                            disabled
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-dark/70 mb-1">
                          Email Address
                        </label>
                        <input 
                          type="email" 
                          id="email" 
                          defaultValue={userData.email}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
                        />
                      </div>
                      
                      <h3 className="font-accent font-semibold text-dark mb-4 pt-4">Password</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="current-password" className="block text-sm font-medium text-dark/70 mb-1">
                            Current Password
                          </label>
                          <input 
                            type="password" 
                            id="current-password" 
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
                            placeholder="••••••••"
                          />
                        </div>
                        <div>
                          <label htmlFor="new-password" className="block text-sm font-medium text-dark/70 mb-1">
                            New Password
                          </label>
                          <input 
                            type="password" 
                            id="new-password" 
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                      
                      <h3 className="font-accent font-semibold text-dark mb-4 pt-4">Preferences</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input
                            id="email-notifications"
                            type="checkbox"
                            defaultChecked
                            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                          <label htmlFor="email-notifications" className="ml-2 block text-sm text-dark">
                            Email notifications about new deals and offers
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="trip-reminders"
                            type="checkbox"
                            defaultChecked
                            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                          <label htmlFor="trip-reminders" className="ml-2 block text-sm text-dark">
                            Trip reminders and alerts
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="personalized-recommendations"
                            type="checkbox"
                            defaultChecked
                            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                          <label htmlFor="personalized-recommendations" className="ml-2 block text-sm text-dark">
                            Personalized travel recommendations
                          </label>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <button
                          type="submit"
                          className="bg-primary hover:bg-primary/90 text-white font-accent font-medium px-6 py-2.5 rounded-full transition"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                  
                  <div>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-accent font-semibold text-dark mb-4">Profile Picture</h3>
                      <div className="flex flex-col items-center">
                        <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                          <img 
                            src={userData.avatarUrl || 'https://randomuser.me/api/portraits/lego/1.jpg'} 
                            alt={userData.username} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button className="bg-primary hover:bg-primary/90 text-white font-accent font-medium px-4 py-2 rounded-full transition text-sm w-full mb-2">
                          Upload New Photo
                        </button>
                        <button className="bg-gray-200 hover:bg-gray-300 text-dark/70 font-accent font-medium px-4 py-2 rounded-full transition text-sm w-full">
                          Remove
                        </button>
                      </div>
                      
                      <div className="mt-8">
                        <h3 className="font-accent font-semibold text-dark mb-4">Subscription</h3>
                        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium text-dark">{userData.isSubscribed ? userData.plan + ' Plan' : 'Free Plan'}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${userData.isSubscribed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {userData.isSubscribed ? 'Active' : 'Limited'}
                            </span>
                          </div>
                          {userData.isSubscribed ? (
                            <p className="text-sm text-dark/70 mb-3">Your plan renews on Jan 15, 2025</p>
                          ) : (
                            <p className="text-sm text-dark/70 mb-3">Upgrade for premium features</p>
                          )}
                          <Link
                            href="/checkout"
                            className="block text-center bg-primary/10 hover:bg-primary/20 text-primary font-accent font-medium px-4 py-2 rounded-full transition text-sm"
                          >
                            {userData.isSubscribed ? 'Manage Plan' : 'Upgrade Now'}
                          </Link>
                        </div>
                      </div>
                      
                      <div className="mt-8">
                        <h3 className="font-accent font-semibold text-dark mb-4">Account Actions</h3>
                        <button className="block w-full text-left text-sm text-red-600 hover:text-red-700 mb-2">
                          <i className="fas fa-trash-alt mr-2"></i> Delete Account
                        </button>
                        <button className="block w-full text-left text-sm text-dark/70 hover:text-dark">
                          <i className="fas fa-download mr-2"></i> Export My Data
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
