import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS } from '../../constants';
import { TasksStackParamList, ROUTES } from '../types';

// Import screens
import MyTasksScreen from '../../screens/MyTasksScreen';
import TaskDetailsScreen from '../../screens/TaskDetailsScreen';
import UploadDeliveryScreen from '../../screens/UploadDeliveryScreen';
import ChatThreadScreen from '../../screens/ChatThreadScreen';

const Stack = createStackNavigator<TasksStackParamList>();

const TasksStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.TASKS}
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
        name={ROUTES.TASKS}
        component={MyTasksScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={ROUTES.TASK_DETAILS}
        component={TaskDetailsScreen}
        options={{
          title: 'Task Details',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name={ROUTES.UPLOAD_DELIVERY}
        component={UploadDeliveryScreen}
        options={{
          title: 'Upload Delivery',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name={ROUTES.CHAT_THREAD}
        component={ChatThreadScreen}
        options={{
          title: 'Chat',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
};

export default TasksStack;
