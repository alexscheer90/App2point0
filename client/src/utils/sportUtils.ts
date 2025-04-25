// Function to get sport name and handle all variants of IDs
export const getSportName = (sportId: string): string => {
  // Normalize the sport ID for consistent matching
  const normalizedId = sportId.toLowerCase().trim();
  
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
  
  if (normalizedId === 'lacrosse' || normalizedId.includes('lacrosse')) return "Women's Lacrosse";
  
  // Soccer - men's and women's versions in MAC
  if (normalizedId === 'msoccer' || normalizedId === 'm-soccer' || 
    (normalizedId.includes('soccer') && normalizedId.includes('men'))) {
    return "Men's Soccer";
  }
  
  if (normalizedId === 'wsoccer' || normalizedId === 'w-soccer' || 
    (normalizedId.includes('soccer') && normalizedId.includes('women'))) {
    return "Soccer";  // Women's soccer referred to as just "Soccer"
  }
  
  // Generic soccer (assumes women's in MAC context)
  if (normalizedId === 'soccer' || normalizedId.includes('soccer')) {
    return "Soccer";
  }
  
  // Consolidated sports - combining men's and women's variants
  if (normalizedId === 'golf' || 
      normalizedId === 'mgolf' || 
      normalizedId === 'wgolf' ||
      normalizedId.includes('golf')) {
    return "Golf";
  }
  
  if (normalizedId === 'tennis' || 
      normalizedId === 'mtennis' || 
      normalizedId === 'wtennis' ||
      normalizedId.includes('tennis')) {
    return "Tennis";
  }
  
  if (normalizedId === 'swimming' || 
      normalizedId === 'mswim' || 
      normalizedId === 'wswim' ||
      normalizedId.includes('swimming') ||
      normalizedId.includes('swim')) {
    return "Swimming & Diving";
  }
  
  // Other sports
  if (normalizedId === 'fieldhockey' || normalizedId.includes('field-hockey')) return 'Field Hockey';
  if (normalizedId === 'wrestling' || normalizedId.includes('wrestling')) return 'Wrestling';
  if (normalizedId === 'track' || normalizedId.includes('track')) return 'Track & Field';
  if (normalizedId === 'crosscountry' || normalizedId.includes('cross-country')) return 'Cross Country';
  if (normalizedId === 'gymnastics' || normalizedId.includes('gymnastics')) return 'Gymnastics';
  if (normalizedId === 'rowing' || normalizedId.includes('rowing')) return 'Rowing';
  
  // Default formatting for unknown sports
  return sportId.charAt(0).toUpperCase() + sportId.slice(1);
};

// Function to get badge style based on sport
export const getSportBadgeStyle = (sportId: string): string => {
  // Normalize the sport ID for consistent matching
  const normalizedId = sportId.toLowerCase().trim();
  
  // Football - Amber
  if (normalizedId === 'football' || normalizedId.includes('football')) {
    return 'bg-amber-50 text-amber-800 border-amber-200';
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
  
  // Wrestling - Rich Red
  if (normalizedId === 'wrestling' || normalizedId.includes('wrestling')) {
    return 'bg-red-50 text-red-800 border-red-200';
  }
  
  // Swimming & Diving - Consolidated Blue Style
  if (normalizedId === 'swimming' || 
      normalizedId === 'mswim' || 
      normalizedId === 'wswim' || 
      normalizedId === 'm-swimming' || 
      normalizedId === 'w-swimming' ||
      normalizedId.includes('swimming') ||
      normalizedId.includes('swim')) {
    return 'bg-blue-50 text-blue-800 border-blue-200';
  }
  
  // Track & Field - Indigo
  if (normalizedId === 'track' || normalizedId.includes('track')) {
    return 'bg-indigo-50 text-indigo-800 border-indigo-200';
  }
  
  // Cross Country - Fuchsia
  if (normalizedId === 'crosscountry' || normalizedId.includes('cross-country')) {
    return 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200';
  }
  
  // Golf - Consolidated Teal Style
  if (normalizedId === 'golf' || 
      normalizedId === 'mgolf' || 
      normalizedId === 'wgolf' || 
      normalizedId === 'm-golf' || 
      normalizedId === 'w-golf' ||
      normalizedId.includes('golf')) {
    return 'bg-teal-50 text-teal-800 border-teal-200';
  }
  
  // Tennis - Consolidated Cyan Style 
  if (normalizedId === 'tennis' || 
      normalizedId === 'mtennis' || 
      normalizedId === 'wtennis' || 
      normalizedId === 'm-tennis' || 
      normalizedId === 'w-tennis' ||
      normalizedId.includes('tennis')) {
    return 'bg-cyan-50 text-cyan-800 border-cyan-200';
  }
  
  // Gymnastics - Rose
  if (normalizedId === 'gymnastics' || normalizedId.includes('gymnastics')) {
    return 'bg-rose-50 text-rose-800 border-rose-200';
  }
  
  // Women's Lacrosse - Violet
  if (normalizedId === 'wlacrosse' || normalizedId === 'w-lacrosse' || 
      normalizedId === 'lacrosse' || normalizedId.includes('lacrosse')) {
    return 'bg-violet-50 text-violet-800 border-violet-200';
  }
  
  // Rowing - Slate
  if (normalizedId === 'rowing' || normalizedId.includes('rowing')) {
    return 'bg-slate-50 text-slate-800 border-slate-200';
  }
  
  // Default style for unknown sports
  return 'bg-gray-50 text-gray-800 border-gray-200';
};