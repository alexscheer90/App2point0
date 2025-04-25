import { Rivalry } from "@shared/schema";

// This data would ideally come from an API, but for demo purposes
// we're hard-coding the Mid-American Conference football rivalries
export const macRivalries: Rivalry[] = [
  {
    id: "anniversary-award",
    name: "Anniversary Award",
    team1Id: "bowlinggreen",
    team2Id: "kentstate",
    series: {
      team1Wins: 60,
      team2Wins: 23,
      ties: 6
    },
    trophyName: "Anniversary Award",
    trophyImagePath: "@assets/Anniversary_Award_Front.jpg",
    firstGame: "1920-11-06",
    description: "The Anniversary Award is presented to the winner of the football game between Kent State and Bowling Green. The award commemorates the founding of both institutions, which trace their roots back to 1910, with the award being inaugurated in 1985."
  },
  {
    id: "battle-for-the-bay-state",
    name: "Battle for the Bay State",
    team1Id: "massachusetts",
    team2Id: "boston-college",
    series: {
      team1Wins: 5,
      team2Wins: 22,
      ties: 0
    },
    firstGame: "1899-10-21",
    description: "Though Boston College is not a MAC school, the in-state rivalry between Massachusetts and Boston College represents bragging rights for college football in Massachusetts. The two schools have played intermittently since their first meeting in 1899."
  },
  {
    id: "battle-of-i75",
    name: "Battle of I-75",
    team1Id: "toledo",
    team2Id: "bowlinggreen",
    series: {
      team1Wins: 42,
      team2Wins: 40,
      ties: 4
    },
    trophyName: "I-75 Trophy",
    trophyImagePath: "@assets/battle_of_i-75_trophy.0.jpg",
    firstGame: "1919-11-06",
    description: "The Battle of I-75 is played between the Toledo Rockets and the Bowling Green Falcons, named after Interstate 75 which connects the two schools, separating them by just 25 miles. The rivalry dates back to 1919 and is one of the most heated in the MAC.",
    lastGameId: "game1"
  },
  {
    id: "battle-of-the-bricks",
    name: "Battle of the Bricks",
    team1Id: "miamioh",
    team2Id: "ohio",
    series: {
      team1Wins: 54,
      team2Wins: 40,
      ties: 2
    },
    trophyName: "Battle of the Bricks",
    trophyImagePath: "@assets/Battle of the bricks.jpg",
    firstGame: "1908-11-28",
    description: "The Battle of the Bricks is contested between Miami University and Ohio University, two of the oldest universities in Ohio. The name references the brick architecture that both historic campuses share. The rivalry began in 1908 and is one of the oldest in the MAC."
  },
  {
    id: "bronze-stalk",
    name: "Battle for the Bronze Stalk",
    team1Id: "ballstate",
    team2Id: "northernillinois",
    series: {
      team1Wins: 22,
      team2Wins: 24,
      ties: 2
    },
    trophyName: "Bronze Stalk",
    trophyImagePath: "@assets/Bronze Stalk.webp",
    firstGame: "1941-09-27",
    description: "The Bronze Stalk trophy represents the importance of corn to the local economies of Illinois and Indiana. The trophy was introduced in 2008, though the rivalry between Northern Illinois and Ball State dates back to 1941."
  },
  {
    id: "wagon-wheel",
    name: "Battle for the Wagon Wheel",
    team1Id: "akron",
    team2Id: "kentstate",
    series: {
      team1Wins: 14,
      team2Wins: 25,
      ties: 1
    },
    trophyName: "Wagon Wheel",
    trophyImagePath: "@assets/Wagon Wheel.jpg",
    firstGame: "1923-11-09",
    description: "The Battle for the Wagon Wheel is contested between Kent State and Akron. The trophy originated when Dr. Kenneth Clement found a small wooden wagon wheel in an Akron barn that is believed to have been part of the carriage that carried John R. Buchtel, the founder of what became the University of Akron."
  },
  {
    id: "mallory-cup",
    name: "Mallory Cup",
    team1Id: "northernillinois",
    team2Id: "miamioh",
    series: {
      team1Wins: 10,
      team2Wins: 8,
      ties: 0
    },
    trophyName: "Mallory Cup",
    firstGame: "1969-11-01",
    description: "The Mallory Cup honors Bill Mallory, who coached both Northern Illinois and Miami to MAC championships. The trophy was established in 2008 and is awarded to the winner of the NIU-Miami football game."
  },
  {
    id: "michigan-mac",
    name: "Michigan MAC Trophy",
    team1Id: "centralmichigan",
    team2Id: "westernmichigan",
    team3Id: "easternmichigan",
    series: {
      team1Wins: 9,  // CMU trophy wins since 2005
      team2Wins: 8,  // WMU trophy wins since 2005
      team3Wins: 5,  // EMU trophy wins since 2005
      ties: 0
    },
    trophyName: "Michigan MAC Trophy",
    trophyImagePath: "@assets/Michigan MAC trophy.jpg",
    firstGame: "1907-10-16",
    description: "The Michigan MAC Trophy is contested between Central Michigan, Eastern Michigan, and Western Michigan. The trophy was established in 2005 to be awarded to the Michigan-based MAC school with the best head-to-head record each year."
  },
  {
    id: "minuteman-musket",
    name: "Minuteman Musket",
    team1Id: "massachusetts",
    team2Id: "connecticut",
    series: {
      team1Wins: 38,
      team2Wins: 39,
      ties: 2
    },
    trophyName: "Minuteman Musket",
    firstGame: "1897-11-09",
    description: "The Massachusetts-UConn rivalry is symbolized by the Minuteman Musket, which was introduced in 2004. Though UConn is no longer in the same conference as Massachusetts, the regional rivalry remains an important tradition for both schools."
  },
  {
    id: "victory-bell",
    name: "Victory Bell",
    team1Id: "miamioh",
    team2Id: "cincinnati",
    series: {
      team1Wins: 59,
      team2Wins: 60,
      ties: 7
    },
    trophyName: "Victory Bell",
    firstGame: "1888-12-08",
    description: "Although Cincinnati is not a MAC school, the Victory Bell game between Miami and Cincinnati is one of the oldest non-conference rivalries in college football, dating back to 1888. The bell itself was a gift from Miami's Chi Omega sorority in 1927."
  },
  {
    id: "victory-cannon",
    name: "Victory Cannon",
    team1Id: "centralmichigan",
    team2Id: "westernmichigan",
    series: {
      team1Wins: 21,
      team2Wins: 51,
      ties: 2
    },
    trophyName: "Victory Cannon",
    firstGame: "1907-10-16",
    description: "The Victory Cannon is awarded to the winner of the annual Central Michigan-Western Michigan football game. Established in 2008, the Victory Cannon is separate from the Michigan MAC Trophy and specifically celebrates this historic rivalry that dates back to 1907."
  }
];