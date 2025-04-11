import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  memberSince: timestamp("member_since").defaultNow(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  isSubscribed: boolean("is_subscribed").default(false),
  subscriptionPlan: text("subscription_plan"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Destinations table
export const destinations = pgTable("destinations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  rating: integer("rating"),
  continent: text("continent"),
  climate: text("climate"),
  category: text("category"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Accommodations table
export const accommodations = pgTable("accommodations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  location: text("location").notNull(),
  imageUrl: text("image_url"),
  pricePerNight: integer("price_per_night").notNull(),
  rating: integer("rating"),
  amenities: json("amenities"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Experiences table
export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  location: text("location").notNull(),
  country: text("country").notNull(),
  duration: text("duration").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  price: integer("price").notNull(),
  category: text("category"),
  rating: integer("rating"),
  reviewCount: integer("review_count"),
  difficulty: text("difficulty"),
  groupSize: text("group_size"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Bookings table
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // "accommodation" or "experience"
  itemId: integer("item_id").notNull(),
  title: text("title").notNull(),
  location: text("location").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").notNull(), // "upcoming", "completed", "canceled"
  totalAmount: integer("total_amount").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Saved items table
export const savedItems = pgTable("saved_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // "destination", "accommodation", or "experience"
  itemId: integer("item_id").notNull(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Chat history table
export const chatHistory = pgTable("chat_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  message: text("message").notNull(),
  role: text("role").notNull(), // "user" or "assistant"
  createdAt: timestamp("created_at").defaultNow(),
});

// Schemas for insertion
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  avatarUrl: true,
});

export const insertDestinationSchema = createInsertSchema(destinations).pick({
  name: true,
  country: true,
  description: true,
  imageUrl: true,
  rating: true,
  continent: true,
  climate: true,
  category: true,
});

export const insertAccommodationSchema = createInsertSchema(accommodations).pick({
  name: true,
  description: true,
  location: true,
  imageUrl: true,
  pricePerNight: true,
  rating: true,
  amenities: true,
});

export const insertExperienceSchema = createInsertSchema(experiences).pick({
  title: true,
  location: true,
  country: true,
  duration: true,
  description: true,
  imageUrl: true,
  price: true,
  category: true,
  rating: true,
  reviewCount: true,
  difficulty: true,
  groupSize: true,
});

export const insertBookingSchema = createInsertSchema(bookings).pick({
  userId: true,
  type: true,
  itemId: true,
  title: true,
  location: true,
  startDate: true,
  endDate: true,
  status: true,
  totalAmount: true,
  imageUrl: true,
});

export const insertSavedItemSchema = createInsertSchema(savedItems).pick({
  userId: true,
  type: true,
  itemId: true,
  name: true,
  location: true,
  imageUrl: true,
});

export const insertChatHistorySchema = createInsertSchema(chatHistory).pick({
  userId: true,
  message: true,
  role: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Destination = typeof destinations.$inferSelect;
export type InsertDestination = z.infer<typeof insertDestinationSchema>;

export type Accommodation = typeof accommodations.$inferSelect;
export type InsertAccommodation = z.infer<typeof insertAccommodationSchema>;

export type Experience = typeof experiences.$inferSelect;
export type InsertExperience = z.infer<typeof insertExperienceSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type SavedItem = typeof savedItems.$inferSelect;
export type InsertSavedItem = z.infer<typeof insertSavedItemSchema>;

export type ChatHistory = typeof chatHistory.$inferSelect;
export type InsertChatHistory = z.infer<typeof insertChatHistorySchema>;
