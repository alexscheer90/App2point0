import express from 'express';
import { fetchMacStandingsBySport } from '../services/macStandingsScraper';

const router = express.Router();

/**
 * GET /api/mac/standings/:sportId
 * Endpoint to get standings from MAC website scraped data
 */
router.get('/standings/:sportId', async (req, res) => {
  try {
    const { sportId } = req.params;
    
    // Validate the sport ID
    if (!sportId) {
      return res.status(400).json({
        success: false,
        message: 'Sport ID is required'
      });
    }
    
    console.log(`Server fetching MAC standings for sport: ${sportId}`);
    
    // Fetch standings for the specified sport
    const standings = await fetchMacStandingsBySport(sportId);
    
    if (standings.length === 0) {
      console.log(`No MAC standings found for sport: ${sportId}`);
      return res.json({
        success: false,
        message: `No standings found for sport: ${sportId}`,
        data: []
      });
    }
    
    console.log(`Successfully fetched ${standings.length} MAC standings entries for ${sportId}`);
    
    // Return the standings data
    return res.json({
      success: true,
      message: `Successfully fetched MAC standings for ${sportId}`,
      data: standings
    });
    
  } catch (error) {
    console.error(`Error fetching MAC standings: ${error}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch MAC standings',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;