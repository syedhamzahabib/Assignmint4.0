// Navigation types for AssignMint app
import { NavigatorScreenParams } from '@react-navigation/native';

// Auth Stack ParamList
export type AuthStackParamList = {
  Landing: undefined;
  SignUp: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  SignUpPayment: undefined;
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
  };
};

// Tasks Stack ParamList
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

// Main Tabs ParamList
export type MainTabsParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList>;
  PostStack: NavigatorScreenParams<PostStackParamList>;
  TasksStack: NavigatorScreenParams<TasksStackParamList>;
  AIStack: NavigatorScreenParams<AIStackParamList>;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>;
};

// Root Stack ParamList
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  MainTabs: NavigatorScreenParams<MainTabsParamList>;
  ScreenCatalog: undefined;
};

// Screen Catalog ParamList (for development)
export type ScreenCatalogParamList = {
  ScreenCatalog: undefined;
};

// Combined ParamList for type safety
export type AppParamList = RootStackParamList &
  AuthStackParamList &
  HomeStackParamList &
  PostStackParamList &
  TasksStackParamList &
  AIStackParamList &
  ProfileStackParamList &
  ScreenCatalogParamList;

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

  // Legacy routes (for backward compatibility)
  CHAT: 'ChatThread',
  MY_TASKS: 'Tasks',
  POST_STEP_1: 'Post',
  POST_STEP_2: 'Post',
  POST_STEP_3: 'Post',
  POST_STEP_4: 'Post',
  POST_STEP_5: 'Post',
  POST_REVIEW: 'Post',

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

  // Development
  SCREEN_CATALOG: 'ScreenCatalog',
  ICON_TEST: 'IconTest',
} as const;

export type RouteName = typeof ROUTES[keyof typeof ROUTES];
