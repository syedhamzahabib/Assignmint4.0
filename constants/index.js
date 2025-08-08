// constants/index.js - Fixed version with proper exports
// App-wide constants and configuration

export const APP_CONFIG = {
  name: 'AssignMint',
  version: '1.0.0',
  description: 'Assignment Help Marketplace',
  supportEmail: 'support@assignmint.com',
  websiteUrl: 'https://assignmint.com',
};

export const COLORS = {
  // Primary Colors
  primary: '#2e7d32',
  primaryLight: '#66bb6a',
  primaryDark: '#1b5e20',
  
  // Secondary Colors
  secondary: '#ff9800',
  secondaryLight: '#ffb74d',
  secondaryDark: '#f57c00',
  
  // Status Colors
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
  
  // Subject Colors
  subjects: {
    math: '#3f51b5',
    coding: '#00796b',
    writing: '#d84315',
    design: '#6a1b9a',
    language: '#00838f',
    chemistry: '#f57f17',
    physics: '#1976d2',
    business: '#388e3c',
    psychology: '#7b1fa2',
    statistics: '#c62828',
    science: '#1976d2',
    biology: '#689f38',
    history: '#5d4037',
    engineering: '#455a64',
    art: '#e91e63'
  },
  
  // Neutral Colors
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
  
  // Background Colors
  background: '#f4f5f9',
  cardBackground: '#ffffff',
  modalOverlay: 'rgba(0, 0, 0, 0.5)',
};

export const FONTS = {
  // Font Sizes
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
  
  // Font Weights
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

export const TASK_STATUSES = {
  // Requester Statuses
  AWAITING_EXPERT: 'awaiting_expert',
  IN_PROGRESS: 'in_progress',
  PENDING_REVIEW: 'pending_review',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  DISPUTED: 'disputed',
  
  // Expert Statuses
  WORKING: 'working',
  DELIVERED: 'delivered',
  PAYMENT_RECEIVED: 'payment_received',
  REVISION_REQUESTED: 'revision_requested',
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

export const URGENCY_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

export const SUBJECTS = [
  { id: 'math', label: '📊 Math', value: 'Math', description: 'Algebra, Calculus, Statistics, Geometry' },
  { id: 'coding', label: '💻 Coding', value: 'Coding', description: 'Programming, Web Dev, Mobile Apps' },
  { id: 'writing', label: '✍️ Writing', value: 'Writing', description: 'Essays, Reports, Creative Writing' },
  { id: 'design', label: '🎨 Design', value: 'Design', description: 'Graphics, UI/UX, Logos, Branding' },
  { id: 'language', label: '🌍 Language', value: 'Language', description: 'Translation, Grammar, Literature' },
  { id: 'science', label: '🔬 Science', value: 'Science', description: 'Biology, Chemistry, Physics, Labs' },
  { id: 'business', label: '💼 Business', value: 'Business', description: 'Marketing, Finance, Strategy, Plans' },
  { id: 'other', label: '📋 Other', value: 'Other', description: 'Something else not listed above' },
];

export const VALIDATION_RULES = {
  TASK_TITLE: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 100,
  },
  TASK_DESCRIPTION: {
    MIN_LENGTH: 20,
    MAX_LENGTH: 1000,
  },
  TASK_PRICE: {
    MIN: 5,
    MAX: 1000,
  },
};

// Default export for backward compatibility
export default {
  APP_CONFIG,
  COLORS,
  FONTS,
  SPACING,
  TASK_STATUSES,
  SCREEN_NAMES,
  URGENCY_LEVELS,
  SUBJECTS,
  VALIDATION_RULES,
};