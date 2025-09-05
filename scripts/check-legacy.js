#!/usr/bin/env node

/**
 * Legacy File Check Script
 * Fails CI/commit if legacy files or emoji icons are found
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// Check for legacy files
function checkLegacyFiles() {
  const issues = [];
  
  // Check if App.js exists outside archive
  if (fs.existsSync('App.js')) {
    const content = fs.readFileSync('App.js', 'utf8');
    if (!content.includes('Wrong entry point') && !content.includes('[LEGACY] This file was archived')) {
      issues.push('App.js exists and is not a blocker file');
    }
  }
  
  // Check if legacy TabBar exists outside archive
  if (fs.existsSync('src/components/common/TabBar.tsx')) {
    const content = fs.readFileSync('src/components/common/TabBar.tsx', 'utf8');
    if (!content.includes('Wrong entry point') && !content.includes('[LEGACY] This file was archived')) {
      issues.push('src/components/common/TabBar.tsx exists and is not a blocker file');
    }
  }
  
  return issues;
}

// Check for emoji tab icons
function checkEmojiIcons() {
  const issues = [];
  const emojiPattern = /🏠|➕|📋|🔔|👤/;
  
  // Check all TypeScript/JavaScript files for emoji icons
  function scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules' && file !== 'archive') {
        scanDirectory(filePath);
      } else if (file.match(/\.(ts|tsx|js|jsx)$/)) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          if (emojiPattern.test(content)) {
            issues.push(`Emoji icons found in ${filePath}`);
          }
        } catch (error) {
          // Skip files that can't be read
        }
      }
    }
  }
  
  scanDirectory('.');
  return issues;
}

// Check for legacy imports
function checkLegacyImports() {
  const issues = [];
  
  function scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules' && file !== 'archive') {
        scanDirectory(filePath);
      } else if (file.match(/\.(ts|tsx|js|jsx)$/)) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          if (content.includes('src/components/common/TabBar') && !content.includes('archive')) {
            issues.push(`Legacy TabBar import found in ${filePath}`);
          }
        } catch (error) {
          // Skip files that can't be read
        }
      }
    }
  }
  
  scanDirectory('.');
  return issues;
}

// Main check function
function main() {
  log('🔍 Checking for legacy files and emoji icons...', 'yellow');
  
  const legacyFileIssues = checkLegacyFiles();
  const emojiIconIssues = checkEmojiIcons();
  const legacyImportIssues = checkLegacyImports();
  
  const allIssues = [...legacyFileIssues, ...emojiIconIssues, ...legacyImportIssues];
  
  if (allIssues.length === 0) {
    logSuccess('No legacy issues found!');
    process.exit(0);
  } else {
    logError('Legacy issues found:');
    allIssues.forEach(issue => logError(`  - ${issue}`));
    logError('\nPlease fix these issues before committing.');
    process.exit(1);
  }
}

// Run the check
main();
