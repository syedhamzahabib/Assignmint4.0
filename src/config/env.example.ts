// env.example.ts - Example environment configuration
// Copy this file to env.ts and modify the values as needed

export const envExample = {
  // Data Source Configuration
  // Set to true to use mock data, false to use Firestore
  USE_MOCK: false,
  
  // API Configuration
  API_BASE_URL: 'http://localhost:3000',
  
  // Firebase Configuration
  FIREBASE_PROJECT_ID: 'assignmint-app',
  FIREBASE_API_KEY: 'your-firebase-api-key-here',
  
  // Feature Flags
  ENABLE_AI_FEATURES: true,
  ENABLE_PUSH_NOTIFICATIONS: true,
  
  // Development Settings
  ENABLE_LOGGING: true,
  ENABLE_ANALYTICS: false,
};

// To use this configuration:
// 1. Copy this file to env.ts
// 2. Modify the values as needed
// 3. Import and use in your app
// 4. Add env.ts to .gitignore to keep sensitive data out of version control
