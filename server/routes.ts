import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserPreferencesSchema, Game, NewsItem } from "@shared/schema";
import axios from "axios";
import { WebSocketServer, WebSocket } from "ws";

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
      
      // Special handling for Ball State - they have a non-standard feed format
      const isBallState = url.includes('ballstatesports.com');
      
      // Make the request to the school website with automatic redirect following
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'application/rss+xml, application/xml, text/xml, */*'
        },
        maxRedirects: 5, // Allow up to 5 redirects
        validateStatus: function (status) {
          return status >= 200 && status < 400; // Accept 2xx and 3xx status codes
        },
        // For Ball State, don't transform the response to avoid XML parsing issues
        transformResponse: isBallState ? [(data) => data] : axios.defaults.transformResponse
      });
      
      // Extra logging for Ball State feed
      if (isBallState) {
        console.log(`Ball State RSS response type: ${typeof response.data}`);
        console.log(`Ball State RSS starts with: ${response.data.substring(0, 100)}`);
      }
      
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

  // API endpoint for fetching schedule feeds (supports both RSS and ICS formats)
  app.get("/api/fetch-schedule", async (req, res) => {
    try {
      const url = req.query.url as string;
      
      if (!url) {
        return res.status(400).json({ message: "URL parameter is required" });
      }
      
      // Validate that the URL is from a trusted domain (MAC or school websites)
      const validDomains = [
        'getsomemaction.com', // MAC main site
        'mac-sports.com',     // MAC sports site
        'utrockets.com',      // Toledo
        'bgsufalcons.com',    // Bowling Green
        'emueagles.com',      // Eastern Michigan
        'gozips.com',         // Akron
        'cmuchippewas.com',   // Central Michigan
        'bsubsports.com',     // Ball State
        'ballstatesports.com',// Ball State (new URL)
        'ohiobobcats.com',    // Ohio
        'kentstatesports.com',// Kent State
        'goniuhuskies.com',   // Northern Illinois
        'miamiredhawks.com',  // Miami
        'wmubroncos.com',     // Western Michigan
        'buffalo.edu',        // Buffalo
        'umassathletics.com', // UMass
      ];
      
      const urlObj = new URL(url);
      const isDomainValid = validDomains.some(domain => urlObj.hostname.includes(domain));
      
      if (!isDomainValid) {
        return res.status(403).json({ message: "URL domain not allowed" });
      }
      
      // Determine if we're fetching an ICS calendar file
      const isIcsRequest = url.includes('.ics') || url.includes('calendar.ashx');
      
      console.log(`Server fetching ${isIcsRequest ? 'ICS calendar' : 'schedule feed'} from: ${url}`);
      
      // Make the request to the site with automatic redirect following
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': isIcsRequest 
            ? 'text/calendar, text/plain, */*' 
            : 'application/rss+xml, application/xml, text/xml, */*'
        },
        maxRedirects: 5, // Allow up to 5 redirects
        validateStatus: function (status) {
          return status >= 200 && status < 400; // Accept 2xx and 3xx status codes
        },
        // Don't parse ICS files, return them as text
        responseType: isIcsRequest ? 'text' : 'json'
      });
      
      // Set the appropriate content type
      if (isIcsRequest) {
        res.set('Content-Type', 'text/calendar');
      } else {
        res.set('Content-Type', 'application/xml');
      }
      
      // Return the content to the client
      res.send(response.data);
    } catch (error) {
      console.error("Error fetching schedule feed:", error);
      res.status(500).json({ message: "Failed to fetch schedule feed" });
    }
  });

  const httpServer = createServer(app);

  // Create WebSocket server on a distinct path
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: '/ws' 
  });
  
  console.log('WebSocket server initialized on path: /ws');

  // Store connected clients
  const clients = new Set<WebSocket>();

  // Helper function to broadcast to all connected clients
  const broadcast = (data: any) => {
    const message = JSON.stringify(data);
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };

  // WebSocket connection handler
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    clients.add(ws);

    // Handle incoming messages
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received message:', data);

        // Handle different message types
        switch (data.type) {
          case 'PING':
            // Respond to keep-alive pings
            ws.send(JSON.stringify({ type: 'PING' }));
            break;
          default:
            console.log('Unknown message type:', data.type);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    // Handle client disconnection
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
      clients.delete(ws);
    });

    // Handle errors
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });

    // Send a welcome message
    ws.send(JSON.stringify({ 
      type: 'info', 
      payload: { message: 'Connected to Mobile #MACtion WebSocket server' } 
    }));
  });

  // Setup demo notifications for testing
  // In a real app, these would be triggered by real events
  setTimeout(() => {
    // Sample game update for testing
    const gameUpdate = {
      type: 'game_update',
      payload: {
        id: 'game_1',
        sportId: 'football',
        homeTeamId: 'toledo',
        awayTeamId: 'bgsu',
        homeTeamScore: 24,
        awayTeamScore: 21,
        startTime: new Date().toISOString(),
        status: 'live' as const,
        period: 4,
        clock: '2:30',
        situation: 'Toledo ball, 3rd and 8',
        venue: 'Glass Bowl',
        isRivalryGame: true
      } as Game
    };
    
    broadcast(gameUpdate);
    console.log('Sent test game update');
    
    // Sample news update for testing
    setTimeout(() => {
      const newsUpdate = {
        type: 'news_update',
        payload: {
          id: 'news_1',
          schoolId: 'toledo',
          title: 'Toledo Takes Lead in Rivalry Game',
          summary: 'Rockets score late touchdown to take lead over Falcons',
          publishedAt: new Date().toISOString(),
          url: 'https://utrockets.com/news/2025/4/4/football-rockets-take-lead'
        } as NewsItem
      };
      
      broadcast(newsUpdate);
      console.log('Sent test news update');
    }, 10000); // 10 seconds after game update
  }, 30000); // 30 seconds after server start

  return httpServer;
}
