import express from 'express';
import { log } from '../vite';
import { Game } from '@shared/schema';
import { unifiedDataService } from '../services/unifiedDataService';
import axios from 'axios';

const router = express.Router();

// Get live stats for a specific game
router.get('/games/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    
    // Temporary: get game from our API directly
    let game: Game | null = null;
    try {
      const response = await axios.get(`/api/games/${gameId}`);
      game = response.data;
    } catch (error) {
      log(`Game not found: ${gameId}`, 'livestats');
    }
    
    if (!game) {
      return res.status(404).json({ 
        success: false, 
        message: 'Game not found' 
      });
    }
    
    // If game is not live, just return the basic game info
    if (game.status !== 'live') {
      return res.json({
        success: true,
        data: game,
        source: 'mac', // Basic MAC calendar data
        liveFeedAvailable: false
      });
    }
    
    // For live games, try to get enhanced stats from the best source
    const homeSchoolId = game.homeTeamId || '';
    const sportId = game.sportId || '';
    
    const enhancedData = await unifiedDataService.getGameData(gameId, homeSchoolId, sportId);
    const dataSource = unifiedDataService.getGameDataSource(gameId);
    
    if (enhancedData) {
      res.json({
        success: true,
        data: enhancedData,
        source: dataSource,
        liveFeedAvailable: true
      });
    } else {
      // Fall back to basic game info if no enhanced data
      res.json({
        success: true,
        data: game,
        source: 'mac',
        liveFeedAvailable: false
      });
    }
  } catch (error) {
    log(`Error fetching live stats: ${error}`, 'livestats');
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching live stats'
    });
  }
});

// Check which data sources are available for a game
router.get('/availability/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    
    // Temporary: get game from our API directly
    let game: Game | null = null;
    try {
      const response = await axios.get(`/api/games/${gameId}`);
      game = response.data;
    } catch (error) {
      log(`Game not found: ${gameId}`, 'livestats');
    }
    
    if (!game) {
      return res.status(404).json({ 
        success: false, 
        message: 'Game not found' 
      });
    }
    
    const homeSchoolId = game.homeTeamId || '';
    const sportId = game.sportId || '';
    
    // Check SIDEARM availability
    const sidearmAvailable = await unifiedDataService.checkDataSourceAvailability(
      'sidearm', homeSchoolId, sportId, gameId
    );
    
    // Check ESPN availability - for now we'll assume always true
    // but in the future we could check ESPN API for this specific game
    const espnAvailable = true;
    
    res.json({
      success: true,
      data: {
        gameId,
        sidearmAvailable,
        espnAvailable,
        recommendedSource: sidearmAvailable ? 'sidearm' : 'espn'
      }
    });
  } catch (error) {
    log(`Error checking data availability: ${error}`, 'livestats');
    res.status(500).json({
      success: false,
      message: 'Error checking data availability'
    });
  }
});

export default router;