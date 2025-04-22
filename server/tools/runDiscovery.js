/**
 * Simple script to run the SIDEARM URL discovery tool
 * 
 * Usage: node runDiscovery.js
 */

// First compile the TypeScript file
require('child_process').execSync('npx tsx server/tools/discoverSidearmUrls.ts', { 
  stdio: 'inherit' 
});