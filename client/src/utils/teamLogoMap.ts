import { School } from "@shared/schema";

/**
 * Interface for non-MAC schools data
 */
export interface NonMacSchool {
  name: string;
  shortName: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  conference?: string;
}

/**
 * Mapping of team name variants to standard names.
 * This helps match different forms of team names to their standard format
 * for proper logo and color selection.
 */
export const SCHOOL_NAME_MAPPINGS: Record<string, string> = {
  // MAC Schools
  "Akron": "Akron",
  "Zips": "Akron",
  "UA": "Akron",
  
  "Ball State": "Ball State",
  "Cardinals": "Ball State",
  "BSU": "Ball State",
  
  "Bowling Green": "Bowling Green",
  "Bowling Green State": "Bowling Green",
  "BGSU": "Bowling Green",
  "Falcons": "Bowling Green",
  
  "Buffalo": "Buffalo",
  "UB": "Buffalo",
  "Bulls": "Buffalo",
  
  "Central Michigan": "Central Michigan",
  "CMU": "Central Michigan",
  "Chippewas": "Central Michigan",
  
  "Eastern Michigan": "Eastern Michigan",
  "EMU": "Eastern Michigan",
  "Eagles": "Eastern Michigan",
  
  "Kent State": "Kent State",
  "KSU": "Kent State",
  "Golden Flashes": "Kent State",
  "Flashes": "Kent State",
  
  "Miami": "Miami (OH)",
  "Miami (OH)": "Miami (OH)",
  "Miami Ohio": "Miami (OH)",
  "Miami University": "Miami (OH)",
  "Miami (Ohio)": "Miami (OH)",
  "Miami RedHawks": "Miami (OH)",
  "RedHawks": "Miami (OH)",
  "MU": "Miami (OH)",
  
  "Northern Illinois": "Northern Illinois",
  "NIU": "Northern Illinois",
  "Huskies": "Northern Illinois",
  
  "Ohio": "Ohio",
  "OU": "Ohio",
  "Bobcats": "Ohio",
  
  "Toledo": "Toledo",
  "UT": "Toledo",
  "Rockets": "Toledo",
  
  "Western Michigan": "Western Michigan",
  "WMU": "Western Michigan",
  "Broncos": "Western Michigan",
  
  // MAC Affiliate Members
  "Massachusetts": "Massachusetts",
  "UMass": "Massachusetts",
  "Minutemen": "Massachusetts",
  
  "Missouri State": "Missouri State",
  "MSU Bears": "Missouri State",
  "Bears": "Missouri State",
  
  "Evansville": "Evansville",
  "Purple Aces": "Evansville",
  
  "SIUE": "SIU Edwardsville",
  "SIU Edwardsville": "SIU Edwardsville",
  "Southern Illinois Edwardsville": "SIU Edwardsville",
  "Edwardsville": "SIU Edwardsville",
  
  "Bellarmine": "Bellarmine",
  "Knights": "Bellarmine",
  
  "Chicago State": "Chicago State",
  "CSU": "Chicago State",
  "Cougars": "Chicago State",
  
  "Youngstown State": "Youngstown State",
  "YSU": "Youngstown State",
  "Penguins": "Youngstown State",
  
  "Appalachian State": "Appalachian State",
  "App State": "Appalachian State",
  "Mountaineers": "Appalachian State",
  
  "Old Dominion": "Old Dominion",
  "ODU": "Old Dominion",
  "Monarchs": "Old Dominion",
  
  "Cleveland State": "Cleveland State",
  "CSU": "Cleveland State",
  "Vikings": "Cleveland State",
  
  "IUPUI": "IUPUI",
  "Indiana University–Purdue University Indianapolis": "IUPUI",
  "Jaguars": "IUPUI",
  
  "Detroit Mercy": "Detroit Mercy",
  "Detroit": "Detroit Mercy",
  "UDM": "Detroit Mercy",
  "Titans": "Detroit Mercy",
  
  "Robert Morris": "Robert Morris",
  "RMU": "Robert Morris",
  "Colonials": "Robert Morris",
  
  "Oakland": "Oakland",
  "OU": "Oakland",
  "Golden Grizzlies": "Oakland",
  
  "Wright State": "Wright State",
  "WSU": "Wright State",
  "Raiders": "Wright State",
  
  "Milwaukee": "Milwaukee",
  "UWM": "Milwaukee",
  "Panthers": "Milwaukee",
  
  "Longwood": "Longwood",
  "Lancers": "Longwood",
  
  "James Madison": "James Madison",
  "JMU": "James Madison",
  "Dukes": "James Madison",
  
  "USC Upstate": "USC Upstate",
  "South Carolina Upstate": "USC Upstate",
  "Spartans": "USC Upstate",
  
  "Gardner-Webb": "Gardner-Webb",
  "GWU": "Gardner-Webb",
  "Runnin' Bulldogs": "Gardner-Webb",
  
  "Wagner": "Wagner",
  "Seahawks": "Wagner",
  
  "North Texas": "North Texas",
  "UNT": "North Texas",
  "Mean Green": "North Texas",

  // Pennsylvania State Athletic Conference (PSAC) schools
  "Bloomsburg": "Bloomsburg",
  "Huskies": "Bloomsburg",
  
  "California (PA)": "California (PA)",
  "Cal U": "California (PA)",
  "Vulcans": "California (PA)",
  
  "Clarion": "Clarion",
  "Golden Eagles": "Clarion",
  
  "Edinboro": "Edinboro",
  "Fighting Scots": "Edinboro",
  
  "Gannon": "Gannon",
  "Golden Knights": "Gannon",
  
  "IUP": "Indiana (PA)",
  "Indiana (PA)": "Indiana (PA)",
  "Crimson Hawks": "Indiana (PA)",
  
  "Kutztown": "Kutztown",
  "Golden Bears": "Kutztown",
  
  "Lock Haven": "Lock Haven",
  "Bald Eagles": "Lock Haven",
  
  "Mansfield": "Mansfield",
  "Mountaineers": "Mansfield",
  
  "Mercyhurst": "Mercyhurst",
  "Lakers": "Mercyhurst",
  
  "Millersville": "Millersville",
  "Marauders": "Millersville",
  
  "Seton Hill": "Seton Hill",
  "Griffins": "Seton Hill",
  
  "Shepherd": "Shepherd",
  "Rams": "Shepherd",
  
  "Shippensburg": "Shippensburg",
  "Raiders": "Shippensburg",
  
  "Slippery Rock": "Slippery Rock",
  "The Rock": "Slippery Rock",
  "SRU": "Slippery Rock",
  
  "West Chester": "West Chester",
  "Golden Rams": "West Chester",
  
  // Big Ten Schools
  "Michigan": "Michigan",
  "UM": "Michigan",
  "Wolverines": "Michigan",
  
  "Michigan State": "Michigan State",
  "MSU": "Michigan State",
  "Spartans": "Michigan State",
  
  "Ohio State": "Ohio State",
  "OSU": "Ohio State",
  "Buckeyes": "Ohio State",
  
  "Penn State": "Penn State",
  "PSU": "Penn State",
  "Nittany Lions": "Penn State",
  
  "Indiana": "Indiana",
  "IU": "Indiana",
  "Hoosiers": "Indiana",
  
  "Purdue": "Purdue",
  "Boilermakers": "Purdue",
  
  "Illinois": "Illinois",
  "Fighting Illini": "Illinois",
  "Illini": "Illinois",
  
  "Northwestern": "Northwestern",
  "Wildcats": "Northwestern",
  
  "Iowa": "Iowa",
  "Hawkeyes": "Iowa",
  
  "Minnesota": "Minnesota",
  "Golden Gophers": "Minnesota",
  "Gophers": "Minnesota",
  
  "Wisconsin": "Wisconsin",
  "Badgers": "Wisconsin",
  
  "Nebraska": "Nebraska",
  "Cornhuskers": "Nebraska",
  "Huskers": "Nebraska",
  
  "Maryland": "Maryland",
  "Terrapins": "Maryland",
  "Terps": "Maryland",
  
  "Rutgers": "Rutgers",
  "Scarlet Knights": "Rutgers",
  
  // Other Major Conferences
  "Cincinnati": "Cincinnati",
  "UC": "Cincinnati",
  "Bearcats": "Cincinnati",
  
  "Kentucky": "Kentucky",
  "UK": "Kentucky",
  "Wildcats": "Kentucky",
  
  "Louisville": "Louisville",
  "UL": "Louisville",
  "Cardinals": "Louisville",
  
  "Pittsburgh": "Pittsburgh",
  "Pitt": "Pittsburgh",
  "Panthers": "Pittsburgh",
  
  "Syracuse": "Syracuse",
  "Orange": "Syracuse",
  
  "West Virginia": "West Virginia",
  "WVU": "West Virginia",
  "Mountaineers": "West Virginia",
  
  "Alabama": "Alabama",
  "Crimson Tide": "Alabama",
  
  "Auburn": "Auburn",
  "Tigers": "Auburn",
  
  "Florida": "Florida",
  "UF": "Florida",
  "Gators": "Florida",
  
  "Georgia": "Georgia",
  "UGA": "Georgia",
  "Bulldogs": "Georgia",
  
  "Tennessee": "Tennessee",
  "UT": "Tennessee",
  "Volunteers": "Tennessee",
  "Vols": "Tennessee"
  
  // Additional mappings can be added as needed
};

/**
 * Non-MAC schools data with their colors and logo information
 */
export const NON_MAC_SCHOOLS: Record<string, NonMacSchool> = {
  "Michigan": {
    name: "Michigan",
    shortName: "Michigan",
    primaryColor: "#00274C",
    secondaryColor: "#FFCB05",
    logoUrl: "/school-logos/non-mac/Michigan.png",
    conference: "Big Ten"
  },
  "Michigan State": {
    name: "Michigan State",
    shortName: "Michigan St",
    primaryColor: "#18453B",
    secondaryColor: "#FFFFFF",
    logoUrl: "/school-logos/non-mac/Michigan_State_Spartans_logo-300x300.png",
    conference: "Big Ten"
  },
  "Ohio State": {
    name: "Ohio State",
    shortName: "Ohio State",
    primaryColor: "#BB0000",
    secondaryColor: "#666666",
    logoUrl: "/school-logos/non-mac/ohiostate.png",
    conference: "Big Ten"
  },
  "Penn State": {
    name: "Penn State",
    shortName: "Penn St",
    primaryColor: "#041E42",
    secondaryColor: "#FFFFFF",
    logoUrl: "/school-logos/non-mac/Penn_State_Nittany_Lions_logo.svg.png",
    conference: "Big Ten"
  },
  "Maryland": {
    name: "Maryland",
    shortName: "Maryland",
    primaryColor: "#E03a3e",
    secondaryColor: "#FFD520",
    logoUrl: "/school-logos/non-mac/Maryland_Terrapins_logo-300x300.png",
    conference: "Big Ten"
  },
  "Bloomsburg": {
    name: "Bloomsburg",
    shortName: "Bloomsburg",
    primaryColor: "#8B2131",
    secondaryColor: "#231F20",
    logoUrl: "/school-logos/non-mac/Bloomsburg Huskies Logo-01.png",
    conference: "PSAC"
  },
  "Clarion": {
    name: "Clarion",
    shortName: "Clarion",
    primaryColor: "#00529B",
    secondaryColor: "#FFD320",
    logoUrl: "/school-logos/non-mac/Clarion_Golden_Eagles_logo.svg.png",
    conference: "PSAC"
  },
  "Edinboro": {
    name: "Edinboro",
    shortName: "Edinboro",
    primaryColor: "#AF1E2D",
    secondaryColor: "#000000",
    logoUrl: "/school-logos/non-mac/Edinboro_Fighting_Scots_current_logo.svg.png",
    conference: "PSAC"
  },
  "Lock Haven": {
    name: "Lock Haven",
    shortName: "Lock Haven",
    primaryColor: "#9D2235",
    secondaryColor: "#FFFFFF",
    logoUrl: "/school-logos/non-mac/Lock_Haven_Bald_Eagles_logo.svg.png",
    conference: "PSAC"
  },
  "Shippensburg": {
    name: "Shippensburg",
    shortName: "Shippensburg",
    primaryColor: "#891C1A",
    secondaryColor: "#8996AA",
    logoUrl: "/school-logos/non-mac/Shippensburg_Raiders_logo.svg.png",
    conference: "PSAC"
  },
  "Slippery Rock": {
    name: "Slippery Rock",
    shortName: "Slippery Rock",
    primaryColor: "#00684A",
    secondaryColor: "#A3AAAE",
    logoUrl: "/school-logos/non-mac/Slippery_Rock_athletics_logo.svg.png",
    conference: "PSAC"
  },
  "North Texas": {
    name: "North Texas",
    shortName: "North Texas",
    primaryColor: "#00853E",
    secondaryColor: "#FFFFFF",
    logoUrl: "/school-logos/non-mac/North_Texas_Mean_Green_logo-300x300.png",
    conference: "American Athletic"
  },
  "Appalachian State": {
    name: "Appalachian State",
    shortName: "App State",
    primaryColor: "#000000",
    secondaryColor: "#FFCC00",
    logoUrl: "/school-logos/non-mac/Appalachian_State_Mountaineers_logo.svg.png",
    conference: "Sun Belt"
  },
  "James Madison": {
    name: "James Madison",
    shortName: "JMU",
    primaryColor: "#450084",
    secondaryColor: "#B5A76C",
    logoUrl: "/school-logos/non-mac/JMU_Duke_Dog_Head_logo.png",
    conference: "Sun Belt"
  },
  "Louisville": {
    name: "Louisville",
    shortName: "Louisville",
    primaryColor: "#AD0000",
    secondaryColor: "#000000",
    logoUrl: "/school-logos/non-mac/Louisville_Cardinals_logo.svg.png",
    conference: "ACC"
  },
  "Pittsburgh": {
    name: "Pittsburgh",
    shortName: "Pitt",
    primaryColor: "#003594",
    secondaryColor: "#FFB81C",
    logoUrl: "/school-logos/non-mac/Pittsburgh_Panthers_logo.svg.png",
    conference: "ACC"
  },
  "Syracuse": {
    name: "Syracuse",
    shortName: "Syracuse",
    primaryColor: "#F76900",
    secondaryColor: "#00205B",
    logoUrl: "/school-logos/non-mac/Syracuse_Orange_logo.svg.png",
    conference: "ACC"
  },
  "Rider": {
    name: "Rider",
    shortName: "Rider",
    primaryColor: "#98002E",
    secondaryColor: "#6C6F70",
    logoUrl: "/school-logos/non-mac/Rider_Broncs.svg.png",
    conference: "MAAC"
  },
  "George Mason": {
    name: "George Mason",
    shortName: "GMU",
    primaryColor: "#006633",
    secondaryColor: "#FFCC33",
    logoUrl: "/school-logos/non-mac/George Mason.png",
    conference: "Atlantic 10"
  },
  "Cleveland State": {
    name: "Cleveland State",
    shortName: "CSU",
    primaryColor: "#006F53",
    secondaryColor: "#000000",
    logoUrl: "/school-logos/non-mac/Cleveland State.png",
    conference: "Horizon League"
  },
  "Detroit Mercy": {
    name: "Detroit Mercy",
    shortName: "UDM",
    primaryColor: "#BA0C2F",
    secondaryColor: "#0C2340",
    logoUrl: "/school-logos/non-mac/Detroit_Titans_logo.svg.png",
    conference: "Horizon League"
  },
  "Bellarmine": {
    name: "Bellarmine",
    shortName: "Bellarmine",
    primaryColor: "#F1AB31",
    secondaryColor: "#97999B",
    logoUrl: "/school-logos/non-mac/Bellarmine.png",
    conference: "ASUN"
  },
  "Chicago State": {
    name: "Chicago State",
    shortName: "CSU",
    primaryColor: "#006400",
    secondaryColor: "#FFFFFF",
    logoUrl: "/school-logos/non-mac/Chicago_State_Cougars_logo.svg.png",
    conference: "Independent"
  },
  "Longwood": {
    name: "Longwood",
    shortName: "Longwood",
    primaryColor: "#004990",
    secondaryColor: "#B9B9B9",
    logoUrl: "/school-logos/non-mac/Longwood_Lancers_logo.svg.png",
    conference: "Big South"
  },
  "SIU Edwardsville": {
    name: "SIU Edwardsville",
    shortName: "SIUE",
    primaryColor: "#CC0000",
    secondaryColor: "#000000",
    logoUrl: "/school-logos/non-mac/SIU Edwardsville.png",
    conference: "Ohio Valley"
  },
};

/**
 * Attempts to find a logo file based on school name pattern
 * Uses standard naming conventions for logo files
 * 
 * @param name The name of the school to search
 * @returns URL path to the logo file or generic logo if not found
 */
export function findLogoByNamePattern(name: string): string {
  if (!name) return "/school-logos/ncaa.png";
  
  // Clean and normalize the name
  const cleanName = name.trim().toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, "");
  
  // Log for debugging
  console.log(`Looking for logo for ${name} (cleaned: ${cleanName})`);
  
  // Special case for conference name, championship, or tournament
  if (name.toLowerCase().includes("mid-american") || 
      name.toLowerCase() === "mac" ||
      name.toLowerCase().includes("mac championship") ||
      name.toLowerCase().includes("mac tournament") ||
      (name.toLowerCase().includes("mac") && 
       (name.toLowerCase().includes("championship") || name.toLowerCase().includes("tournament")))) {
    return "/school-logos/mac-conference.png";
  }
  
  // MAC schools with direct file mapping
  const macSchoolMap: Record<string, string> = {
    "akron": "/school-logos/akron.png",
    "ball state": "/school-logos/ballstate.png",
    "bowling green": "/school-logos/bowlinggreen.png",
    "buffalo": "/school-logos/buffalo.png",
    "central michigan": "/school-logos/centralmichigan.png",
    "eastern michigan": "/school-logos/easternmichigan.png",
    "kent state": "/school-logos/kentstate.png",
    "miami": "/school-logos/miamioh.png",
    "miami (oh)": "/school-logos/miamioh.png",
    "miami (ohio)": "/school-logos/miamioh.png",
    "northern illinois": "/school-logos/northernillinois.png",
    "ohio": "/school-logos/ohio.png",
    "toledo": "/school-logos/toledo.png",
    "western michigan": "/school-logos/westernmichigan.png",
    "massachusetts": "/school-logos/massachusetts.png",
    "umass": "/school-logos/massachusetts.png",
    "mac championship": "/school-logos/mac-conference.png",
    "mac tournament": "/school-logos/mac-conference.png"
  };
  
  // Check for MAC school direct match
  if (macSchoolMap[name.toLowerCase()]) {
    return macSchoolMap[name.toLowerCase()];
  }
  
  // Common non-MAC schools with naming variations
  const nonMacSchoolMap: Record<string, string> = {
    "ohio state": "/school-logos/non-mac/ohiostate.png",
    "michigan state": "/school-logos/non-mac/michiganstate.png",
    "michigan": "/school-logos/non-mac/michigan.png",
    "notre dame": "/school-logos/non-mac/notredame.png",
    "valparaiso": "/school-logos/non-mac/valparaiso.png",
    "valpo": "/school-logos/non-mac/valparaiso.png",
    "valparaiso beacons": "/school-logos/non-mac/valparaiso.png",
    "beacons": "/school-logos/non-mac/valparaiso.png",
    "northern kentucky": "/school-logos/non-mac/northernkentucky.png",
    "nku": "/school-logos/non-mac/northernkentucky.png",
    "northern kentucky university": "/school-logos/non-mac/northernkentucky.png",
    "northern kentucky norse": "/school-logos/non-mac/northernkentucky.png",
    "norse": "/school-logos/non-mac/northernkentucky.png",
    "clemson": "/school-logos/non-mac/clemson.png",
    "florida": "/school-logos/non-mac/florida.png",
    "georgia": "/school-logos/non-mac/georgia.png",
    "alabama": "/school-logos/non-mac/alabama.png",
    "texas": "/school-logos/non-mac/texas.png",
    "penn state": "/school-logos/non-mac/pennstate.png",
    "oklahoma": "/school-logos/non-mac/oklahoma.png",
    "wisconsin": "/school-logos/non-mac/wisconsin.png",
    "maryland": "/school-logos/non-mac/maryland.png",
    "purdue": "/school-logos/non-mac/purdue.png",
    "iowa": "/school-logos/non-mac/iowa.png",
    "usc": "/school-logos/non-mac/usc.png",
    "ucla": "/school-logos/non-mac/ucla.png",
    "oregon": "/school-logos/non-mac/oregon.png",
    "washington": "/school-logos/non-mac/washington.png"
  };
  
  // Check for non-MAC school direct match
  if (nonMacSchoolMap[name.toLowerCase()]) {
    return nonMacSchoolMap[name.toLowerCase()];
  }
  
  // Try variations of the name
  const nameLower = name.toLowerCase();
  
  // Try to find by name pattern for common schools
  for (const [key, logoPath] of Object.entries(nonMacSchoolMap)) {
    // If the team name contains a known school name, use that logo
    if (nameLower.includes(key)) {
      return logoPath;
    }
  }
  
  // Special direct cases for known problematic schools
  if (nameLower.includes("valparaiso") || nameLower.includes("valpo") || nameLower.includes("valparaiso beacons") || nameLower.includes("beacons")) {
    const valpoPath = "/school-logos/non-mac/valparaiso.png";
    console.log(`Special case logo match: ${name} → ${valpoPath}`);
    return valpoPath;
  }
  
  if (nameLower.includes("northern kentucky") || nameLower.includes("nku") || nameLower.includes("norse")) {
    const nkuPath = "/school-logos/non-mac/northernkentucky.png";
    console.log(`Special case logo match: ${name} → ${nkuPath}`);
    return nkuPath;
  }
  
  if (nameLower.includes("valparaiso beacons")) {
    const valpoPath = "/school-logos/non-mac/valparaiso.png";
    console.log(`Special case logo match: ${name} → ${valpoPath}`);
    return valpoPath;
  }
  
  if (nameLower.includes("northern kentucky university")) {
    const nkuPath = "/school-logos/non-mac/northernkentucky.png";
    console.log(`Special case logo match: ${name} → ${nkuPath}`);
    return nkuPath;
  }
  
  // Try to find in the non-mac folder with various transformations
  const transformedNames = [
    nameLower.replace(/\s+/g, ""),            // Remove spaces
    nameLower.replace(/\s+/g, "-"),           // Replace spaces with hyphens
    nameLower.replace(/\s+/g, "_"),           // Replace spaces with underscores
    nameLower.split(/\s+/)[0]                 // Use first word only
  ];
  
  for (const transformed of transformedNames) {
    const possiblePath = `/school-logos/non-mac/${transformed}.png`;
    console.log(`Trying path: ${possiblePath}`);
    return possiblePath; // Return the first possible path
  }
  
  // If all else fails, return NCAA generic logo
  return "/school-logos/ncaa.png";
}

/**
 * Guesses team colors based on conference or common color patterns
 * Used when we don't have explicit color information for a team
 * 
 * @param name The name of the school
 * @returns Object with primary and secondary colors in hex format
 */
export function guessTeamColors(name: string): { primary: string, secondary: string } {
  // Default MAC conference colors
  const macNavy = "#0B213E";
  const macGreen = "#019E4F";
  
  // Look for keywords in the name that might indicate specific colors
  const nameLower = name.toLowerCase();
  
  // Colors for specific states or regions
  if (nameLower.includes("blue") || nameLower.includes("navy")) {
    return { primary: "#004B98", secondary: "#FFFFFF" };
  }
  if (nameLower.includes("red") || nameLower.includes("cardinal")) {
    return { primary: "#CC0000", secondary: "#FFFFFF" };
  }
  if (nameLower.includes("green")) {
    return { primary: "#006633", secondary: "#FFFFFF" };
  }
  if (nameLower.includes("gold") || nameLower.includes("yellow")) {
    return { primary: "#FFD700", secondary: "#000000" };
  }
  if (nameLower.includes("purple")) {
    return { primary: "#4B2E83", secondary: "#FFFFFF" };
  }
  if (nameLower.includes("orange")) {
    return { primary: "#FF7F00", secondary: "#000000" };
  }
  if (nameLower.includes("maroon")) {
    return { primary: "#800000", secondary: "#FFFFFF" };
  }
  if (nameLower.includes("crimson")) {
    return { primary: "#A71930", secondary: "#FFFFFF" };
  }
  
  // Fall back to MAC conference colors
  return { primary: macNavy, secondary: macGreen };
}

/**
 * Generate a consistent MAC affiliation flag for a school
 * @param name School name to check
 * @returns Boolean indicating if this is a MAC school
 */
export function isMacSchool(name: string): boolean {
  const macSchoolNames = [
    "Akron", "Ball State", "Bowling Green", "Buffalo", 
    "Central Michigan", "Eastern Michigan", "Kent State", 
    "Miami (OH)", "Northern Illinois", "Ohio", "Toledo", 
    "Western Michigan"
  ];
  
  // Check both the name and any possible mappings
  return macSchoolNames.includes(name) || 
         (SCHOOL_NAME_MAPPINGS[name] && macSchoolNames.includes(SCHOOL_NAME_MAPPINGS[name]));
}