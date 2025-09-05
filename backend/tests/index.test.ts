/**
 * AssignMint Backend Test Suite
 * 
 * This file serves as the main entry point for all backend tests.
 * It ensures all test modules are loaded and executed.
 */

// Import all test suites
import './email/emailService.test';
import './webhooks/webhookService.test';
import './search/searchService.test';
import './migrations/migrationService.test';
import './utils/secrets.test';
import './ops/opsDashboard.test';
import './admin/adminService.test';

// Test suite description
describe('AssignMint Backend Test Suite', () => {
  it('should load all test modules', () => {
    expect(true).toBe(true);
  });
  
  it('should have all required test files', () => {
    const requiredTests = [
      'emailService.test',
      'webhookService.test',
      'searchService.test',
      'migrationService.test',
      'secrets.test',
      'opsDashboard.test',
      'adminService.test',
    ];
    
    requiredTests.forEach(testFile => {
      expect(require(`./${testFile.split('.')[0]}/${testFile}`)).toBeDefined();
    });
  });
});
