// Constants for AssignMint App
import { SPACING } from './spacing';

export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  background: '#F2F2F7',
  surface: '#FFFFFF',
  white: '#FFFFFF',
  text: '#000000',
  textPrimary: '#000000',
  textSecondary: '#8E8E93',
  border: '#C6C6C8',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  card: '#FFFFFF',
  shadow: '#000000',
  lightGray: '#F8F9FA',
  mediumGray: '#E9ECEF',
  darkGray: '#6C757D',
  purple: '#6F42C1',
  orange: '#FD7E14',
  teal: '#20C997',
  indigo: '#6610F2',
  pink: '#E83E8C',
  yellow: '#FFC107',
  cyan: '#17A2B8',
  lime: '#28A745',
  brown: '#795548',
  deepPurple: '#673AB7',
  lightBlue: '#03A9F4',
  amber: '#FF9800',
  lightGreen: '#8BC34A',
  deepOrange: '#FF5722',
  blueGrey: '#607D8B',
  black: '#000000',
  // Additional colors for missing references
  bg: '#F2F2F7',
  muted: '#8E8E93',
  info: '#007AFF',
};

export const FONTS = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  weights: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
    extraBold: '800' as const,
  },
};

// Re-export SPACING from the separate file
export { SPACING };

export const SCREEN_NAMES = {
  HOME: 'home',
  POST_TASK: 'post',
  MY_TASKS: 'tasks',
  NOTIFICATIONS: 'notifications',
  PROFILE: 'profile',
  WALLET: 'wallet',
  TASK_DETAILS: 'taskDetails',
  UPLOAD_DELIVERY: 'uploadDelivery',
  TASK_ACTION: 'taskAction',
  AI_ASSISTANT: 'AIAssistant',
};

export const SUBJECTS = [
  { id: 'math', label: 'Math', value: 'Math' },
  { id: 'coding', label: 'Coding', value: 'Coding' },
  { id: 'writing', label: 'Writing', value: 'Writing' },
  { id: 'design', label: 'Design', value: 'Design' },
  { id: 'language', label: 'Language', value: 'Language' },
  { id: 'science', label: 'Science', value: 'Science' },
  { id: 'business', label: 'Business', value: 'Business' },
  { id: 'chemistry', label: 'Chemistry', value: 'Chemistry' },
  { id: 'physics', label: 'Physics', value: 'Physics' },
  { id: 'psychology', label: 'Psychology', value: 'Psychology' },
  { id: 'other', label: 'Other', value: 'Other' },
];

export const URGENCY_LEVELS = [
  { id: 'high', label: 'High Priority', value: 'high' },
  { id: 'medium', label: 'Medium Priority', value: 'medium' },
  { id: 'low', label: 'Low Priority', value: 'low' },
];

export const AI_LEVELS = [
  { id: 'none', label: 'No AI', value: 'none', description: 'Traditional human work' },
  { id: 'assisted', label: 'AI Assisted', value: 'assisted', description: 'AI helps with research and drafting' },
  { id: 'enhanced', label: 'AI Enhanced', value: 'enhanced', description: 'AI generates content with human review' },
  { id: 'ai_heavy', label: 'AI Heavy', value: 'ai_heavy', description: 'Primarily AI with human oversight' },
];

export const TASK_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  DISPUTED: 'disputed',
};

export const PAYMENT_METHODS = [
  { id: 'credit_card', label: 'Credit Card', value: 'credit_card' },
  { id: 'debit_card', label: 'Debit Card', value: 'debit_card' },
  { id: 'paypal', label: 'PayPal', value: 'paypal' },
  { id: 'apple_pay', label: 'Apple Pay', value: 'apple_pay' },
  { id: 'google_pay', label: 'Google Pay', value: 'google_pay' },
];

export const NOTIFICATION_TYPES = {
  NEW_BID: 'new_bid',
  TASK_COMPLETED: 'task_completed',
  PAYMENT_RECEIVED: 'payment_received',
  TASK_ACCEPTED: 'task_accepted',
  DEADLINE_REMINDER: 'deadline_reminder',
  SYSTEM_MESSAGE: 'system_message',
};

// Firebase configuration is now handled in src/config/firebase.js

export const APP_CONFIG = {
  name: 'AssignMint',
  version: '1.0.0',
  description: 'Assignment Help Marketplace',
  supportEmail: 'support@assignmint.com',
  privacyPolicyUrl: 'https://assignmint.com/privacy',
  termsOfServiceUrl: 'https://assignmint.com/terms',
};

// Icon configuration for consistent usage
export const ICONS = {
  // Tab Icons
  HOME: 'home-outline',
  POST: 'add-circle-outline',
  MY_TASKS: 'briefcase-outline',
  NOTIFICATIONS: 'notifications-outline',
  PROFILE: 'person-outline',
  
  // Auth Icons
  SIGN_OUT: 'log-out-outline',
  SHIELD: 'shield-checkmark-outline',
  
  // Action Icons
  CHECKMARK: 'checkmark-circle',
  TIME: 'time-outline',
  PEOPLE: 'people-outline',
  FLASH: 'flash-outline',
  CARD: 'card-outline',
  EYE: 'eye',
  EYE_OFF: 'eye-off',
  ARROW_BACK: 'arrow-back',
  
  // Social Icons
  GOOGLE: 'logo-google',
  APPLE: 'logo-apple',
  
  // Status Icons
  SUCCESS: 'checkmark-circle',
  WARNING: 'alert-circle',
  INFO: 'information-circle-outline',
} as const;

// Development mode flag
export const DEV_MODE = true; // Set to false in production

// Icon size configuration
export const ICON_SIZES = {
  SMALL: 16,
  MEDIUM: 20,
  LARGE: 24,
  XLARGE: 32,
  XXLARGE: 64,
} as const; 