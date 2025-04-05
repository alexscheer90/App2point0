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
    lyrics: "We cheer the Akron Blue and Gold, We cheer as the colors fly. We sing the glory of her name, Her name will never die! Fight! Fight! Fight! We cheer the Akron warriors bold, For they shall win the day. As we march along to VICTORY, For the Akron Blue and Gold!",
    description: "Akron Blue and Gold is the official fight song of the University of Akron.",
    audioUrl: "/sounds/akron-fight.mp3"
  },
  {
    id: "akron-alma",
    schoolId: "akron",
    type: "alma_mater",
    title: "Alma Mater",
    lyrics: "In a valley fair and beautiful Stands our Alma Mater true. Akron University, we hail thee, Loyal sons and daughters too. The Buchtelites of yore have left us Their tradition, honored bright; We shall always keep it shining, A beacon guiding light.",
    description: "The Alma Mater of the University of Akron is performed at all major university events.",
    audioUrl: "/sounds/akron-alma.mp3"
  },
  
  // Ball State
  {
    id: "ballstate-fight",
    schoolId: "ballstate",
    type: "fight_song",
    title: "Fight Song",
    lyrics: "Fight team fight for Ball State, We must win this game. Onward now you Cardinals, Bring glory to your name. Fight! Fight! Fight! As the Cardinals go flying, Proud and bold and true, We're behind you all the way, Fight team fight for B-S-U!",
    description: "Ball State's Fight Song is played at all athletic events.",
    audioUrl: "/sounds/ballstate-fight.mp3"
  },
  {
    id: "ballstate-alma",
    schoolId: "ballstate",
    type: "alma_mater",
    title: "Alma Mater",
    lyrics: "In the halls of learning, stand her children all, Proudly sing to thee our alma mater, loyal through the years we'll be though we travel far from thee...",
    description: "Ball State's Alma Mater is traditionally performed at the conclusion of university ceremonies.",
    audioUrl: "/sounds/ballstate-alma.mp3"
  },
  
  // Bowling Green
  {
    id: "bowlinggreen-fight",
    schoolId: "bowlinggreen",
    type: "fight_song",
    title: "Forward Falcons",
    lyrics: "Forward Falcons, Forward Falcons, Fight for victory, Show our spirit, Make them fear it, Fight for 'ol Bee Gee. Forward Falcons, Forward Falcons, Make the contest keen, Shout out the fame of our mighty name, And win for Bowling Green!",
    description: "Forward Falcons is the official fight song of Bowling Green State University.",
    audioUrl: "/sounds/bowlinggreen-fight.mp3"
  },
  {
    id: "bowlinggreen-alma",
    schoolId: "bowlinggreen",
    type: "alma_mater",
    title: "Alma Mater",
    lyrics: "Alma Mater hear us, As we praise thy name, Make us worthy sons and daughters, Adding to thy fame. Time will treat you kindly, Years from now you'll be, Ever dearer in our hearts, Our University.",
    description: "BGSU's Alma Mater is performed at graduations and other formal university events.",
    audioUrl: "/sounds/bowlinggreen-alma.mp3"
  },
  
  // Buffalo
  {
    id: "buffalo-fight",
    schoolId: "buffalo",
    type: "fight_song",
    title: "Victory March",
    lyrics: "Fight, fight, fight for Buffalo, Stand up and cheer for the Blue and White. Our teams are fighting with all their might, and we will win, yes, win this game today. Fight, fight, fight for Buffalo, Stand behind our men so true. The team is counting upon you, So shout for victory and Buffalo U!",
    description: "The University at Buffalo Victory March is performed by the Thunder of the East marching band at football games.",
    audioUrl: "/sounds/buffalo-fight.mp3"
  },
  {
    id: "buffalo-alma",
    schoolId: "buffalo",
    type: "alma_mater",
    title: "Alma Mater",
    lyrics: "College days swiftly pass, imbued with memories fond, And lingering comes the thought when we must part from thee...",
    description: "UB's Alma Mater dates back to the early 20th century.",
    audioUrl: "/sounds/buffalo-alma.mp3"
  },
  
  // Central Michigan
  {
    id: "cmu-fight",
    schoolId: "centralmichigan",
    type: "fight_song",
    title: "The Fighting Chippewa",
    lyrics: "The Fighting Chippewa, we're all behind ya, The fighting Maroon and Gold, that's raring to go. Fight! Fight! Fight! With all your might, Smashing, crashing, never losing sight of victory! Our champions will always be our champions, the Fighting Chippewa of C-M-U!",
    description: "The Fighting Chippewa is performed by the Chippewa Marching Band at athletic events.",
    audioUrl: "/sounds/cmu-fight.mp3"
  },
  {
    id: "cmu-alma",
    schoolId: "centralmichigan",
    type: "alma_mater",
    title: "Alma Mater",
    lyrics: "From the Saginaw Valley to Lake Michigan's shore, Stand the halls of Central, the school we adore. Maroon and gold banners forever will wave, Leading us onward, our cherished Central brave.",
    description: "Central Michigan's Alma Mater reflects on the university's geographic location.",
    audioUrl: "/sounds/cmu-alma.mp3"
  },
  
  // Eastern Michigan
  {
    id: "emu-fight",
    schoolId: "easternmichigan",
    type: "fight_song",
    title: "Eagles Fight Song",
    lyrics: "Eagles fight, Eagles fight, Eagles fight for EMU! Eagles fight, Eagles fight, We're behind our team, it's true! Green and White, Green and White, We're the team that has the fight! We're the Eastern Michigan Eagles, and we're fighting for the right!",
    description: "The Eagles Fight Song is played at all EMU athletic events.",
    audioUrl: "/sounds/emu-fight.mp3"
  },
  {
    id: "emu-alma",
    schoolId: "easternmichigan",
    type: "alma_mater",
    title: "Our Pledge",
    lyrics: "To Eastern Michigan, we pledge our loyalty. Proud of our school, we stand, to give our reverence and praise to thee. We honor Eastern Michigan, tradition proud and strong. The green and white we'll raise on high with music and with song.",
    description: "Eastern Michigan's Alma Mater celebrates the traditions of the university.",
    audioUrl: "/sounds/emu-alma.mp3"
  },
  
  // Kent State
  {
    id: "kentstate-fight",
    schoolId: "kentstate",
    type: "fight_song",
    title: "Fight On for KSU",
    lyrics: "Fight on for KSU! Fight for the Blue and Gold! We're out to beat the foe, Fight on brave and bold! Fight on for victory, victory today! K-S-U proudly, win this game!",
    description: "Fight On for KSU is played by the Kent State University Marching Golden Flashes.",
    audioUrl: "/sounds/kentstate-fight.mp3"
  },
  {
    id: "kentstate-alma",
    schoolId: "kentstate",
    type: "alma_mater",
    title: "Alma Mater",
    lyrics: "We thy children of Kent State sing to thee this refrain. Alma Mater, Kent State University, proudly thy name we acclaim. Golden memories of days so fair, of friendships so deep and true, forever and a day we'll recall our happy days 'neath the Gold and Blue.",
    description: "Kent State's Alma Mater is traditionally sung at the conclusion of university ceremonies.",
    audioUrl: "/sounds/kentstate-alma.mp3"
  },
  
  // Miami (OH)
  {
    id: "miami-fight",
    schoolId: "miamioh",
    type: "fight_song",
    title: "Miami Fight Song",
    lyrics: "Love and honor to Miami, Our college old and grand. Proudly we shall ever hail thee, Over all the land. Alma mater now we praise thee, Sing joyfully this lay. Love and honor to Miami, Forever and a day!",
    description: "Miami University's Fight Song doubles as the university's Love and Honor song.",
    audioUrl: "/sounds/miami-fight.mp3"
  },
  {
    id: "miami-alma",
    schoolId: "miamioh",
    type: "alma_mater",
    title: "Old Miami Alma Mater",
    lyrics: "Old Miami, new Miami, Days of old and days to be; Weave the story of thy glory, Our Miami, here's to thee! Miami, our Miami, Proud thy warriors loyal and true; Our Miami, fair Miami, Thy loyal sons love you!",
    description: "Miami's Alma Mater connects past traditions with future aspirations.",
    audioUrl: "/sounds/miami-alma.mp3"
  },
  
  // Northern Illinois
  {
    id: "niu-fight",
    schoolId: "northernillinois",
    type: "fight_song",
    title: "Huskie Fight Song",
    lyrics: "Huskies, we're behind you all the way, on to another victory. Huskies, your hearts will show the way to a conference championship. Huskies, the Red and Black attack, fight for old NIU. Go Huskies go, go Huskies go, go Huskies go to victory!",
    description: "The Huskie Fight Song is performed by the NIU Huskie Marching Band.",
    audioUrl: "/sounds/niu-fight.mp3"
  },
  {
    id: "niu-alma",
    schoolId: "northernillinois",
    type: "alma_mater",
    title: "NIU Alma Mater",
    lyrics: "Northern is calling, her children far and wide, the beautiful campus is their joy and pride. Teachers and students together will always share memories of Northern, with all her blessings rare.",
    description: "Northern Illinois University's Alma Mater celebrates the tight-knit community of the school.",
    audioUrl: "/sounds/niu-alma.mp3"
  },
  
  // Ohio
  {
    id: "ohio-fight",
    schoolId: "ohio",
    type: "fight_song",
    title: "Stand Up and Cheer",
    lyrics: "Stand up and cheer, cheer loud and long for old Ohio! For today we raise the Green and White above the rest! Our team is fighting, and we are bound to win the fray! We've got the team, we've got the steam, for this is old Ohio's day!",
    description: "Stand Up and Cheer is performed at all Ohio Bobcats athletic events.",
    audioUrl: "/sounds/ohio-fight.mp3"
  },
  {
    id: "ohio-alma",
    schoolId: "ohio",
    type: "alma_mater",
    title: "Alma Mater Ohio",
    lyrics: "When e'er we take our book of mem'ries and scan its pages through and through, We'll find no days that glowed as brightly as those we spent at Ohio U. We'll read of scenes of glowing splendor of friendships true of joys serene. Those days at grand old Alma Mater, our best-loved Ohio Green.",
    description: "Ohio University's Alma Mater celebrates the university's heritage as the oldest university in the Northwest Territory.",
    audioUrl: "/sounds/ohio-alma.mp3"
  },
  
  // Toledo
  {
    id: "toledo-fight",
    schoolId: "toledo",
    type: "fight_song",
    title: "U of Toledo",
    lyrics: "U of Toledo, we'll fight for you! Fame and glory for the Gold and Blue! Loyal sons and daughters standing proud and true, on to victory, T-O-L-E-D-O! Go! Go! Rockets!",
    description: "The University of Toledo fight song is played by the Rocket Marching Band.",
    audioUrl: "/sounds/toledo-fight.mp3"
  },
  {
    id: "toledo-alma",
    schoolId: "toledo",
    type: "alma_mater",
    title: "Fair Toledo",
    lyrics: "Fair Toledo, we greet thee in song. Our voices strong, thy praise prolong. Thy sons and daughters faithful are and true. We pledge our hearts in loyalty to you. For thee our cheers on high shall rise and echo to the skies. Fair Toledo, we hail thee in song!",
    description: "Toledo's Alma Mater reflects the pride and loyalty felt by members of the Rocket community.",
    audioUrl: "/sounds/toledo-alma.mp3"
  },
  
  // Western Michigan
  {
    id: "wmu-fight",
    schoolId: "westernmichigan",
    type: "fight_song",
    title: "WMU Fight Song",
    lyrics: "Fight on fight on for Western! Take the ball, make a score, win the game. Fight on fight on for Western! Onward for the Brown and Gold. Fight! Fight! Fight! (Fight!) Fight on for victory, shout out our battle cry, Onward for the Brown and Gold, we will win, do or die! Rah! Rah! Rah!",
    description: "The Western Michigan University Fight Song is performed by the Bronco Marching Band.",
    audioUrl: "/sounds/wmu-fight.mp3"
  },
  {
    id: "wmu-alma",
    schoolId: "westernmichigan",
    type: "alma_mater",
    title: "WMU Alma Mater",
    lyrics: "Western we sing to you, Brown and Gold, Western we bring to you, faith untold. You give us knowledge, strength that will never fail. We sing to you our Alma Mater, Western, hail!",
    description: "Western Michigan's Alma Mater is a tribute to the university's mission of providing academic excellence.",
    audioUrl: "/sounds/wmu-alma.mp3"
  },
  
  // Massachusetts
  {
    id: "umass-fight",
    schoolId: "umass",
    type: "fight_song",
    title: "Fight Mass",
    lyrics: "Fight, fight Massachusetts, Fight, fight every down, Fight, fight for the home team, We're out to win this game! March, march on down the field, Hail to our heroes bold, For Mass-a-chu-setts, Fight down the field, fight! Fight to the goal! GO UMASS!",
    description: "Fight Mass is the primary fight song of the University of Massachusetts Amherst.",
    audioUrl: "/sounds/umass-fight.mp3"
  },
  {
    id: "umass-alma",
    schoolId: "umass",
    type: "alma_mater",
    title: "Massachusetts Alma Mater",
    lyrics: "When twilight shadows darken, Quest not the reason why, Our hearts with pride will harken, Old Massachusetts' cry. 'Tis there where beauty softly lies, 'Neath the blue New England skies. We'll cherish each day of our college life, The hills, the trees, the rising sun. Our hopes, our dreams, for future years have only then begun.",
    description: "The Massachusetts Alma Mater is performed at university convocations and other formal events.",
    audioUrl: "/sounds/umass-alma.mp3"
  }
];