// DataSource.ts - Interface for data operations
export interface Task {
  id: string;
  title: string;
  description: string;
  subject: string;
  budget: string | number;
  deadline: string;
  status: string;
  urgency: string;
  requesterId: string;
  requesterName: string;
  requesterRating: number;
  createdAt: string;
  tags: string[];
  aiLevel: string;
  aiPercentage: number;
  bids?: number;
  expertId?: string;
  expertName?: string;
  expertRating?: number;
  viewCount?: number;
  applicantCount?: number;
  isActive?: boolean;
  isPublic?: boolean;
  matchingType?: string;
}

export interface UserProfile {
  id: string;
  nickname: string;
  email: string;
  joinDate: string;
  avatar: string;
  memberSince: number;
  role: string;
  expertProfile?: {
    bio: string;
    specialties: string[];
    availableHours: string;
    responseTime: string;
    isVerified: boolean;
    portfolioItems: Array<{
      type: string;
      title: string;
      url: string;
    }>;
  };
  expertStats?: {
    tasksCompleted: number;
    totalEarned: number;
    avgRating: number;
    totalReviews: number;
    responseTime: string;
    completionRate: number;
    currentBalance: number;
    onTimeDelivery: number;
    repeatClients: number;
    subjectStats: Array<{
      name: string;
      taskCount: number;
      avgRating: number;
      totalEarned: number;
      lastTask: string;
      lastTaskDate: string;
    }>;
  };
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: string;
  taskId?: string;
  timestamp?: string;
  isRead?: boolean;
  taskTitle?: string;
  expertName?: string;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: string;
  taskId: string;
}

export interface DataSource {
  // Task operations
  getTasks(): Promise<Task[]>;
  getTaskById(id: string): Promise<Task | null>;
  createTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  claimTask(taskId: string, expertId: string): Promise<Task>;
  submitTask(taskId: string, expertId: string, submission: any): Promise<Task>;
  acceptTask(taskId: string, ownerId: string): Promise<Task>;
  rejectTask(taskId: string, ownerId: string, reason: string): Promise<Task>;

  // User operations
  getUserProfile(userId: string): Promise<UserProfile | null>;
  updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile>;
  createUserProfile(profile: Omit<UserProfile, 'id' | 'joinDate' | 'memberSince'>): Promise<UserProfile>;

  // Notification operations
  getNotifications(userId: string): Promise<Notification[]>;
  markNotificationAsRead(notificationId: string): Promise<void>;
  markAllNotificationsAsRead(userId: string): Promise<void>;
  createNotification(notification: Omit<Notification, 'id'>): Promise<Notification>;

  // Message operations
  getTaskMessages(taskId: string): Promise<Message[]>;
  sendMessage(message: Omit<Message, 'id' | 'timestamp'>): Promise<Message>;

  // Rating operations
  createRating(rating: any): Promise<any>;
  getUserRatings(userId: string): Promise<any[]>;
  getUserRatingSummary(userId: string): Promise<any>;

  // Search and filtering
  searchTasks(query: string, filters?: any): Promise<Task[]>;
  getTasksByUser(userId: string, type: 'posted' | 'claimed'): Promise<Task[]>;
  getTopRatedUsers(limit?: number): Promise<UserProfile[]>;
}
