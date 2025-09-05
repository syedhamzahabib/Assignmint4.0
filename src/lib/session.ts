import { auth } from './firebase';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

export interface SessionUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

let currentUser: SessionUser | null = null;

export async function ensureSignedInDev(): Promise<string | null> {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) { resolve(await u.getIdToken()); unsub(); return; }
      signInWithEmailAndPassword(auth, 'dev@assignmint.com', 'devpassword123')
        .then(async c => resolve(await c.user.getIdToken()))
        .catch(e => { console.error('Dev sign-in failed:', e); resolve(null); })
        .finally(() => unsub());
    });
  });
}

export async function getIdToken(): Promise<string | null> {
  const u = auth.currentUser;
  return u ? await u.getIdToken() : null;
}

export const session = {
  // Get current user info
  getCurrentUser(): SessionUser | null {
    return currentUser;
  },

  // Sign in with email/password
  async signIn(email: string, password: string): Promise<SessionUser> {
    try {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      currentUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
      
      console.log('✅ Signed in successfully:', currentUser);
      return currentUser;
    } catch (error) {
      console.error('❌ Sign in failed:', error);
      throw error;
    }
  },

  // Sign out
  async signOut(): Promise<void> {
    try {
      await auth.signOut();
      currentUser = null;
      console.log('✅ Signed out successfully');
    } catch (error) {
      console.error('❌ Sign out failed:', error);
      throw error;
    }
  },

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: SessionUser | null) => void): () => void {
    return auth.onAuthStateChanged((user) => {
      if (user) {
        currentUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };
        callback(currentUser);
      } else {
        currentUser = null;
        callback(null);
      }
    });
  }
};

export default session;
