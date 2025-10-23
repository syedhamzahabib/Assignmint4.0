// Auth error helper to map Firebase error codes to human-friendly messages
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

export interface AuthErrorInfo {
  title: string;
  message: string;
  code: string;
  isRetryable: boolean;
}

export const getAuthErrorInfo = (error: any): AuthErrorInfo => {
  const code = error?.code || error?.message || 'unknown';
  
  switch (code) {
    case 'auth/user-not-found':
      return {
        title: 'Account Not Found',
        message: 'No account found with this email address.',
        code,
        isRetryable: false
      };
    
    case 'auth/wrong-password':
      return {
        title: 'Incorrect Password',
        message: 'The password you entered is incorrect.',
        code,
        isRetryable: true
      };
    
    case 'auth/email-already-in-use':
      return {
        title: 'Email Already Registered',
        message: 'An account with this email already exists.',
        code,
        isRetryable: false
      };
    
    case 'auth/weak-password':
      return {
        title: 'Password Too Weak',
        message: 'Password should be at least 6 characters long.',
        code,
        isRetryable: true
      };
    
    case 'auth/invalid-email':
      return {
        title: 'Invalid Email',
        message: 'Please enter a valid email address.',
        code,
        isRetryable: true
      };
    
    case 'auth/user-disabled':
      return {
        title: 'Account Disabled',
        message: 'This account has been disabled. Please contact support.',
        code,
        isRetryable: false
      };
    
    case 'auth/too-many-requests':
      return {
        title: 'Too Many Attempts',
        message: 'Too many failed attempts. Please try again later.',
        code,
        isRetryable: true
      };
    
    case 'auth/network-request-failed':
      return {
        title: 'Network Error',
        message: 'Please check your internet connection and try again.',
        code,
        isRetryable: true
      };
    
    case 'auth/invalid-credential':
      return {
        title: 'Invalid Credentials',
        message: 'The email or password is incorrect.',
        code,
        isRetryable: true
      };
    
    case 'auth/requires-recent-login':
      return {
        title: 'Recent Login Required',
        message: 'Please sign in again to continue.',
        code,
        isRetryable: true
      };
    
    case 'auth/operation-not-allowed':
      return {
        title: 'Operation Not Allowed',
        message: 'This sign-in method is not enabled.',
        code,
        isRetryable: false
      };
    
    case 'auth/invalid-verification-code':
      return {
        title: 'Invalid Code',
        message: 'The verification code is incorrect.',
        code,
        isRetryable: true
      };
    
    case 'auth/invalid-verification-id':
      return {
        title: 'Invalid Verification',
        message: 'The verification ID is invalid.',
        code,
        isRetryable: true
      };
    
    case 'auth/missing-verification-code':
      return {
        title: 'Missing Code',
        message: 'Please enter the verification code.',
        code,
        isRetryable: true
      };
    
    case 'auth/missing-verification-id':
      return {
        title: 'Missing Verification',
        message: 'Verification ID is missing.',
        code,
        isRetryable: true
      };
    
    case 'auth/code-expired':
      return {
        title: 'Code Expired',
        message: 'The verification code has expired. Please request a new one.',
        code,
        isRetryable: true
      };
    
    case 'auth/quota-exceeded':
      return {
        title: 'Quota Exceeded',
        message: 'Too many requests. Please try again later.',
        code,
        isRetryable: true
      };
    
    case 'auth/app-deleted':
      return {
        title: 'App Configuration Error',
        message: 'Firebase configuration issue. Please contact support.',
        code,
        isRetryable: false
      };
    
    case 'auth/app-not-authorized':
      return {
        title: 'App Not Authorized',
        message: 'Firebase app is not authorized.',
        code,
        isRetryable: false
      };
    
    case 'auth/argument-error':
      return {
        title: 'Invalid Input',
        message: 'Please check your input and try again.',
        code,
        isRetryable: true
      };
    
    case 'auth/invalid-api-key':
      return {
        title: 'Configuration Error',
        message: 'Firebase configuration issue. Please contact support.',
        code,
        isRetryable: false
      };
    
    case 'auth/invalid-user-token':
      return {
        title: 'Session Expired',
        message: 'Your session has expired. Please sign in again.',
        code,
        isRetryable: true
      };
    
    case 'auth/user-token-expired':
      return {
        title: 'Session Expired',
        message: 'Your session has expired. Please sign in again.',
        code,
        isRetryable: true
      };
    
    default:
      // Check if it's a network-related error
      if (code.includes('network') || code.includes('connection') || code.includes('timeout')) {
        return {
          title: 'Network Error',
          message: 'Please check your internet connection and try again.',
          code,
          isRetryable: true
        };
      }
      
      // Check if it's a Firebase initialization error
      if (code.includes('firebase') || code.includes('initialization')) {
        return {
          title: 'Firebase Error',
          message: 'Firebase configuration issue. Please contact support.',
          code,
          isRetryable: false
        };
      }
      
      return {
        title: 'Authentication Error',
        message: error?.message || 'An unexpected error occurred. Please try again.',
        code,
        isRetryable: true
      };
  }
};

export const logAuthError = (error: any, context: string = 'Auth') => {
  const errorInfo = getAuthErrorInfo(error);
  
  console.group(`🔐 ${context} Error`);
  console.error('Code:', errorInfo.code);
  console.error('Title:', errorInfo.title);
  console.error('Message:', errorInfo.message);
  console.error('Is Retryable:', errorInfo.isRetryable);
  console.error('Raw Error:', error);
  console.groupEnd();
  
  return errorInfo;
};
