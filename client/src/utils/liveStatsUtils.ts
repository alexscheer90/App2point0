import { School, Sport } from "@shared/schema";

/**
 * Generated URL for Sidearm live stats based on school and sport
 * 
 * @param school The school hosting the game
 * @param sport The sport being played
 * @returns URL string for the Sidearm live stats page
 */
export function generateLiveStatsUrl(school: School, sport: Sport): string {
  // Convert school ID to domain name format
  let domain = "";
  
  // Map school IDs to their respective domains
  switch (school.id) {
    case "akron":
      domain = "gozips.com";
      break;
    case "ballstate":
      domain = "ballstatesports.com";
      break;
    case "bowlinggreen":
      domain = "bgsufalcons.com";
      break;
    case "buffalo":
      domain = "ubbulls.com";
      break;
    case "centralmichigan":
      domain = "cmuchippewas.com";
      break;
    case "easternmichigan":
      domain = "emueagles.com";
      break;
    case "kentstate":
      domain = "kentstatesports.com";
      break;
    case "miamioh":
      domain = "miamiredhawks.com";
      break;
    case "northernillinois":
      domain = "niuhuskies.com";
      break;
    case "ohio":
      domain = "ohiobobcats.com";
      break;
    case "toledo":
      domain = "utrockets.com";
      break;
    case "westernmichigan":
      domain = "wmubroncos.com";
      break;
    case "massachusetts":
      domain = "umassathletics.com";
      break;
    // Add any affiliate schools as needed
    default:
      // If school ID is not recognized, try to construct a domain from the short name
      domain = `${school.shortName.toLowerCase()}.com`;
  }
  
  // Format the sport ID to match Sidearm's format
  let sportPath = sport.id;
  
  // Convert sport ID to Sidearm's path format if needed
  switch (sport.id) {
    case "mbball":
      sportPath = "mbball";
      break;
    case "wbball":
      sportPath = "wbball";
      break;
    case "football":
      sportPath = "football";
      break;
    case "baseball":
      sportPath = "baseball";
      break;
    case "softball":
      sportPath = "softball";
      break;
    case "volleyball":
      sportPath = "wvball";
      break;
    case "msoccer":
      sportPath = "msoc";
      break;
    case "wsoccer":
      sportPath = "wsoc";
      break;
    // Add more sport mappings as needed
    default:
      sportPath = sport.id;
  }
  
  // Return the full URL
  return `https://${domain}/sidearmstats/${sportPath}/summary`;
}

/**
 * Determines if a game should have live stats based on status
 * 
 * @param status The current game status
 * @returns Boolean indicating if live stats should be available
 */
export function shouldShowLiveStats(status: string): boolean {
  return status === 'live' || status === 'final';
}