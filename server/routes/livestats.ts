/**
 * API routes for live game stats
 */
import { Request, Response, Router } from 'express';
import { checkDataSources, fetchLiveGameData, processGameData } from '../services/unifiedDataService';
import { Game } from '../../shared/schema';

// Create router
const router = Router();

// Store some game data in-memory for quick access
const inMemoryGameCache: Map<string, { game: Game; lastUpdated: Date }> = new Map();

/**
 * Get all available data sources for a game
 * This helps the frontend decide which stats source to use
 */
export async function getDataSources(req: Request, res: Response) {
  try {
    const { gameId, sport } = req.params;
    
    if (!gameId || !sport) {
      return res.status(400).json({
        success: false,
        error: 'Game ID and sport must be provided'
      });
    }
    
    // Get the game from cache or storage
    const cachedGame = inMemoryGameCache.get(gameId);
    
    if (!cachedGame) {
      return res.status(404).json({
        success: false,
        error: 'Game not found in cache'
      });
    }
    
    // Check all available data sources for this game
    const dataSourceInfo = await checkDataSources(cachedGame.game, sport);
    
    return res.json({
      success: true,
      data: dataSourceInfo
    });
  } catch (error) {
    console.error('Error getting data sources:', error);
    return res.status(500).json({
      success: false,
      error: 'Unable to check data sources'
    });
  }
}

/**
 * Get live game data for a specific game
 */
export async function getLiveGameData(req: Request, res: Response) {
  try {
    const { gameId, sport } = req.params;
    
    if (!gameId || !sport) {
      return res.status(400).json({
        success: false,
        error: 'Game ID and sport must be provided'
      });
    }
    
    // Get the game from cache or storage
    const cachedGame = inMemoryGameCache.get(gameId);
    
    if (!cachedGame) {
      return res.status(404).json({
        success: false,
        error: 'Game not found in cache'
      });
    }
    
    // Fetch live game data from the best available source
    const gameData = await fetchLiveGameData(gameId, cachedGame.game, sport);
    
    // Process the game data into a unified format
    const processedData = processGameData(gameData, cachedGame.game);
    
    // Update the cache with the latest game data
    inMemoryGameCache.set(gameId, {
      game: {
        ...cachedGame.game,
        ...processedData
      },
      lastUpdated: new Date()
    });
    
    return res.json({
      success: true,
      data: {
        game: {
          ...cachedGame.game,
          ...processedData
        },
        sourceInfo: gameData.sourceInfo
      }
    });
  } catch (error) {
    console.error('Error getting live game data:', error);
    return res.status(500).json({
      success: false,
      error: 'Unable to fetch live game data'
    });
  }
}

/**
 * Store a game in the memory cache for quick access
 */
export function cacheGame(game: Game) {
  inMemoryGameCache.set(game.id, {
    game,
    lastUpdated: new Date()
  });
}

/**
 * Get a game from the cache
 */
export function getCachedGame(gameId: string): Game | null {
  const cachedGame = inMemoryGameCache.get(gameId);
  
  if (!cachedGame) {
    return null;
  }
  
  return cachedGame.game;
}

/**
 * Clear old games from the cache
 */
export function cleanupGameCache() {
  const now = new Date();
  const ONE_HOUR = 60 * 60 * 1000;
  
  // Use Array.from to convert the Map entries to an array for iteration
  Array.from(inMemoryGameCache.entries()).forEach(([gameId, cachedGame]) => {
    const timeSinceUpdate = now.getTime() - cachedGame.lastUpdated.getTime();
    
    if (timeSinceUpdate > ONE_HOUR) {
      inMemoryGameCache.delete(gameId);
    }
  });
}

// Register routes
router.get('/data-sources/:gameId/:sport', getDataSources);
router.get('/game-data/:gameId/:sport', getLiveGameData);

// Test endpoint for direct testing of the Miami baseball feed
router.get('/test-miami-feed', async (req, res) => {
  try {
    const url = 'https://s3.amazonaws.com/sidearmstats.com/json_miamiohio_baseball_game.js.gz?callback=jsonp_miamiohio_baseball_game';
    console.log('Testing fetch from:', url);
    
    // Directly use the sidearmService to test
    const { fetchSidearmGameData, processSidearmData } = await import('../services/sidearmService');
    const data = await fetchSidearmGameData('test', url);
    
    console.log('SIDEARM LIVE TEST DATA KEYS:', Object.keys(data.data || {}));
    console.log('SIDEARM LIVE TEST DATA SAMPLE:', 
      data.data && typeof data.data === 'object' 
        ? JSON.stringify(data.data).substring(0, 200) + '...' 
        : typeof data.data);
    
    // Create a mock game for testing
    const mockGame: Game = {
      id: 'test-game-123',
      sport: { id: 'baseball', name: 'Baseball' },
      homeTeam: { id: 'miami-oh', name: 'Miami (OH)', mascot: 'RedHawks', shortName: 'Miami' },
      awayTeam: { id: 'toledo', name: 'Toledo', mascot: 'Rockets', shortName: 'Toledo' },
      status: 'live',
      gameDate: new Date().toISOString(),
      network: '',
      location: data.data?.Location || 'Oxford, OH',
      sidearmAvailable: true,
      sidearmUrl: url
    };
    
    // Process the data using our SIDEARM service
    const processedData = processSidearmData(data.data, mockGame);
    console.log('PROCESSED SIDEARM DATA:', JSON.stringify(processedData));
    
    // Return both raw and processed data
    res.json({
      raw: data,
      processed: processedData
    });
  } catch (error) {
    console.error('Error in test endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to fetch test data',
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

// Export the router as default
export default router;