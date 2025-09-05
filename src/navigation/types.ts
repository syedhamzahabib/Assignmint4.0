// src/navigation/types.ts - Centralized navigation types
import { NavigatorScreenParams } from '@react-navigation/native';

// Root Stack ParamList
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  MainTabs: NavigatorScreenParams<MainTabsParamList>;
  ScreenCatalog: undefined;
};

// Auth Stack ParamList
export type AuthStackParamList = {
  Landing: undefined;
  SignUp: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  SignUpPayment: undefined;
};

// Main Tabs ParamList
export type MainTabsParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList>;
  PostStack: NavigatorScreenParams<PostStackParamList>;
  TasksStack: NavigatorScreenParams<TasksStackParamList>;
  AIStack: NavigatorScreenParams<AIStackParamList>;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>;
};

// Home Stack ParamList
export type HomeStackParamList = {
  Home: undefined;
  TaskDetails: {
    taskId: string;
    task?: any;
  };
  ChatThread: {
    chat: {
      id: string;
      name: string;
      taskTitle: string;
    };
  };
  Notifications: undefined;
  Messages: undefined;
  NavigationTest: undefined;
};

// Post Stack ParamList
export type PostStackParamList = {
  Post: undefined;
  TaskPostedConfirmation: {
    taskTitle: string;
    budget: string;
    matchingPreference: string;
    taskId?: string; // Add taskId for navigation
  };
};

// Tasks Stack ParamList (My Tasks)
export type TasksStackParamList = {
  Tasks: undefined;
  TaskDetails: {
    taskId: string;
    task?: any;
  };
  UploadDelivery: {
    taskId: string;
    task?: any;
  };
  ChatThread: {
    chat: {
      id: string;
      name: string;
      taskTitle: string;
    };
  };
};

// AI Stack ParamList
export type AIStackParamList = {
  AI: undefined;
  AIAssistant: undefined;
  TaskDetails: {
    taskId: string;
    task?: any;
  };
};

// Profile Stack ParamList
export type ProfileStackParamList = {
  Profile: undefined;
  Settings: undefined;
  Payments: undefined;
  AddPaymentMethod: undefined;
  Wallet: undefined;
  AppearanceSettings: undefined;
  NotificationPreferences: undefined;
  LanguageSelection: undefined;
  DownloadPreferences: undefined;
  BetaFeatures: undefined;
  ContactSupport: undefined;
  TermsOfService: undefined;
  PrivacyPolicy: undefined;
  AIAssistant: undefined;
  Analytics: undefined;
  IconTest: undefined;
};

// Combined ParamList for type safety
export type AppParamList = RootStackParamList &
  AuthStackParamList &
  MainTabsParamList &
  HomeStackParamList &
  PostStackParamList &
  TasksStackParamList &
  AIStackParamList &
  ProfileStackParamList;

// Navigation prop types
export type NavigationProps<T extends keyof AppParamList> = {
  navigation: any;
  route: {
    params: AppParamList[T];
  };
};

// Route names constants
export const ROUTES = {
  // Auth
  LANDING: 'Landing',
  SIGN_UP: 'SignUp',
  LOGIN: 'Login',
  FORGOT_PASSWORD: 'ForgotPassword',
  SIGN_UP_PAYMENT: 'SignUpPayment',

  // Main Tabs
  MAIN_TABS: 'MainTabs',

  // Home Stack
  HOME: 'Home',
  TASK_DETAILS: 'TaskDetails',
  CHAT_THREAD: 'ChatThread',
  NOTIFICATIONS: 'Notifications',
  MESSAGES: 'Messages',
  NAVIGATION_TEST: 'NavigationTest',

  // Post Stack
  POST: 'Post',
  TASK_POSTED_CONFIRMATION: 'TaskPostedConfirmation',

  // Tasks Stack
  TASKS: 'Tasks',
  UPLOAD_DELIVERY: 'UploadDelivery',

  // AI Stack
  AI: 'AI',
  AI_ASSISTANT: 'AIAssistant',

  // Profile Stack
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
  PAYMENTS: 'Payments',
  ADD_PAYMENT_METHOD: 'AddPaymentMethod',
  WALLET: 'Wallet',
  APPEARANCE_SETTINGS: 'AppearanceSettings',
  NOTIFICATION_PREFERENCES: 'NotificationPreferences',
  LANGUAGE_SELECTION: 'LanguageSelection',
  DOWNLOAD_PREFERENCES: 'DownloadPreferences',
  BETA_FEATURES: 'BetaFeatures',
  CONTACT_SUPPORT: 'ContactSupport',
  TERMS_OF_SERVICE: 'TermsOfService',
  PRIVACY_POLICY: 'PrivacyPolicy',
  ANALYTICS: 'Analytics',
  ICON_TEST: 'IconTest',

  // Development
  SCREEN_CATALOG: 'ScreenCatalog',
} as const;

export type RouteName = typeof ROUTES[keyof typeof ROUTES];
