import { School } from "@shared/schema";
import akronLogo from "@assets/Akron.png";
import ballStateLogo from "@assets/Ball State.png";
import bgsuLogo from "@assets/BGSU.png";
import buffaloLogo from "@assets/Buffalo.png";
import cmuLogo from "@assets/CMU.png";
import emuLogo from "@assets/EMU.png";
import kentStateLogo from "@assets/Kent State.png";
import miamiLogo from "@assets/Miami.png";
import niuLogo from "@assets/NIU.png";
import ohioLogo from "@assets/Ohio.png";
import toledoLogo from "@assets/Toledo.png";
import wmuLogo from "@assets/WMU.png";
import umassLogo from "@assets/UMass.png";

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
    secondaryColor: "#FFFFFF",
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
    id: "umass",
    name: "Massachusetts",
    shortName: "UMass",
    mascot: "Minutemen",
    primaryColor: "#881c1c",
    secondaryColor: "#FFFFFF",
    logoUrl: umassLogo,
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
  }
];
