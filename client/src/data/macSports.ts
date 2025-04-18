import { Sport } from "@shared/schema";

// Based on the official MAC sports from getsomemaction.com
export const macSports: Sport[] = [
  {
    id: "football",
    name: "Football",
    gender: "men",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=football"
  },
  {
    id: "mbball",
    name: "Basketball",
    gender: "men",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=mbball"
  },
  {
    id: "wbball",
    name: "Basketball",
    gender: "women",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=wbball"
  },
  {
    id: "baseball",
    name: "Baseball",
    gender: "men",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=baseball"
  },
  {
    id: "softball",
    name: "Softball",
    gender: "women",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=softball"
  },
  {
    id: "wsoc",
    name: "Soccer",
    gender: "women",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=wsoc"
  },
  {
    id: "wvball",
    name: "Volleyball",
    gender: "women",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=wvball"
  },
  {
    id: "fhockey",
    name: "Field Hockey",
    gender: "women",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=fhockey"
  },
  {
    id: "gym",
    name: "Gymnastics",
    gender: "women",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=gym"
  },
  {
    id: "wlax",
    name: "Lacrosse",
    gender: "women",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=wlax"
  },
  {
    id: "mten",
    name: "Tennis",
    gender: "men",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=mten"
  },
  {
    id: "wten",
    name: "Tennis",
    gender: "women",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=wten"
  },
  {
    id: "tennis",
    name: "Tennis",
    gender: "mixed",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=mten",
    scheduleOnly: true // Only show in schedule, not in standings
  },
  {
    id: "wrestling",
    name: "Wrestling",
    gender: "men",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=wrestling"
  },
  {
    id: "mgolf",
    name: "Golf",
    gender: "men",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=mgolf"
  },
  {
    id: "wgolf",
    name: "Golf",
    gender: "women",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=wgolf"
  },
  {
    id: "golf",
    name: "Golf",
    gender: "mixed",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=mgolf",
    scheduleOnly: true // Only show in schedule, not in standings
  },
  {
    id: "mswim",
    name: "Swimming & Diving",
    gender: "men",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=mswim"
  },
  {
    id: "wswim",
    name: "Swimming & Diving",
    gender: "women",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=wswim"
  },
  {
    id: "swimming",
    name: "Swimming & Diving",
    gender: "mixed",
    officialUrl: "https://getsomemaction.com/standings.aspx?path=mswim",
    scheduleOnly: true // Only show in schedule, not in standings
  }
];
