// constants/fallback.js - Fallback constants to prevent import errors
// Use this if the main constants file has import issues

export const COLORS = {
  primary: '#2e7d32',
  primaryLight: '#66bb6a',
  primaryDark: '#1b5e20',
  secondary: '#ff9800',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
  white: '#ffffff',
  black: '#000000',
  gray50: '#fafafa',
  gray100: '#f5f5f5',
  gray200: '#eeeeee',
  gray300: '#e0e0e0',
  gray400: '#bdbdbd',
  gray500: '#9e9e9e',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',
  background: '#f4f5f9',
  cardBackground: '#ffffff',
  modalOverlay: 'rgba(0, 0, 0, 0.5)',
};

export const FONTS = {
  sizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
    title: 28,
    heading: 32,
  },
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    extraBold: '800',
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
};

export const SCREEN_NAMES = {
  HOME: 'Home',
  POST_TASK: 'PostTask',
  MY_TASKS: 'MyTasks',
  NOTIFICATIONS: 'Notifications',
  PROFILE: 'Profile',
  WALLET: 'Wallet',
  TASK_DETAILS: 'TaskDetails',
  TASK_ACTION: 'TaskAction',
};

// Default export
export default {
  COLORS,
  FONTS,
  SPACING,
  SCREEN_NAMES,
};