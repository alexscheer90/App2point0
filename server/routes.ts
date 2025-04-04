import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserPreferencesSchema } from "@shared/schema";
import axios from "axios";

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

  // API endpoint for scraping standings data
  // This endpoint acts as a proxy to avoid CORS issues when fetching from the MAC website
  app.get("/api/scrape-standings", async (req, res) => {
    try {
      const url = req.query.url as string;
      
      if (!url) {
        return res.status(400).json({ message: "URL parameter is required" });
      }
      
      // Validate that the URL is from a trusted domain (MAC website)
      const validDomains = ['getsomemaction.com', 'mac-sports.com'];
      const urlObj = new URL(url);
      const isDomainValid = validDomains.some(domain => urlObj.hostname.includes(domain));
      
      if (!isDomainValid) {
        return res.status(403).json({ message: "URL domain not allowed" });
      }
      
      console.log(`Server scraping data from: ${url}`);
      
      // Make the request to the MAC website
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      // Return the HTML content to the client
      res.send(response.data);
    } catch (error) {
      console.error("Error scraping standings:", error);
      res.status(500).json({ message: "Failed to scrape standings data" });
    }
  });

  // API endpoint for fetching RSS feeds
  // This endpoint acts as a proxy to avoid CORS issues when fetching from school websites
  app.get("/api/fetch-rss", async (req, res) => {
    try {
      const url = req.query.url as string;
      
      if (!url) {
        return res.status(400).json({ message: "URL parameter is required" });
      }
      
      // Validate that the URL is from a trusted domain (MAC school websites)
      const validDomains = [
        'utrockets.com', // Toledo
        'bgsufalcons.com', // Bowling Green
        'emueagles.com', // Eastern Michigan
        'gozips.com', // Akron
        'cmuchippewas.com', // Central Michigan
        'bsubsports.com', // Ball State
        'ballstatesports.com', // Ball State (new URL)
        'ohiobobcats.com', // Ohio
        'kentstatesports.com', // Kent State
        'goniuhuskies.com', // Northern Illinois
        'miamiredhawks.com', // Miami
        'wmubroncos.com', // Western Michigan
        'buffalo.edu', // Buffalo
      ];
      
      const urlObj = new URL(url);
      const isDomainValid = validDomains.some(domain => urlObj.hostname.includes(domain));
      
      if (!isDomainValid) {
        return res.status(403).json({ message: "URL domain not allowed" });
      }
      
      console.log(`Server fetching RSS from: ${url}`);
      
      // Make the request to the school website with automatic redirect following
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        maxRedirects: 5, // Allow up to 5 redirects
        validateStatus: function (status) {
          return status >= 200 && status < 400; // Accept 2xx and 3xx status codes
        }
      });
      
      // Set the appropriate content type for XML
      res.set('Content-Type', 'application/xml');
      
      // Return the XML content to the client
      res.send(response.data);
    } catch (error) {
      console.error("Error fetching RSS feed:", error);
      res.status(500).json({ message: "Failed to fetch RSS feed" });
    }
  });

  // API endpoint for fetching the podcast RSS feed
  app.get("/api/fetch-podcast-rss", async (req, res) => {
    try {
      const url = "https://rss.art19.com/mac-sports-connection-podcast";
      
      console.log(`Server fetching podcast RSS from: ${url}`);
      
      // Make the request to the podcast host
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        maxRedirects: 5, // Allow up to 5 redirects
        validateStatus: function (status) {
          return status >= 200 && status < 400; // Accept 2xx and 3xx status codes
        }
      });
      
      // Set the appropriate content type for XML
      res.set('Content-Type', 'application/xml');
      
      // Return the XML content to the client
      res.send(response.data);
    } catch (error) {
      console.error("Error fetching podcast RSS feed:", error);
      res.status(500).json({ message: "Failed to fetch podcast RSS feed" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
