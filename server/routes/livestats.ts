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

// Export the router as default
export default router;