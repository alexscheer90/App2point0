import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserPreferencesSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoints for user preferences
  app.get("/api/preferences", async (req, res) => {
    try {
      // For simplicity, we're using a fixed userId for the demo
      // In a real app, this would come from authenticated user session
      const userId = 1;
      
      let preferences = await storage.getUserPreferences(userId);
      
      // If no preferences exist, create a default one
      if (!preferences) {
        preferences = await storage.updateUserPreferences({
          userId,
          favoriteSchool: null,
        });
      }
      
      res.json(preferences);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user preferences" });
    }
  });

  app.post("/api/preferences", async (req, res) => {
    try {
      // Validate the incoming data
      const prefsData = insertUserPreferencesSchema.parse(req.body);
      
      // Update preferences in storage
      const updatedPrefs = await storage.updateUserPreferences(prefsData);
      
      res.json(updatedPrefs);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data format", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update user preferences" });
      }
    }
  });

  // API endpoint for getting favorite school
  app.get("/api/preferences/favorite-school", async (req, res) => {
    try {
      // For simplicity, we're using a fixed userId for the demo
      const userId = 1;
      
      const preferences = await storage.getUserPreferences(userId);
      
      res.json({ favoriteSchool: preferences?.favoriteSchool || null });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch favorite school" });
    }
  });

  // API endpoint for updating favorite school
  app.post("/api/preferences/favorite-school", async (req, res) => {
    try {
      // Validate the incoming data
      const favoriteSchoolSchema = z.object({
        favoriteSchool: z.string().nullable(),
      });
      
      const { favoriteSchool } = favoriteSchoolSchema.parse(req.body);
      
      // For simplicity, we're using a fixed userId for the demo
      const userId = 1;
      
      // Update preferences in storage
      const updatedPrefs = await storage.updateUserPreferences({
        userId,
        favoriteSchool,
      });
      
      res.json({ favoriteSchool: updatedPrefs.favoriteSchool });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data format", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update favorite school" });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
