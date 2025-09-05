export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  taskId?: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export type NotificationType = 
  | 'task_claimed'
  | 'task_submitted'
  | 'task_accepted'
  | 'task_rejected'
  | 'new_message'
  | 'rating_received'
  | 'deadline_reminder'
  | 'system_message';

export interface CreateNotificationRequest {
  type: NotificationType;
  taskId?: string;
  message: string;
}

export interface NotificationListResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
}
