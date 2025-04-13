import { pgTable, serial, text, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User preferences type
export type UserPreferences = {
  theme?: string;
  language?: string;
  notifications?: boolean;
  interests?: string[];
  dietaryRestrictions?: string[];
  languages?: string[];
  travelStyle?: string;
  accommodationPreferences?: string[];
  budget?: string;
  accessibility?: string[];
};

// User table definition
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").unique(),
  password: text("password").notNull(),
  preferences: json("preferences").$type<UserPreferences>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Trip table definition (for itineraries)
export const trips = pgTable("trips", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  destination: text("destination"),
  itinerary: json("itinerary"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Expense table definition (for travel wallet)
export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  tripId: serial("trip_id").references(() => trips.id),
  amount: text("amount").notNull(),
  currency: text("currency").notNull(),
  category: text("category"),
  description: text("description"),
  date: timestamp("date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Booking table definition
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  tripId: serial("trip_id").references(() => trips.id),
  type: text("type").notNull(), // flight, hotel, activity
  provider: text("provider"),
  confirmationCode: text("confirmation_code"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  details: json("details"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Chat message history
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  role: text("role").notNull(), // user or assistant
  content: text("content").notNull(),
  context: json("context"), // tab, flow, action data
  timestamp: timestamp("timestamp").defaultNow(),
});

// Social Media Posts
export const socialPosts = pgTable("social_posts", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  content: text("content").notNull(),
  hashtags: json("hashtags").$type<string[]>().default([]),
  mediaUrls: json("media_urls").$type<string[]>().default([]),
  platform: text("platform").notNull(), // instagram, facebook, twitter, tiktok
  postType: text("post_type").notNull(), // post, story, reel
  status: text("status").notNull().default("draft"), // draft, published, scheduled
  scheduledFor: timestamp("scheduled_for"),
  publishedAt: timestamp("published_at"),
  likes: serial("likes").default(0),
  comments: serial("comments").default(0),
  shares: serial("shares").default(0),
  analytics: json("analytics"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Community Posts (Travel Stories)
export const communityPosts = pgTable("community_posts", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  destination: text("destination"),
  tags: json("tags").$type<string[]>().default([]),
  mediaUrls: json("media_urls").$type<string[]>().default([]),
  likes: serial("likes").default(0),
  comments: json("comments").default([]),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Define the insert schemas using drizzle-zod
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertTripSchema = createInsertSchema(trips).omit({ id: true });
export const insertExpenseSchema = createInsertSchema(expenses).omit({ id: true });
export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true });
export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({ id: true });
export const insertSocialPostSchema = createInsertSchema(socialPosts).omit({ 
  id: true, 
  likes: true, 
  comments: true,
  shares: true,
  createdAt: true,
  updatedAt: true
});
export const insertCommunityPostSchema = createInsertSchema(communityPosts).omit({ 
  id: true, 
  likes: true, 
  comments: true,
  createdAt: true,
  updatedAt: true
});

// Define the types using the schema
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertTrip = z.infer<typeof insertTripSchema>;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type InsertSocialPost = z.infer<typeof insertSocialPostSchema>;
export type InsertCommunityPost = z.infer<typeof insertCommunityPostSchema>;

// Define the select types
export type User = typeof users.$inferSelect;
export type Trip = typeof trips.$inferSelect;
export type Expense = typeof expenses.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type SocialPost = typeof socialPosts.$inferSelect;
export type CommunityPost = typeof communityPosts.$inferSelect;