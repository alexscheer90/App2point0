import { Sport } from "@shared/schema";

// Based on the official MAC sports from getsomemaction.com
export const macSports: Sport[] = [
  {
    id: "baseball",
    name: "Baseball",
    gender: "men", // Hidden gender - only for sorting
    displayName: "Baseball",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=baseball"
  },
  {
    id: "mbball",
    name: "Basketball",
    gender: "men",
    displayName: "Basketball - Men", // Show gender in dropdown
    officialUrl: "https://getsomemaction.com/standings.aspx?path=mbball"
  },
  {
    id: "wbball",
    name: "Basketball",
    gender: "women",
    displayName: "Basketball - Women", // Show gender in dropdown
    officialUrl: "https://getsomemaction.com/standings.aspx?path=wbball"
  },
  {
    id: "xc",
    name: "Cross Country",
    gender: "mixed", // Hidden gender
    displayName: "Cross Country",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=xc"
  },
  {
    id: "fhockey",
    name: "Field Hockey",
    gender: "women", // Hidden gender
    displayName: "Field Hockey",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=fhockey"
  },
  {
    id: "football",
    name: "Football",
    gender: "men", // Hidden gender
    displayName: "Football",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=football"
  },
  {
    id: "golf",
    name: "Golf",
    gender: "mixed", // Hidden gender
    displayName: "Golf",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=mgolf",
    scheduleOnly: true
  },
  {
    id: "mgolf",
    name: "Golf",
    gender: "men", // Hidden gender
    displayName: "Golf",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=mgolf"
  },
  {
    id: "wgolf",
    name: "Golf",
    gender: "women", // Hidden gender
    displayName: "Golf",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=wgolf"
  },
  {
    id: "gym",
    name: "Gymnastics",
    gender: "women", // Hidden gender
    displayName: "Gymnastics",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=gym"
  },
  {
    id: "wlax",
    name: "Lacrosse",
    gender: "women", // Hidden gender
    displayName: "Lacrosse",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=wlax"
  },
  {
    id: "wsoc",
    name: "Soccer",
    gender: "women",
    displayName: "Soccer - Women", // Show gender in dropdown
    officialUrl: "https://getsomemaction.com/standings.aspx?path=wsoc"
  },
  {
    id: "softball",
    name: "Softball",
    gender: "women", // Hidden gender
    displayName: "Softball",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=softball"
  },
  {
    id: "swimming",
    name: "Swimming & Diving",
    gender: "mixed", // Hidden gender
    displayName: "Swimming & Diving",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=mswim",
    scheduleOnly: true
  },
  {
    id: "mswim",
    name: "Swimming & Diving",
    gender: "men", // Hidden gender
    displayName: "Swimming & Diving",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=mswim"
  },
  {
    id: "wswim",
    name: "Swimming & Diving",
    gender: "women", // Hidden gender
    displayName: "Swimming & Diving",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=wswim"
  },
  {
    id: "tennis",
    name: "Tennis",
    gender: "mixed", // Hidden gender
    displayName: "Tennis",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=mten",
    scheduleOnly: true
  },
  {
    id: "mten",
    name: "Tennis",
    gender: "men", // Hidden gender
    displayName: "Tennis",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=mten"
  },
  {
    id: "wten",
    name: "Tennis",
    gender: "women", // Hidden gender
    displayName: "Tennis",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=wten"
  },
  {
    id: "track",
    name: "Track & Field",
    gender: "mixed", // Hidden gender
    displayName: "Track & Field",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=track"
  },
  {
    id: "wvball",
    name: "Volleyball",
    gender: "women", // Hidden gender
    displayName: "Volleyball",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=wvball"
  },
  {
    id: "wrestling",
    name: "Wrestling",
    gender: "men", // Hidden gender
    displayName: "Wrestling",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=wrestling"
  }
];
