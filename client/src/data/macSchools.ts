import { School } from "@shared/schema";

// Use direct paths to the logo files instead of imports
// MAC School logos (main conference members)
const akronLogo = "/school-logos/akron.png";
const ballStateLogo = "/school-logos/ballstate.png";
const bgsuLogo = "/school-logos/bowlinggreen.png";
const buffaloLogo = "/school-logos/buffalo.png";
const cmuLogo = "/school-logos/centralmichigan.png";
const emuLogo = "/school-logos/easternmichigan.png";
const kentStateLogo = "/school-logos/kentstate.png";
const miamiLogo = "/school-logos/miamioh.png";
const niuLogo = "/school-logos/northernillinois.png";
const ohioLogo = "/school-logos/ohio.png";
const toledoLogo = "/school-logos/toledo.png";
const wmuLogo = "/school-logos/westernmichigan.png";
const massachusettsLogo = "/school-logos/massachusetts.png";

// MAC conference logo
const macConferenceLogo = "/school-logos/mac-conference.png";

// Affiliate school logos
// We'll keep the existing ones in the attached_assets directory for now
const jmuLogo = "/attached_assets/JMU_Duke_Dog_Head_logo.png";
const appStateLogo = "/attached_assets/Appalachian_State_Mountaineers_logo.svg.png";
const longwoodLogo = "/attached_assets/Longwood_Lancers_logo.svg.png";
const bellarmineLogo = "/attached_assets/Bellarmine.png";
const chicagoStateLogo = "/attached_assets/Chicago_State_Cougars_logo.svg.png";
const siuEdwardsvilleLogo = "/attached_assets/SIU Edwardsville.png";
const georgeMasonLogo = "/attached_assets/George Mason.png";
const riderLogo = "/attached_assets/Rider_Broncs.svg.png";
const lockHavenLogo = "/attached_assets/Lock_Haven_Bald_Eagles_logo.svg.png";
const edinboroLogo = "/attached_assets/Edinboro_Fighting_Scots_current_logo.svg.png";
const clevelandStateLogo = "/attached_assets/Cleveland State.png";
const clarionLogo = "/attached_assets/Clarion_Golden_Eagles_logo.svg.png";
const bloomsburgLogo = "/attached_assets/Bloomsburg Huskies Logo-01.png";
const robertMorrisLogo = "/attached_assets/rmu_logo_1.png";
const youngstownStateLogo = "/attached_assets/Youngstown_State_Penguins_logo.svg.png";
const detroitMercyLogo = "/attached_assets/Detroit_Titans_logo.svg.png";
const uicLogo = "/attached_assets/UIC_Flames_wordmark.svg.png";
const ncaaLogo = "/attached_assets/IMG_0788.png"; // NCAA logo for non-MAC schools

// Export the NCAA logo for use in other components
export const ncaaLogoUrl = ncaaLogo;

// This data would ideally come from an API, but for demo purposes
// we're hard-coding the Mid-American Conference schools
export const macSchools: School[] = [
  {
    id: "akron",
    name: "Akron",
    shortName: "Akron",
    mascot: "Zips",
    primaryColor: "#041E42",
    secondaryColor: "#A89968",
    logoUrl: akronLogo,
    city: "Akron",
    state: "OH",
  },
  {
    id: "ballstate",
    name: "Ball State",
    shortName: "Ball St",
    mascot: "Cardinals",
    primaryColor: "#BA0C2F",
    secondaryColor: "#FFFFFF",
    logoUrl: ballStateLogo,
    city: "Muncie",
    state: "IN",
  },
  {
    id: "bowlinggreen",
    name: "Bowling Green",
    shortName: "BGSU",
    mascot: "Falcons",
    primaryColor: "#FE5000",
    secondaryColor: "#4F2C1D",
    logoUrl: bgsuLogo,
    city: "Bowling Green",
    state: "OH",
  },
  {
    id: "buffalo",
    name: "Buffalo",
    shortName: "UB",
    mascot: "Bulls",
    primaryColor: "#005BBB",
    secondaryColor: "#FFFFFF",
    logoUrl: buffaloLogo,
    city: "Buffalo",
    state: "NY",
  },
  {
    id: "centralmichigan",
    name: "Central Michigan",
    shortName: "CMU",
    mascot: "Chippewas",
    primaryColor: "#6A0032",
    secondaryColor: "#FFC82E",
    logoUrl: cmuLogo,
    city: "Mount Pleasant",
    state: "MI",
  },
  {
    id: "easternmichigan",
    name: "Eastern Michigan",
    shortName: "EMU",
    mascot: "Eagles",
    primaryColor: "#046A38",
    secondaryColor: "#777777",
    logoUrl: emuLogo,
    city: "Ypsilanti",
    state: "MI",
  },
  {
    id: "kentstate",
    name: "Kent State",
    shortName: "Kent St",
    mascot: "Golden Flashes",
    primaryColor: "#002664",
    secondaryColor: "#EAAB00",
    logoUrl: kentStateLogo,
    city: "Kent",
    state: "OH",
  },
  {
    id: "massachusetts",
    name: "Massachusetts",
    shortName: "UMass",
    mascot: "Minutemen",
    primaryColor: "#881c1c",
    secondaryColor: "#FFFFFF",
    logoUrl: massachusettsLogo,
    city: "Amherst",
    state: "MA",
  },
  {
    id: "miamioh",
    name: "Miami",
    shortName: "Miami",
    mascot: "RedHawks",
    primaryColor: "#B61E2E",
    secondaryColor: "#FFFFFF",
    logoUrl: miamiLogo,
    city: "Oxford",
    state: "OH",
  },
  {
    id: "northernillinois",
    name: "Northern Illinois",
    shortName: "NIU",
    mascot: "Huskies",
    primaryColor: "#BA0C2F",
    secondaryColor: "#000000",
    logoUrl: niuLogo,
    city: "DeKalb",
    state: "IL",
  },
  {
    id: "ohio",
    name: "Ohio",
    shortName: "Ohio",
    mascot: "Bobcats",
    primaryColor: "#00694E",
    secondaryColor: "#CDA077",
    logoUrl: ohioLogo,
    city: "Athens",
    state: "OH",
  },
  {
    id: "toledo",
    name: "Toledo",
    shortName: "UT",
    mascot: "Rockets",
    primaryColor: "#003E7E",
    secondaryColor: "#FFD200",
    logoUrl: toledoLogo,
    city: "Toledo",
    state: "OH",
  },
  {
    id: "westernmichigan",
    name: "Western Michigan",
    shortName: "WMU",
    mascot: "Broncos",
    primaryColor: "#6C4023",
    secondaryColor: "#B5A167",
    logoUrl: wmuLogo,
    city: "Kalamazoo",
    state: "MI",
  },
  // Affiliate schools - Field Hockey (MAC affiliate members)
  {
    id: "jmu",
    name: "James Madison",
    shortName: "JMU",
    mascot: "Dukes",
    primaryColor: "#450084", // Purple
    secondaryColor: "#CBB677", // Gold
    logoUrl: jmuLogo,
    city: "Harrisonburg",
    state: "VA",
    affiliate: true
  },
  {
    id: "appstate",
    name: "Appalachian State",
    shortName: "App State",
    mascot: "Mountaineers",
    primaryColor: "#000000", // Black
    secondaryColor: "#FFCC00", // Gold
    logoUrl: appStateLogo,
    city: "Boone",
    state: "NC",
    affiliate: true
  },
  {
    id: "longwood",
    name: "Longwood",
    shortName: "Longwood",
    mascot: "Lancers",
    primaryColor: "#00559A", // Blue
    secondaryColor: "#9DA5A8", // Gray
    logoUrl: longwoodLogo,
    city: "Farmville",
    state: "VA",
    affiliate: true
  },
  {
    id: "bellarmine",
    name: "Bellarmine",
    shortName: "Bellarmine",
    mascot: "Knights",
    primaryColor: "#B01E24", // Red
    secondaryColor: "#FFFFFF", // White
    logoUrl: bellarmineLogo,
    city: "Louisville",
    state: "KY",
    affiliate: true
  },
  {
    id: "chicagostate",
    name: "Chicago State",
    shortName: "Chicago St",
    mascot: "Cougars",
    primaryColor: "#006747", // Green
    secondaryColor: "#FFFFFF", // White
    logoUrl: chicagoStateLogo,
    city: "Chicago",
    state: "IL",
    affiliate: true
  },
  {
    id: "siuedwardsville",
    name: "SIU Edwardsville",
    shortName: "SIUE",
    mascot: "Cougars",
    primaryColor: "#CC0000", // Red
    secondaryColor: "#000000", // Black
    logoUrl: siuEdwardsvilleLogo,
    city: "Edwardsville",
    state: "IL",
    affiliate: true
  },
  {
    id: "lockhaven",
    name: "Lock Haven",
    shortName: "Lock Haven",
    mascot: "Bald Eagles",
    primaryColor: "#B31B1B",
    secondaryColor: "#FFFFFF",
    logoUrl: lockHavenLogo,
    city: "Lock Haven",
    state: "PA",
    affiliate: true
  },
  {
    id: "georgemason",
    name: "George Mason",
    shortName: "GMU",
    mascot: "Patriots",
    primaryColor: "#008844", // Lighter Green
    secondaryColor: "#FFCC33", // Gold
    logoUrl: georgeMasonLogo,
    city: "Fairfax",
    state: "VA",
    affiliate: true
  },
  {
    id: "rider",
    name: "Rider",
    shortName: "Rider",
    mascot: "Broncs",
    primaryColor: "#98002E", // Crimson
    secondaryColor: "#6B6B6B", // Gray
    logoUrl: riderLogo,
    city: "Lawrenceville",
    state: "NJ",
    affiliate: true
  },
  {
    id: "edinboro",
    name: "Edinboro",
    shortName: "Edinboro",
    mascot: "Fighting Scots",
    primaryColor: "#AF1E2D",
    secondaryColor: "#FFFFFF",
    logoUrl: edinboroLogo,
    city: "Edinboro",
    state: "PA",
    affiliate: true
  },
  {
    id: "clevelandstate",
    name: "Cleveland State",
    shortName: "CSU",
    mascot: "Vikings",
    primaryColor: "#006A4D", // Green
    secondaryColor: "#000000", // Black
    logoUrl: clevelandStateLogo,
    city: "Cleveland",
    state: "OH",
    affiliate: true
  },
  {
    id: "clarion",
    name: "Clarion",
    shortName: "Clarion",
    mascot: "Golden Eagles",
    primaryColor: "#0055a5", // Lighter Blue
    secondaryColor: "#FFD900", // Gold
    logoUrl: clarionLogo,
    city: "Clarion",
    state: "PA",
    affiliate: true
  },
  {
    id: "bloomsburg",
    name: "Bloomsburg",
    shortName: "Bloomsburg",
    mascot: "Huskies",
    primaryColor: "#9E1B32", // Maroon
    secondaryColor: "#F1C400", // Gold
    logoUrl: bloomsburgLogo,
    city: "Bloomsburg",
    state: "PA",
    affiliate: true
  },
  {
    id: "robertmorris",
    name: "Robert Morris",
    shortName: "RMU",
    mascot: "Colonials",
    primaryColor: "#14234B", // Navy
    secondaryColor: "#A6192E", // Red
    logoUrl: robertMorrisLogo,
    city: "Moon Township",
    state: "PA",
    affiliate: true
  },
  {
    id: "detroitmercy",
    name: "Detroit Mercy",
    shortName: "Detroit",
    mascot: "Titans",
    primaryColor: "#E51636", // Red
    secondaryColor: "#041E42", // Navy
    logoUrl: detroitMercyLogo,
    city: "Detroit",
    state: "MI",
    affiliate: true
  },
  {
    id: "youngstownstate",
    name: "Youngstown State",
    shortName: "YSU",
    mascot: "Penguins",
    primaryColor: "#C8102E", // Red
    secondaryColor: "#000000", // Black
    logoUrl: youngstownStateLogo,
    city: "Youngstown",
    state: "OH",
    affiliate: true
  },
  {
    id: "uic",
    name: "UIC",
    shortName: "UIC",
    mascot: "Flames",
    primaryColor: "#D50032", // Red
    secondaryColor: "#001E62", // Navy
    logoUrl: uicLogo,
    city: "Chicago",
    state: "IL",
    affiliate: true
  }
];
