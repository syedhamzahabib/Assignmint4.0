// e2e/jest.config.js - Jest config for Detox E2E tests
module.exports = {
  testTimeout: 180000,
  testRunner: 'jest-circus/runner',
  testEnvironment: './init.js',
  testMatch: ['**/*.e2e.ts'],
  verbose: true,
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
