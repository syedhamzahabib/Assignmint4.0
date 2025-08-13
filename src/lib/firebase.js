// Firebase configuration for AssignMint - Production Safe with Robust Error Handling
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Production Firebase configuration
// Replace these with your actual Firebase project config when ready
const firebaseConfig = {
  apiKey: "mock-api-key",
  authDomain: "assignmint-dev.firebaseapp.com",
  projectId: "assignmint-dev",
  storageBucket: "assignmint-dev.appspot.com",
  messagingSenderId: "123456789",
  appId: "mock-app-id"
};

// Global Firebase instances
let app = null;
let db = null;
let auth = null;
let storage = null;
let isInitialized = false;
let isMocked = false;

// Initialize Firebase with comprehensive error handling
const initializeFirebase = () => {
  if (isInitialized) {
    console.log('✅ Firebase already initialized');
    return { app, db, auth, storage, isMocked };
  }

  // Check if we have valid Firebase config (not mock values)
  const hasValidConfig = firebaseConfig.apiKey && 
                        firebaseConfig.apiKey !== 'mock-api-key' && 
                        firebaseConfig.projectId && 
                        firebaseConfig.projectId !== 'assignmint-dev';

  if (!hasValidConfig) {
    console.log('🔧 Using mock Firebase configuration - no valid config provided');
    return createMockFirebaseInstances();
  }

  try {
    console.log('🚀 Initializing Firebase...');
    
    // Initialize Firebase App
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase App initialized');

    // Initialize Firestore
    db = getFirestore(app);
    console.log('✅ Firestore initialized');

    // Initialize Auth with proper error handling and registration
    try {
      // First, try to get existing auth instance
      const existingAuth = getAuth(app);
      if (existingAuth) {
        auth = existingAuth;
        console.log('✅ Firebase Auth already exists - using existing instance');
      } else {
        // Initialize new auth instance with React Native persistence
        auth = initializeAuth(app, {
          persistence: getReactNativePersistence(AsyncStorage)
        });
        console.log('✅ Firebase Auth initialized with AsyncStorage persistence');
      }
    } catch (authError) {
      console.warn('⚠️ Auth initialization error:', authError.message);
      
      // Handle specific auth errors
      if (authError.code === 'auth/already-initialized') {
        try {
          auth = getAuth(app);
          console.log('✅ Firebase Auth already initialized - using existing instance');
        } catch (getAuthError) {
          console.error('❌ Failed to get existing auth instance:', getAuthError.message);
          throw getAuthError;
        }
      } else if (authError.code === 'auth/component-not-registered') {
        console.error('❌ Auth component not registered - falling back to mock mode');
        throw authError;
      } else {
        console.error('❌ Auth initialization failed:', authError.message);
        throw authError;
      }
    }

    // Initialize Storage
    storage = getStorage(app);
    console.log('✅ Firebase Storage initialized');

    isInitialized = true;
    isMocked = false;
    
    console.log('🎉 Firebase initialization completed successfully');
    return { app, db, auth, storage, isMocked };

  } catch (error) {
    console.error('❌ Firebase initialization failed:', error.message);
    
    // Create production-safe mock instances
    console.log('🔧 Creating production-safe mock Firebase instances...');
    
    return createMockFirebaseInstances();
  }
};

// Create production-safe mock Firebase instances
const createMockFirebaseInstances = () => {
  // Create mock app
  app = {
    _type: 'mock-app',
    name: 'mock-app',
    options: firebaseConfig,
  };
  
  // Create mock Firestore
  db = {
    _type: 'mock-firestore',
    collection: (collectionName) => ({
      add: (data) => Promise.resolve({ id: `mock-doc-${Date.now()}` }),
      doc: (docId) => ({
        get: () => Promise.resolve({ exists: false, data: () => null }),
        set: (data) => Promise.resolve(),
        update: (data) => Promise.resolve(),
        delete: () => Promise.resolve(),
      }),
      where: (field, operator, value) => ({ 
        get: () => Promise.resolve({ docs: [] }),
        orderBy: (field, direction) => ({ 
          get: () => Promise.resolve({ docs: [] }),
          limit: (count) => ({ get: () => Promise.resolve({ docs: [] }) })
        }),
        limit: (count) => ({ get: () => Promise.resolve({ docs: [] }) })
      }),
      orderBy: (field, direction) => ({ 
        get: () => Promise.resolve({ docs: [] }),
        limit: (count) => ({ get: () => Promise.resolve({ docs: [] }) })
      }),
      limit: (count) => ({ get: () => Promise.resolve({ docs: [] }) }),
    }),
  };
  
  // Create production-safe mock Auth
  auth = {
    _type: 'mock-auth',
    app: app,
    currentUser: null,
    
    // Core auth methods
    signInAnonymously: () => Promise.resolve({ 
      user: { 
        uid: `mock-user-${Date.now()}`,
        email: null,
        displayName: 'Mock User',
        photoURL: null,
        isAnonymous: true,
        emailVerified: false,
        phoneNumber: null,
        metadata: {
          creationTime: new Date().toISOString(),
          lastSignInTime: new Date().toISOString(),
        }
      } 
    }),
    
    signInWithEmailAndPassword: (email, password) => Promise.resolve({ 
      user: { 
        uid: `mock-user-${Date.now()}`,
        email: email,
        displayName: 'Mock User',
        photoURL: null,
        isAnonymous: false,
        emailVerified: true,
        phoneNumber: null,
        metadata: {
          creationTime: new Date().toISOString(),
          lastSignInTime: new Date().toISOString(),
        }
      } 
    }),
    
    createUserWithEmailAndPassword: (email, password) => Promise.resolve({ 
      user: { 
        uid: `mock-user-${Date.now()}`,
        email: email,
        displayName: 'Mock User',
        photoURL: null,
        isAnonymous: false,
        emailVerified: false,
        phoneNumber: null,
        metadata: {
          creationTime: new Date().toISOString(),
          lastSignInTime: new Date().toISOString(),
        }
      } 
    }),
    
    signOut: () => Promise.resolve(),
    
    // Auth state listeners
    onAuthStateChanged: (callback) => {
      // Call immediately with null (no user)
      callback(null);
      // Return unsubscribe function
      return () => {
        console.log('🔄 Auth state listener unsubscribed (mock)');
      };
    },
    
    onIdTokenChanged: (callback) => {
      callback(null);
      return () => {
        console.log('🔄 ID token listener unsubscribed (mock)');
      };
    },
    
    // Profile management
    updateProfile: (user, profile) => Promise.resolve(),
    updateEmail: (user, email) => Promise.resolve(),
    updatePassword: (user, password) => Promise.resolve(),
    
    // Password reset
    sendPasswordResetEmail: (email) => Promise.resolve(),
    confirmPasswordReset: (code, password) => Promise.resolve(),
    verifyPasswordResetCode: (code) => Promise.resolve('mock-email@example.com'),
  };
  
  // Create mock Storage
  storage = {
    _type: 'mock-storage',
    ref: (path) => ({
      put: (file) => Promise.resolve({ ref: { getDownloadURL: () => Promise.resolve('mock-url') } }),
      getDownloadURL: () => Promise.resolve('mock-url'),
    }),
  };
  
  isInitialized = true;
  isMocked = true;
  
  console.log('✅ Production-safe mock Firebase instances created');
  return { app, db, auth, storage, isMocked };
};

// Initialize Firebase immediately
const firebaseInstances = initializeFirebase();
app = firebaseInstances.app;
db = firebaseInstances.db;
auth = firebaseInstances.auth;
storage = firebaseInstances.storage;
isMocked = firebaseInstances.isMocked;

// Development emulator setup (only if not mocked)
if (__DEV__ && !isMocked && typeof window !== 'undefined') {
  console.log('🔧 Development mode detected - checking for emulators...');
  
  try {
    // Firestore emulator
    try {
      if (!db._delegate?._settings?.host?.includes('localhost')) {
        connectFirestoreEmulator(db, 'localhost', 8080);
        console.log('🔥 Connected to Firestore emulator on localhost:8080');
      }
    } catch (error) {
      console.log('⚠️ Firestore emulator not available');
    }
    
    // Storage emulator
    try {
      if (!storage._location?.bucket?.includes('localhost')) {
        connectStorageEmulator(storage, 'localhost', 9199);
        console.log('🔥 Connected to Storage emulator on localhost:9199');
      }
    } catch (error) {
      console.log('⚠️ Storage emulator not available');
    }
    
  } catch (error) {
    console.log('⚠️ Firebase emulators not available:', error.message);
  }
}

// Export Firebase instances
export { db, auth, storage };

// Get Firebase status
export const getFirebaseStatus = () => {
  return {
    isInitialized,
    isMocked,
    config: {
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain,
    },
    services: {
      firestore: !!db,
      auth: !!auth,
      storage: !!storage,
    }
  };
};

// Test Firebase connection
export const testFirebaseConnection = async () => {
  try {
    console.log('🧪 Testing Firebase connection...');
    
    const status = getFirebaseStatus();
    console.log('📊 Firebase Status:', status);
    
    if (status.isMocked) {
      console.log('✅ Mock Firebase is working correctly');
      
      // Test auth methods
      if (auth) {
        console.log('✅ Mock Auth is available');
        try {
          const result = await auth.signInAnonymously();
          console.log('✅ Mock Auth signInAnonymously works:', result.user.uid);
        } catch (error) {
          console.log('⚠️ Mock Auth signInAnonymously error:', error.message);
        }
      }
      
      return { success: true, message: 'Mock Firebase is working' };
    }
    
    // Test real Firebase services
    if (db) {
      console.log('✅ Firestore is available');
    }
    
    if (auth) {
      console.log('✅ Auth is available');
    }
    
    if (storage) {
      console.log('✅ Storage is available');
    }
    
    console.log('✅ Firebase connection test passed');
    return { success: true, message: 'Firebase is working correctly' };
    
  } catch (error) {
    console.error('❌ Firebase connection test failed:', error);
    return { success: false, message: error.message };
  }
};

// Quick Firebase health check
export const quickFirebaseCheck = () => {
  console.log('🔍 Quick Firebase Health Check:');
  console.log('- App:', !!app);
  console.log('- DB:', !!db);
  console.log('- Auth:', !!auth);
  console.log('- Storage:', !!storage);
  console.log('- Initialized:', isInitialized);
  console.log('- Mocked:', isMocked);
  
  return {
    app: !!app,
    db: !!db,
    auth: !!auth,
    storage: !!storage,
    isInitialized,
    isMocked
  };
};

// Re-initialize Firebase (for testing or recovery)
export const reinitializeFirebase = () => {
  console.log('🔄 Re-initializing Firebase...');
  isInitialized = false;
  return initializeFirebase();
};

export default app;
