import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS } from '../../constants';
import { PostStackParamList } from '../../types/navigation';
import { ROUTES } from '../../types/navigation';

// Import screens
import PostTaskScreen from '../../screens/PostTaskScreen';
import TaskPostedConfirmation from '../../screens/TaskPostedConfirmation';

const Stack = createStackNavigator<PostStackParamList>();

const PostStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.POST}
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
        name={ROUTES.POST}
        component={PostTaskScreen}
        options={{
          headerShown: false, // Hide header for full-bleed design
        }}
      />
      <Stack.Screen
        name={ROUTES.TASK_POSTED_CONFIRMATION}
        component={TaskPostedConfirmation}
        options={{
          title: 'Task Posted',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
};

export default PostStack;
