import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger';

let isInitialized = false;

export function initializeFirebaseAdmin(): admin.app.App | null {
  if (isInitialized) {
    return admin.app();
  }

  try {
    // Check if we should use mock data
    if (process.env['MOCK_DATA'] === 'true') {
      logger.info('Firebase Admin: Skipping initialization (MOCK_DATA=true)');
      return null;
    }

    // Load service account from environment variables
    const projectId = process.env['FIREBASE_PROJECT_ID'];
    const clientEmail = process.env['FIREBASE_CLIENT_EMAIL'];
    const privateKey = process.env['FIREBASE_PRIVATE_KEY'];
    
    if (!projectId || !clientEmail || !privateKey) {
      logger.error('Firebase Admin: Missing required environment variables');
      throw new Error('Missing Firebase environment variables: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY');
    }

    // Parse private key (replace \n with actual newlines)
    const parsedPrivateKey = privateKey.replace(/\\n/g, '\n');

    const serviceAccount = {
      projectId,
      clientEmail,
      privateKey: parsedPrivateKey,
    };

    // Initialize Firebase Admin
    if (!admin.apps.length) {
      const app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.projectId,
      });
      
      logger.info(`Firebase Admin initialized successfully for project: ${serviceAccount.projectId}`);
      isInitialized = true;
      return app;
    } else {
      logger.info('Firebase Admin already initialized');
      isInitialized = true;
      return admin.app();
    }
  } catch (error) {
    logger.error('Firebase Admin initialization failed:', error);
    throw error;
  }
}

export function getFirestore(): admin.firestore.Firestore {
  if (!isInitialized) {
    throw new Error('Firebase Admin not initialized. Call initializeFirebaseAdmin() first.');
  }
  return admin.firestore();
}

export function getAuth(): admin.auth.Auth {
  if (!isInitialized) {
    throw new Error('Firebase Admin not initialized. Call initializeFirebaseAdmin() first.');
  }
  return admin.auth();
}

export function getStorage(): admin.storage.Storage {
  if (!isInitialized) {
    throw new Error('Firebase Admin not initialized. Call initializeFirebaseAdmin() first.');
  }
  return admin.storage();
}

export function isFirebaseInitialized(): boolean {
  return isInitialized;
}
