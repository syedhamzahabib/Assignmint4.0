// Mock data for AssignMint app

export interface Task {
  id: string;
  title: string;
  description: string;
  subject: string;
  budget: string;
  deadline: string;
  status: string;
  urgency: string;
  requesterId: string;
  requesterName: string;
  requesterRating: number;
  createdAt: string;
  tags: string[];
  aiLevel: string;
  aiPercentage: number;
  bids?: number;
  expertId?: string;
  expertName?: string;
  expertRating?: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: string;
  taskId?: string;
}

export interface UserProfile {
  id: string;
  nickname: string;
  email: string;
  joinDate: string;
  avatar: string;
  memberSince: number;
  role: string;
  expertProfile?: {
    bio: string;
    specialties: string[];
    availableHours: string;
    responseTime: string;
    isVerified: boolean;
    portfolioItems: Array<{
      type: string;
      title: string;
      url: string;
    }>;
  };
  expertStats?: {
    tasksCompleted: number;
    totalEarned: number;
    avgRating: number;
    totalReviews: number;
    responseTime: string;
    completionRate: number;
    currentBalance: number;
    onTimeDelivery: number;
    repeatClients: number;
    subjectStats: Array<{
      name: string;
      taskCount: number;
      avgRating: number;
      totalEarned: number;
      lastTask: string;
      lastTaskDate: string;
    }>;
  };
}

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Calculus Assignment Help - Derivatives and Integrals',
    description: 'Need help with calculus problems involving derivatives and integrals. Looking for step-by-step solutions with explanations.',
    subject: 'Math',
    budget: '$50',
    deadline: '2 days',
    status: 'open',
    urgency: 'medium',
    requesterId: 'user123',
    requesterName: 'Sarah M.',
    requesterRating: 4.8,
    createdAt: '2024-01-15T10:30:00Z',
    tags: ['calculus', 'derivatives', 'integrals', 'mathematics'],
    aiLevel: 'none',
    aiPercentage: 0,
    bids: 3,
  },
  {
    id: '2',
    title: 'Research Paper on World War II',
    description: 'Need a comprehensive research paper on the impact of World War II on modern society. 10-12 pages with proper citations.',
    subject: 'History',
    budget: '$80',
    deadline: '1 week',
    status: 'in_progress',
    urgency: 'high',
    requesterId: 'user456',
    requesterName: 'Mike R.',
    requesterRating: 4.5,
    createdAt: '2024-01-14T15:20:00Z',
    tags: ['history', 'world-war-ii', 'research-paper'],
    aiLevel: 'assisted',
    aiPercentage: 30,
    expertId: 'expert123',
    expertName: 'Alex Johnson',
    expertRating: 4.9,
  },
  {
    id: '3',
    title: 'Python Web Application Development',
    description: 'Need help building a Python web application using Flask or Django. Should include user authentication and database integration.',
    subject: 'Coding',
    budget: '$120',
    deadline: '3 days',
    status: 'completed',
    urgency: 'medium',
    requesterId: 'user789',
    requesterName: 'Emma L.',
    requesterRating: 4.7,
    createdAt: '2024-01-13T09:15:00Z',
    tags: ['python', 'web-development', 'flask', 'django'],
    aiLevel: 'enhanced',
    aiPercentage: 60,
    expertId: 'expert456',
    expertName: 'David Chen',
    expertRating: 4.8,
  },
  {
    id: '4',
    title: 'Physics Lab Report - Quantum Mechanics',
    description: 'Need help writing a lab report for quantum mechanics experiment. Include data analysis and theoretical background.',
    subject: 'Physics',
    budget: '$65',
    deadline: '4 days',
    status: 'open',
    urgency: 'low',
    requesterId: 'user101',
    requesterName: 'Tom W.',
    requesterRating: 4.6,
    createdAt: '2024-01-16T11:45:00Z',
    tags: ['physics', 'quantum-mechanics', 'lab-report'],
    aiLevel: 'none',
    aiPercentage: 0,
    bids: 1,
  },
  {
    id: '5',
    title: 'Business Plan for Startup',
    description: 'Need assistance creating a comprehensive business plan for a tech startup. Include market analysis and financial projections.',
    subject: 'Business',
    budget: '$150',
    deadline: '1 week',
    status: 'open',
    urgency: 'high',
    requesterId: 'user202',
    requesterName: 'Lisa K.',
    requesterRating: 4.9,
    createdAt: '2024-01-15T14:20:00Z',
    tags: ['business', 'startup', 'business-plan', 'market-analysis'],
    aiLevel: 'ai_heavy',
    aiPercentage: 80,
    bids: 5,
  },
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Bid Received',
    message: 'You have a new bid on your calculus assignment from Alex Johnson',
    time: '2 hours ago',
    read: false,
    type: 'new_bid',
    taskId: '1',
  },
  {
    id: '2',
    title: 'Task Completed',
    message: 'Your programming project has been completed by David Chen',
    time: '1 day ago',
    read: true,
    type: 'task_completed',
    taskId: '3',
  },
  {
    id: '3',
    title: 'Payment Received',
    message: 'Payment of $80 has been received for your history paper',
    time: '2 days ago',
    read: true,
    type: 'payment_received',
    taskId: '2',
  },
  {
    id: '4',
    title: 'Deadline Reminder',
    message: 'Your physics lab report is due in 2 days',
    time: '3 hours ago',
    read: false,
    type: 'deadline_reminder',
    taskId: '4',
  },
  {
    id: '5',
    title: 'Task Accepted',
    message: 'Your bid on the business plan task has been accepted',
    time: '5 hours ago',
    read: true,
    type: 'task_accepted',
    taskId: '5',
  },
];

export const mockUserProfile: UserProfile = {
  id: 'user123',
  nickname: 'Sarah M.',
  email: 'sarah.m@example.com',
  joinDate: '2024-01-15',
  avatar: '👩‍💼',
  memberSince: 156,
  role: 'requester',
  expertProfile: {
    bio: 'Math & coding expert with 5+ years of tutoring experience. I love helping students understand complex concepts!',
    specialties: ['Math', 'Physics', 'Coding'],
    availableHours: 'Mon-Fri 9AM-8PM PST',
    responseTime: '< 2 hours',
    isVerified: true,
    portfolioItems: [
      { type: 'sample', title: 'Calculus Problem Solutions', url: '#' },
      { type: 'certificate', title: 'MIT Mathematics Certificate', url: '#' },
    ],
  },
  expertStats: {
    tasksCompleted: 47,
    totalEarned: 1285.00,
    avgRating: 4.8,
    totalReviews: 42,
    responseTime: '1.8 hours',
    completionRate: 96,
    currentBalance: 245.25,
    onTimeDelivery: 98,
    repeatClients: 18,
    subjectStats: [
      {
        name: 'Math',
        taskCount: 22,
        avgRating: 4.9,
        totalEarned: 580.00,
        lastTask: 'Advanced Calculus Problems',
        lastTaskDate: '2 days ago',
      },
      {
        name: 'Physics',
        taskCount: 15,
        avgRating: 4.7,
        totalEarned: 425.00,
        lastTask: 'Quantum Mechanics Homework',
        lastTaskDate: '1 week ago',
      },
      {
        name: 'Coding',
        taskCount: 10,
        avgRating: 4.8,
        totalEarned: 280.00,
        lastTask: 'Python Web App',
        lastTaskDate: '3 days ago',
      },
    ],
  },
};

export const mockExperts = [
  {
    id: 'expert123',
    name: 'Alex Johnson',
    rating: 4.9,
    completedTasks: 47,
    specialties: ['Math', 'Physics'],
    responseTime: '< 2 hours',
    isVerified: true,
    isFavorited: false,
  },
  {
    id: 'expert456',
    name: 'David Chen',
    rating: 4.8,
    completedTasks: 32,
    specialties: ['Coding', 'Computer Science'],
    responseTime: '< 1 hour',
    isVerified: true,
    isFavorited: true,
  },
  {
    id: 'expert789',
    name: 'Maria Garcia',
    rating: 4.7,
    completedTasks: 28,
    specialties: ['Writing', 'History'],
    responseTime: '< 3 hours',
    isVerified: false,
    isFavorited: false,
  },
];

export const mockPaymentMethods = [
  {
    id: 'pm_1',
    type: 'credit_card',
    last4: '4242',
    brand: 'Visa',
    isDefault: true,
  },
  {
    id: 'pm_2',
    type: 'paypal',
    email: 'user@example.com',
    isDefault: false,
  },
];
