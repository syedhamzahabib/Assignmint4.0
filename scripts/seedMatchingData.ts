// scripts/seedMatchingData.ts - Seed script for testing the matching system
import firestore from '@react-native-firebase/firestore';
import { ExpertUser } from '../src/types';

const db = firestore();

// Sample expert data
const sampleExperts: Omit<ExpertUser, 'uid'>[] = [
  {
    displayName: 'Dr. Sarah Johnson',
    subjects: ['Mathematics', 'Physics', 'Calculus'],
    minPrice: 25,
    maxPrice: 75,
    level: 'Grad',
    ratingAvg: 4.8,
    ratingCount: 47,
    acceptRate: 0.85,
    medianResponseMins: 8,
    completedBySubject: {
      'Mathematics': 15,
      'Physics': 12,
      'Calculus': 8,
    },
  },
  {
    displayName: 'Prof. Michael Chen',
    subjects: ['Computer Science', 'Programming', 'Algorithms'],
    minPrice: 30,
    maxPrice: 80,
    level: 'Grad',
    ratingAvg: 4.9,
    ratingCount: 62,
    acceptRate: 0.92,
    medianResponseMins: 5,
    completedBySubject: {
      'Computer Science': 20,
      'Programming': 18,
      'Algorithms': 14,
    },
  },
  {
    displayName: 'Alex Rodriguez',
    subjects: ['English', 'Literature', 'Writing'],
    minPrice: 20,
    maxPrice: 50,
    level: 'UG',
    ratingAvg: 4.6,
    ratingCount: 28,
    acceptRate: 0.78,
    medianResponseMins: 15,
    completedBySubject: {
      'English': 10,
      'Literature': 8,
      'Writing': 12,
    },
  },
  {
    displayName: 'Dr. Emily Watson',
    subjects: ['Biology', 'Chemistry', 'Anatomy'],
    minPrice: 35,
    maxPrice: 90,
    level: 'Grad',
    ratingAvg: 4.7,
    ratingCount: 41,
    acceptRate: 0.88,
    medianResponseMins: 12,
    completedBySubject: {
      'Biology': 16,
      'Chemistry': 14,
      'Anatomy': 11,
    },
  },
  {
    displayName: 'James Wilson',
    subjects: ['History', 'Political Science', 'Economics'],
    minPrice: 22,
    maxPrice: 55,
    level: 'UG',
    ratingAvg: 4.4,
    ratingCount: 19,
    acceptRate: 0.72,
    medianResponseMins: 25,
    completedBySubject: {
      'History': 7,
      'Political Science': 5,
      'Economics': 8,
    },
  },
  {
    displayName: 'Dr. Lisa Park',
    subjects: ['Statistics', 'Data Science', 'Research Methods'],
    minPrice: 40,
    maxPrice: 100,
    level: 'Grad',
    ratingAvg: 4.9,
    ratingCount: 53,
    acceptRate: 0.94,
    medianResponseMins: 6,
    completedBySubject: {
      'Statistics': 18,
      'Data Science': 16,
      'Research Methods': 12,
    },
  },
  {
    displayName: 'Carlos Mendez',
    subjects: ['Spanish', 'French', 'Linguistics'],
    minPrice: 18,
    maxPrice: 45,
    level: 'HS',
    ratingAvg: 4.2,
    ratingCount: 15,
    acceptRate: 0.68,
    medianResponseMins: 35,
    completedBySubject: {
      'Spanish': 6,
      'French': 4,
      'Linguistics': 3,
    },
  },
  {
    displayName: 'Dr. Robert Kim',
    subjects: ['Engineering', 'Mechanics', 'Design'],
    minPrice: 45,
    maxPrice: 120,
    level: 'Grad',
    ratingAvg: 4.8,
    ratingCount: 38,
    acceptRate: 0.89,
    medianResponseMins: 10,
    completedBySubject: {
      'Engineering': 13,
      'Mechanics': 11,
      'Design': 9,
    },
  },
];

// Sample task data
const sampleTasks = [
  {
    title: 'Calculus Homework Help',
    description: 'Need help with calculus derivatives and integrals',
    subject: 'Mathematics',
    urgency: 'medium' as const,
    budget: 45,
    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    status: 'open' as const,
    requesterId: 'test-user-1',
    ownerId: 'test-user-1',
    price: 45,
    deadlineISO: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(),
    updatedAt: new Date(),
    isUrgent: false,
    isFeatured: false,
  },
  {
    title: 'Python Programming Assignment',
    description: 'Help with Python data structures and algorithms',
    subject: 'Computer Science',
    urgency: 'high' as const,
    budget: 60,
    deadline: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
    status: 'open' as const,
    requesterId: 'test-user-2',
    ownerId: 'test-user-2',
    price: 60,
    deadlineISO: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(),
    updatedAt: new Date(),
    isUrgent: true,
    isFeatured: false,
  },
  {
    title: 'Essay Writing Assistance',
    description: 'Help with academic essay structure and thesis development',
    subject: 'English',
    urgency: 'medium' as const,
    budget: 35,
    deadline: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now
    status: 'open' as const,
    requesterId: 'test-user-3',
    ownerId: 'test-user-3',
    price: 35,
    deadlineISO: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(),
    updatedAt: new Date(),
    isUrgent: false,
    isFeatured: false,
  },
];

/**
 * Seed the database with sample data
 */
async function seedMatchingData(): Promise<void> {
  try {
    console.log('🌱 Starting to seed matching data...');

    // Create sample experts
    console.log('Creating sample experts...');
    for (const expert of sampleExperts) {
      const expertRef = await db.collection('users').add({
        ...expert,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
      console.log(`Created expert: ${expert.displayName} (${expertRef.id})`);
    }

    // Create sample tasks
    console.log('Creating sample tasks...');
    for (const task of sampleTasks) {
      const taskRef = await db.collection('tasks').add({
        ...task,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
      console.log(`Created task: ${task.title} (${taskRef.id})`);
    }

    console.log('✅ Successfully seeded matching data!');
    console.log(`   Created ${sampleExperts.length} experts`);
    console.log(`   Created ${sampleTasks.length} tasks`);
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
}

/**
 * Clear all seeded data
 */
async function clearSeededData(): Promise<void> {
  try {
    console.log('🧹 Clearing seeded data...');

    // Clear experts
    const expertsSnapshot = await db.collection('users').get();
    const expertBatch = db.batch();
    expertsSnapshot.docs.forEach(doc => {
      expertBatch.delete(doc.ref);
    });
    await expertBatch.commit();
    console.log(`Cleared ${expertsSnapshot.size} experts`);

    // Clear tasks
    const tasksSnapshot = await db.collection('tasks').get();
    const taskBatch = db.batch();
    tasksSnapshot.docs.forEach(doc => {
      taskBatch.delete(doc.ref);
    });
    await taskBatch.commit();
    console.log(`Cleared ${tasksSnapshot.size} tasks`);

    // Clear invites
    const invitesSnapshot = await db.collection('invites').get();
    const inviteBatch = db.batch();
    invitesSnapshot.docs.forEach(doc => {
      inviteBatch.delete(doc.ref);
    });
    await inviteBatch.commit();
    console.log(`Cleared ${invitesSnapshot.size} invites`);

    console.log('✅ Successfully cleared seeded data!');
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    throw error;
  }
}

// Export functions for use in other scripts
export { seedMatchingData, clearSeededData };

// Run if this script is executed directly
if (require.main === module) {
  const command = process.argv[2];
  
  if (command === 'clear') {
    clearSeededData()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  } else {
    seedMatchingData()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  }
}
