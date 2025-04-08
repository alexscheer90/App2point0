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
    lyrics: "We cheer the Akron Blue and Gold,\nWe cheer as the colors unfold.\nWe pledge anew, we're all for you,\nAs the team goes crashing through,\nFight! Fight!\nWe cheer the Akron warriors bold,\nFor a fight that's a sight to behold,\nSo we stand up, and cheer and shout,\nFor the Akron Blue and Gold!\nZzzip! Zip go the Zippers!\nZzzip! Zip go the Zippers!\nAkron U,\nGold and Blue,\nAll for you, and the Zippers too!",
    description: "Akron Blue and Gold is the official fight song of the University of Akron.",
    audioUrl: "/sounds/akron-fight.mp3"
  },
  {
    id: "akron-alma",
    schoolId: "akron",
    type: "alma_mater",
    title: "Alma Mater",
    lyrics: "Close beside Cuyahoga's waters,\nStream of amber hue,\nO'er old Buchtel, Summit's glory,\nWaves the gold and blue.\n\nHail we Akron! Sound her praises,\nSpeed them on the gale.\nEver stand our Alma Mater,\nAkron, hail! All hail!",
    description: "The Alma Mater of the University of Akron is performed at all major university events.",
    audioUrl: "/sounds/akron-alma.mp3"
  },
  
  // Ball State
  {
    id: "ballstate-fight",
    schoolId: "ballstate",
    type: "fight_song",
    title: "Fight Song",
    lyrics: "Fight team fight for Ball State,\nWe must win this game.\nOnward now you Cardinals,\nBring glory to your name.\nFight! Fight! Fight!\nHere's to both our colors,\nCardinal and White.\nPraying for a victory,\nSo fight, fight, fight!",
    description: "Ball State's Fight Song is played at all athletic events.",
    audioUrl: "/sounds/ballstate-fight.mp3"
  },
  {
    id: "ballstate-alma",
    schoolId: "ballstate",
    type: "alma_mater",
    title: "Alma Mater",
    lyrics: "Dear Alma Mater, hear our vow\nOf faith and trust in thee.\nThy spirit hovers near us now\nAnd through eternity.\nThy colors true of red and white\nShall e'er exalted be.\nWe'll honor thee both day and night.\nDear Alma Mater, we love thee!\n\nDear Alma Mater, hear our cry\nOf laud and praise to thee.\nTo bring thee honor e'er we'll try,\nNo matter where we be.\nFond memories we e'er shall hold\nOf Ball State, college dear.\nThough years may come and we grow old,\nDear Alma Mater, still be near!",
    description: "Ball State's Alma Mater is traditionally performed at the conclusion of university ceremonies.",
    audioUrl: "/sounds/ballstate-alma.mp3"
  },
  
  // Bowling Green
  {
    id: "bowlinggreen-fight",
    schoolId: "bowlinggreen",
    type: "fight_song",
    title: "Forward Falcons",
    lyrics: "Forward Falcons, Forward Falcons\nFight for victory,\nShow your spirit, make them fear it\nFight for 'ol BG.\nForward Falcons, Forward Falcons\nMake the contest keen,\nShout out the fame of our mighty name\nAnd win for Bowling Green!",
    description: "Forward Falcons is the official fight song of Bowling Green State University.",
    audioUrl: "/sounds/bowlinggreen-fight.mp3"
  },
  {
    id: "bowlinggreen-alma",
    schoolId: "bowlinggreen",
    type: "alma_mater",
    title: "Alma Mater",
    lyrics: "Alma Mater hear us,\nAs we praise thy name\nMake us worthy sons and daughters\nAdding to thy fame.\nTime will treat you kindly\nYears from now you'll be\nEver dearer in our hearts,\nOur University.\n\nFrom your halls of ivy\nTo the campus scene,\nChimes ring out with gladness\nFrom our dear Bowling Green.\nWhen all is just a mem'ry\nOf the by-gone days,\nHear our hymn dear Alma Mater\nAs thy name we praise.",
    description: "BGSU's Alma Mater is performed at graduations and other formal university events.",
    audioUrl: "/sounds/bowlinggreen-alma.mp3"
  },
  
  // Buffalo
  {
    id: "buffalo-fight",
    schoolId: "buffalo",
    type: "fight_song",
    title: "Victory March",
    lyrics: "Fight, fight for Buffalo\nFor the Blue and White are on the go\nWe have the spirit, pep, and might\nThe Bulls will win this game tonight\nCome raise a cheer for Buffalo\nHear the crowd roar with thunderous 'Go'\nThough the team may strive with its might and main\nWe back our Bulls through sunshine and rain\nBulls, Bulls, come on you Bulls\nFor Blue and White are on the go\nSo fight, team, fight with all your might\nFor the Blue and White tonight!",
    description: "The University at Buffalo Victory March is performed by the Thunder of the East marching band at football games.",
    audioUrl: "/sounds/buffalo-fight.mp3"
  },
  {
    id: "buffalo-alma",
    schoolId: "buffalo",
    type: "alma_mater",
    title: "Alma Mater",
    lyrics: "All hail to thee, our alma mater\nWith love we pledge to thee\nUpon thy heights, our alma mater\nBeside the inland sea\n\nWe'll e'er recall the inspiration\nOf thy high decree\nTo seek the truth, our alma mater\nForever bold and free!\n\nAnd as we go, our alma mater\nWhere'er the path may lead\nWe'll ne'er forget our alma mater\nThy purpose, truth, and deed!\n\nFor thee we'll strive, our alma mater\nThy heritage proclaim\nWe hail thee now, our alma mater\nAll glory to thy name!",
    description: "UB's Alma Mater dates back to the early 20th century.",
    audioUrl: "/sounds/buffalo-alma.mp3"
  },
  
  // Central Michigan
  {
    id: "cmu-fight",
    schoolId: "centralmichigan",
    type: "fight_song",
    title: "The Fighting Chippewa",
    lyrics: "Fight, Central down the field!\nFight for victory!\nFight, fellows never yield!\nWe're with you, oh varsity!\nOnward with banners bold,\nTo our colors we'll be true!\nFight for Maroon and Gold!\nDown the field for CMU!\nVarsity! Rah! Rah!\nVictory! Rah! Rah!\nChippewa! We're proud of that nickname!\nHear our song loud and strong,\nCentral is going to win this game!",
    description: "The Fighting Chippewa is performed by the Chippewa Marching Band at athletic events.",
    audioUrl: "/sounds/cmu-fight.mp3"
  },
  {
    id: "cmu-alma",
    schoolId: "centralmichigan",
    type: "alma_mater",
    title: "CMU Alma Mater",
    lyrics: "Central, we sing to thee,\nPraise to thy name.\nGraciousness, truth, and love,\nThese we acclaim.\nCherished in memory,\nDear alma mater be,\nOur Central Michigan University.\n\nCentral, we honor thee,\nLoyal and true.\nOur alma mater dear,\nWe pledge to you.\nMay the years bring success,\nGlory and happiness,\nTo our Central Michigan University.",
    description: "Central Michigan's Alma Mater reflects the university's commitment to knowledge and truth.",
    audioUrl: "/sounds/cmu-alma.mp3"
  },
  
  // Eastern Michigan
  {
    id: "emu-fight",
    schoolId: "easternmichigan",
    type: "fight_song",
    title: "Eastern Eagles Fight Song",
    lyrics: "Eastern Eagles, hats off to you!\nFight, fight, fight for ole EMU.\nLook to the sky, the Eagles will fly,\nthe bravest we'll defy.\n...Rah,rah, rah!\nHold that line for ole Green and White.\nSons and daughters show your might.\nSo, FIGHT, FIGHT! for ole EMU\nand vic-tor-y!",
    description: "The Eagles Fight Song is played at all EMU athletic events.",
    audioUrl: "/sounds/emu-fight.mp3"
  },
  {
    id: "emu-alma",
    schoolId: "easternmichigan",
    type: "alma_mater",
    title: "EMU Alma Mater",
    lyrics: "Eastern, sacred Alma Mater to your name we shall be true.\nEver marching on to victory, we'll stand by to see you through,\nSoftly floating on the breeze, verdant green with white of snow,\nThis our banner we will carry in our hearts whe'er we go",
    description: "Eastern Michigan's Alma Mater celebrates the traditions of the university.",
    audioUrl: "/sounds/emu-alma.mp3"
  },
  
  // Kent State
  {
    id: "kentstate-fight",
    schoolId: "kentstate",
    type: "fight_song",
    title: "Fight On for KSU",
    lyrics: "Fight on for KSU,\nFight for the Blue and Gold!\nWe're out to beat the foe;\nFight on brave and bold!\nFight on for victory,\nDon't stop until we're through.\nWe're all together,\nLet's go forward, K-S-U!",
    description: "Fight On for KSU is played by the Kent State University Marching Golden Flashes.",
    audioUrl: "/sounds/kentstate-fight.mp3"
  },
  {
    id: "kentstate-alma",
    schoolId: "kentstate",
    type: "alma_mater",
    title: "Alma Mater",
    lyrics: "From the beauty land Ohio comes a universal praise,\n'Tis the song of Alma Mater that her sons and daughters raise.\n'Tis a Hail to Kent forever, on the Cuyahoga shore,\nNow we join the loving thousands as they sing it o'er and o'er.\nHail to Thee, our Alma Mater.\nO, how beautiful Thou art,\nHigh enthroned upon the hilltop,\nReigning over every heart.",
    description: "Kent State's Alma Mater is traditionally sung at the conclusion of university ceremonies.",
    audioUrl: "/sounds/kentstate-alma.mp3"
  },
  
  // Miami (OH)
  {
    id: "miami-fight",
    schoolId: "miamioh",
    type: "fight_song",
    title: "Miami Fight Song",
    lyrics: "Love and honor to Miami,\nOur college old and grand.\nProudly we shall ever hail thee,\nOver all the land.\nAlma mater now we praise thee,\nSing joyfully this lay.\nLove and honor to Miami,\nForever and a day.",
    description: "Miami University's Fight Song doubles as the university's Love and Honor song.",
    audioUrl: "/sounds/miami-fight.mp3"
  },
  {
    id: "miami-alma",
    schoolId: "miamioh",
    type: "alma_mater",
    title: "Old Miami Alma Mater",
    lyrics: "Old Miami, from thy hillcrest,\nThou hast watched the decades roll.\nWhile thy sons have quested from thee,\nSturdy-hearted, pure of soul.\n\n(Chorus)\nOld Miami, New Miami,\nDays of old and days to be;\nWeave the story of the glory,\nOur Miami, here's to thee.\n\nAging in thy simple splendor,\nThou the calm, and they the storm,\nThou didst give them joy in conquest,\nStrength from thee sustained their arm.\n\nThou shalt stand a constant beacon,\nCrimson tow'rs against the sky;\nMen shall ever seek thy guiding,\nPower like thine shall never die",
    description: "Miami's Alma Mater connects past traditions with future aspirations.",
    audioUrl: "/sounds/miami-alma.mp3"
  },
  
  // Northern Illinois
  {
    id: "niu-fight",
    schoolId: "northernillinois",
    type: "fight_song",
    title: "Huskie Fight Song",
    lyrics: "Huskies, come on you Huskies\nAnd make a score or two (Or three!)\nHuskies, you're Northern Huskies\nThe team to pull us through\nForward, together forward\nThere's victory in view\nCome on you Huskies\nFight on you Huskies\nAnd win for NIU!",
    description: "The Huskie Fight Song is performed by the NIU Huskie Marching Band.",
    audioUrl: "/sounds/niu-fight.mp3"
  },
  {
    id: "niu-alma",
    schoolId: "northernillinois",
    type: "alma_mater",
    title: "NIU Alma Mater",
    lyrics: "Hail to Thee, our Alma Mater\nEver shall we praise your name\nHere, we proudly lift our voices\nThousands strong we sing your fame;​\nFree, steadfast, devoted, true\nWe will always stand by you\nLet our cheers resound for Northern\nHail, NIU!",
    description: "Northern Illinois University's Alma Mater celebrates the tight-knit community of the school.",
    audioUrl: "/sounds/niu-alma.mp3"
  },
  
  // Ohio
  {
    id: "ohio-fight",
    schoolId: "ohio",
    type: "fight_song",
    title: "Stand Up and Cheer",
    lyrics: "[Verse 1]\nStand up and cheer\nCheer loud and long for old Ohio\nFor today we raise\nThe Green and White above the rest\n\n[Verse 2]\nOur team is fighting\nAnd we are bound to win the fray\nWe've got the team\nWe've got the steam\nFor this is old Ohio's day",
    description: "Stand Up and Cheer is performed at all Ohio Bobcats athletic events.",
    audioUrl: "/sounds/ohio-fight.mp3"
  },
  {
    id: "ohio-alma",
    schoolId: "ohio",
    type: "alma_mater",
    title: "Alma Mater Ohio",
    lyrics: "[Verse 1]\nWhen e'er we take our book of mem'ries\nAnd scan its pages through and through\nWe'll find no days that glow so brightly\nAs those we spent at old OU\nWithin our Alma Mater's portals\nWe meet her children hand to hand\nAnd when there comes the day of parting\nStill firm and loyal we will stand\n\n[Chorus]\nAlma Mater, Ohio\nAlma Mater, brave and fair\nAlma Mater, we hail thee\nFor we own thy kindly care\nAlma Mater, Ohio\nWhen we read thy story o'er\nWe revere thee and cheer thee\nAs we sing thy praise once more\n\n[Verse 2]\nOur Alma Mater calls us ever\nAnd love of country has its claim\nThe one but makes us prize the other\nAnd thus we cherish both the same\nWhen Alma Mater sends us forward\nAnd in her name we stand in line\nThen we will serve the nation better\nFor having gathered at her shrine",
    description: "Ohio University's Alma Mater celebrates the university's heritage as the oldest university in the Northwest Territory.",
    audioUrl: "/sounds/ohio-alma.mp3"
  },
  
  // Toledo
  {
    id: "toledo-fight",
    schoolId: "toledo",
    type: "fight_song",
    title: "U of Toledo Fight Song",
    lyrics: "U of Toledo, we'll fight for you!\nFame and glory for the Gold and Blue!\nLoyal sons and daughters standing proud and true,\nOn to victory, T-O-L-E-D-O!\nGo! Go! Rockets!",
    description: "The University of Toledo fight song is played by the Rocket Marching Band.",
    audioUrl: "/sounds/toledo-fight.mp3"
  },
  {
    id: "toledo-alma",
    schoolId: "toledo",
    type: "alma_mater",
    title: "Fair Toledo",
    lyrics: "Fair Toledo, we sing to thee\nOur Alma Mater, our toast to thee shall be\nIn mem'ry cherished, thou shalt ever be\nFair Toledo, to thee\n\nFair Toledo, thy name so true\nThy colors, the Old Gold and the Blue\nTo thee our hearts will pledge devotion anew\nFair Toledo, to thee\n\nIn college days into thy halls\nWe gather knowledge to serve thy call\nAround the world thy glory shall be\nThrough thy sons and daughters, ever true to thee",
    description: "Toledo's Alma Mater reflects the pride and loyalty felt by members of the Rocket community.",
    audioUrl: "/sounds/toledo-alma.mp3"
  },
  
  // Western Michigan
  {
    id: "wmu-fight",
    schoolId: "westernmichigan",
    type: "fight_song",
    title: "WMU Fight Song",
    lyrics: "Go Broncos!\nFight on for Western\nTake the ball, make a score, win the game\nFight on for Western\nOnward for the brown and gold\nFight! Fight! Fight! (Fight!)\nFight on for victory\nShout out our battle cry\nOnward for the brown and gold\nWe will win, do or die\nRah! Rah! Rah!",
    description: "The Western Michigan University Fight Song is performed by the Bronco Marching Band.",
    audioUrl: "/sounds/wmu-fight.mp3"
  },
  {
    id: "wmu-alma",
    schoolId: "westernmichigan",
    type: "alma_mater",
    title: "WMU Alma Mater",
    lyrics: "Western, we sing to you, Brown and Gold.\nWestern, we bring to you, faith untold.\nYou give us knowledge, strength that will never fail.\nWe sing to you, our Alma Mater, Western, hail!\n\nWestern, we work for you with our might.\nWestern, we honor you day and night.\nYou give us wisdom, comfort that will never cease.\nWe give to you, our Alma Mater, love and peace!",
    description: "Western Michigan's Alma Mater is a tribute to the university's mission of providing academic excellence.",
    audioUrl: "/sounds/wmu-alma.mp3"
  },
  
  // Massachusetts
  {
    id: "massachusetts-fight",
    schoolId: "massachusetts",
    type: "fight_song",
    title: "Fight UMass",
    lyrics: "Fight! Fight Massachusetts!\nFight! Fight every down!\nFight! Fight for the home team,\nWe're out to win this game!\nFight! Fight Massachusetts!\nWe're going to win this game!\nMarch! March on down the field!\nHail to our heroes bold!\nFor Massachusetts!\nRah! Rah! Rah!\nFight down the field!\nFight! Fight to the goal!\nGo UMass!",
    description: "Fight UMass is the primary fight song of the University of Massachusetts Amherst.",
    audioUrl: "/sounds/umass-fight.mp3"
  },
  {
    id: "massachusetts-alma",
    schoolId: "massachusetts",
    type: "alma_mater",
    title: "Massachusetts Alma Mater",
    lyrics: "When Twilight shadows deepen,\nQuest not the reason why,\nOur hearts with pride remember\nHer name who'll never die.\n'Tis there where beauty softly lies,\n'Neath blue New England skies;\nWe'll cherish each day of our college life,\nThe hill, the trees, the rising sun,\nOur hopes, our dreams for future years\nHave only then begun.",
    description: "The Massachusetts Alma Mater is performed at university convocations and other formal events.",
    audioUrl: "/sounds/umass-alma.mp3"
  }
];