// Centralized route names to avoid string typos
import { ROUTES } from '../types/navigation';

// Re-export all route names
export const ROUTE_NAMES = ROUTES;

// Auth routes
export const AUTH_ROUTES = {
  LANDING: ROUTES.LANDING,
  SIGN_UP: ROUTES.SIGN_UP,
  LOGIN: ROUTES.LOGIN,
  FORGOT_PASSWORD: ROUTES.FORGOT_PASSWORD,
  SIGN_UP_PAYMENT: ROUTES.SIGN_UP_PAYMENT,
} as const;

// Main app routes
export const MAIN_ROUTES = {
  MAIN_TABS: ROUTES.MAIN_TABS,
  SCREEN_CATALOG: ROUTES.SCREEN_CATALOG,
} as const;

// Home stack routes
export const HOME_ROUTES = {
  HOME: ROUTES.HOME,
  TASK_DETAILS: ROUTES.TASK_DETAILS,
  CHAT: ROUTES.CHAT,
} as const;

// Post stack routes
export const POST_ROUTES = {
  STEP_1: ROUTES.POST_STEP_1,
  STEP_2: ROUTES.POST_STEP_2,
  STEP_3: ROUTES.POST_STEP_3,
  STEP_4: ROUTES.POST_STEP_4,
  STEP_5: ROUTES.POST_STEP_5,
  REVIEW: ROUTES.POST_REVIEW,
} as const;

// MyTasks stack routes
export const MY_TASKS_ROUTES = {
  MY_TASKS: ROUTES.MY_TASKS,
  TASK_DETAILS: ROUTES.TASK_DETAILS,
  UPLOAD_DELIVERY: ROUTES.UPLOAD_DELIVERY,
  CHAT: ROUTES.CHAT,
} as const;

// Notifications stack routes
export const NOTIFICATIONS_ROUTES = {
  NOTIFICATIONS: ROUTES.NOTIFICATIONS,
  TASK_DETAILS: ROUTES.TASK_DETAILS,
} as const;

// Profile stack routes
export const PROFILE_ROUTES = {
  PROFILE: ROUTES.PROFILE,
  SETTINGS: ROUTES.SETTINGS,
  PAYMENTS: ROUTES.PAYMENTS,
  ADD_PAYMENT_METHOD: ROUTES.ADD_PAYMENT_METHOD,
  WALLET: ROUTES.WALLET,
  APPEARANCE_SETTINGS: ROUTES.APPEARANCE_SETTINGS,
  NOTIFICATION_PREFERENCES: ROUTES.NOTIFICATION_PREFERENCES,
  LANGUAGE_SELECTION: ROUTES.LANGUAGE_SELECTION,
  DOWNLOAD_PREFERENCES: ROUTES.DOWNLOAD_PREFERENCES,
  BETA_FEATURES: ROUTES.BETA_FEATURES,
  CONTACT_SUPPORT: ROUTES.CONTACT_SUPPORT,
  TERMS_OF_SERVICE: ROUTES.TERMS_OF_SERVICE,
  PRIVACY_POLICY: ROUTES.PRIVACY_POLICY,
  AI_ASSISTANT: ROUTES.AI_ASSISTANT,
  ANALYTICS: ROUTES.ANALYTICS,
} as const;

// Tab names for bottom navigation
export const TAB_NAMES = {
  HOME: 'HomeStack',
  POST: 'PostStack',
  TASKS: 'TasksStack',
  MY_TASKS: 'MyTasksStack',
  AI: 'AIStack',
  PROFILE: 'ProfileStack',
} as const;

// Stack names for navigation
export const STACK_NAMES = {
  AUTH: 'Auth',
  MAIN_TABS: 'MainTabs',
  HOME: 'HomeStack',
  POST: 'PostStack',
  TASKS: 'TasksStack',
  MY_TASKS: 'MyTasksStack',
  AI: 'AIStack',
  PROFILE: 'ProfileStack',
} as const;

// Helper function to get route name with type safety
export const getRouteName = <T extends keyof typeof ROUTES>(key: T): typeof ROUTES[T] => {
  return ROUTES[key];
};

// Helper function to check if route exists
export const isValidRoute = (routeName: string): routeName is keyof typeof ROUTES => {
  return Object.values(ROUTES).includes(routeName as any);
};

// Export all route names for easy access
export default ROUTES;
