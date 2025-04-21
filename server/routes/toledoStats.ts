import { Router } from 'express';
import toledoSidearmService from '../services/toledoSidearmService';

const router = Router();

/**
 * GET /api/toledo/baseball/stats
 * Fetches the live stats for Toledo baseball games
 */
router.get('/baseball/stats', async (req, res) => {
  try {
    const gameId = req.query.gameId as string | undefined;
    
    const stats = await toledoSidearmService.scrapeToledoBaseballStats(gameId);
    
    if (stats) {
      return res.json({
        success: true,
        data: stats
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'No live stats currently available'
      });
    }
  } catch (error) {
    console.error('Error fetching Toledo baseball stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch Toledo baseball stats'
    });
  }
});

/**
 * GET /api/toledo/baseball/check
 * Checks if the Toledo baseball stats page is available
 */
router.get('/baseball/check', async (req, res) => {
  try {
    const isAvailable = await toledoSidearmService.scrapeToledoBaseballStats() !== null;
    
    return res.json({
      success: true,
      available: isAvailable
    });
  } catch (error) {
    console.error('Error checking Toledo baseball stats availability:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to check Toledo baseball stats availability'
    });
  }
});

export default router;