// MockDataSource.ts - Mock data implementation for development/testing
import { DataSource, Task, UserProfile, Notification, Message } from './DataSource';
import { mockTasks, mockUserProfile, mockExperts, mockNotifications } from '../data/mockData';

export class MockDataSource implements DataSource {
  private tasks: Task[] = [...mockTasks];
  private users: UserProfile[] = [mockUserProfile];
  private experts: any[] = [...mockExperts];
  private notifications: Notification[] = [...mockNotifications];
  private messages: Message[] = [];
  private ratings: any[] = [];

  // Helper function for simulating network delays
  private delay(ms: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
  }

  // Task operations
  async getTasks(): Promise<Task[]> {
    // Simulate network delay
    await this.delay(100);
    return this.tasks.filter(task => task.isActive !== false);
  }

  async getTaskById(id: string): Promise<Task | null> {
    await this.delay(50);
    return this.tasks.find(task => task.id === id) || null;
  }

  async createTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
    await this.delay(200);
    const newTask: Task = {
      ...task,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      viewCount: 0,
      applicantCount: 0,
      isActive: true,
      isPublic: true,
      matchingType: 'manual',
    };
    this.tasks.push(newTask);
    return newTask;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    await this.delay(150);
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updates };
    return this.tasks[taskIndex];
  }

  async deleteTask(id: string): Promise<void> {
    await this.delay(100);
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
      this.tasks.splice(taskIndex, 1);
    }
  }

  async claimTask(taskId: string, expertId: string): Promise<Task> {
    await this.delay(200);
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error('Task not found');
    }
    if (task.status !== 'open' && task.status !== 'awaiting_expert') {
      throw new Error('Task is not available for claiming');
    }
    
    const expert = this.users.find(u => u.id === expertId);
    if (!expert) {
      throw new Error('Expert not found');
    }

    task.status = 'claimed';
    task.expertId = expertId;
    task.expertName = expert.nickname;
    task.expertRating = expert.expertStats?.avgRating || 0;

    return task;
  }

  async submitTask(taskId: string, expertId: string, submission: any): Promise<Task> {
    await this.delay(200);
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error('Task not found');
    }
    if (task.expertId !== expertId) {
      throw new Error('Only the assigned expert can submit work');
    }
    
    task.status = 'submitted';
    return task;
  }

  async acceptTask(taskId: string, ownerId: string): Promise<Task> {
    await this.delay(200);
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error('Task not found');
    }
    if (task.requesterId !== ownerId) {
      throw new Error('Only the task owner can accept submission');
    }
    
    task.status = 'completed';
    return task;
  }

  async rejectTask(taskId: string, ownerId: string, reason: string): Promise<Task> {
    await this.delay(200);
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error('Task not found');
    }
    if (task.requesterId !== ownerId) {
      throw new Error('Only the task owner can reject submission');
    }
    
    task.status = 'claimed'; // Back to claimed state
    return task;
  }

  // User operations
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    await this.delay(100);
    return this.users.find(user => user.id === userId) || null;
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    await this.delay(150);
    const userIndex = this.users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    this.users[userIndex] = { ...this.users[userIndex], ...updates };
    return this.users[userIndex];
  }

  async createUserProfile(profile: Omit<UserProfile, 'id' | 'joinDate' | 'memberSince'>): Promise<UserProfile> {
    await this.delay(200);
    const newProfile: UserProfile = {
      ...profile,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      joinDate: new Date().toISOString(),
      memberSince: new Date().getFullYear(),
    };
    this.users.push(newProfile);
    return newProfile;
  }

  // Notification operations
  async getNotifications(userId: string): Promise<Notification[]> {
    await this.delay(100);
    // In mock, return all notifications for simplicity
    return this.notifications;
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    await this.delay(50);
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      notification.isRead = true;
    }
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await this.delay(100);
    this.notifications.forEach(notification => {
      notification.read = true;
      notification.isRead = true;
    });
  }

  async createNotification(notification: Omit<Notification, 'id'>): Promise<Notification> {
    await this.delay(100);
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    this.notifications.push(newNotification);
    return newNotification;
  }

  // Message operations
  async getTaskMessages(taskId: string): Promise<Message[]> {
    await this.delay(100);
    return this.messages.filter(message => message.taskId === taskId);
  }

  async sendMessage(message: Omit<Message, 'id' | 'timestamp'>): Promise<Message> {
    await this.delay(150);
    const newMessage: Message = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    this.messages.push(newMessage);
    return newMessage;
  }

  // Rating operations
  async createRating(rating: any): Promise<any> {
    await this.delay(200);
    const newRating = {
      ...rating,
      id: `rating_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    this.ratings.push(newRating);
    return newRating;
  }

  async getUserRatings(userId: string): Promise<any[]> {
    await this.delay(100);
    return this.ratings.filter(rating => rating.toUserId === userId);
  }

  async getUserRatingSummary(userId: string): Promise<any> {
    await this.delay(100);
    const userRatings = this.ratings.filter(rating => rating.toUserId === userId);
    if (userRatings.length === 0) {
      return { avgRating: 0, totalRatings: 0 };
    }
    
    const totalRating = userRatings.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalRating / userRatings.length;
    
    return {
      avgRating: Math.round(avgRating * 100) / 100,
      totalRatings: userRatings.length,
    };
  }

  // Search and filtering
  async searchTasks(query: string, filters?: any): Promise<Task[]> {
    await this.delay(150);
    let filteredTasks = this.tasks.filter(task => task.isActive !== false);
    
    if (query) {
      const lowerQuery = query.toLowerCase();
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(lowerQuery) ||
        task.description.toLowerCase().includes(lowerQuery) ||
        task.subject.toLowerCase().includes(lowerQuery) ||
        task.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    }

    if (filters) {
      if (filters.subject) {
        filteredTasks = filteredTasks.filter(task => task.subject === filters.subject);
      }
      if (filters.status) {
        filteredTasks = filteredTasks.filter(task => task.status === filters.status);
      }
      if (filters.urgency) {
        filteredTasks = filteredTasks.filter(task => task.urgency === filters.urgency);
      }
    }

    return filteredTasks;
  }

  async getTasksByUser(userId: string, type: 'posted' | 'claimed'): Promise<Task[]> {
    await this.delay(100);
    if (type === 'posted') {
      return this.tasks.filter(task => task.requesterId === userId);
    } else {
      return this.tasks.filter(task => task.expertId === userId);
    }
  }

  async getTopRatedUsers(limit: number = 10): Promise<UserProfile[]> {
    await this.delay(100);
    // For mock data, return the main user profile if they have expert stats
    const expertUsers = this.users.filter(user => user.expertStats?.avgRating && user.expertStats.avgRating > 0);
    return expertUsers.slice(0, limit);
  }
}
