#!/usr/bin/env ts-node

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

console.log('🧪 Running AssignMint Backend Tests...\n');

// Check if tests directory exists
const testsDir = join(__dirname);
if (!existsSync(testsDir)) {
  console.error('❌ Tests directory not found!');
  process.exit(1);
}

// Check if Jest is installed
try {
  execSync('npx jest --version', { stdio: 'pipe' });
} catch (error) {
  console.error('❌ Jest not found! Please install Jest first: npm install --save-dev jest');
  process.exit(1);
}

// Run tests with coverage
try {
  console.log('📊 Running tests with coverage...\n');
  
  execSync('npx jest --coverage --verbose', {
    stdio: 'inherit',
    cwd: process.cwd(),
  });
  
  console.log('\n✅ All tests completed successfully!');
  
} catch (error) {
  console.error('\n❌ Some tests failed!');
  console.error('Please fix the failing tests before proceeding.');
  process.exit(1);
}

console.log('\n🎉 Test suite completed!');
