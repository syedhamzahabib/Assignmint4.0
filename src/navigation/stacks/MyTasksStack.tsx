import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS } from '../../constants';
import { MyTasksStackParamList } from '../../types/navigation';
import { ROUTES } from '../../types/navigation';

// Import screens
import MyTasksScreen from '../../screens/MyTasksScreen';
import TaskDetailsScreen from '../../screens/TaskDetailsScreen';
import UploadDeliveryScreen from '../../screens/UploadDeliveryScreen';
import ChatScreen from '../../screens/ChatScreen';

const Stack = createStackNavigator<MyTasksStackParamList>();

const MyTasksStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.MY_TASKS}
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
        name={ROUTES.MY_TASKS}
        component={MyTasksScreen}
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
        name={ROUTES.UPLOAD_DELIVERY}
        component={UploadDeliveryScreen}
        options={({ route }) => ({
          title: 'Upload Delivery',
          headerBackTitle: 'Back',
        })}
      />
      <Stack.Screen
        name={ROUTES.CHAT}
        component={ChatScreen}
        options={({ route }) => ({
          title: 'Chat',
          headerBackTitle: 'Back',
        })}
      />
    </Stack.Navigator>
  );
};

export default MyTasksStack;
