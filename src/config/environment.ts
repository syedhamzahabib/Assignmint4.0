// environment.ts - Environment configuration for the app
import { Platform } from 'react-native';

interface EnvironmentConfig {
  // Data source configuration
  USE_MOCK_DATA: boolean;
  
  // API configuration
  API_BASE_URL: string;
  
  // Firebase configuration
  FIREBASE_PROJECT_ID: string;
  FIREBASE_API_KEY: string;
  
  // Feature flags
  ENABLE_AI_FEATURES: boolean;
  ENABLE_PUSH_NOTIFICATIONS: boolean;
  
  // Development settings
  ENABLE_LOGGING: boolean;
  ENABLE_ANALYTICS: boolean;
}

// Default configuration
const defaultConfig: EnvironmentConfig = {
  USE_MOCK_DATA: false, // Default to Firestore
  API_BASE_URL: 'http://localhost:3000',
  FIREBASE_PROJECT_ID: 'assignmint-app',
  FIREBASE_API_KEY: '',
  ENABLE_AI_FEATURES: true,
  ENABLE_PUSH_NOTIFICATIONS: true,
  ENABLE_LOGGING: __DEV__,
  ENABLE_ANALYTICS: !__DEV__,
};

// Platform-specific overrides
const platformConfig: Partial<EnvironmentConfig> = Platform.select({
  ios: {
    // iOS-specific settings
  },
  android: {
    // Android-specific settings
  },
  default: {},
});

// Development overrides
const developmentConfig: Partial<EnvironmentConfig> = __DEV__ ? {
  USE_MOCK_DATA: false, // Can be toggled via environment variable
  ENABLE_LOGGING: true,
  ENABLE_ANALYTICS: false,
} : {};

// Production overrides
const productionConfig: Partial<EnvironmentConfig> = !__DEV__ ? {
  USE_MOCK_DATA: false,
  ENABLE_LOGGING: false,
  ENABLE_ANALYTICS: true,
} : {};

// Merge configurations (order matters - later configs override earlier ones)
export const config: EnvironmentConfig = {
  ...defaultConfig,
  ...platformConfig,
  ...developmentConfig,
  ...productionConfig,
};

// Environment variable overrides (for runtime configuration)
export const getConfig = (): EnvironmentConfig => {
  // For now, return the default config
  // In a real app, you would load this from a .env file or build configuration
  return config;
};

// Helper functions
export const isMockDataEnabled = (): boolean => {
  return getConfig().USE_MOCK_DATA;
};

export const isProduction = (): boolean => {
  return !__DEV__;
};

export const isDevelopment = (): boolean => {
  return __DEV__;
};

// Export individual config values for convenience
export const {
  USE_MOCK_DATA,
  API_BASE_URL,
  FIREBASE_PROJECT_ID,
  FIREBASE_API_KEY,
  ENABLE_AI_FEATURES,
  ENABLE_PUSH_NOTIFICATIONS,
  ENABLE_LOGGING,
  ENABLE_ANALYTICS,
} = config;
