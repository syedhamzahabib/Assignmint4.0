import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../constants';
import { ROUTES } from '../types/navigation';

// Screen Catalog for development
const ScreenCatalog = () => {
  const navigation = useNavigation<any>();

  // Group screens by category
  const screenCategories = {
    'Auth Screens': [
      { name: ROUTES.LANDING, description: 'Landing/Welcome screen' },
      { name: ROUTES.SIGN_UP, description: 'User registration' },
      { name: ROUTES.LOGIN, description: 'User login' },
      { name: ROUTES.FORGOT_PASSWORD, description: 'Password recovery' },
      { name: ROUTES.SIGN_UP_PAYMENT, description: 'Payment setup during signup' },
    ],
    'Main Tabs': [
      { name: ROUTES.MAIN_TABS, description: 'Bottom tab navigation' },
    ],
    'Home Stack': [
      { name: ROUTES.HOME, description: 'Home/Feed screen' },
      { name: ROUTES.TASK_DETAILS, description: 'Task details view' },
      { name: ROUTES.CHAT, description: 'Chat with task participants' },
    ],
    'Post Stack': [
      { name: ROUTES.POST_STEP_1, description: 'Post task step 1' },
      { name: ROUTES.POST_STEP_2, description: 'Post task step 2' },
      { name: ROUTES.POST_STEP_3, description: 'Post task step 3' },
      { name: ROUTES.POST_STEP_4, description: 'Post task step 4' },
      { name: ROUTES.POST_STEP_5, description: 'Post task step 5' },
      { name: ROUTES.POST_REVIEW, description: 'Post task review' },
    ],
    'MyTasks Stack': [
      { name: ROUTES.MY_TASKS, description: 'My tasks list' },
      { name: ROUTES.UPLOAD_DELIVERY, description: 'Upload delivery for task' },
    ],
    'Notifications Stack': [
      { name: ROUTES.NOTIFICATIONS, description: 'Notifications list' },
    ],
    'Profile Stack': [
      { name: ROUTES.PROFILE, description: 'User profile' },
      { name: ROUTES.SETTINGS, description: 'App settings' },
      { name: ROUTES.PAYMENTS, description: 'Payment methods' },
      { name: ROUTES.ADD_PAYMENT_METHOD, description: 'Add payment method' },
      { name: ROUTES.WALLET, description: 'Wallet/balance' },
      { name: ROUTES.APPEARANCE_SETTINGS, description: 'Appearance settings' },
      { name: ROUTES.NOTIFICATION_PREFERENCES, description: 'Notification preferences' },
      { name: ROUTES.LANGUAGE_SELECTION, description: 'Language selection' },
      { name: ROUTES.DOWNLOAD_PREFERENCES, description: 'Download preferences' },
      { name: ROUTES.BETA_FEATURES, description: 'Beta features' },
      { name: ROUTES.CONTACT_SUPPORT, description: 'Contact support' },
      { name: ROUTES.TERMS_OF_SERVICE, description: 'Terms of service' },
      { name: ROUTES.PRIVACY_POLICY, description: 'Privacy policy' },
      { name: ROUTES.AI_ASSISTANT, description: 'AI assistant' },
      { name: ROUTES.ANALYTICS, description: 'Analytics dashboard' },
    ],
  };

  const handleScreenPress = (screenName: string) => {
    try {
      // For screens that require parameters, provide mock data
      const params = getMockParams(screenName);
      navigation.navigate(screenName, params);
    } catch (error) {
      Alert.alert(
        'Navigation Error',
        `Could not navigate to ${screenName}: ${error}`,
        [{ text: 'OK' }]
      );
    }
  };

  const getMockParams = (screenName: string) => {
    switch (screenName) {
      case ROUTES.TASK_DETAILS:
        return { taskId: 'mock-task-id', task: { id: 'mock-task-id', title: 'Mock Task' } };
      case ROUTES.CHAT:
        return { taskId: 'mock-task-id', task: { id: 'mock-task-id', title: 'Mock Task' } };
      case ROUTES.UPLOAD_DELIVERY:
        return { taskId: 'mock-task-id', task: { id: 'mock-task-id', title: 'Mock Task' } };
      case ROUTES.POST_STEP_2:
      case ROUTES.POST_STEP_3:
      case ROUTES.POST_STEP_4:
      case ROUTES.POST_STEP_5:
      case ROUTES.POST_REVIEW:
        return { taskData: { title: 'Mock Task', description: 'Mock description' } };
      default:
        return undefined;
    }
  };

  const renderScreenItem = (screen: { name: string; description: string }) => (
    <TouchableOpacity
      key={screen.name}
      style={styles.screenItem}
      onPress={() => handleScreenPress(screen.name)}
    >
      <Text style={styles.screenName}>{screen.name}</Text>
      <Text style={styles.screenDescription}>{screen.description}</Text>
    </TouchableOpacity>
  );

  const renderCategory = (category: string, screens: { name: string; description: string }[]) => (
    <View key={category} style={styles.category}>
      <Text style={styles.categoryTitle}>{category}</Text>
      {screens.map(renderScreenItem)}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Screen Catalog</Text>
        <Text style={styles.subtitle}>Development Navigation Tool</Text>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {Object.entries(screenCategories).map(([category, screens]) =>
          renderCategory(category, screens)
        )}
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
    padding: 20,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  category: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.primary,
    marginHorizontal: 20,
    marginBottom: 12,
    marginTop: 16,
  },
  screenItem: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 20,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  screenName: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.text,
    marginBottom: 4,
  },
  screenDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});

export default ScreenCatalog;
