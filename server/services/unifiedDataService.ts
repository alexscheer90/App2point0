import { log } from '../vite';
import axios from 'axios';
import { Game, GameStatus } from '@shared/schema';

/**
 * Service to handle unified game data from multiple sources
 * - ESPN API for general coverage
 * - SIDEARM for official school-provided statistics
 */
class UnifiedDataService {
  // Cache to track which data source is used for each game
  private gameDataSources: Map<string, 'espn' | 'sidearm' | 'mac'> = new Map();
  
  /**
   * Check if a specific data source is available for a game
   */
  async checkDataSourceAvailability(
    source: 'espn' | 'sidearm', 
    schoolId: string, 
    sportId: string, 
    gameId: string
  ): Promise<boolean> {
    try {
      if (source === 'sidearm') {
        return await this.checkSidearmAvailability(schoolId, sportId, gameId);
      } else if (source === 'espn') {
        // For now, we assume ESPN is always available for demonstration
        // In a production version, we would check the ESPN API for this specific game
        return true;
      }
      
      return false;
    } catch (error) {
      log(`Error checking ${source} availability: ${error}`, 'unifiedDataService');
      return false;
    }
  }
  
  /**
   * Check if SIDEARM stats are available for a specific game
   */
  private async checkSidearmAvailability(
    schoolId: string, 
    sportId: string, 
    gameId: string
  ): Promise<boolean> {
    // This is a simplified implementation
    // In a real app, we would check if the school uses SIDEARM
    // and if they have a live stats feed for this specific game
    
    // For now, let's check if the school is one we know uses SIDEARM
    // and if there's a known live stats URL pattern
    const sidearmSchools = [
      'bgsu', 'emu', 'kent', 'akron', 'ohiou', 'miamioh',
      'cmu', 'bsu', 'niu', 'toledo', 'wmu', 'buffalo', 'umass'
    ];
    
    // Simplified check
    return sidearmSchools.includes(schoolId);
  }
  
  /**
   * Get the best available game data from any source
   */
  async getGameData(
    gameId: string, 
    schoolId: string, 
    sportId: string
  ): Promise<Game | null> {
    // Check SIDEARM availability first (preferred source)
    const sidearmAvailable = await this.checkDataSourceAvailability(
      'sidearm', schoolId, sportId, gameId
    );
    
    if (sidearmAvailable) {
      try {
        const sidearmData = await this.getSidearmGameData(gameId, schoolId, sportId);
        if (sidearmData) {
          this.gameDataSources.set(gameId, 'sidearm');
          return sidearmData;
        }
      } catch (error) {
        log(`Error fetching SIDEARM data: ${error}`, 'unifiedDataService');
        // Continue to ESPN as fallback
      }
    }
    
    // Try ESPN as fallback or primary if SIDEARM isn't available
    try {
      const espnData = await this.getESPNGameData(gameId);
      if (espnData) {
        this.gameDataSources.set(gameId, 'espn');
        return espnData;
      }
    } catch (error) {
      log(`Error fetching ESPN data: ${error}`, 'unifiedDataService');
    }
    
    // If we get here, no data source was available
    return null;
  }
  
  /**
   * Get game data from SIDEARM source
   */
  private async getSidearmGameData(
    gameId: string, 
    schoolId: string, 
    sportId: string
  ): Promise<Game | null> {
    // This would be implemented to fetch from a SIDEARM live stats XML/JSON feed
    // For now, we'll just show a placeholder implementation
    
    log(`Fetching SIDEARM data for game ${gameId} from school ${schoolId}`, 'unifiedDataService');
    
    // In a real implementation, we would:
    // 1. Map the school to its SIDEARM domain
    // 2. Map the sport to the SIDEARM sport code
    // 3. Make an API call to the school's SIDEARM API
    // 4. Transform the data into our standard Game format
    
    // For demo purposes, we'll return null to fall back to ESPN
    return null;
  }
  
  /**
   * Get game data from ESPN source
   */
  private async getESPNGameData(gameId: string): Promise<Game | null> {
    // If the gameId starts with 'espn-', extract the ESPN ID
    if (!gameId.startsWith('espn-')) {
      log(`Game ID ${gameId} is not an ESPN game ID`, 'unifiedDataService');
      return null;
    }
    
    const espnId = gameId.replace('espn-', '');
    
    try {
      // Make a request to the ESPN API for this specific game
      const response = await axios.get(
        `https://site.api.espn.com/apis/site/v2/sports/events/${espnId}`
      );
      
      // Transform the ESPN data into our standard Game format
      const event = response.data;
      
      if (!event) {
        log(`No event data returned from ESPN for ID ${espnId}`, 'unifiedDataService');
        return null;
      }
      
      // Map ESPN status to our GameStatus
      const statusMap: Record<string, GameStatus> = {
        pre: 'scheduled',
        in: 'live',
        post: 'final'
      };
      
      const status = (statusMap[event.status.type.state] || 'scheduled') as GameStatus;
      
      // Build a Game object from ESPN data
      const game: Game = {
        id: `espn-${event.id}`,
        sportId: this.mapESPNSportToSportId(event.sport),
        status,
        startTime: event.date,
        homeTeamId: this.mapESPNTeamToSchoolId(event.competitions[0]?.competitors.find((c: any) => c.homeAway === 'home')?.team),
        awayTeamId: this.mapESPNTeamToSchoolId(event.competitions[0]?.competitors.find((c: any) => c.homeAway === 'away')?.team),
        homeTeamName: event.competitions[0]?.competitors.find((c: any) => c.homeAway === 'home')?.team.name,
        awayTeamName: event.competitions[0]?.competitors.find((c: any) => c.homeAway === 'away')?.team.name,
        homeTeamScore: parseInt(event.competitions[0]?.competitors.find((c: any) => c.homeAway === 'home')?.score) || 0,
        awayTeamScore: parseInt(event.competitions[0]?.competitors.find((c: any) => c.homeAway === 'away')?.score) || 0,
        venue: event.competitions[0]?.venue?.fullName,
        period: event.status.period,
        clock: event.status.displayClock,
        situation: this.extractGameSituation(event),
        links: this.extractESPNLinks(event),
        source: 'espn'
      };
      
      return game;
    } catch (error) {
      log(`Error fetching ESPN data for game ${espnId}: ${error}`, 'unifiedDataService');
      return null;
    }
  }
  
  /**
   * Extract the current game situation from ESPN data (e.g., "1st and 10 at the 25 yard line")
   */
  private extractGameSituation(event: any): string | null {
    // This would extract situation text from ESPN game data
    // Implementation depends on the sport and available data
    return event.situation?.summary || null;
  }
  
  /**
   * Extract relevant links from ESPN data
   */
  private extractESPNLinks(event: any): Record<string, string> | null {
    const links: Record<string, string> = {};
    
    // Extract any available links
    if (event.links && Array.isArray(event.links)) {
      for (const link of event.links) {
        if (link.rel === 'summary') {
          links.summary = link.href;
        } else if (link.rel === 'boxscore') {
          links.boxscore = link.href;
        } else if (link.rel === 'pbp') {
          links.playByPlay = link.href;
        }
      }
    }
    
    return Object.keys(links).length > 0 ? links : null;
  }
  
  /**
   * Map ESPN sport to our sportId
   */
  private mapESPNSportToSportId(espnSport: any): string {
    // Simple mapping from ESPN sport to our sportId
    const sportMap: Record<string, string> = {
      'football': 'football',
      'basketball': 'mens-basketball',
      'womens-basketball': 'womens-basketball',
      'baseball': 'baseball',
      'softball': 'softball',
      'soccer': 'mens-soccer',
      'womens-soccer': 'womens-soccer'
    };
    
    return sportMap[espnSport?.slug] || 'unknown';
  }
  
  /**
   * Map ESPN team to our schoolId
   */
  private mapESPNTeamToSchoolId(espnTeam: any): string | null {
    if (!espnTeam) return null;
    
    // Map ESPN team IDs to our schoolIds
    const teamMap: Record<string, string> = {
      '2050': 'akron',       // Akron
      '2084': 'bgsu',        // Bowling Green
      '2086': 'buffalo',     // Buffalo
      '2117': 'cmu',         // Central Michigan
      '2199': 'emu',         // Eastern Michigan
      '2309': 'kent',        // Kent State
      '193': 'miamioh',      // Miami (OH)
      '2459': 'niu',         // Northern Illinois
      '195': 'ohiou',        // Ohio
      '2649': 'toledo',      // Toledo
      '2711': 'wmu',         // Western Michigan
      '113': 'umass'         // UMass
    };
    
    return teamMap[espnTeam.id] || null;
  }
  
  /**
   * Get which data source was used for a game
   */
  getGameDataSource(gameId: string): 'espn' | 'sidearm' | 'mac' | null {
    return this.gameDataSources.get(gameId) || null;
  }
}

export const unifiedDataService = new UnifiedDataService();