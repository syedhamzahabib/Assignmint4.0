export interface Task {
  id: string;
  title: string;
  description: string;
  subject: string;
  price: number;
  deadline: Date;
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  userId: string;
  userEmail: string;
  fileUrls?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  taskId: string;
  senderId: string;
  senderEmail: string;
  content: string;
  createdAt: Date;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
}

export interface IDataSource {
  // Task operations
  getTasks(filters?: {
    status?: string;
    subject?: string;
    q?: string;
    priceMin?: number;
    priceMax?: number;
    sort?: string;
    page?: number;
    limit?: number;
  }): Promise<{ tasks: Task[]; total: number; page: number; totalPages: number }>;
  
  getTaskById(id: string): Promise<Task | null>;
  
  getUserTasks(userId: string): Promise<Task[]>;
  
  createTask(userId: string, taskData: Omit<Task, 'id' | 'userId' | 'userEmail' | 'createdAt' | 'updatedAt'>): Promise<Task>;
  
  updateTask(id: string, updates: Partial<Task>): Promise<Task | null>;
  
  deleteTask(id: string): Promise<boolean>;
  
  // Message operations
  getTaskMessages(taskId: string): Promise<Message[]>;
  
  createMessage(taskId: string, senderId: string, content: string): Promise<Message>;
  
  // User operations
  getUserById(uid: string): Promise<User | null>;
  
  createUser(userData: Omit<User, 'createdAt'>): Promise<User>;
  
  updateUser(uid: string, updates: Partial<User>): Promise<User | null>;
  
  // Connection test
  testConnection(): Promise<boolean>;
}
