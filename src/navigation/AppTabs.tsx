import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants';
import { useAuthStore } from '../services/AuthStore';
import { MainTabsParamList } from '../types/navigation';
import { ROUTES } from '../types/navigation';

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
  const { user, mode } = useAuthStore();

  return (
    <Tab.Navigator
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
        }}
      />
      <Tab.Screen 
        name="PostStack" 
        component={PostStack}
        options={{
          tabBarLabel: 'Post',
        }}
      />
      <Tab.Screen 
        name="TasksStack" 
        component={TasksStack}
        options={{
          tabBarLabel: 'Tasks',
        }}
      />
      <Tab.Screen 
        name="AIStack" 
        component={AIStack}
        options={{
          tabBarLabel: 'AI',
        }}
      />
      <Tab.Screen 
        name="ProfileStack" 
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}
