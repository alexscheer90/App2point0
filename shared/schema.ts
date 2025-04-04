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
  logoUrl: z.string(),
  city: z.string().optional(),
  state: z.string().optional(),
});

export const sportSchema = z.object({
  id: z.string(),
  name: z.string(),
  gender: z.enum(["men", "women", "mixed"]),
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
  status: gameStatusSchema,
  period: z.string().optional(),
  clock: z.string().optional(),
  situation: z.string().optional(),
  venue: z.string().optional(),
  isRivalryGame: z.boolean().optional(),
});

export const standingsEntrySchema = z.object({
  schoolId: z.string(),
  sportId: z.string(),
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
  series: z.object({
    team1Wins: z.number(),
    team2Wins: z.number(),
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
export type SchoolSound = z.infer<typeof schoolSoundSchema>;
export type LocalEats = z.infer<typeof localEatsSchema>;
