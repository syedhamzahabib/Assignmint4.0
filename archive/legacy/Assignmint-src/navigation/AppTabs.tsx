import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants';
import { useAuthStore } from '../services/AuthStore';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import PostTaskScreen from '../screens/PostTaskScreen';
import PostTeaserScreen from '../screens/PostTeaserScreen';
import MyTasksScreen from '../screens/MyTasksScreen';
import AIAssistantScreen from '../screens/AIAssistantScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

// Centralized tab icon configuration
const TAB_ICON: Record<string, { focused: any; default: any }> = {
  Home: { focused: 'home', default: 'home-outline' },
  Post: { focused: 'add-circle', default: 'add-circle-outline' },
  MyTasks: { focused: 'briefcase', default: 'briefcase-outline' },
  Chat: { focused: 'chatbubble', default: 'chatbubble-outline' },
  Profile: { focused: 'person', default: 'person-outline' },
};

// Conditional Post Screen Component
const PostScreenWrapper = ({ navigation }: { navigation: any }) => {
  const { user, mode } = useAuthStore();

  // Show PostTeaserScreen for guests, PostTaskScreen for users
  if (user || mode === 'user') {
    return <PostTaskScreen navigation={navigation} />;
  } else {
    return <PostTeaserScreen navigation={navigation} />;
  }
};

// Create a proper component for the Post tab
const PostTabScreen = ({ navigation }: { navigation: any }) => {
  return <PostScreenWrapper navigation={navigation} />;
};

export function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
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
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Post"
        component={PostTabScreen}
        options={{
          tabBarLabel: 'Post',
        }}
      />
      <Tab.Screen
        name="MyTasks"
        component={MyTasksScreen}
        options={{
          tabBarLabel: 'My Tasks',
        }}
      />
      <Tab.Screen
        name="Chat"
        component={AIAssistantScreen}
        options={{
          tabBarLabel: 'Chat',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}
