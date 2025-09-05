import { db } from '../index';
import { 
  Task, 
  CreateTaskRequest, 
  UpdateTaskRequest, 
  TaskFilters, 
  TaskListResponse, 
  TaskEvent, 
  TaskSubmission
} from './taskModels';
import { logger } from '../utils/logger';

export class TaskService {
  private static instance: TaskService;

  static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
  }

  // Create a new task
  async createTask(ownerId: string, taskData: CreateTaskRequest): Promise<Task> {
    try {
      const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const task: Task = {
        id: taskId,
        ownerId,
        expertId: undefined,
        title: taskData.title,
        subject: taskData.subject,
        description: taskData.description,
        price: taskData.price,
        deadline: new Date(taskData.deadline),
        status: 'open',
        fileUrls: taskData.fileUrls || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.collection('tasks').doc(taskId).set(task);

      // Create initial task event
      await this.createTaskEvent(taskId, 'create', ownerId, { taskId });

      logger.info(`Task created: ${taskId} by user: ${ownerId}`);
      return task;
    } catch (error) {
      logger.error('Error creating task:', error);
      throw error;
    }
  }

  // Get tasks with filters and pagination
  async getTasks(filters: TaskFilters): Promise<TaskListResponse> {
    try {
      let query: any = db.collection('tasks');
      
      // Apply filters
      if (filters.status) {
        query = query.where('status', '==', filters.status);
      }
      if (filters.subject) {
        query = query.where('subject', '==', filters.subject);
      }
      if (filters.priceMin !== undefined) {
        query = query.where('price', '>=', filters.priceMin);
      }
      if (filters.priceMax !== undefined) {
        query = query.where('price', '<=', filters.priceMax);
      }

      // Apply sorting
      if (filters.sort === 'deadlineSoonest') {
        query = query.orderBy('deadline', 'asc');
      } else if (filters.sort === 'priceHighLow') {
        query = query.orderBy('price', 'desc');
      } else {
        query = query.orderBy('createdAt', 'desc');
      }

      // Apply pagination
      const offset = (filters.page - 1) * filters.limit;
      query = query.limit(filters.limit).offset(offset);

      const snapshot = await query.get();
      const totalSnapshot = await db.collection('tasks').count().get();

      const tasks = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data()['createdAt'].toDate(),
        updatedAt: doc.data()['updatedAt'].toDate(),
        deadline: doc.data()['deadline'].toDate(),
      })) as Task[];

      return {
        items: tasks,
        total: totalSnapshot.data().count,
        page: filters.page,
        limit: filters.limit,
      };
    } catch (error) {
      logger.error('Error getting tasks:', error);
      throw error;
    }
  }

  // Get a single task by ID
  async getTaskById(taskId: string): Promise<Task | null> {
    try {
      const taskDoc = await db.collection('tasks').doc(taskId).get();
      
      if (!taskDoc.exists) {
        return null;
      }

      const data = taskDoc.data();
      return {
        id: taskDoc.id,
        ...data,
        createdAt: data!['createdAt'].toDate(),
        updatedAt: data!['updatedAt'].toDate(),
        deadline: data!['deadline'].toDate(),
      } as Task;
    } catch (error) {
      logger.error('Error getting task by ID:', error);
      throw error;
    }
  }

  // Claim a task
  async claimTask(taskId: string, expertId: string): Promise<Task> {
    try {
      const taskRef = db.collection('tasks').doc(taskId);
      
      const result = await db.runTransaction(async (transaction) => {
        const taskDoc = await transaction.get(taskRef);
        
        if (!taskDoc.exists) {
          throw new Error('Task not found');
        }

        const task = taskDoc.data() as Task;
        
        if (task.status !== 'open') {
          throw new Error('Task is not available for claiming');
        }

        if (task.ownerId === expertId) {
          throw new Error('Cannot claim your own task');
        }

        const updatedTask = {
          ...task,
          expertId,
          status: 'claimed',
          updatedAt: new Date(),
        };

        transaction.update(taskRef, updatedTask);
        return updatedTask;
      });

      // Create task event
      await this.createTaskEvent(taskId, 'claim', expertId, { expertId });

      logger.info(`Task claimed: ${taskId} by expert: ${expertId}`);
      return result as Task;
    } catch (error) {
      logger.error('Error claiming task:', error);
      throw error;
    }
  }

  // Submit work for a task
  async submitTask(taskId: string, expertId: string, _submission: Omit<TaskSubmission, 'id' | 'taskId' | 'expertId' | 'submittedAt'>): Promise<Task> {
    try {
      const taskRef = db.collection('tasks').doc(taskId);
      
      const result = await db.runTransaction(async (transaction) => {
        const taskDoc = await transaction.get(taskRef);
        
        if (!taskDoc.exists) {
          throw new Error('Task not found');
        }

        const task = taskDoc.data() as Task;
        
        if (task.status !== 'claimed') {
          throw new Error('Task must be claimed before submission');
        }

        if (task.expertId !== expertId) {
          throw new Error('Only the assigned expert can submit work');
        }

        const updatedTask = {
          ...task,
          status: 'submitted',
          updatedAt: new Date(),
        };

        transaction.update(taskRef, updatedTask);
        return updatedTask;
      });

      // Create task event
      await this.createTaskEvent(taskId, 'submit', expertId, { expertId });

      logger.info(`Task submitted: ${taskId} by expert: ${expertId}`);
      return result as Task;
    } catch (error) {
      logger.error('Error submitting task:', error);
      throw error;
    }
  }

  // Accept task submission
  async acceptTask(taskId: string, ownerId: string): Promise<Task> {
    try {
      const taskRef = db.collection('tasks').doc(taskId);
      
      const result = await db.runTransaction(async (transaction) => {
        const taskDoc = await transaction.get(taskRef);
        
        if (!taskDoc.exists) {
          throw new Error('Task not found');
        }

        const task = taskDoc.data() as Task;
        
        if (task.status !== 'submitted') {
          throw new Error('Task must be submitted before acceptance');
        }

        if (task.ownerId !== ownerId) {
          throw new Error('Only the task owner can accept submission');
        }

        const updatedTask = {
          ...task,
          status: 'completed',
          updatedAt: new Date(),
        };

        transaction.update(taskRef, updatedTask);
        return updatedTask;
      });

      // Create task event
      await this.createTaskEvent(taskId, 'accept', ownerId, { ownerId });

      logger.info(`Task accepted: ${taskId} by owner: ${ownerId}`);
      return result as Task;
    } catch (error) {
      logger.error('Error accepting task:', error);
      throw error;
    }
  }

  // Reject task submission
  async rejectTask(taskId: string, ownerId: string, reason: string): Promise<Task> {
    try {
      const taskRef = db.collection('tasks').doc(taskId);
      
      const result = await db.runTransaction(async (transaction) => {
        const taskDoc = await transaction.get(taskRef);
        
        if (!taskDoc.exists) {
          throw new Error('Task not found');
        }

        const task = taskDoc.data() as Task;
        
        if (task.status !== 'submitted') {
          throw new Error('Task must be submitted before rejection');
        }

        if (task.ownerId !== ownerId) {
          throw new Error('Only the task owner can reject submission');
        }

        const updatedTask = {
          ...task,
          status: 'claimed',
          updatedAt: new Date(),
        };

        transaction.update(taskRef, updatedTask);
        return updatedTask;
      });

      // Create task event
      await this.createTaskEvent(taskId, 'reject', ownerId, { reason });

      logger.info(`Task rejected: ${taskId} by owner: ${ownerId}`);
      return result as Task;
    } catch (error) {
      logger.error('Error rejecting task:', error);
      throw error;
    }
  }

  // Update a task
  async updateTask(taskId: string, ownerId: string, updates: UpdateTaskRequest): Promise<Task> {
    try {
      const taskRef = db.collection('tasks').doc(taskId);
      
      const result = await db.runTransaction(async (transaction) => {
        const taskDoc = await transaction.get(taskRef);
        
        if (!taskDoc.exists) {
          throw new Error('Task not found');
        }

        const task = taskDoc.data() as Task;
        
        if (task.ownerId !== ownerId) {
          throw new Error('Only the task owner can update the task');
        }

        if (task.status !== 'open') {
          throw new Error('Cannot update task that is not open');
        }

        const updatedTask = {
          ...task,
          ...updates,
          updatedAt: new Date(),
        };

        transaction.update(taskRef, updatedTask as any);
        return updatedTask;
      });

      // Create task event
      await this.createTaskEvent(taskId, 'update', ownerId, { updates });

      logger.info(`Task updated: ${taskId} by owner: ${ownerId}`);
      return result as Task;
    } catch (error) {
      logger.error('Error updating task:', error);
      throw error;
    }
  }

  // Delete a task
  async deleteTask(taskId: string, ownerId: string): Promise<void> {
    try {
      const taskRef = db.collection('tasks').doc(taskId);
      
      await db.runTransaction(async (transaction) => {
        const taskDoc = await transaction.get(taskRef);
        
        if (!taskDoc.exists) {
          throw new Error('Task not found');
        }

        const task = taskDoc.data() as Task;
        
        if (task.ownerId !== ownerId) {
          throw new Error('Only the task owner can delete the task');
        }

        if (task.status !== 'open') {
          throw new Error('Cannot delete task that is not open');
        }

        transaction.delete(taskRef);
      });

      // Create task event
      await this.createTaskEvent(taskId, 'delete', ownerId, {});

      logger.info(`Task deleted: ${taskId} by owner: ${ownerId}`);
    } catch (error) {
      logger.error('Error deleting task:', error);
      throw error;
    }
  }

  // Get tasks posted or claimed by a user
  async getUserTasks(userId: string, type: 'posted' | 'claimed'): Promise<Task[]> {
    try {
      let query: any = db.collection('tasks');
      
      if (type === 'posted') {
        query = query.where('ownerId', '==', userId);
      } else {
        query = query.where('expertId', '==', userId);
      }

      const snapshot = await query.orderBy('createdAt', 'desc').get();

      return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data()['createdAt'].toDate(),
        updatedAt: doc.data()['updatedAt'].toDate(),
        deadline: doc.data()['deadline'].toDate(),
      })) as Task[];
    } catch (error) {
      logger.error('Error getting user tasks:', error);
      throw error;
    }
  }

  // Create a task event for history tracking
  private async createTaskEvent(
    taskId: string,
    type: TaskEvent['type'],
    userId: string,
    metadata: Record<string, any>
  ): Promise<void> {
    try {
      const eventId = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const event: TaskEvent = {
        id: eventId,
        taskId,
        type,
        userId,
        metadata,
        timestamp: new Date(),
      };

      await db.collection('taskEvents').doc(eventId).set(event);
    } catch (error) {
      logger.error('Error creating task event:', error);
      // Don't throw here as this is not critical
    }
  }

  // Get task events/history
  async getTaskEvents(taskId: string): Promise<TaskEvent[]> {
    try {
      const eventsSnapshot = await db
        .collection('taskEvents')
        .where('taskId', '==', taskId)
        .orderBy('timestamp', 'asc')
        .get();

      return eventsSnapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data()['timestamp'].toDate(),
      })) as TaskEvent[];
    } catch (error) {
      logger.error('Error getting task events:', error);
      throw error;
    }
  }
}

export default TaskService;
