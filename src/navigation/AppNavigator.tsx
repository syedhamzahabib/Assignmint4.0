import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants';
import { useAuth } from '../state/AuthProvider';
import { AppTabs } from './AppTabs';
import AuthNavigator from './AuthNavigator';
import ScreenCatalog from './ScreenCatalog';

const Stack = createStackNavigator();

const PlaceholderScreen = ({ route }: { route: any }) => (
  <View style={styles.placeholderContainer}>
    <Text style={styles.placeholderTitle}>{route.name}</Text>
    <Text style={styles.placeholderText}>Coming soon!</Text>
  </View>
);

// Main Stack Navigator
const AppNavigator = () => {
  const { user, mode, loading } = useAuth();

  // Show loading screen while auth state is being determined
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Determine which navigator to show based on auth state
  const shouldShowAuth = !user && mode !== 'guest';
  const shouldShowMain = user || mode === 'guest';

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.background },
      } as any}
    >
      {shouldShowAuth ? (
        // Auth Flow - Show auth navigator
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        // Main App Flow
        <>
          <Stack.Screen name="MainTabs" component={AppTabs} />

          {/* Development Screen Catalog - only in dev mode */}
          {__DEV__ && (
            <Stack.Screen
              name="ScreenCatalog"
              component={ScreenCatalog}
              options={{
                headerShown: false,
              }}
            />
          )}
        </>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 16,
    color: '#666666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});

export default AppNavigator;
