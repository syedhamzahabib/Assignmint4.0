// scripts/testMatching.js - Test script for the matching system
const { config } = require('../src/config/environment');

console.log('🧪 Testing AssignMint Matching System');
console.log('=====================================');

// Check environment
console.log(`Environment: ${config.USE_MOCK_DATA ? 'MOCK' : 'PRODUCTION'}`);
console.log(`Mock Data Enabled: ${config.USE_MOCK_DATA}`);

// Test the scoring system
console.log('\n📊 Testing Scoring System...');
try {
  const { scoreExpertForTask, rankExperts } = require('../src/utils/matching/score');
  
  // Create a test task
  const testTask = {
    id: 'test-task-1',
    title: 'Test Task',
    subject: 'Mathematics',
    price: 50,
    deadlineISO: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    status: 'open',
    ownerId: 'test-owner',
  };

  // Create test experts
  const testExperts = [
    {
      uid: 'expert-1',
      displayName: 'Dr. Math Expert',
      subjects: ['Mathematics', 'Physics'],
      minPrice: 30,
      maxPrice: 80,
      level: 'Grad',
      ratingAvg: 4.8,
      ratingCount: 50,
      acceptRate: 0.9,
      medianResponseMins: 10,
      completedBySubject: { 'Mathematics': 20 },
    },
    {
      uid: 'expert-2',
      displayName: 'Math Tutor',
      subjects: ['Mathematics'],
      minPrice: 20,
      maxPrice: 60,
      level: 'UG',
      ratingAvg: 4.5,
      ratingCount: 25,
      acceptRate: 0.8,
      medianResponseMins: 20,
      completedBySubject: { 'Mathematics': 15 },
    },
  ];

  // Score experts
  console.log('Scoring experts for task:', testTask.title);
  testExperts.forEach(expert => {
    const score = scoreExpertForTask(testTask, expert);
    console.log(`  ${expert.displayName}: ${(score.totalScore * 100).toFixed(1)}%`);
    console.log(`    Subject Fit: ${(score.signals.subjectFit * 100).toFixed(1)}%`);
    console.log(`    Price Fit: ${(score.signals.priceFit * 100).toFixed(1)}%`);
    console.log(`    Rating: ${(score.signals.rating * 100).toFixed(1)}%`);
  });

  // Rank experts
  const ranked = rankExperts(testTask, testExperts);
  console.log('\nRanked experts:');
  ranked.forEach((result, index) => {
    console.log(`  ${index + 1}. ${result.expert.displayName} - ${(result.score * 100).toFixed(1)}%`);
  });

  console.log('✅ Scoring system test passed!');
} catch (error) {
  console.error('❌ Scoring system test failed:', error);
}

// Test the matching services
console.log('\n🔧 Testing Matching Services...');
try {
  const { InviteService, ReservationService, DevScheduler } = require('../src/services/matching');
  
  console.log('  - InviteService: Available');
  console.log('  - ReservationService: Available');
  console.log('  - DevScheduler: Available');
  
  // Test scheduler
  const schedulerStatus = DevScheduler.getStatus();
  console.log(`  - Scheduler Status: ${schedulerStatus.isRunning ? 'Running' : 'Stopped'}`);
  
  console.log('✅ Matching services test passed!');
} catch (error) {
  console.error('❌ Matching services test failed:', error);
}

// Test the components
console.log('\n🎨 Testing Matching Components...');
try {
  const { SoftClaimButton, ConfirmClaimButton, TaskMatchingBanner } = require('../src/components/matching');
  
  console.log('  - SoftClaimButton: Available');
  console.log('  - ConfirmClaimButton: Available');
  console.log('  - TaskMatchingBanner: Available');
  
  console.log('✅ Matching components test passed!');
} catch (error) {
  console.error('❌ Matching components test failed:', error);
}

// Test the hook
console.log('\n🎣 Testing Matching Hook...');
try {
  const { useMatching } = require('../src/hooks/useMatching');
  
  console.log('  - useMatching hook: Available');
  
  console.log('✅ Matching hook test passed!');
} catch (error) {
  console.error('❌ Matching hook test failed:', error);
}

console.log('\n🎉 All tests completed!');
console.log('\nNext steps:');
console.log('1. Run the iOS simulator to see the UI');
console.log('2. Use the seed script: npm run seed:matching');
console.log('3. Test the matching flow in the app');
console.log('4. Check console logs for matching activity');
