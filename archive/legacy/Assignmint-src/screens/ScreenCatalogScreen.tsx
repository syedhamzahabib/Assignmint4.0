import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon, { Icons } from '../components/common/Icon';
import { COLORS } from '../constants';

interface ScreenItem {
  name: string;
  description: string;
  category: string;
  route: string;
  params?: any;
}

const ScreenCatalogScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const screens: ScreenItem[] = [
    // Auth Screens
    { name: 'Landing', description: 'Welcome screen for new users', category: 'Auth', route: 'Landing' },
    { name: 'SignUp', description: 'User registration screen', category: 'Auth', route: 'SignUp' },
    { name: 'Login', description: 'User login screen', category: 'Auth', route: 'Login' },
    { name: 'ForgotPassword', description: 'Password recovery screen', category: 'Auth', route: 'ForgotPassword' },
    { name: 'SignUpPayment', description: 'Payment setup during signup', category: 'Auth', route: 'SignUpPayment' },

    // Main App Screens
    { name: 'Home', description: 'Main feed screen', category: 'Main', route: 'Home' },
    { name: 'PostTask', description: 'Create new task screen', category: 'Main', route: 'PostTask' },
    { name: 'PostTeaser', description: 'Guest task posting teaser', category: 'Main', route: 'PostTeaser' },
    { name: 'MyTasks', description: 'User\'s tasks management', category: 'Main', route: 'MyTasks' },
    { name: 'Chat', description: 'Main chat interface', category: 'Main', route: 'Chat' },
    { name: 'Profile', description: 'User profile screen', category: 'Main', route: 'Profile' },

    // Task Related Screens
    { name: 'TaskDetails', description: 'Detailed task view', category: 'Tasks', route: 'TaskDetails', params: { taskId: '1' } },
    { name: 'TaskPostedConfirmation', description: 'Task posted confirmation', category: 'Tasks', route: 'TaskPostedConfirmation' },
    { name: 'TaskAction', description: 'Task action screen', category: 'Tasks', route: 'TaskAction' },
    { name: 'UploadDelivery', description: 'Upload delivery screen', category: 'Tasks', route: 'UploadDelivery' },

    // Communication Screens
    { name: 'ChatThread', description: 'Individual chat conversation', category: 'Communication', route: 'ChatThread', params: { chat: { id: '1', name: 'Test User', taskTitle: 'Test Task' } } },
    { name: 'Messages', description: 'Messages list screen', category: 'Communication', route: 'Messages' },
    { name: 'Notifications', description: 'Notifications screen', category: 'Communication', route: 'Notifications' },

    // Settings & Profile Screens
    { name: 'Settings', description: 'App settings screen', category: 'Settings', route: 'Settings' },
    { name: 'AppearanceSettings', description: 'Appearance customization', category: 'Settings', route: 'AppearanceSettings' },
    { name: 'NotificationPreferences', description: 'Notification settings', category: 'Settings', route: 'NotificationPreferences' },
    { name: 'LanguageSelection', description: 'Language selection screen', category: 'Settings', route: 'LanguageSelection' },
    { name: 'DownloadPreferences', description: 'Download settings', category: 'Settings', route: 'DownloadPreferences' },
    { name: 'BetaFeatures', description: 'Beta features screen', category: 'Settings', route: 'BetaFeatures' },

    // Payment & Wallet Screens
    { name: 'Payments', description: 'Payment methods screen', category: 'Payments', route: 'Payments' },
    { name: 'AddPaymentMethod', description: 'Add payment method', category: 'Payments', route: 'AddPaymentMethod' },
    { name: 'Wallet', description: 'Wallet screen', category: 'Payments', route: 'Wallet' },

    // Support & Legal Screens
    { name: 'ContactSupport', description: 'Contact support screen', category: 'Support', route: 'ContactSupport' },
    { name: 'TermsOfService', description: 'Terms of service', category: 'Support', route: 'TermsOfService' },
    { name: 'PrivacyPolicy', description: 'Privacy policy screen', category: 'Support', route: 'PrivacyPolicy' },

    // AI & Analytics Screens
    { name: 'AIAssistant', description: 'AI assistant screen', category: 'AI', route: 'AIAssistant' },
    { name: 'Analytics', description: 'Analytics dashboard', category: 'AI', route: 'Analytics' },

    // Development Screens
    { name: 'IconTest', description: 'Icon testing screen', category: 'Development', route: 'IconTest' },
  ];

  const categories = [...new Set(screens.map(screen => screen.category))];

  const handleScreenPress = (screen: ScreenItem) => {
    if (screen.params) {
      navigation.navigate(screen.route, screen.params);
    } else {
      navigation.navigate(screen.route);
    }
  };

  const renderScreenItem = (screen: ScreenItem) => (
    <TouchableOpacity
      key={screen.name}
      style={styles.screenItem}
      onPress={() => handleScreenPress(screen)}
    >
      <View style={styles.screenInfo}>
        <Text style={styles.screenName}>{screen.name}</Text>
        <Text style={styles.screenDescription}>{screen.description}</Text>
      </View>
      <Icon name={Icons['arrow-forward']} size={20} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );

  const renderCategory = (category: string) => {
    const categoryScreens = screens.filter(screen => screen.category === category);

    return (
      <View key={category} style={styles.categorySection}>
        <Text style={styles.categoryTitle}>{category}</Text>
        <View style={styles.categoryContent}>
          {categoryScreens.map(renderScreenItem)}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name={Icons.arrowBack} size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Screen Catalog</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.introSection}>
          <Icon name={Icons.apps} size={48} color={COLORS.primary} />
          <Text style={styles.introTitle}>Screen Catalog</Text>
          <Text style={styles.introDescription}>
            Browse and test all available screens in the app. Tap any screen to navigate to it.
          </Text>
        </View>

        {/* Categories */}
        {categories.map(renderCategory)}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  introSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  introDescription: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  categoryContent: {
    paddingHorizontal: 20,
  },
  screenItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 16,
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  screenInfo: {
    flex: 1,
  },
  screenName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  screenDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});

export default ScreenCatalogScreen;
