import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { chatHandler } from "./lib/ai";
import { travelSearchDestinations, travelSearchExperiences, travelSearchAccommodations } from "./lib/travelApi";
import { createPaymentIntent, createSubscription, getSubscriptionPlans } from "./lib/stripe";
import connectPgSimple from 'connect-pg-simple';
import memorystore from 'memorystore';

// Configure session store
const createSessionStore = () => {
  if (process.env.NODE_ENV === "production" && process.env.DATABASE_URL) {
    // Use a database session store in production
    const pgSession = connectPgSimple(session);
    return new pgSession({
      conString: process.env.DATABASE_URL,
      tableName: 'session',
    });
  } else {
    // Use memory store for development
    const MemoryStore = memorystore(session);
    return new MemoryStore({
      checkPeriod: 86400000 // Prune expired entries every 24h
    });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup sessions
  app.use(
    session({
      store: createSessionStore(),
      secret: process.env.SESSION_SECRET || 'jetai-session-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      },
    })
  );

  // Setup Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure Passport
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }

        // In a real app, you'd hash and compare passwords
        if (user.password !== password) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Authentication middleware
  const ensureAuthenticated = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // Auth routes
  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info.message });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.status(200).json({ id: user.id, username: user.username });
      });
    })(req, res, next);
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }

      // Create new user
      const newUser = await storage.createUser({
        username,
        password,
        email
      });

      res.status(201).json({ 
        message: "User created successfully",
        id: newUser.id
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Error creating user" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  // User routes
  app.get("/api/user/profile", ensureAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const userProfile = await storage.getUserProfile(user.id);
      res.json(userProfile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Error fetching profile" });
    }
  });

  app.get("/api/user/bookings", ensureAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const bookings = await storage.getUserBookings(user.id);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Error fetching bookings" });
    }
  });

  app.get("/api/user/saved-items", ensureAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const savedItems = await storage.getUserSavedItems(user.id);
      res.json(savedItems);
    } catch (error) {
      console.error("Error fetching saved items:", error);
      res.status(500).json({ message: "Error fetching saved items" });
    }
  });
  
  app.get("/api/user/itineraries", ensureAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const itineraries = await storage.getUserItineraries(user.id);
      res.json(itineraries);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
      res.status(500).json({ message: "Error fetching itineraries" });
    }
  });
  
  app.get("/api/itineraries/:id", async (req, res) => {
    try {
      const itineraryId = parseInt(req.params.id);
      if (isNaN(itineraryId)) {
        return res.status(400).json({ message: "Invalid itinerary ID" });
      }
      
      const itinerary = await storage.getItineraryById(itineraryId);
      if (!itinerary) {
        return res.status(404).json({ message: "Itinerary not found" });
      }
      
      // If itinerary is not public, check if the user is authenticated and is the owner
      if (!itinerary.isPublic) {
        const user = req.user as any;
        if (!user || user.id !== itinerary.userId) {
          return res.status(403).json({ message: "Access denied" });
        }
      }
      
      res.json(itinerary);
    } catch (error) {
      console.error("Error fetching itinerary:", error);
      res.status(500).json({ message: "Error fetching itinerary" });
    }
  });

  // AI Chat routes
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }
      
      const userId = req.user ? (req.user as any).id : null;
      const response = await chatHandler(message, history, userId);
      res.json(response);
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Error processing chat message" });
    }
  });

  // Travel API routes
  app.post("/api/destinations/recommend", async (req, res) => {
    try {
      const preferences = req.body;
      const destinations = await travelSearchDestinations(preferences);
      res.json(destinations);
    } catch (error) {
      console.error("Error recommending destinations:", error);
      res.status(500).json({ message: "Error recommending destinations" });
    }
  });

  app.post("/api/itinerary/generate", async (req, res) => {
    try {
      const { destination, days, preferences } = req.body;
      if (!destination || !days) {
        return res.status(400).json({ message: "Destination and days are required" });
      }
      
      const userId = req.user ? (req.user as any).id : null;
      const user = userId ? await storage.getUser(userId) : null;
      
      // Check if user has enough credits if not premium
      if (user && user.membershipTier !== 'premium' && (user.aiCreditsRemaining || 0) <= 0) {
        return res.status(402).json({ 
          message: "Not enough AI credits. Please upgrade your membership or purchase more credits."
        });
      }
      
      const itinerary = await chatHandler(
        `Generate a ${days}-day itinerary for ${destination} with these preferences: ${JSON.stringify(preferences)}`,
        [],
        userId
      );
      
      // Decrement credits for non-premium users
      if (user && user.membershipTier !== 'premium') {
        await storage.decrementAICredits(userId);
      }
      
      res.json(itinerary);
    } catch (error) {
      console.error("Error generating itinerary:", error);
      res.status(500).json({ message: "Error generating itinerary" });
    }
  });
  
  // Itinerary CRUD routes
  app.post("/api/itineraries", ensureAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const itineraryData = {
        ...req.body,
        userId: user.id
      };
      
      const newItinerary = await storage.createItinerary(itineraryData);
      res.status(201).json(newItinerary);
    } catch (error) {
      console.error("Error creating itinerary:", error);
      res.status(500).json({ message: "Error creating itinerary" });
    }
  });
  
  app.put("/api/itineraries/:id", ensureAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const itineraryId = parseInt(req.params.id);
      
      if (isNaN(itineraryId)) {
        return res.status(400).json({ message: "Invalid itinerary ID" });
      }
      
      // Find the itinerary
      const itinerary = await storage.getItineraryById(itineraryId);
      if (!itinerary) {
        return res.status(404).json({ message: "Itinerary not found" });
      }
      
      // Check if user owns the itinerary
      if (itinerary.userId !== user.id) {
        return res.status(403).json({ message: "Not authorized to update this itinerary" });
      }
      
      const updatedItinerary = await storage.updateItinerary(itineraryId, req.body);
      res.json(updatedItinerary);
    } catch (error) {
      console.error("Error updating itinerary:", error);
      res.status(500).json({ message: "Error updating itinerary" });
    }
  });
  
  app.delete("/api/itineraries/:id", ensureAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const itineraryId = parseInt(req.params.id);
      
      if (isNaN(itineraryId)) {
        return res.status(400).json({ message: "Invalid itinerary ID" });
      }
      
      // Find the itinerary
      const itinerary = await storage.getItineraryById(itineraryId);
      if (!itinerary) {
        return res.status(404).json({ message: "Itinerary not found" });
      }
      
      // Check if user owns the itinerary
      if (itinerary.userId !== user.id) {
        return res.status(403).json({ message: "Not authorized to delete this itinerary" });
      }
      
      const deleted = await storage.deleteItinerary(itineraryId);
      if (deleted) {
        res.status(200).json({ message: "Itinerary deleted successfully" });
      } else {
        res.status(404).json({ message: "Itinerary not found or already deleted" });
      }
    } catch (error) {
      console.error("Error deleting itinerary:", error);
      res.status(500).json({ message: "Error deleting itinerary" });
    }
  });
  
  app.patch("/api/itineraries/:id/share", ensureAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const itineraryId = parseInt(req.params.id);
      const { isPublic } = req.body;
      
      if (isNaN(itineraryId) || typeof isPublic !== 'boolean') {
        return res.status(400).json({ message: "Invalid parameters" });
      }
      
      // Find the itinerary
      const itinerary = await storage.getItineraryById(itineraryId);
      if (!itinerary) {
        return res.status(404).json({ message: "Itinerary not found" });
      }
      
      // Check if user owns the itinerary
      if (itinerary.userId !== user.id) {
        return res.status(403).json({ message: "Not authorized to share this itinerary" });
      }
      
      const updatedItinerary = await storage.shareItinerary(itineraryId, isPublic);
      res.json(updatedItinerary);
    } catch (error) {
      console.error("Error sharing itinerary:", error);
      res.status(500).json({ message: "Error sharing itinerary" });
    }
  });
  
  app.patch("/api/itineraries/:id/bookmark", ensureAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const itineraryId = parseInt(req.params.id);
      const { isBookmarked } = req.body;
      
      if (isNaN(itineraryId) || typeof isBookmarked !== 'boolean') {
        return res.status(400).json({ message: "Invalid parameters" });
      }
      
      // Find the itinerary
      const itinerary = await storage.getItineraryById(itineraryId);
      if (!itinerary) {
        return res.status(404).json({ message: "Itinerary not found" });
      }
      
      // Only allow bookmarking if itinerary is public or owned by the user
      if (!itinerary.isPublic && itinerary.userId !== user.id) {
        return res.status(403).json({ message: "Not authorized to bookmark this itinerary" });
      }
      
      const updatedItinerary = await storage.bookmarkItinerary(itineraryId, isBookmarked);
      res.json(updatedItinerary);
    } catch (error) {
      console.error("Error bookmarking itinerary:", error);
      res.status(500).json({ message: "Error bookmarking itinerary" });
    }
  });

  app.get("/api/accommodations", async (req, res) => {
    try {
      const { location, checkIn, checkOut, guests } = req.query;
      const accommodations = await travelSearchAccommodations({
        location: location as string,
        checkIn: checkIn as string,
        checkOut: checkOut as string,
        guests: parseInt(guests as string) || 2
      });
      res.json(accommodations);
    } catch (error) {
      console.error("Error searching accommodations:", error);
      res.status(500).json({ message: "Error searching accommodations" });
    }
  });

  app.get("/api/experiences", async (req, res) => {
    try {
      const { location, date, category } = req.query;
      const experiences = await travelSearchExperiences({
        location: location as string,
        date: date as string,
        category: category as string
      });
      res.json(experiences);
    } catch (error) {
      console.error("Error searching experiences:", error);
      res.status(500).json({ message: "Error searching experiences" });
    }
  });

  // Stripe payment routes
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, items } = req.body;
      const paymentIntent = await createPaymentIntent(amount, items);
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ message: "Error creating payment intent" });
    }
  });

  app.post("/api/get-or-create-subscription", ensureAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const { planId, interval } = req.body;
      
      const subscription = await createSubscription(user.id, {
        email: user.email || 'user@example.com', // Default for demo
        planId,
        interval
      });
      
      res.json({
        subscriptionId: subscription.id,
        clientSecret: subscription.clientSecret
      });
    } catch (error) {
      console.error("Error with subscription:", error);
      res.status(500).json({ message: "Error processing subscription" });
    }
  });

  app.get("/api/subscription-plans", async (req, res) => {
    try {
      const plans = await getSubscriptionPlans();
      res.json(plans);
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
      res.status(500).json({ message: "Error fetching subscription plans" });
    }
  });
  
  // Membership management routes
  app.get("/api/user/membership", ensureAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const membership = {
        id: user.id,
        membershipTier: user.membershipTier || 'basic',
        isSubscribed: user.isSubscribed || false,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionEndDate: user.subscriptionEndDate,
        aiCreditsRemaining: user.aiCreditsRemaining || 0,
        monthlySearches: user.monthlySearches || 0,
        maxMonthlySearches: user.maxMonthlySearches || 10
      };
      
      res.json(membership);
    } catch (error) {
      console.error("Error fetching membership details:", error);
      res.status(500).json({ message: "Error fetching membership details" });
    }
  });
  
  app.post("/api/user/membership/freemium", ensureAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      
      // Check if already at freemium or higher tier
      if (user.membershipTier === 'freemium' || user.membershipTier === 'premium') {
        return res.status(400).json({ 
          message: "You are already at or above the freemium tier"
        });
      }
      
      const updatedUser = await storage.upgradeToFreemium(user.id);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({
        message: "Successfully upgraded to Freemium",
        membershipTier: updatedUser.membershipTier,
        aiCreditsRemaining: updatedUser.aiCreditsRemaining,
        maxMonthlySearches: updatedUser.maxMonthlySearches
      });
    } catch (error) {
      console.error("Error upgrading to freemium:", error);
      res.status(500).json({ message: "Error upgrading membership" });
    }
  });
  
  app.post("/api/user/membership/premium", ensureAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      
      // Check if already at premium tier
      if (user.membershipTier === 'premium') {
        return res.status(400).json({ 
          message: "You are already at the premium tier"
        });
      }
      
      const updatedUser = await storage.upgradeToPremium(user.id);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({
        message: "Successfully upgraded to Premium",
        membershipTier: updatedUser.membershipTier,
        isSubscribed: updatedUser.isSubscribed,
        subscriptionPlan: updatedUser.subscriptionPlan,
        aiCreditsRemaining: updatedUser.aiCreditsRemaining,
        maxMonthlySearches: updatedUser.maxMonthlySearches
      });
    } catch (error) {
      console.error("Error upgrading to premium:", error);
      res.status(500).json({ message: "Error upgrading membership" });
    }
  });
  
  app.post("/api/user/membership/recharge", ensureAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      
      // Only premium subscribers can recharge
      if (user.membershipTier !== 'premium') {
        return res.status(403).json({ 
          message: "This feature is only available for premium subscribers"
        });
      }
      
      const updatedUser = await storage.rechargePremiumBenefits(user.id);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({
        message: "Successfully recharged premium benefits",
        aiCreditsRemaining: updatedUser.aiCreditsRemaining,
        monthlySearches: updatedUser.monthlySearches,
        subscriptionEndDate: updatedUser.subscriptionEndDate
      });
    } catch (error) {
      console.error("Error recharging premium benefits:", error);
      res.status(500).json({ message: "Error recharging benefits" });
    }
  });
  
  app.post("/api/user/membership/purchase-credits", ensureAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const { credits } = req.body;
      
      if (!credits || credits <= 0) {
        return res.status(400).json({ message: "Invalid credit amount" });
      }
      
      // Premium users don't need to purchase credits
      if (user.membershipTier === 'premium') {
        return res.status(400).json({ 
          message: "Premium users already have unlimited credits"
        });
      }
      
      // For demonstration purposes, we'll just add the credits
      // In a real app, this would be handled after payment confirmation
      const currentCredits = user.aiCreditsRemaining || 0;
      const updatedUser = await storage.updateUser(user.id, {
        aiCreditsRemaining: currentCredits + credits
      });
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({
        message: `Successfully purchased ${credits} AI credits`,
        aiCreditsRemaining: updatedUser.aiCreditsRemaining
      });
    } catch (error) {
      console.error("Error purchasing credits:", error);
      res.status(500).json({ message: "Error purchasing credits" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
