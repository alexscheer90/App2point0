import express from 'express';
import { scrapeWomensSoccerStandings } from '../services/macStandingsScraper';

const router = express.Router();

// Cache the standings to avoid hammering the MAC website
type StandingsCache = {
  data: any;
  timestamp: number;
};

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
const standingsCache: Record<string, StandingsCache> = {};

/**
 * GET /api/mac/standings/:sportId
 * Returns standings for a specific sport scraped directly from MAC website
 */
router.get('/standings/:sportId', async (req, res) => {
  try {
    const { sportId } = req.params;
    
    // Currently only support women's soccer
    if (sportId !== 'wsoc' && sportId !== 'wsoccer') {
      return res.status(400).json({
        success: false,
        error: `Sport ${sportId} not supported for direct MAC website scraping`
      });
    }
    
    // Check the cache first
    const cacheKey = sportId === 'wsoccer' ? 'wsoc' : sportId; // Normalize keys
    const cachedData = standingsCache[cacheKey];
    const now = Date.now();
    
    // If we have cached data and it's still fresh, return it
    if (cachedData && (now - cachedData.timestamp) < CACHE_DURATION) {
      console.log(`Returning cached MAC standings for ${sportId}`);
      return res.json({
        success: true,
        data: cachedData.data,
        source: 'mac-website-cache'
      });
    }
    
    // Otherwise fetch fresh data
    console.log(`Scraping fresh MAC standings for ${sportId}`);
    const standings = await scrapeWomensSoccerStandings();
    
    // Cache the result
    standingsCache[cacheKey] = {
      data: standings,
      timestamp: now
    };
    
    return res.json({
      success: true,
      data: standings,
      source: 'mac-website'
    });
    
  } catch (error) {
    console.error('Error fetching MAC standings:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch standings from MAC website'
    });
  }
});

export default router;