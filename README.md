Mobile MACtion App needs	

- found a potential way to pull data from the ncaa.com website using code from this github: https://github.com/henrygd/ncaa-api 
- Live scoring not functioning/populating, could be an API issue, or perhaps HTTP web request (nsjson serialization) - to help with endpoint calls. I like how I have the scoring bubbles set, but I need to change it up somehow to get scores to populate. 
- standings only pulling data for conference games, not overall as well 
- Under each School page, need to work on importing stats (using Sidearm, perhaps NCAA website to get accurate stats? this is hidden for now)
    - Get all stats for all sports each school has, not just football, baseball, and basketball. The style/layout is good, just want to populate the data. Doesn’t need to be live data; it can update as the NCAA website updates. (Might need to reach out to Genius Sports and see what we can collaborate on for live data?)
    - allow sorting by team/by player via dropdown (Similar to this: https://www.bergathletics.com/sports/baseball/stats)
    - Also, update each “Buy Tickets” link to be mapped to each school’s ticket outlet
        - On the Affiliate pages, that’s all set. They redirect to their school’s webpages, don’t want to give them too much attention since they are only in the league for one or two sports.  
- Schedule page, overall, is good. No changes here. 
- News page, overall good. No changes here.
- Rivalries page, overall good. No changes here. (hidden for now)
- Eats page, overall good. No changes here.  (hidden for now)
- NEED: if you designate a school as your favorite, all data for that school is immediately prioritized, and not have to adjust the dropdowns each time. If I pick Toledo, I want Toledo stuff prioritized. 

- Sounds: lyrics display well, can’t get songs to play, don’t have all songs yet, but need to work out the path and then drop the song files in the assets folders
- Podcast page: Eventually want to add other Mac-focused podcasts to be sorted from, and then you can listen to your favorite MAC podcast in the app. Prioritization of the MAC Sports Connection, which plays fine, thanks to the RSS feed. 

## NCAA data migration

See `docs/ncaa-data-migration.md` for a step-by-step guide to replacing ESPN data with NCAA data for live scoring, standings, and stats.
