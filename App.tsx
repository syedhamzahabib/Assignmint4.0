import React, { useEffect } from 'react';
import { StatusBar, NativeModules } from 'react-native';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import { AuthProvider } from './src/state/AuthProvider';
import { ErrorBoundary, setupGlobalErrorHandling } from './src/components/ErrorBoundary';
import RootNavigator from './src/navigation/RootNavigator';

const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || '<pk_test_replace_me>';

// Check if Stripe native module is available
const hasStripe = !!NativeModules.StripeSdk;
console.log('🔍 Stripe native linked:', hasStripe);

// Stripe sanity check component
const StripeSanityCheck: React.FC = () => {
  const { isPlatformPaySupported } = useStripe();

  useEffect(() => {
    // Sanity check to verify Stripe module is loaded
    console.log('✅ Stripe module loaded successfully');
    
    // Check if Apple Pay is supported (this is a non-network call)
    if (isPlatformPaySupported) {
      isPlatformPaySupported().then((supported) => {
        console.log('🍎 Apple Pay supported:', supported);
      }).catch((error) => {
        console.log('🍎 Apple Pay check failed (expected if not on device):', error.message);
      });
    }
  }, [isPlatformPaySupported]);

  return null;
};

export default function App() {
  useEffect(() => {
    // Setup global error handling
    setupGlobalErrorHandling();
  }, []);

  return (
    <ErrorBoundary>
      {hasStripe ? (
        <StripeProvider
          publishableKey={STRIPE_PUBLISHABLE_KEY}
          urlScheme="assignmint"
          // merchantIdentifier="merchant.assignmint" // enable later when Apple Pay is added
        >
          <AuthProvider>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <StripeSanityCheck />
            <RootNavigator />
          </AuthProvider>
        </StripeProvider>
      ) : (
        <AuthProvider>
          <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
          <RootNavigator />
        </AuthProvider>
      )}
    </ErrorBoundary>
  );
}