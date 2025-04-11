import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { chatHandler } from "./lib/ai";
import { travelSearchDestinations, travelSearchExperiences, travelSearchAccommodations } from "./lib/travelApi";
import { createPaymentIntent, createSubscription, getSubscriptionPlans } from "./lib/stripe";

// Configure session store
const createSessionStore = () => {
  if (process.env.NODE_ENV === "production" && process.env.DATABASE_URL) {
    // Use a database session store in production
    const pgSession = require('connect-pg-simple')(session);
    return new pgSession({
      conString: process.env.DATABASE_URL,
      tableName: 'session',
    });
  } else {
    // Use memory store for development
    const MemoryStore = require('memorystore')(session);
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
      const itinerary = await chatHandler(
        `Generate a ${days}-day itinerary for ${destination} with these preferences: ${JSON.stringify(preferences)}`,
        [],
        userId
      );
      res.json(itinerary);
    } catch (error) {
      console.error("Error generating itinerary:", error);
      res.status(500).json({ message: "Error generating itinerary" });
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

  const httpServer = createServer(app);

  return httpServer;
}
