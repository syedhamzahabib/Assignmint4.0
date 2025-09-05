import { IDataSource, Task, Message, User } from '../types/IDataSource';
import { Firestore } from 'firebase-admin/firestore';

export class FirestoreDataSource implements IDataSource {
  private db: Firestore;

  constructor(db: Firestore) {
    this.db = db;
  }

  async testConnection(): Promise<boolean> {
    try {
      // Test connection by trying to list collections
      // This is a lightweight operation that tests basic connectivity
      await this.db.listCollections();
      return true;
    } catch (error: any) {
      if (error.code === 7 && error.message?.includes('API has not been used')) {
        console.error('Firestore connection test failed: Enable Firestore Database in Firebase Console for project assignimt');
      } else {
        console.error('Firestore connection test failed:', error);
      }
      return false;
    }
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
    try {
      let q: any = this.db.collection('tasks');

      // Apply filters
      if (filters?.status) {
        q = q.where('status', '==', filters.status);
      }

      if (filters?.subject) {
        q = q.where('subject', '==', filters.subject);
      }

      if (filters?.priceMin !== undefined) {
        q = q.where('price', '>=', filters.priceMin);
      }

      if (filters?.priceMax !== undefined) {
        q = q.where('price', '<=', filters.priceMax);
      }

      // Apply sorting
      if (filters?.sort) {
        switch (filters.sort) {
          case 'price-asc':
            q = q.orderBy('price', 'asc');
            break;
          case 'price-desc':
            q = q.orderBy('price', 'desc');
            break;
          case 'deadline-asc':
            q = q.orderBy('deadline', 'asc');
            break;
          case 'deadline-desc':
            q = q.orderBy('deadline', 'desc');
            break;
          case 'created-asc':
            q = q.orderBy('createdAt', 'asc');
            break;
          case 'created-desc':
          default:
            q = q.orderBy('createdAt', 'desc');
            break;
        }
      } else {
        // Default sorting by creation date
        q = q.orderBy('createdAt', 'desc');
      }

      // Get total count first
      const totalSnapshot = await q.get();
      const total = totalSnapshot.size;

      // Apply pagination
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const totalPages = Math.ceil(total / limit);

      // Apply pagination
      q = q.limit(limit);

      const snapshot = await q.get();
      const tasks: Task[] = [];

      snapshot.forEach((doc: any) => {
        const data = doc.data();
        if (data) {
          tasks.push({
            id: doc.id,
            title: data['title'],
            description: data['description'],
            subject: data['subject'],
            price: data['price'],
            deadline: data['deadline'].toDate(),
            status: data['status'],
            userId: data['userId'],
            userEmail: data['userEmail'],
            fileUrls: data['fileUrls'] || [],
            createdAt: data['createdAt'].toDate(),
            updatedAt: data['updatedAt'].toDate()
          });
        }
      });

      // Apply text search filter if provided (Firestore doesn't support full-text search natively)
      let filteredTasks = tasks;
      if (filters?.q) {
        const query = filters.q.toLowerCase();
        filteredTasks = tasks.filter(task =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.subject.toLowerCase().includes(query)
        );
      }

      return {
        tasks: filteredTasks,
        total: filteredTasks.length,
        page,
        totalPages
      };
    } catch (error) {
      console.error('Error getting tasks from Firestore:', error);
      throw new Error('Failed to fetch tasks');
    }
  }

  async getTaskById(id: string): Promise<Task | null> {
    try {
      const docRef = this.db.collection('tasks').doc(id);
      const docSnap = await docRef.get();

      if (!docSnap.exists) {
        return null;
      }

      const data = docSnap.data();
      if (data) {
        return {
          id: docSnap.id,
          title: data['title'],
          description: data['description'],
          subject: data['subject'],
          price: data['price'],
          deadline: data['deadline'].toDate(),
          status: data['status'],
          userId: data['userId'],
          userEmail: data['userEmail'],
          fileUrls: data['fileUrls'] || [],
          createdAt: data['createdAt'].toDate(),
          updatedAt: data['updatedAt'].toDate()
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting task by ID from Firestore:', error);
      throw new Error('Failed to fetch task');
    }
  }

  async createTask(userId: string, taskData: Omit<Task, 'id' | 'userId' | 'userEmail' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    try {
      // Get user email
      const userDoc = await this.db.collection('users').doc(userId).get();
      let userEmail = 'unknown@example.com';
      
      if (userDoc.exists) {
        const userData = userDoc.data();
        if (userData) {
          userEmail = userData['email'] || 'unknown@example.com';
        }
      } else {
        // Create a default user if not found
        console.log(`Creating default user for ID: ${userId}`);
        await this.createUser({
          uid: userId,
          email: 'test@example.com',
          displayName: 'Test User',
          photoURL: 'https://via.placeholder.com/150',
          createdAt: new Date()
        });
        userEmail = 'test@example.com';
      }

      const taskDoc = {
        ...taskData,
        userId,
        userEmail,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await this.db.collection('tasks').add(taskDoc);
      
      return {
        ...taskDoc,
        id: docRef.id
      };
    } catch (error) {
      console.error('Error creating task in Firestore:', error);
      throw new Error('Failed to create task');
    }
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    try {
      const docRef = this.db.collection('tasks').doc(id);
      const docSnap = await docRef.get();

      if (!docSnap.exists) {
        return null;
      }

      const updateData = {
        ...updates,
        updatedAt: new Date()
      };

      await docRef.update(updateData);

      // Get updated document
      const updatedDoc = await docRef.get();
      const data = updatedDoc.data();

      if (data) {
        return {
          id: updatedDoc.id,
          title: data['title'],
          description: data['description'],
          subject: data['subject'],
          price: data['price'],
          deadline: data['deadline'].toDate(),
          status: data['status'],
          userId: data['userId'],
          userEmail: data['userEmail'],
          fileUrls: data['fileUrls'] || [],
          createdAt: data['createdAt'].toDate(),
          updatedAt: data['updatedAt'].toDate()
        };
      }
      return null;
    } catch (error) {
      console.error('Error updating task in Firestore:', error);
      throw new Error('Failed to update task');
    }
  }

  async deleteTask(id: string): Promise<boolean> {
    try {
      const docRef = this.db.collection('tasks').doc(id);
      const docSnap = await docRef.get();

      if (!docSnap.exists) {
        return false;
      }

      // Delete related messages first
      const messagesSnapshot = await this.db.collection('messages')
        .where('taskId', '==', id)
        .get();

      const deletePromises = messagesSnapshot.docs.map(doc => doc.ref.delete());
      await Promise.all(deletePromises);

      // Delete the task
      await docRef.delete();
      return true;
    } catch (error) {
      console.error('Error deleting task from Firestore:', error);
      throw new Error('Failed to delete task');
    }
  }

  async getTaskMessages(taskId: string): Promise<Message[]> {
    try {
      const snapshot = await this.db.collection('messages')
        .where('taskId', '==', taskId)
        .orderBy('createdAt', 'asc')
        .get();

      const messages: Message[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data) {
          messages.push({
            id: doc.id,
            taskId: data['taskId'],
            senderId: data['senderId'],
            senderEmail: data['senderEmail'],
            content: data['content'],
            createdAt: data['createdAt'].toDate()
          });
        }
      });

      return messages;
    } catch (error) {
      console.error('Error getting task messages from Firestore:', error);
      throw new Error('Failed to fetch messages');
    }
  }

  async createMessage(taskId: string, senderId: string, content: string): Promise<Message> {
    try {
      // Get sender email
      const userDoc = await this.db.collection('users').doc(senderId).get();
      if (!userDoc.exists) {
        throw new Error('User not found');
      }

      const userData = userDoc.data();
      if (!userData) {
        throw new Error('User data not found');
      }

      const messageDoc = {
        taskId,
        senderId,
        senderEmail: userData['email'],
        content,
        createdAt: new Date()
      };

      const docRef = await this.db.collection('messages').add(messageDoc);
      
      return {
        ...messageDoc,
        id: docRef.id
      };
    } catch (error) {
      console.error('Error creating message in Firestore:', error);
      throw new Error('Failed to create message');
    }
  }

  async getUserById(uid: string): Promise<User | null> {
    try {
      const docRef = this.db.collection('users').doc(uid);
      const docSnap = await docRef.get();

      if (!docSnap.exists) {
        return null;
      }

      const data = docSnap.data();
      if (data) {
        return {
          uid: docSnap.id,
          email: data['email'],
          displayName: data['displayName'],
          photoURL: data['photoURL'],
          createdAt: data['createdAt'].toDate()
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting user by ID from Firestore:', error);
      throw new Error('Failed to fetch user');
    }
  }

  async createUser(userData: User): Promise<User> {
    try {
      const userDoc = {
        ...userData,
        createdAt: new Date()
      };

      await this.db.collection('users').doc(userData.uid).set(userDoc);
      
      return userData;
    } catch (error) {
      console.error('Error creating user in Firestore:', error);
      throw new Error('Failed to create user');
    }
  }

  async updateUser(uid: string, updates: Partial<User>): Promise<User | null> {
    try {
      const docRef = this.db.collection('users').doc(uid);
      const docSnap = await docRef.get();

      if (!docSnap.exists) {
        return null;
      }

      const updateData = {
        ...updates,
        updatedAt: new Date()
      };

      await docRef.update(updateData);

      // Get updated document
      const updatedDoc = await docRef.get();
      const data = updatedDoc.data();

      if (data) {
        return {
          uid: updatedDoc.id,
          email: data['email'],
          displayName: data['displayName'],
          photoURL: data['photoURL'],
          createdAt: data['createdAt'].toDate()
        };
      }
      return null;
    } catch (error) {
      console.error('Error updating user in Firestore:', error);
      throw new Error('Failed to update user');
    }
  }

  async getUserCount(): Promise<number> {
    try {
      const snapshot = await this.db.collection('users').get();
      return snapshot.size;
    } catch (error) {
      console.error('Error getting user count from Firestore:', error);
      return 0;
    }
  }

  async getTaskCount(): Promise<number> {
    try {
      const snapshot = await this.db.collection('tasks').get();
      return snapshot.size;
    } catch (error) {
      console.error('Error getting task count from Firestore:', error);
      return 0;
    }
  }

  async getMessageCount(): Promise<number> {
    try {
      const snapshot = await this.db.collection('messages').get();
      return snapshot.size;
    } catch (error) {
      console.error('Error getting message count from Firestore:', error);
      return 0;
    }
  }

  async getUserTasks(userId: string): Promise<Task[]> {
    try {
      const q = this.db.collection('tasks')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc');
      
      const snapshot = await q.get();
      const tasks: Task[] = [];
      
      snapshot.forEach((doc: any) => {
        const data = doc.data();
        tasks.push({
          id: doc.id,
          title: data['title'],
          description: data['description'],
          subject: data['subject'],
          price: data['price'],
          deadline: data['deadline'].toDate(),
          status: data['status'] || 'open',
          userId: data['userId'],
          userEmail: data['userEmail'],
          fileUrls: data['fileUrls'] || [],
          createdAt: data['createdAt'].toDate(),
          updatedAt: data['updatedAt'].toDate()
        });
      });
      
      return tasks;
    } catch (error) {
      console.error('Error getting user tasks from Firestore:', error);
      throw new Error('Failed to fetch user tasks');
    }
  }
}
