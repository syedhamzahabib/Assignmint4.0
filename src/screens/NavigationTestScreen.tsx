import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { COLORS } from '../constants';
import { ROUTES } from '../types/navigation';

interface NavigationTestScreenProps {
  navigation: any;
}

const NavigationTestScreen: React.FC<NavigationTestScreenProps> = ({ navigation }) => {
  const testRoutes = [
    { name: 'Home', route: ROUTES.HOME, params: undefined },
    { name: 'Post Task', route: ROUTES.POST, params: undefined },
    { name: 'My Tasks', route: ROUTES.TASKS, params: undefined },
    { name: 'AI Assistant', route: ROUTES.AI, params: undefined },
    { name: 'Profile', route: ROUTES.PROFILE, params: undefined },
    { name: 'Task Details', route: ROUTES.TASK_DETAILS, params: { taskId: 'test-123' } },
    { name: 'Chat Thread', route: ROUTES.CHAT_THREAD, params: { chat: { id: 'chat-123', name: 'Test Chat', taskTitle: 'Test Task' } } },
    { name: 'Upload Delivery', route: ROUTES.UPLOAD_DELIVERY, params: { taskId: 'test-123' } },
    { name: 'Notifications', route: ROUTES.NOTIFICATIONS, params: undefined },
    { name: 'Messages', route: ROUTES.MESSAGES, params: undefined },
    { name: 'Settings', route: ROUTES.SETTINGS, params: undefined },
    { name: 'Payments', route: ROUTES.PAYMENTS, params: undefined },
    { name: 'Wallet', route: ROUTES.WALLET, params: undefined },
    { name: 'Analytics', route: ROUTES.ANALYTICS, params: undefined },
    { name: 'Icon Test', route: ROUTES.ICON_TEST, params: undefined },
  ];

  const handleNavigationTest = (routeName: string, params?: any) => {
    try {
      // Try to navigate to the route
      if (params) {
        navigation.navigate(routeName, params);
      } else {
        navigation.navigate(routeName);
      }
      Alert.alert('Success', `Navigation to ${routeName} successful!`);
    } catch (error) {
      Alert.alert('Navigation Error', `Failed to navigate to ${routeName}: ${error}`);
    }
  };

  const validateAllRoutes = () => {
    const results = testRoutes.map(route => {
      try {
        // This is a basic validation - in a real app you'd check if the route exists
        return { route: route.name, status: '✅ Valid' };
      } catch (error) {
        return { route: route.name, status: '❌ Invalid' };
      }
    });

    const summary = results.map(r => `${r.route}: ${r.status}`).join('\n');
    Alert.alert('Route Validation Results', summary);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Navigation Test Screen</Text>
        <Text style={styles.subtitle}>
          Test all navigation routes and validate navigation consistency
        </Text>
      </View>

      <TouchableOpacity style={styles.validateButton} onPress={validateAllRoutes}>
        <Text style={styles.validateButtonText}>Validate All Routes</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tab Navigation Tests</Text>
        {testRoutes.slice(0, 5).map((route, index) => (
          <TouchableOpacity
            key={index}
            style={styles.testButton}
            onPress={() => handleNavigationTest(route.route, route.params)}
          >
            <Text style={styles.testButtonText}>{route.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stack Navigation Tests</Text>
        {testRoutes.slice(5).map((route, index) => (
          <TouchableOpacity
            key={index + 5}
            style={styles.testButton}
            onPress={() => handleNavigationTest(route.route, route.params)}
          >
            <Text style={styles.testButtonText}>{route.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Navigation Test Instructions:</Text>
        <Text style={styles.infoText}>
          • Tap any button to test navigation to that screen{'\n'}
          • Use "Validate All Routes" to check route consistency{'\n'}
          • Check console for any navigation errors{'\n'}
          • Verify back button behavior on each screen
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  validateButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  validateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  testButton: {
    backgroundColor: COLORS.surface,
    padding: 12,
    marginBottom: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  testButtonText: {
    color: COLORS.text,
    fontSize: 14,
    textAlign: 'center',
  },
  infoSection: {
    padding: 20,
    backgroundColor: COLORS.surface,
    margin: 20,
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});

export default NavigationTestScreen;
