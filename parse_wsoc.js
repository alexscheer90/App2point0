import fs from 'fs';
import { JSDOM } from 'jsdom';

// Read the HTML file
const html = fs.readFileSync('wsoc_standings.html', 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

// Find the standings table
const table = document.querySelector('.sidearm-standings-table, .sidearm-table');

if (!table) {
  console.log('No standings table found!');
  process.exit(1);
}

// Find the rows in the table body
const rows = table.querySelectorAll('tbody tr');
console.log(`Found ${rows.length} data rows in the standings table`);

// Process each row
rows.forEach((row, index) => {
  try {
    // Get all cells in the row
    const cells = row.querySelectorAll('td');
    
    // Get team name from first cell
    const teamNameCell = cells[0];
    let teamName = '';
    
    // Extract team name - could be in an anchor or directly in the cell
    const teamNameAnchor = teamNameCell.querySelector('a');
    if (teamNameAnchor) {
      teamName = teamNameAnchor.textContent.trim();
    } else {
      teamName = teamNameCell.textContent.trim();
    }
    
    // Extract record data
    let confRecord = '';
    let overallRecord = '';
    
    // Look for records in the remaining cells
    for (let i = 1; i < cells.length; i++) {
      const cellText = cells[i].textContent.trim();
      
      // Usually conference record is before overall record
      if (cellText.includes('-') && !confRecord) {
        confRecord = cellText;
      } else if (cellText.includes('-') && !overallRecord) {
        overallRecord = cellText;
      }
    }
    
    console.log(`${teamName}: Conf=${confRecord}, Overall=${overallRecord}`);
  } catch (err) {
    console.error(`Error processing row ${index}: ${err.message}`);
  }
});