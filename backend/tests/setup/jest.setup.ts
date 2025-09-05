import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: 'env.test' });

// Mock external dependencies
jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  app: jest.fn(),
  auth: jest.fn(),
  firestore: jest.fn(),
  storage: jest.fn(),
}));

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(),
}));

jest.mock('algoliasearch', () => jest.fn());

jest.mock('crypto', () => ({
  randomBytes: jest.fn(),
  createHash: jest.fn(),
  createHmac: jest.fn(),
}));

// Global test utilities
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidDate(): R;
      toBeValidId(): R;
      toBeValidEmail(): R;
    }
  }
}

// Custom matchers
expect.extend({
  toBeValidDate(received: any) {
    const pass = received instanceof Date && !isNaN(received.getTime());
    return {
      message: () => `expected ${received} to be a valid Date`,
      pass,
    };
  },
  toBeValidId(received: any) {
    const pass = typeof received === 'string' && received.length > 0;
    return {
      message: () => `expected ${received} to be a valid ID string`,
      pass,
    };
  },
  toBeValidEmail(received: any) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pass = typeof received === 'string' && emailRegex.test(received);
    return {
      message: () => `expected ${received} to be a valid email address`,
      pass,
    };
  },
});

// Global test setup
beforeAll(async () => {
  // Set up test environment
  process.env['NODE_ENV'] = 'test';
  process.env['FIREBASE_PROJECT_ID'] = 'test-project';
  process.env['FIREBASE_PRIVATE_KEY'] = 'test-key';
  process.env['FIREBASE_CLIENT_EMAIL'] = 'test@test.com';
  process.env['SMTP_HOST'] = 'localhost';
  process.env['SMTP_PORT'] = '587';
  process.env['SMTP_USER'] = 'test@test.com';
  process.env['SMTP_PASS'] = 'test-pass';
  process.env['ALGOLIA_APP_ID'] = 'test-app-id';
  process.env['ALGOLIA_API_KEY'] = 'test-api-key';
  process.env['ENCRYPTION_KEY'] = 'test-encryption-key-32-chars-long';
});

// Global test teardown
afterAll(async () => {
  // Clean up test environment
  jest.clearAllMocks();
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
