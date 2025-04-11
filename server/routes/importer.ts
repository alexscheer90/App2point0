import { Router, Request, Response } from 'express';
import { dataImporter } from '../services/dataImporter';
import { z } from 'zod';

const router = Router();

// Schema for data import request validation
const importRequestSchema = z.object({
  url: z.string().url("A valid URL is required"),
  type: z.enum(["rss", "standings", "roster", "schedule", "stats"]),
  schoolId: z.string().optional(),
  sportId: z.string().optional(),
  selector: z.string().optional(),
  mappings: z.record(z.string(), z.string()).optional()
});

/**
 * Import data from external sources
 * POST /api/import
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validation = importRequestSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: "Invalid request parameters", 
        details: validation.error.format()
      });
    }
    
    const { url, type, schoolId, sportId, selector, mappings } = validation.data;
    
    let result;
    
    // Process based on import type
    switch (type) {
      case 'rss':
        result = await dataImporter.importRssFeed(url);
        // If schoolId is provided, assign it to the imported news items
        if (schoolId) {
          result = result.map(item => ({ ...item, schoolId }));
        }
        break;
        
      case 'standings':
        if (!sportId) {
          return res.status(400).json({ error: "sportId is required for standings import" });
        }
        result = await dataImporter.importStandings(url, sportId);
        break;
        
      case 'roster':
        if (!schoolId || !sportId) {
          return res.status(400).json({ error: "schoolId and sportId are required for roster import" });
        }
        result = await dataImporter.importRoster(url, schoolId, sportId);
        break;
        
      case 'schedule':
        if (!schoolId || !sportId) {
          return res.status(400).json({ error: "schoolId and sportId are required for schedule import" });
        }
        result = await dataImporter.importSchedule(url, schoolId, sportId);
        break;
        
      case 'stats':
        if (!schoolId || !sportId) {
          return res.status(400).json({ error: "schoolId and sportId are required for stats import" });
        }
        result = await dataImporter.importTeamStats(url, schoolId, sportId);
        break;
        
      default:
        return res.status(400).json({ error: "Unsupported import type" });
    }
    
    return res.status(200).json({ 
      success: true, 
      data: result,
      count: Array.isArray(result) ? result.length : 1
    });
  } catch (error) {
    console.error('Error in data import:', error);
    return res.status(500).json({ 
      error: "Data import failed", 
      message: error instanceof Error ? error.message : "Unknown error" 
    });
  }
});

/**
 * Import standings data for a specific sport from a URL
 * GET /api/import/standings/:sportId
 */
router.get('/standings/:sportId', async (req: Request, res: Response) => {
  try {
    const { sportId } = req.params;
    const url = req.query.url as string;
    
    if (!url) {
      return res.status(400).json({ error: 'Missing required query parameter: url' });
    }
    
    console.log(`Importing standings for sport ${sportId} from ${url}`);
    const result = await dataImporter.importStandings(url, sportId);
    
    return res.json({ 
      success: true, 
      data: result,
      count: result.length,
      message: `Successfully imported ${result.length} standings entries for ${sportId}`
    });
  } catch (error) {
    console.error('Standings import error:', error);
    return res.status(500).json({ 
      error: "Standings import failed", 
      message: error instanceof Error ? error.message : "Unknown error" 
    });
  }
});

/**
 * Import baseball standings directly from MAC website
 * This endpoint is a convenience method for testing the import functionality
 * GET /api/import/baseball-standings
 */
router.get('/baseball-standings', async (req: Request, res: Response) => {
  try {
    const url = 'https://getsomemaction.com/standings.aspx?path=baseball';
    const sportId = 'baseball';
    
    console.log(`Importing baseball standings from ${url}`);
    
    // First, fetch the raw HTML to inspect its structure
    const axios = require('axios');
    const cheerio = require('cheerio');
    
    console.log('Directly fetching HTML to analyze structure...');
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mobile-MACtion-App/1.0' }
    });
    
    const html = response.data;
    // Log first 1000 characters of the HTML to see what we're dealing with
    console.log(`HTML received (first 1000 chars): ${html.substring(0, 1000)}`);
    
    // Use cheerio to find the table elements
    const $ = cheerio.load(html);
    
    // Look for tables that might contain the standings
    console.log('Looking for standings tables...');
    $('.sidearm-table').each((i, el) => {
      console.log(`Found table ${i+1}`);
      // Count rows in table
      const rows = $(el).find('tr').length;
      console.log(`Table ${i+1} has ${rows} rows`);
      // Count header rows
      const theadRows = $(el).find('thead tr').length;
      console.log(`Table ${i+1} has ${theadRows} header rows`);
      
      // Look at first few columns in first data row
      const firstDataRow = $(el).find('tbody tr').first();
      console.log('First data row first few cells:');
      firstDataRow.find('td').slice(0, 3).each((j, cell) => {
        console.log(`  Cell ${j+1}: ${$(cell).text().trim()}`);
      });
    });
    
    // Now try the actual import
    const result = await dataImporter.importStandings(url, sportId);
    console.log(`Standings import result: ${JSON.stringify(result)}`);
    
    return res.json({ 
      success: true, 
      data: result,
      count: result.length,
      message: `Successfully imported ${result.length} baseball standings entries`
    });
  } catch (error) {
    console.error('Baseball standings import error:', error);
    return res.status(500).json({ 
      error: "Baseball standings import failed", 
      message: error instanceof Error ? error.message : "Unknown error" 
    });
  }
});

export default router;