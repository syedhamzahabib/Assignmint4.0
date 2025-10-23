// src/lib/firebase.ts
// React Native Firebase v17+ configuration
import firebaseAuth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import messagingModule from '@react-native-firebase/messaging';
// import storage, { FirebaseStorageTypes } from '@react-native-firebase/storage';
import { GOOGLE_WEB_CLIENT_ID } from '../config/firebase.config';

if (__DEV__) console.log('### USING React Native Firebase');

// Check if auth is properly initialized
let authInstance: any = null;
try {
  authInstance = firebaseAuth();
  console.log('🔥 React Native Firebase initialized successfully');
  console.log('✅ Firebase Auth initialized successfully');
} catch (error) {
  console.error('❌ Firebase Auth initialization failed:', error);
  console.log('⚠️ Firebase Auth not available - falling back to mock');
}

// Initialize Firestore and Messaging
let firestoreInstance: any = null;
let messagingInstance: any = null;

try {
  firestoreInstance = firestore();
  console.log('✅ Firestore initialized successfully');
} catch (error) {
  console.error('❌ Firestore initialization failed:', error);
}

try {
  messagingInstance = messagingModule();
  console.log('✅ Firebase Messaging initialized successfully');
} catch (error) {
  console.error('❌ Firebase Messaging initialization failed:', error);
}

const mockStorage = () => {
  console.warn('⚠️ Storage is temporarily disabled');
  return null;
};

// Safe auth function that handles initialization errors
const safeAuth = () => {
  if (authInstance) {
    return authInstance;
  }
  
  try {
    authInstance = firebaseAuth();
    return authInstance;
  } catch (error) {
    console.error('❌ Auth not available:', error);
    throw new Error('Firebase Auth is not available. Please check your configuration.');
  }
};

// Safe Firestore function
const safeFirestore = () => {
  if (firestoreInstance) {
    return firestoreInstance;
  }
  
  try {
    firestoreInstance = firestore();
    return firestoreInstance;
  } catch (error) {
    console.error('❌ Firestore not available:', error);
    throw new Error('Firestore is not available. Please check your configuration.');
  }
};

// Safe Messaging function
const safeMessaging = () => {
  if (messagingInstance) {
    return messagingInstance;
  }
  
  try {
    messagingInstance = messagingModule();
    return messagingInstance;
  } catch (error) {
    console.error('❌ Firebase Messaging not available:', error);
    throw new Error('Firebase Messaging is not available. Please check your configuration.');
  }
};

// Export Firebase services directly
export { GOOGLE_WEB_CLIENT_ID };
export const auth = safeAuth;
export const db = safeFirestore;
export const messaging = safeMessaging;
export const storage = mockStorage;

// For backward compatibility, also export as functions
export const getFirebaseAuth = () => safeAuth();
export const getFirebaseDb = () => safeFirestore();
export const getMessagingInstance = () => safeMessaging();
export const getStorageInstance = () => mockStorage();