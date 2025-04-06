import { SchoolSound } from "@shared/schema";

// This data would ideally come from an API, but for demo purposes
// we're hard-coding the Mid-American Conference school sounds
export const macSchoolSounds: SchoolSound[] = [
  // Akron
  {
    id: "akron-fight",
    schoolId: "akron",
    type: "fight_song",
    title: "Akron Blue and Gold",
    lyrics: "We cheer the Akron Blue and Gold,\nWe cheer as the colors fly.\nWe sing the glory of her name,\nHer name will never die!\nFight! Fight! Fight!\nWe cheer the Akron warriors bold,\nFor they shall win the day.\nAs we march along to VICTORY,\nFor the Akron Blue and Gold!",
    description: "Akron Blue and Gold is the official fight song of the University of Akron.",
    audioUrl: "/sounds/akron-fight.mp3"
  },
  {
    id: "akron-alma",
    schoolId: "akron",
    type: "alma_mater",
    title: "Alma Mater",
    lyrics: "In a valley fair and beautiful\nStands our Alma Mater true.\nAkron University, we hail thee,\nLoyal sons and daughters too.\nThe Buchtelites of yore have left us\nTheir tradition, honored bright;\nWe shall always keep it shining,\nA beacon guiding light.",
    description: "The Alma Mater of the University of Akron is performed at all major university events.",
    audioUrl: "/sounds/akron-alma.mp3"
  },
  
  // Ball State
  {
    id: "ballstate-fight",
    schoolId: "ballstate",
    type: "fight_song",
    title: "Fight Song",
    lyrics: "Fight team fight for Ball State,\nWe must win this game.\nOnward now you Cardinals,\nBring glory to your name.\nFight! Fight! Fight!\nAs the Cardinals go flying,\nProud and bold and true,\nWe're behind you all the way,\nFight team fight for B-S-U!",
    description: "Ball State's Fight Song is played at all athletic events.",
    audioUrl: "/sounds/ballstate-fight.mp3"
  },
  {
    id: "ballstate-alma",
    schoolId: "ballstate",
    type: "alma_mater",
    title: "Alma Mater",
    lyrics: "In the halls of learning,\nStand her children all,\nProudly sing to thee our alma mater,\nLoyal through the years we'll be\nThough we travel far from thee,\nWith thy banner high unfurled,\nTill all the world shall see.\nLift the chorus, speed it onward,\nLoud our praises tell.\nHail to thee our alma mater,\nBall State, hail all hail.",
    description: "Ball State's Alma Mater is traditionally performed at the conclusion of university ceremonies.",
    audioUrl: "/sounds/ballstate-alma.mp3"
  },
  
  // Bowling Green
  {
    id: "bowlinggreen-fight",
    schoolId: "bowlinggreen",
    type: "fight_song",
    title: "Forward Falcons",
    lyrics: "Forward Falcons, Forward Falcons,\nFight for victory,\nShow our spirit, Make them fear it,\nFight for 'ol Bee Gee.\nForward Falcons, Forward Falcons,\nMake the contest keen,\nShout out the fame of our mighty name,\nAnd win for Bowling Green!",
    description: "Forward Falcons is the official fight song of Bowling Green State University.",
    audioUrl: "/sounds/bowlinggreen-fight.mp3"
  },
  {
    id: "bowlinggreen-alma",
    schoolId: "bowlinggreen",
    type: "alma_mater",
    title: "Alma Mater",
    lyrics: "Alma Mater hear us,\nAs we praise thy name,\nMake us worthy sons and daughters,\nAdding to thy fame.\nTime will treat you kindly,\nYears from now you'll be,\nEver dearer in our hearts,\nOur University.",
    description: "BGSU's Alma Mater is performed at graduations and other formal university events.",
    audioUrl: "/sounds/bowlinggreen-alma.mp3"
  },
  
  // Buffalo
  {
    id: "buffalo-fight",
    schoolId: "buffalo",
    type: "fight_song",
    title: "Victory March",
    lyrics: "Fight, fight, fight for Buffalo,\nStand up and cheer for the Blue and White.\nOur teams are fighting with all their might,\nAnd we will win, yes, win this game today.\nFight, fight, fight for Buffalo,\nStand behind our men so true.\nThe team is counting upon you,\nSo shout for victory and Buffalo U!",
    description: "The University at Buffalo Victory March is performed by the Thunder of the East marching band at football games.",
    audioUrl: "/sounds/buffalo-fight.mp3"
  },
  {
    id: "buffalo-alma",
    schoolId: "buffalo",
    type: "alma_mater",
    title: "Alma Mater",
    lyrics: "College days swiftly pass,\nImbued with memories fond,\nAnd lingering comes the thought\nWhen we must part from thee.\nBut in the years to be,\nWherever we may roam,\nWith fondest memory,\nWe'll think of thee, our home.",
    description: "UB's Alma Mater dates back to the early 20th century.",
    audioUrl: "/sounds/buffalo-alma.mp3"
  },
  
  // Central Michigan
  {
    id: "cmu-fight",
    schoolId: "centralmichigan",
    type: "fight_song",
    title: "The Fighting Chippewa",
    lyrics: "The Fighting Chippewa,\nWe're all behind ya,\nThe fighting Maroon and Gold,\nThat's raring to go.\nFight! Fight! Fight!\nWith all your might,\nSmashing, crashing,\nNever losing sight of victory!\nOur champions will always be our champions,\nThe Fighting Chippewa of C-M-U!",
    description: "The Fighting Chippewa is performed by the Chippewa Marching Band at athletic events.",
    audioUrl: "/sounds/cmu-fight.mp3"
  },
  {
    id: "cmu-alma",
    schoolId: "centralmichigan",
    type: "alma_mater",
    title: "Alma Mater",
    lyrics: "From the Saginaw Valley to Lake Michigan's shore,\nStand the halls of Central, the school we adore.\nMaroon and gold banners forever will wave,\nLeading us onward, our cherished Central brave.\nAlma Mater we sing, to Central our praise,\nMemories we bring of our college days.\nLonely hearts will cheer with thoughts ever true,\nLoyal we'll be to our dear C.M.U.",
    description: "Central Michigan's Alma Mater reflects on the university's geographic location.",
    audioUrl: "/sounds/cmu-alma.mp3"
  },
  
  // Eastern Michigan
  {
    id: "emu-fight",
    schoolId: "easternmichigan",
    type: "fight_song",
    title: "Eagles Fight Song",
    lyrics: "Eagles fight, Eagles fight,\nEagles fight for EMU!\nEagles fight, Eagles fight,\nWe're behind our team, it's true!\nGreen and White, Green and White,\nWe're the team that has the fight!\nWe're the Eastern Michigan Eagles,\nAnd we're fighting for the right!",
    description: "The Eagles Fight Song is played at all EMU athletic events.",
    audioUrl: "/sounds/emu-fight.mp3"
  },
  {
    id: "emu-alma",
    schoolId: "easternmichigan",
    type: "alma_mater",
    title: "Our Pledge",
    lyrics: "To Eastern Michigan,\nWe pledge our loyalty.\nProud of our school, we stand,\nTo give our reverence and praise to thee.\nWe honor Eastern Michigan,\nTradition proud and strong.\nThe green and white we'll raise on high\nWith music and with song.",
    description: "Eastern Michigan's Alma Mater celebrates the traditions of the university.",
    audioUrl: "/sounds/emu-alma.mp3"
  },
  
  // Kent State
  {
    id: "kentstate-fight",
    schoolId: "kentstate",
    type: "fight_song",
    title: "Fight On for KSU",
    lyrics: "Fight on for KSU!\nFight for the Blue and Gold!\nWe're out to beat the foe,\nFight on brave and bold!\nFight on for victory,\nVictory today!\nK-S-U proudly,\nWin this game!",
    description: "Fight On for KSU is played by the Kent State University Marching Golden Flashes.",
    audioUrl: "/sounds/kentstate-fight.mp3"
  },
  {
    id: "kentstate-alma",
    schoolId: "kentstate",
    type: "alma_mater",
    title: "Alma Mater",
    lyrics: "We thy children of Kent State sing to thee this refrain.\nAlma Mater, Kent State University,\nProudly thy name we acclaim.\nGolden memories of days so fair,\nOf friendships so deep and true,\nForever and a day we'll recall our happy days\n'Neath the Gold and Blue.",
    description: "Kent State's Alma Mater is traditionally sung at the conclusion of university ceremonies.",
    audioUrl: "/sounds/kentstate-alma.mp3"
  },
  
  // Miami (OH)
  {
    id: "miami-fight",
    schoolId: "miamioh",
    type: "fight_song",
    title: "Miami Fight Song",
    lyrics: "Love and honor to Miami,\nOur college old and grand.\nProudly we shall ever hail thee,\nOver all the land.\nAlma mater now we praise thee,\nSing joyfully this lay.\nLove and honor to Miami,\nForever and a day!",
    description: "Miami University's Fight Song doubles as the university's Love and Honor song.",
    audioUrl: "/sounds/miami-fight.mp3"
  },
  {
    id: "miami-alma",
    schoolId: "miamioh",
    type: "alma_mater",
    title: "Old Miami Alma Mater",
    lyrics: "Old Miami, new Miami,\nDays of old and days to be;\nWeave the story of thy glory,\nOur Miami, here's to thee!\nMiami, our Miami,\nProud thy warriors loyal and true;\nOur Miami, fair Miami,\nThy loyal sons love you!",
    description: "Miami's Alma Mater connects past traditions with future aspirations.",
    audioUrl: "/sounds/miami-alma.mp3"
  },
  
  // Northern Illinois
  {
    id: "niu-fight",
    schoolId: "northernillinois",
    type: "fight_song",
    title: "Huskie Fight Song",
    lyrics: "Huskies, we're behind you all the way,\nOn to another victory.\nHuskies, your hearts will show the way\nTo a conference championship.\nHuskies, the Red and Black attack,\nFight for old NIU.\nGo Huskies go, go Huskies go,\nGo Huskies go to victory!",
    description: "The Huskie Fight Song is performed by the NIU Huskie Marching Band.",
    audioUrl: "/sounds/niu-fight.mp3"
  },
  {
    id: "niu-alma",
    schoolId: "northernillinois",
    type: "alma_mater",
    title: "NIU Alma Mater",
    lyrics: "Northern is calling,\nHer children far and wide,\nThe beautiful campus is their joy and pride.\nTeachers and students together will always share\nMemories of Northern, with all her blessings rare.\nNorth... ern... Il... li... nois\nNorth... ern... Il... li... nois\nPraises be to thee our N.I.U.",
    description: "Northern Illinois University's Alma Mater celebrates the tight-knit community of the school.",
    audioUrl: "/sounds/niu-alma.mp3"
  },
  
  // Ohio
  {
    id: "ohio-fight",
    schoolId: "ohio",
    type: "fight_song",
    title: "Stand Up and Cheer",
    lyrics: "Stand up and cheer,\nCheer loud and long for old Ohio!\nFor today we raise\nThe Green and White above the rest!\nOur team is fighting,\nAnd we are bound to win the fray!\nWe've got the team,\nWe've got the steam,\nFor this is old Ohio's day!",
    description: "Stand Up and Cheer is performed at all Ohio Bobcats athletic events.",
    audioUrl: "/sounds/ohio-fight.mp3"
  },
  {
    id: "ohio-alma",
    schoolId: "ohio",
    type: "alma_mater",
    title: "Alma Mater Ohio",
    lyrics: "When e'er we take our book of mem'ries\nAnd scan its pages through and through,\nWe'll find no days that glowed as brightly\nAs those we spent at Ohio U.\nWe'll read of scenes of glowing splendor\nOf friendships true of joys serene.\nThose days at grand old Alma Mater,\nOur best-loved Ohio Green.",
    description: "Ohio University's Alma Mater celebrates the university's heritage as the oldest university in the Northwest Territory.",
    audioUrl: "/sounds/ohio-alma.mp3"
  },
  
  // Toledo
  {
    id: "toledo-fight",
    schoolId: "toledo",
    type: "fight_song",
    title: "U of Toledo",
    lyrics: "U of Toledo, we'll fight for you!\nFame and glory for the Gold and Blue!\nLoyal sons and daughters standing proud and true,\nOn to victory, T-O-L-E-D-O!\nGo! Go! Rockets!",
    description: "The University of Toledo fight song is played by the Rocket Marching Band.",
    audioUrl: "/sounds/toledo-fight.mp3"
  },
  {
    id: "toledo-alma",
    schoolId: "toledo",
    type: "alma_mater",
    title: "Fair Toledo",
    lyrics: "Fair Toledo, we greet thee in song.\nOur voices strong, thy praise prolong.\nThy sons and daughters faithful are and true.\nWe pledge our hearts in loyalty to you.\nFor thee our cheers on high shall rise\nAnd echo to the skies.\nFair Toledo, we hail thee in song!",
    description: "Toledo's Alma Mater reflects the pride and loyalty felt by members of the Rocket community.",
    audioUrl: "/sounds/toledo-alma.mp3"
  },
  
  // Western Michigan
  {
    id: "wmu-fight",
    schoolId: "westernmichigan",
    type: "fight_song",
    title: "WMU Fight Song",
    lyrics: "Fight on fight on for Western!\nTake the ball, make a score, win the game.\nFight on fight on for Western!\nOnward for the Brown and Gold.\nFight! Fight! Fight! (Fight!)\nFight on for victory,\nShout out our battle cry,\nOnward for the Brown and Gold,\nWe will win, do or die!\nRah! Rah! Rah!",
    description: "The Western Michigan University Fight Song is performed by the Bronco Marching Band.",
    audioUrl: "/sounds/wmu-fight.mp3"
  },
  {
    id: "wmu-alma",
    schoolId: "westernmichigan",
    type: "alma_mater",
    title: "WMU Alma Mater",
    lyrics: "Western we sing to you,\nBrown and Gold,\nWestern we bring to you,\nFaith untold.\nYou give us knowledge,\nStrength that will never fail.\nWe sing to you our Alma Mater,\nWestern, hail!",
    description: "Western Michigan's Alma Mater is a tribute to the university's mission of providing academic excellence.",
    audioUrl: "/sounds/wmu-alma.mp3"
  },
  
  // Massachusetts
  {
    id: "massachusetts-fight",
    schoolId: "massachusetts",
    type: "fight_song",
    title: "Fight Mass",
    lyrics: "Fight, fight Massachusetts,\nFight, fight every down,\nFight, fight for the home team,\nWe're out to win this game!\nMarch, march on down the field,\nHail to our heroes bold,\nFor Mass-a-chu-setts,\nFight down the field, fight!\nFight to the goal!\nGO UMASS!",
    description: "Fight Mass is the primary fight song of the University of Massachusetts Amherst.",
    audioUrl: "/sounds/umass-fight.mp3"
  },
  {
    id: "massachusetts-alma",
    schoolId: "massachusetts",
    type: "alma_mater",
    title: "Massachusetts Alma Mater",
    lyrics: "When twilight shadows darken,\nQuest not the reason why,\nOur hearts with pride will harken,\nOld Massachusetts' cry.\n'Tis there where beauty softly lies,\n'Neath the blue New England skies.\nWe'll cherish each day of our college life,\nThe hills, the trees, the rising sun.\nOur hopes, our dreams, for future years\nHave only then begun.",
    description: "The Massachusetts Alma Mater is performed at university convocations and other formal events.",
    audioUrl: "/sounds/umass-alma.mp3"
  }
];