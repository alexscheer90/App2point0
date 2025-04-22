import { Game } from '@shared/schema';
import { log } from '../vite';
import axios from 'axios';
import { checkSidearmAvailability, fetchSidearmGameData } from './sidearmService';

// Track which data source is being used for each game
interface GameDataSource {
  gameId: string;
  source: 'espn' | 'sidearm' | 'mac';
  lastUpdated: Date;
}

export class UnifiedDataService {
  private dataSources: Map<string, GameDataSource> = new Map();
  
  /**
   * Check if a specific data source is available for a game
   */
  async checkDataSourceAvailability(
    source: 'espn' | 'sidearm' | 'mac',
    schoolId: string,
    sportId: string,
    gameId?: string
  ): Promise<boolean> {
    switch (source) {
      case 'sidearm':
        return await checkSidearmAvailability(schoolId, sportId);
        
      case 'espn':
        // For now, we'll assume ESPN is always available
        // In the future, we could check if the specific game exists in ESPN's API
        return true;
        
      case 'mac':
        // MAC calendar should always be available for our games
        return true;
        
      default:
        return false;
    }
  }
  
  /**
   * Get game data from the best available source
   */
  async getGameData(gameId: string, schoolId: string, sportId: string): Promise<Partial<Game> | null> {
    try {
      // Check if we already know which source to use for this game
      const existingSource = this.dataSources.get(gameId);
      
      if (existingSource) {
        // If we've recently checked for this game, use the known source
        if (new Date().getTime() - existingSource.lastUpdated.getTime() < 5 * 60 * 1000) { // 5 minutes
          return this.fetchFromSource(gameId, schoolId, sportId, existingSource.source);
        }
      }
      
      // Check if SIDEARM stats are available for this school/sport
      const sidearmAvailable = await this.checkDataSourceAvailability('sidearm', schoolId, sportId, gameId);
      
      if (sidearmAvailable) {
        // SIDEARM is available, use it as our primary source
        log(`Using SIDEARM data for game ${gameId}`, 'unified');
        
        this.dataSources.set(gameId, {
          gameId,
          source: 'sidearm',
          lastUpdated: new Date()
        });
        
        return this.fetchFromSource(gameId, schoolId, sportId, 'sidearm');
      } else {
        // Fall back to ESPN
        log(`Using ESPN data for game ${gameId}`, 'unified');
        
        this.dataSources.set(gameId, {
          gameId,
          source: 'espn',
          lastUpdated: new Date()
        });
        
        return this.fetchFromSource(gameId, schoolId, sportId, 'espn');
      }
    } catch (error) {
      log(`Error getting unified game data: ${error}`, 'unified');
      return null;
    }
  }
  
  /**
   * Fetch data from the specified source
   */
  private async fetchFromSource(
    gameId: string,
    schoolId: string,
    sportId: string,
    source: 'espn' | 'sidearm' | 'mac'
  ): Promise<Partial<Game> | null> {
    try {
      switch (source) {
        case 'sidearm':
          return await fetchSidearmGameData(schoolId, sportId, gameId);
          
        case 'espn':
          // For now, we'll just use our existing API endpoint
          // In the future, we could implement a direct ESPN API call here
          const response = await axios.get(`/api/games/${gameId}`);
          return response.data;
          
        case 'mac':
          // Fetch from MAC calendar API
          const macResponse = await axios.get(`/api/mac-calendar/games/${gameId}`);
          return macResponse.data;
          
        default:
          return null;
      }
    } catch (error) {
      log(`Error fetching from ${source}: ${error}`, 'unified');
      return null;
    }
  }
  
  /**
   * Get the data source being used for a game
   */
  getGameDataSource(gameId: string): 'espn' | 'sidearm' | 'mac' | undefined {
    const source = this.dataSources.get(gameId);
    return source?.source;
  }
}

// Export a singleton instance
export const unifiedDataService = new UnifiedDataService();