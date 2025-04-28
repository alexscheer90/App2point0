// This file defines the sports that have standing data available in the Google Sheet
// Based on the Google Sheet: https://docs.google.com/spreadsheets/d/1Vq8UJeuIxVBwYKIJKOlFvZY2ITrApOvgMKhgjvoCmTs/

// List of sports that have tabs in the Google Sheet
export const SPORTS_WITH_STANDINGS = [
  'baseball',    // Baseball
  'mbball',      // Men's Basketball
  'football',    // Football
  'mtennis',     // Men's Tennis
  'wrestling',   // Wrestling
  'wbball',      // Women's Basketball
  'field-hockey', // Field Hockey
  'gymnastics',  // Gymnastics
  'wlacrosse',   // Women's Lacrosse
  'wsoccer',     // Women's Soccer (also wsoc)
  'wsoc',        // Women's Soccer alias
  'softball',    // Softball
  'wtennis',     // Women's Tennis
  'volleyball'   // Volleyball
];

// Function to check if a sport has standings data
export function hasSportStandings(sportId: string): boolean {
  return SPORTS_WITH_STANDINGS.includes(sportId);
}