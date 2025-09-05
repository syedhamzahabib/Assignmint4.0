import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage, onAuthStateChange } from '../lib/firebase';

// Types
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  hasPaymentMethod: boolean;
}

export interface AuthError {
  code: string;
  message: string;
}

// Convert Firebase User to our AuthUser format
const convertFirebaseUser = (firebaseUser: FirebaseUser): AuthUser => {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: firebaseUser.displayName || 'User',
    hasPaymentMethod: false, // Default value, can be updated from Firestore
  };
};

// Upload avatar to Storage
const uploadAvatar = async (uid: string, avatarUri: string): Promise<string> => {
  try {
    const response = await fetch(avatarUri);
    const blob = await response.blob();
    const storageRef = ref(storage, `users/${uid}/avatar.jpg`);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    console.log('✅ Avatar uploaded to Storage:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('❌ Error uploading avatar:', error);
    throw error;
  }
};

// Create user document in Firestore
const createUserDocument = async (uid: string, email: string, displayName?: string, avatarURL?: string) => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      email,
      displayName: displayName || 'User',
      avatarURL,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      hasPaymentMethod: false,
    });
    console.log('✅ User document created in Firestore');
  } catch (error) {
    console.error('❌ Error creating user document:', error);
    throw error;
  }
};

// Auth Service Functions
export const authService = {
  // Observe authentication state changes
  observeAuth: (callback: (user: AuthUser | null) => void) => {
    return onAuthStateChange((firebaseUser) => {
      if (firebaseUser) {
        const user = convertFirebaseUser(firebaseUser);
        console.log('👤 User authenticated:', user.email);
        callback(user);
      } else {
        console.log('👤 User signed out');
        callback(null);
      }
    });
  },

  // Register new user
  register: async (email: string, password: string, displayName?: string, avatarUri?: string): Promise<AuthUser> => {
    try {
      console.log('📝 Starting registration for:', email);

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update display name if provided
      if (displayName) {
        await updateProfile(firebaseUser, { displayName });
      }

      // Upload avatar if provided
      let avatarURL: string | undefined;
      if (avatarUri) {
        avatarURL = await uploadAvatar(firebaseUser.uid, avatarUri);
        // Update profile with avatar URL
        await updateProfile(firebaseUser, { photoURL: avatarURL });
      }

      // Create user document in Firestore
      await createUserDocument(firebaseUser.uid, email, displayName, avatarURL);

      const user = convertFirebaseUser(firebaseUser);
      console.log('✅ Registration successful for:', user.email, 'UID:', firebaseUser.uid);
      return user;
    } catch (error: any) {
      console.error('❌ Registration error:', error);

      // Handle specific Firebase auth errors
      let message = 'Registration failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        message = 'An account with this email already exists.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters long.';
      }

      throw new Error(message);
    }
  },

  // Login user
  login: async (email: string, password: string): Promise<AuthUser> => {
    try {
      console.log('🔐 Starting login for:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = convertFirebaseUser(userCredential.user);
      console.log('✅ Login successful for:', user.email, 'UID:', userCredential.user.uid);
      return user;
    } catch (error: any) {
      console.error('❌ Login error:', error);

      // Handle specific Firebase auth errors
      let message = 'Login failed. Please try again.';
      if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email address.';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many failed attempts. Please try again later.';
      }

      throw new Error(message);
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      console.log('🚪 Starting logout');
      await signOut(auth);
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
      throw new Error('Logout failed. Please try again.');
    }
  },

  // Send password reset email
  forgotPassword: async (email: string): Promise<void> => {
    try {
      console.log('📧 Sending password reset email to:', email);
      await sendPasswordResetEmail(auth, email);
      console.log('✅ Password reset email sent');
    } catch (error: any) {
      console.error('❌ Password reset error:', error);

      // Handle specific Firebase auth errors
      let message = 'Failed to send reset email. Please try again.';
      if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email address.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      }

      throw new Error(message);
    }
  },

  // Get current user
  getCurrentUser: (): AuthUser | null => {
    const firebaseUser = auth.currentUser;
    return firebaseUser ? convertFirebaseUser(firebaseUser) : null;
  },
};
