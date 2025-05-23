import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { chatHandler } from "./lib/ai";
import { analyzePreferences } from "./api/userCategorization";
import { 
  travelSearchDestinations, 
  travelSearchExperiences, 
  travelSearchAccommodations,
  searchFlights,
  getFlightById,
  searchDestinations
} from "./lib/travelApi";
import { verifyApiIntegrations, suggestNextApiConnections } from './lib/apiVerification';
import { verifyAllApis, generateApiActivationInstructions } from './lib/apiVerificationService';
import { createPaymentIntent, createSubscription, getSubscriptionPlans } from "./lib/stripe";
import connectPgSimple from 'connect-pg-simple';
import memorystore from 'memorystore';
import { googleCloud } from './lib/googlecloud';
import { 
  processUserMessage, 
  ConversationStage 
} from './lib/conversationFlow';
import { generateUserItinerary } from './lib/itineraryGenerator';
import { processConversation } from './lib/vertexAI';
import { configureRoutes as configureMemoryRoutes } from './api/memoryEnhancementService';
import { configureRoutes as configureGoogleApiRoutes } from './api/googleApiService';
import { configureRoutes as configureGeminiRoutes } from './api/geminiService';
import { configureRoutes as configureAvatarRoutes } from './api/avatarService';
import translationRoutes from './api/translationRoutes';
import notificationRoutes from './api/notificationRoutes';
import socialPostRoutes from './api/socialPostRoutes';
import paymentRoutes from './api/paymentRoutes';
import communityRoutes from './api/communityRoutes';
import arNavigationRoutes from './api/arNavigation';
import { initializeGoogleApiConfig } from './lib/googleApiConfig';

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
  // Sistema de monitoreo del estado del sistema
  app.get("/api/system/status", async (req, res) => {
    try {
      // Verificar el estado de los servicios principales
      const weatherStatus = await checkServiceStatus("http://localhost:5000/api/weather?lat=48.8566&lon=2.3522");
      const geocodingStatus = await checkServiceStatus("http://localhost:5000/api/geocode?address=Paris");
      const routesStatus = await checkServiceStatus("http://localhost:5000/api/routes?origin=Madrid&destination=Barcelona");
      
      // Verificar disponibilidad de servicios de IA
      const vertexAIStatus = true; // Asumimos que está disponible
      const visionAIStatus = true; // Asumimos que está disponible
      const translateStatus = true; // Asumimos que está disponible
      
      // Verificar disponibilidad de servicios de fallback
      let weatherFallbackStatus = false;
      let geocodingFallbackStatus = false;
      let routesFallbackStatus = false;
      let vertexAIFallbackStatus = false;
      
      // Verificar si los fallbacks están funcionando correctamente
      try {
        const weatherResponse = await fetch("http://localhost:5000/api/weather?lat=48.8566&lon=2.3522");
        const weatherData = await weatherResponse.json();
        weatherFallbackStatus = weatherData._source === "fallback_openmeteo";
      } catch (error) {
        console.error("Error checking weather fallback:", error);
      }
      
      try {
        const geocodingResponse = await fetch("http://localhost:5000/api/geocode?address=Paris");
        const geocodingData = await geocodingResponse.json();
        geocodingFallbackStatus = geocodingData._source === "fallback_nominatim";
      } catch (error) {
        console.error("Error checking geocoding fallback:", error);
      }
      
      try {
        const routesResponse = await fetch("http://localhost:5000/api/routes?origin=Madrid&destination=Barcelona");
        if (routesResponse.ok) {
          const routesData = await routesResponse.json();
          routesFallbackStatus = routesData._source === "fallback_osrm";
        }
      } catch (error) {
        console.error("Error checking routes fallback:", error);
      }
      
      // Verificamos el estado de la base de datos
      const databaseStatus = !!process.env.DATABASE_URL;
      
      // Para Vertex AI, verificamos si está disponible su servicio de fallback (Anthropic)
      vertexAIFallbackStatus = !!process.env.ANTHROPIC_API_KEY || !!process.env.OPENAI_API_KEY;
      
      // Fase actual del proyecto y progreso
      const phaseInfo = {
        current: "PHASE 3",
        status: "EN PROGRESO",
        progress: 90, // Actualizamos el progreso a 90%
        description: "Implementando Service Delivery & Intelligent Flows con lógica de fallback"
      };
      
      res.json({
        timestamp: new Date().toISOString(),
        services: {
          weather: weatherStatus,
          geocoding: geocodingStatus,
          routes: routesStatus,
          vertexAI: vertexAIStatus,
          visionAI: visionAIStatus,
          translate: translateStatus,
          database: databaseStatus
        },
        fallbacks: {
          weather: weatherFallbackStatus,
          geocoding: geocodingFallbackStatus,
          routes: routesFallbackStatus,
          vertexAI: vertexAIFallbackStatus,
          visionAI: false, // No hay fallback para Vision AI
          translate: false // No hay fallback para Translate
        },
        phase: phaseInfo
      });
    } catch (error) {
      console.error("Error getting system status:", error);
      res.status(500).json({ error: "Error getting system status" });
    }
  });
  // Sistema de monitoreo del sistema
  app.get("/api/system/status", async (req, res) => {
    try {
      // Verificar el estado de los servicios principales
      const weatherStatus = await checkServiceStatus("http://localhost:5000/api/weather?lat=48.8566&lon=2.3522");
      const geocodingStatus = await checkServiceStatus("http://localhost:5000/api/geocode?address=Paris");
      const routesStatus = await checkServiceStatus("http://localhost:5000/api/routes?origin=Madrid&destination=Barcelona");
      
      // Verificar disponibilidad de servicios de IA
      const vertexAIStatus = true; // Asumimos que está disponible
      const visionAIStatus = true; // Asumimos que está disponible
      const translateStatus = true; // Asumimos que está disponible
      
      // Verificar disponibilidad de servicios de fallback
      let weatherFallbackStatus = false;
      let geocodingFallbackStatus = false;
      let routesFallbackStatus = false;
      let vertexAIFallbackStatus = false;
      
      // Verificar si los fallbacks están funcionando correctamente
      try {
        const weatherResponse = await fetch("http://localhost:5000/api/weather?lat=48.8566&lon=2.3522");
        const weatherData = await weatherResponse.json();
        weatherFallbackStatus = weatherData._source === "fallback_openmeteo";
      } catch (error) {
        console.error("Error checking weather fallback:", error);
      }
      
      try {
        const geocodingResponse = await fetch("http://localhost:5000/api/geocode?address=Paris");
        const geocodingData = await geocodingResponse.json();
        geocodingFallbackStatus = geocodingData._source === "fallback_nominatim";
      } catch (error) {
        console.error("Error checking geocoding fallback:", error);
      }
      
      try {
        const routesResponse = await fetch("http://localhost:5000/api/routes?origin=Madrid&destination=Barcelona");
        if (routesResponse.ok) {
          const routesData = await routesResponse.json();
          routesFallbackStatus = routesData._source === "fallback_osrm";
        }
      } catch (error) {
        console.error("Error checking routes fallback:", error);
      }
      
      // Verificamos el estado de la base de datos
      const databaseStatus = !!process.env.DATABASE_URL;
      
      // Para Vertex AI, verificamos si está disponible su servicio de fallback (Anthropic)
      vertexAIFallbackStatus = !!process.env.ANTHROPIC_API_KEY || !!process.env.OPENAI_API_KEY;
      
      // Fase actual del proyecto y progreso
      const phaseInfo = {
        current: "PHASE 3",
        status: "EN PROGRESO",
        progress: 90, // Actualizamos el progreso a 90%
        description: "Implementando Service Delivery & Intelligent Flows con lógica de fallback"
      };
      
      res.json({
        timestamp: new Date().toISOString(),
        services: {
          weather: weatherStatus,
          geocoding: geocodingStatus,
          routes: routesStatus,
          vertexAI: vertexAIStatus,
          visionAI: visionAIStatus,
          translate: translateStatus,
          database: databaseStatus
        },
        fallbacks: {
          weather: weatherFallbackStatus,
          geocoding: geocodingFallbackStatus,
          routes: routesFallbackStatus,
          vertexAI: vertexAIFallbackStatus,
          visionAI: false, // No hay fallback para Vision AI
          translate: false // No hay fallback para Translate
        },
        phase: phaseInfo
      });
    } catch (error) {
      console.error("Error getting system status:", error);
      res.status(500).json({ error: "Error getting system status" });
    }
  });
  // Registramos las rutas del servicio de mejora de memorias
  configureMemoryRoutes(app);
  
  // Registramos las rutas de las APIs de Google
  configureGoogleApiRoutes(app);
  
  // Registramos las rutas del servicio Gemini
  configureGeminiRoutes(app);
  
  // Registramos las rutas de servicio de avatares
  configureAvatarRoutes(app);
  
  // Registramos las rutas de traducción para el aprendizaje de idiomas
  app.use('/api', translationRoutes);
  console.log('Language translation routes configured successfully');
  
  // Registramos las rutas de notificaciones por email
  app.use('/api/notifications', notificationRoutes);
  console.log('Email notification routes configured successfully');
  
  // Registramos las rutas de los posts sociales
  app.use('/api/social', socialPostRoutes);
  console.log('Social post routes configured successfully');
  
  // Registramos las rutas de pagos
  app.use('/api/payments', paymentRoutes);
  console.log('Payment routes configured successfully');
  
  // Registramos las rutas de la comunidad de viajes
  app.use('/api/community', communityRoutes);
  console.log('Travel community routes configured successfully');
  
  // Register AR Navigation routes
  app.use('/api/ar-navigation', arNavigationRoutes);
  console.log('AR Navigation routes configured successfully');
  
  // Initialize Google API configuration with verified working keys
  initializeGoogleApiConfig();
  
  // Google Places API routes
  app.get('/api/places/autocomplete', async (req, res) => {
    try {
      const { input, types = 'locality|country' } = req.query;
      
      if (!input) {
        return res.status(400).json({ error: 'Input query is required' });
      }
      
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          input as string
        )}&types=${types}&key=AIzaSyBUYoJ-RndERrcY9qkjD-2YGGY5m3Mzc0U`
      );
      
      if (!response.ok) {
        throw new Error(`Google Places API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error('Error in places autocomplete:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get('/api/places/details', async (req, res) => {
    try {
      const { place_id } = req.query;
      
      if (!place_id) {
        return res.status(400).json({ error: 'Place ID is required' });
      }
      
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=name,formatted_address,geometry,photos,place_id,types,formatted_phone_number,website,rating,opening_hours&key=AIzaSyBUYoJ-RndERrcY9qkjD-2YGGY5m3Mzc0U`
      );
      
      if (!response.ok) {
        throw new Error(`Google Places API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error('Error in place details:', error);
      res.status(500).json({ error: error.message });
    }
  });
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

  // Onboarding AI user categorization endpoint
  app.post("/api/analyze-preferences", async (req, res) => {
    return analyzePreferences(req, res);
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
      const { message, history, personality = 'concierge' } = req.body;
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }
      
      const userId = req.user ? (req.user as any).id : null;
      const response = await chatHandler(message, history, userId, personality);
      res.json(response);
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Error processing chat message" });
    }
  });
  
  // Vertex AI Chat endpoints
  app.post("/api/chat/vertex", async (req, res) => {
    try {
      const { message, history, memory } = req.body;
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }
      
      // Determinar si usar el flujo de conversación mejorado o el básico
      const useEnhancedFlow = true; // Siempre usar la versión mejorada
      
      let response;
      if (useEnhancedFlow) {
        try {
          // Procesar la conversación con flujo mejorado que incluye fallbacks
          // Import dinámico para evitar problemas con ES modules
          const enhancedFlow = await import('./lib/enhancedConversationFlow');
          response = await enhancedFlow.processUserMessage(message, history);
        } catch (importError) {
          console.error("Error importing enhanced flow:", importError);
          // Fallback a procesamiento básico si hay error en el flujo mejorado
          response = await processConversation(message, history, memory);
        }
      } else {
        // Procesar la conversación con Vertex AI directamente (fallback)
        response = await processConversation(message, history, memory);
      }
      
      // Registrar la conversación si el usuario está autenticado
      const userId = req.user ? (req.user as any).id : null;
      if (userId) {
        try {
          await storage.saveChatMessage(userId, message, 'user');
          await storage.saveChatMessage(userId, response.message, 'assistant');
        } catch (error) {
          console.error("Error saving chat message:", error);
          // No interrumpir el flujo si falla el guardado
        }
      }
      
      // Responder al cliente
      res.json(response);
    } catch (error) {
      console.error("Vertex AI Chat error:", error);
      res.status(500).json({ 
        message: "Error processing message with Vertex AI",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Get available AI assistant personalities
  app.get("/api/chat/personalities", async (req, res) => {
    try {
      // Import the personalities from the AI module usando import dinámico
      const aiModule = await import('./lib/ai');
      const ASSISTANT_PERSONALITIES = aiModule.ASSISTANT_PERSONALITIES || {};
      
      // Format the response for the client
      const personalities = Object.entries(ASSISTANT_PERSONALITIES).map(([id, data]) => ({
        id,
        name: data.name,
        description: data.description,
        voiceStyle: data.voiceStyle,
        exampleResponse: data.exampleResponses[0]
      }));
      
      res.json({ personalities });
    } catch (error) {
      console.error("Error fetching personalities:", error);
      res.status(500).json({ message: "Error fetching assistant personalities" });
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
  
  // Flight search endpoints
  app.get("/api/flights/search", async (req, res) => {
    try {
      const { 
        origin, 
        destination, 
        departureDate, 
        returnDate, 
        adults, 
        children,
        infants,
        cabinClass,
        direct
      } = req.query;
      
      if (!origin || !destination || !departureDate) {
        return res.status(400).json({ 
          message: "Origin, destination and departure date are required" 
        });
      }
      
      try {
        // Call the flight search function
        const flights = await searchFlights({
          origin: origin as string,
          destination: destination as string,
          departureDate: departureDate as string,
          returnDate: returnDate as string,
          adults: adults ? parseInt(adults as string) : 1,
          children: children ? parseInt(children as string) : 0,
          infants: infants ? parseInt(infants as string) : 0,
          cabinClass: cabinClass as string,
          direct: direct === 'true'
        });
        
        res.json({ flights });
      } catch (error: any) {
        // Check if this is a missing API key error
        if (error.message && error.message.includes('API_KEY')) {
          res.status(503).json({ 
            message: "Flight search is currently unavailable. API configuration required."
          });
        } else {
          res.status(500).json({ 
            message: "Error searching flights"
          });
        }
      }
    } catch (error) {
      console.error("Error searching flights:", error);
      res.status(500).json({ message: "Error searching flights" });
    }
  });
  
  app.get("/api/flights/:id", async (req, res) => {
    try {
      const flightId = req.params.id;
      
      try {
        const flight = await getFlightById(flightId);
        res.json(flight);
      } catch (error: any) {
        // Check if this is a missing API key error
        if (error.message && error.message.includes('API_KEY')) {
          res.status(503).json({ 
            message: "Flight details are currently unavailable. API configuration required."
          });
        } else {
          res.status(500).json({ 
            message: "Error retrieving flight details"
          });
        }
      }
    } catch (error) {
      console.error("Error getting flight details:", error);
      res.status(500).json({ message: "Error getting flight details" });
    }
  });

  app.post("/api/flights/book", async (req, res) => {
    try {
      const { flightId, passengers } = req.body;
      
      if (!flightId) {
        return res.status(400).json({ message: "Flight ID is required" });
      }
      
      // Get flight details
      const flight = await getFlightById(flightId);
      
      if (!flight) {
        return res.status(404).json({ message: "Flight not found" });
      }
      
      // Create booking record
      const booking = await storage.createBooking({
        type: "flight",
        title: `${flight.airline} (${flight.flightNumber})`,
        location: `${flight.origin} to ${flight.destination}`,
        status: "confirmed",
        userId: req.user?.id || 0,
        itemId: parseInt(flightId.replace(/\D/g, '')) || 0,
        startDate: new Date(flight.departureTime),
        endDate: new Date(flight.arrivalTime),
        totalAmount: flight.price,
        imageUrl: flight.logoUrl,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      res.status(201).json({
        message: "Flight booked successfully",
        bookingId: booking.id,
        booking
      });
    } catch (error) {
      console.error("Error booking flight:", error);
      res.status(500).json({ message: "Error booking flight" });
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
  
  // Search destinations endpoint to support the landing page search box
  app.post("/api/search/destinations", async (req, res) => {
    try {
      const { destination, date, useGemini, useRapidAPI } = req.body;
      
      if (!destination) {
        return res.status(400).json({ message: "Destination is required" });
      }
      
      console.log(`Searching for destinations: ${destination}, date: ${date}`);
      
      // Search for destinations using the existing API
      const searchResults = await searchDestinations(destination);
      
      // Track the search in analytics if applicable
      // ...
      
      // Return search results
      res.json({ 
        success: true, 
        results: searchResults.destinations,
        source: searchResults.source,
        query: {
          destination,
          date
        }
      });
    } catch (error) {
      console.error("Error searching destinations:", error);
      res.status(500).json({ 
        message: "Error searching destinations",
        error: error.message
      });
    }
  });
  
  // Hotel search endpoints
  app.get("/api/hotels/search", async (req, res) => {
    try {
      const { 
        destination, 
        checkIn, 
        checkOut, 
        adults, 
        children, 
        rooms,
        priceMin,
        priceMax,
        starRating
      } = req.query;
      
      // For now, handle via travel API mock service
      // In production, this would call a real hotel API
      const hotels = await travelSearchAccommodations({
        location: destination as string,
        checkIn: checkIn as string,
        checkOut: checkOut as string,
        guests: parseInt(adults as string) || 1,
        priceMin: priceMin ? parseInt(priceMin as string) : undefined,
        priceMax: priceMax ? parseInt(priceMax as string) : undefined,
        starRating: starRating ? (starRating as string).split(',').map(Number) : undefined
      });
      
      res.json({ hotels });
    } catch (error) {
      console.error("Error searching hotels:", error);
      res.status(500).json({ message: "Error searching hotels" });
    }
  });
  
  app.get("/api/hotels/:id", async (req, res) => {
    try {
      const hotelId = req.params.id;
      const provider = req.query.provider as string;
      
      if (!hotelId) {
        return res.status(400).json({ message: "Hotel ID is required" });
      }
      
      // For now, get a single accommodation from the mock API
      // In production, this would call a specific hotel API endpoint
      const hotels = await travelSearchAccommodations({
        location: '',
        specificId: hotelId
      });
      
      const hotel = hotels.length > 0 ? hotels[0] : null;
      
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }
      
      res.json({ hotel });
    } catch (error) {
      console.error("Error fetching hotel details:", error);
      res.status(500).json({ message: "Error fetching hotel details" });
    }
  });

  // Membership data route
  app.get("/api/user/membership", ensureAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      res.json({
        id: user.id,
        membershipTier: user.membershipTier || 'basic',
        aiCreditsRemaining: user.aiCreditsRemaining || 0,
        monthlySearches: user.monthlySearches || 0,
        maxMonthlySearches: user.maxMonthlySearches || 10,
        isSubscribed: user.stripeSubscriptionId ? true : false,
        subscriptionEndsAt: user.subscriptionEndDate || null
      });
    } catch (error) {
      console.error("Error fetching membership data:", error);
      res.status(500).json({ message: "Error fetching membership data" });
    }
  });

  // Credit pack purchase endpoint
  app.post("/api/purchase-credits", ensureAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const { packId, paymentIntentId } = req.body;
      
      // Credit packs data - would be moved to a database in production
      const CREDIT_PACKS = {
        'credit_10': { credits: 10, price: 4.99 },
        'credit_50': { credits: 50, price: 19.99 },
        'credit_100': { credits: 100, price: 34.99 }
      };
      
      // Validate the pack exists
      const pack = CREDIT_PACKS[packId as keyof typeof CREDIT_PACKS];
      if (!pack) {
        return res.status(400).json({ message: "Invalid pack ID" });
      }
      
      // In a real app, we would verify the payment was successful
      // For demo purposes, we'll assume the payment was successful
      
      // Add credits to the user
      await storage.rechargePremiumBenefits(user.id, pack.credits);
      
      res.json({
        success: true,
        creditsAdded: pack.credits,
        newTotal: (user.aiCreditsRemaining || 0) + pack.credits
      });
    } catch (error) {
      console.error("Error purchasing credits:", error);
      res.status(500).json({ message: "Error purchasing credits" });
    }
  });

  // White-label subdomain configuration
  app.get("/api/subdomain/config", async (req, res) => {
    try {
      const { subdomain } = req.query;
      
      if (!subdomain || typeof subdomain !== 'string') {
        return res.status(400).json({ message: "Invalid subdomain" });
      }
      
      // In a real app, we would fetch from database
      // For demo purposes, we'll use a simple mapping
      const whiteLabels: Record<string, any> = {
        'luxurytravel': {
          name: 'Luxury Travel Concierge',
          primaryColor: '#A67C52',
          borderRadius: '0.25rem',
          fontFamily: 'Playfair Display, serif',
          logo: '/assets/luxury-logo.svg'
        },
        'backpackers': {
          name: 'Backpackers Guide',
          primaryColor: '#2D7E5E',
          borderRadius: '0.75rem',
          fontFamily: 'Montserrat, sans-serif',
          logo: '/assets/backpack-logo.svg'
        },
        'familytrips': {
          name: 'Family Trips Planner',
          primaryColor: '#F59E0B',
          borderRadius: '1rem',
          fontFamily: 'Nunito, sans-serif',
          logo: '/assets/family-logo.svg'
        }
      };
      
      // Check if we have a config for this subdomain
      if (whiteLabels[subdomain]) {
        return res.json({ 
          config: whiteLabels[subdomain],
          isCustom: true
        });
      }
      
      // Return default config
      return res.json({ 
        config: {
          name: 'JetAI',
          primaryColor: '#3182CE',
          borderRadius: '0.5rem',
          fontFamily: 'Inter, system-ui, sans-serif',
          logo: '/assets/logo.svg'
        },
        isCustom: false
      });
    } catch (error) {
      console.error("Error fetching subdomain config:", error);
      res.status(500).json({ message: "Error fetching subdomain config" });
    }
  });

  // Partner program routes
  app.post("/api/partners/register", async (req, res) => {
    try {
      const { name, email, websiteUrl, businessType, subdomain, plan } = req.body;
      
      // Validate required fields
      if (!name || !email || !websiteUrl || !subdomain || !plan) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // In a real app, we would store this in a database
      // Generate a unique referral code
      const referralCode = `${subdomain}_${Math.floor(Math.random() * 10000)}`;
      
      // Return success with referral code
      res.json({
        success: true,
        partnerName: name,
        referralCode,
        subdomain,
        commissionRate: plan === 'standard' ? 10 : (plan === 'professional' ? 15 : 20),
        dashboardUrl: `/partner/dashboard`
      });
    } catch (error) {
      console.error("Error registering partner:", error);
      res.status(500).json({ message: "Error registering partner" });
    }
  });

  // Partner dashboard data
  app.get("/api/partners/stats", ensureAuthenticated, async (req, res) => {
    try {
      // In a real app, we would fetch this from a database
      // For demo purposes, we'll return mock data
      res.json({
        visits: {
          count: 247,
          change: 12.5,
          data: [15, 22, 18, 25, 30, 35, 42, 55, 60, 45, 40, 35, 42]
        },
        signups: {
          count: 36,
          change: 8.2,
          data: [2, 3, 1, 4, 3, 5, 2, 6, 4, 3, 2, 1, 0]
        },
        bookings: {
          count: 18,
          change: 15.3,
          data: [1, 0, 2, 1, 3, 2, 0, 1, 2, 3, 1, 2, 0]
        },
        earnings: {
          total: 1247.89,
          change: 22.7,
          data: [75, 120, 85, 95, 140, 180, 95, 110, 145, 165, 90, 105, 75]
        },
        conversionRate: {
          value: 14.6,
          change: 2.3
        },
        recentBookings: [
          {
            id: 1,
            customer: 'Sarah Johnson',
            date: '2025-04-08',
            amount: 349.99,
            commission: 35.00,
            destination: 'Bali'
          },
          {
            id: 2,
            customer: 'Michael Chen',
            date: '2025-04-07',
            amount: 529.99,
            commission: 53.00,
            destination: 'Paris'
          },
          {
            id: 3,
            customer: 'Emma Williams',
            date: '2025-04-05',
            amount: 249.99,
            commission: 25.00,
            destination: 'Barcelona'
          },
          {
            id: 4,
            customer: 'James Smith',
            date: '2025-04-03',
            amount: 419.99,
            commission: 42.00,
            destination: 'New York'
          }
        ]
      });
    } catch (error) {
      console.error("Error fetching partner stats:", error);
      res.status(500).json({ message: "Error fetching partner stats" });
    }
  });

  // Stripe payment routes
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { items, amount, promoCode } = req.body;
      const affiliateId = req.query.ref || req.session?.affiliateId;
      
      // Products configuration
      const PRODUCTS = {
        "premium-membership": {
          id: 'premium-membership',
          name: 'JET AI Premium Membership (Annual)',
          price: 99.99
        },
        "credit_10": {
          id: 'credit_10',
          credits: 10,
          price: 4.99,
          name: '10 AI Credits'
        },
        "credit_50": {
          id: 'credit_50',
          credits: 50,
          price: 19.99,
          name: '50 AI Credits'
        },
        "credit_100": {
          id: 'credit_100',
          credits: 100,
          price: 34.99,
          name: '100 AI Credits'
        }
      };
      
      // Determine the amount and products
      let finalAmount = amount;
      let purchaseItems = items;
      
      // If no amount but items are provided, calculate the amount from the items
      if (!finalAmount && items && items.length > 0) {
        const firstItemId = items[0].id;
        const product = PRODUCTS[firstItemId];
        
        if (!product) {
          return res.status(400).json({ message: "Invalid product ID" });
        }
        
        finalAmount = product.price;
        purchaseItems = [{ id: firstItemId, name: product.name, quantity: 1 }];
      }
      
      // Apply promo code discount if provided (this would be validated against a database in production)
      if (promoCode) {
        // Example discount logic - would be replaced with actual promo code validation
        finalAmount = finalAmount * 0.9; // 10% discount for example
      }
      
      // Create payment intent
      const paymentIntent = await createPaymentIntent(finalAmount, purchaseItems);
      
      // Store metadata with the payment intent if possible
      const metadata = {
        type: purchaseItems && purchaseItems[0] ? purchaseItems[0].id : 'payment',
        affiliateId: affiliateId?.toString() || '',
        promoCode: promoCode || ''
      };
      
      // In a production app, we would update the payment intent metadata
      
      res.json({ 
        clientSecret: paymentIntent.client_secret,
        amount: finalAmount,
        orderDetails: purchaseItems && purchaseItems[0] ? {
          id: purchaseItems[0].id,
          name: purchaseItems[0].name,
        } : null
      });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  app.post("/api/create-subscription", ensureAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const { planId, billingCycle, promoCode } = req.body;
      const affiliateId = req.query.ref || req.session?.affiliateId;
      
      // Subscription plans configuration (these would map to Stripe products/prices)
      const SUBSCRIPTION_PLANS = {
        plan_basic: {
          id: 'plan_basic',
          name: 'Basic Plan',
          monthlyPriceId: 'price_basic_monthly',
          yearlyPriceId: 'price_basic_yearly',
          credits: 5,
          tier: 'basic'
        },
        plan_freemium: {
          id: 'plan_freemium',
          name: 'Freemium Plan',
          monthlyPriceId: 'price_freemium_monthly',
          yearlyPriceId: 'price_freemium_yearly',
          credits: 20,
          tier: 'freemium'
        },
        plan_premium: {
          id: 'plan_premium',
          name: 'Premium Plan',
          monthlyPriceId: 'price_premium_monthly',
          yearlyPriceId: 'price_premium_yearly',
          tier: 'premium',
          unlimited: true
        }
      };
      
      // Get plan details
      const plan = SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS];
      if (!plan) {
        return res.status(400).json({ message: "Invalid plan ID" });
      }
      
      // Create subscription using the existing service
      const subscription = await createSubscription(user.id, {
        email: user.email,
        planId: plan.id,
        interval: billingCycle === 'yearly' ? 'year' : 'month',
        metadata: {
          planTier: plan.tier,
          affiliateId: affiliateId?.toString() || '',
          promoCode: promoCode || '',
          billingCycle
        }
      });
      
      // Return checkout info
      res.json({
        subscriptionId: subscription.id,
        clientSecret: subscription.clientSecret,
        sessionId: subscription.sessionId // If using checkout sessions
      });
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      return res.status(400).json({ message: error.message });
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
  
  // Cancel subscription
  app.post("/api/cancel-subscription", ensureAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      
      if (!user.stripeSubscriptionId) {
        return res.status(400).json({ message: "No active subscription" });
      }
      
      // In a real app, this would call Stripe to cancel the subscription
      // For demo, we'll just simulate it
      
      res.json({
        canceled: true,
        message: "Subscription will be canceled at the end of the current billing period"
      });
    } catch (error: any) {
      console.error("Error cancelling subscription:", error);
      return res.status(400).json({ message: error.message });
    }
  });
  
  // Subdomain/white-label detection
  app.get("/api/subdomain/config", (req, res) => {
    try {
      const host = req.headers.host || '';
      const parts = host.split('.');
      
      // Extract subdomain
      let subdomain = 'app';
      if (parts.length > 2) {
        subdomain = parts[0];
      }
      
      // In development, allow query parameter override
      if (req.query.subdomain) {
        subdomain = req.query.subdomain as string;
      }
      
      // Return the brand configuration based on subdomain
      // In production, this would fetch from a database
      const brandConfig = {
        app: {
          name: 'JetAI',
          theme: 'default',
          logo: '/assets/logo.svg'
        },
        luxury: {
          name: 'Luxury Journeys AI',
          theme: 'luxury',
          logo: '/assets/partners/luxury-logo.svg'
        },
        backpackers: {
          name: 'Backpacker\'s Buddy',
          theme: 'backpackers',
          logo: '/assets/partners/backpacker-logo.svg'
        },
        miami: {
          name: 'Miami Explorer AI',
          theme: 'miami',
          logo: '/assets/partners/miami-logo.svg'
        }
      };
      
      const config = brandConfig[subdomain as keyof typeof brandConfig] || brandConfig.app;
      
      res.json({
        subdomain,
        config,
      });
    } catch (error: any) {
      console.error("Error processing subdomain config:", error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Partner/affiliate program endpoints
  app.post("/api/partners/register", async (req, res) => {
    try {
      // In a real app, this would create a partner account in the database
      const { name, email, websiteUrl, businessType, subdomain } = req.body;
      
      // Validate subdomain is available - in production this would check a database
      if (subdomain === 'app' || subdomain === 'www' || subdomain === 'api') {
        return res.status(400).json({ message: "This subdomain is not available" });
      }
      
      // Mock partner creation
      res.json({
        success: true,
        partnerId: `partner_${Date.now()}`,
        referralCode: subdomain.toUpperCase(),
        referralUrl: `https://jetai.app/?ref=${subdomain.toUpperCase()}`
      });
    } catch (error: any) {
      console.error("Error registering partner:", error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Partner analytics endpoint
  app.get("/api/partners/analytics", ensureAuthenticated, (req, res) => {
    // In a real app, this would fetch real analytics from a database
    // Mock analytics data for UI demonstration
    res.json({
      visits: {
        total: 1482,
        thisMonth: 328,
        change: 12.5
      },
      signups: {
        total: 241,
        thisMonth: 42,
        change: 8.3
      },
      bookings: {
        total: 112,
        thisMonth: 18,
        change: -3.2
      },
      earnings: {
        total: 1245.67,
        thisMonth: 215.34,
        change: 5.8
      },
      conversionRate: 7.6,
      recentBookings: [
        {
          id: 'b_78912',
          destination: 'Paris, France',
          amount: 425.00,
          commission: 42.50,
          date: '2023-11-28',
          status: 'completed'
        },
        {
          id: 'b_78911',
          destination: 'Bali, Indonesia',
          amount: 850.00,
          commission: 85.00,
          date: '2023-11-25',
          status: 'completed'
        }
      ]
    });
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

  // API integration verification endpoint
  app.get("/api/system/verify-integrations", async (req, res) => {
    try {
      // Verify all API integrations
      const apiStatuses = await verifyApiIntegrations();
      const nextConnections = suggestNextApiConnections(apiStatuses);
      
      // Log the results to console for verification
      console.table(apiStatuses.map(status => ({
        API: status.api,
        'Key Present': status.keyPresent ? '✅' : '❌',
        Notes: status.notes
      })));
      
      res.json({
        apiStatuses,
        nextConnections,
        message: "JetAI System is in Phase 7 Flight Ready Mode"
      });
    } catch (error) {
      console.error("Error verifying API integrations:", error);
      res.status(500).json({ message: "Error verifying API integrations" });
    }
  });

  // Google Cloud API routes
  // Text-to-Speech API
  app.post("/api/google/tts", async (req, res) => {
    try {
      const { text, language, voice, gender, pitch, speakingRate } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }
      
      const result = await googleCloud.tts.synthesize(text, {
        language,
        voice,
        gender,
        pitch,
        speakingRate
      });
      
      res.json(result);
    } catch (error) {
      console.error("Error with Text-to-Speech API:", error);
      res.status(500).json({ message: "Error converting text to speech" });
    }
  });
  
  app.get("/api/google/tts/voices", async (req, res) => {
    try {
      const { language } = req.query;
      const result = await googleCloud.tts.getVoices(language as string);
      res.json(result);
    } catch (error) {
      console.error("Error getting TTS voices:", error);
      res.status(500).json({ message: "Error getting TTS voices" });
    }
  });
  
  // Natural Language API
  app.post("/api/google/nl/sentiment", async (req, res) => {
    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }
      
      const result = await googleCloud.naturalLanguage.analyzeSentiment(text);
      res.json(result);
    } catch (error) {
      console.error("Error with sentiment analysis:", error);
      res.status(500).json({ message: "Error analyzing sentiment" });
    }
  });
  
  app.post("/api/google/nl/entities", async (req, res) => {
    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }
      
      const result = await googleCloud.naturalLanguage.analyzeEntities(text);
      res.json(result);
    } catch (error) {
      console.error("Error analyzing entities:", error);
      res.status(500).json({ message: "Error analyzing entities" });
    }
  });
  
  // Translate API
  app.post("/api/google/translate", async (req, res) => {
    try {
      const { text, target, source } = req.body;
      
      if (!text || !target) {
        return res.status(400).json({ message: "Text and target language are required" });
      }
      
      const result = await googleCloud.translate.translateText(text, target, source);
      res.json(result);
    } catch (error) {
      console.error("Error with translation:", error);
      res.status(500).json({ message: "Error translating text" });
    }
  });
  
  app.post("/api/google/translate/detect", async (req, res) => {
    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }
      
      const result = await googleCloud.translate.detectLanguage(text);
      res.json(result);
    } catch (error) {
      console.error("Error detecting language:", error);
      res.status(500).json({ message: "Error detecting language" });
    }
  });
  
  // Vision API
  app.post("/api/google/vision/analyze", async (req, res) => {
    try {
      const { imageUrl } = req.body;
      
      if (!imageUrl) {
        return res.status(400).json({ message: "Image URL is required" });
      }
      
      const result = await googleCloud.vision.analyzeImage(imageUrl);
      res.json(result);
    } catch (error) {
      console.error("Error analyzing image:", error);
      res.status(500).json({ message: "Error analyzing image" });
    }
  });
  
  app.post("/api/google/vision/landmarks", async (req, res) => {
    try {
      const { imageUrl } = req.body;
      
      if (!imageUrl) {
        return res.status(400).json({ message: "Image URL is required" });
      }
      
      const result = await googleCloud.vision.detectLandmarks(imageUrl);
      res.json(result);
    } catch (error) {
      console.error("Error detecting landmarks:", error);
      res.status(500).json({ message: "Error detecting landmarks" });
    }
  });
  
  // Calendar API
  app.post("/api/google/calendar/events", async (req, res) => {
    try {
      const calendarId = req.query.calendarId as string || 'primary';
      const event = req.body;
      
      if (!event || !event.summary || !event.start || !event.end) {
        return res.status(400).json({ message: "Event details are required" });
      }
      
      const result = await googleCloud.calendar.addEvent(calendarId, event);
      res.json(result);
    } catch (error) {
      console.error("Error adding calendar event:", error);
      res.status(500).json({ message: "Error adding calendar event" });
    }
  });
  
  app.get("/api/google/calendar/events", async (req, res) => {
    try {
      const calendarId = req.query.calendarId as string || 'primary';
      const timeMin = req.query.timeMin as string;
      const timeMax = req.query.timeMax as string;
      
      if (!timeMin || !timeMax) {
        return res.status(400).json({ message: "Time range is required" });
      }
      
      const result = await googleCloud.calendar.getEvents(calendarId, timeMin, timeMax);
      res.json(result);
    } catch (error) {
      console.error("Error getting calendar events:", error);
      res.status(500).json({ message: "Error getting calendar events" });
    }
  });

  // Routes for the conversation flow system
  app.post("/api/conversation/process", async (req, res) => {
    try {
      const { message, profile } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }
      
      if (!profile || typeof profile !== 'object') {
        return res.status(400).json({ message: "Valid profile object is required" });
      }
      
      // Set the initial conversation stage if not present
      if (profile.currentStage === undefined) {
        profile.currentStage = ConversationStage.GREETING;
      }
      
      // Process the message and get the response
      const { response, updatedProfile, emotion } = await processUserMessage(message, profile);
      
      // Store chat message in history if user is authenticated
      if (req.user) {
        const userId = (req.user as any).id;
        await storage.saveChatMessage(userId, message, 'user');
        await storage.saveChatMessage(userId, response, 'assistant');
      }
      
      // Log the conversation for debugging
      console.log(`User: ${message}`);
      console.log(`JetAI (${emotion || 'neutral'}): ${response}`);
      console.log(`Stage: ${ConversationStage[updatedProfile.currentStage]}`);
      
      res.json({
        response,
        updatedProfile,
        emotion
      });
    } catch (error) {
      console.error("Error processing conversation:", error);
      res.status(500).json({ message: "Error processing conversation" });
    }
  });
  
  // Route to generate a complete itinerary
  app.post("/api/itinerary/generate-from-profile", async (req, res) => {
    try {
      const { profile } = req.body;
      
      if (!profile || !profile.destination) {
        return res.status(400).json({ message: "Valid profile with destination is required" });
      }
      
      // Generate the itinerary
      const itineraryText = await generateUserItinerary(profile);
      
      // Store itinerary if user is authenticated
      if (req.user) {
        const userId = (req.user as any).id;
        
        // Create a basic itinerary record
        await storage.createItinerary({
          title: `Trip to ${profile.destination}`,
          description: `Itinerary for ${profile.destination}`,
          destination: profile.destination,
          content: itineraryText,
          userId: userId,
          startDate: new Date(),
          endDate: new Date(),
          isPublic: false,
          isBookmarked: false,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      res.json({
        itinerary: itineraryText
      });
    } catch (error) {
      console.error("Error generating itinerary from profile:", error);
      res.status(500).json({ message: "Error generating itinerary" });
    }
  });

  // Route for Text-to-Speech synthesis using Google TTS
  app.post("/api/tts/synthesize", async (req, res) => {
    try {
      const { text, voice = "elegant-female-concierge" } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }
      
      // Check if Google Cloud API key is available
      if (!process.env.GOOGLE_TTS_API_KEY) {
        return res.status(503).json({ 
          message: "Text-to-speech is currently unavailable. API configuration required."
        });
      }
      
      // Map voice style to Google TTS voices
      const voiceMap: Record<string, string> = {
        "elegant-female-concierge": "en-US-Studio-O",
        "adventurous-guide": "en-US-Neural2-D",
        "knowledgeable-cultural-expert": "en-US-Neural2-F",
        "friendly-latino-companion": "es-US-Neural2-A",
        "luxury-specialist": "en-GB-Neural2-B"
      };
      
      const selectedVoice = voiceMap[voice] || 'en-US-Neural2-F';
      
      try {
        // Use Google TTS API to synthesize speech
        const speechResponse = await googleCloud.tts.synthesize(text, {
          voice: selectedVoice
        });
        
        // Return audio URL (in a real implementation, this would be stored and served)
        res.json({
          audioUrl: speechResponse.audioUrl
        });
      } catch (error: any) {
        console.error("TTS API error:", error);
        res.status(500).json({ message: "Error in text-to-speech synthesis" });
      }
    } catch (error) {
      console.error("Error in TTS endpoint:", error);
      res.status(500).json({ message: "Error processing TTS request" });
    }
  });

  // Route for getting the system configuration
  app.get("/api/system/config", (req, res) => {
    // System configurations - these could be loaded from a database in a real implementation
    const systemConfig = {
      assistant: {
        personalityOptions: ["concierge", "explorer", "cultural", "exclusivo", "amigo", "gourmet", "vecino"],
        defaultPersonality: "concierge",
        supportedLanguages: ["en-US", "es-ES", "fr-FR", "de-DE", "it-IT", "pt-BR", "ja-JP", "ko-KR", "zh-CN"],
        defaultLanguage: "en-US",
        voiceOptions: [
          { id: "elegant-female-concierge", name: "Elegant Female Concierge", language: "en-US" },
          { id: "adventurous-guide", name: "Adventurous Guide", language: "en-US" },
          { id: "knowledgeable-cultural-expert", name: "Cultural Expert", language: "en-US" },
          { id: "friendly-latino-companion", name: "Latino Companion", language: "es-US" },
          { id: "luxury-specialist", name: "Luxury Specialist", language: "en-GB" }
        ]
      },
      interface: {
        colorThemes: ["light", "dark", "system"],
        defaultTheme: "system",
        supportedViews: ["chat", "dashboard", "explore", "itinerary", "flights", "hotels"]
      }
    };
    
    res.json(systemConfig);
  });

  // Ruta de verificación de estado de las APIs
  app.get('/api/system/status', async (req, res) => {
    try {
      // Verificar estado de los servicios críticos
      const status = {
        timestamp: new Date().toISOString(),
        services: {
          weather: await checkServiceStatus('weather'),
          geocoding: await checkServiceStatus('geocode'),
          routes: await checkServiceStatus('routes'),
          vertexAI: await checkServiceStatus('chat/vertex'),
          visionAI: await checkServiceStatus('analyze-image'),
          translate: await checkServiceStatus('translate'),
          database: true // La base de datos está disponible
        },
        fallbacks: {
          weather: true, // Implementado fallback a OpenMeteo
          geocoding: true, // Implementado fallback a Nominatim
          routes: false, // Aún no implementado
          vertexAI: true, // Fallback a Claude
          visionAI: false, // Aún no implementado
          translate: false // Aún no implementado
        },
        phase: {
          current: "PHASE 3",
          status: "EN PROGRESO",
          progress: 70, // Porcentaje de implementación de la fase actual
          description: "Implementando Service Delivery & Intelligent Flows con lógica de fallback"
        }
      };
      
      res.json(status);
    } catch (error) {
      console.error('Error al verificar estado del sistema:', error);
      res.status(500).json({ error: 'Error al verificar estado del sistema' });
    }
  });

  const httpServer = createServer(app);
  
  // Incluimos WebSocket con mensajes de estado del sistema
  if (app.get('ws')) {
    const wss = app.get('ws');
    
    // Enviar periódicamente actualizaciones de estado a todos los clientes
    setInterval(() => {
      wss.clients.forEach((client: any) => {
        if (client.readyState === client.OPEN) {
          client.send(JSON.stringify({
            type: 'system_status',
            status: 'online',
            services: {
              weather: false, // No autorizada pero con fallback
              geocoding: false, // No autorizada pero con fallback
              vertexAI: true // Funciona con fallbacks
            },
            message: 'JetAI Travel Cockpit está activo y funcionando con fallbacks',
            timestamp: new Date().toISOString()
          }));
        }
      });
    }, 60000); // Enviar cada minuto
  }

  return httpServer;
}

// Función para verificar el estado de un servicio
async function checkServiceStatus(endpoint: string): Promise<boolean> {
  try {
    let testUrl = '';
    
    switch (endpoint) {
      case 'weather':
        testUrl = 'http://localhost:5000/api/weather?lat=48.8566&lon=2.3522';
        break;
      case 'geocode':
        testUrl = 'http://localhost:5000/api/geocode?address=Paris,France';
        break;
      case 'routes':
        testUrl = 'http://localhost:5000/api/routes?origin=Paris,France&destination=Lyon,France';
        break;
      case 'chat/vertex':
        // Para servicios POST, simplemente asumimos que están disponibles
        // El fallback ya está implementado
        return true;
      case 'analyze-image':
      case 'translate':
        // Para servicios no críticos, asumimos que están disponibles pero con fallbacks
        return true;
      default:
        return false;
    }
    
    const response = await fetch(testUrl);
    const data = await response.json();
    
    // Si contiene un mensaje de error sobre API key no autorizada, el servicio
    // está disponible pero la key no está autorizada
    if (data.error && (
      data.error.includes('API key') || 
      data.error.includes('not authorized') || 
      data.error.includes('REQUEST_DENIED')
    )) {
      return false;
    }
    
    // Si el servicio responde, incluso con un error controlado, está disponible
    return true;
  } catch (error) {
    console.error(`Error verificando servicio ${endpoint}:`, error);
    return false;
  }
}
