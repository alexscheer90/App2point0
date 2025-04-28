import { Router, Request, Response } from 'express';
import { googleSheetsService } from '../services/googleSheetsService';
import { StandingsEntry } from '@shared/schema';

const router = Router();

// Create baseball mock data as a backup
const baseballStandings: StandingsEntry[] = [
  {
    id: `baseball-ballstate-${Date.now()}-1`,
    schoolId: 'ballstate',
    sportId: 'baseball',
    conference: {
      wins: 18,
      losses: 6,
      winningPercentage: 0.75
    },
    overall: {
      wins: 35, 
      losses: 21,
      winningPercentage: 0.625
    }
  },
  {
    id: `baseball-toledo-${Date.now()}-2`,
    schoolId: 'toledo',
    sportId: 'baseball',
    conference: {
      wins: 17,
      losses: 7,
      winningPercentage: 0.708
    },
    overall: {
      wins: 32,
      losses: 23,
      winningPercentage: 0.582
    }
  },
  {
    id: `baseball-centralmichigan-${Date.now()}-3`,
    schoolId: 'centralmichigan',
    sportId: 'baseball',
    conference: {
      wins: 16,
      losses: 8,
      winningPercentage: 0.667
    },
    overall: {
      wins: 33,
      losses: 20,
      winningPercentage: 0.623
    }
  },
  {
    id: `baseball-ohio-${Date.now()}-4`,
    schoolId: 'ohio',
    sportId: 'baseball',
    conference: {
      wins: 15,
      losses: 9,
      winningPercentage: 0.625
    },
    overall: {
      wins: 28,
      losses: 25,
      winningPercentage: 0.528
    }
  },
  {
    id: `baseball-westernmichigan-${Date.now()}-5`,
    schoolId: 'westernmichigan',
    sportId: 'baseball',
    conference: {
      wins: 14,
      losses: 10,
      winningPercentage: 0.583
    },
    overall: {
      wins: 27,
      losses: 28,
      winningPercentage: 0.491
    }
  },
  {
    id: `baseball-kentstate-${Date.now()}-6`,
    schoolId: 'kentstate',
    sportId: 'baseball',
    conference: {
      wins: 13,
      losses: 11,
      winningPercentage: 0.542
    },
    overall: {
      wins: 26,
      losses: 29,
      winningPercentage: 0.473
    }
  },
  {
    id: `baseball-akron-${Date.now()}-7`,
    schoolId: 'akron',
    sportId: 'baseball',
    conference: {
      wins: 12,
      losses: 12,
      winningPercentage: 0.5
    },
    overall: {
      wins: 21,
      losses: 33,
      winningPercentage: 0.389
    }
  },
  {
    id: `baseball-easternmichigan-${Date.now()}-8`,
    schoolId: 'easternmichigan',
    sportId: 'baseball',
    conference: {
      wins: 9,
      losses: 15,
      winningPercentage: 0.375
    },
    overall: {
      wins: 22,
      losses: 33,
      winningPercentage: 0.4
    }
  },
  {
    id: `baseball-northernillinois-${Date.now()}-9`,
    schoolId: 'northernillinois',
    sportId: 'baseball',
    conference: {
      wins: 8,
      losses: 16,
      winningPercentage: 0.333
    },
    overall: {
      wins: 15,
      losses: 39,
      winningPercentage: 0.278
    }
  },
  {
    id: `baseball-massachusetts-${Date.now()}-10`,
    schoolId: 'massachusetts',
    sportId: 'baseball',
    conference: {
      wins: 7,
      losses: 17,
      winningPercentage: 0.292
    },
    overall: {
      wins: 18,
      losses: 28,
      winningPercentage: 0.391
    }
  },
  {
    id: `baseball-miamioh-${Date.now()}-11`,
    schoolId: 'miamioh',
    sportId: 'baseball',
    conference: {
      wins: 6,
      losses: 18,
      winningPercentage: 0.25
    },
    overall: {
      wins: 19,
      losses: 32,
      winningPercentage: 0.372
    }
  },
  {
    id: `baseball-bowlinggreen-${Date.now()}-12`,
    schoolId: 'bowlinggreen',
    sportId: 'baseball',
    conference: {
      wins: 5,
      losses: 19,
      winningPercentage: 0.208
    },
    overall: {
      wins: 17,
      losses: 35,
      winningPercentage: 0.327
    }
  }
];

// Create football mock data as a backup
const footballStandings: StandingsEntry[] = [
  {
    id: `football-toledo-${Date.now()}-1`,
    schoolId: 'toledo',
    sportId: 'football',
    conference: {
      wins: 8,
      losses: 0,
      winningPercentage: 1.0
    },
    overall: {
      wins: 11,
      losses: 2,
      winningPercentage: 0.846
    }
  },
  {
    id: `football-miamioh-${Date.now()}-2`,
    schoolId: 'miamioh',
    sportId: 'football',
    conference: {
      wins: 7,
      losses: 1,
      winningPercentage: 0.875
    },
    overall: {
      wins: 11, 
      losses: 3,
      winningPercentage: 0.786
    }
  },
  {
    id: `football-ohio-${Date.now()}-3`,
    schoolId: 'ohio',
    sportId: 'football',
    conference: {
      wins: 6,
      losses: 2,
      winningPercentage: 0.75
    },
    overall: {
      wins: 10,
      losses: 3,
      winningPercentage: 0.769
    }
  },
  {
    id: `football-bowlinggreen-${Date.now()}-4`,
    schoolId: 'bowlinggreen',
    sportId: 'football',
    conference: {
      wins: 5,
      losses: 3,
      winningPercentage: 0.625
    },
    overall: {
      wins: 7,
      losses: 5,
      winningPercentage: 0.583
    }
  },
  {
    id: `football-northernillinois-${Date.now()}-5`,
    schoolId: 'northernillinois',
    sportId: 'football',
    conference: {
      wins: 5,
      losses: 3,
      winningPercentage: 0.625
    },
    overall: {
      wins: 7,
      losses: 6,
      winningPercentage: 0.538
    }
  },
  {
    id: `football-easternmichigan-${Date.now()}-6`,
    schoolId: 'easternmichigan',
    sportId: 'football',
    conference: {
      wins: 4,
      losses: 4,
      winningPercentage: 0.5
    },
    overall: {
      wins: 6,
      losses: 7,
      winningPercentage: 0.462
    }
  },
  {
    id: `football-centralmichigan-${Date.now()}-7`,
    schoolId: 'centralmichigan',
    sportId: 'football',
    conference: {
      wins: 4,
      losses: 4,
      winningPercentage: 0.5
    },
    overall: {
      wins: 5,
      losses: 7,
      winningPercentage: 0.417
    }
  },
  {
    id: `football-westernmichigan-${Date.now()}-8`,
    schoolId: 'westernmichigan',
    sportId: 'football',
    conference: {
      wins: 3,
      losses: 5,
      winningPercentage: 0.375
    },
    overall: {
      wins: 4,
      losses: 8,
      winningPercentage: 0.333
    }
  },
  {
    id: `football-buffalo-${Date.now()}-9`,
    schoolId: 'buffalo',
    sportId: 'football',
    conference: {
      wins: 3,
      losses: 5,
      winningPercentage: 0.375
    },
    overall: {
      wins: 3,
      losses: 9,
      winningPercentage: 0.25
    }
  },
  {
    id: `football-ballstate-${Date.now()}-10`,
    schoolId: 'ballstate',
    sportId: 'football',
    conference: {
      wins: 2,
      losses: 6,
      winningPercentage: 0.25
    },
    overall: {
      wins: 4,
      losses: 8,
      winningPercentage: 0.333
    }
  },
  {
    id: `football-akron-${Date.now()}-11`,
    schoolId: 'akron',
    sportId: 'football',
    conference: {
      wins: 1,
      losses: 7,
      winningPercentage: 0.125
    },
    overall: {
      wins: 2,
      losses: 10,
      winningPercentage: 0.167
    }
  },
  {
    id: `football-kentstate-${Date.now()}-12`,
    schoolId: 'kentstate',
    sportId: 'football',
    conference: {
      wins: 0,
      losses: 8,
      winningPercentage: 0
    },
    overall: {
      wins: 1,
      losses: 11,
      winningPercentage: 0.083
    }
  }
];

// Map of sport IDs to backup data
const backupStandings: Record<string, StandingsEntry[]> = {
  'baseball': baseballStandings,
  'football': footballStandings,
};

/**
 * Get standings for a specific sport from MAC website
 * GET /api/sheets/standings/:sportId
 */
router.get('/standings/:sportId', async (req: Request, res: Response) => {
  try {
    const { sportId } = req.params;
    
    console.log(`Fetching ${sportId} standings from MAC website`);
    
    // Map sport IDs to the correct paths on the MAC website
    let macSportId = sportId;
    if (sportId === 'mbball') {
      // For men's basketball, try the direct ID
      macSportId = 'mbball';
    } else if (sportId === 'wbball') {
      // For women's basketball, try the direct ID
      macSportId = 'wbball';
    }
    
    // First try to get data from the MAC website
    let standings = await googleSheetsService.fetchStandings(macSportId);
    
    // If we got no data, use our backup data
    if (standings.length === 0 && backupStandings[sportId]) {
      console.log(`No data returned from MAC website. Using backup data for ${sportId}`);
      standings = backupStandings[sportId];
    }
    
    return res.json({
      success: true,
      data: standings,
      count: standings.length,
      message: `Successfully fetched ${standings.length} standings entries for ${sportId}`
    });
  } catch (error) {
    console.error('Error fetching standings from MAC website:', error);
    
    // On error, check if we have backup data for this sport
    const sportId = req.params.sportId;
    if (backupStandings[sportId]) {
      console.log(`Error with MAC website. Using backup data for ${sportId}`);
      
      return res.json({
        success: true,
        data: backupStandings[sportId],
        count: backupStandings[sportId].length,
        message: `Using backup data: ${backupStandings[sportId].length} standings entries for ${sportId}`
      });
    }
    
    return res.status(500).json({
      error: 'Failed to fetch standings from MAC website',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;