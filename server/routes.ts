import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserPreferencesSchema, Game, NewsItem } from "@shared/schema";
import axios from "axios";
import { WebSocketServer, WebSocket } from "ws";
import importerRoutes from "./routes/importer";
import googleSheetsRoutes from "./routes/googleSheets";
import liveStatsRoutes from "./routes/livestats";
import express from "express";
import path from "path";
import { gameScheduleService } from "./services/gameScheduleService";
import { fetchNcaaBoxscore, fetchNcaaScoreboard } from "./services/ncaaService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static files from the public directory
  app.use(express.static(path.join(process.cwd(), 'public')));
  
  // Register data importer routes
  app.use('/api/import', importerRoutes);
  
  // Register Google Sheets routes
  app.use('/api/sheets', googleSheetsRoutes);
  
  // Register live stats routes
  app.use('/api/live-stats', liveStatsRoutes);

  // NCAA API proxy endpoints
  app.get("/api/ncaa/scoreboard", async (req, res) => {
    try {
      const sportId = String(req.query.sportId || "");
      const date = typeof req.query.date === "string" ? req.query.date : undefined;

      if (!sportId) {
        return res.status(400).json({ error: "sportId is required" });
      }

      const data = await fetchNcaaScoreboard(sportId, date);
      return res.json(data);
    } catch (error) {
      console.error("Error fetching NCAA scoreboard:", error);
      return res.status(500).json({ error: "Failed to fetch NCAA scoreboard" });
    }
  });

  app.get("/api/ncaa/game/:gameId/boxscore", async (req, res) => {
    try {
      const { gameId } = req.params;
      const data = await fetchNcaaBoxscore(gameId);
      return res.json(data);
    } catch (error) {
      console.error("Error fetching NCAA boxscore:", error);
      return res.status(500).json({ error: "Failed to fetch NCAA boxscore" });
    }
  });
  
  // API endpoint to get a game by ID
  app.get('/api/games/:gameId', async (req, res) => {
    try {
      const { gameId } = req.params;
      
      // Special handling for Miami baseball demo game
      if (gameId.includes('mac-120052')) {
        console.log(`Serving Miami baseball game details: ${gameId}`);
        
        try {
          // Get the latest data from Miami's feed
          const url = 'https://s3.amazonaws.com/sidearmstats.com/json_miamiohio_baseball_game.js.gz?callback=jsonp_miamiohio_baseball_game';
          
          // Import the sidearmService functions directly
          const sidearmService = await import('./services/sidearmService');
          const response = await sidearmService.fetchSidearmData(url);
          const processedData = sidearmService.processSidearmBaseballData(response.data);
          
          // Create a game with live data from SIDEARM
          const game: Game = {
            id: gameId,
            sportId: 'baseball',
            homeTeamId: 'miami-oh',
            awayTeamId: 'bellarmine',
            homeTeamName: 'Miami',
            awayTeamName: 'Bellarmine',
            homeTeamScore: 2, // Update to current score
            awayTeamScore: 2, // Update to current score
            startTime: new Date().toISOString(),
            scheduledTime: new Date().toISOString(),
            status: processedData.status, // Use the status from the SIDEARM data
            venue: 'McKie Field at Hayden Park',
            location: 'Oxford, OH',
            period: processedData.period,
            clock: '',
            situation: processedData.situation,
          };
          
          console.log(`Returning Miami game with status: ${game.status}`);
          
          // Store in game schedule service for future reference
          gameScheduleService.updateGame(gameId, game);
          
          return res.json(game);
        } catch (fetchError) {
          console.error('Error fetching Miami baseball data:', fetchError);
          
          // Return a basic game object with live status if we can't fetch live data
          return res.json({
            id: gameId,
            sportId: 'baseball',
            homeTeamId: 'miami-oh',
            awayTeamId: 'bellarmine',
            homeTeamName: 'Miami',
            awayTeamName: 'Bellarmine',
            homeTeamScore: 2,
            awayTeamScore: 2,
            startTime: new Date().toISOString(),
            scheduledTime: new Date().toISOString(),
            status: 'live', // Force status to live for testing
            venue: 'McKie Field at Hayden Park',
            location: 'Oxford, OH',
            period: 'B3',
            clock: '',
            situation: '0-0 count, 2 outs',
          });
        }
      }
      
      // For other games, check if we have it in the game schedule service
      const game = await gameScheduleService.getGameById(gameId);
      
      if (game) {
        return res.json(game);
      }
      
      // If we don't have the game, return a 404
      return res.status(404).json({ error: 'Game not found' });
    } catch (error) {
      console.error(`Error getting game ${req.params.gameId}:`, error);
      res.status(500).json({ error: 'Failed to get game' });
    }
  });
  
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
        'niuhuskies.com', // Northern Illinois
        'miamiredhawks.com', // Miami
        'wmubroncos.com', // Western Michigan
        'ubbulls.com', // Buffalo
        'umassathletics.com', // Massachusetts
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
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'application/rss+xml, application/xml, text/xml, */*'
        },
        maxRedirects: 5, // Allow up to 5 redirects
        validateStatus: function (status) {
          return status >= 200 && status < 400; // Accept 2xx and 3xx status codes
        },
        // Don't transform the response to avoid XML parsing issues
        transformResponse: [(data) => data],
        // Handle XML response with no content type
        responseType: 'text'
      });
      
      // Log response info for debugging
      const schoolName = url.includes('ballstatesports.com') ? 'Ball State' : 
                         url.includes('utrockets.com') ? 'Toledo' : 
                         url.includes('bgsufalcons.com') ? 'BGSU' : 
                         url.includes('ubbulls.com') ? 'Buffalo' : 'Other School';
                         
      console.log(`${schoolName} RSS response type: ${typeof response.data}`);
      console.log(`${schoolName} RSS starts with: ${response.data.substring(0, 100)}`);
      
      // Set the appropriate content type for XML
      res.set('Content-Type', 'application/xml');
      
      // Return the XML content to the client
      res.send(response.data);
    } catch (error) {
      console.error("Error fetching RSS feed:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({ message: "Failed to fetch RSS feed", error: errorMessage });
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
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({ message: "Failed to fetch podcast RSS feed", error: errorMessage });
    }
  });

  const httpServer = createServer(app);

  // Create WebSocket server on a distinct path
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: '/ws' 
  });
  
  console.log('WebSocket server initialized on path: /ws');

  // Store connected clients and their subscriptions
  const clients = new Set<WebSocket>();
  const gameSubscriptions = new Map<string, Set<WebSocket>>();

  // Helper function to broadcast to all connected clients
  const broadcast = (data: any) => {
    const message = JSON.stringify(data);
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };

  // Broadcast game update to subscribers of a specific game
  const broadcastGameUpdate = (gameId: string, game: Game, dataSource: 'espn' | 'sidearm' | 'mac') => {
    if (!gameSubscriptions.has(gameId)) return;
    
    const subscribers = gameSubscriptions.get(gameId);
    if (!subscribers) return;
    
    const message = JSON.stringify({
      type: 'gameUpdate',
      gameId,
      game,
      dataSource,
      timestamp: new Date().toISOString()
    });
    
    subscribers.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
    
    console.log(`Broadcasting game update for ${gameId} to ${subscribers.size} clients`);
  };

  // WebSocket connection handler
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    clients.add(ws);
    
    // Keep track of the games this client is subscribed to
    const clientSubscriptions = new Set<string>();

    // Handle incoming messages
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received message:', data);

        // Handle different message types
        switch (data.type) {
          case 'subscribe':
            // Client wants to subscribe to a game's updates
            if (data.gameId) {
              // Create a subscription set for this game if it doesn't exist
              if (!gameSubscriptions.has(data.gameId)) {
                gameSubscriptions.set(data.gameId, new Set<WebSocket>());
              }
              
              // Add this client to the game's subscribers
              const gameSubscribers = gameSubscriptions.get(data.gameId);
              if (gameSubscribers) {
                gameSubscribers.add(ws);
                clientSubscriptions.add(data.gameId);
                console.log(`Client subscribed to game ${data.gameId}, total subscribers: ${gameSubscribers.size}`);
                
                // Send an acknowledgment
                ws.send(JSON.stringify({
                  type: 'subscribed',
                  gameId: data.gameId
                }));
              }
            }
            break;
            
          case 'unsubscribe':
            // Client wants to unsubscribe from a game's updates
            if (data.gameId && gameSubscriptions.has(data.gameId)) {
              const gameSubscribers = gameSubscriptions.get(data.gameId);
              if (gameSubscribers) {
                gameSubscribers.delete(ws);
                clientSubscriptions.delete(data.gameId);
                console.log(`Client unsubscribed from game ${data.gameId}, remaining subscribers: ${gameSubscribers.size}`);
                
                // Clean up empty subscription sets
                if (gameSubscribers.size === 0) {
                  gameSubscriptions.delete(data.gameId);
                }
                
                // Send an acknowledgment
                ws.send(JSON.stringify({
                  type: 'unsubscribed',
                  gameId: data.gameId
                }));
              }
            }
            break;
            
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
      
      // Remove this client from all game subscriptions
      clientSubscriptions.forEach(gameId => {
        const subscribers = gameSubscriptions.get(gameId);
        if (subscribers) {
          subscribers.delete(ws);
          
          // Clean up empty subscription sets
          if (subscribers.size === 0) {
            gameSubscriptions.delete(gameId);
          }
        }
      });
      
      // Remove from the clients set
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

  const scoreProvider = process.env.SCOREBOARD_PROVIDER ?? "ncaa";

  // Setup polling for real ESPN data for active sports (only when enabled)
  // For now, we're just including a few sample sports
  const activeSports = ['baseball', 'softball', 'basketball', 'football'];
  
  // This would normally come from a proper ESPN API service
  // For demonstration, we're importing the axios module directly here
  const ESPN_API_BASE = 'https://site.api.espn.com/apis/site/v2/sports';
  
  // MAC conference ID in ESPN API
  const MAC_ESPN_ID = '14';
  
  // Sport path mapping
  const SPORT_ESPN_PATHS: Record<string, string> = {
    'football': 'football/college-football',
    'basketball': 'basketball/mens-college-basketball',
    'baseball': 'baseball/college-baseball',
    'softball': 'softball/college-softball'
  };
  
  // Cache the last known state for each game to avoid unnecessary broadcasts
  const gameStateCache = new Map<string, any>();
  
  // Setup poll interval for each sport
  if (scoreProvider === "espn") {
    for (const sport of activeSports) {
      // Skip sports without ESPN paths
      if (!SPORT_ESPN_PATHS[sport]) continue;

      // Use a shorter initial delay for immediate feedback
      setTimeout(() => {
        // Set up polling for the specific sport
        pollESPNScores(sport);

        // Poll regularly every minute for live game updates
        setInterval(() => {
          pollESPNScores(sport);
        }, 60000); // Poll every minute
      }, 10000 + activeSports.indexOf(sport) * 5000); // Stagger initial polls
    }
  }
  
  async function pollESPNScores(sportId: string) {
    try {
      // Get the ESPN API path for this sport
      const sportPath = SPORT_ESPN_PATHS[sportId];
      if (!sportPath) return;
      
      // Today's date in YYYYMMDD format
      const today = new Date();
      const formattedDate = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;
      
      // For demo purposes, we're using the current date for most sports
      // but you could use specific dates for testing specific games
      const dateToUse = sportId === 'football' ? '20250419' : formattedDate; 
      
      // Construct URL with groups & dates parameters
      // Note: The correct format may vary by sport and API version
      // We'll try various formats if one fails
      const urlFormats = [
        // Try standard format
        `${ESPN_API_BASE}/${sportPath}/scoreboard?dates=${dateToUse}`,
        // Try with conference filter
        `${ESPN_API_BASE}/${sportPath}/scoreboard?groups=${MAC_ESPN_ID}&dates=${dateToUse}`,
        // Try with different conference parameter
        `${ESPN_API_BASE}/${sportPath}/scoreboard?group=${MAC_ESPN_ID}&dates=${dateToUse}`,
        // Try without date to let ESPN pick the default window
        `${ESPN_API_BASE}/${sportPath}/scoreboard`,
        // Try without date but with conference filter
        `${ESPN_API_BASE}/${sportPath}/scoreboard?groups=${MAC_ESPN_ID}`,
        // Try different date format (year only) for testing
        `${ESPN_API_BASE}/${sportPath}/scoreboard?dates=2025`
      ];
        
      const url = urlFormats[0]; // Start with first format
      
      // Try each URL format until one works
      let data = null;
      let urlUsed = '';
      let error = null;
      
      for (const currentUrl of urlFormats) {
        try {
          console.log(`Trying ESPN API for ${sportId}: ${currentUrl}`);
          const response = await axios.get(currentUrl);
          data = response.data;
          urlUsed = currentUrl;
          console.log(`Successfully connected to ESPN API for ${sportId}`);
          break; // Exit loop if successful
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          console.error(`Error with URL format ${currentUrl}:`, errorMessage);
          if (error === null) {
            error = err; // Only assign if error is null (first error encountered)
          }
          // Continue to next URL format
        }
      }
      
      // If all formats failed
      if (!data) {
        console.error(`All ESPN API URL formats failed for ${sportId}`);
        throw error || new Error('Failed to connect to ESPN API');
      }
      
      // Check if we have events to process
      if (!data.events || !Array.isArray(data.events)) {
        console.log(`No ${sportId} events found`);
        return;
      }
      
      console.log(`Found ${data.events.length} ${sportId} events from ESPN API`);
      
      // Process each event
      for (const event of data.events) {
        if (!event.competitions || !event.competitions.length) continue;
        
        const competition = event.competitions[0];
        const homeTeam = competition.competitors.find((c: any) => c.homeAway === 'home');
        const awayTeam = competition.competitors.find((c: any) => c.homeAway === 'away');
        
        if (!homeTeam || !awayTeam) continue;
        
        // Map ESPN status to our game status
        const statusMap: Record<string, any> = {
          'pre': 'scheduled',
          'in': 'live',
          'post': 'final'
        };
        
        const status = statusMap[event.status.type.state] || 'scheduled';
        const gameId = `espn-${event.id}`;
        
        // Map ESPN team names to our team IDs
        const getTeamId = (teamName: string): string => {
          const normalizedName = teamName.toLowerCase().trim();
          
          // Map of ESPN team names to our team IDs
          const teamNameMap: Record<string, string> = {
            'akron': 'akron',
            'zips': 'akron',
            'ball state': 'ballstate',
            'cardinals': 'ballstate',
            'bowling green': 'bowlinggreen',
            'falcons': 'bowlinggreen',
            'buffalo': 'buffalo',
            'bulls': 'buffalo',
            'central michigan': 'centralmichigan',
            'chippewas': 'centralmichigan',
            'eastern michigan': 'easternmichigan',
            'eagles': 'easternmichigan',
            'kent state': 'kentstate',
            'golden flashes': 'kentstate',
            'miami (oh)': 'miamioh',
            'redhawks': 'miamioh',
            'northern illinois': 'northernillinois',
            'huskies': 'northernillinois',
            'ohio': 'ohio',
            'bobcats': 'ohio',
            'ohio state': 'ohiostate',
            'buckeyes': 'ohiostate',
            'toledo': 'toledo',
            'rockets': 'toledo',
            'western michigan': 'westernmichigan',
            'broncos': 'westernmichigan'
          };
          
          // Try to find the team in our map
          for (const [key, value] of Object.entries(teamNameMap)) {
            if (normalizedName.includes(key)) {
              return value;
            }
          }
          
          // Handle special cases
          if (normalizedName.includes('miami') && !normalizedName.includes('florida')) {
            return 'miamioh'; // Assume it's Miami (OH) if not specified as Miami (FL)
          }
          
          // Return unknown with the name for debugging
          return `unknown-${normalizedName.replace(/\s+/g, '-')}`;
        };

        // Create game object from ESPN data
        const game: Game = {
          id: gameId,
          sportId,
          homeTeamId: getTeamId(homeTeam.team.displayName),
          awayTeamId: getTeamId(awayTeam.team.displayName),
          homeTeamName: homeTeam.team.displayName,
          awayTeamName: awayTeam.team.displayName,
          homeTeamScore: parseInt(homeTeam.score) || 0,
          awayTeamScore: parseInt(awayTeam.score) || 0,
          startTime: new Date(event.date).toISOString(),
          scheduledTime: new Date(event.date).toISOString(),
          status,
          venue: competition.venue?.fullName || '',
          location: competition.venue?.address?.city || '',
          period: competition.status?.period,
          clock: competition.status?.displayClock,
          situation: competition.situation?.lastPlay?.text || '',
          dataSource: 'espn', // Mark as coming from ESPN
        };
        
        // Check if game state has changed since last update
        const cachedGameJson = gameStateCache.get(gameId);
        const currentGameJson = JSON.stringify(game);
        
        if (cachedGameJson !== currentGameJson) {
          // State has changed, broadcast update
          broadcast({
            type: 'game_update',
            payload: game
          });
          
          console.log(`Broadcast update for ${sportId} game ${game.homeTeamName} vs ${game.awayTeamName}`);
          
          // Update cache
          gameStateCache.set(gameId, currentGameJson);
        }
      }
    } catch (error) {
      console.error(`Error polling ESPN scores for ${sportId}:`, error);
    }
  }
  
  // We're removing all test data sending

  return httpServer;
}
