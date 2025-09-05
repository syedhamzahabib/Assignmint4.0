// src/utils/navigationGuard.ts - Navigation route validation utility
import { ROUTES } from '../navigation/types';

export interface NavigationWarning {
  routeName: string;
  currentNavigator: string;
  availableRoutes: string[];
  timestamp: Date;
}

const navigationWarnings: NavigationWarning[] = [];

export const logNavigationWarning = (
  routeName: string,
  currentNavigator: string,
  availableRoutes: string[]
): void => {
  const warning: NavigationWarning = {
    routeName,
    currentNavigator,
    availableRoutes,
    timestamp: new Date(),
  };

  navigationWarnings.push(warning);

  console.warn(
    `🚨 Navigation Warning: Route '${routeName}' not found in '${currentNavigator}' navigator.`,
    `Available routes: [${availableRoutes.join(', ')}]`
  );
};

export const getNavigationWarnings = (): NavigationWarning[] => {
  return [...navigationWarnings];
};

export const clearNavigationWarnings = (): void => {
  navigationWarnings.length = 0;
};

export const validateRoute = (
  routeName: string,
  currentNavigator: string,
  availableRoutes: string[]
): boolean => {
  const isValid = availableRoutes.includes(routeName);
  
  if (!isValid) {
    logNavigationWarning(routeName, currentNavigator, availableRoutes);
  }
  
  return isValid;
};

// Predefined route groups for common navigators
export const NAVIGATOR_ROUTES = {
  AuthStack: [
    ROUTES.LANDING,
    ROUTES.SIGN_UP,
    ROUTES.LOGIN,
    ROUTES.FORGOT_PASSWORD,
    ROUTES.SIGN_UP_PAYMENT,
  ],
  HomeStack: [
    ROUTES.HOME,
    ROUTES.TASK_DETAILS,
    ROUTES.CHAT_THREAD,
    ROUTES.NOTIFICATIONS,
    ROUTES.MESSAGES,
    ROUTES.NAVIGATION_TEST,
  ],
  PostStack: [
    ROUTES.POST,
    ROUTES.TASK_POSTED_CONFIRMATION,
  ],
  TasksStack: [
    ROUTES.TASKS,
    ROUTES.TASK_DETAILS,
    ROUTES.UPLOAD_DELIVERY,
    ROUTES.CHAT_THREAD,
  ],
  AIStack: [
    ROUTES.AI,
    ROUTES.AI_ASSISTANT,
    ROUTES.TASK_DETAILS,
  ],
  ProfileStack: [
    ROUTES.PROFILE,
    ROUTES.SETTINGS,
    ROUTES.PAYMENTS,
    ROUTES.ADD_PAYMENT_METHOD,
    ROUTES.WALLET,
    ROUTES.APPEARANCE_SETTINGS,
    ROUTES.NOTIFICATION_PREFERENCES,
    ROUTES.LANGUAGE_SELECTION,
    ROUTES.DOWNLOAD_PREFERENCES,
    ROUTES.BETA_FEATURES,
    ROUTES.CONTACT_SUPPORT,
    ROUTES.TERMS_OF_SERVICE,
    ROUTES.PRIVACY_POLICY,
    ROUTES.AI_ASSISTANT,
    ROUTES.ANALYTICS,
    ROUTES.ICON_TEST,
  ],
} as const;

export const getNavigatorRoutes = (navigatorName: keyof typeof NAVIGATOR_ROUTES): string[] => {
  return NAVIGATOR_ROUTES[navigatorName] || [];
};
