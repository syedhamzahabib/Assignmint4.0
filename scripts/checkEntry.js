#!/usr/bin/env node

const fs = require('fs');

try {
  const idx = fs.readFileSync('index.js', 'utf8');
  if (!idx.includes(`import App from './App.tsx'`)) {
    console.error('⛔ index.js must import App.tsx');
    console.error('Current content:', idx);
    process.exit(1);
  }
  console.log('✅ Entry point is correct.');
} catch (error) {
  console.error('❌ Error reading index.js:', error.message);
  process.exit(1);
}
