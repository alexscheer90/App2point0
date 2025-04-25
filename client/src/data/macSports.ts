import { Sport } from "@shared/schema";

// Based on the official MAC sports from getsomemaction.com
export const macSports: Sport[] = [
  // Men's sports with clear naming
  {
    id: "baseball",
    name: "Baseball",
    gender: "men",
    displayName: "Baseball",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=baseball"
  },
  {
    id: "football",
    name: "Football",
    gender: "men",
    displayName: "Football",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=football"
  },
  {
    id: "mbball",
    name: "Men's Basketball",
    gender: "men",
    displayName: "Men's Basketball",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=mbball"
  },
  {
    id: "mgolf",
    name: "Men's Golf",
    gender: "men",
    displayName: "Men's Golf",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=mgolf"
  },
  {
    id: "mtennis",
    name: "Men's Tennis",
    gender: "men",
    displayName: "Men's Tennis",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=mten"
  },
  {
    id: "mswimming",
    name: "Men's Swimming & Diving",
    gender: "men",
    displayName: "Men's Swimming & Diving",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=mswim"
  },
  {
    id: "mtrack",
    name: "Men's Track & Field",
    gender: "men",
    displayName: "Men's Track & Field",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=track"
  },
  {
    id: "wrestling",
    name: "Wrestling",
    gender: "men",
    displayName: "Wrestling",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=wrestling"
  },
  
  // Women's sports with clear naming
  {
    id: "field-hockey",
    name: "Field Hockey",
    gender: "women",
    displayName: "Field Hockey",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=fhockey"
  },
  {
    id: "gymnastics",
    name: "Women's Gymnastics",
    gender: "women",
    displayName: "Women's Gymnastics",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=gym"
  },
  {
    id: "softball",
    name: "Softball",
    gender: "women",
    displayName: "Softball",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=softball"
  },
  {
    id: "volleyball",
    name: "Volleyball",
    gender: "women",
    displayName: "Volleyball",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=wvball"
  },
  {
    id: "wbball",
    name: "Women's Basketball",
    gender: "women",
    displayName: "Women's Basketball",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=wbball"
  },
  {
    id: "wgolf",
    name: "Women's Golf",
    gender: "women",
    displayName: "Women's Golf",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=wgolf"
  },
  {
    id: "wlacrosse",
    name: "Women's Lacrosse",
    gender: "women",
    displayName: "Women's Lacrosse",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=wlax"
  },
  {
    id: "wsoccer",
    name: "Women's Soccer",
    gender: "women",
    displayName: "Women's Soccer",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=wsoc"
  },
  {
    id: "wswimming",
    name: "Women's Swimming & Diving",
    gender: "women",
    displayName: "Women's Swimming & Diving",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=wswim"
  },
  {
    id: "wtennis",
    name: "Women's Tennis",
    gender: "women",
    displayName: "Women's Tennis",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=wten"
  },
  {
    id: "wtrack",
    name: "Women's Track & Field",
    gender: "women",
    displayName: "Women's Track & Field",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=track"
  },
  
  // Mixed/shared sports
  {
    id: "cross-country",
    name: "Cross Country",
    gender: "mixed",
    displayName: "Cross Country",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=xc"
  },
  
  // Legacy IDs - hidden from UI but kept for data compatibility
  {
    id: "xc",
    name: "Cross Country",
    gender: "mixed",
    displayName: "Cross Country",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=xc",
    hidden: true
  },
  {
    id: "fhockey",
    name: "Field Hockey",
    gender: "women",
    displayName: "Field Hockey",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=fhockey",
    hidden: true
  },
  {
    id: "golf",
    name: "Golf",
    gender: "mixed",
    displayName: "Golf",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=mgolf",
    hidden: true
  },
  {
    id: "gym",
    name: "Gymnastics",
    gender: "women",
    displayName: "Women's Gymnastics",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=gym",
    hidden: true
  },
  {
    id: "lacrosse",
    name: "Women's Lacrosse",
    gender: "women",
    displayName: "Women's Lacrosse",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=wlax",
    hidden: true
  },
  {
    id: "wlax",
    name: "Women's Lacrosse",
    gender: "women",
    displayName: "Women's Lacrosse",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=wlax",
    hidden: true
  },
  {
    id: "soccer",
    name: "Women's Soccer",
    gender: "women",
    displayName: "Women's Soccer",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=wsoc",
    hidden: true
  },
  {
    id: "wsoc",
    name: "Women's Soccer",
    gender: "women",
    displayName: "Women's Soccer",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=wsoc",
    hidden: true
  },
  {
    id: "swimming",
    name: "Swimming & Diving",
    gender: "mixed",
    displayName: "Swimming & Diving",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=mswim",
    hidden: true
  },
  {
    id: "mswim",
    name: "Men's Swimming & Diving",
    gender: "men",
    displayName: "Men's Swimming & Diving",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=mswim",
    hidden: true
  },
  {
    id: "wswim",
    name: "Women's Swimming & Diving",
    gender: "women",
    displayName: "Women's Swimming & Diving",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=wswim",
    hidden: true
  },
  {
    id: "tennis",
    name: "Tennis",
    gender: "mixed",
    displayName: "Tennis",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=mten",
    hidden: true
  },
  {
    id: "mten",
    name: "Men's Tennis",
    gender: "men",
    displayName: "Men's Tennis",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=mten",
    hidden: true
  },
  {
    id: "wten",
    name: "Women's Tennis",
    gender: "women",
    displayName: "Women's Tennis",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=wten",
    hidden: true
  },
  {
    id: "track",
    name: "Track & Field",
    gender: "mixed",
    displayName: "Track & Field",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=track",
    hidden: true
  },
  {
    id: "wvball",
    name: "Volleyball",
    gender: "women",
    displayName: "Volleyball",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=wvball",
    hidden: true
  }
];
