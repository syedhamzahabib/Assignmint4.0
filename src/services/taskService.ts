// src/services/taskService.ts - Task management with React Native Firebase
import { db } from '../lib/firebase';
import { Task } from '../types';

export interface CreateTaskData {
  title: string;
  subject: string;
  description?: string;
  budget: number;
  deadline: string;
  deadlineTime?: string;
  urgency: 'low' | 'medium' | 'high';
  matchingPreference: 'auto' | 'manual';
  autoMatch?: boolean; // New field for auto-matching
  matchingType?: 'manual' | 'auto'; // New field for matching type
  isForStudent?: boolean;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  aiLevel?: number;
  aiTaskExplainer?: boolean;
  summaryOnDelivery?: boolean;
  uploadedFiles?: string[];
  selectedTemplate?: string;
}

export interface CreateTaskResult {
  success: boolean;
  taskId?: string;
  message: string;
}

class TaskService {
  private tasksCollection = collection(db, 'tasks');

  /**
   * Create a new task in Firestore
   */
  async createTask(taskData: CreateTaskData): Promise<CreateTaskResult> {
    try {
      console.log('🔥 Creating task with Web SDK:', taskData);

      // Convert deadline to ISO string if needed
      let deadlineISO = taskData.deadline;
      if (taskData.deadlineTime) {
        const deadlineDate = new Date(`${taskData.deadline} ${taskData.deadlineTime}`);
        deadlineISO = deadlineDate.toISOString();
      } else {
        const deadlineDate = new Date(taskData.deadline);
        deadlineISO = deadlineDate.toISOString();
      }

      const task: Omit<Task, 'taskId'> = {
        title: taskData.title,
        subject: taskData.subject,
        description: taskData.description || '',
        price: taskData.budget,
        deadlineISO,
        urgency: taskData.urgency,
        status: 'open',
        ownerId: taskData.ownerId,
        ownerName: taskData.ownerName,
        ownerEmail: taskData.ownerEmail,
        createdAt: new Date(),
        updatedAt: new Date(),
        
        // Matching system fields
        matchingPreference: taskData.matchingPreference,
        matchingType: taskData.matchingType || taskData.matchingPreference,
        autoMatch: taskData.autoMatch || (taskData.matchingPreference === 'auto'),
        reservedBy: null,
        reservedUntil: null,
        matching: {
          invitedCount: 0,
          acceptedCount: 0,
          declinedCount: 0,
          currentWave: 0,
          lastInviteAt: null,
          nextWaveAt: null,
          invitedNow: 0,
        },

        // AI and other features
        aiLevel: taskData.aiLevel || 50,
        aiTaskExplainer: taskData.aiTaskExplainer || false,
        summaryOnDelivery: taskData.summaryOnDelivery || false,
        uploadedFiles: taskData.uploadedFiles || [],
        selectedTemplate: taskData.selectedTemplate || '',

        // Visibility and search
        isActive: true,
        isForStudent: taskData.isForStudent || false,
        tags: this.generateTags(taskData.title, taskData.description || '', taskData.subject),
      };

      // Create task document
      const docRef = await addDoc(this.tasksCollection, {
        ...task,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      console.log('✅ Task created with ID:', docRef.id);

      return {
        success: true,
        taskId: docRef.id,
        message: taskData.matchingPreference === 'manual' 
          ? 'Task posted to expert marketplace!' 
          : 'Task created and queued for auto-assignment!'
      };
    } catch (error) {
      console.error('❌ Error creating task:', error);
      return {
        success: false,
        message: `Failed to create task: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Get a task by ID
   */
  async getTaskById(taskId: string): Promise<Task | null> {
    try {
      const taskDoc = await getDoc(doc(db, 'tasks', taskId));
      
      if (!taskDoc.exists()) {
        return null;
      }

      const data = taskDoc.data();
      return {
        taskId: taskDoc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
      } as Task;
    } catch (error) {
      console.error('❌ Error getting task:', error);
      return null;
    }
  }

  /**
   * Get tasks for home feed (real-time)
   */
  getOpenTasks(callback: (tasks: Task[]) => void): () => void {
    const q = query(
      this.tasksCollection,
      where('status', '==', 'open'),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    return onSnapshot(q, (snapshot) => {
      const tasks: Task[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        tasks.push({
          taskId: doc.id,
          ...data,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
        } as Task);
      });
      
      console.log(`📡 Real-time feed update: ${tasks.length} open tasks`);
      callback(tasks);
    }, (error) => {
      console.error('❌ Error listening to tasks:', error);
      callback([]);
    });
  }

  /**
   * Get tasks by owner (real-time)
   */
  getUserTasks(ownerId: string, callback: (tasks: Task[]) => void): () => void {
    const q = query(
      this.tasksCollection,
      where('ownerId', '==', ownerId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    return onSnapshot(q, (snapshot) => {
      const tasks: Task[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        tasks.push({
          taskId: doc.id,
          ...data,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
        } as Task);
      });
      
      console.log(`📡 Real-time user tasks update: ${tasks.length} tasks for ${ownerId}`);
      callback(tasks);
    }, (error) => {
      console.error('❌ Error listening to user tasks:', error);
      callback([]);
    });
  }

  /**
   * Generate search tags from task content
   */
  private generateTags(title: string, description: string, subject: string): string[] {
    const text = `${title} ${description} ${subject}`.toLowerCase();
    const words = text.split(/\s+/).filter(word => word.length > 2);
    
    // Remove duplicates and common words
    const commonWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'];
    const tags = [...new Set(words.filter(word => !commonWords.includes(word)))];
    
    // Add subject as a tag
    tags.push(subject.toLowerCase());
    
    return tags.slice(0, 10); // Limit to 10 tags
  }
}

export const taskService = new TaskService();
