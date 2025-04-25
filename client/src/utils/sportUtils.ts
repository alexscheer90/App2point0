import { Game } from "@shared/schema";

// MAC colors
export const MAC_NAVY = "#0B213E";
export const MAC_GREEN = "#019E4F";
export const MAC_GRAY = "#9DA5A8";

// Function to categorize games by sport
export const groupGamesBySport = (games: Game[]): Record<string, Game[]> => {
  const sportGroups: Record<string, Game[]> = {};
  
  games.forEach(game => {
    const sportName = getSportDisplayName(game.sportId || '');
    if (!sportGroups[sportName]) {
      sportGroups[sportName] = [];
    }
    sportGroups[sportName].push(game);
  });
  
  // Sort sports alphabetically
  return Object.keys(sportGroups)
    .sort()
    .reduce((obj, key) => {
      obj[key] = sportGroups[key];
      return obj;
    }, {} as Record<string, Game[]>);
};

// Function to get sport display name from sport ID
export const getSportDisplayName = (sportId: string): string => {
  // Normalize the sport ID for consistent matching
  const normalizedId = sportId?.toLowerCase().trim() || '';
  
  // Handle men's and women's basketball IDs (both genders exist in MAC)
  if (normalizedId === 'mbball' || normalizedId === 'm-basketball' || 
    (normalizedId.includes('basketball') && normalizedId.includes('men'))) {
    return "Men's Basketball";
  }
  
  if (normalizedId === 'wbball' || normalizedId === 'w-basketball' || 
    (normalizedId.includes('basketball') && normalizedId.includes('women'))) {
    return "Women's Basketball";
  }
  
  // Generic basketball (need specific gender)
  if (normalizedId === 'basketball' || normalizedId.includes('basketball')) {
    return "Basketball";
  }
  
  // Handle sports with no gender specification needed (only one gender in the MAC)
  if (normalizedId === 'football' || normalizedId.includes('football')) return 'Football';
  if (normalizedId === 'baseball' || normalizedId.includes('baseball')) return 'Baseball';
  if (normalizedId === 'softball' || normalizedId.includes('softball')) return 'Softball';
  if (normalizedId === 'volleyball' || normalizedId.includes('volleyball')) return 'Volleyball';
  
  // Handle lacrosse - only women's lacrosse in MAC, but the data might include "Women's" in the name
  if (normalizedId === 'wlacrosse' || normalizedId === 'w-lacrosse' || 
      (normalizedId.includes('lacrosse') && normalizedId.includes('women'))) {
    return "Women's Lacrosse";
  }
  
  if (normalizedId === 'lacrosse' || normalizedId.includes('lacrosse')) {
    return "Women's Lacrosse"; // All MAC lacrosse is women's
  }
  
  // Soccer - primarily women's in MAC
  if (normalizedId === 'wsoccer' || normalizedId === 'w-soccer' || 
      (normalizedId.includes('soccer') && normalizedId.includes('women'))) {
    return "Women's Soccer";
  }
  
  if (normalizedId === 'msoccer' || normalizedId === 'm-soccer' || 
      (normalizedId.includes('soccer') && normalizedId.includes('men'))) {
    return "Men's Soccer";
  }
  
  if (normalizedId === 'soccer' || normalizedId.includes('soccer')) {
    return "Women's Soccer"; // Default to women's soccer for MAC
  }
  
  // Field Hockey - only women's in MAC
  if (normalizedId === 'fieldhockey' || normalizedId.includes('field-hockey')) {
    return "Field Hockey";
  }
  
  // Swimming & Diving
  if (normalizedId === 'mswimming' || normalizedId === 'm-swimming' || normalizedId === 'mswim' || 
      (normalizedId.includes('swimming') && normalizedId.includes('men'))) {
    return "Men's Swimming & Diving";
  }
  
  if (normalizedId === 'wswimming' || normalizedId === 'w-swimming' || normalizedId === 'wswim' || 
      (normalizedId.includes('swimming') && normalizedId.includes('women'))) {
    return "Women's Swimming & Diving";
  }
  
  if (normalizedId === 'swimming' || normalizedId.includes('swimming') || normalizedId.includes('swim')) {
    return "Swimming & Diving";
  }
  
  // Tennis
  if (normalizedId === 'mtennis' || normalizedId === 'm-tennis' || 
      (normalizedId.includes('tennis') && normalizedId.includes('men'))) {
    return "Men's Tennis";
  }
  
  if (normalizedId === 'wtennis' || normalizedId === 'w-tennis' || 
      (normalizedId.includes('tennis') && normalizedId.includes('women'))) {
    return "Women's Tennis";
  }
  
  if (normalizedId === 'tennis' || normalizedId.includes('tennis')) {
    return "Tennis";
  }
  
  // Golf
  if (normalizedId === 'mgolf' || normalizedId === 'm-golf' || 
      (normalizedId.includes('golf') && normalizedId.includes('men'))) {
    return "Men's Golf";
  }
  
  if (normalizedId === 'wgolf' || normalizedId === 'w-golf' || 
      (normalizedId.includes('golf') && normalizedId.includes('women'))) {
    return "Women's Golf";
  }
  
  if (normalizedId === 'golf' || normalizedId.includes('golf')) {
    return "Golf";
  }
  
  // Track & Field and Cross Country
  if (normalizedId === 'mtrack' || normalizedId === 'm-track' || 
      (normalizedId.includes('track') && normalizedId.includes('men'))) {
    return "Men's Track & Field";
  }
  
  if (normalizedId === 'wtrack' || normalizedId === 'w-track' || 
      (normalizedId.includes('track') && normalizedId.includes('women'))) {
    return "Women's Track & Field";
  }
  
  if (normalizedId === 'track' || normalizedId.includes('track')) {
    return "Track & Field";
  }
  
  if (normalizedId === 'mcrosscountry' || normalizedId === 'm-crosscountry' || 
      (normalizedId.includes('cross') && normalizedId.includes('men'))) {
    return "Men's Cross Country";
  }
  
  if (normalizedId === 'wcrosscountry' || normalizedId === 'w-crosscountry' || 
      (normalizedId.includes('cross') && normalizedId.includes('women'))) {
    return "Women's Cross Country";
  }
  
  if (normalizedId === 'crosscountry' || normalizedId.includes('cross')) {
    return "Cross Country";
  }
  
  // Wrestling - only men's in MAC
  if (normalizedId === 'wrestling' || normalizedId.includes('wrestling')) {
    return "Wrestling";
  }
  
  // Gymnastics - only women's in MAC
  if (normalizedId === 'gymnastics' || normalizedId.includes('gymnastics')) {
    return "Women's Gymnastics";
  }
  
  // Special case for games labeled as 'unknown'
  if (normalizedId === 'unknown') {
    // Based on our analysis, games marked as unknown in April are usually women's lacrosse
    return "Women's Lacrosse";
  }
  
  // For other empty or unknown values, return a generic name
  return sportId || "Other Sports";
};

// Function to get the color style for a sport badge
export const getSportBadgeStyle = (sportId: string): string => {
  // Normalize the sport ID for consistent matching
  const normalizedId = sportId?.toLowerCase().trim() || '';
  
  // Football - Blue
  if (normalizedId === 'football' || normalizedId.includes('football')) {
    return 'bg-blue-50 text-blue-800 border-blue-200';
  }
  
  // Men's Basketball - Orange
  if (normalizedId === 'mbball' || normalizedId === 'm-basketball' || 
      (normalizedId.includes('basketball') && normalizedId.includes('men'))) {
    return 'bg-orange-50 text-orange-800 border-orange-200';
  }
  
  // Women's Basketball - Hot Pink
  if (normalizedId === 'wbball' || normalizedId === 'w-basketball' || 
      (normalizedId.includes('basketball') && normalizedId.includes('women'))) {
    return 'bg-pink-50 text-pink-800 border-pink-200';
  }
  
  // Baseball - Forest Green
  if (normalizedId === 'baseball' || normalizedId.includes('baseball')) {
    return 'bg-green-50 text-green-800 border-green-200';
  }
  
  // Softball - Yellow/Gold
  if (normalizedId === 'softball' || normalizedId.includes('softball')) {
    return 'bg-yellow-50 text-yellow-800 border-yellow-200';
  }
  
  // Volleyball - Lavender/Purple
  if (normalizedId === 'volleyball' || normalizedId.includes('volleyball')) {
    return 'bg-purple-50 text-purple-800 border-purple-200';
  }
  
  // Men's Soccer - Emerald Green (darker)
  if (normalizedId === 'msoccer' || normalizedId === 'm-soccer' || 
      (normalizedId.includes('soccer') && normalizedId.includes('men'))) {
    return 'bg-emerald-100 text-emerald-900 border-emerald-300';
  }
  
  // Women's Soccer - Light Green
  if (normalizedId === 'wsoccer' || normalizedId === 'w-soccer' || 
      (normalizedId.includes('soccer') && normalizedId.includes('women')) ||
      normalizedId === 'soccer') {
    return 'bg-emerald-50 text-emerald-800 border-emerald-200';
  }
  
  // Field Hockey - Lime Green
  if (normalizedId === 'fieldhockey' || normalizedId.includes('field-hockey')) {
    return 'bg-lime-50 text-lime-800 border-lime-200';
  }
  
  // Men's Tennis - Sky Blue
  if (normalizedId === 'mtennis' || normalizedId === 'm-tennis' || 
      (normalizedId.includes('tennis') && normalizedId.includes('men'))) {
    return 'bg-sky-100 text-sky-800 border-sky-300';
  }
  
  // Women's Tennis - Light Blue
  if (normalizedId === 'wtennis' || normalizedId === 'w-tennis' || 
      (normalizedId.includes('tennis') && normalizedId.includes('women'))) {
    return 'bg-sky-50 text-sky-800 border-sky-200';
  }
  
  // Consolidated Tennis (no gender) - Sky Blue
  if (normalizedId === 'tennis' || normalizedId.includes('tennis')) {
    return 'bg-sky-50 text-sky-800 border-sky-200';
  }
  
  // Wrestling - Stone Gray
  if (normalizedId === 'wrestling' || normalizedId.includes('wrestling')) {
    return 'bg-stone-50 text-stone-800 border-stone-200';
  }
  
  // Women's Lacrosse - Violet
  if (normalizedId === 'wlacrosse' || normalizedId === 'w-lacrosse' || 
      normalizedId === 'lacrosse' || normalizedId.includes('lacrosse')) {
    return 'bg-violet-50 text-violet-800 border-violet-200';
  }
  
  // Men's Golf - Deep Teal (darker)
  if (normalizedId === 'mgolf' || normalizedId === 'm-golf' || 
      (normalizedId.includes('golf') && normalizedId.includes('men'))) {
    return 'bg-teal-100 text-teal-900 border-teal-300';
  }
  
  // Women's Golf - Light Teal
  if (normalizedId === 'wgolf' || normalizedId === 'w-golf' || 
      (normalizedId.includes('golf') && normalizedId.includes('women'))) {
    return 'bg-teal-50 text-teal-800 border-teal-200';
  }
  
  // Consolidated Golf (no gender) - Teal
  if (normalizedId === 'golf' || normalizedId.includes('golf')) {
    return 'bg-teal-50 text-teal-800 border-teal-200';
  }
  
  // Men's Swimming - Deep Cyan (darker)
  if (normalizedId === 'mswimming' || normalizedId === 'm-swimming' || normalizedId === 'mswim' || 
      (normalizedId.includes('swimming') && normalizedId.includes('men'))) {
    return 'bg-cyan-100 text-cyan-900 border-cyan-300';
  }
  
  // Women's Swimming - Light Cyan
  if (normalizedId === 'wswimming' || normalizedId === 'w-swimming' || normalizedId === 'wswim' || 
      (normalizedId.includes('swimming') && normalizedId.includes('women'))) {
    return 'bg-cyan-50 text-cyan-800 border-cyan-200';
  }
  
  // Consolidated Swimming (no gender) - Cyan
  if (normalizedId === 'swimming' || normalizedId.includes('swimming') || normalizedId.includes('swim')) {
    return 'bg-cyan-50 text-cyan-800 border-cyan-200';
  }
  
  // Women's Gymnastics - Rose
  if (normalizedId === 'gymnastics' || normalizedId.includes('gymnastics')) {
    return 'bg-rose-50 text-rose-800 border-rose-200';
  }
  
  // Men's Cross Country/Track - Deep Indigo (darker)
  if ((normalizedId === 'mtrack' || normalizedId === 'm-track' || 
      (normalizedId.includes('track') && normalizedId.includes('men'))) ||
      (normalizedId === 'mcrosscountry' || normalizedId === 'm-crosscountry' || 
      (normalizedId.includes('cross') && normalizedId.includes('men')))) {
    return 'bg-indigo-100 text-indigo-900 border-indigo-300';
  }
  
  // Women's Cross Country/Track - Light Indigo
  if ((normalizedId === 'wtrack' || normalizedId === 'w-track' || 
      (normalizedId.includes('track') && normalizedId.includes('women'))) || 
      (normalizedId === 'wcrosscountry' || normalizedId === 'w-crosscountry' || 
      (normalizedId.includes('cross') && normalizedId.includes('women')))) {
    return 'bg-indigo-50 text-indigo-800 border-indigo-200';
  }
  
  // Consolidated Track/Cross Country (no gender) - Indigo
  if (normalizedId === 'track' || normalizedId.includes('track') ||
      normalizedId === 'crosscountry' || normalizedId.includes('cross')) {
    return 'bg-indigo-50 text-indigo-800 border-indigo-200';
  }
  
  // Cross Country - Fuchsia
  if (normalizedId === 'crosscountry' || normalizedId.includes('cross-country')) {
    return 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200';
  }
  
  // Special case for unknown - map to women's lacrosse style (violet)
  if (normalizedId === 'unknown') {
    return 'bg-violet-50 text-violet-800 border-violet-200';
  }
  
  // Default style for other unknown sports
  return 'bg-gray-50 text-gray-800 border-gray-200';
};