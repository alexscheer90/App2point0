import express, { Request, Response } from 'express';
import { macService } from '../services/macService';

const router = express.Router();

/**
 * GET /api/mac/calendar
 * Gets all MAC calendar events with proper scores for past events
 * Optional query parameters:
 * - date: The date to fetch (YYYY-MM-DD format)
 */
router.get('/calendar', async (req: Request, res: Response) => {
  try {
    const date = req.query.date as string | undefined;
    
    // Get MAC calendar events with scores
    const events = await macService.fetchMacEvents(date);
    
    return res.json({
      success: true,
      data: events,
      message: `Successfully fetched ${events.length} MAC calendar events`
    });
  } catch (error) {
    console.error('Error fetching MAC calendar:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch MAC calendar',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/mac/events-by-date/:date
 * Gets all MAC events for a specific date
 */
router.get('/events-by-date/:date', async (req: Request, res: Response) => {
  try {
    const { date } = req.params;
    
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format',
        message: 'Date must be in YYYY-MM-DD format'
      });
    }
    
    // Get MAC calendar events with scores for the specific date
    const events = await macService.fetchMacEvents(date);
    
    // Filter events that are scheduled for this date
    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);
    const nextDay = new Date(dateObj);
    nextDay.setDate(nextDay.getDate() + 1);
    
    const eventsForDate = events.filter(event => {
      const eventDate = new Date(event.startTime || event.scheduledTime || '');
      return eventDate >= dateObj && eventDate < nextDay;
    });
    
    return res.json({
      success: true,
      data: eventsForDate,
      message: `Successfully fetched ${eventsForDate.length} MAC events for ${date}`
    });
  } catch (error) {
    console.error(`Error fetching MAC events for date ${req.params.date}:`, error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch MAC events',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;