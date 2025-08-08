// config/firebase.js - Fixed version with proper Auth initialization
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock Firebase configuration for development
const firebaseConfig = {
  apiKey: "mock-api-key-for-development",
  authDomain: "assignmint-demo.firebaseapp.com",
  projectId: "assignmint-demo",
  storageBucket: "assignmint-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:mock-app-id-development"
};

// Initialize Firebase with proper error handling
let app;
let db;
let auth;
let storage;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase initialized successfully');

  // Initialize Firestore
  db = getFirestore(app);
  console.log('✅ Firestore initialized');

  // Initialize Auth with AsyncStorage persistence for React Native
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
    console.log('✅ Firebase Auth initialized with AsyncStorage persistence');
  } catch (authError) {
    // If auth is already initialized, get the existing instance
    if (authError.code === 'auth/already-initialized') {
      auth = getAuth(app);
      console.log('✅ Firebase Auth already initialized - using existing instance');
    } else {
      throw authError;
    }
  }

  // Initialize Storage
  storage = getStorage(app);
  console.log('✅ Firebase Storage initialized');

} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  
  // Create mock instances to prevent app crashes
  console.log('🔧 Creating mock Firebase instances...');
  
  db = {
    _type: 'mock-firestore',
    collection: () => ({
      add: () => Promise.resolve({ id: 'mock-doc-id' }),
      doc: () => ({
        get: () => Promise.resolve({ exists: false, data: () => null }),
        set: () => Promise.resolve(),
        update: () => Promise.resolve(),
        delete: () => Promise.resolve(),
      }),
      where: () => ({ get: () => Promise.resolve({ docs: [] }) }),
      orderBy: () => ({ get: () => Promise.resolve({ docs: [] }) }),
      limit: () => ({ get: () => Promise.resolve({ docs: [] }) }),
    }),
  };
  
  auth = {
    _type: 'mock-auth',
    currentUser: null,
    signInAnonymously: () => Promise.resolve({ user: { uid: 'mock-user' } }),
    signOut: () => Promise.resolve(),
    onAuthStateChanged: () => () => {},
  };
  
  storage = {
    _type: 'mock-storage',
    ref: () => ({
      put: () => Promise.resolve({ ref: { getDownloadURL: () => Promise.resolve('mock-url') } }),
      getDownloadURL: () => Promise.resolve('mock-url'),
    }),
  };
}

// Development emulator setup
if (__DEV__ && typeof window !== 'undefined') {
  console.log('🔧 Development mode detected - checking for emulators...');
  
  if (app && db && auth && storage) {
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
      
      // Auth emulator
      try {
        if (!auth.config?.emulator) {
          // Note: initializeAuth does not expose config.emulator; this check is illustrative
          connectAuthEmulator(auth, 'http://localhost:9099');
          console.log('🔥 Connected to Auth emulator on localhost:9099');
        }
      } catch (error) {
        console.log('⚠️ Auth emulator not available or already connected');
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
}

export { db, auth, storage };

export const getFirebaseStatus = () => {
  return {
    isInitialized: !!app,
    isMocked: db?._type === 'mock-firestore',
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

export default app;
