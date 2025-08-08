import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants';
import { AppTabs } from './AppTabs';
import AuthNavigator from './AuthNavigator';
import { useAuthStore } from '../services/AuthStore';
import { analytics } from '../services/AnalyticsService';

// Import screens that actually exist
import HomeScreen from '../screens/HomeScreen';
import MyTasksScreen from '../screens/MyTasksScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import PostTeaserScreen from '../screens/PostTeaserScreen';
import PaymentsScreen from '../screens/PaymentsScreen';
import AddPaymentMethodScreen from '../screens/AddPaymentMethodScreen';
import PostTaskScreen from '../screens/PostTaskScreen';
import TaskPostedConfirmation from '../screens/TaskPostedConfirmation';
import LandingScreen from '../screens/LandingScreen';
import SignUpScreen from '../screens/SignUpScreen';
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import SignUpPaymentScreen from '../screens/SignUpPaymentScreen';
import TaskDetailsScreen from '../screens/TaskDetailsScreen';
import ChatScreen from '../screens/ChatScreen';
import ChatThreadScreen from '../screens/ChatThreadScreen';
import MessagesScreen from '../screens/MessagesScreen';
import WalletScreen from '../screens/WalletScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import AIAssistantScreen from '../screens/AIAssistantScreen';
import ContactSupportScreen from '../screens/ContactSupportScreen';
import TermsOfServiceScreen from '../screens/TermsOfServiceScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import IconTestScreen from '../screens/IconTestScreen';
import AppearanceSettingsScreen from '../screens/AppearanceSettingsScreen';
import NotificationPreferencesScreen from '../screens/NotificationPreferencesScreen';
import LanguageSelectionScreen from '../screens/LanguageSelectionScreen';
import DownloadPreferencesScreen from '../screens/DownloadPreferencesScreen';
import BetaFeaturesScreen from '../screens/BetaFeaturesScreen';
import TaskActionScreen from '../screens/TaskActionScreen';
import UploadDeliveryScreen from '../screens/UploadDeliveryScreen';
import ScreenCatalogScreen from '../screens/ScreenCatalogScreen';

// Create navigators
const Stack = createStackNavigator<any>();

// Simple placeholder components for missing screens
const PlaceholderScreen = ({ route }: { route: any }) => (
  <View style={styles.placeholderContainer}>
    <Text style={styles.placeholderTitle}>{route.name}</Text>
    <Text style={styles.placeholderText}>Coming soon!</Text>
  </View>
);

// Main Stack Navigator
const AppNavigator = () => {
  const { user, mode, pendingRoute, clearPendingRoute, isLoading } = useAuthStore();

  // Handle post-auth redirect
  useEffect(() => {
    if (user && pendingRoute) {
      // Navigate to the pending route after successful auth
      const { routeName, params } = pendingRoute;
      // Note: In a real implementation, you'd use navigation.navigate(routeName, params)
      // For now, we'll just clear the pending route
      clearPendingRoute();
    }
  }, [user, pendingRoute, clearPendingRoute]);

  // Show loading screen while AuthStore is hydrating
  if (isLoading) {
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
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: COLORS.background },
        } as any}
      >
        {shouldShowAuth ? (
          // Auth Flow - Show landing page first
          <>
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen name="Auth" component={AuthNavigator} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="SignUpPayment" component={SignUpPaymentScreen} />
          </>
        ) : (
          // Main App Flow
          <>
            <Stack.Screen name="MainTabs" component={AppTabs} />
            
            {/* Auth Screens */}
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="SignUpPayment" component={SignUpPaymentScreen} />
            
            {/* Main App Screens */}
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="PostTask" component={PostTaskScreen} />
            <Stack.Screen name="PostTeaser" component={PostTeaserScreen} />
            <Stack.Screen name="MyTasks" component={MyTasksScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            
            {/* Task Related Screens */}
            <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} />
            <Stack.Screen name="TaskPostedConfirmation" component={TaskPostedConfirmation} />
            <Stack.Screen name="TaskAction" component={TaskActionScreen} />
            <Stack.Screen name="UploadDelivery" component={UploadDeliveryScreen} />
            
            {/* Communication Screens */}
            <Stack.Screen name="ChatThread" component={ChatThreadScreen} />
            <Stack.Screen name="Messages" component={MessagesScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            
            {/* Settings and Profile Screens */}
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="AppearanceSettings" component={AppearanceSettingsScreen} />
            <Stack.Screen name="NotificationPreferences" component={NotificationPreferencesScreen} />
            <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
            <Stack.Screen name="DownloadPreferences" component={DownloadPreferencesScreen} />
            <Stack.Screen name="BetaFeatures" component={BetaFeaturesScreen} />
            
            {/* Payment & Wallet Screens */}
            <Stack.Screen name="Payments" component={PaymentsScreen} />
            <Stack.Screen name="AddPaymentMethod" component={AddPaymentMethodScreen} />
            <Stack.Screen name="Wallet" component={WalletScreen} />
            
            {/* Support & Legal Screens */}
            <Stack.Screen name="ContactSupport" component={ContactSupportScreen} />
            <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
            
            {/* AI & Analytics Screens */}
            <Stack.Screen name="AIAssistant" component={AIAssistantScreen} />
            <Stack.Screen name="Analytics" component={AnalyticsScreen} />
            
            {/* Development Screens */}
            <Stack.Screen name="IconTest" component={IconTestScreen} />
            <Stack.Screen name="ScreenCatalog" component={ScreenCatalogScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
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
