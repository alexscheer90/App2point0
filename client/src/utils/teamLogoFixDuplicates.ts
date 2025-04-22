/**
 * This file contains fixes for the duplicate keys in the SCHOOL_NAME_MAPPINGS object
 * in teamLogoUtils.ts
 */

// Fix for duplicate USC/South Carolina and Southern California
export const fixSouthCarolina = {
  "South Carolina": "South Carolina",
  "South Carolina Gamecocks": "South Carolina"
};

export const fixUSC = {
  "USC Trojans": "USC",
  "Southern California": "USC"
};

// Fix for duplicate Bulls (USF and Buffalo)
export const fixBulls = {
  "USF Bulls": "USF",
  "South Florida": "USF"
};

// Fix for duplicate UT (Toledo, Tennessee)
export const fixUT = {
  "Tennessee Vols": "Tennessee",
  "Tennessee Volunteers": "Tennessee"
};

// Fix for duplicate Aggies (Texas A&M and Utah State)
export const fixAggies = {
  "Texas A&M Aggies": "Texas A&M",
  "Utah State Aggies": "Utah State"
};

// Fix for duplicate UW (Washington and Wisconsin)
export const fixUW = {
  "Washington Huskies": "Washington",
  "Wisconsin Badgers": "Wisconsin"
};

// Fix for duplicate Cowboys (Oklahoma State and Wyoming)
export const fixCowboys = {
  "Oklahoma State Cowboys": "Oklahoma State",
  "Wyoming Cowboys": "Wyoming"
};