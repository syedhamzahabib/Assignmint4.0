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
  Chat: {
    taskId: string;
    task?: any;
  };
};

// Post Stack ParamList
export type PostStackParamList = {
  Post: undefined;
  PostStep1: undefined;
  PostStep2: {
    taskData: any;
  };
  PostStep3: {
    taskData: any;
  };
  PostStep4: {
    taskData: any;
  };
  PostStep5: {
    taskData: any;
  };
  PostReview: {
    taskData: any;
  };
};

// AI Stack ParamList
export type AIStackParamList = {
  AI: undefined;
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
  Chat: {
    taskId: string;
    task?: any;
  };
};



// Notifications Stack ParamList
export type NotificationsStackParamList = {
  Notifications: undefined;
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
  SystemStatus: undefined;
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
  // Stack-only routes accessible from anywhere
  TaskDetails: {
    taskId: string;
    task?: any;
  };
  UploadDelivery: {
    taskId: string;
    task?: any;
  };
  Chat: {
    taskId: string;
    task?: any;
  };
  ChatThread: {
    chat: { id: string; name: string; taskTitle: string };
  };
  Messages: undefined;
  Notifications: undefined;
  Settings: undefined;
  Payments: undefined;
  AddPaymentMethod: undefined;
  Wallet: undefined;
  AIAssistant: undefined;
  Analytics: undefined;
  SystemStatus: undefined;
  AppearanceSettings: undefined;
  NotificationPreferences: undefined;
  LanguageSelection: undefined;
  DownloadPreferences: undefined;
  BetaFeatures: undefined;
  ContactSupport: undefined;
  TermsOfService: undefined;
  PrivacyPolicy: undefined;
  TaskPostedConfirmation: {
    taskTitle: string;
    budget: string;
    matchingPreference: string;
  };
  IconTest: undefined;
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
  NotificationsStackParamList &
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
  CHAT: 'Chat',

  // Post Stack
  POST: 'Post',
  POST_STEP_1: 'PostStep1',
  POST_STEP_2: 'PostStep2',
  POST_STEP_3: 'PostStep3',
  POST_STEP_4: 'PostStep4',
  POST_STEP_5: 'PostStep5',
  POST_REVIEW: 'PostReview',

  // Tasks Stack
  TASKS: 'Tasks',
  UPLOAD_DELIVERY: 'UploadDelivery',



  // AI Stack
  AI: 'AI',

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
  AI_ASSISTANT: 'AIAssistant',
  ANALYTICS: 'Analytics',
  SYSTEM_STATUS: 'SystemStatus',
  NOTIFICATIONS: 'Notifications',

  // Development
  SCREEN_CATALOG: 'ScreenCatalog',
} as const;

export type RouteName = typeof ROUTES[keyof typeof ROUTES];
