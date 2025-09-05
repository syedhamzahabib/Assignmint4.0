import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS } from '../../constants';
import { AIStackParamList } from '../../types/navigation';
import { ROUTES } from '../../types/navigation';

// Import screens
import AIAssistantScreen from '../../screens/AIAssistantScreen';

const Stack = createStackNavigator<AIStackParamList>();

const AIStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.AI}
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
        name={ROUTES.AI}
        component={AIAssistantScreen}
        options={{
          headerShown: false, // Hide header for full-bleed design
        }}
      />
    </Stack.Navigator>
  );
};

export default AIStack;












