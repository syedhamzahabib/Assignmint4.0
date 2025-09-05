import { config } from 'dotenv';
import { initializeFirebaseAdmin } from '../src/config/firebase';

// Load environment variables
config();

async function createDevUser() {
  try {
    console.log('🔐 Creating dev user...');
    
    // Initialize Firebase Admin
    const admin = initializeFirebaseAdmin();
    if (!admin) {
      console.error('❌ Failed to initialize Firebase Admin');
      return;
    }

    const auth = admin.auth();
    
    // Create user with email/password
    const userRecord = await auth.createUser({
      email: 'dev@assignmint.com',
      password: 'devpassword123',
      displayName: 'Dev User',
      emailVerified: true,
    });

    console.log('✅ Dev user created successfully:');
    console.log('  UID:', userRecord.uid);
    console.log('  Email:', userRecord.email);
    console.log('  Display Name:', userRecord.displayName);
    
    // Set custom claims if needed
    await auth.setCustomUserClaims(userRecord.uid, {
      role: 'developer',
      isDev: true
    });
    
    console.log('✅ Custom claims set successfully');
    
  } catch (error) {
    console.error('❌ Error creating dev user:', error);
  }
}

// Run the script
createDevUser();
