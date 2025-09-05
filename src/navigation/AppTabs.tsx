import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../state/AuthProvider';
import { COLORS } from '../constants';
import Icon, { Icons } from '../components/common/Icon';
import { MainTabsParamList } from './types';

// Import stack navigators
import HomeStack from './stacks/HomeStack';
import PostStack from './stacks/PostStack';
import TasksStack from './stacks/TasksStack';
import AIStack from './stacks/AIStack';
import ProfileStack from './stacks/ProfileStack';

const Tab = createBottomTabNavigator<MainTabsParamList>();

// Centralized tab icon configuration
const TAB_ICON: Record<string, { focused: any; default: any }> = {
  HomeStack: { focused: 'home', default: 'home-outline' },
  PostStack: { focused: 'add-circle', default: 'add-circle-outline' },
  TasksStack: { focused: 'briefcase', default: 'briefcase-outline' },
  AIStack: { focused: 'chatbubble-ellipses', default: 'chatbubble-ellipses-outline' },
  ProfileStack: { focused: 'person', default: 'person-outline' },
};

export function AppTabs() {
  const { user, mode } = useAuth();
  
  // TEMP runtime proof - remove later
  console.log("TABS_RUNTIME", ["Home","Post","Tasks","AI","Profile"]);

  return (
    <Tab.Navigator
      testID="app-tabs"
      screenOptions={({ route }) => ({
        headerShown: false, // Hide headers as they're handled by stack navigators
        tabBarShowLabel: true,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          height: 88, // Increased height for better spacing
          paddingTop: 8,
          paddingBottom: 16, // Increased bottom padding for home indicator
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const names = TAB_ICON[route.name];
          const name = focused ? names.focused : names.default;
          return <Ionicons name={name as any} size={24} color={color} />;
        },
        tabBarLabelStyle: {
          fontSize: 11,
          paddingBottom: 4, // Increased padding to avoid clipping
          fontWeight: '500',
        },
        tabBarIconStyle: {
          marginTop: 4, // Add some top margin for better centering
        },
      })}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarTestID: 'tab.home',
        }}
      />
      <Tab.Screen
        name="PostStack"
        component={PostStack}
        options={{
          tabBarLabel: 'Post',
          tabBarTestID: 'tab.post',
        }}
      />
      <Tab.Screen
        name="TasksStack"
        component={TasksStack}
        options={{
          tabBarLabel: 'Tasks',
          tabBarTestID: 'tab.tasks',
        }}
      />
      <Tab.Screen
        name="AIStack"
        component={AIStack}
        options={{
          tabBarLabel: 'AI',
          tabBarTestID: 'tab.ai',
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarTestID: 'tab.profile',
        }}
      />
    </Tab.Navigator>
  );
}
