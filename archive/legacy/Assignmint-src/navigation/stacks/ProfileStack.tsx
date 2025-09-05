import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS } from '../../constants';
import { ProfileStackParamList } from '../../types/navigation';
import { ROUTES } from '../../types/navigation';

// Import screens
import ProfileScreen from '../../screens/ProfileScreen';
import SettingsScreen from '../../screens/SettingsScreen';
import PaymentsScreen from '../../screens/PaymentsScreen';
import AddPaymentMethodScreen from '../../screens/AddPaymentMethodScreen';
import WalletScreen from '../../screens/WalletScreen';
import AppearanceSettingsScreen from '../../screens/AppearanceSettingsScreen';
import NotificationPreferencesScreen from '../../screens/NotificationPreferencesScreen';
import LanguageSelectionScreen from '../../screens/LanguageSelectionScreen';
import DownloadPreferencesScreen from '../../screens/DownloadPreferencesScreen';
import BetaFeaturesScreen from '../../screens/BetaFeaturesScreen';
import ContactSupportScreen from '../../screens/ContactSupportScreen';
import TermsOfServiceScreen from '../../screens/TermsOfServiceScreen';
import PrivacyPolicyScreen from '../../screens/PrivacyPolicyScreen';
import AIAssistantScreen from '../../screens/AIAssistantScreen';
import AnalyticsScreen from '../../screens/AnalyticsScreen';
import SystemStatusScreen from '../../screens/Dev/SystemStatusScreen';

const Stack = createStackNavigator<ProfileStackParamList>();

const ProfileStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.PROFILE}
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.surface,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: COLORS.text,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        cardStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen
        name={ROUTES.PROFILE}
        component={ProfileScreen}
        options={{
          headerShown: false, // Hide header for full-bleed design
        }}
      />
      <Stack.Screen
        name={ROUTES.SETTINGS}
        component={SettingsScreen}
        options={{
          title: 'Settings',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name={ROUTES.PAYMENTS}
        component={PaymentsScreen}
        options={{
          title: 'Payment Methods',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name={ROUTES.ADD_PAYMENT_METHOD}
        component={AddPaymentMethodScreen}
        options={{
          title: 'Add Payment Method',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name={ROUTES.WALLET}
        component={WalletScreen}
        options={{
          title: 'Wallet',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name={ROUTES.APPEARANCE_SETTINGS}
        component={AppearanceSettingsScreen}
        options={{
          title: 'Appearance',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name={ROUTES.NOTIFICATION_PREFERENCES}
        component={NotificationPreferencesScreen}
        options={{
          title: 'Notifications',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name={ROUTES.LANGUAGE_SELECTION}
        component={LanguageSelectionScreen}
        options={{
          title: 'Language',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name={ROUTES.DOWNLOAD_PREFERENCES}
        component={DownloadPreferencesScreen}
        options={{
          title: 'Downloads',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name={ROUTES.BETA_FEATURES}
        component={BetaFeaturesScreen}
        options={{
          title: 'Beta Features',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name={ROUTES.CONTACT_SUPPORT}
        component={ContactSupportScreen}
        options={{
          title: 'Contact Support',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name={ROUTES.TERMS_OF_SERVICE}
        component={TermsOfServiceScreen}
        options={{
          title: 'Terms of Service',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name={ROUTES.PRIVACY_POLICY}
        component={PrivacyPolicyScreen}
        options={{
          title: 'Privacy Policy',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name={ROUTES.AI_ASSISTANT}
        component={AIAssistantScreen}
        options={{
          title: 'AI Assistant',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name={ROUTES.ANALYTICS}
        component={AnalyticsScreen}
        options={{
          title: 'Analytics',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name={ROUTES.SYSTEM_STATUS}
        component={SystemStatusScreen}
        options={{
          title: 'System Status',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;
