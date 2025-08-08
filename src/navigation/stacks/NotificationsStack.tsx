import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS } from '../../constants';
import { NotificationsStackParamList } from '../../types/navigation';
import { ROUTES } from '../../types/navigation';

// Import screens
import NotificationsScreen from '../../screens/NotificationsScreen';
import TaskDetailsScreen from '../../screens/TaskDetailsScreen';

const Stack = createStackNavigator<NotificationsStackParamList>();

const NotificationsStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.NOTIFICATIONS}
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
        name={ROUTES.NOTIFICATIONS}
        component={NotificationsScreen}
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
    </Stack.Navigator>
  );
};

export default NotificationsStack;
