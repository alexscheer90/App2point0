/**
 * Utility script to discover and validate SIDEARM stats URLs for schools
 * This can be used by administrators to help populate the school feeds database
 */

import { discoverSidearmUrl } from '../config/schoolFeeds';
import fs from 'fs';
import path from 'path';

// List of known MAC school domains to check
const MAC_SCHOOL_DOMAINS = [
  'gozips.com',                // Akron
  'ballstatesports.com',       // Ball State
  'bgsufalcons.com',           // Bowling Green
  'ubbulls.com',               // Buffalo
  'cmuchippewas.com',          // Central Michigan
  'emueagles.com',             // Eastern Michigan
  'kentstatesports.com',       // Kent State
  'miamiredhawks.com',         // Miami (OH)
  'niuhuskies.com',            // Northern Illinois
  'ohiobobcats.com',           // Ohio
  'utrockets.com',             // Toledo
  'wmubroncos.com',            // Western Michigan
  'umassathletics.com'         // Massachusetts
];

// Sports to check for each school
const SPORTS_TO_CHECK = [
  'baseball',
  'mens-basketball',
  'womens-basketball',
  'football',
  'softball',
  'mens-soccer',
  'womens-soccer',
  'volleyball'
];

/**
 * Run the discovery process for all schools and sports
 */
async function discoverAllSidearmUrls() {
  const results: Record<string, Record<string, string | null>> = {};
  
  for (const domain of MAC_SCHOOL_DOMAINS) {
    results[domain] = {};
    console.log(`\nChecking ${domain}...`);
    
    for (const sport of SPORTS_TO_CHECK) {
      process.stdout.write(`  ${sport}: `);
      const url = await discoverSidearmUrl(domain, sport);
      results[domain][sport] = url;
      
      if (url) {
        console.log(`✅ Found! ${url}`);
      } else {
        console.log(`❌ Not found`);
      }
    }
  }
  
  // Save the results to a JSON file
  const resultsPath = path.join(__dirname, 'discovered_urls.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  
  console.log(`\nDiscovery complete! Results saved to ${resultsPath}`);
}

// Run the discovery process
if (require.main === module) {
  console.log('Starting SIDEARM URL discovery...');
  discoverAllSidearmUrls().catch(err => {
    console.error('Error during discovery:', err);
    process.exit(1);
  });
}