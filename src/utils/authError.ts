// src/utils/authError.ts - Firebase auth error mapping utility
export interface AuthError {
  code: string;
  message: string;
}

export const mapAuthError = (error: AuthError): string => {
  switch (error.code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please sign in instead.';
    
    case 'auth/user-not-found':
      return 'No account found with this email. Please check your email or sign up.';
    
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';
    
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    
    case 'auth/operation-not-allowed':
      return 'This operation is not allowed. Please contact support.';
    
    case 'auth/invalid-credential':
      return 'Invalid credentials. Please check your email and password.';
    
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with the same email but different sign-in credentials.';
    
    case 'auth/requires-recent-login':
      return 'This operation requires recent authentication. Please sign in again.';
    
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled. Please try again.';
    
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked. Please allow popups and try again.';
    
    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled. Please try again.';
    
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled. Please try again.';
    
    case 'auth/invalid-verification-code':
      return 'Invalid verification code. Please check and try again.';
    
    case 'auth/invalid-verification-id':
      return 'Invalid verification ID. Please request a new code.';
    
    case 'auth/quota-exceeded':
      return 'Service temporarily unavailable. Please try again later.';
    
    case 'auth/credential-already-in-use':
      return 'This credential is already associated with another account.';
    
    case 'auth/timeout':
      return 'Request timed out. Please try again.';
    
    default:
      // Log the actual error for debugging but show a generic message
      console.warn('Unhandled auth error:', error);
      return 'An unexpected error occurred. Please try again.';
  }
};

export const isNetworkError = (error: AuthError): boolean => {
  return error.code === 'auth/network-request-failed';
};

export const isUserError = (error: AuthError): boolean => {
  return [
    'auth/invalid-email',
    'auth/weak-password',
    'auth/wrong-password',
    'auth/user-not-found',
    'auth/invalid-credential'
  ].includes(error.code);
};

export const isSystemError = (error: AuthError): boolean => {
  return [
    'auth/too-many-requests',
    'auth/quota-exceeded',
    'auth/timeout',
    'auth/operation-not-allowed'
  ].includes(error.code);
};
