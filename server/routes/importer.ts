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
    
    // Import axios and cheerio directly
    const axios = require('axios');
    const cheerio = require('cheerio');
    
    console.log('Directly fetching and parsing HTML...');
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
    });
    
    const html = response.data;
    const $ = cheerio.load(html);
    
    // Direct parsing of standings
    console.log('Manually parsing baseball standings table...');
    const standings: any[] = [];
    
    // Find the standings table
    const table = $('.sidearm-standings-table, .sidearm-table');
    if (table.length === 0) {
      console.error('No standings table found!');
      return res.json({ 
        success: true, 
        data: [],
        count: 0,
        message: `No standings table found on the page`
      });
    }
    
    console.log(`Found ${table.length} tables with the sidearm classes`);
    
    // Get all rows in the table body
    const rows = table.find('tbody tr');
    console.log(`Found ${rows.length} data rows in the table`);
    
    // Parse each row
    rows.each((index, row) => {
      try {
        const cells = $(row).find('td');
        
        // Get team name from first cell - look for the team name span
        const teamNameCell = cells.first();
        const teamNameElement = teamNameCell.find('.sidearm-table-team-name');
        const teamName = teamNameElement.length ? teamNameElement.text().trim() : teamNameCell.text().trim();
        
        console.log(`Processing team: ${teamName}`);
        
        // Need to figure out which columns are conference wins/losses and which are overall
        // This depends on the table structure
        // Find the column positions from header
        let confWinsCol = 1; // Default positions, may need adjustment
        let confLossesCol = 2;
        let overallWinsCol = 4;
        let overallLossesCol = 5;
        
        // Get header text to determine column positions
        const headerRows = table.find('thead tr');
        if (headerRows.length > 1) {
          // Complex header with sections
          const sectionRow = headerRows.first();
          const sectionCells = sectionRow.find('th');
          
          // Find the section indices
          let confSectionStart = -1;
          let overallSectionStart = -1;
          let currentIndex = 0;
          
          sectionCells.each((i, cell) => {
            const sectionText = $(cell).text().trim().toUpperCase();
            const colspan = parseInt($(cell).attr('colspan') || '1');
            
            if (sectionText.includes('CONF')) {
              confSectionStart = currentIndex;
            } else if (sectionText.includes('OVERALL')) {
              overallSectionStart = currentIndex;
            }
            
            currentIndex += colspan;
          });
          
          if (confSectionStart >= 0) {
            confWinsCol = confSectionStart;
            confLossesCol = confSectionStart + 1;
          }
          
          if (overallSectionStart >= 0) {
            overallWinsCol = overallSectionStart;
            overallLossesCol = overallSectionStart + 1;
          }
        }
        
        // Extract wins and losses based on determined positions
        const confWins = parseInt($(cells.eq(confWinsCol)).text().trim()) || 0;
        const confLosses = parseInt($(cells.eq(confLossesCol)).text().trim()) || 0;
        const overallWins = parseInt($(cells.eq(overallWinsCol)).text().trim()) || 0;
        const overallLosses = parseInt($(cells.eq(overallLossesCol)).text().trim()) || 0;
        
        console.log(`  Conference: ${confWins}-${confLosses}, Overall: ${overallWins}-${overallLosses}`);
        
        // Create standings entry
        standings.push({
          id: `baseball-${Date.now()}-${index}`,
          schoolId: teamName.toLowerCase().replace(/[^a-z0-9]/g, ''),
          sportId: 'baseball',
          conference: {
            wins: confWins,
            losses: confLosses,
            winningPercentage: confWins + confLosses > 0 ? confWins / (confWins + confLosses) : 0
          },
          overall: {
            wins: overallWins,
            losses: overallLosses,
            winningPercentage: overallWins + overallLosses > 0 ? overallWins / (overallWins + overallLosses) : 0
          }
        });
      } catch (rowError) {
        console.error(`Error processing row ${index}:`, rowError);
      }
    });
    
    console.log(`Manually parsed ${standings.length} standings entries`);
    
    return res.json({ 
      success: true, 
      data: standings,
      count: standings.length,
      message: `Successfully imported ${standings.length} baseball standings entries`
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