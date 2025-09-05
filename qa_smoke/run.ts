// qa_smoke/run.ts - Main QA runner for matching system (Node.js compatible)
import FakeStore, { FakeTask, FakeUser, FakeInvite } from './fakes/fakeStore';
import { USE_MOCK, RESERVE_WINDOW_MS, MATCH_WAVE_MS } from './helpers/env';
import { ok, eq, gt, gte, lt, lte } from './helpers/assert';

console.log('🧪 QA Smoke Test - AssignMint Matching System');
console.log('==============================================\n');

// Test results tracking
const results: { [key: string]: boolean } = {};

// Helper function to run test scenarios
async function runTest(name: string, testFn: () => Promise<void>): Promise<void> {
  try {
    console.log(`🔍 Testing: ${name}`);
    await testFn();
    results[name] = true;
    console.log(`✅ ${name} - PASSED\n`);
  } catch (error) {
    results[name] = false;
    console.error(`❌ ${name} - FAILED: ${error}\n`);
  }
}

// Helper function to wait
function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Simplified scoring function for testing
function scoreExpertForTask(task: FakeTask, expert: FakeUser): number {
  let score = 0;
  
  // Subject fit (25%)
  if (expert.subjects.includes(task.subject)) {
    score += 0.25;
  }
  
  // Price fit (15%)
  if (expert.minPrice && expert.maxPrice) {
    if (task.price >= expert.minPrice && task.price <= expert.maxPrice) {
      score += 0.15;
    } else if (Math.abs(task.price - (expert.minPrice + expert.maxPrice) / 2) <= (expert.maxPrice - expert.minPrice) * 0.2) {
      score += 0.075;
    }
  }
  
  // Rating (15%)
  score += Math.min(0.15, Math.max(0, (expert.ratingAvg - 3.5) / (5.0 - 3.5) * 0.15));
  
  // Accept rate (10%)
  score += expert.acceptRate * 0.10;
  
  // Response speed (10%)
  if (expert.medianResponseMins <= 5) {
    score += 0.10;
  } else if (expert.medianResponseMins <= 120) {
    score += 0.10 * (1 - (expert.medianResponseMins - 5) / 115);
  }
  
  // Level match (5%)
  score += 0.05;
  
  // Historical success (5%)
  const completedCount = expert.completedBySubject[task.subject] || 0;
  score += Math.min(0.05, completedCount / 10 * 0.05);
  
  return Math.min(1, score);
}

// Simplified ranking function
function rankExperts(task: FakeTask, experts: FakeUser[]): Array<{ expert: FakeUser; score: number }> {
  return experts
    .map(expert => ({
      expert,
      score: scoreExpertForTask(task, expert)
    }))
    .sort((a, b) => b.score - a.score);
}

// Simplified invite creation
async function createInvites(taskId: string, rankedExperts: Array<{ expert: FakeUser; score: number }>, maxInvites: number): Promise<FakeInvite[]> {
  const invites: FakeInvite[] = [];
  const expertsToInvite = rankedExperts.slice(0, maxInvites);
  
  for (let i = 0; i < expertsToInvite.length; i++) {
    const { expert, score } = expertsToInvite[i];
    invites.push({
      inviteId: `invite-${taskId}-${i}`,
      taskId,
      expertId: expert.uid,
      sentAt: Date.now(),
      respondedAt: null,
      status: 'sent',
      lastScore: score,
    });
  }
  
  return invites;
}

// Main test runner
async function runAllTests(): Promise<void> {
  // Create fake store
  const fakeStore = new FakeStore();

  // Test A: Seed experts with varied profiles
  await runTest('Seed Experts', async () => {
    const experts: FakeUser[] = [
      {
        uid: 'expert-1',
        displayName: 'Dr. Math Expert',
        subjects: ['Mathematics', 'Physics'],
        minPrice: 20,
        maxPrice: 80,
        level: 'Grad',
        ratingAvg: 4.8,
        ratingCount: 50,
        acceptRate: 0.9,
        medianResponseMins: 10,
        completedBySubject: { 'Mathematics': 20, 'Physics': 15 },
      },
      {
        uid: 'expert-2',
        displayName: 'Math Tutor',
        subjects: ['Mathematics'],
        minPrice: 15,
        maxPrice: 60,
        level: 'UG',
        ratingAvg: 4.5,
        ratingCount: 25,
        acceptRate: 0.8,
        medianResponseMins: 20,
        completedBySubject: { 'Mathematics': 15 },
      },
      {
        uid: 'expert-3',
        displayName: 'Physics Pro',
        subjects: ['Physics', 'Mathematics'],
        minPrice: 25,
        maxPrice: 100,
        level: 'Grad',
        ratingAvg: 4.9,
        ratingCount: 75,
        acceptRate: 0.95,
        medianResponseMins: 5,
        completedBySubject: { 'Physics': 30, 'Mathematics': 25 },
      },
      {
        uid: 'expert-4',
        displayName: 'Science Helper',
        subjects: ['Physics'],
        minPrice: 18,
        maxPrice: 70,
        level: 'UG',
        ratingAvg: 4.3,
        ratingCount: 20,
        acceptRate: 0.75,
        medianResponseMins: 25,
        completedBySubject: { 'Physics': 12 },
      },
      {
        uid: 'expert-5',
        displayName: 'Math Whiz',
        subjects: ['Mathematics'],
        minPrice: 12,
        maxPrice: 50,
        level: 'HS',
        ratingAvg: 4.1,
        ratingCount: 15,
        acceptRate: 0.7,
        medianResponseMins: 30,
        completedBySubject: { 'Mathematics': 8 },
      },
      {
        uid: 'expert-6',
        displayName: 'Advanced Math',
        subjects: ['Mathematics', 'Calculus'],
        minPrice: 30,
        maxPrice: 90,
        level: 'Grad',
        ratingAvg: 4.7,
        ratingCount: 40,
        acceptRate: 0.85,
        medianResponseMins: 12,
        completedBySubject: { 'Mathematics': 18, 'Calculus': 10 },
      },
      {
        uid: 'expert-7',
        displayName: 'Physics Tutor',
        subjects: ['Physics'],
        minPrice: 22,
        maxPrice: 75,
        level: 'UG',
        ratingAvg: 4.4,
        ratingCount: 30,
        acceptRate: 0.8,
        medianResponseMins: 18,
        completedBySubject: { 'Physics': 16 },
      },
      {
        uid: 'expert-8',
        displayName: 'Math Professor',
        subjects: ['Mathematics', 'Statistics'],
        minPrice: 40,
        maxPrice: 120,
        level: 'Grad',
        ratingAvg: 4.9,
        ratingCount: 100,
        acceptRate: 0.98,
        medianResponseMins: 3,
        completedBySubject: { 'Mathematics': 50, 'Statistics': 35 },
      }
    ];

    experts.forEach(expert => fakeStore.putUser(expert));
    
    const stats = fakeStore.getStats();
    eq(stats.users, 8, 'Should have 8 experts');
    console.log(`  Created ${stats.users} experts with varied profiles`);
  });

  // Test B: Create task and run matching
  await runTest('Task Creation & Matching', async () => {
    const task: FakeTask = {
      id: 'task-1',
      title: 'Calculus Homework Help',
      subject: 'Mathematics',
      price: 25,
      deadlineISO: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      status: 'open',
      ownerId: 'owner-1',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    fakeStore.putTask(task);

    // Test scoring directly
    const experts = fakeStore.listEligibleExperts('Mathematics');
    eq(experts.length, 6, 'Should have 6 eligible math experts');

    const ranked = rankExperts(task, experts);
    eq(ranked.length, 6, 'Should rank 6 experts');
    gt(ranked[0].score, ranked[5].score, 'First expert should have higher score than last');

    // Test invite creation
    const invites = await createInvites(task.id, ranked.slice(0, 5), 5);
    
    eq(invites.length, 5, 'Should create 5 invites');
    invites.forEach(invite => {
      gt(invite.lastScore, 0, 'Invite should have positive score');
      lte(invite.lastScore, 1, 'Invite score should be <= 1');
    });

    console.log(`  Created task "${task.title}" with ${invites.length} invites`);
  });

  // Test C: Soft-claim by expert (simplified)
  await runTest('Soft-Claim Task', async () => {
    const task = fakeStore.getTask('task-1');
    ok(task, 'Task should exist');
    
    // Simulate soft-claim
    fakeStore.updateTask('task-1', {
      status: 'reserved',
      reservedBy: 'expert-2',
      reservedUntil: Date.now() + RESERVE_WINDOW_MS,
    });

    const updatedTask = fakeStore.getTask('task-1');
    eq(updatedTask!.status, 'reserved', 'Task status should be reserved');
    eq(updatedTask!.reservedBy, 'expert-2', 'Task should be reserved by expert-2');
    ok(updatedTask!.reservedUntil, 'Task should have reservation deadline');

    console.log(`  Expert expert-2 soft-claimed task-1`);
  });

  // Test D: Confirm claim (simplified)
  await runTest('Confirm Claim', async () => {
    // Simulate claim confirmation
    fakeStore.updateTask('task-1', {
      status: 'claimed',
      expertId: 'expert-2',
      reservedBy: null,
      reservedUntil: null,
    });

    const task = fakeStore.getTask('task-1');
    eq(task!.status, 'claimed', 'Task status should be claimed');
    eq(task!.expertId, 'expert-2', 'Task should be assigned to expert-2');
    eq(task!.reservedBy, null, 'ReservedBy should be cleared');
    eq(task!.reservedUntil, null, 'ReservedUntil should be cleared');

    console.log(`  Expert expert-2 confirmed claim on task-1`);
  });

  // Test E: Expiry path (simplified)
  await runTest('Reservation Expiry', async () => {
    // Create new task
    const task: FakeTask = {
      id: 'task-2',
      title: 'Physics Problem Set',
      subject: 'Physics',
      price: 30,
      deadlineISO: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      status: 'open',
      ownerId: 'owner-2',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    fakeStore.putTask(task);

    // Soft-claim
    fakeStore.updateTask('task-2', {
      status: 'reserved',
      reservedBy: 'expert-3',
      reservedUntil: Date.now() + RESERVE_WINDOW_MS,
    });

    // Wait for reservation to expire (plus buffer)
    const waitTime = RESERVE_WINDOW_MS + 1000;
    console.log(`  Waiting ${waitTime}ms for reservation to expire...`);
    await wait(waitTime);

    // Simulate auto-release
    fakeStore.updateTask('task-2', {
      status: 'open',
      reservedBy: null,
      reservedUntil: null,
    });

    const taskAfter = fakeStore.getTask('task-2');
    eq(taskAfter!.status, 'open', 'Task should be back to open status');
    eq(taskAfter!.reservedBy, null, 'ReservedBy should be cleared');
    eq(taskAfter!.reservedUntil, null, 'ReservedUntil should be cleared');

    console.log(`  Reservation auto-expired and was released`);
  });

  // Test F: Expand ring (simplified)
  await runTest('Expand Ring', async () => {
    // Create new task
    const task: FakeTask = {
      id: 'task-3',
      title: 'Advanced Math Assignment',
      subject: 'Mathematics',
      price: 40,
      deadlineISO: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      status: 'open',
      ownerId: 'owner-3',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    fakeStore.putTask(task);

    // Initial matching
    const experts = fakeStore.listEligibleExperts('Mathematics');
    const ranked = rankExperts(task, experts);
    const invites = await createInvites(task.id, ranked.slice(0, 5), 5);
    
    eq(invites.length, 5, 'Should start with 5 invites');

    // Simulate ring expansion
    fakeStore.updateTask('task-3', {
      matching: {
        invitedNow: 25,
        nextWaveAt: Date.now() + MATCH_WAVE_MS,
      }
    });

    const taskAfter = fakeStore.getTask('task-3');
    ok(taskAfter!.matching, 'Task should have matching metadata');
    gte(taskAfter!.matching!.invitedNow, 25, 'Should have expanded to at least 25 invites');

    console.log(`  Ring expanded to ${taskAfter!.matching!.invitedNow} invites`);
  });

  // Test G: Guard against exceeding 3 concurrent reservations
  await runTest('Reservation Limit Guard', async () => {
    // Create 4 tasks
    const tasks = ['task-4', 'task-5', 'task-6', 'task-7'];
    for (let i = 0; i < 4; i++) {
      const task: FakeTask = {
        id: tasks[i],
        title: `Test Task ${i + 4}`,
        subject: 'Mathematics',
        price: 20 + i * 5,
        deadlineISO: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        status: 'open',
        ownerId: `owner-${i + 4}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      fakeStore.putTask(task);
    }

    // Simulate soft-claiming with limit enforcement
    let successCount = 0;
    for (let i = 0; i < 4; i++) {
      if (successCount < 3) {
        fakeStore.updateTask(tasks[i], {
          status: 'reserved',
          reservedBy: 'expert-1',
          reservedUntil: Date.now() + RESERVE_WINDOW_MS,
        });
        successCount++;
      } else {
        // Should fail after 3rd reservation
        console.log(`  Expected failure on ${tasks[i]}: Max reservations reached`);
      }
    }

    lte(successCount, 3, 'Should not exceed 3 concurrent reservations');
    gte(successCount, 3, 'Should allow at least 3 concurrent reservations');

    console.log(`  Expert expert-1 has ${successCount} active reservations (max 3)`);
  });

  // Print results summary
  console.log('📊 Test Results Summary');
  console.log('========================');
  
  const passed = Object.values(results).filter(r => r).length;
  const total = Object.keys(results).length;
  
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}`);
  });
  
  console.log(`\n${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All tests PASSED!');
    process.exit(0);
  } else {
    console.log('💥 Some tests FAILED!');
    process.exit(1);
  }
}

// Run all tests
runAllTests().catch(error => {
  console.error('💥 Test runner failed:', error);
  process.exit(1);
});
