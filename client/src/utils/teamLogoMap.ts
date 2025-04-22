import { School } from "@shared/schema";
import { macSchools, ncaaLogoUrl } from "../data/macSchools";

// Map of common nicknames or alternate versions of school names
export const SCHOOL_NAME_MAPPINGS: Record<string, string> = {
  // MAC school variants
  "NIU": "Northern Illinois",
  "CMU": "Central Michigan", 
  "EMU": "Eastern Michigan",
  "WMU": "Western Michigan",
  "BGSU": "Bowling Green",
  "UB": "Buffalo",
  "Miami (OH)": "Miami",
  "Miami Ohio": "Miami",
  "Miami (Ohio)": "Miami",
  "Miami OH": "Miami",
  "Miami University": "Miami",
  "RedHawks": "Miami",
  "Kent State": "Kent State",
  "Golden Flashes": "Kent State",
  "UMass": "Massachusetts",
  "Minutemen": "Massachusetts",
  "Toledo": "Toledo",
  "Toledo Rockets": "Toledo",
  "Rockets": "Toledo",
  "Ball St": "Ball State",
  "Ball St.": "Ball State",
  "BSU": "Ball State",
  "Cardinals": "Ball State",
  "Akron Zips": "Akron",
  "Zips": "Akron",
  "University of Akron": "Akron",
  "Ohio Bobcats": "Ohio",
  "Bobcats": "Ohio",
  "Ohio University": "Ohio",
  "Northern Illinois Huskies": "Northern Illinois",
  "NIU Huskies": "Northern Illinois",
  "Chippewas": "Central Michigan",
  "Central Michigan Chippewas": "Central Michigan",
  "Eastern Michigan Eagles": "Eastern Michigan",
  "EMU Eagles": "Eastern Michigan",
  "Western Michigan Broncos": "Western Michigan",
  "WMU Broncos": "Western Michigan",
  "Bowling Green Falcons": "Bowling Green",
  "BG Falcons": "Bowling Green",
  "Buffalo Bulls": "Buffalo",
  "UB Bulls": "Buffalo",
  
  // Common non-MAC opponents from official MAC schedule
  "Air Force": "Air Force",
  "Air Force Falcons": "Air Force",
  "Alabama": "Alabama",
  "Alabama Crimson Tide": "Alabama",
  "Appalachian State": "Appalachian State",
  "App State": "Appalachian State",
  "App. State": "Appalachian State",
  "Appalachian St Mountaineers": "Appalachian State",
  "Arizona": "Arizona",
  "Arizona Wildcats": "Arizona",
  "Arizona State": "Arizona State",
  "ASU": "Arizona State",
  "Arizona State Sun Devils": "Arizona State",
  "Arkansas": "Arkansas",
  "Arkansas Razorbacks": "Arkansas",
  "Arkansas State": "Arkansas State",
  "Arkansas St Red Wolves": "Arkansas State",
  "Army": "Army",
  "Army Black Knights": "Army",
  "Auburn": "Auburn",
  "Auburn Tigers": "Auburn",
  "Baylor": "Baylor",
  "Baylor Bears": "Baylor",
  "Boise State": "Boise State",
  "Boise St Broncos": "Boise State",
  "Boston College": "Boston College",
  "BC": "Boston College",
  "Boston College Eagles": "Boston College",
  "BYU": "BYU",
  "Brigham Young": "BYU",
  "BYU Cougars": "BYU",
  "California": "California",
  "Cal": "California",
  "California Golden Bears": "California",
  "Cincinnati": "Cincinnati",
  "UC": "Cincinnati",
  "Cincy": "Cincinnati",
  "Bearcats": "Cincinnati",
  "Cincinnati Bearcats": "Cincinnati",
  "Clemson": "Clemson",
  "Clemson Tigers": "Clemson",
  "Coastal Carolina": "Coastal Carolina",
  "Coastal Carolina Chanticleers": "Coastal Carolina",
  "Colorado": "Colorado",
  "Colorado Buffaloes": "Colorado",
  "Colorado State": "Colorado State",
  "Colorado St Rams": "Colorado State",
  "Connecticut": "Connecticut",
  "UConn": "Connecticut",
  "UConn Huskies": "Connecticut",
  "Duke": "Duke",
  "Duke Blue Devils": "Duke",
  "East Carolina": "East Carolina",
  "ECU": "East Carolina",
  "East Carolina Pirates": "East Carolina",
  "Florida": "Florida",
  "UF": "Florida",
  "Florida Gators": "Florida",
  "Florida State": "Florida State",
  "FSU": "Florida State",
  "Florida State Seminoles": "Florida State",
  "Fresno State": "Fresno State",
  "Fresno St Bulldogs": "Fresno State",
  "Georgia": "Georgia",
  "UGA": "Georgia",
  "Georgia Bulldogs": "Georgia",
  "Georgia Southern": "Georgia Southern",
  "Georgia Southern Eagles": "Georgia Southern",
  "Georgia State": "Georgia State",
  "Georgia State Panthers": "Georgia State",
  "Georgia Tech": "Georgia Tech",
  "GT": "Georgia Tech",
  "Georgia Tech Yellow Jackets": "Georgia Tech",
  "Hawaii": "Hawaii",
  "Hawaii Rainbow Warriors": "Hawaii",
  "Houston": "Houston",
  "Houston Cougars": "Houston",
  "Illinois": "Illinois",
  "Illinois Fighting Illini": "Illinois",
  "Indiana": "Indiana",
  "IU": "Indiana",
  "Indiana Hoosiers": "Indiana",
  "Iowa": "Iowa",
  "Iowa Hawkeyes": "Iowa",
  "Iowa State": "Iowa State",
  "Iowa State Cyclones": "Iowa State",
  "Kansas": "Kansas",
  "KU": "Kansas",
  "Kansas Jayhawks": "Kansas",
  "Kansas State": "Kansas State",
  "K-State": "Kansas State",
  "Kansas State Wildcats": "Kansas State",
  "Kentucky": "Kentucky",
  "UK": "Kentucky",
  "Kentucky Wildcats": "Kentucky",
  "Liberty": "Liberty",
  "Liberty Flames": "Liberty",
  "Louisiana": "Louisiana",
  "UL": "Louisiana",
  "Louisiana Lafayette": "Louisiana",
  "Louisiana Ragin Cajuns": "Louisiana",
  "Louisiana Tech": "Louisiana Tech",
  "La. Tech": "Louisiana Tech",
  "Louisiana Tech Bulldogs": "Louisiana Tech",
  "Louisville": "Louisville",
  "Louisville Cardinals": "Louisville",
  "LSU": "LSU",
  "Louisiana State": "LSU",
  "LSU Tigers": "LSU",
  "Marshall": "Marshall",
  "Marshall Thundering Herd": "Marshall",
  "Maryland": "Maryland",
  "Terps": "Maryland",
  "Terrapins": "Maryland",
  "UMD": "Maryland",
  "Maryland Terrapins": "Maryland",
  "Memphis": "Memphis",
  "Memphis Tigers": "Memphis",
  "Miami FL": "Miami FL",
  "Miami (FL)": "Miami FL",
  "The U": "Miami FL",
  "Miami Hurricanes": "Miami FL",
  "Michigan": "Michigan",
  "UM": "Michigan",
  "U-M": "Michigan",
  "Wolverines": "Michigan",
  "Michigan Wolverines": "Michigan",
  "Michigan State": "Michigan State", 
  "MSU": "Michigan State",
  "Spartans": "Michigan State",
  "Michigan State Spartans": "Michigan State",
  "Middle Tennessee": "Middle Tennessee",
  "MTSU": "Middle Tennessee",
  "Middle Tennessee Blue Raiders": "Middle Tennessee",
  "Minnesota": "Minnesota",
  "Minnesota Golden Gophers": "Minnesota",
  "Mississippi State": "Mississippi State",
  "Miss. State": "Mississippi State",
  "Mississippi State Bulldogs": "Mississippi State",
  "Missouri": "Missouri",
  "Mizzou": "Missouri",
  "Missouri Tigers": "Missouri",
  "Navy": "Navy",
  "Navy Midshipmen": "Navy",
  "NC State": "NC State",
  "North Carolina State": "NC State",
  "NC State Wolfpack": "NC State",
  "Nebraska": "Nebraska",
  "UNL": "Nebraska",
  "Huskers": "Nebraska",
  "Cornhuskers": "Nebraska",
  "Nebraska Cornhuskers": "Nebraska",
  "Nevada": "Nevada",
  "Nevada Wolf Pack": "Nevada",
  "New Mexico": "New Mexico",
  "UNM": "New Mexico",
  "New Mexico Lobos": "New Mexico",
  "New Mexico State": "New Mexico State",
  "NMSU": "New Mexico State",
  "New Mexico State Aggies": "New Mexico State",
  "North Carolina": "North Carolina",
  "UNC": "North Carolina",
  "North Carolina Tar Heels": "North Carolina",
  "North Texas": "North Texas",
  "UNT": "North Texas",
  "Mean Green": "North Texas",
  "North Texas Mean Green": "North Texas",
  "Northwestern": "Northwestern",
  "NW": "Northwestern",
  "Northwestern Wildcats": "Northwestern",
  "Notre Dame": "Notre Dame",
  "ND": "Notre Dame",
  "Fighting Irish": "Notre Dame",
  "Notre Dame Fighting Irish": "Notre Dame",
  "Ohio State": "Ohio State",
  "OSU": "Ohio State",
  "Buckeyes": "Ohio State",
  "Ohio State Buckeyes": "Ohio State",
  "Oklahoma": "Oklahoma",
  "OU": "Oklahoma",
  "Sooners": "Oklahoma",
  "Oklahoma Sooners": "Oklahoma",
  "Oklahoma State": "Oklahoma State",
  "OK State": "Oklahoma State",
  "OK State Cowboys": "Oklahoma State",
  "Oklahoma State Cowboys": "Oklahoma State",
  "Ole Miss": "Ole Miss",
  "Mississippi": "Ole Miss",
  "Ole Miss Rebels": "Ole Miss",
  "Oregon": "Oregon",
  "Ducks": "Oregon",
  "Oregon Ducks": "Oregon",
  "Oregon State": "Oregon State",
  "Beavers": "Oregon State",
  "Oregon State Beavers": "Oregon State",
  "Penn State": "Penn State",
  "PSU": "Penn State",
  "Nittany Lions": "Penn State",
  "Penn State Nittany Lions": "Penn State",
  "Pittsburgh": "Pittsburgh",
  "Pitt": "Pittsburgh",
  "Panthers": "Pittsburgh",
  "Pittsburgh Panthers": "Pittsburgh",
  "Purdue": "Purdue",
  "Boilermakers": "Purdue",
  "Purdue Boilermakers": "Purdue",
  "Rice": "Rice",
  "Rice Owls": "Rice",
  "Rutgers": "Rutgers",
  "RU": "Rutgers",
  "Rutgers Scarlet Knights": "Rutgers",
  "San Diego State": "San Diego State",
  "SDSU": "San Diego State",
  "San Diego State Aztecs": "San Diego State",
  "San Jose State": "San Jose State",
  "SJSU": "San Jose State",
  "San Jose State Spartans": "San Jose State",
  "SMU": "SMU",
  "Southern Methodist": "SMU",
  "SMU Mustangs": "SMU",
  "South Alabama": "South Alabama",
  "South Alabama Jaguars": "South Alabama",
  "South Carolina": "South Carolina",
  "South Carolina Gamecocks": "South Carolina",
  "Southern Miss": "Southern Miss",
  "USM": "Southern Miss",
  "Southern Miss Golden Eagles": "Southern Miss",
  "Stanford": "Stanford",
  "Stanford Cardinal": "Stanford",
  "Syracuse": "Syracuse",
  "Orange": "Syracuse",
  "Syracuse Orange": "Syracuse",
  "TCU": "TCU",
  "Texas Christian": "TCU",
  "TCU Horned Frogs": "TCU",
  "Temple": "Temple",
  "Temple Owls": "Temple",
  "Tennessee": "Tennessee",
  "Tennessee Volunteers": "Tennessee",
  "Tennessee Vols": "Tennessee",
  "Texas": "Texas",
  "UT Austin": "Texas",
  "Longhorns": "Texas",
  "Texas Longhorns": "Texas",
  "Texas A&M": "Texas A&M",
  "TAMU": "Texas A&M",
  "Texas A&M Aggies": "Texas A&M",
  "Texas State": "Texas State",
  "Texas State Bobcats": "Texas State",
  "Texas Tech": "Texas Tech",
  "TTU": "Texas Tech",
  "Red Raiders": "Texas Tech",
  "Texas Tech Red Raiders": "Texas Tech",
  "Troy": "Troy",
  "Troy Trojans": "Troy",
  "Tulane": "Tulane",
  "Green Wave": "Tulane",
  "Tulane Green Wave": "Tulane",
  "Tulsa": "Tulsa",
  "Golden Hurricane": "Tulsa",
  "Tulsa Golden Hurricane": "Tulsa",
  "UAB": "UAB",
  "Alabama-Birmingham": "UAB",
  "UAB Blazers": "UAB",
  "UCF": "UCF",
  "Central Florida": "UCF",
  "Knights": "UCF",
  "UCF Knights": "UCF",
  "UCLA": "UCLA",
  "UCLA Bruins": "UCLA",
  "UNLV": "UNLV",
  "Nevada-Las Vegas": "UNLV",
  "Rebels": "UNLV",
  "UNLV Rebels": "UNLV",
  "USC": "USC",
  "USC Trojans": "USC",
  "USF": "USF",
  "South Florida": "USF",
  "USF Bulls": "USF",
  "Utah": "Utah",
  "Utes": "Utah",
  "Utah Utes": "Utah",
  "Utah State": "Utah State",
  "Utah St Aggies": "Utah State",
  "UTEP": "UTEP",
  "Texas-El Paso": "UTEP",
  "UTEP Miners": "UTEP",
  "UTSA": "UTSA",
  "Texas-San Antonio": "UTSA",
  "Roadrunners": "UTSA",
  "UTSA Roadrunners": "UTSA",
  "Vanderbilt": "Vanderbilt",
  "Vandy": "Vanderbilt",
  "Commodores": "Vanderbilt",
  "Vanderbilt Commodores": "Vanderbilt",
  "Virginia": "Virginia",
  "UVA": "Virginia",
  "Cavaliers": "Virginia",
  "Virginia Cavaliers": "Virginia",
  "Virginia Tech": "Virginia Tech",
  "VT": "Virginia Tech",
  "Hokies": "Virginia Tech",
  "Virginia Tech Hokies": "Virginia Tech",
  "Wake Forest": "Wake Forest",
  "Demon Deacons": "Wake Forest",
  "Wake Forest Demon Deacons": "Wake Forest",
  "Washington": "Washington",
  "Washington Huskies": "Washington",
  "Washington State": "Washington State",
  "WSU": "Washington State",
  "Cougars": "Washington State",
  "Washington State Cougars": "Washington State",
  "West Virginia": "West Virginia",
  "WVU": "West Virginia",
  "Mountaineers": "West Virginia",
  "West Virginia Mountaineers": "West Virginia",
  "Western Kentucky": "Western Kentucky",
  "WKU": "Western Kentucky",
  "Hilltoppers": "Western Kentucky",
  "Western Kentucky Hilltoppers": "Western Kentucky",
  "Wisconsin": "Wisconsin",
  "Wisconsin Badgers": "Wisconsin",
  "Wyoming": "Wyoming",
  "Wyoming Cowboys": "Wyoming"
};

// Create a comprehensive list of non-MAC schools with their colors and logo paths
export interface NonMacSchool {
  name: string;
  shortName: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
}

// Handle specific cases with separate mappings
export const MAC_TEAM_ABBREVIATIONS: Record<string, string> = {
  "TOL": "Toledo",
  "AKR": "Akron",
  "BGSU": "Bowling Green",
  "BSU": "Ball State",
  "BUF": "Buffalo",
  "CMU": "Central Michigan",
  "EMU": "Eastern Michigan",
  "KSU": "Kent State",
  "MIA": "Miami",
  "MASS": "Massachusetts",
  "NIU": "Northern Illinois",
  "OHIO": "Ohio",
  "WMU": "Western Michigan"
};

// Special case for 'UT' abbreviation which can be Toledo or Tennessee
export const resolveUTAbbreviation = (context: string): string => {
  // If in MAC context, UT is Toledo
  if (context.includes("MAC") || 
      context.includes("Mid-American") || 
      context.includes("Toledo")) {
    return "Toledo";
  }
  // Default to Tennessee (which is more commonly referred to as UT)
  return "Tennessee";
};

// Special cases for team names that have multiple common abbreviations
export const TEAM_ABBREVIATION_CONFLICTS = {
  "UT": ["Toledo", "Tennessee", "Texas"], 
  "OSU": ["Ohio State", "Oklahoma State", "Oregon State"],
  "USC": ["Southern California", "South Carolina"],
  "UW": ["Washington", "Wisconsin", "Wyoming"],
  "MSU": ["Michigan State", "Mississippi State", "Montana State"],
  "Aggies": ["Texas A&M", "New Mexico State", "Utah State"],
  "Tigers": ["Auburn", "Clemson", "LSU", "Missouri"],
  "Wildcats": ["Arizona", "Kentucky", "Northwestern"],
  "Bulldogs": ["Georgia", "Mississippi State", "Fresno State"],
  "Bears": ["Baylor", "California"],
  "Cougars": ["BYU", "Washington State", "Houston"],
  "Huskies": ["Northern Illinois", "UConn", "Washington"],
  "Panthers": ["Pittsburgh", "Georgia State"],
  "Eagles": ["Eastern Michigan", "Boston College", "Georgia Southern"]
};

/**
 * Get the best match for a team name when multiple options exist
 * Uses context and prioritization to select the best match
 */
export const resolveBestTeamMatch = (name: string, context?: string): string => {
  if (!name) return "";
  
  const lowerName = name.toLowerCase();
  
  // Special handling for UT abbreviation
  if (name === "UT" && context) {
    return resolveUTAbbreviation(context);
  }
  
  // For most other cases, try the mapping
  return SCHOOL_NAME_MAPPINGS[name] || name;
};

/**
 * Try to find a logo file that matches a school name pattern
 * Returns the relative URL path if successful, empty string if not
 */
export const findLogoByNamePattern = (name: string): string => {
  if (!name) return "";
  
  // Convert name to URL-friendly format
  const cleanName = name.toLowerCase()
    .replace(/\s+/g, "") // Remove spaces
    .replace(/[^a-z0-9]/g, ""); // Remove special chars
  
  // Path to try for the logo file 
  return `/school-logos/non-mac/${cleanName}.png`;
};

export const guessTeamColors = (name: string): { primary: string, secondary: string } => {
  // For popular conferences, define a default conference color
  let primaryColor = "#0099D8"; // Default NCAA blue
  let secondaryColor = "#FFFFFF";
  
  const lowerName = name.toLowerCase();
  
  // Set conference-specific colors based on keywords in the name
  if (lowerName.includes("sec") || 
      lowerName.includes("alabama") || lowerName.includes("auburn") || 
      lowerName.includes("florida") || lowerName.includes("georgia") || 
      lowerName.includes("kentucky") || lowerName.includes("lsu") || 
      lowerName.includes("mississippi") || lowerName.includes("ole miss") || 
      lowerName.includes("missouri") || lowerName.includes("south carolina") || 
      lowerName.includes("tennessee") || lowerName.includes("vanderbilt") || 
      lowerName.includes("arkansas") || lowerName.includes("texas a&m")) {
    primaryColor = "#14213D"; // SEC blue
  } else if (lowerName.includes("big ten") || 
             lowerName.includes("michigan") || lowerName.includes("ohio state") || 
             lowerName.includes("penn state") || lowerName.includes("wisconsin") || 
             lowerName.includes("iowa") || lowerName.includes("minnesota") || 
             lowerName.includes("illinois") || lowerName.includes("indiana") || 
             lowerName.includes("purdue") || lowerName.includes("northwestern") || 
             lowerName.includes("maryland") || lowerName.includes("rutgers") || 
             lowerName.includes("nebraska")) {
    primaryColor = "#B1063A"; // Big Ten red
  } else if (lowerName.includes("acc") || 
             lowerName.includes("clemson") || lowerName.includes("duke") || 
             lowerName.includes("florida state") || lowerName.includes("georgia tech") || 
             lowerName.includes("miami") || lowerName.includes("north carolina") || 
             lowerName.includes("nc state") || lowerName.includes("pittsburgh") || 
             lowerName.includes("syracuse") || lowerName.includes("virginia") || 
             lowerName.includes("virginia tech") || lowerName.includes("wake forest")) {
    primaryColor = "#013CA6"; // ACC blue
  } else if (lowerName.includes("big 12") || 
             lowerName.includes("baylor") || lowerName.includes("iowa state") || 
             lowerName.includes("kansas") || lowerName.includes("kansas state") || 
             lowerName.includes("oklahoma") || lowerName.includes("oklahoma state") || 
             lowerName.includes("tcu") || lowerName.includes("texas") || 
             lowerName.includes("texas tech") || lowerName.includes("west virginia")) {
    primaryColor = "#BF5700"; // Big 12 orange
  }
  
  return { primary: primaryColor, secondary: secondaryColor };
};