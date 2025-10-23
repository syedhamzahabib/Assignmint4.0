import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { auth, db, storage } from './firebase';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  hasPaymentMethod: boolean;
}

/**
 * Sign in with email and password
 */
export const signInEmail = async (email: string, password: string): Promise<AuthUser> => {
  const userCredential = await auth().signInWithEmailAndPassword(email, password);
  const user = userCredential.user;
  
  return {
    id: user.uid,
    email: user.email || '',
    displayName: user.displayName || '',
    photoURL: user.photoURL || undefined,
    hasPaymentMethod: false, // This would need to be fetched from Firestore
  };
};

/**
 * Sign up with email and password
 */
export const signUpEmail = async (
  email: string, 
  password: string, 
  displayName: string
): Promise<AuthUser> => {
  // Create Firebase user
  const userCredential = await auth().createUserWithEmailAndPassword(email, password);
  const user = userCredential.user;
  
  // Update profile with display name
  await user.updateProfile({ displayName });
  
  // Send email verification
  await user.sendEmailVerification();
  console.log('✅ Verification email sent to:', email);
  
  // Create Firestore profile
  await db().collection('users').doc(user.uid).set({
    displayName,
    email,
    photoURL: user.photoURL ?? null,
    role: 'user',
    stripeCustomerId: null,
    createdAt: db().FieldValue.serverTimestamp(),
    updatedAt: db().FieldValue.serverTimestamp(),
  }, { merge: true });
  
  // Non-blocking operations (Storage seeds)
  const nonBlockingOps = [
    storage().ref(`users/${user.uid}/hello.txt`).putString('Hi', 'raw'),
  ];
  await Promise.allSettled(nonBlockingOps);
  
  return {
    id: user.uid,
    email: user.email || '',
    displayName: user.displayName || '',
    photoURL: user.photoURL || undefined,
    hasPaymentMethod: false,
  };
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<void> => {
  await auth().sendPasswordResetEmail(email);
};

/**
 * Create user document in Firestore for OAuth users
 */
export const createUserDocument = async (user: FirebaseAuthTypes.User, additionalData?: any) => {
  const userRef = db().collection('users').doc(user.uid);
  
  const userData = {
    displayName: user.displayName || '',
    email: user.email || '',
    photoURL: user.photoURL || null,
    role: 'user',
    stripeCustomerId: null,
    createdAt: db().FieldValue.serverTimestamp(),
    updatedAt: db().FieldValue.serverTimestamp(),
    ...additionalData,
  };
  
  await userRef.set(userData, { merge: true });
  
  return userData;
};
