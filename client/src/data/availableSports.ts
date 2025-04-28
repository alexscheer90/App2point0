// This file defines the sports that have standing data available in the Google Sheet
// Based on the Google Sheet: https://docs.google.com/spreadsheets/d/1Vq8UJeuIxVBwYKIJKOlFvZY2ITrApOvgMKhgjvoCmTs/

// List of sports that have tabs in the Google Sheet
// These are the 13 sports that have standings tabs as specified by the client
export const SPORTS_WITH_STANDINGS = [
  'baseball',     // Baseball
  'mbball',       // Men's Basketball  
  'football',     // Football
  'mtennis',      // Men's Tennis
  'wrestling',    // Wrestling
  'wbball',       // Women's Basketball
  'field-hockey', // Field Hockey
  'gymnastics',   // Gymnastics
  'wlacrosse',    // Women's Lacrosse (also wlax)
  'wlax',         // Women's Lacrosse alias
  'wsoccer',      // Women's Soccer (also wsoc)
  'wsoc',         // Women's Soccer alias
  'softball',     // Softball
  'wtennis',      // Women's Tennis
  'volleyball',   // Volleyball (also wvball)
  'wvball'        // Volleyball alias
];

// Function to check if a sport has standings data
export function hasSportStandings(sportId: string): boolean {
  return SPORTS_WITH_STANDINGS.includes(sportId);
}