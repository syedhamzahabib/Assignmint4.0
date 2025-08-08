import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS } from '../constants';
import { AuthStackParamList } from '../types/navigation';
import { ROUTES } from '../types/navigation';

// Import auth screens
import LandingScreen from '../screens/LandingScreen';
import SignUpScreen from '../screens/SignUpScreen';
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import SignUpPaymentScreen from '../screens/SignUpPaymentScreen';

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.LANDING}
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
        name={ROUTES.LANDING}
        component={LandingScreen}
        options={{
          headerShown: false, // Hide header for full-bleed design
        }}
      />
      <Stack.Screen
        name={ROUTES.SIGN_UP}
        component={SignUpScreen}
        options={{
          title: 'Sign Up',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name={ROUTES.LOGIN}
        component={LoginScreen}
        options={{
          title: 'Login',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name={ROUTES.FORGOT_PASSWORD}
        component={ForgotPasswordScreen}
        options={{
          title: 'Forgot Password',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name={ROUTES.SIGN_UP_PAYMENT}
        component={SignUpPaymentScreen}
        options={{
          title: 'Payment Setup',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
