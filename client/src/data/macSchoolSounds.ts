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
    description: "Akron Blue and Gold is the official fight song of the University of Akron."
  },
  {
    id: "akron-alma",
    schoolId: "akron",
    type: "alma_mater",
    title: "Alma Mater",
    lyrics: "In a valley fair and beautiful Stands our Alma Mater true. Akron University, we hail thee, Loyal sons and daughters too. The Buchtelites of yore have left us Their tradition, honored bright; We shall always keep it shining, A beacon guiding light.",
    description: "The Alma Mater of the University of Akron is performed at all major university events."
  },
  
  // Ball State
  {
    id: "ballstate-fight",
    schoolId: "ballstate",
    type: "fight_song",
    title: "Fight Song",
    lyrics: "Fight team fight for Ball State, We must win this game. Onward now you Cardinals, Bring glory to your name. Fight! Fight! Fight! As the Cardinals go flying, Proud and bold and true, We're behind you all the way, Fight team fight for B-S-U!",
    description: "Ball State's Fight Song is played at all athletic events."
  },
  {
    id: "ballstate-alma",
    schoolId: "ballstate",
    type: "alma_mater",
    title: "Alma Mater",
    lyrics: "In the halls of learning, stand her children all, Proudly sing to thee our alma mater, loyal through the years we'll be though we travel far from thee...",
    description: "Ball State's Alma Mater is traditionally performed at the conclusion of university ceremonies."
  },
  
  // Bowling Green
  {
    id: "bowlinggreen-fight",
    schoolId: "bowlinggreen",
    type: "fight_song",
    title: "Forward Falcons",
    lyrics: "Forward Falcons, Forward Falcons, Fight for victory, Show our spirit, Make them fear it, Fight for 'ol Bee Gee. Forward Falcons, Forward Falcons, Make the contest keen, Shout out the fame of our mighty name, And win for Bowling Green!",
    description: "Forward Falcons is the official fight song of Bowling Green State University."
  },
  {
    id: "bowlinggreen-alma",
    schoolId: "bowlinggreen",
    type: "alma_mater",
    title: "Alma Mater",
    lyrics: "Alma Mater hear us, As we praise thy name, Make us worthy sons and daughters, Adding to thy fame. Time will treat you kindly, Years from now you'll be, Ever dearer in our hearts, Our University.",
    description: "BGSU's Alma Mater is performed at graduations and other formal university events."
  },
  
  // Buffalo
  {
    id: "buffalo-fight",
    schoolId: "buffalo",
    type: "fight_song",
    title: "Victory March",
    lyrics: "Fight, fight, fight for Buffalo, Stand up and cheer for the Blue and White. Our teams are fighting with all their might, and we will win, yes, win this game today. Fight, fight, fight for Buffalo, Stand behind our men so true. The team is counting upon you, So shout for victory and Buffalo U!",
    description: "The University at Buffalo Victory March is performed by the Thunder of the East marching band at football games."
  },
  {
    id: "buffalo-alma",
    schoolId: "buffalo",
    type: "alma_mater",
    title: "Alma Mater",
    lyrics: "College days swiftly pass, imbued with memories fond, And lingering comes the thought when we must part from thee...",
    description: "UB's Alma Mater dates back to the early 20th century."
  },
  
  // Central Michigan
  {
    id: "cmu-fight",
    schoolId: "centralmichigan",
    type: "fight_song",
    title: "The Fighting Chippewa",
    lyrics: "The Fighting Chippewa, we're all behind ya, The fighting Maroon and Gold, that's raring to go. Fight! Fight! Fight! With all your might, Smashing, crashing, never losing sight of victory! Our champions will always be our champions, the Fighting Chippewa of C-M-U!",
    description: "The Fighting Chippewa is performed by the Chippewa Marching Band at athletic events."
  },
  {
    id: "cmu-alma",
    schoolId: "centralmichigan",
    type: "alma_mater",
    title: "Alma Mater",
    lyrics: "From the Saginaw Valley to Lake Michigan's shore, Stand the halls of Central, the school we adore...",
    description: "Central Michigan's Alma Mater reflects on the university's geographic location."
  }
  
  // More school sounds would be added for the remaining MAC schools
];