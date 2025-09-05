#!/usr/bin/env tsx

import dotenv from 'dotenv';
import { logger } from '../src/utils/logger';
import DataSourceManager from '../src/data/DataSourceManager';
import { initializeFirebaseAdmin } from '../src/config/firebase';

// Load environment variables
dotenv.config();

interface SeedUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  isStudent: boolean;
  subjects: string[];
  rating: number;
  completedTasks: number;
}

interface SeedTask {
  id: string;
  title: string;
  description: string;
  subject: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  assignedTo?: string;
  tags: string[];
  attachments: string[];
}

interface SeedMessage {
  id: string;
  taskId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'system';
}

const seedUsers: SeedUser[] = [
  {
    uid: 'user1',
    email: 'student1@example.com',
    displayName: 'Alex Johnson',
    photoURL: 'https://example.com/avatar1.jpg',
    createdAt: new Date('2024-01-15'),
    isStudent: true,
    subjects: ['Mathematics', 'Physics'],
    rating: 4.8,
    completedTasks: 12
  },
  {
    uid: 'user2',
    email: 'student2@example.com',
    displayName: 'Sarah Chen',
    photoURL: 'https://example.com/avatar2.jpg',
    createdAt: new Date('2024-01-20'),
    isStudent: true,
    subjects: ['Computer Science', 'Mathematics'],
    rating: 4.9,
    completedTasks: 8
  },
  {
    uid: 'user3',
    email: 'client1@example.com',
    displayName: 'Dr. Michael Brown',
    photoURL: 'https://example.com/avatar3.jpg',
    createdAt: new Date('2024-01-10'),
    isStudent: false,
    subjects: ['Physics', 'Chemistry'],
    rating: 4.7,
    completedTasks: 0
  },
  {
    uid: 'user4',
    email: 'client2@example.com',
    displayName: 'Prof. Emily Davis',
    photoURL: 'https://example.com/avatar4.jpg',
    createdAt: new Date('2024-01-12'),
    isStudent: false,
    subjects: ['Computer Science'],
    rating: 4.6,
    completedTasks: 0
  }
];

const seedTasks: SeedTask[] = [
  {
    id: 'task_001',
    title: 'Calculus Homework Help',
    description: 'Need help with calculus derivatives and integrals. Due in 3 days.',
    subject: 'Mathematics',
    status: 'open',
    budget: { min: 25, max: 50, currency: 'USD' },
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
    createdBy: 'user3',
    tags: ['calculus', 'derivatives', 'integrals', 'homework'],
    attachments: []
  },
  {
    id: 'task_002',
    title: 'Physics Lab Report',
    description: 'Help writing a lab report on pendulum motion experiments.',
    subject: 'Physics',
    status: 'in_progress',
    budget: { min: 40, max: 80, currency: 'USD' },
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    createdAt: new Date('2024-01-23'),
    updatedAt: new Date('2024-01-26'),
    createdBy: 'user4',
    assignedTo: 'user1',
    tags: ['physics', 'lab-report', 'pendulum', 'experiment'],
    attachments: ['lab_data.pdf']
  },
  {
    id: 'task_003',
    title: 'Programming Assignment - Python',
    description: 'Need help with Python programming assignment involving data structures.',
    subject: 'Computer Science',
    status: 'open',
    budget: { min: 30, max: 60, currency: 'USD' },
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date('2024-01-27'),
    updatedAt: new Date('2024-01-27'),
    createdBy: 'user4',
    tags: ['python', 'programming', 'data-structures', 'assignment'],
    attachments: ['requirements.pdf']
  }
];

const seedMessages: SeedMessage[] = [
  {
    id: 'msg_001',
    taskId: 'task_002',
    senderId: 'user4',
    content: 'Hi! I\'ve attached the lab data. Can you help me analyze the results?',
    timestamp: new Date('2024-01-23T10:00:00Z'),
    type: 'text'
  },
  {
    id: 'msg_002',
    taskId: 'task_002',
    senderId: 'user1',
    content: 'Sure! I can help you with the lab report. I\'ll start working on it today.',
    timestamp: new Date('2024-01-23T14:30:00Z'),
    type: 'text'
  },
  {
    id: 'msg_003',
    taskId: 'task_002',
    senderId: 'user1',
    content: 'I\'ve completed the analysis. Here\'s the report.',
    timestamp: new Date('2024-01-26T16:45:00Z'),
    type: 'file'
  }
];

async function seedData() {
  try {
    logger.info('Starting data seeding process...');
    
    // Initialize Firebase Admin if not using mock data
    if (process.env.MOCK_DATA !== 'true') {
      logger.info('Initializing Firebase Admin for seeding...');
      const admin = initializeFirebaseAdmin();
      
      if (admin) {
        // Import and get Firestore instance
        const { getFirestore } = await import('../src/config/firebase');
        const db = getFirestore();
        
        // Set Firestore instance in DataSourceManager
        const dataSourceManager = DataSourceManager.getInstance();
        dataSourceManager.setFirestoreInstance(db);
        
        logger.info('Firestore instance set in DataSourceManager');
      }
    }
    
    // Get data source manager
    const dataSourceManager = DataSourceManager.getInstance();
    const dataSource = dataSourceManager.getDataSource();
    
    logger.info(`Using data source: ${dataSourceManager.getCurrentDataSourceType()}`);
    
    // Seed users
    logger.info('Seeding users...');
    for (const user of seedUsers) {
      await dataSource.createUser(user);
      logger.info(`Created user: ${user.displayName} (${user.email})`);
    }
    
    // Seed tasks
    logger.info('Seeding tasks...');
    for (const task of seedTasks) {
      await dataSource.createTask(task.createdBy, {
        title: task.title,
        description: task.description,
        subject: task.subject,
        price: task.budget.min,
        deadline: task.deadline,
        status: task.status,
        fileUrls: task.attachments
      });
      logger.info(`Created task: ${task.title}`);
    }
    
    // Seed messages
    logger.info('Seeding messages...');
    for (const message of seedMessages) {
      await dataSource.createMessage(message.taskId, message.senderId, message.content);
      logger.info(`Created message for task: ${message.taskId}`);
    }
    
    logger.info('Data seeding completed successfully!');
    
    // Display summary
    const userCount = await dataSource.getUserCount();
    const taskCount = await dataSource.getTaskCount();
    const messageCount = await dataSource.getMessageCount();
    
    logger.info(`Seed Summary:`);
    logger.info(`- Users: ${userCount}`);
    logger.info(`- Tasks: ${taskCount}`);
    logger.info(`- Messages: ${messageCount}`);
    
  } catch (error) {
    logger.error('Error during data seeding:', error);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedData()
    .then(() => {
      logger.info('Seeding process finished');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Seeding process failed:', error);
      process.exit(1);
    });
}

export { seedData, seedUsers, seedTasks, seedMessages };
