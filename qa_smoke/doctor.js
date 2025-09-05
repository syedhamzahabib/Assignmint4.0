// qa_smoke/doctor.js - Quick check for required exports/files
const fs = require('fs');
const path = require('path');

console.log('🏥 QA Doctor - Checking required files and exports...\n');

const requiredFiles = [
  'src/utils/matching/score.ts',
  'src/services/matching/inviteService.ts',
  'src/services/matching/reservationService.ts',
  'src/services/matching/expandRing.ts',
  'src/services/matching/onTaskCreate.ts',
  'src/services/matching/devScheduler.ts',
  'src/components/matching/SoftClaimButton.tsx',
  'src/components/matching/ConfirmClaimButton.tsx',
  'src/components/matching/TaskMatchingBanner.tsx',
  'src/hooks/useMatching.ts',
  'qa_smoke/run.ts',
  'qa_smoke/helpers/env.ts',
  'qa_smoke/helpers/assert.ts',
  'qa_smoke/fakes/fakeStore.ts'
];

let allGood = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allGood = false;
  }
});

console.log('\n🔍 Checking package.json scripts...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredScripts = ['qa', 'qa:clean', 'qa:doctor'];

requiredScripts.forEach(script => {
  if (packageJson.scripts[script]) {
    console.log(`✅ npm run ${script}`);
  } else {
    console.log(`❌ npm run ${script} - MISSING`);
    allGood = false;
  }
});

console.log('\n🔍 Checking dependencies...');
const requiredDeps = ['tsx', 'cross-env', 'rimraf'];
const devDeps = packageJson.devDependencies || {};

requiredDeps.forEach(dep => {
  if (devDeps[dep]) {
    console.log(`✅ ${dep}@${devDeps[dep]}`);
  } else {
    console.log(`❌ ${dep} - MISSING`);
    allGood = false;
  }
});

if (allGood) {
  console.log('\n🎉 All checks passed! You can run: npm run qa');
} else {
  console.log('\n⚠️  Some issues found. Please fix them before running QA tests.');
  process.exit(1);
}
