import Config from 'react-native-config';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { initializeAuth, getAuth } from 'firebase/auth';
import { getReactNativePersistence } from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// dev fallback
// @ts-ignore
import fallback from '../config/firebase.local.json';

const cfg = {
  apiKey: Config.FIREBASE_API_KEY || fallback.apiKey,
  appId: Config.FIREBASE_APP_ID || fallback.appId,
  projectId: Config.FIREBASE_PROJECT_ID || fallback.projectId,
  authDomain: Config.FIREBASE_AUTH_DOMAIN || fallback.authDomain,
  storageBucket: Config.FIREBASE_STORAGE_BUCKET || fallback.storageBucket,
  messagingSenderId: Config.FIREBASE_MESSAGING_SENDER_ID || fallback.messagingSenderId,
};

console.log('🔥 Firebase cfg:', {
  apiKeyLen: (cfg.apiKey || '').length,
  appId: cfg.appId,
  projectId: cfg.projectId,
  API_BASE_URL: Config.API_BASE_URL,
});

const app = getApps().length ? getApp() : initializeApp(cfg);
let auth;
try {
  auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
} catch { auth = getAuth(app); }
export { app, auth };