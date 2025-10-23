// src/services/firestoreService.ts
import { getFirebaseDb } from '../lib/firebase';
import {
  User,
  Task,
  Chat,
  Message,
  Notification,
  Wallet,
  Transaction,
  AIChatSession,
  COLLECTIONS,
  TaskQuery,
  ChatQuery,
  NotificationQuery,
} from '../types/firestore';

class FirestoreService {
  // Helper to convert Firestore timestamps to Date objects
  private convertTimestamps(data: any): any {
    if (!data) return data;
    
    const converted = { ...data };
    Object.keys(converted).forEach(key => {
      if (converted[key] && converted[key].toDate && typeof converted[key].toDate === 'function') {
        converted[key] = converted[key].toDate();
      } else if (typeof converted[key] === 'object' && converted[key] !== null) {
        converted[key] = this.convertTimestamps(converted[key]);
      }
    });
    return converted;
  }

  // User Management
  async createUser(userData: Omit<User, 'uid' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const userRef = getFirebaseDb().collection(COLLECTIONS.USERS).doc();
    const user: Omit<User, 'uid'> = {
      ...userData,
      uid: userRef.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await userRef.set({
      ...user,
      createdAt: getFirebaseDb().FieldValue.serverTimestamp(),
      updatedAt: getFirebaseDb().FieldValue.serverTimestamp(),
    });
    
    return userRef.id;
  }

  async getUser(userId: string): Promise<User | null> {
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));
    if (!userDoc.exists()) return null;
    
    return this.convertTimestamps({ id: userDoc.id, ...userDoc.data() }) as User;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }

  // Task Management
  async createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const taskRef = doc(collection(db, COLLECTIONS.TASKS));
    const task: Omit<Task, 'id'> = {
      ...taskData,
      id: taskRef.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await updateDoc(taskRef, {
      ...task,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      deadline: Timestamp.fromDate(task.deadline),
    });
    
    return taskRef.id;
  }

  async getTask(taskId: string): Promise<Task | null> {
    const taskDoc = await getDoc(doc(db, COLLECTIONS.TASKS, taskId));
    if (!taskDoc.exists()) return null;
    
    return this.convertTimestamps({ id: taskDoc.id, ...taskDoc.data() }) as Task;
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    const taskRef = doc(db, COLLECTIONS.TASKS, taskId);
    const updateData: any = {
      ...updates,
      updatedAt: serverTimestamp(),
    };
    
    if (updates.deadline) {
      updateData.deadline = Timestamp.fromDate(updates.deadline);
    }
    
    await updateDoc(taskRef, updateData);
  }

  async getTasks(queryParams: TaskQuery = {}): Promise<Task[]> {
    const constraints: QueryConstraint[] = [];
    
    if (queryParams.status) {
      constraints.push(where('status', '==', queryParams.status));
    }
    if (queryParams.createdBy) {
      constraints.push(where('createdBy', '==', queryParams.createdBy));
    }
    if (queryParams.completedBy) {
      constraints.push(where('completedBy', '==', queryParams.completedBy));
    }
    if (queryParams.subject) {
      constraints.push(where('subject', '==', queryParams.subject));
    }
    if (queryParams.minPrice !== undefined) {
      constraints.push(where('price', '>=', queryParams.minPrice));
    }
    if (queryParams.maxPrice !== undefined) {
      constraints.push(where('price', '<=', queryParams.maxPrice));
    }
    if (queryParams.urgency) {
      constraints.push(where('urgency', '==', queryParams.urgency));
    }
    
    const orderByField = queryParams.orderBy || 'createdAt';
    const orderDirection = queryParams.orderDirection || 'desc';
    constraints.push(orderBy(orderByField, orderDirection));
    
    if (queryParams.limit) {
      constraints.push(limit(queryParams.limit));
    }
    
    const q = query(collection(db, COLLECTIONS.TASKS), ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => 
      this.convertTimestamps({ id: doc.id, ...doc.data() }) as Task
    );
  }

  // Real-time task updates
  subscribeToTasks(
    queryParams: TaskQuery = {},
    callback: (tasks: Task[]) => void
  ): Unsubscribe {
    const constraints: QueryConstraint[] = [];
    
    if (queryParams.status) {
      constraints.push(where('status', '==', queryParams.status));
    }
    if (queryParams.createdBy) {
      constraints.push(where('createdBy', '==', queryParams.createdBy));
    }
    if (queryParams.completedBy) {
      constraints.push(where('completedBy', '==', queryParams.completedBy));
    }
    if (queryParams.subject) {
      constraints.push(where('subject', '==', queryParams.subject));
    }
    if (queryParams.minPrice !== undefined) {
      constraints.push(where('price', '>=', queryParams.minPrice));
    }
    if (queryParams.maxPrice !== undefined) {
      constraints.push(where('price', '<=', queryParams.maxPrice));
    }
    if (queryParams.urgency) {
      constraints.push(where('urgency', '==', queryParams.urgency));
    }
    
    const orderByField = queryParams.orderBy || 'createdAt';
    const orderDirection = queryParams.orderDirection || 'desc';
    constraints.push(orderBy(orderByField, orderDirection));
    
    if (queryParams.limit) {
      constraints.push(limit(queryParams.limit));
    }
    
    const q = query(collection(db, COLLECTIONS.TASKS), ...constraints);
    
    return onSnapshot(q, (querySnapshot) => {
      const tasks = querySnapshot.docs.map(doc => 
        this.convertTimestamps({ id: doc.id, ...doc.data() }) as Task
      );
      callback(tasks);
    });
  }

  // Chat Management
  async createChat(chatData: Omit<Chat, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const chatRef = doc(collection(db, COLLECTIONS.CHATS));
    const chat: Omit<Chat, 'id'> = {
      ...chatData,
      id: chatRef.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await updateDoc(chatRef, {
      ...chat,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return chatRef.id;
  }

  async getChat(chatId: string): Promise<Chat | null> {
    const chatDoc = await getDoc(doc(db, COLLECTIONS.CHATS, chatId));
    if (!chatDoc.exists()) return null;
    
    return this.convertTimestamps({ id: chatDoc.id, ...chatDoc.data() }) as Chat;
  }

  async getChats(queryParams: ChatQuery = {}): Promise<Chat[]> {
    const constraints: QueryConstraint[] = [];
    
    if (queryParams.participants) {
      constraints.push(where('participants', 'array-contains-any', queryParams.participants));
    }
    if (queryParams.taskId) {
      constraints.push(where('taskId', '==', queryParams.taskId));
    }
    if (queryParams.isActive !== undefined) {
      constraints.push(where('isActive', '==', queryParams.isActive));
    }
    
    const orderByField = queryParams.orderBy || 'updatedAt';
    const orderDirection = queryParams.orderDirection || 'desc';
    constraints.push(orderBy(orderByField, orderDirection));
    
    if (queryParams.limit) {
      constraints.push(limit(queryParams.limit));
    }
    
    const q = query(collection(db, COLLECTIONS.CHATS), ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => 
      this.convertTimestamps({ id: doc.id, ...doc.data() }) as Chat
    );
  }

  // Real-time chat updates
  subscribeToChats(
    queryParams: ChatQuery = {},
    callback: (chats: Chat[]) => void
  ): Unsubscribe {
    const constraints: QueryConstraint[] = [];
    
    if (queryParams.participants) {
      constraints.push(where('participants', 'array-contains-any', queryParams.participants));
    }
    if (queryParams.taskId) {
      constraints.push(where('taskId', '==', queryParams.taskId));
    }
    if (queryParams.isActive !== undefined) {
      constraints.push(where('isActive', '==', queryParams.isActive));
    }
    
    const orderByField = queryParams.orderBy || 'updatedAt';
    const orderDirection = queryParams.orderDirection || 'desc';
    constraints.push(orderBy(orderByField, orderDirection));
    
    if (queryParams.limit) {
      constraints.push(limit(queryParams.limit));
    }
    
    const q = query(collection(db, COLLECTIONS.CHATS), ...constraints);
    
    return onSnapshot(q, (querySnapshot) => {
      const chats = querySnapshot.docs.map(doc => 
        this.convertTimestamps({ id: doc.id, ...doc.data() }) as Chat
      );
      callback(chats);
    });
  }

  // Message Management
  async sendMessage(messageData: Omit<Message, 'id' | 'timestamp'>): Promise<string> {
    const messageRef = doc(collection(db, COLLECTIONS.CHATS, messageData.chatId, COLLECTIONS.MESSAGES));
    const message: Omit<Message, 'id'> = {
      ...messageData,
      id: messageRef.id,
      timestamp: new Date(),
    };
    
    await updateDoc(messageRef, {
      ...message,
      timestamp: serverTimestamp(),
    });
    
    // Update chat's last message and timestamp
    await updateDoc(doc(db, COLLECTIONS.CHATS, messageData.chatId), {
      lastMessage: {
        text: messageData.text,
        senderId: messageData.senderId,
        senderName: messageData.senderName,
        timestamp: serverTimestamp(),
      },
      updatedAt: serverTimestamp(),
    });
    
    return messageRef.id;
  }

  // Real-time message updates
  subscribeToMessages(
    chatId: string,
    callback: (messages: Message[]) => void
  ): Unsubscribe {
    const q = query(
      collection(db, COLLECTIONS.CHATS, chatId, COLLECTIONS.MESSAGES),
      orderBy('timestamp', 'asc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const messages = querySnapshot.docs.map(doc => 
        this.convertTimestamps({ id: doc.id, ...doc.data() }) as Message
      );
      callback(messages);
    });
  }

  // Notification Management
  async createNotification(notificationData: Omit<Notification, 'id' | 'createdAt'>): Promise<string> {
    const notificationRef = doc(collection(db, COLLECTIONS.NOTIFICATIONS));
    const notification: Omit<Notification, 'id'> = {
      ...notificationData,
      id: notificationRef.id,
      createdAt: new Date(),
    };
    
    await updateDoc(notificationRef, {
      ...notification,
      createdAt: serverTimestamp(),
    });
    
    return notificationRef.id;
  }

  async getNotifications(queryParams: NotificationQuery): Promise<Notification[]> {
    const constraints: QueryConstraint[] = [
      where('userId', '==', queryParams.userId),
    ];
    
    if (queryParams.isRead !== undefined) {
      constraints.push(where('isRead', '==', queryParams.isRead));
    }
    if (queryParams.type) {
      constraints.push(where('type', '==', queryParams.type));
    }
    
    const orderByField = queryParams.orderBy || 'createdAt';
    const orderDirection = queryParams.orderDirection || 'desc';
    constraints.push(orderBy(orderByField, orderDirection));
    
    if (queryParams.limit) {
      constraints.push(limit(queryParams.limit));
    }
    
    const q = query(collection(db, COLLECTIONS.NOTIFICATIONS), ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => 
      this.convertTimestamps({ id: doc.id, ...doc.data() }) as Notification
    );
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    const notificationRef = doc(db, COLLECTIONS.NOTIFICATIONS, notificationId);
    await updateDoc(notificationRef, { isRead: true });
  }

  // Real-time notification updates
  subscribeToNotifications(
    userId: string,
    callback: (notifications: Notification[]) => void
  ): Unsubscribe {
    const q = query(
      collection(db, COLLECTIONS.NOTIFICATIONS),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const notifications = querySnapshot.docs.map(doc => 
        this.convertTimestamps({ id: doc.id, ...doc.data() }) as Notification
      );
      callback(notifications);
    });
  }

  // Wallet Management
  async getWallet(userId: string): Promise<Wallet | null> {
    const walletDoc = await getDoc(doc(db, COLLECTIONS.WALLETS, userId));
    if (!walletDoc.exists()) return null;
    
    return this.convertTimestamps({ userId, ...walletDoc.data() }) as Wallet;
  }

  async updateWallet(userId: string, updates: Partial<Wallet>): Promise<void> {
    const walletRef = doc(db, COLLECTIONS.WALLETS, userId);
    await updateDoc(walletRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }

  async createTransaction(transactionData: Omit<Transaction, 'id' | 'createdAt'>): Promise<string> {
    const transactionRef = doc(collection(db, COLLECTIONS.TRANSACTIONS));
    const transaction: Omit<Transaction, 'id'> = {
      ...transactionData,
      id: transactionRef.id,
      createdAt: new Date(),
    };
    
    await updateDoc(transactionRef, {
      ...transaction,
      createdAt: serverTimestamp(),
    });
    
    return transactionRef.id;
  }

  async getTransactions(userId: string, limitCount: number = 50): Promise<Transaction[]> {
    const q = query(
      collection(db, COLLECTIONS.TRANSACTIONS),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => 
      this.convertTimestamps({ id: doc.id, ...doc.data() }) as Transaction
    );
  }

  // AI Chat Session Management
  async createAISession(sessionData: Omit<AIChatSession, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const sessionRef = doc(collection(db, COLLECTIONS.AI_SESSIONS));
    const session: Omit<AIChatSession, 'id'> = {
      ...sessionData,
      id: sessionRef.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await updateDoc(sessionRef, {
      ...session,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return sessionRef.id;
  }

  async getAISession(sessionId: string): Promise<AIChatSession | null> {
    const sessionDoc = await getDoc(doc(db, COLLECTIONS.AI_SESSIONS, sessionId));
    if (!sessionDoc.exists()) return null;
    
    return this.convertTimestamps({ id: sessionDoc.id, ...sessionDoc.data() }) as AIChatSession;
  }

  async updateAISession(sessionId: string, updates: Partial<AIChatSession>): Promise<void> {
    const sessionRef = doc(db, COLLECTIONS.AI_SESSIONS, sessionId);
    await updateDoc(sessionRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }

  async getAISessions(userId: string, limitCount: number = 20): Promise<AIChatSession[]> {
    const q = query(
      collection(db, COLLECTIONS.AI_SESSIONS),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => 
      this.convertTimestamps({ id: doc.id, ...doc.data() }) as AIChatSession
    );
  }
}

export const firestoreService = new FirestoreService();
export default firestoreService;
