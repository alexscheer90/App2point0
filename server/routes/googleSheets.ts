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

// Function to generate standings data for any sport that doesn't have real data
function generateStandingsForSport(sportId: string): StandingsEntry[] {
  // If we already have backup data for this sport, use it
  if (sportId === 'baseball' && baseballStandings.length > 0) {
    return baseballStandings;
  }
  
  if (sportId === 'football' && footballStandings.length > 0) {
    return footballStandings;
  }
  
  // NCAA MAC Schools
  const macSchools = [
    'akron', 'ballstate', 'bowlinggreen', 'buffalo', 'centralmichigan', 
    'easternmichigan', 'kentstate', 'miamioh', 'northernillinois', 
    'ohio', 'toledo', 'westernmichigan'
  ];
  
  // Generate realistic conference records for the teams
  const standings: StandingsEntry[] = [];
  
  // Create a distribution of wins and losses that adds up to a realistic in-conference record
  // Each team plays against every other team in the conference
  const totalGamesPerTeam = macSchools.length - 1; // Each team plays against every other team
  let wins: number[] = Array(macSchools.length).fill(0);
  
  // Generate random but balanced wins (total wins equals total losses in conference play)
  for (let i = 0; i < macSchools.length; i++) {
    // Random number of wins between 0 and total games
    wins[i] = Math.floor(Math.random() * (totalGamesPerTeam + 1));
  }
  
  // Now create the standings entries with the generated records
  macSchools.forEach((schoolId, index) => {
    const conferenceWins = wins[index];
    const conferenceLosses = totalGamesPerTeam - conferenceWins;
    const winningPct = conferenceWins / totalGamesPerTeam;
    
    standings.push({
      id: `${sportId}-${schoolId}-${Date.now()}-${index}`,
      schoolId,
      sportId,
      conference: {
        wins: conferenceWins,
        losses: conferenceLosses,
        winningPercentage: Number(winningPct.toFixed(3))
      },
      overall: {
        wins: conferenceWins + Math.floor(Math.random() * 10), // Add some non-conference wins
        losses: conferenceLosses + Math.floor(Math.random() * 5), // Add some non-conference losses
        winningPercentage: 0.500 // Simplified overall percentage
      }
    });
  });
  
  // Sort by conference winning percentage (descending)
  return standings.sort((a, b) => 
    b.conference.winningPercentage - a.conference.winningPercentage
  );
}

// Map of sport IDs to backup data - now dynamic with our generator function
const backupStandings: Record<string, StandingsEntry[]> = {
  'baseball': baseballStandings,
  'football': footballStandings,
};

// Mock Google Sheet data for testing (these would come from the real Google Sheets API)
// In a real implementation, you would fetch this data from a Google Sheet API endpoint
const mockGoogleSheetData: Record<string, any[][]> = {
  // Women's Soccer example with points and goals columns (Columns A, D, E, G, H, J)
  'wsoc': [
    ['School', 'Mascot', 'Division', 'Record', 'Conf Pct', 'GP', 'Points', 'Goals', 'GF/GA', 'Overall Pct'],
    ['Bowling Green', 'Falcons', '', '6-2-2', '0.700', '10', '20', '18-9', '0.722'],
    ['Kent State', 'Golden Flashes', '', '6-3-1', '0.650', '10', '19', '17-11', '0.700'],
    ['Ball State', 'Cardinals', '', '6-4-0', '0.600', '10', '18', '15-10', '0.667'],
    ['Buffalo', 'Bulls', '', '5-3-2', '0.600', '10', '17', '14-10', '0.650'],
    ['Toledo', 'Rockets', '', '5-4-1', '0.550', '10', '16', '16-15', '0.600'],
    ['Miami (OH)', 'RedHawks', '', '5-5-0', '0.500', '10', '15', '14-16', '0.550'],
    ['Western Michigan', 'Broncos', '', '4-4-2', '0.500', '10', '14', '12-12', '0.550'],
    ['Central Michigan', 'Chippewas', '', '4-5-1', '0.450', '10', '13', '11-13', '0.500'],
    ['Eastern Michigan', 'Eagles', '', '3-5-2', '0.400', '10', '11', '10-14', '0.450'],
    ['Northern Illinois', 'Huskies', '', '3-6-1', '0.350', '10', '10', '10-16', '0.400'],
    ['Ohio', 'Bobcats', '', '3-7-0', '0.300', '10', '9', '8-18', '0.350'],
    ['Akron', 'Zips', '', '1-8-1', '0.150', '10', '4', '5-20', '0.200']
  ],
  // Map wsoccer to the same data
  'wsoccer': [
    ['School', 'Mascot', 'Division', 'Record', 'Conf Pct', 'GP', 'Points', 'Goals', 'GF/GA', 'Overall Pct'],
    ['Bowling Green', 'Falcons', '', '6-2-2', '0.700', '10', '20', '18-9', '0.722'],
    ['Kent State', 'Golden Flashes', '', '6-3-1', '0.650', '10', '19', '17-11', '0.700'],
    ['Ball State', 'Cardinals', '', '6-4-0', '0.600', '10', '18', '15-10', '0.667'],
    ['Buffalo', 'Bulls', '', '5-3-2', '0.600', '10', '17', '14-10', '0.650'],
    ['Toledo', 'Rockets', '', '5-4-1', '0.550', '10', '16', '16-15', '0.600'],
    ['Miami (OH)', 'RedHawks', '', '5-5-0', '0.500', '10', '15', '14-16', '0.550'],
    ['Western Michigan', 'Broncos', '', '4-4-2', '0.500', '10', '14', '12-12', '0.550'],
    ['Central Michigan', 'Chippewas', '', '4-5-1', '0.450', '10', '13', '11-13', '0.500'],
    ['Eastern Michigan', 'Eagles', '', '3-5-2', '0.400', '10', '11', '10-14', '0.450'],
    ['Northern Illinois', 'Huskies', '', '3-6-1', '0.350', '10', '10', '10-16', '0.400'],
    ['Ohio', 'Bobcats', '', '3-7-0', '0.300', '10', '9', '8-18', '0.350'],
    ['Akron', 'Zips', '', '1-8-1', '0.150', '10', '4', '5-20', '0.200']
  ],
  // Default: Columns A, D, E, F, I (school name, conference record, conference percentage, overall record, overall percentage)
  'football': [
    ['Team', 'Mascot', 'Rank', 'Conference', 'Conf Pct', 'Overall', 'Division', 'Points', 'Overall Pct'],
    ['Akron', 'Zips', '', '0-0', '0.000', '0-0', 'East', '0', '0.000'],
    ['Ball State', 'Cardinals', '', '0-0', '0.000', '0-0', 'West', '0', '0.000'],
    ['Bowling Green', 'Falcons', '', '0-0', '0.000', '0-0', 'East', '0', '0.000'],
    ['Buffalo', 'Bulls', '', '0-0', '0.000', '0-0', 'East', '0', '0.000'],
    ['Central Michigan', 'Chippewas', '', '0-0', '0.000', '0-0', 'West', '0', '0.000'],
    ['Eastern Michigan', 'Eagles', '', '0-0', '0.000', '0-0', 'West', '0', '0.000'],
    ['Kent State', 'Golden Flashes', '', '0-0', '0.000', '0-0', 'East', '0', '0.000'],
    ['Massachusetts', 'Minutemen', '', '0-0', '0.000', '0-0', 'East', '0', '0.000'],
    ['Miami (OH)', 'RedHawks', '', '0-0', '0.000', '0-0', 'East', '0', '0.000'],
    ['Northern Illinois', 'Huskies', '', '0-0', '0.000', '0-0', 'West', '0', '0.000'],
    ['Ohio', 'Bobcats', '', '0-0', '0.000', '0-0', 'East', '0', '0.000'],
    ['Toledo', 'Rockets', '', '0-0', '0.000', '0-0', 'West', '0', '0.000'],
    ['Western Michigan', 'Broncos', '', '0-0', '0.000', '0-0', 'West', '0', '0.000']
  ],
  // Baseball: Columns A, D, E, F, I
  'baseball': [
    ['School', 'Mascot', 'Division', 'Conference', 'Conf Pct', 'Overall', 'Home', 'Away', 'Overall Pct'],
    ['Ball State', 'Cardinals', '', '17-4', '0.810', '17-4', '10-2', '7-2', '0.810'],
    ['Kent State', 'Golden Flashes', '', '16-5', '0.762', '16-5', '10-2', '6-3', '0.762'],
    ['Miami (OH)', 'RedHawks', '', '18-6', '0.750', '18-6', '11-3', '7-3', '0.750'],
    ['Bowling Green', 'Falcons', '', '16-8', '0.667', '16-8', '9-3', '7-5', '0.667'],
    ['Toledo', 'Rockets', '', '10-11', '0.476', '10-11', '5-5', '5-6', '0.476'],
    ['Eastern Michigan', 'Eagles', '', '9-12', '0.429', '9-12', '5-6', '4-6', '0.429'],
    ['Central Michigan', 'Chippewas', '', '9-12', '0.429', '9-12', '4-6', '5-6', '0.429'],
    ['Western Michigan', 'Broncos', '', '8-13', '0.381', '8-13', '4-7', '4-6', '0.381'],
    ['Akron', 'Zips', '', '7-17', '0.292', '7-17', '4-9', '3-8', '0.292'],
    ['Northern Illinois', 'Huskies', '', '5-16', '0.238', '5-16', '3-8', '2-8', '0.238'],
    ['Ohio', 'Bobcats', '', '5-16', '0.238', '5-16', '3-9', '2-7', '0.238']
  ],
  // Wrestling example with divisions: Columns A, C, E, F, I
  'wrestling': [
    ['School', 'Mascot', 'Division', 'Record', 'Conf Pct', 'Overall', 'Bonus', 'Pins', 'Overall Pct'],
    ['Clarion', 'Golden Eagles', 'East', '4-1', '0.800', '9-5', '42', '14', '0.643'],
    ['Rider', 'Broncs', 'East', '4-1', '0.800', '8-5', '35', '12', '0.615'],
    ['George Mason', 'Patriots', 'East', '3-2', '0.600', '7-7', '32', '9', '0.500'],
    ['Lock Haven', 'Bald Eagles', 'East', '2-3', '0.400', '6-8', '28', '8', '0.429'],
    ['Cleveland State', 'Vikings', 'East', '1-4', '0.200', '4-9', '19', '6', '0.308'],
    ['Bloomsburg', 'Huskies', 'East', '1-4', '0.200', '3-10', '15', '5', '0.231'],
    ['Central Michigan', 'Chippewas', 'West', '5-0', '1.000', '12-2', '56', '23', '0.857'],
    ['Northern Illinois', 'Huskies', 'West', '4-1', '0.800', '10-4', '48', '18', '0.714'],
    ['Ohio', 'Bobcats', 'West', '3-2', '0.600', '8-6', '35', '15', '0.571'],
    ['Kent State', 'Golden Flashes', 'West', '2-3', '0.400', '6-8', '26', '9', '0.429'],
    ['SIU Edwardsville', 'Cougars', 'West', '1-4', '0.200', '4-10', '18', '7', '0.286'],
    ['Buffalo', 'Bulls', 'West', '0-5', '0.000', '2-12', '12', '4', '0.143']
  ]
};

/**
 * Root endpoint for standings
 * GET /api/sheets/standings/
 */
router.get('/standings', (req: Request, res: Response) => {
  return res.json({
    success: true,
    message: 'Please select a sport to view standings',
    data: []
  });
});

/**
 * Get standings for a specific sport from Google Sheets or MAC website
 * GET /api/sheets/standings/:sportId
 */
router.get('/standings/:sportId', async (req: Request, res: Response) => {
  try {
    const { sportId } = req.params;
    
    console.log(`Fetching ${sportId} standings from MAC website`);
    
    // First: Try to get data from Google Sheets (mock data for now)
    // In a production environment, you would fetch this data from an actual Google Sheet
    // using the Google Sheets API with proper authentication
    let standings: StandingsEntry[] = [];
    
    if (mockGoogleSheetData[sportId]) {
      // Process the Google Sheet data with our new method
      standings = googleSheetsService.processGoogleSheetData(sportId, mockGoogleSheetData[sportId]);
      console.log(`Successfully processed ${standings.length} standings entries from Google Sheets`);
    }
    
    // Second: If no Google Sheet data, try to get data from the MAC website
    if (standings.length === 0) {
      let macSportId = sportId;
      if (sportId === 'mbball') {
        macSportId = 'mbball';
      } else if (sportId === 'wbball') {
        macSportId = 'wbball';
      }
      
      console.log(`No Google Sheet data found, fetching from MAC website instead`);
      standings = await googleSheetsService.fetchStandings(macSportId);
    }
    
    // Third: If we still have no data, use our backup data if available
    if (standings.length === 0) {
      if (backupStandings[sportId]) {
        console.log(`No data returned from sources. Using backup data for ${sportId}`);
        standings = backupStandings[sportId];
      } else {
        // No backup data available, generate some data for this sport
        console.log(`No data or backup available for ${sportId}. Generating fallback data.`);
        standings = generateStandingsForSport(sportId);
      }
    }
    
    return res.json({
      success: true,
      data: standings,
      count: standings.length,
      message: `Successfully fetched ${standings.length} standings entries for ${sportId}`
    });
  } catch (error) {
    console.error('Error fetching standings from data sources:', error);
    
    // On error, check if we have backup data for this sport
    const sportId = req.params.sportId;
    let standings: StandingsEntry[] = [];
    
    if (backupStandings[sportId]) {
      console.log(`Error with data sources. Using backup data for ${sportId}`);
      standings = backupStandings[sportId];
    } else {
      // Generate data for this sport since no backup is available
      console.log(`Error with data sources. Generating fallback data for ${sportId}`);
      standings = generateStandingsForSport(sportId);
    }
    
    return res.json({
      success: true,
      data: standings,
      count: standings.length,
      message: `Retrieved ${standings.length} standings entries for ${sportId}`
    });
  }
});

export default router;