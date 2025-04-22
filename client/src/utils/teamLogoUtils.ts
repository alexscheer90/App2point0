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
  "Miami (Ohio)": "Miami",
  "Miami OH": "Miami",
  "Miami University": "Miami",
  "RedHawks": "Miami",
  "Kent State": "Kent State",
  "Golden Flashes": "Kent State",
  "UMass": "Massachusetts",
  "Minutemen": "Massachusetts",
  "UT": "Toledo",
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
  "Huskies": "Northern Illinois",
  "Chippewas": "Central Michigan",
  "Central Michigan Chippewas": "Central Michigan",
  "Eastern Michigan Eagles": "Eastern Michigan",
  "Eagles": "Eastern Michigan",
  "Western Michigan Broncos": "Western Michigan",
  "Broncos": "Western Michigan",
  "Bowling Green Falcons": "Bowling Green",
  "Falcons": "Bowling Green",
  "Buffalo Bulls": "Buffalo",
  "Bulls": "Buffalo",
  
  // Common non-MAC opponents from official MAC schedule
  "Air Force": "Air Force",
  "Alabama": "Alabama",
  "Appalachian State": "Appalachian State",
  "App State": "Appalachian State",
  "App. State": "Appalachian State",
  "Arizona": "Arizona",
  "Arizona State": "Arizona State",
  "ASU": "Arizona State",
  "Arkansas": "Arkansas",
  "Arkansas State": "Arkansas State",
  "Army": "Army",
  "Auburn": "Auburn",
  "Baylor": "Baylor",
  "Boise State": "Boise State",
  "Boston College": "Boston College",
  "BC": "Boston College",
  "BYU": "BYU",
  "Brigham Young": "BYU",
  "California": "California",
  "Cal": "California",
  "Cincinnati": "Cincinnati",
  "UC": "Cincinnati",
  "Cincy": "Cincinnati",
  "Bearcats": "Cincinnati",
  "Clemson": "Clemson",
  "Coastal Carolina": "Coastal Carolina",
  "Colorado": "Colorado",
  "Colorado State": "Colorado State",
  "Connecticut": "Connecticut",
  "UConn": "Connecticut",
  "Duke": "Duke",
  "East Carolina": "East Carolina",
  "ECU": "East Carolina",
  "Florida": "Florida",
  "UF": "Florida",
  "Florida State": "Florida State",
  "FSU": "Florida State",
  "Fresno State": "Fresno State",
  "Georgia": "Georgia",
  "UGA": "Georgia",
  "Georgia Southern": "Georgia Southern",
  "Georgia State": "Georgia State",
  "Georgia Tech": "Georgia Tech",
  "GT": "Georgia Tech",
  "Hawaii": "Hawaii",
  "Houston": "Houston",
  "Illinois": "Illinois",
  "Indiana": "Indiana",
  "IU": "Indiana",
  "Iowa": "Iowa",
  "Iowa State": "Iowa State",
  "Kansas": "Kansas",
  "KU": "Kansas",
  "Kansas State": "Kansas State",
  "K-State": "Kansas State",
  "Kentucky": "Kentucky",
  "UK": "Kentucky",
  "Wildcats": "Kentucky",
  "Liberty": "Liberty",
  "Louisiana": "Louisiana",
  "UL": "Louisiana",
  "Louisiana Tech": "Louisiana Tech",
  "La. Tech": "Louisiana Tech",
  "Louisville": "Louisville",
  "LSU": "LSU",
  "Louisiana State": "LSU",
  "Marshall": "Marshall",
  "Maryland": "Maryland",
  "Terps": "Maryland",
  "Terrapins": "Maryland",
  "UMD": "Maryland",
  "Memphis": "Memphis",
  "Miami": "Miami FL",
  "Miami FL": "Miami FL",
  "Miami (FL)": "Miami FL",
  "The U": "Miami FL",
  "Michigan": "Michigan",
  "UM": "Michigan",
  "U-M": "Michigan",
  "Wolverines": "Michigan",
  "Michigan State": "Michigan State", 
  "MSU": "Michigan State",
  "Spartans": "Michigan State",
  "Middle Tennessee": "Middle Tennessee",
  "MTSU": "Middle Tennessee",
  "Minnesota": "Minnesota",
  "Mississippi State": "Mississippi State",
  "Miss. State": "Mississippi State",
  "Missouri": "Missouri",
  "Mizzou": "Missouri",
  "Navy": "Navy",
  "NC State": "NC State",
  "North Carolina State": "NC State",
  "Nebraska": "Nebraska",
  "UNL": "Nebraska",
  "Huskers": "Nebraska",
  "Cornhuskers": "Nebraska",
  "Nevada": "Nevada",
  "New Mexico": "New Mexico",
  "UNM": "New Mexico",
  "New Mexico State": "New Mexico State",
  "NMSU": "New Mexico State",
  "North Carolina": "North Carolina",
  "UNC": "North Carolina",
  "North Texas": "North Texas",
  "UNT": "North Texas",
  "Mean Green": "North Texas",
  "Northwestern": "Northwestern",
  "NW": "Northwestern",
  "Notre Dame": "Notre Dame",
  "ND": "Notre Dame",
  "Fighting Irish": "Notre Dame",
  "Ohio State": "Ohio State",
  "OSU": "Ohio State",
  "Buckeyes": "Ohio State",
  "Oklahoma": "Oklahoma",
  "OU": "Oklahoma",
  "Sooners": "Oklahoma",
  "Oklahoma State": "Oklahoma State",
  "OSU": "Oklahoma State",
  "Cowboys": "Oklahoma State",
  "Ole Miss": "Ole Miss",
  "Mississippi": "Ole Miss",
  "Oregon": "Oregon",
  "Ducks": "Oregon",
  "Oregon State": "Oregon State",
  "Beavers": "Oregon State",
  "Penn State": "Penn State",
  "PSU": "Penn State",
  "Nittany Lions": "Penn State",
  "Pittsburgh": "Pittsburgh",
  "Pitt": "Pittsburgh",
  "Panthers": "Pittsburgh",
  "Purdue": "Purdue",
  "Boilermakers": "Purdue",
  "Rice": "Rice",
  "Owls": "Rice",
  "Rutgers": "Rutgers",
  "RU": "Rutgers",
  "San Diego State": "San Diego State",
  "SDSU": "San Diego State",
  "San Jose State": "San Jose State",
  "SJSU": "San Jose State",
  "SMU": "SMU",
  "Southern Methodist": "SMU",
  "South Alabama": "South Alabama",
  "South Carolina": "South Carolina",
  "USC": "South Carolina",
  "Southern Miss": "Southern Miss",
  "USM": "Southern Miss",
  "Stanford": "Stanford",
  "Syracuse": "Syracuse",
  "Orange": "Syracuse",
  "TCU": "TCU",
  "Texas Christian": "TCU",
  "Temple": "Temple",
  "Owls": "Temple",
  "Tennessee": "Tennessee",
  "UT": "Tennessee",
  "Vols": "Tennessee",
  "Texas": "Texas",
  "UT Austin": "Texas",
  "Longhorns": "Texas",
  "Texas A&M": "Texas A&M",
  "TAMU": "Texas A&M",
  "Aggies": "Texas A&M",
  "Texas State": "Texas State",
  "Texas Tech": "Texas Tech",
  "TTU": "Texas Tech",
  "Red Raiders": "Texas Tech",
  "Troy": "Troy",
  "Trojans": "Troy",
  "Tulane": "Tulane",
  "Green Wave": "Tulane",
  "Tulsa": "Tulsa",
  "Golden Hurricane": "Tulsa",
  "UAB": "UAB",
  "Alabama-Birmingham": "UAB",
  "UCF": "UCF",
  "Central Florida": "UCF",
  "Knights": "UCF",
  "UCLA": "UCLA",
  "UNLV": "UNLV",
  "Nevada-Las Vegas": "UNLV",
  "Rebels": "UNLV",
  "USC": "USC",
  "Southern California": "USC",
  "USF": "USF",
  "South Florida": "USF",
  "Bulls": "USF",
  "Utah": "Utah",
  "Utes": "Utah",
  "Utah State": "Utah State",
  "Aggies": "Utah State",
  "UTEP": "UTEP",
  "Texas-El Paso": "UTEP",
  "UTSA": "UTSA",
  "Texas-San Antonio": "UTSA",
  "Roadrunners": "UTSA",
  "Vanderbilt": "Vanderbilt",
  "Vandy": "Vanderbilt",
  "Commodores": "Vanderbilt",
  "Virginia": "Virginia",
  "UVA": "Virginia",
  "Cavaliers": "Virginia",
  "Virginia Tech": "Virginia Tech",
  "VT": "Virginia Tech",
  "Hokies": "Virginia Tech",
  "Wake Forest": "Wake Forest",
  "Demon Deacons": "Wake Forest",
  "Washington": "Washington",
  "UW": "Washington",
  "Huskies": "Washington",
  "Washington State": "Washington State",
  "WSU": "Washington State",
  "Cougars": "Washington State",
  "West Virginia": "West Virginia",
  "WVU": "West Virginia",
  "Mountaineers": "West Virginia",
  "Western Kentucky": "Western Kentucky",
  "WKU": "Western Kentucky",
  "Hilltoppers": "Western Kentucky",
  "Wisconsin": "Wisconsin",
  "UW": "Wisconsin",
  "Badgers": "Wisconsin",
  "Wyoming": "Wyoming",
  "Cowboys": "Wyoming"
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
  // Group 1: Original defined schools
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
  },
  
  // Group 2: Additional schools with existing logo files
  "Air Force": {
    name: "Air Force",
    shortName: "AF",
    primaryColor: "#003087",
    secondaryColor: "#8A8D8F",
    logoUrl: "/school-logos/non-mac/airforce.png"
  },
  "Alabama": {
    name: "Alabama",
    shortName: "Bama",
    primaryColor: "#9E1B32",
    secondaryColor: "#FFFFFF",
    logoUrl: "/school-logos/non-mac/alabama.png"
  },
  "Appalachian State": {
    name: "Appalachian State",
    shortName: "App State",
    primaryColor: "#000000",
    secondaryColor: "#FFCC00",
    logoUrl: "/school-logos/non-mac/appstate.png"
  },
  "Arizona": {
    name: "Arizona",
    shortName: "Arizona",
    primaryColor: "#003366",
    secondaryColor: "#CC0033",
    logoUrl: "/school-logos/non-mac/arizona.png"
  },
  "Arizona State": {
    name: "Arizona State",
    shortName: "ASU",
    primaryColor: "#8C1D40",
    secondaryColor: "#FFC627",
    logoUrl: "/school-logos/non-mac/arizonastate.png"
  },
  "Arkansas": {
    name: "Arkansas",
    shortName: "Arkansas",
    primaryColor: "#9D2235",
    secondaryColor: "#FFFFFF",
    logoUrl: "/school-logos/non-mac/arkansas.png"
  },
  "Arkansas State": {
    name: "Arkansas State",
    shortName: "Ark State",
    primaryColor: "#CC092F",
    secondaryColor: "#000000",
    logoUrl: "/school-logos/non-mac/arkansasstate.png"
  },
  "Army": {
    name: "Army",
    shortName: "Army",
    primaryColor: "#000000",
    secondaryColor: "#D4BF91",
    logoUrl: "/school-logos/non-mac/army.png"
  },
  "Auburn": {
    name: "Auburn",
    shortName: "Auburn",
    primaryColor: "#0C2340",
    secondaryColor: "#E87722",
    logoUrl: "/school-logos/non-mac/auburn.png"
  },
  "Baylor": {
    name: "Baylor",
    shortName: "Baylor",
    primaryColor: "#003015",
    secondaryColor: "#FFB81C",
    logoUrl: "/school-logos/non-mac/baylor.png"
  },
  "Boise State": {
    name: "Boise State",
    shortName: "Boise St",
    primaryColor: "#0033A0",
    secondaryColor: "#D64309",
    logoUrl: "/school-logos/non-mac/boisestate.png"
  },
  "BYU": {
    name: "BYU",
    shortName: "BYU",
    primaryColor: "#002E5D",
    secondaryColor: "#FFFFFF",
    logoUrl: "/school-logos/non-mac/byu.png"
  },
  "California": {
    name: "California",
    shortName: "Cal",
    primaryColor: "#003262",
    secondaryColor: "#FDB515",
    logoUrl: "/school-logos/non-mac/california.png"
  },
  "Clemson": {
    name: "Clemson",
    shortName: "Clemson",
    primaryColor: "#F56600",
    secondaryColor: "#522D80",
    logoUrl: "/school-logos/non-mac/clemson.png"
  },
  "Coastal Carolina": {
    name: "Coastal Carolina",
    shortName: "Coastal",
    primaryColor: "#006F71",
    secondaryColor: "#A27752",
    logoUrl: "/school-logos/non-mac/coastalcarolina.png"
  },
  "Colorado": {
    name: "Colorado",
    shortName: "Colorado",
    primaryColor: "#CFB87C",
    secondaryColor: "#000000",
    logoUrl: "/school-logos/non-mac/colorado.png"
  },
  "Colorado State": {
    name: "Colorado State",
    shortName: "CSU",
    primaryColor: "#1E4D2B",
    secondaryColor: "#C8C372",
    logoUrl: "/school-logos/non-mac/coloradostate.png"
  },
  "Connecticut": {
    name: "Connecticut",
    shortName: "UConn",
    primaryColor: "#0E1A2F",
    secondaryColor: "#FFFFFF",
    logoUrl: "/school-logos/non-mac/connecticut.png"
  },
  "Duke": {
    name: "Duke",
    shortName: "Duke",
    primaryColor: "#001A57",
    secondaryColor: "#FFFFFF",
    logoUrl: "/school-logos/non-mac/duke.png"
  },
  "East Carolina": {
    name: "East Carolina",
    shortName: "ECU",
    primaryColor: "#592A8A",
    secondaryColor: "#FDC82F",
    logoUrl: "/school-logos/non-mac/eastcarolina.png"
  },
  "Florida": {
    name: "Florida",
    shortName: "Florida",
    primaryColor: "#0021A5",
    secondaryColor: "#FA4616",
    logoUrl: "/school-logos/non-mac/florida.png"
  },
  "Florida State": {
    name: "Florida State",
    shortName: "FSU",
    primaryColor: "#782F40",
    secondaryColor: "#CEB888",
    logoUrl: "/school-logos/non-mac/floridastate.png"
  },
  "Georgia": {
    name: "Georgia",
    shortName: "UGA",
    primaryColor: "#BA0C2F",
    secondaryColor: "#000000",
    logoUrl: "/school-logos/non-mac/georgia.png"
  },
  "Georgia Tech": {
    name: "Georgia Tech",
    shortName: "GT",
    primaryColor: "#B3A369",
    secondaryColor: "#003057",
    logoUrl: "/school-logos/non-mac/georgiatech.png"
  },
  "Houston": {
    name: "Houston",
    shortName: "Houston",
    primaryColor: "#C8102E",
    secondaryColor: "#76232F",
    logoUrl: "/school-logos/non-mac/houston.png"
  },
  "Illinois": {
    name: "Illinois",
    shortName: "Illinois",
    primaryColor: "#13294B",
    secondaryColor: "#E84A27",
    logoUrl: "/school-logos/non-mac/illinois.png"
  },
  "Indiana": {
    name: "Indiana",
    shortName: "Indiana",
    primaryColor: "#990000",
    secondaryColor: "#FFFFFF",
    logoUrl: "/school-logos/non-mac/indiana.png"
  },
  "Iowa": {
    name: "Iowa",
    shortName: "Iowa",
    primaryColor: "#000000",
    secondaryColor: "#FFCD00",
    logoUrl: "/school-logos/non-mac/iowa.png"
  },
  "Iowa State": {
    name: "Iowa State",
    shortName: "ISU",
    primaryColor: "#C8102E",
    secondaryColor: "#F1BE48",
    logoUrl: "/school-logos/non-mac/iowastate.png"
  },
  "Kansas": {
    name: "Kansas",
    shortName: "Kansas",
    primaryColor: "#0051BA",
    secondaryColor: "#E8000D",
    logoUrl: "/school-logos/non-mac/kansas.png"
  },
  "Kansas State": {
    name: "Kansas State",
    shortName: "K-State",
    primaryColor: "#512888",
    secondaryColor: "#D1D1D1",
    logoUrl: "/school-logos/non-mac/kansasstate.png"
  },
  "Louisville": {
    name: "Louisville",
    shortName: "Louisville",
    primaryColor: "#AD0000",
    secondaryColor: "#000000",
    logoUrl: "/school-logos/non-mac/louisville.png"
  },
  "LSU": {
    name: "LSU",
    shortName: "LSU",
    primaryColor: "#461D7C",
    secondaryColor: "#FDD023",
    logoUrl: "/school-logos/non-mac/lsu.png"
  },
  "Memphis": {
    name: "Memphis",
    shortName: "Memphis",
    primaryColor: "#003087",
    secondaryColor: "#898D8D",
    logoUrl: "/school-logos/non-mac/memphis.png"
  },
  "Miami FL": {
    name: "Miami FL",
    shortName: "Miami",
    primaryColor: "#F47321",
    secondaryColor: "#005030",
    logoUrl: "/school-logos/non-mac/miami.png"
  },
  "Minnesota": {
    name: "Minnesota",
    shortName: "Minnesota",
    primaryColor: "#7A0019",
    secondaryColor: "#FFCC33",
    logoUrl: "/school-logos/non-mac/minnesota.png"
  },
  "Mississippi State": {
    name: "Mississippi State",
    shortName: "Miss St",
    primaryColor: "#660000",
    secondaryColor: "#FFFFFF",
    logoUrl: "/school-logos/non-mac/mississippistate.png"
  },
  "Missouri": {
    name: "Missouri",
    shortName: "Mizzou",
    primaryColor: "#F1B82D",
    secondaryColor: "#000000",
    logoUrl: "/school-logos/non-mac/missouri.png"
  },
  "Navy": {
    name: "Navy",
    shortName: "Navy",
    primaryColor: "#00205B",
    secondaryColor: "#C5B783",
    logoUrl: "/school-logos/non-mac/navy.png"
  },
  "NC State": {
    name: "NC State",
    shortName: "NC State",
    primaryColor: "#CC0000",
    secondaryColor: "#000000",
    logoUrl: "/school-logos/non-mac/ncstate.png"
  },
  "Nevada": {
    name: "Nevada",
    shortName: "Nevada",
    primaryColor: "#003366",
    secondaryColor: "#807F84",
    logoUrl: "/school-logos/non-mac/nevada.png"
  },
  "North Carolina": {
    name: "North Carolina",
    shortName: "UNC",
    primaryColor: "#7BAFD4",
    secondaryColor: "#FFFFFF",
    logoUrl: "/school-logos/non-mac/northcarolina.png"
  },
  "Northwestern": {
    name: "Northwestern",
    shortName: "NW",
    primaryColor: "#4E2A84",
    secondaryColor: "#FFFFFF",
    logoUrl: "/school-logos/non-mac/northwestern.png"
  },
  "Ole Miss": {
    name: "Ole Miss",
    shortName: "Ole Miss",
    primaryColor: "#CE1126",
    secondaryColor: "#14213D",
    logoUrl: "/school-logos/non-mac/olemiss.png"
  },
  "Oklahoma": {
    name: "Oklahoma",
    shortName: "OU",
    primaryColor: "#841617",
    secondaryColor: "#FFFFFF",
    logoUrl: "/school-logos/non-mac/oklahoma.png"
  },
  "Oklahoma State": {
    name: "Oklahoma State",
    shortName: "OK State",
    primaryColor: "#FF7300",
    secondaryColor: "#000000",
    logoUrl: "/school-logos/non-mac/oklahomastate.png"
  },
  "Oregon": {
    name: "Oregon",
    shortName: "Oregon",
    primaryColor: "#154733",
    secondaryColor: "#FEE123",
    logoUrl: "/school-logos/non-mac/oregon.png"
  },
  "Oregon State": {
    name: "Oregon State",
    shortName: "Oregon St",
    primaryColor: "#DC4405",
    secondaryColor: "#000000",
    logoUrl: "/school-logos/non-mac/oregonstate.png"
  },
  "Pittsburgh": {
    name: "Pittsburgh",
    shortName: "Pitt",
    primaryColor: "#003594",
    secondaryColor: "#FFB81C",
    logoUrl: "/school-logos/non-mac/pitt.png"
  },
  "Rutgers": {
    name: "Rutgers",
    shortName: "Rutgers",
    primaryColor: "#CC0033",
    secondaryColor: "#5F6A72",
    logoUrl: "/school-logos/non-mac/rutgers.png"
  },
  "Syracuse": {
    name: "Syracuse",
    shortName: "Syracuse",
    primaryColor: "#F76900",
    secondaryColor: "#000E54",
    logoUrl: "/school-logos/non-mac/syracuse.png"
  },
  "TCU": {
    name: "TCU",
    shortName: "TCU",
    primaryColor: "#4D1979",
    secondaryColor: "#FFFFFF",
    logoUrl: "/school-logos/non-mac/tcu.png"
  },
  "Temple": {
    name: "Temple",
    shortName: "Temple",
    primaryColor: "#9D2235",
    secondaryColor: "#FFED00",
    logoUrl: "/school-logos/non-mac/temple.png"
  },
  "Tennessee": {
    name: "Tennessee",
    shortName: "Tennessee",
    primaryColor: "#FF8200",
    secondaryColor: "#FFFFFF",
    logoUrl: "/school-logos/non-mac/tennessee.png"
  },
  "Texas A&M": {
    name: "Texas A&M",
    shortName: "Texas A&M",
    primaryColor: "#500000",
    secondaryColor: "#FFFFFF",
    logoUrl: "/school-logos/non-mac/texasam.png"
  },
  "UCLA": {
    name: "UCLA",
    shortName: "UCLA",
    primaryColor: "#2D68C4",
    secondaryColor: "#F2A900",
    logoUrl: "/school-logos/non-mac/ucla.png"
  },
  "USC": {
    name: "USC",
    shortName: "USC",
    primaryColor: "#990000",
    secondaryColor: "#FFC72C",
    logoUrl: "/school-logos/non-mac/usc.png"
  },
  "Utah": {
    name: "Utah",
    shortName: "Utah",
    primaryColor: "#CC0000",
    secondaryColor: "#FFFFFF",
    logoUrl: "/school-logos/non-mac/utah.png"
  },
  "Vanderbilt": {
    name: "Vanderbilt",
    shortName: "Vandy",
    primaryColor: "#000000",
    secondaryColor: "#866D4B",
    logoUrl: "/school-logos/non-mac/vanderbilt.png"
  },
  "Virginia": {
    name: "Virginia",
    shortName: "UVA",
    primaryColor: "#232D4B",
    secondaryColor: "#F84C1E",
    logoUrl: "/school-logos/non-mac/virginia.png"
  },
  "Virginia Tech": {
    name: "Virginia Tech",
    shortName: "VT",
    primaryColor: "#630031",
    secondaryColor: "#CF4420",
    logoUrl: "/school-logos/non-mac/virginiatech.png"
  },
  "Wake Forest": {
    name: "Wake Forest",
    shortName: "Wake",
    primaryColor: "#000000",
    secondaryColor: "#9E7E38",
    logoUrl: "/school-logos/non-mac/wakeforest.png"
  },
  "Washington": {
    name: "Washington",
    shortName: "UW",
    primaryColor: "#4B2E83",
    secondaryColor: "#B7A57A",
    logoUrl: "/school-logos/non-mac/washington.png"
  },
  "West Virginia": {
    name: "West Virginia",
    shortName: "WVU",
    primaryColor: "#002855",
    secondaryColor: "#EAAA00",
    logoUrl: "/school-logos/non-mac/westvirginia.png"
  },
  "Wisconsin": {
    name: "Wisconsin",
    shortName: "Wisconsin",
    primaryColor: "#C5050C",
    secondaryColor: "#FFFFFF",
    logoUrl: "/school-logos/non-mac/wisconsin.png"
  },
  "Wyoming": {
    name: "Wyoming",
    shortName: "Wyoming",
    primaryColor: "#492F24",
    secondaryColor: "#FFC425",
    logoUrl: "/school-logos/non-mac/wyoming.png"
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
  // Add debugging for the problematic schools
  if (name && (
      name.toLowerCase().includes("michigan state") || 
      name.toLowerCase().includes("texas tech") || 
      name.toLowerCase().includes("north texas"))) {
    console.log(`Debug logoUrl - School name: "${name}", path: ${findSchoolByName(name)?.logoUrl}`);
  }
  
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