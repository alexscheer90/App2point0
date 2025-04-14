import { Router, Request, Response } from 'express';
import { googleSheetsService } from '../services/googleSheetsService';

const router = Router();

/**
 * Get standings for a specific sport from Google Sheets
 * GET /api/sheets/standings/:sportId
 */
router.get('/standings/:sportId', async (req: Request, res: Response) => {
  try {
    const { sportId } = req.params;
    
    console.log(`Fetching ${sportId} standings from Google Sheets`);
    const standings = await googleSheetsService.fetchStandings(sportId);
    
    return res.json({
      success: true,
      data: standings,
      count: standings.length,
      message: `Successfully fetched ${standings.length} standings entries for ${sportId}`
    });
  } catch (error) {
    console.error('Error fetching standings from Google Sheets:', error);
    return res.status(500).json({
      error: 'Failed to fetch standings from Google Sheets',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;