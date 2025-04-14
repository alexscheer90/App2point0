import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// User preferences table to store favorite school
export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  favoriteSchool: text("favorite_school"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).pick({
  userId: true,
  favoriteSchool: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;

// Schemas for API responses
export const schoolSchema = z.object({
  id: z.string(),
  name: z.string(),
  shortName: z.string(),
  mascot: z.string(),
  primaryColor: z.string(),
  secondaryColor: z.string(),
  logoUrl: z.any(), // Changed to any to support imported images
  city: z.string().optional(),
  state: z.string().optional(),
  affiliate: z.boolean().optional(), // To mark schools that are MAC affiliates
});

export const sportSchema = z.object({
  id: z.string(),
  name: z.string(),
  gender: z.enum(["men", "women", "mixed"]),
  officialUrl: z.string().optional(),
});

export const gameStatusSchema = z.enum(["scheduled", "live", "final", "postponed", "cancelled"]);

export const gameSchema = z.object({
  id: z.string(),
  sportId: z.string(),
  homeTeamId: z.string(),
  awayTeamId: z.string(),
  homeTeamScore: z.number().optional(),
  awayTeamScore: z.number().optional(),
  startTime: z.string(),
  scheduledTime: z.string(),  // Added for schedule view
  status: gameStatusSchema,
  period: z.number().optional(),
  clock: z.string().optional(),
  situation: z.string().optional(),
  venue: z.string().optional(),
  location: z.string().optional(),  // Added for full location name
  ticketUrl: z.string().optional(), // Added for ticket purchase link
  isRivalryGame: z.boolean().optional(),
  homeScore: z.number().optional(), // Alias for homeTeamScore for consistency
  awayScore: z.number().optional(), // Alias for awayTeamScore for consistency
});

export const standingsEntrySchema = z.object({
  id: z.string(),
  schoolId: z.string(),
  sportId: z.string(),
  division: z.enum(["East", "West"]).optional(),
  conference: z.object({
    wins: z.number(),
    losses: z.number(),
    ties: z.number().optional(),
    winningPercentage: z.number(),
  }),
  overall: z.object({
    wins: z.number(),
    losses: z.number(),
    ties: z.number().optional(),
    winningPercentage: z.number(),
  }),
});

export const newsItemSchema = z.object({
  id: z.string(),
  schoolId: z.string(),
  title: z.string(),
  summary: z.string(),
  content: z.string().optional(),
  imageUrl: z.string().optional(),
  publishedAt: z.string(),
  url: z.string().optional(),
});

export const rivalrySchema = z.object({
  id: z.string(),
  name: z.string(),
  team1Id: z.string(),
  team2Id: z.string(),
  team3Id: z.string().optional(),
  series: z.object({
    team1Wins: z.number(),
    team2Wins: z.number(),
    team3Wins: z.number().optional(),
    ties: z.number(),
  }),
  trophyName: z.string().optional(),
  firstGame: z.string().optional(),
  description: z.string().optional(),
  lastGameId: z.string().optional(),
});

export const schoolSoundSchema = z.object({
  id: z.string(),
  schoolId: z.string(),
  type: z.enum(["fight_song", "alma_mater"]),
  title: z.string(),
  audioUrl: z.string().optional(),
  lyrics: z.string().optional(),
  description: z.string().optional(),
});

export const localEatsSchema = z.object({
  id: z.string(),
  schoolId: z.string(),
  name: z.string(),
  cuisine: z.string(),
  description: z.string(),
  address: z.string().optional(),
  websiteUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  rating: z.number().optional(),
  distanceFromCampus: z.string().optional(),
  priceRange: z.enum(["$", "$$", "$$$", "$$$$"]).optional(),
});

export type School = z.infer<typeof schoolSchema>;
export type Sport = z.infer<typeof sportSchema>;
export type Game = z.infer<typeof gameSchema>;
export type GameStatus = z.infer<typeof gameStatusSchema>;
export type StandingsEntry = z.infer<typeof standingsEntrySchema>;
export type NewsItem = z.infer<typeof newsItemSchema>;
export type Rivalry = z.infer<typeof rivalrySchema>;
export const playerSchema = z.object({
  id: z.string(),
  schoolId: z.string(),
  name: z.string(),
  number: z.string().optional(),
  position: z.string().optional(),
  year: z.enum(["FR", "SO", "JR", "SR", "GR"]).optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  hometown: z.string().optional(),
  previousSchool: z.string().optional(),
  bio: z.string().optional(),
  imageUrl: z.string().optional(),
  sportId: z.string(),
  stats: z.record(z.string(), z.number()).optional(),
});

export const teamStatSchema = z.object({
  id: z.string(),
  schoolId: z.string(),
  sportId: z.string(),
  season: z.string().optional(),
  stats: z.record(z.string(), z.number()),
  lastUpdated: z.string().optional(),
});

export type SchoolSound = z.infer<typeof schoolSoundSchema>;
export type LocalEats = z.infer<typeof localEatsSchema>;
export type Player = z.infer<typeof playerSchema>;
export type TeamStat = z.infer<typeof teamStatSchema>;
