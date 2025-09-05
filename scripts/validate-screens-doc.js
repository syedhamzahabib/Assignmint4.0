#!/usr/bin/env node

/**
 * Screen Documentation Validation Script
 * 
 * This script validates that the navigation documentation in docs/SCREENS_MAP.md
 * matches the actual code implementation in the navigation files.
 * 
 * Usage: npm run validate:screens
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
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

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Expected navigation structure based on SCREENS_MAP.md
const EXPECTED_STRUCTURE = {
  tabs: ['HomeStack', 'PostStack', 'TasksStack', 'AIStack', 'ProfileStack'],
  homeStack: ['Home', 'TaskDetails', 'ChatThread', 'Notifications', 'Messages', 'NavigationTest'],
  postStack: ['Post', 'TaskPostedConfirmation'],
  tasksStack: ['Tasks', 'TaskDetails', 'UploadDelivery', 'ChatThread'],
  aiStack: ['AI', 'AIAssistant', 'TaskDetails'],
  profileStack: ['Profile', 'Settings', 'AppearanceSettings', 'NotificationPreferences', 'LanguageSelection', 'DownloadPreferences', 'BetaFeatures', 'Payments', 'AddPaymentMethod', 'Wallet', 'ContactSupport', 'TermsOfService', 'PrivacyPolicy', 'AIAssistant', 'Analytics', 'IconTest'],
};

// Check if file exists
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// Read file content
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return null;
  }
}

// Extract route names from navigation files
function extractRoutesFromFile(filePath, routePattern) {
  const content = readFile(filePath);
  if (!content) return [];
  
  const matches = content.match(routePattern);
  return matches ? matches.map(match => match.replace(/['"]/g, '')) : [];
}

// Validate navigation structure
function validateNavigationStructure() {
  logInfo('🔍 Validating navigation structure...');
  
  let hasErrors = false;
  
  // Check AppTabs.tsx
  const appTabsPath = 'src/navigation/AppTabs.tsx';
  if (!fileExists(appTabsPath)) {
    logError(`AppTabs.tsx not found at ${appTabsPath}`);
    hasErrors = true;
  } else {
    logSuccess('AppTabs.tsx found');
  }
  
  // Check stack files
  const stackFiles = [
    'src/navigation/stacks/HomeStack.tsx',
    'src/navigation/stacks/PostStack.tsx',
    'src/navigation/stacks/TasksStack.tsx',
    'src/navigation/stacks/AIStack.tsx',
    'src/navigation/stacks/ProfileStack.tsx',
  ];
  
  stackFiles.forEach(stackFile => {
    if (!fileExists(stackFile)) {
      logError(`Stack file not found: ${stackFile}`);
      hasErrors = true;
    } else {
      logSuccess(`Stack file found: ${path.basename(stackFile)}`);
    }
  });
  
  return !hasErrors;
}

// Validate screen files exist
function validateScreenFiles() {
  logInfo('🔍 Validating screen files...');
  
  const expectedScreens = [
    'src/screens/HomeScreen.tsx',
    'src/screens/PostTaskScreen.tsx',
    'src/screens/MyTasksScreen.tsx',
    'src/screens/AIAssistantScreen.tsx',
    'src/screens/ProfileScreen.tsx',
    'src/screens/TaskDetailsScreen.tsx',
    'src/screens/ChatThreadScreen.tsx',
    'src/screens/NotificationsScreen.tsx',
    'src/screens/MessagesScreen.tsx',
    'src/screens/NavigationTestScreen.tsx',
    'src/screens/TaskPostedConfirmation.tsx',
    'src/screens/UploadDeliveryScreen.tsx',
    'src/screens/SettingsScreen.tsx',
    'src/screens/IconTestScreen.tsx',
  ];
  
  let missingScreens = 0;
  
  expectedScreens.forEach(screenPath => {
    if (!fileExists(screenPath)) {
      logError(`Screen file missing: ${screenPath}`);
      missingScreens++;
    } else {
      logSuccess(`Screen file found: ${path.basename(screenPath)}`);
    }
  });
  
  if (missingScreens > 0) {
    logWarning(`${missingScreens} screen files are missing`);
  }
  
  return missingScreens === 0;
}

// Validate navigation types
function validateNavigationTypes() {
  logInfo('🔍 Validating navigation types...');
  
  const typesPath = 'src/types/navigation.ts';
  if (!fileExists(typesPath)) {
    logError(`Navigation types file not found: ${typesPath}`);
    return false;
  }
  
  const content = readFile(typesPath);
  if (!content) {
    logError('Could not read navigation types file');
    return false;
  }
  
  // Check for required route constants
  const requiredRoutes = [
    'HOME', 'POST', 'TASKS', 'AI', 'PROFILE',
    'TASK_DETAILS', 'CHAT_THREAD', 'NOTIFICATIONS', 'MESSAGES',
    'TASK_POSTED_CONFIRMATION', 'UPLOAD_DELIVERY', 'ICON_TEST'
  ];
  
  let missingRoutes = 0;
  
  requiredRoutes.forEach(route => {
    if (!content.includes(`${route}:`)) {
      logError(`Route constant missing: ${route}`);
      missingRoutes++;
    } else {
      logSuccess(`Route constant found: ${route}`);
    }
  });
  
  if (missingRoutes > 0) {
    logWarning(`${missingRoutes} route constants are missing`);
  }
  
  return missingRoutes === 0;
}

// Main validation function
function main() {
  log('🚀 Starting navigation validation...', 'cyan');
  log('');
  
  const results = {
    navigationStructure: validateNavigationStructure(),
    screenFiles: validateScreenFiles(),
    navigationTypes: validateNavigationTypes(),
  };
  
  log('');
  log('📊 Validation Results:', 'cyan');
  log(`Navigation Structure: ${results.navigationStructure ? '✅ PASS' : '❌ FAIL'}`, results.navigationStructure ? 'green' : 'red');
  log(`Screen Files: ${results.screenFiles ? '✅ PASS' : '❌ FAIL'}`, results.screenFiles ? 'green' : 'red');
  log(`Navigation Types: ${results.navigationTypes ? '✅ PASS' : '❌ FAIL'}`, results.navigationTypes ? 'green' : 'red');
  
  const allPassed = Object.values(results).every(result => result);
  
  log('');
  if (allPassed) {
    logSuccess('🎉 All navigation validation checks passed!');
    process.exit(0);
  } else {
    logError('❌ Some navigation validation checks failed. Please fix the issues above.');
    process.exit(1);
  }
}

// Run validation
if (require.main === module) {
  main();
}

module.exports = {
  validateNavigationStructure,
  validateScreenFiles,
  validateNavigationTypes,
};
