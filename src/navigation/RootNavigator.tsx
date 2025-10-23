import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants';
import { useAuth } from '../state/AuthProvider';
import { AppTabs } from './AppTabs';
import AuthNavigator from './AuthNavigator';
import { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

// Loading screen while checking auth state
const LoadingScreen = () => (
  <View style={styles.loadingContainer} testID="loading">
    <ActivityIndicator size="large" color={COLORS.primary} />
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);

const RootNavigator = () => {
  const { user, loading, mode } = useAuth();

  // Debug logging
  console.log('🔍 RootNavigator - Auth State:', { user: !!user, loading, mode });
  console.log('🚀 AssignMint App is starting up...');

  // Show loading screen while checking auth state
  if (loading) {
    console.log('⏳ RootNavigator - Showing Loading Screen');
    return <LoadingScreen />;
  }

  // Determine which navigator to show
  const shouldShowAuth = !user && mode !== 'guest';
  const shouldShowMain = user || mode === 'guest';

  console.log('🔍 RootNavigator - Navigation Decision:', { shouldShowAuth, shouldShowMain });

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: COLORS.background },
        }}
      >
        {shouldShowAuth ? (
          // User is not authenticated and not in guest mode - show auth flow
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          // User is authenticated or in guest mode - show main app
          <Stack.Screen name="MainTabs" component={AppTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
});

export default RootNavigator;
