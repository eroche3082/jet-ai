import { users, type User, type InsertUser } from "@shared/schema";
import type { Booking } from "@shared/schema";

// Define interface for social posts
export interface SocialPost {
  id: string;
  userId: number;
  content: string;
  hashtags: string[];
  mediaUrls: string[];
  platform: string;
  postType: string;
  status: 'draft' | 'published' | 'scheduled';
  publishedAt?: string;
  scheduledFor?: string;
  likes: number;
  comments: number;
  shares: number;
  analytics?: {
    impressions: number;
    engagement: number;
    clicks: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface InsertSocialPost {
  userId: number;
  content: string;
  hashtags: string[];
  mediaUrls: string[];
  platform: string;
  postType: string;
  status: 'draft' | 'published' | 'scheduled';
  publishedAt?: string;
  scheduledFor?: string;
}

// Storage interface with all required methods
export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;
  updateStripeCustomerId(userId: number, customerId: string): Promise<User | undefined>;
  updateUserStripeInfo(userId: number, info: { customerId: string, subscriptionId: string }): Promise<User | undefined>;
  
  // Membership management
  upgradeToFreemium(userId: number): Promise<User | undefined>;
  upgradeToPremium(userId: number): Promise<User | undefined>;
  decrementAICredits(userId: number, count?: number): Promise<User | undefined>;
  rechargePremiumBenefits(userId: number): Promise<User | undefined>;

  // User profiles
  getUserProfile(userId: number): Promise<any | undefined>;
  getUserBookings(userId: number): Promise<Booking[]>;
  
  // Social Media functionality
  getSocialPostsByUserId(userId: number): Promise<SocialPost[]>;
  getSocialPostById(id: string): Promise<SocialPost | undefined>;
  createSocialPost(post: InsertSocialPost): Promise<SocialPost>;
  updateSocialPost(id: string, data: Partial<SocialPost>): Promise<SocialPost | undefined>;
  deleteSocialPost(id: string): Promise<boolean>;
  
  // Destinations
  getDestinations(filters?: any): Promise<Destination[]>;
  getDestinationById(id: string | number): Promise<Destination | undefined>;
  
  // Bookings
  createBooking(booking: any): Promise<Booking>;
  updateBookingStatus(id: number, status: string): Promise<Booking | undefined>;
  
  // Saved Items
  saveItem(item: any): Promise<SavedItem>;
  removeSavedItem(userId: number, itemId: number): Promise<boolean>;
  
  // Chat History
  saveChatMessage(userId: number, message: string, role: 'user' | 'assistant'): Promise<void>;
  getChatHistory(userId: number, limit?: number): Promise<any[]>;
  
  // Itineraries
  createItinerary(itinerary: InsertItinerary): Promise<Itinerary>;
  getItineraryById(id: number): Promise<Itinerary | undefined>;
  updateItinerary(id: number, data: Partial<Itinerary>): Promise<Itinerary | undefined>;
  deleteItinerary(id: number): Promise<boolean>;
  shareItinerary(id: number, isPublic: boolean): Promise<Itinerary | undefined>;
  bookmarkItinerary(id: number, isBookmarked: boolean): Promise<Itinerary | undefined>;
  
  // Community Posts
  getCommunityPosts(): Promise<any[]>;
  getCommunityPostById(id: string): Promise<any | undefined>;
  createCommunityPost(post: any): Promise<any>;
  likeCommunityPost(postId: string, userId: number): Promise<{ action: 'added' | 'removed', likeCount: number } | undefined>;
  addCommunityPostComment(comment: any): Promise<any>;
  getCommunityPostComments(postId: string): Promise<any[]>;
  getCommunityPostsByJourneyCode(journeyCode: string): Promise<any[]>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private userProfiles: Map<number, any>;
  private bookings: Map<number, Booking>;
  private savedItems: Map<number, any[]>;
  private destinations: Map<string, any>;
  private chatHistory: Map<number, any[]>;
  private itineraries: Map<number, any>;
  private socialPosts: Map<string, SocialPost>;
  private communityPosts: Map<string, any>;
  private socialPostId: number;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.userProfiles = new Map();
    this.bookings = new Map();
    this.savedItems = new Map();
    this.destinations = new Map();
    this.chatHistory = new Map();
    this.itineraries = new Map();
    this.socialPosts = new Map();
    this.communityPosts = new Map();
    this.currentId = 1;
    this.socialPostId = 1;
    
    // Initialize with demo social posts
    const demoPostId1 = `post_${Date.now()}_1`;
    const demoPostId2 = `post_${Date.now()}_2`;
    const demoPostId3 = `post_${Date.now()}_3`;
    
    this.socialPosts.set(demoPostId1, {
      id: demoPostId1,
      userId: 1,
      content: "Just arrived in Bali for a week of adventure and relaxation! The sunset view from my villa is absolutely breathtaking. Can't wait to explore the beaches and temples tomorrow. #TravelWithJetAI #BaliAdventure",
      hashtags: ["#TravelWithJetAI", "#BaliAdventure", "#IslandLife", "#Paradise"],
      mediaUrls: ["https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=2938&ixlib=rb-4.0.3"],
      platform: "instagram",
      postType: "image",
      status: "published",
      publishedAt: new Date().toISOString(),
      likes: 124,
      comments: 18,
      shares: 5,
      analytics: {
        impressions: 1450,
        engagement: 147,
        clicks: 36
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    this.socialPosts.set(demoPostId2, {
      id: demoPostId2,
      userId: 1,
      content: "Planning my trip to Kyoto next month during cherry blossom season. Any recommendations for must-visit temples or hidden gems? #TravelPlanning #Kyoto #JapanTravel",
      hashtags: ["#TravelPlanning", "#Kyoto", "#JapanTravel", "#CherryBlossoms"],
      mediaUrls: [],
      platform: "twitter",
      postType: "text",
      status: "published",
      publishedAt: new Date().toISOString(),
      likes: 42,
      comments: 26,
      shares: 3,
      analytics: {
        impressions: 876,
        engagement: 71,
        clicks: 12
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    // A scheduled post for future publication
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + 7); // One week from now
    
    this.socialPosts.set(demoPostId3, {
      id: demoPostId3,
      userId: 1,
      content: "Excited to announce I'll be starting a 10-day road trip through the scenic coast of California next month! Follow along for stunning views and travel tips. #CaliforniaDreaming #RoadTrip #TravelWithJetAI",
      hashtags: ["#CaliforniaDreaming", "#RoadTrip", "#TravelWithJetAI", "#CoastalViews"],
      mediaUrls: ["https://images.unsplash.com/photo-1505245208761-ba872912fac0?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3"],
      platform: "instagram",
      postType: "image",
      status: "scheduled",
      scheduledFor: scheduledDate.toISOString(),
      likes: 0,
      comments: 0,
      shares: 0,
      analytics: {
        impressions: 0,
        engagement: 0,
        clicks: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    // Initialize with a demo user
    this.users.set(1, {
      id: 1,
      username: 'demo',
      password: 'password',
      email: 'demo@example.com',
      fullName: 'Demo User',
      avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
      memberSince: new Date('2023-05-15'),
      googleId: null,
      lastLoginAt: new Date(),
      membershipTier: 'premium',
      stripeCustomerId: 'cus_demo',
      stripeSubscriptionId: 'sub_demo',
      isSubscribed: true,
      subscriptionPlan: 'Premium',
      subscriptionEndDate: new Date('2025-05-15'),
      aiCreditsRemaining: 999,
      monthlySearches: 0,
      maxMonthlySearches: 999,
      preferences: {
        'preferredCurrency': 'USD',
        'preferredLanguage': 'en',
        'travelStyle': 'adventure'
      },
      travelStyle: {
        'adventure': 8,
        'luxury': 5,
        'budget': 3,
        'cultural': 9
      },
      createdAt: new Date(),
      updatedAt: new Date()
    } as User);
    
    // Initialize with a demo profile
    this.userProfiles.set(1, {
      id: 1,
      username: 'demo',
      email: 'demo@example.com',
      fullName: 'Demo User',
      avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
      memberSince: '2023-05-15',
      isSubscribed: true,
      plan: 'Premium'
    });
    
    // Initialize with demo bookings
    this.bookings.set(1, [
      {
        id: 1,
        userId: 1,
        type: 'accommodation',
        itemId: 1,
        title: 'Oceanview Villa',
        location: 'Bali, Indonesia',
        startDate: new Date('2025-07-15'),
        endDate: new Date('2025-07-22'),
        status: 'upcoming',
        totalAmount: 2450,
        imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        userId: 1,
        type: 'experience',
        itemId: 4,
        title: 'Northern Lights Expedition',
        location: 'Tromsø, Norway',
        startDate: new Date('2025-11-05'),
        endDate: new Date('2025-11-05'),
        status: 'upcoming',
        totalAmount: 195,
        imageUrl: 'https://images.unsplash.com/photo-1464037946554-55bf5c27f07a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        userId: 1,
        type: 'accommodation',
        itemId: 2,
        title: 'Mountain Chalet',
        location: 'Swiss Alps, Switzerland',
        startDate: new Date('2024-12-10'),
        endDate: new Date('2024-12-17'),
        status: 'completed',
        totalAmount: 1960,
        imageUrl: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28f17?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ] as any);
    
    // Initialize with demo saved items
    this.savedItems.set(1, [
      {
        id: 1,
        userId: 1,
        type: 'destination',
        itemId: 3,
        name: 'Santorini',
        location: 'Greece',
        imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
        createdAt: new Date()
      },
      {
        id: 2,
        userId: 1,
        type: 'accommodation',
        itemId: 4,
        name: 'Urban Penthouse',
        location: 'New York, USA',
        imageUrl: 'https://images.unsplash.com/photo-1560200353-ce0a76b1d438?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
        createdAt: new Date()
      },
      {
        id: 3,
        userId: 1,
        type: 'experience',
        itemId: 6,
        name: 'Exclusive Vineyard Tour',
        location: 'Tuscany, Italy',
        imageUrl: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        createdAt: new Date()
      }
    ] as any);
    
    // Initialize with a demo itinerary
    this.itineraries.set(1, {
      id: 1,
      userId: 1,
      title: 'Adventure in Kyoto',
      destination: 'Kyoto, Japan',
      startDate: new Date('2025-04-10'),
      endDate: new Date('2025-04-14'),
      totalDays: 5,
      budget: 2500,
      currency: 'USD',
      travelStyle: 'cultural',
      statusComplete: true,
      content: {
        days: [
          {
            day: 1,
            date: '2025-04-10',
            activities: [
              {
                time: '09:00',
                title: 'Fushimi Inari Shrine',
                description: 'Visit the iconic shrine with thousands of vermilion torii gates.',
                location: 'Fushimi Inari-taisha',
                coordinates: { lat: 34.9671, lng: 135.7727 },
                duration: 180,
                cost: 0,
                transportMode: 'train',
                travelTime: 30
              },
              {
                time: '13:00',
                title: 'Lunch at Nishiki Market',
                description: 'Sample local food at the famous food market.',
                location: 'Nishiki Market',
                coordinates: { lat: 35.0042, lng: 135.7646 },
                duration: 120,
                cost: 25,
                transportMode: 'walk',
                travelTime: 15
              },
              {
                time: '16:00',
                title: 'Tea Ceremony',
                description: 'Authentic tea ceremony experience.',
                location: 'Traditional Tea House',
                coordinates: { lat: 35.0116, lng: 135.7681 },
                duration: 90,
                cost: 50,
                transportMode: 'taxi',
                travelTime: 20
              }
            ]
          },
          {
            day: 2,
            date: '2025-04-11',
            activities: [
              {
                time: '08:00',
                title: 'Arashiyama Bamboo Grove',
                description: 'Walk through the stunning bamboo forest.',
                location: 'Arashiyama',
                coordinates: { lat: 35.0094, lng: 135.6738 },
                duration: 120,
                cost: 0,
                transportMode: 'train',
                travelTime: 40
              },
              {
                time: '11:30',
                title: 'Tenryu-ji Temple',
                description: 'Visit this UNESCO World Heritage Site with beautiful gardens.',
                location: 'Tenryu-ji',
                coordinates: { lat: 35.0169, lng: 135.6745 },
                duration: 150,
                cost: 15,
                transportMode: 'walk',
                travelTime: 10
              },
              {
                time: '15:00',
                title: 'Monkey Park Iwatayama',
                description: 'See Japanese macaques in their natural habitat.',
                location: 'Iwatayama Monkey Park',
                coordinates: { lat: 35.0106, lng: 135.6773 },
                duration: 120,
                cost: 10,
                transportMode: 'walk',
                travelTime: 20
              }
            ]
          },
          {
            day: 3,
            date: '2025-04-12',
            activities: [
              {
                time: '09:30',
                title: 'Kinkaku-ji (Golden Pavilion)',
                description: 'Visit the famous gold-leaf covered temple.',
                location: 'Kinkaku-ji',
                coordinates: { lat: 35.0394, lng: 135.7291 },
                duration: 120,
                cost: 15,
                transportMode: 'bus',
                travelTime: 35
              },
              {
                time: '13:00',
                title: 'Lunch at Traditional Restaurant',
                description: 'Enjoy a kaiseki meal (traditional multi-course Japanese dinner).',
                location: 'Kyoto Kaiseki Restaurant',
                coordinates: { lat: 35.0116, lng: 135.7654 },
                duration: 120,
                cost: 80,
                transportMode: 'taxi',
                travelTime: 25
              },
              {
                time: '16:00',
                title: 'Gion District Exploration',
                description: 'Walk through the historic geisha district and possibly spot geishas.',
                location: 'Gion',
                coordinates: { lat: 35.0035, lng: 135.7766 },
                duration: 180,
                cost: 0,
                transportMode: 'taxi',
                travelTime: 20
              }
            ]
          },
          {
            day: 4,
            date: '2025-04-13',
            activities: [
              {
                time: '09:00',
                title: 'Kiyomizu-dera Temple',
                description: 'Visit this historic Buddhist temple with panoramic views of Kyoto.',
                location: 'Kiyomizu-dera',
                coordinates: { lat: 34.9949, lng: 135.7851 },
                duration: 180,
                cost: 5,
                transportMode: 'bus',
                travelTime: 30
              },
              {
                time: '13:30',
                title: 'Sanjusangendo Hall',
                description: 'See the hall with 1001 statues of the goddess of mercy.',
                location: 'Sanjusangendo',
                coordinates: { lat: 34.9875, lng: 135.7754 },
                duration: 120,
                cost: 10,
                transportMode: 'walk',
                travelTime: 25
              },
              {
                time: '16:30',
                title: 'Philosopher\'s Path',
                description: 'Stroll along the peaceful canal lined with cherry trees.',
                location: 'Philosopher\'s Path',
                coordinates: { lat: 35.0225, lng: 135.7906 },
                duration: 120,
                cost: 0,
                transportMode: 'bus',
                travelTime: 25
              }
            ]
          },
          {
            day: 5,
            date: '2025-04-14',
            activities: [
              {
                time: '08:30',
                title: 'Ryoanji Temple',
                description: 'See the famous rock garden, one of the most celebrated in Japan.',
                location: 'Ryoanji',
                coordinates: { lat: 35.0347, lng: 135.7182 },
                duration: 120,
                cost: 5,
                transportMode: 'bus',
                travelTime: 40
              },
              {
                time: '12:00',
                title: 'Shopping in Downtown Kyoto',
                description: 'Last-minute souvenir shopping in the city center.',
                location: 'Downtown Kyoto',
                coordinates: { lat: 35.0031, lng: 135.7655 },
                duration: 180,
                cost: 100,
                transportMode: 'train',
                travelTime: 30
              },
              {
                time: '16:00',
                title: 'Farewell Dinner',
                description: 'Enjoy a final evening meal in Kyoto.',
                location: 'Pontocho Alley',
                coordinates: { lat: 35.0043, lng: 135.7708 },
                duration: 180,
                cost: 60,
                transportMode: 'walk',
                travelTime: 20
              }
            ]
          }
        ],
        notes: 'Weather in April should be pleasant. Cherry blossoms might still be visible early in the month.',
        totalCost: 2200,
        recommendedAccommodations: [
          { id: 5, name: 'Traditional Ryokan in Gion' },
          { id: 12, name: 'Modern Hotel near Kyoto Station' }
        ]
      },
      isPublic: true,
      isBookmarked: true,
      createdAt: new Date('2025-01-15'),
      updatedAt: new Date('2025-01-20')
    } as Itinerary);
  }

  // User management methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      memberSince: now,
      googleId: null,
      lastLoginAt: now,
      membershipTier: 'basic', // Default to basic tier
      isSubscribed: false,
      aiCreditsRemaining: 5, // Basic users start with 5 credits
      monthlySearches: 0,
      maxMonthlySearches: 10, // Basic users can do 10 searches per month
      preferences: {
        'preferredCurrency': 'USD',
        'preferredLanguage': 'en'
      },
      travelStyle: {},
      createdAt: now,
      updatedAt: now
    } as User;
    this.users.set(id, user);
    
    // Create empty profile
    this.userProfiles.set(id, {
      id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      memberSince: now.toISOString(),
      membershipTier: 'basic',
      aiCreditsRemaining: 5,
      isSubscribed: false
    });
    
    // Initialize empty bookings and saved items
    this.bookings.set(id, []);
    this.savedItems.set(id, []);
    this.chatHistory.set(id, []);
    
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...data, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    
    // Update profile if it exists
    const profile = this.userProfiles.get(id);
    if (profile) {
      this.userProfiles.set(id, {
        ...profile,
        ...data,
        isSubscribed: updatedUser.isSubscribed,
        plan: updatedUser.subscriptionPlan
      });
    }
    
    return updatedUser;
  }

  async updateStripeCustomerId(userId: number, customerId: string): Promise<User | undefined> {
    return this.updateUser(userId, { stripeCustomerId: customerId });
  }

  async updateUserStripeInfo(userId: number, info: { customerId: string, subscriptionId: string }): Promise<User | undefined> {
    return this.updateUser(userId, { 
      stripeCustomerId: info.customerId,
      stripeSubscriptionId: info.subscriptionId,
      isSubscribed: true,
      membershipTier: 'premium',
      subscriptionPlan: 'Premium', // Default to Premium plan
      subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      aiCreditsRemaining: 999, // Premium users get unlimited credits (using a high number to represent this)
      maxMonthlySearches: 999, // Premium users get unlimited searches
    });
  }
  
  // Membership management methods
  async upgradeToFreemium(userId: number): Promise<User | undefined> {
    return this.updateUser(userId, {
      membershipTier: 'freemium',
      aiCreditsRemaining: 20,
      maxMonthlySearches: 30
    });
  }
  
  async upgradeToPremium(userId: number): Promise<User | undefined> {
    return this.updateUser(userId, {
      membershipTier: 'premium',
      isSubscribed: true,
      subscriptionPlan: 'Premium',
      aiCreditsRemaining: 999, // Unlimited represented as high number
      maxMonthlySearches: 999, // Unlimited represented as high number
      subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    });
  }
  
  async decrementAICredits(userId: number, count = 1): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    // Premium users have unlimited credits
    if (user.membershipTier === 'premium') return user;
    
    const currentCredits = user.aiCreditsRemaining || 0;
    const newCredits = Math.max(0, currentCredits - count);
    
    return this.updateUser(userId, { aiCreditsRemaining: newCredits });
  }
  
  async rechargePremiumBenefits(userId: number): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    // Only recharge premium users
    if (user.membershipTier !== 'premium') return user;
    
    return this.updateUser(userId, {
      aiCreditsRemaining: 999,
      monthlySearches: 0,
      subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Extend by 30 days
    });
  }

  // User profile methods
  async getUserProfile(userId: number): Promise<any | undefined> {
    return this.userProfiles.get(userId);
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
    return this.bookings.get(userId) || [];
  }

  async getUserSavedItems(userId: number): Promise<SavedItem[]> {
    return this.savedItems.get(userId) || [];
  }

  // Destination methods
  async getDestinations(filters?: any): Promise<Destination[]> {
    // In a real app, this would filter the destinations based on the provided filters
    return Array.from(this.destinations.values());
  }

  async getDestinationById(id: string | number): Promise<Destination | undefined> {
    return this.destinations.get(id.toString());
  }

  // Booking methods
  async createBooking(booking: any): Promise<Booking> {
    const id = this.currentId++;
    const now = new Date();
    const newBooking: Booking = {
      ...booking,
      id,
      createdAt: now,
      updatedAt: now
    } as Booking;
    
    // Add to user's bookings
    const userBookings = this.bookings.get(booking.userId) || [];
    userBookings.push(newBooking);
    this.bookings.set(booking.userId, userBookings);
    
    return newBooking;
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    // Find the booking across all users
    for (const [userId, userBookings] of this.bookings.entries()) {
      const bookingIndex = userBookings.findIndex(b => b.id === id);
      if (bookingIndex >= 0) {
        const booking = userBookings[bookingIndex];
        const updatedBooking = { 
          ...booking, 
          status, 
          updatedAt: new Date() 
        };
        
        // Update the booking
        userBookings[bookingIndex] = updatedBooking;
        this.bookings.set(userId, userBookings);
        
        return updatedBooking;
      }
    }
    
    return undefined;
  }

  // Saved item methods
  async saveItem(item: any): Promise<SavedItem> {
    const id = this.currentId++;
    const newItem: SavedItem = {
      ...item,
      id,
      createdAt: new Date()
    } as SavedItem;
    
    // Add to user's saved items
    const userItems = this.savedItems.get(item.userId) || [];
    userItems.push(newItem);
    this.savedItems.set(item.userId, userItems);
    
    return newItem;
  }

  async removeSavedItem(userId: number, itemId: number): Promise<boolean> {
    const items = this.savedItems.get(userId);
    if (!items) return false;
    
    const newItems = items.filter(item => item.id !== itemId);
    this.savedItems.set(userId, newItems);
    
    return items.length !== newItems.length;
  }

  // Chat history methods
  async saveChatMessage(userId: number, message: string, role: 'user' | 'assistant'): Promise<void> {
    const history = this.chatHistory.get(userId) || [];
    history.push({
      id: this.currentId++,
      userId,
      message,
      role,
      createdAt: new Date()
    });
    this.chatHistory.set(userId, history);
  }

  async getChatHistory(userId: number, limit = 50): Promise<any[]> {
    const history = this.chatHistory.get(userId) || [];
    return history.slice(-limit);
  }

  // Itinerary methods
  async getUserItineraries(userId: number): Promise<Itinerary[]> {
    return Array.from(this.itineraries.values())
      .filter(itinerary => itinerary.userId === userId);
  }
  
  async createItinerary(itinerary: InsertItinerary): Promise<Itinerary> {
    const id = this.currentId++;
    const now = new Date();
    
    const newItinerary: Itinerary = {
      ...itinerary,
      id,
      statusComplete: false,
      isPublic: false,
      isBookmarked: false,
      createdAt: now,
      updatedAt: now
    } as Itinerary;
    
    this.itineraries.set(id, newItinerary);
    return newItinerary;
  }
  
  async getItineraryById(id: number): Promise<Itinerary | undefined> {
    return this.itineraries.get(id);
  }
  
  async updateItinerary(id: number, data: Partial<Itinerary>): Promise<Itinerary | undefined> {
    const itinerary = this.itineraries.get(id);
    if (!itinerary) return undefined;
    
    const updatedItinerary = { 
      ...itinerary, 
      ...data, 
      updatedAt: new Date() 
    };
    
    this.itineraries.set(id, updatedItinerary);
    return updatedItinerary;
  }
  
  async deleteItinerary(id: number): Promise<boolean> {
    return this.itineraries.delete(id);
  }
  
  async shareItinerary(id: number, isPublic: boolean): Promise<Itinerary | undefined> {
    return this.updateItinerary(id, { isPublic });
  }
  
  async bookmarkItinerary(id: number, isBookmarked: boolean): Promise<Itinerary | undefined> {
    return this.updateItinerary(id, { isBookmarked });
  }

  // Community Posts
  private communityPosts: Map<string, any> = new Map();
  private communityLikes: Map<string, Set<number>> = new Map();
  private communityComments: Map<string, any[]> = new Map();
  private journeyCodeMap: Map<string, string[]> = new Map();
  
  async getCommunityPosts(): Promise<any[]> {
    return Array.from(this.communityPosts.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getCommunityPostById(id: string): Promise<any | undefined> {
    return this.communityPosts.get(id);
  }

  async createCommunityPost(post: any): Promise<any> {
    const id = `post_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const newPost = {
      id,
      ...post,
      likes: 0,
      comments: 0,
      isLiked: false
    };
    
    this.communityPosts.set(id, newPost);
    this.communityLikes.set(id, new Set());
    this.communityComments.set(id, []);
    
    // Store journey code mapping
    if (post.journeyCode) {
      const posts = this.journeyCodeMap.get(post.journeyCode) || [];
      this.journeyCodeMap.set(post.journeyCode, [...posts, id]);
    }
    
    return newPost;
  }

  async likeCommunityPost(postId: string, userId: number): Promise<{ action: 'added' | 'removed', likeCount: number } | undefined> {
    const post = this.communityPosts.get(postId);
    if (!post) return undefined;
    
    const likes = this.communityLikes.get(postId) || new Set();
    let action: 'added' | 'removed';
    
    if (likes.has(userId)) {
      likes.delete(userId);
      action = 'removed';
    } else {
      likes.add(userId);
      action = 'added';
    }
    
    this.communityLikes.set(postId, likes);
    
    const likeCount = likes.size;
    post.likes = likeCount;
    this.communityPosts.set(postId, post);
    
    return { action, likeCount };
  }

  async addCommunityPostComment(comment: any): Promise<any> {
    const { postId } = comment;
    const post = this.communityPosts.get(postId);
    if (!post) throw new Error('Post not found');
    
    const id = `comment_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const newComment = {
      id,
      ...comment
    };
    
    const comments = this.communityComments.get(postId) || [];
    comments.push(newComment);
    this.communityComments.set(postId, comments);
    
    // Update comment count on post
    post.comments = comments.length;
    this.communityPosts.set(postId, post);
    
    return newComment;
  }

  async getCommunityPostComments(postId: string): Promise<any[]> {
    return this.communityComments.get(postId) || [];
  }

  async getCommunityPostsByJourneyCode(journeyCode: string): Promise<any[]> {
    const postIds = this.journeyCodeMap.get(journeyCode) || [];
    const posts = [];
    
    for (const id of postIds) {
      const post = this.communityPosts.get(id);
      if (post) posts.push(post);
    }
    
    return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Social Media Post Methods
  async getSocialPostsByUserId(userId: number): Promise<SocialPost[]> {
    const posts: SocialPost[] = [];
    
    for (const post of this.socialPosts.values()) {
      if (post.userId === userId) {
        posts.push(post);
      }
    }
    
    return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getSocialPostById(id: string): Promise<SocialPost | undefined> {
    return this.socialPosts.get(id);
  }

  async createSocialPost(post: InsertSocialPost): Promise<SocialPost> {
    const id = `post_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const now = new Date().toISOString();
    
    const newPost: SocialPost = {
      id,
      ...post,
      likes: 0,
      comments: 0,
      shares: 0,
      analytics: {
        impressions: 0,
        engagement: 0,
        clicks: 0
      },
      createdAt: now,
      updatedAt: now
    };
    
    this.socialPosts.set(id, newPost);
    return newPost;
  }

  async updateSocialPost(id: string, data: Partial<SocialPost>): Promise<SocialPost | undefined> {
    const post = this.socialPosts.get(id);
    if (!post) return undefined;
    
    const updatedPost = { 
      ...post, 
      ...data, 
      updatedAt: new Date().toISOString() 
    };
    
    this.socialPosts.set(id, updatedPost);
    return updatedPost;
  }

  async deleteSocialPost(id: string): Promise<boolean> {
    if (!this.socialPosts.has(id)) return false;
    return this.socialPosts.delete(id);
  }
}

export const storage = new MemStorage();
