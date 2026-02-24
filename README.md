Mobile MACtion App quicksheet 	

- found a potential way to pull data from the ncaa.com website using code from this github: https://github.com/henrygd/ncaa-api 
- **NEED**: Live scoring not functioning/populating, could be an API issue. I like how I have the scoring bubbles set, but I need to change it up somehow to get scores to populate. Perhaps using the above API?
  
- **NEED**: standings only pulling data for conference games (which is accurate), want to also populate overall record

-**NEED**: Under each School page, need to work on importing stats (using Sidearm, perhaps NCAA website to get accurate stats? this is hidden for now. Wonder if the data from the api above can support this?)
    - Get all stats for all sports each school has, not just football, baseball, and basketball. The style/layout is good, just want to populate the data. Doesn’t need to be live data; it can update as the NCAA website updates. (Might need to reach out to Genius Sports and see what we can collaborate on for live data?)
    
- **NEED**: allow sorting by team/by player via dropdown (Similar to this: https://www.bergathletics.com/sports/baseball/stats)   
  
- **NEED**: if you designate a school as your favorite, all data for that school is immediately prioritized, and not have to adjust the dropdowns each time. If I pick Toledo, I want Toledo stuff prioritized. 

- **Sounds**: lyrics display well, can’t get songs to play, don’t have all songs yet, but need to work out the path and then drop the song files in the assets folders? Would like it to play natively in case of a bad signal area during tailgating, but flexible

- **Podcast page**: Eventually want to add other Mac-focused podcasts to be sorted from, and then you can listen to your favorite MAC podcast in the app. Prioritization of the MAC Sports Connection, which plays fine, thanks to the RSS feed. 

**GOOD SO FAR** (may need some tweaking, noted below) 
- Also, update each “Buy Tickets” link to be mapped to each school’s ticket outlet (currently hidden) 
    
- On the Affiliate pages, that’s all set. They redirect to their school’s webpages, don’t want to give them too much attention since they are only in the league for one or two sports.
    - **NEED** Add Sacramento State football ONLY, remove all Northern Illinois content from main teams page) 

- Schedule page, overall, is good. No changes here for the time being. Perhaps just some minor cleanup, but this looks fine overall. 

- News page, overall good. No changes here.

- Rivalries page, overall good. No changes here. (hidden for now)

- Eats page, overall good. No changes here. Evantually want to prioritize certain businesses (perhaps a "coaches choice") but no tweaks at this time  (hidden for now)

## NCAA data migration

See `docs/ncaa-data-migration.md` for a step-by-step guide to replacing ESPN data with NCAA data for live scoring, standings, and stats.
