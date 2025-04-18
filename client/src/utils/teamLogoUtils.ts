import { School } from "@shared/schema";
import { macSchools, ncaaLogoUrl } from "../data/macSchools";

// Map of common nicknames or alternate versions of school names
const SCHOOL_NAME_MAPPINGS: Record<string, string> = {
  // Common MAC school variants
  "NIU": "Northern Illinois",
  "CMU": "Central Michigan", 
  "EMU": "Eastern Michigan",
  "WMU": "Western Michigan",
  "BGSU": "Bowling Green",
  "UB": "Buffalo",
  "Miami (OH)": "Miami",
  "Miami Ohio": "Miami",
  "RedHawks": "Miami",
  "Kent State": "Kent State",
  "Golden Flashes": "Kent State",
  "UMass": "Massachusetts",
  "Minutemen": "Massachusetts",
  "UT": "Toledo",
  "Rockets": "Toledo",
  "Ball St": "Ball State",
  "Cardinals": "Ball State",
  "Zips": "Akron",
  "Bobcats": "Ohio",
  "Huskies": "Northern Illinois",
  "Chippewas": "Central Michigan",
  "Eagles": "Eastern Michigan",
  "Broncos": "Western Michigan",
  "Falcons": "Bowling Green",
  "Bulls": "Buffalo",
  
  // Common non-MAC opponents
  "UK": "Kentucky",
  "MSU": "Michigan State",
  "UM": "Michigan",
  "U-M": "Michigan",
  "TTU": "Texas Tech",
  "UT Austin": "Texas",
  "UNT": "North Texas",
  "University of North Texas": "North Texas",
  "University of Texas": "Texas",
  "Longhorns": "Texas",
  "Wildcats": "Kentucky",
  "Spartans": "Michigan State",
  "Wolverines": "Michigan",
  "Red Raiders": "Texas Tech",
  "Mean Green": "North Texas",
  "Bearcats": "Cincinnati",
  "UC": "Cincinnati",
  "University of Cincinnati": "Cincinnati",
  "Terrapins": "Maryland",
  "Terps": "Maryland",
  "UMD": "Maryland",
  "Huskers": "Nebraska",
  "UNL": "Nebraska",
  "University of Nebraska": "Nebraska",
  "Cornhuskers": "Nebraska",
  "Trojans": "Troy",
  "WKU": "Western Kentucky",
  "Hilltoppers": "Western Kentucky"
};

// Map of common school names to their logo URLs
const NON_MAC_LOGOS: Record<string, string> = {
  "Michigan": "/attached_assets/michigan.png",
  "Michigan State": "/attached_assets/michigan-state.png",
  "Ohio State": "/attached_assets/ohio-state.png",
  "Texas": "/attached_assets/texas.png",
  "Texas Tech": "/attached_assets/texas-tech.png",
  "North Texas": "/attached_assets/north-texas.png",
  "Kentucky": "/attached_assets/kentucky.png",
  "Cincinnati": "/attached_assets/cincinnati.png",
  "Western Kentucky": "/attached_assets/western-kentucky.png",
  "Maryland": "/attached_assets/maryland.png",
  "Nebraska": "/attached_assets/nebraska.png",
  "Troy": "/attached_assets/troy.png",
  // Add more non-MAC schools as needed
};

/**
 * Find a matching school object by name
 * Uses fuzzy matching and common name variants
 */
export function findSchoolByName(name: string): School | undefined {
  if (!name) return undefined;
  
  // Step 1: Direct match in MAC schools
  const directMatch = macSchools.find(
    school => school.name.toLowerCase() === name.toLowerCase()
  );
  if (directMatch) return directMatch;
  
  // Step 2: Check for name variants/mappings
  const normalizedName = SCHOOL_NAME_MAPPINGS[name] || name;
  
  // Step 3: Try to find a MAC school that matches the normalized name
  const macMatch = macSchools.find(
    school => school.name.toLowerCase() === normalizedName.toLowerCase()
  );
  if (macMatch) return macMatch;
  
  // Step 4: Check if it's a non-MAC school with a logo
  const logoUrl = NON_MAC_LOGOS[normalizedName];
  if (logoUrl) {
    // Create a temporary school object with basic info
    return {
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name: normalizedName,
      shortName: name,
      mascot: "",
      primaryColor: "#0099D8", // Default NCAA blue
      secondaryColor: "#FFFFFF",
      logoUrl: logoUrl,
      city: "",
      state: ""
    };
  }
  
  // Step 5: Try partial matching (contains)
  const partialMatch = macSchools.find(
    school => name.toLowerCase().includes(school.name.toLowerCase()) ||
              school.name.toLowerCase().includes(name.toLowerCase())
  );
  if (partialMatch) return partialMatch;
  
  // Step 6: If all else fails, create a generic school object with NCAA logo
  return {
    id: name.toLowerCase().replace(/\s+/g, "-"),
    name: name,
    shortName: name,
    mascot: "",
    primaryColor: "#0099D8", // NCAA blue
    secondaryColor: "#FFFFFF",
    logoUrl: ncaaLogoUrl,
    city: "",
    state: ""
  };
}

/**
 * Get a logo URL for a team based on its name
 */
export function getTeamLogoUrl(name: string): string {
  const school = findSchoolByName(name);
  return school?.logoUrl || ncaaLogoUrl;
}

/**
 * Add team colors to the game card based on school data
 */
export function getTeamColors(name: string): { primary: string, secondary: string } {
  const school = findSchoolByName(name);
  return {
    primary: school?.primaryColor || "#0099D8",
    secondary: school?.secondaryColor || "#FFFFFF"
  };
}