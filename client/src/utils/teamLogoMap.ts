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
  "BGSU": "Bowling Green",
  "Falcons": "Bowling Green",
  "Bowling Green State": "Bowling Green",
  "BG": "Bowling Green",
  
  "Buffalo": "Buffalo",
  "Bulls": "Buffalo",
  "UB": "Buffalo",
  
  "Central Michigan": "Central Michigan",
  "Chippewas": "Central Michigan",
  "CMU": "Central Michigan",
  
  "Eastern Michigan": "Eastern Michigan",
  "Eagles": "Eastern Michigan",
  "EMU": "Eastern Michigan",
  
  "Kent State": "Kent State",
  "Golden Flashes": "Kent State",
  "KSU (Kent)": "Kent State",
  
  "Miami (OH)": "Miami (OH)",
  "RedHawks": "Miami (OH)",
  "Miami": "Miami (OH)",
  "Miami Ohio": "Miami (OH)",
  "Miami University": "Miami (OH)",
  "MU (Miami)": "Miami (OH)",
  
  "Northern Illinois": "Northern Illinois",
  "Huskies (NIU)": "Northern Illinois",
  "NIU": "Northern Illinois",
  
  "Ohio": "Ohio",
  "Bobcats": "Ohio",
  "OU (Ohio)": "Ohio",
  "Ohio University": "Ohio",
  
  "Toledo": "Toledo",
  "Rockets": "Toledo",
  "UT (Toledo)": "Toledo",
  
  "Western Michigan": "Western Michigan",
  "Broncos (WMU)": "Western Michigan",
  "WMU": "Western Michigan",
  
  // MAC Affiliate Members for Wrestling
  "SIU Edwardsville": "SIU Edwardsville",
  "SIUE": "SIU Edwardsville",
  "Cougars (SIUE)": "SIU Edwardsville",
  "Southern Illinois Edwardsville": "SIU Edwardsville",
  
  "Bloomsburg": "Bloomsburg",
  "Huskies (Bloomsburg)": "Bloomsburg",
  
  "Clarion": "Clarion", 
  "Golden Eagles (Clarion)": "Clarion",
  
  "Edinboro": "Edinboro",
  "Fighting Scots": "Edinboro",
  
  "George Mason": "George Mason",
  "Patriots": "George Mason",
  "GMU": "George Mason",
  
  "Lock Haven": "Lock Haven",
  "Bald Eagles": "Lock Haven",
  
  "Rider": "Rider",
  "Broncs (Rider)": "Rider",
  
  // Some common non-MAC schools we play
  "Georgia State": "Georgia State",
  "GSU": "Georgia State",
  "Panthers (GSU)": "Georgia State",
  
  "Youngstown State": "Youngstown State",
  "YSU": "Youngstown State",
  "Penguins": "Youngstown State",
  
  "Appalachian State": "Appalachian State",
  "App State": "Appalachian State",
  "Mountaineers (App)": "Appalachian State",
  
  "Old Dominion": "Old Dominion",
  "ODU": "Old Dominion",
  "Monarchs": "Old Dominion",
  
  "Cleveland State": "Cleveland State",
  "CSU": "Cleveland State",
  "Vikings (CSU)": "Cleveland State",
  
  "IUPUI": "IUPUI",
  "Indiana University–Purdue University Indianapolis": "IUPUI",
  "Jaguars (IUPUI)": "IUPUI",
  
  "Detroit Mercy": "Detroit Mercy",
  "Detroit": "Detroit Mercy",
  "UDM": "Detroit Mercy",
  "Titans (Detroit)": "Detroit Mercy",
  
  "Robert Morris": "Robert Morris",
  "RMU": "Robert Morris",
  "Colonials": "Robert Morris",
  
  "Oakland": "Oakland",
  "OU (Oakland)": "Oakland",
  "Golden Grizzlies": "Oakland",
  
  "Wright State": "Wright State",
  "WSU": "Wright State",
  "Raiders (Wright)": "Wright State",
  
  "Milwaukee": "Milwaukee",
  "UWM": "Milwaukee",
  "Panthers (Milwaukee)": "Milwaukee",
  
  "Longwood": "Longwood",
  "Lancers": "Longwood",
  
  "James Madison": "James Madison",
  "JMU": "James Madison",
  "Dukes": "James Madison",
  
  "USC Upstate": "USC Upstate",
  "South Carolina Upstate": "USC Upstate",
  "Spartans (USC)": "USC Upstate",
  
  "Chicago State": "Chicago State",
  "Cougars (Chicago)": "Chicago State",
  
  "Bellarmine": "Bellarmine",
  "Knights": "Bellarmine",
  
  "Miami (FL)": "Miami (FL)",
  "Hurricanes": "Miami (FL)",
  "The U": "Miami (FL)",
  
  "Cincinnati": "Cincinnati",
  "Bearcats": "Cincinnati",
  "UC": "Cincinnati",
  
  "Marshall": "Marshall",
  "Thundering Herd": "Marshall",
  "MU (Marshall)": "Marshall",
  
  "Kentucky": "Kentucky",
  "Wildcats (UK)": "Kentucky",
  "UK": "Kentucky",
  
  "Notre Dame": "Notre Dame",
  "Fighting Irish": "Notre Dame",
  "ND": "Notre Dame",
  
  "Ohio State": "Ohio State",
  "Buckeyes": "Ohio State",
  "OSU": "Ohio State",
  "The Ohio State University": "Ohio State",
  
  "Pittsburgh": "Pittsburgh",
  "Pitt": "Pittsburgh",
  "Panthers (Pitt)": "Pittsburgh",
  
  "Michigan": "Michigan",
  "Wolverines": "Michigan",
  "UM": "Michigan",
  "UofM": "Michigan",
  
  "Michigan State": "Michigan State",
  "Spartans (MSU)": "Michigan State",
  "MSU": "Michigan State",
  
  "Penn State": "Penn State",
  "Nittany Lions": "Penn State",
  "PSU": "Penn State",
  
  "Syracuse": "Syracuse",
  "Orange": "Syracuse",
  "SU": "Syracuse",
  
  "Maryland": "Maryland",
  "Terrapins": "Maryland",
  "Terps": "Maryland",
  "UMD": "Maryland",
  
  "Northwestern": "Northwestern",
  "Wildcats (NU)": "Northwestern",
  "NU": "Northwestern",
  
  "Nebraska": "Nebraska",
  "Cornhuskers": "Nebraska",
  "Huskers": "Nebraska",
  "UNL": "Nebraska",
  
  "Rutgers": "Rutgers",
  "Scarlet Knights": "Rutgers",
  "RU": "Rutgers",
  
  "Purdue": "Purdue",
  "Boilermakers": "Purdue",
  
  "Indiana": "Indiana",
  "Hoosiers": "Indiana",
  "IU": "Indiana",
  
  "Illinois": "Illinois",
  "Fighting Illini": "Illinois",
  "UI": "Illinois",
  
  "Iowa": "Iowa",
  "Hawkeyes": "Iowa",
  
  "Wisconsin": "Wisconsin",
  "Badgers": "Wisconsin",
  "UW": "Wisconsin",
  
  "Minnesota": "Minnesota",
  "Golden Gophers": "Minnesota",
  "Gophers": "Minnesota",
  "UMN": "Minnesota",
  
  "Northern Kentucky": "Northern Kentucky",
  "Norse": "Northern Kentucky",
  "NKU": "Northern Kentucky",
  
  "Valparaiso": "Valparaiso",
  "Valpo": "Valparaiso",
  "Beacons": "Valparaiso",
  
  "UMass Lowell": "UMass Lowell",
  "River Hawks": "UMass Lowell",
  "Massachusetts Lowell": "UMass Lowell",
  
  "UTSA": "UTSA",
  "Texas-San Antonio": "UTSA",
  "Roadrunners": "UTSA",
  
  "UTEP": "UTEP",
  "Texas-El Paso": "UTEP",
  "Miners": "UTEP",
  
  "North Texas": "North Texas",
  "Mean Green": "North Texas",
  "UNT": "North Texas",
  
  "Rice": "Rice",
  "Owls (Rice)": "Rice",
  
  "UAB": "UAB",
  "Alabama-Birmingham": "UAB",
  "Blazers": "UAB",
  
  "Western Kentucky": "Western Kentucky",
  "WKU": "Western Kentucky",
  "Hilltoppers": "Western Kentucky",
  
  "Middle Tennessee": "Middle Tennessee",
  "Middle Tennessee State": "Middle Tennessee",
  "MTSU": "Middle Tennessee",
  "Blue Raiders": "Middle Tennessee",
  
  "Liberty": "Liberty",
  "Flames": "Liberty",
  
  "New Mexico State": "New Mexico State",
  "NMSU": "New Mexico State",
  "Aggies (NMSU)": "New Mexico State",
  
  "Jacksonville State": "Jacksonville State",
  "JSU (Jacksonville)": "Jacksonville State",
  "Gamecocks (JSU)": "Jacksonville State",
  
  "Sam Houston": "Sam Houston",
  "Sam Houston State": "Sam Houston",
  "SHSU": "Sam Houston",
  "Bearkats": "Sam Houston",
  
  "Kennesaw State": "Kennesaw State",
  "KSU (Kennesaw)": "Kennesaw State",
  "Owls (Kennesaw)": "Kennesaw State",
  
  "Florida Atlantic": "Florida Atlantic",
  "FAU": "Florida Atlantic",
  "Owls (FAU)": "Florida Atlantic",
  
  "Louisiana Tech": "Louisiana Tech",
  "LA Tech": "Louisiana Tech",
  "Bulldogs (LA Tech)": "Louisiana Tech",
  
  "FIU": "FIU",
  "Florida International": "FIU",
  "Panthers (FIU)": "FIU",
  
  "Tennessee Southern": "Tennessee Southern",
  "Sewanee": "Tennessee Southern",
  "Tigers (TSU)": "Tennessee Southern",
  
  "Jackson State": "Jackson State",
  "JSU (Jackson)": "Jackson State",
  "Tigers (Jackson)": "Jackson State",
  
  "Purdue Fort Wayne": "Purdue Fort Wayne",
  "PFW": "Purdue Fort Wayne",
  "Mastodons": "Purdue Fort Wayne",
};

// MAC conference brand colors
export const macNavy = "#0B213E";
export const macGreen = "#019E4F";
export const macGray = "#9DA5A8";

/**
 * Gets the team logo path for a given school name
 * @param schoolName The name of the school to get the logo for
 * @returns The path to the team logo
 */
export function getTeamLogo(schoolName: string): string {
  // If the name is in our mapping, use the standardized name
  const standardName = SCHOOL_NAME_MAPPINGS[schoolName] || schoolName;
  
  // Convert to lowercase with no spaces for file naming
  const normalizedName = standardName.toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');
  
  if (isMacSchool(standardName)) {
    // For MAC schools, use the correct path (without /public/ prefix)
    return `/school-logos/mac/${normalizedName}.png`;
  } else {
    // For non-MAC schools
    // Special case for Northern Kentucky which has been problematic
    if (standardName === "Northern Kentucky" || standardName === "Norse" || standardName === "NKU") {
      return `/school-logos/non-mac/northernkentucky.png`;
    }
    
    return `/school-logos/non-mac/${normalizedName}.png`;
  }
}

/**
 * Gets the team colors for a given school name
 * @param schoolName The name of the school to get colors for
 * @returns An object with primary and secondary color values
 */
export function getTeamColors(schoolName: string): {primary: string, secondary: string} {
  // If the name is in our mapping, use the standardized name
  const standardName = SCHOOL_NAME_MAPPINGS[schoolName] || schoolName;
  
  // Convert to lowercase for comparison
  const nameLower = standardName.toLowerCase();
  
  // MAC Schools
  if (nameLower.includes("akron")) {
    return { primary: "#041E42", secondary: "#A89968" };
  }
  if (nameLower.includes("ball state")) {
    return { primary: "#BA0C2F", secondary: "#000000" };
  }
  if (nameLower.includes("bowling green")) {
    return { primary: "#FE5000", secondary: "#4F2C1D" };
  }
  if (nameLower.includes("buffalo")) {
    return { primary: "#005BBB", secondary: "#FFFFFF" };
  }
  if (nameLower.includes("central michigan")) {
    return { primary: "#6A0032", secondary: "#FFC82E" };
  }
  if (nameLower.includes("eastern michigan")) {
    return { primary: "#006633", secondary: "#FFFFFF" };
  }
  if (nameLower.includes("kent state")) {
    return { primary: "#002664", secondary: "#EAAB00" };
  }
  if (nameLower.includes("miami") && (nameLower.includes("oh") || nameLower.includes("ohio"))) {
    return { primary: "#B61E2E", secondary: "#000000" };
  }
  if (nameLower.includes("northern illinois")) {
    return { primary: "#CC0000", secondary: "#000000" };
  }
  if (nameLower === "ohio" || nameLower.includes("ohio university")) {
    return { primary: "#00694E", secondary: "#CDA077" };
  }
  if (nameLower.includes("toledo")) {
    return { primary: "#003E7E", secondary: "#FFD200" };
  }
  if (nameLower.includes("western michigan")) {
    return { primary: "#6C4023", secondary: "#B5A167" };
  }
  
  // Non-MAC Schools - just a sampling of common opponents
  if (nameLower.includes("michigan state")) {
    return { primary: "#18453B", secondary: "#FFFFFF" };
  }
  if (nameLower.includes("michigan") && !nameLower.includes("state") && !nameLower.includes("central") && !nameLower.includes("eastern") && !nameLower.includes("western")) {
    return { primary: "#00274C", secondary: "#FFCB05" };
  }
  if (nameLower.includes("ohio state")) {
    return { primary: "#BB0000", secondary: "#666666" };
  }
  if (nameLower.includes("notre dame")) {
    return { primary: "#0C2340", secondary: "#C99700" };
  }
  if (nameLower.includes("cincinnati")) {
    return { primary: "#000000", secondary: "#E00122" };
  }
  if (nameLower.includes("kentucky")) {
    return { primary: "#0033A0", secondary: "#FFFFFF" };
  }
  if (nameLower.includes("penn state")) {
    return { primary: "#041E42", secondary: "#FFFFFF" };
  }
  if (nameLower.includes("pittsburgh") || nameLower === "pitt") {
    return { primary: "#003594", secondary: "#FFB81C" };
  }
  if (nameLower.includes("syracuse")) {
    return { primary: "#D44500", secondary: "#000000" };
  }
  if (nameLower.includes("northwestern")) {
    return { primary: "#4E2A84", secondary: "#FFFFFF" };
  }
  if (nameLower.includes("indiana") && !nameLower.includes("purdue")) {
    return { primary: "#990000", secondary: "#FFFFFF" };
  }
  if (nameLower.includes("purdue")) {
    return { primary: "#CEB888", secondary: "#000000" };
  }
  if (nameLower.includes("illinois")) {
    return { primary: "#13294B", secondary: "#E84A27" };
  }
  if (nameLower.includes("wisconsin")) {
    return { primary: "#C5050C", secondary: "#FFFFFF" };
  }
  if (nameLower.includes("minnesota")) {
    return { primary: "#7A0019", secondary: "#FFCC33" };
  }
  if (nameLower.includes("iowa")) {
    return { primary: "#000000", secondary: "#FFCD00" };
  }
  if (nameLower.includes("northern kentucky")) {
    return { primary: "#000000", secondary: "#FFC72C" };
  }
  if (nameLower.includes("valparaiso") || nameLower === "valpo") {
    return { primary: "#613318", secondary: "#FFC425" };
  }
  if (nameLower.includes("cleveland state")) {
    return { primary: "#006A4D", secondary: "#FFFFFF" };
  }
  if (nameLower.includes("wright state")) {
    return { primary: "#026937", secondary: "#CEA052" };
  }
  if (nameLower.includes("green")) {
    return { primary: "#006633", secondary: "#FFFFFF" };
  }
  if (nameLower.includes("blue")) {
    return { primary: "#0033A0", secondary: "#FFFFFF" };
  }
  if (nameLower.includes("red")) {
    return { primary: "#CC0000", secondary: "#FFFFFF" };
  }
  if (nameLower.includes("gold")) {
    return { primary: "#FFD700", secondary: "#000000" };
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
  const standardName = SCHOOL_NAME_MAPPINGS[name];
  return macSchoolNames.includes(name) || 
         (standardName !== undefined && macSchoolNames.includes(standardName));
}