import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS } from '../../constants';
import { PostStackParamList } from '../../types/navigation';
import { ROUTES } from '../../types/navigation';

// Import PostTaskSteps screens
import StepOne from '../../screens/PostTaskSteps/StepOne';
import StepTwo from '../../screens/PostTaskSteps/StepTwo';
import StepThree from '../../screens/PostTaskSteps/StepThree';
import StepFour from '../../screens/PostTaskSteps/StepFour';
import StepFive from '../../screens/PostTaskSteps/StepFive';

// Import PostTaskScreen for review
import PostTaskScreen from '../../screens/PostTaskScreen';

// Import main PostScreen
import PostScreen from '../../screens/PostScreen';

const Stack = createStackNavigator<PostStackParamList>();

const PostStack = () => {


  return (
    <Stack.Navigator
      initialRouteName="Post"
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
        name="Post"
        component={PostScreen}
        options={{
          title: 'Post Task',
          headerShown: false, // Hide header for full-bleed design
        }}
      />
      <Stack.Screen
        name={ROUTES.POST_STEP_1}
        component={StepOne}
        options={{
          title: 'Post Task',
          headerShown: false, // Hide header for full-bleed design
        }}
      />
      <Stack.Screen
        name={ROUTES.POST_STEP_2}
        component={StepTwo}
        options={{
          title: 'Task Details',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name={ROUTES.POST_STEP_3}
        component={StepThree}
        options={{
          title: 'Requirements',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name={ROUTES.POST_STEP_4}
        component={StepFour}
        options={{
          title: 'Budget & Timeline',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name={ROUTES.POST_STEP_5}
        component={StepFive}
        options={{
          title: 'Review & Submit',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name={ROUTES.POST_REVIEW}
        component={PostTaskScreen}
        options={{
          title: 'Review Task',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
};

export default PostStack;
