import { School } from "@shared/schema";
import { macSchools, ncaaLogoUrl } from "../data/macSchools";
import { 
  SCHOOL_NAME_MAPPINGS, 
  findLogoByNamePattern, 
  guessTeamColors,
  NonMacSchool
} from "./teamLogoMap";

/**
 * Find a matching school object by name
 * Uses fuzzy matching and common name variants
 * Prioritizes official MAC schedule team names
 * 
 * @param name The name of the school to find
 * @param context Optional context string to help resolve ambiguous names
 * @returns School object or undefined
 */
// Import NON_MAC_SCHOOLS directly from teamLogoMap
import { NON_MAC_SCHOOLS } from "./teamLogoMap";

export function findSchoolByName(name: string | undefined, context?: string): School | undefined {
  if (!name) return undefined;
  
  // Normalize the name for comparison
  const normalizedName = name.trim();
  
  // Special case handling for Valparaiso
  if (normalizedName.toLowerCase().includes("valparaiso") || 
      normalizedName.toLowerCase().includes("valpo") ||
      normalizedName.toLowerCase().includes("beacons")) {
    return {
      id: "valparaiso",
      name: "Valparaiso",
      shortName: "Valpo",
      mascot: "Beacons",
      primaryColor: "#402E82", // Valpo colors 
      secondaryColor: "#FDAC43",
      logoUrl: "/school-logos/non-mac/valparaiso.png",
      city: "Valparaiso",
      state: "IN"
    };
  }
  
  // Special case handling for Northern Kentucky
  if (normalizedName.toLowerCase().includes("northern kentucky") || 
      normalizedName.toLowerCase() === "nku" ||
      normalizedName.toLowerCase().includes("norse")) {
    return {
      id: "northern-kentucky",
      name: "Northern Kentucky",
      shortName: "NKU",
      mascot: "Norse",
      primaryColor: "#FFC72C", // NKU colors
      secondaryColor: "#000000",
      logoUrl: "/school-logos/non-mac/northernkentucky.png",
      city: "Highland Heights",
      state: "KY"
    };
  }
  
  // First, try exact match with MAC schools
  const macSchool = macSchools.find(s => 
    s.name.toLowerCase() === normalizedName.toLowerCase() || 
    s.shortName.toLowerCase() === normalizedName.toLowerCase()
  );
  
  if (macSchool) return macSchool;
  
  // Check for known name mappings
  const mappedName = SCHOOL_NAME_MAPPINGS[normalizedName];
  if (mappedName) {
    // Try to find the mapped name in MAC schools
    const mappedMacSchool = macSchools.find(s => 
      s.name.toLowerCase() === mappedName.toLowerCase() || 
      s.shortName.toLowerCase() === mappedName.toLowerCase()
    );
    
    if (mappedMacSchool) return mappedMacSchool;
    
    // If not a MAC school, check if it's in our non-MAC schools
    const nonMacSchool = NON_MAC_SCHOOLS[mappedName];
    if (nonMacSchool) {
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
  }
  
  // Direct lookup in non-MAC schools
  const nonMacSchool = NON_MAC_SCHOOLS[normalizedName];
  if (nonMacSchool) {
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
  
  // Try to match with non-MAC schools based on filename pattern
  // This helps use more of the available logo files
  const logoUrl = findLogoByNamePattern(normalizedName);
  const colors = guessTeamColors(normalizedName);
    
  // Fuzzy matching - first with MAC schools
  for (const school of macSchools) {
    if (
      school.name.toLowerCase().includes(normalizedName.toLowerCase()) ||
      normalizedName.toLowerCase().includes(school.name.toLowerCase()) ||
      school.shortName.toLowerCase().includes(normalizedName.toLowerCase()) ||
      normalizedName.toLowerCase().includes(school.shortName.toLowerCase())
    ) {
      return school;
    }
  }
  
  // Then with non-MAC schools
  for (const [key, school] of Object.entries(NON_MAC_SCHOOLS)) {
    const nonMacSchool = school as NonMacSchool;
    if (
      nonMacSchool.name.toLowerCase().includes(normalizedName.toLowerCase()) ||
      normalizedName.toLowerCase().includes(nonMacSchool.name.toLowerCase()) ||
      nonMacSchool.shortName.toLowerCase().includes(normalizedName.toLowerCase()) ||
      normalizedName.toLowerCase().includes(nonMacSchool.shortName.toLowerCase())
    ) {
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
  }
  
  // If still no match, create a school entry with potential logo match
  console.log(`Creating school with potential logo match: ${name} → ${logoUrl}`);
  
  // Create a school with inferred logo and default colors
  return {
    id: name.toLowerCase().replace(/\s+/g, "-"),
    name: name,
    shortName: name,
    mascot: "",
    primaryColor: colors.primary,
    secondaryColor: colors.secondary,
    logoUrl: logoUrl, // Try to use a matching logo file based on name
    city: "",
    state: ""
  };
}