import { Game } from '@shared/schema';
import { log } from '../vite';
import axios from 'axios';

class GameScheduleService {
  private games: Map<string, Game> = new Map();
  
  /**
   * Initialize the service and load available game data
   */
  async initialize(): Promise<void> {
    try {
      // Load game data from the MAC calendar API
      await this.loadMacCalendarGames();
      
      log(`GameScheduleService initialized with ${this.games.size} games`, 'gameSchedule');
    } catch (error) {
      log(`Error initializing game schedule service: ${error}`, 'gameSchedule');
    }
  }
  
  /**
   * Load MAC calendar games into memory
   */
  private async loadMacCalendarGames(): Promise<void> {
    try {
      // In a real implementation, we'd fetch this from our MAC calendar API
      // For now, we'll initialize with an empty set to be populated later
    } catch (error) {
      log(`Error loading MAC calendar games: ${error}`, 'gameSchedule');
    }
  }
  
  /**
   * Get a game by ID
   */
  async getGameById(gameId: string): Promise<Game | null> {
    // Check if we have it in memory
    if (this.games.has(gameId)) {
      return this.games.get(gameId) || null;
    }
    
    try {
      // If not in memory, try to fetch it from API
      const response = await axios.get(`/api/games/${gameId}`);
      
      if (response.data) {
        const game = response.data;
        this.games.set(gameId, game);
        return game;
      }
    } catch (error) {
      log(`Error fetching game ${gameId}: ${error}`, 'gameSchedule');
    }
    
    return null;
  }
  
  /**
   * Get games for today
   */
  async getTodaysGames(): Promise<Game[]> {
    try {
      // Get today's date in YYYY-MM-DD format
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      
      // Fetch games for today
      const response = await axios.get(`/api/games?date=${dateString}`);
      
      if (response.data && Array.isArray(response.data)) {
        // Store games in memory for faster access
        response.data.forEach((game: Game) => {
          this.games.set(game.id, game);
        });
        
        return response.data;
      }
    } catch (error) {
      log(`Error fetching today's games: ${error}`, 'gameSchedule');
    }
    
    return [];
  }
  
  /**
   * Update a game in memory (e.g., after receiving score updates)
   */
  updateGame(gameId: string, gameData: Partial<Game>): void {
    // Get existing game
    const existingGame = this.games.get(gameId);
    
    if (existingGame) {
      // Merge the updates into the existing game
      const updatedGame = { ...existingGame, ...gameData };
      this.games.set(gameId, updatedGame as Game);
    }
  }
}

// Export a singleton instance
export const gameScheduleService = new GameScheduleService();