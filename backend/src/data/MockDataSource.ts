import { IDataSource, Task, Message, User } from '../types/IDataSource';
import { v4 as uuidv4 } from 'uuid';

export class MockDataSource implements IDataSource {
  private tasks: Task[] = [];
  private messages: Message[] = [];
  private users: User[] = [];

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed demo users
    const demoUsers: Omit<User, 'createdAt'>[] = [
      {
        uid: 'user1',
        email: 'student1@example.com',
        displayName: 'John Student',
        photoURL: 'https://via.placeholder.com/150'
      },
      {
        uid: 'user2',
        email: 'student2@example.com',
        displayName: 'Jane Student',
        photoURL: 'https://via.placeholder.com/150'
      },
      {
        uid: 'user3',
        email: 'tutor1@example.com',
        displayName: 'Dr. Smith',
        photoURL: 'https://via.placeholder.com/150'
      }
    ];

    this.users = demoUsers.map(user => ({
      ...user,
      createdAt: new Date()
    }));

    // Seed demo tasks
    const demoTasks: Omit<Task, 'id' | 'userId' | 'userEmail' | 'createdAt' | 'updatedAt'>[] = [
      {
        title: 'Calculus Homework Help',
        description: 'Need help with calculus derivatives and integrals. Assignment due in 3 days.',
        subject: 'Mathematics',
        price: 45.00,
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        status: 'open',
        fileUrls: ['https://example.com/file1.pdf']
      },
      {
        title: 'Essay Writing Assistance',
        description: 'Help with writing a 5-page essay on Shakespeare\'s Hamlet. Need help with thesis and structure.',
        subject: 'English Literature',
        price: 60.00,
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        status: 'open',
        fileUrls: []
      },
      {
        title: 'Physics Lab Report',
        description: 'Need help analyzing experimental data and writing a lab report for physics class.',
        subject: 'Physics',
        price: 35.00,
        deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: 'in-progress',
        fileUrls: ['https://example.com/lab-data.xlsx']
      },
      {
        title: 'Programming Assignment',
        description: 'Help with Python programming assignment. Need to create a web scraper.',
        subject: 'Computer Science',
        price: 50.00,
        deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        status: 'open',
        fileUrls: ['https://example.com/requirements.txt']
      }
    ];

    this.tasks = demoTasks.map((task, index) => ({
      ...task,
      id: uuidv4(),
      userId: this.users[index % this.users.length]?.uid || 'unknown',
      userEmail: this.users[index % this.users.length]?.email || 'unknown@example.com',
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    }));

    // Seed demo messages
    const demoMessages: Omit<Message, 'id' | 'createdAt'>[] = [
      {
        taskId: this.tasks[0]?.id || 'task1',
        senderId: 'user3',
        senderEmail: 'tutor1@example.com',
        content: 'I can help you with calculus! I have a PhD in Mathematics and 5 years of tutoring experience.'
      },
      {
        taskId: this.tasks[0]?.id || 'task1',
        senderId: 'user1',
        senderEmail: 'student1@example.com',
        content: 'That sounds great! When can you start?'
      },
      {
        taskId: this.tasks[1]?.id || 'task2',
        senderId: 'user2',
        senderEmail: 'student2@example.com',
        content: 'I\'m interested in helping with your essay. I majored in English Literature.'
      }
    ];

    this.messages = demoMessages.map(message => ({
      ...message,
      id: uuidv4(),
      createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000)
    }));
  }

  async getTasks(filters?: {
    status?: string;
    subject?: string;
    q?: string;
    priceMin?: number;
    priceMax?: number;
    sort?: string;
    page?: number;
    limit?: number;
  }): Promise<{ tasks: Task[]; total: number; page: number; totalPages: number }> {
    let filteredTasks = [...this.tasks];

    // Apply filters
    if (filters?.status) {
      filteredTasks = filteredTasks.filter(task => task.status === filters.status);
    }

    if (filters?.subject) {
      filteredTasks = filteredTasks.filter(task => 
        task.subject.toLowerCase().includes(filters.subject!.toLowerCase())
      );
    }

    if (filters?.q) {
      const query = filters.q.toLowerCase();
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.subject.toLowerCase().includes(query)
      );
    }

    if (filters?.priceMin !== undefined) {
      filteredTasks = filteredTasks.filter(task => task.price >= filters.priceMin!);
    }

    if (filters?.priceMax !== undefined) {
      filteredTasks = filteredTasks.filter(task => task.price <= filters.priceMax!);
    }

    // Apply sorting
    if (filters?.sort) {
      switch (filters.sort) {
        case 'price-asc':
          filteredTasks.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filteredTasks.sort((a, b) => b.price - a.price);
          break;
        case 'deadline-asc':
          filteredTasks.sort((a, b) => a.deadline.getTime() - b.deadline.getTime());
          break;
        case 'deadline-desc':
          filteredTasks.sort((a, b) => b.deadline.getTime() - a.deadline.getTime());
          break;
        case 'created-asc':
          filteredTasks.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
          break;
        case 'created-desc':
        default:
          filteredTasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          break;
      }
    }

    const total = filteredTasks.length;
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

    return {
      tasks: paginatedTasks,
      total,
      page,
      totalPages
    };
  }

  async getTaskById(id: string): Promise<Task | null> {
    return this.tasks.find(task => task.id === id) || null;
  }

  async getUserTasks(userId: string): Promise<Task[]> {
    return this.tasks.filter(task => task.userId === userId);
  }

  async createTask(userId: string, taskData: Omit<Task, 'id' | 'userId' | 'userEmail' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const user = this.users.find(u => u.uid === userId);
    if (!user) {
      throw new Error('User not found');
    }

    const task: Task = {
      ...taskData,
      id: uuidv4(),
      userId,
      userEmail: user.email,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.tasks.push(task);
    return task;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return null;

    const existingTask = this.tasks[taskIndex];
    if (!existingTask) return null;

    const updatedTask: Task = {
      id: existingTask.id,
      title: existingTask.title,
      description: existingTask.description,
      subject: existingTask.subject,
      price: existingTask.price,
      deadline: existingTask.deadline,
      status: existingTask.status,
      userId: existingTask.userId,
      userEmail: existingTask.userEmail,
      fileUrls: existingTask.fileUrls || [],
      createdAt: existingTask.createdAt,
      updatedAt: new Date(),
      ...updates
    };

    this.tasks[taskIndex] = updatedTask;
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return false;

    this.tasks.splice(taskIndex, 1);
    
    // Also delete related messages
    this.messages = this.messages.filter(message => message.taskId !== id);
    
    return true;
  }

  async getTaskMessages(taskId: string): Promise<Message[]> {
    return this.messages
      .filter(message => message.taskId === taskId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createMessage(taskId: string, senderId: string, content: string): Promise<Message> {
    const user = this.users.find(u => u.uid === senderId);
    if (!user) {
      throw new Error('User not found');
    }

    const message: Message = {
      id: uuidv4(),
      taskId,
      senderId,
      senderEmail: user.email,
      content,
      createdAt: new Date()
    };

    this.messages.push(message);
    return message;
  }

  async getUserById(uid: string): Promise<User | null> {
    return this.users.find(user => user.uid === uid) || null;
  }

  async createUser(userData: Omit<User, 'createdAt'>): Promise<User> {
    const user: User = {
      ...userData,
      createdAt: new Date()
    };

    this.users.push(user);
    return user;
  }

  async updateUser(uid: string, updates: Partial<User>): Promise<User | null> {
    const userIndex = this.users.findIndex(user => user.uid === uid);
    if (userIndex === -1) return null;

    const existingUser = this.users[userIndex];
    if (!existingUser) return null;

    const updatedUser: User = {
      uid: existingUser.uid,
      email: existingUser.email,
      displayName: existingUser.displayName || '',
      photoURL: existingUser.photoURL || '',
      createdAt: existingUser.createdAt,
      ...updates
    };

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  async testConnection(): Promise<boolean> {
    return true; // Mock data source is always available
  }

  async getUserCount(): Promise<number> {
    return this.users.length;
  }

  async getTaskCount(): Promise<number> {
    return this.tasks.length;
  }

  async getMessageCount(): Promise<number> {
    return this.messages.length;
  }
}
