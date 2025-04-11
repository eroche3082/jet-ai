import { users, type User, type InsertUser } from "@shared/schema";
import type { Booking, Destination, SavedItem, Itinerary, InsertItinerary } from "@shared/schema";

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
  getUserSavedItems(userId: number): Promise<SavedItem[]>;
  getUserItineraries(userId: number): Promise<Itinerary[]>;
  
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
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private userProfiles: Map<number, any>;
  private bookings: Map<number, Booking>;
  private savedItems: Map<number, SavedItem[]>;
  private destinations: Map<string, Destination>;
  private chatHistory: Map<number, any[]>;
  private itineraries: Map<number, Itinerary>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.userProfiles = new Map();
    this.bookings = new Map();
    this.savedItems = new Map();
    this.destinations = new Map();
    this.chatHistory = new Map();
    this.currentId = 1;
    
    // Initialize with a demo user
    this.users.set(1, {
      id: 1,
      username: 'demo',
      password: 'password',
      email: 'demo@example.com',
      fullName: 'Demo User',
      avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
      memberSince: new Date('2023-05-15'),
      stripeCustomerId: 'cus_demo',
      stripeSubscriptionId: 'sub_demo',
      isSubscribed: true,
      subscriptionPlan: 'Premium',
      subscriptionEndDate: new Date('2025-05-15'),
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
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
      isSubscribed: false,
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
      subscriptionPlan: 'Premium', // Default to Premium plan
      subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
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
}

export const storage = new MemStorage();
