// App.js - Production Safe with Error Boundaries
import React, { useEffect, useState } from 'react';
import { StyleSheet, StatusBar, View, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import Firebase first to ensure initialization
import './src/lib/firebase';

// Import constants
import { COLORS } from './src/constants';

// Import new auth and navigation
import { AuthProvider } from './src/state/AuthProvider';
import RootNavigator from './src/navigation/RootNavigator';
import { ensureSignedInDev } from './src/lib/session';

const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Initializing AssignMint app...');
        const token = await ensureSignedInDev();
        if (token) {
          console.log('✅ Dev sign-in successful, token length:', token.length);
        } else {
          console.log('⚠️ Dev sign-in skipped or failed');
        }
        setIsInitialized(true);
      } catch (err) {
        console.error('❌ App initialization failed:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsInitialized(true); // Still show the app, but with error
      }
    };

    initializeApp();
  }, []);

  if (!isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Initializing...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Initialization Error:</Text>
        <Text style={styles.errorDetails}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    fontSize: 18,
    color: COLORS.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginBottom: 10,
  },
  errorDetails: {
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center',
  },
});

export default App;
