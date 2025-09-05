import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS } from '../../constants';
import { HomeStackParamList } from '../../types/navigation';
import { ROUTES } from '../../types/navigation';

// Import screens
import HomeScreen from '../../screens/HomeScreen';
import TaskDetailsScreen from '../../screens/TaskDetailsScreen';
import ChatThreadScreen from '../../screens/ChatThreadScreen';
import NotificationsScreen from '../../screens/NotificationsScreen';
import MessagesScreen from '../../screens/MessagesScreen';
import NavigationTestScreen from '../../screens/NavigationTestScreen';

const Stack = createStackNavigator<HomeStackParamList>();

const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.HOME}
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
        name={ROUTES.HOME}
        component={HomeScreen}
        options={{
          headerShown: false, // Hide header for full-bleed design
        }}
      />
      <Stack.Screen
        name={ROUTES.TASK_DETAILS}
        component={TaskDetailsScreen}
        options={({ route }) => ({
          title: 'Task Details',
          headerBackTitle: 'Back',
        })}
      />
      <Stack.Screen
        name={ROUTES.CHAT_THREAD}
        component={ChatThreadScreen}
        options={({ route }) => ({
          title: 'Chat',
          headerBackTitle: 'Back',
        })}
      />
      <Stack.Screen
        name={ROUTES.NOTIFICATIONS}
        component={NotificationsScreen}
        options={{
          title: 'Notifications',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name={ROUTES.MESSAGES}
        component={MessagesScreen}
        options={{
          title: 'Messages',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name={ROUTES.NAVIGATION_TEST}
        component={NavigationTestScreen}
        options={{
          title: 'Navigation Test',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
