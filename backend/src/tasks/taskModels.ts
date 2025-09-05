export interface Task {
  id: string;
  ownerId: string;
  expertId?: string | undefined;
  title: string;
  subject: string;
  description: string;
  price: number;
  deadline: Date;
  status: TaskStatus;
  fileUrls: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type TaskStatus = 'open' | 'claimed' | 'submitted' | 'completed' | 'rejected';

export interface CreateTaskRequest {
  title: string;
  subject: string;
  description: string;
  price: number;
  deadline: string; // ISO date string
  fileUrls: string[];
}

export interface UpdateTaskRequest {
  title?: string;
  subject?: string;
  description?: string;
  price?: number;
  deadline?: string;
  fileUrls?: string[];
}

export interface TaskFilters {
  status?: TaskStatus;
  subject?: string;
  priceMin?: number;
  priceMax?: number;
  sort?: 'deadlineSoonest' | 'priceHighLow' | 'newest';
  page: number;
  limit: number;
}

export interface TaskListResponse {
  items: Task[];
  total: number;
  page: number;
  limit: number;
}

export interface TaskEvent {
  id: string;
  taskId: string;
  type: 'create' | 'claim' | 'submit' | 'accept' | 'reject' | 'update' | 'delete';
  userId: string;
  metadata: Record<string, any>;
  timestamp: Date;
}

export interface TaskSubmission {
  id: string;
  taskId: string;
  expertId: string;
  message: string;
  fileUrls: string[];
  submittedAt: Date;
}

export interface TaskRejection {
  id: string;
  taskId: string;
  ownerId: string;
  reason: string;
  rejectedAt: Date;
}
