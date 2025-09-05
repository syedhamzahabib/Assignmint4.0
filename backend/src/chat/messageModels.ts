export interface TaskMessage {
  id: string;
  taskId: string;
  senderId: string;
  text: string;
  createdAt: Date;
}

export interface CreateMessageRequest {
  text: string;
}

export interface MessageListResponse {
  messages: TaskMessage[];
  total: number;
}
