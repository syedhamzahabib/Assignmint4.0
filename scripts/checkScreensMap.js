#!/usr/bin/env node

const fs = require('fs');
const p = 'docs/SCREENS_MAP.md';

if (!fs.existsSync(p)) { 
  console.error('⛔ Missing docs/SCREENS_MAP.md'); 
  process.exit(1); 
}

const s = fs.readFileSync(p,'utf8').trim();

if (s.length < 500 || !/AssignMint Screens Map/i.test(s)) {
  console.error('⛔ docs/SCREENS_MAP.md looks empty or invalid.');
  console.error(`File size: ${s.length} characters`);
  console.error('Expected: Contains "AssignMint Screens Map" and >500 characters');
  process.exit(1);
}

console.log('✅ SCREENS_MAP.md present and non-empty.');
