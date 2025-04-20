import { School } from "@shared/schema";
import { macSchools, ncaaLogoUrl } from "../data/macSchools";

// Map of common nicknames or alternate versions of school names
const SCHOOL_NAME_MAPPINGS: Record<string, string> = {
  // Special non-MAC teams and organizations
  "Mid-American Conference": "Mid-American Conference",
  "MAC": "Mid-American Conference", 
  "MAC Championship": "Mid-American Conference",
  "University of Illinois-Chicago": "University of Illinois-Chicago",
  "UIC": "University of Illinois-Chicago",
  "Illinois-Chicago": "University of Illinois-Chicago",
  
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
  "Texas Tech Red Raiders": "Texas Tech",
  "Texas Tech Univ": "Texas Tech",
  "Texas Tech University": "Texas Tech",
  "UT Austin": "Texas",
  "UNT": "North Texas",
  "North Texas Mean Green": "North Texas",
  "University of North Texas": "North Texas",
  "University of Texas": "Texas",
  "Longhorns": "Texas",
  "Wildcats": "Kentucky",
  "Spartans": "Michigan State", 
  "Michigan State Spartans": "Michigan State",
  "Michigan State Univ": "Michigan State",
  "Michigan State University": "Michigan State",
  "Wolverines": "Michigan",
  "Red Raiders": "Texas Tech",
  "Mean Green": "North Texas",
  "Bearcats": "Cincinnati",
  "UC": "Cincinnati",
  "University of Cincinnati": "Cincinnati",
  "Terrapins": "Maryland",
  "Terps": "Maryland",
  "UMD": "Maryland",
  "Maryland Terrapins": "Maryland",
  "University of Maryland": "Maryland",
  "Huskers": "Nebraska",
  "UNL": "Nebraska",
  "University of Nebraska": "Nebraska",
  "Cornhuskers": "Nebraska",
  "Trojans": "Troy",
  "WKU": "Western Kentucky",
  "Hilltoppers": "Western Kentucky",
  "Notre Dame": "Notre Dame",
  "Fighting Irish": "Notre Dame",
  "UND": "Notre Dame"
};

// Create a comprehensive list of non-MAC schools with their colors and logo paths
interface NonMacSchool {
  name: string;
  shortName: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
}

// Define common non-MAC schools data
const NON_MAC_SCHOOLS: Record<string, NonMacSchool> = {
  "Mid-American Conference": {
    name: "Mid-American Conference",
    shortName: "MAC",
    primaryColor: "#0B213E", // MAC navy
    secondaryColor: "#019E4F", // MAC green
    logoUrl: "/mac-logo.png"
  },
  "University of Illinois-Chicago": {
    name: "University of Illinois-Chicago",
    shortName: "UIC",
    primaryColor: "#DE3337",
    secondaryColor: "#003EAA",
    logoUrl: "/school-logos/affiliate/uic.png"
  },
  "Michigan": {
    name: "Michigan",
    shortName: "Michigan",
    primaryColor: "#00274C",
    secondaryColor: "#FFCB05",
    logoUrl: "/school-logos/non-mac/michigan.svg"
  },
  "Michigan State": {
    name: "Michigan State",
    shortName: "MSU",
    primaryColor: "#18453B",
    secondaryColor: "#FFFFFF",
    logoUrl: "/school-logos/non-mac/michigan-state.png"
  },
  "Notre Dame": {
    name: "Notre Dame",
    shortName: "Notre Dame",
    primaryColor: "#0C2340",
    secondaryColor: "#C99700",
    logoUrl: "/school-logos/non-mac/notre-dame.svg"
  },
  "Ohio State": {
    name: "Ohio State",
    shortName: "OSU",
    primaryColor: "#BB0000",
    secondaryColor: "#666666",
    logoUrl: "/school-logos/non-mac/ohio-state.svg"
  },
  "Texas": {
    name: "Texas",
    shortName: "Texas",
    primaryColor: "#BF5700",
    secondaryColor: "#FFFFFF",
    logoUrl: "/school-logos/non-mac/texas.svg"
  },
  "Texas Tech": {
    name: "Texas Tech",
    shortName: "Texas Tech",
    primaryColor: "#CC0000",
    secondaryColor: "#000000",
    logoUrl: "/school-logos/non-mac/texas-tech.png"
  },
  "North Texas": {
    name: "North Texas",
    shortName: "UNT",
    primaryColor: "#00853E",
    secondaryColor: "#FFFFFF",
    logoUrl: "/school-logos/non-mac/north-texas.png"
  },
  "Kentucky": {
    name: "Kentucky",
    shortName: "UK",
    primaryColor: "#0033A0",
    secondaryColor: "#FFFFFF",
    logoUrl: "/school-logos/non-mac/kentucky.svg"
  },
  "Cincinnati": {
    name: "Cincinnati",
    shortName: "Cincinnati",
    primaryColor: "#E00122",
    secondaryColor: "#000000",
    logoUrl: "/school-logos/non-mac/cincinnati.svg"
  },
  "Western Kentucky": {
    name: "Western Kentucky",
    shortName: "WKU",
    primaryColor: "#C8102E",
    secondaryColor: "#FFFFFF",
    logoUrl: "/school-logos/non-mac/western-kentucky.svg"
  },
  "Maryland": {
    name: "Maryland",
    shortName: "Maryland",
    primaryColor: "#E03a3e",
    secondaryColor: "#FFD520",
    logoUrl: "/school-logos/non-mac/maryland.png"
  },
  "Nebraska": {
    name: "Nebraska",
    shortName: "Nebraska",
    primaryColor: "#E41C38",
    secondaryColor: "#FFFFFF",
    logoUrl: "/school-logos/non-mac/nebraska.svg"
  },
  "Troy": {
    name: "Troy",
    shortName: "Troy",
    primaryColor: "#8A2432",
    secondaryColor: "#C3C5C8",
    logoUrl: "/school-logos/non-mac/troy.svg"
  },
  "Washington State": {
    name: "Washington State",
    shortName: "WSU",
    primaryColor: "#981E32",
    secondaryColor: "#5E6A71",
    logoUrl: "/school-logos/non-mac/washington-state.svg"
  },
  "Purdue": {
    name: "Purdue",
    shortName: "Purdue",
    primaryColor: "#CFB991",
    secondaryColor: "#000000",
    logoUrl: "/school-logos/non-mac/purdue.svg"
  },
  "Penn State": {
    name: "Penn State",
    shortName: "PSU",
    primaryColor: "#041E42",
    secondaryColor: "#FFFFFF",
    logoUrl: "/school-logos/non-mac/penn-state.svg"
  },
  "Youngstown State": {
    name: "Youngstown State",
    shortName: "YSU",
    primaryColor: "#C8102E",
    secondaryColor: "#000000",
    logoUrl: "/school-logos/non-mac/youngstown-state.svg"
  }
};

/**
 * Find a matching school object by name
 * Uses fuzzy matching and common name variants
 */
export function findSchoolByName(name: string): School | undefined {
  if (!name) return undefined;
  
  const lowerCaseName = name.toLowerCase();
  
  // Special case handling for specific schools appearing in the screenshots
  if (lowerCaseName.includes("mid-american conference") || 
      lowerCaseName === "mac" || 
      lowerCaseName.includes("mac championship") || 
      lowerCaseName.includes("mac tournament")) {
    return {
      id: "mid-american-conference",
      name: "Mid-American Conference",
      shortName: "MAC", 
      mascot: "",
      primaryColor: "#0B213E", // MAC navy
      secondaryColor: "#019E4F", // MAC green
      logoUrl: "/mac-logo.png",
      city: "",
      state: ""
    };
  }
  
  if (lowerCaseName.includes("michigan state") || 
      lowerCaseName.includes("michigan st") || 
      lowerCaseName === "msu" || 
      lowerCaseName.includes("spartans")) {
    return {
      id: "michigan-state",
      name: "Michigan State",
      shortName: "MSU",
      mascot: "Spartans",
      primaryColor: "#18453B",
      secondaryColor: "#FFFFFF",
      logoUrl: "/school-logos/non-mac/michigan-state.png",
      city: "East Lansing",
      state: "MI"
    };
  }
  
  if (lowerCaseName.includes("texas tech") || 
      lowerCaseName === "ttu" || 
      lowerCaseName.includes("red raiders")) {
    return {
      id: "texas-tech",
      name: "Texas Tech",
      shortName: "TTU",
      mascot: "Red Raiders",
      primaryColor: "#CC0000",
      secondaryColor: "#000000",
      logoUrl: "/school-logos/non-mac/texas-tech.png",
      city: "Lubbock",
      state: "TX"
    };
  }
  
  if (lowerCaseName.includes("north texas") || 
      lowerCaseName === "unt" || 
      lowerCaseName.includes("mean green")) {
    return {
      id: "north-texas",
      name: "North Texas",
      shortName: "UNT",
      mascot: "Mean Green",
      primaryColor: "#00853E",
      secondaryColor: "#FFFFFF",
      logoUrl: "/school-logos/non-mac/north-texas.png",
      city: "Denton",
      state: "TX"
    };
  }
  
  if (lowerCaseName.includes("illinois-chicago") ||
      lowerCaseName.includes("university of illinois chicago") ||
      lowerCaseName === "uic") {
    return {
      id: "university-of-illinois-chicago",
      name: "University of Illinois-Chicago",
      shortName: "UIC",
      mascot: "Flames",
      primaryColor: "#DE3337",
      secondaryColor: "#003EAA",
      logoUrl: "/school-logos/affiliate/uic.png", 
      city: "Chicago",
      state: "IL"
    };
  }
  
  if (lowerCaseName.includes("maryland") || 
      lowerCaseName === "umd" || 
      lowerCaseName.includes("terrapins") || 
      lowerCaseName.includes("terps")) {
    return {
      id: "maryland",
      name: "Maryland",
      shortName: "UMD",
      mascot: "Terrapins",
      primaryColor: "#E03a3e",
      secondaryColor: "#FFD520",
      logoUrl: "/school-logos/non-mac/maryland.png",
      city: "College Park",
      state: "MD"
    };
  }
  
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
  
  // Step 4: Check if it's a non-MAC school in our database
  const nonMacSchool = NON_MAC_SCHOOLS[normalizedName];
  if (nonMacSchool) {
    // Create a proper School object from our nonMacSchool data
    return {
      id: nonMacSchool.name.toLowerCase().replace(/\s+/g, "-"),
      name: nonMacSchool.name,
      shortName: nonMacSchool.shortName,
      mascot: "",
      primaryColor: nonMacSchool.primaryColor,
      secondaryColor: nonMacSchool.secondaryColor,
      logoUrl: nonMacSchool.logoUrl,
      city: "",
      state: ""
    };
  }
  
  // Step 5: Try partial matching with non-MAC schools
  for (const [schoolName, schoolData] of Object.entries(NON_MAC_SCHOOLS)) {
    if (schoolName.toLowerCase().includes(normalizedName.toLowerCase()) ||
        normalizedName.toLowerCase().includes(schoolName.toLowerCase())) {
      return {
        id: schoolData.name.toLowerCase().replace(/\s+/g, "-"),
        name: schoolData.name,
        shortName: schoolData.shortName,
        mascot: "",
        primaryColor: schoolData.primaryColor,
        secondaryColor: schoolData.secondaryColor,
        logoUrl: schoolData.logoUrl,
        city: "",
        state: ""
      };
    }
  }
  
  // Step 6: Try partial matching with MAC schools
  const partialMatch = macSchools.find(
    school => name.toLowerCase().includes(school.name.toLowerCase()) ||
              school.name.toLowerCase().includes(name.toLowerCase())
  );
  if (partialMatch) return partialMatch;
  
  // Step 7: If all else fails, create a generic school object with NCAA logo
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
  if (!name) return ncaaLogoUrl;
  
  // Special case handling for problematic schools in the screenshot
  if (name.toLowerCase().includes("mid-american conference") || name === "MAC") {
    return "/mac-logo.png";
  }
  
  if (name.toLowerCase().includes("university of illinois-chicago") || 
      name.toLowerCase().includes("illinois-chicago") || 
      name === "UIC") {
    return "/school-logos/affiliate/uic.png";
  }
  
  if (name.toLowerCase().includes("bowling green")) {
    return "/school-logos/bowlinggreen.png";
  }
  
  // Special school matching logic has been handled above
  
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