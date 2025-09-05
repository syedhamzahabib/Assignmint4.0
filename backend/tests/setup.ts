import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set default test environment
process.env.NODE_ENV = 'test';
process.env.MOCK_DATA = 'true';
process.env.AI_ENABLED = 'false';
