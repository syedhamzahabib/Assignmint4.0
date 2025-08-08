// types/index.ts - TypeScript interfaces for AssignMint app

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isExpert: boolean;
  rating?: number;
  completedTasks?: number;
  totalEarnings?: number;
  subjects?: string[];
  bio?: string;
  joinDate: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  subject: string;
  urgency: 'high' | 'medium' | 'low';
  budget: number;
  deadline: Date;
  status: TaskStatus;
  requesterId: string;
  expertId?: string;
  createdAt: Date;
  updatedAt: Date;
  attachments?: string[];
  tags?: string[];
  location?: string;
  isUrgent: boolean;
  isFeatured: boolean;
}

export type TaskStatus = 
  | 'awaiting_expert'
  | 'in_progress'
  | 'pending_review'
  | 'completed'
  | 'cancelled'
  | 'disputed'
  | 'working'
  | 'delivered'
  | 'payment_received'
  | 'revision_requested';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'task' | 'payment' | 'system' | 'message';
  isRead: boolean;
  createdAt: Date;
  data?: any;
}

export interface Wallet {
  balance: number;
  currency: string;
  transactions: Transaction[];
  pendingAmount: number;
  totalEarned: number;
  totalSpent: number;
}

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  taskId?: string;
  reference?: string;
}

export interface TaskFilter {
  subject?: string;
  urgency?: string;
  minBudget?: number;
  maxBudget?: number;
  status?: TaskStatus;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface NavigationProps {
  navigation: any;
  route: any;
}

export interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export interface AppState {
  user: User | null;
  tasks: Task[];
  notifications: Notification[];
  wallet: Wallet;
  isLoading: boolean;
  error: string | null;
  activeTab: string;
  showWallet: boolean;
  walletParams: any;
  unreadNotifications: number;
  isInitialized: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface FileUpload {
  uri: string;
  name: string;
  type: string;
  size: number;
}

export interface TaskSubmission {
  taskId: string;
  files: FileUpload[];
  message: string;
  expertId: string;
}

export interface ExpertProfile {
  userId: string;
  subjects: string[];
  hourlyRate: number;
  rating: number;
  totalReviews: number;
  completedTasks: number;
  totalEarnings: number;
  availability: boolean;
  bio: string;
  certifications: string[];
  portfolio: string[];
}

export interface ChatMessage {
  id: string;
  taskId: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  attachments?: string[];
}

export interface TaskReview {
  id: string;
  taskId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface AppConfig {
  name: string;
  version: string;
  description: string;
  supportEmail: string;
  websiteUrl: string;
}

export interface Theme {
  colors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    secondaryLight: string;
    secondaryDark: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    white: string;
    black: string;
    background: string;
    cardBackground: string;
    [key: string]: string;
  };
  fonts: {
    sizes: {
      [key: string]: number;
    };
    weights: {
      [key: string]: string;
    };
  };
  spacing: {
    [key: string]: number;
  };
} 