/**
 * Configuration for school-specific data feeds
 * This maps each MAC school to their official SIDEARM stats feed URL
 */

interface SchoolFeedConfig {
  schoolId: string;
  name: string;
  sidearmBaseUrl?: string;
  espnTeamId?: string;
  primaryColor: string;
  secondaryColor: string;
}

const schoolFeeds: Record<string, SchoolFeedConfig> = {
  'akron': {
    schoolId: 'akron',
    name: 'Akron',
    sidearmBaseUrl: 'https://gozips.com/services/stats',
    espnTeamId: '2006',
    primaryColor: '#041E42',
    secondaryColor: '#A89968'
  },
  'ball-state': {
    schoolId: 'ball-state',
    name: 'Ball State',
    sidearmBaseUrl: 'https://ballstatesports.com/services/stats',
    espnTeamId: '2050',
    primaryColor: '#BA0C2F',
    secondaryColor: '#000000'
  },
  'bowling-green': {
    schoolId: 'bowling-green',
    name: 'Bowling Green',
    sidearmBaseUrl: 'https://bgsufalcons.com/services/stats',
    espnTeamId: '2084',
    primaryColor: '#FE5000',
    secondaryColor: '#4F2C1D'
  },
  'buffalo': {
    schoolId: 'buffalo',
    name: 'Buffalo',
    sidearmBaseUrl: 'https://ubbulls.com/services/stats',
    espnTeamId: '2084',
    primaryColor: '#005BBB',
    secondaryColor: '#000000'
  },
  'central-michigan': {
    schoolId: 'central-michigan',
    name: 'Central Michigan',
    sidearmBaseUrl: 'https://cmuchippewas.com/services/stats',
    espnTeamId: '2117',
    primaryColor: '#6A0032',
    secondaryColor: '#FFC82E'
  },
  'eastern-michigan': {
    schoolId: 'eastern-michigan',
    name: 'Eastern Michigan',
    sidearmBaseUrl: 'https://emueagles.com/services/stats',
    espnTeamId: '2199',
    primaryColor: '#006633',
    secondaryColor: '#FFFFFF'
  },
  'kent-state': {
    schoolId: 'kent-state',
    name: 'Kent State',
    sidearmBaseUrl: 'https://kentstatesports.com/services/stats',
    espnTeamId: '2309',
    primaryColor: '#002664',
    secondaryColor: '#EAAB00'
  },
  'miami-oh': {
    schoolId: 'miami-oh',
    name: 'Miami (OH)',
    sidearmBaseUrl: 'https://miamiredhawks.com/services/stats',
    espnTeamId: '193',
    primaryColor: '#B61E2E',
    secondaryColor: '#000000'
  },
  'northern-illinois': {
    schoolId: 'northern-illinois',
    name: 'Northern Illinois',
    sidearmBaseUrl: 'https://niuhuskies.com/services/stats',
    espnTeamId: '2459',
    primaryColor: '#CC0000',
    secondaryColor: '#000000'
  },
  'ohio': {
    schoolId: 'ohio',
    name: 'Ohio',
    sidearmBaseUrl: 'https://ohiobobcats.com/services/stats',
    espnTeamId: '195',
    primaryColor: '#00694E',
    secondaryColor: '#CDA077'
  },
  'toledo': {
    schoolId: 'toledo',
    name: 'Toledo',
    sidearmBaseUrl: 'https://utrockets.com/services/stats',
    espnTeamId: '2649',
    primaryColor: '#004C9E',
    secondaryColor: '#FFDC00'
  },
  'western-michigan': {
    schoolId: 'western-michigan',
    name: 'Western Michigan',
    sidearmBaseUrl: 'https://wmubroncos.com/services/stats',
    espnTeamId: '2711',
    primaryColor: '#6C4023',
    secondaryColor: '#B5A167'
  },
  'massachusetts': {
    schoolId: 'massachusetts',
    name: 'Massachusetts', 
    sidearmBaseUrl: 'https://umassathletics.com/services/stats',
    espnTeamId: '113',
    primaryColor: '#881C1C',
    secondaryColor: '#000000'
  }
};

/**
 * Get SIDEARM feed URL for a specific school and sport
 */
export function getSidearmFeedUrl(schoolId: string, sport: string): string | null {
  const school = schoolFeeds[schoolId];
  if (!school || !school.sidearmBaseUrl) {
    return null;
  }
  
  return `${school.sidearmBaseUrl}/${sport}/livestats`;
}

/**
 * Map a school name to its ID
 */
export function mapSchoolNameToId(name: string): string | null {
  const normalizedName = name.toLowerCase().trim();
  
  // Simple mapping for common variations
  const nameMap: Record<string, string> = {
    'akron': 'akron',
    'zips': 'akron',
    'ball state': 'ball-state',
    'ball st': 'ball-state',
    'cardinals': 'ball-state',
    'bowling green': 'bowling-green',
    'bgsu': 'bowling-green',
    'falcons': 'bowling-green',
    'buffalo': 'buffalo',
    'bulls': 'buffalo',
    'central michigan': 'central-michigan',
    'cmu': 'central-michigan',
    'chippewas': 'central-michigan',
    'eastern michigan': 'eastern-michigan',
    'emu': 'eastern-michigan',
    'eagles': 'eastern-michigan',
    'kent state': 'kent-state',
    'kent st': 'kent-state',
    'golden flashes': 'kent-state',
    'miami': 'miami-oh',
    'miami (oh)': 'miami-oh',
    'miami (ohio)': 'miami-oh',
    'redhawks': 'miami-oh',
    'northern illinois': 'northern-illinois',
    'niu': 'northern-illinois',
    'huskies': 'northern-illinois',
    'ohio': 'ohio',
    'bobcats': 'ohio',
    'toledo': 'toledo',
    'rockets': 'toledo',
    'western michigan': 'western-michigan',
    'wmu': 'western-michigan',
    'broncos': 'western-michigan',
    'massachusetts': 'massachusetts',
    'umass': 'massachusetts',
    'minutemen': 'massachusetts'
  };
  
  // Try direct lookup
  if (nameMap[normalizedName]) {
    return nameMap[normalizedName];
  }
  
  // Try to find a match in the school configs
  for (const [id, config] of Object.entries(schoolFeeds)) {
    if (config.name.toLowerCase() === normalizedName) {
      return id;
    }
  }
  
  // If no match found
  return null;
}

export default schoolFeeds;