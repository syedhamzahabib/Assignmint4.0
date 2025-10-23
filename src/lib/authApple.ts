import { auth } from './firebase';
import { createUserDocument } from './auth';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { Platform } from 'react-native';

/**
 * Sign in with Apple using react-native-apple-authentication
 */
export const signInWithApple = async () => {
  try {
    // Check if Apple Sign-In is available
    const isAvailable = await appleAuth.isAvailable;
    
    if (!isAvailable) {
      throw new Error('Apple Sign-In is not available on this device');
    }

    // Check if we're on simulator (Apple Sign-In doesn't work on simulator)
    if (Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS) {
      // This is a basic check - in real implementation you'd check if it's simulator
      console.warn('Apple Sign-In may not work properly on iOS Simulator');
    }

    // Start the Apple authentication flow
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // Get the credential state
    const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

    if (credentialState === appleAuth.State.AUTHORIZED) {
      // Create Firebase credential
      const { identityToken, authorizationCode } = appleAuthRequestResponse;
      
      if (!identityToken) {
        throw new Error('No identity token received from Apple');
      }

      const provider = new auth.OAuthProvider('apple.com');
      const credential = provider.credential({
        idToken: identityToken,
        rawNonce: undefined, // We're not using nonce for simplicity
      });

      // Sign in to Firebase
      const userCredential = await auth().signInWithCredential(credential);
      const user = userCredential.user;

      // Extract display name from Apple response
      const displayName = appleAuthRequestResponse.fullName
        ? `${appleAuthRequestResponse.fullName.givenName || ''} ${appleAuthRequestResponse.fullName.familyName || ''}`.trim()
        : '';

      // Create user document in Firestore
      await createUserDocument(user, {
        displayName: displayName || user.displayName || '',
        providerIds: ['apple.com'],
      });

      return {
        id: user.uid,
        email: user.email || '',
        displayName: displayName || user.displayName || '',
        photoURL: user.photoURL || undefined,
        hasPaymentMethod: false,
      };
    } else {
      throw new Error('Apple authentication was not authorized');
    }
  } catch (error) {
    console.error('Apple sign-in error:', error);
    
    // Provide more helpful error messages
    if (error.message?.includes('1000') || error.message?.includes('1001')) {
      throw new Error('Apple Sign-In is not available on iOS Simulator. Please test on a physical device.');
    }
    
    throw error;
  }
};
