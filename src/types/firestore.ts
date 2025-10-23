// src/types/firestore.ts
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'requester' | 'expert' | 'both';
  createdAt: Date;
  updatedAt: Date;
  trustScore: number;
  rating: number;
  totalReviews: number;
  tasksCompleted: number;
  tasksPosted: number;
  totalEarnings: number;
  badges: string[];
  isVerified: boolean;
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
    language: string;
  };
}

export interface Task {
  id: string;
  title: string;
  description: string;
  subject: string;
  price: number;
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  urgency: 'low' | 'medium' | 'high';
  aiLevel: number;
  createdBy: string; // User ID
  createdByName: string;
  completedBy?: string; // User ID
  completedByName?: string;
  fileUrls: string[];
  tags: string[];
  specialInstructions?: string;
  estimatedHours?: number;
  matchingType: 'manual' | 'auto';
  autoMatch: boolean; // New field for auto-matching
  assignedExpert?: string; // User ID of auto-assigned expert
  assignedExpertName?: string; // Name of auto-assigned expert
  applicants: string[]; // User IDs
  acceptedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
}

export interface Chat {
  id: string;
  taskId: string;
  taskTitle: string;
  participants: string[]; // User IDs
  participantNames: { [userId: string]: string };
  lastMessage?: {
    text: string;
    senderId: string;
    senderName: string;
    timestamp: Date;
  };
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'system';
  fileUrl?: string;
  fileName?: string;
  isRead: boolean;
  readBy: { [userId: string]: Date };
}

export interface Notification {
  id: string;
  userId: string;
  type: 'newTask' | 'taskAccepted' | 'messageReceived' | 'taskCompleted' | 'paymentReceived' | 'system';
  title: string;
  body: string;
  data?: { [key: string]: string };
  isRead: boolean;
  createdAt: Date;
  taskId?: string;
  chatId?: string;
  fromUserId?: string;
}

export interface Wallet {
  userId: string;
  balance: number; // Available balance in cents
  pendingBalance: number; // Pending balance in cents
  totalEarnings: number; // Total earnings in cents
  totalWithdrawn: number; // Total withdrawn in cents
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'credit' | 'debit';
  amount: number; // Amount in cents
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  createdAt: Date;
  completedAt?: Date;
  taskId?: string;
  stripeTransactionId?: string;
  paymentMethod?: string;
  metadata?: { [key: string]: string };
}

export interface AIChatSession {
  id: string;
  userId: string;
  subject?: string;
  messages: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    type: 'text' | 'image' | 'file';
    fileUrl?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// Firestore collection references
export const COLLECTIONS = {
  USERS: 'users',
  TASKS: 'tasks',
  CHATS: 'chats',
  MESSAGES: 'messages',
  NOTIFICATIONS: 'notifications',
  WALLETS: 'wallets',
  TRANSACTIONS: 'transactions',
  AI_SESSIONS: 'aiSessions',
} as const;

// Query helpers
export interface TaskQuery {
  status?: Task['status'];
  createdBy?: string;
  completedBy?: string;
  subject?: string;
  minPrice?: number;
  maxPrice?: number;
  urgency?: Task['urgency'];
  limit?: number;
  orderBy?: 'createdAt' | 'price' | 'deadline';
  orderDirection?: 'asc' | 'desc';
}

export interface ChatQuery {
  participants?: string[];
  taskId?: string;
  isActive?: boolean;
  limit?: number;
  orderBy?: 'updatedAt' | 'createdAt';
  orderDirection?: 'asc' | 'desc';
}

export interface NotificationQuery {
  userId: string;
  isRead?: boolean;
  type?: Notification['type'];
  limit?: number;
  orderBy?: 'createdAt';
  orderDirection?: 'desc';
}
