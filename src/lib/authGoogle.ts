// Google Sign-In is temporarily disabled due to dependency conflicts
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { auth, GOOGLE_WEB_CLIENT_ID } from './firebase';
import { createUserDocument } from './auth';

// Mock GoogleSignin for now
const GoogleSignin = {
  configure: () => {
    console.warn('⚠️ Google Sign-In is temporarily disabled due to dependency conflicts');
  },
  hasPlayServices: () => {
    throw new Error('Google Sign-In is temporarily disabled');
  },
  signIn: () => {
    throw new Error('Google Sign-In is temporarily disabled');
  }
};

// Configure Google Sign-In (disabled)
GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID, // From Firebase Console
  offlineAccess: true, // If you want to access Google API on behalf of the user FROM YOUR SERVER
  hostedDomain: '', // Specifies a hosted domain restriction
  forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
  accountName: '', // [Android] specifies an account name on the device that should be used
});

/**
 * Sign in with Google using native Google Sign-In
 * Currently disabled due to dependency conflicts
 */
export const signInWithGoogle = async () => {
  console.warn('⚠️ Google Sign-In is temporarily disabled due to dependency conflicts');
  throw new Error('Google Sign-In is temporarily disabled. Please use email/password authentication for now.');
};
