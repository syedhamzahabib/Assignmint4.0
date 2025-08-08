import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { COLORS, FONTS, SPACING, SCREEN_NAMES } from '../../constants';

interface TabBarItemProps {
  icon: string;
  label: string;
  isActive: boolean;
  onPress: () => void;
  badgeCount?: number;
  disabled?: boolean;
}

const TabBarItem: React.FC<TabBarItemProps> = ({ 
  icon, 
  label, 
  isActive, 
  onPress, 
  badgeCount = 0,
  disabled = false 
}) => (
  <TouchableOpacity
    style={[
      styles.tabBarItem,
      isActive && styles.activeTabBarItem,
      disabled && styles.disabledTabBarItem
    ]}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.7}
  >
    <View style={styles.tabBarIconContainer}>
      <Text style={[
        styles.tabBarIcon,
        isActive && styles.activeTabBarIcon
      ]}>
        {icon}
      </Text>
      
      {badgeCount > 0 && (
        <View style={styles.notificationBadge}>
          <Text style={styles.notificationBadgeText}>
            {badgeCount > 99 ? '99+' : badgeCount}
          </Text>
        </View>
      )}
    </View>
    
    <Text style={[
      styles.tabBarLabel,
      isActive && styles.activeTabBarLabel,
      disabled && styles.disabledTabBarLabel
    ]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const TabBar: React.FC<BottomTabBarProps> = ({ 
  state, 
  descriptors, 
  navigation 
}) => {
  console.log('🔍 TabBar rendering with state:', state);
  console.log('🔍 TabBar routes:', state?.routes);
  console.log('🔍 TabBar current index:', state?.index);

  // Define default tabs that should always be available using SCREEN_NAMES
  const defaultTabs = [
    {
      key: SCREEN_NAMES.HOME,
      icon: '🏠',
      label: 'Home',
    },
    {
      key: SCREEN_NAMES.POST_TASK,
      icon: '➕',
      label: 'Post',
    },
    {
      key: SCREEN_NAMES.MY_TASKS,
      icon: '📋',
      label: 'My Tasks',
    },
    {
      key: SCREEN_NAMES.NOTIFICATIONS,
      icon: '🔔',
      label: 'Notifications',
    },
    {
      key: SCREEN_NAMES.PROFILE,
      icon: '👤',
      label: 'Profile',
    },
  ];

  // Check if navigation is available and state is properly initialized
  const isNavigationReady = navigation && state && state.routes && state.routes.length > 0;

  // If state is not available yet, render default tabs
  if (!isNavigationReady) {
    console.log('⚠️ TabBar: No routes available or navigation not ready, rendering default tabs');
    return (
      <View style={styles.tabBar}>
        {defaultTabs.map((tab, index) => (
          <TabBarItem
            key={tab.key}
            icon={tab.icon}
            label={tab.label}
            isActive={index === 0} // Default to first tab active
            onPress={() => {
              console.log(`🔍 Default tab pressed: ${tab.key}`);
              // Only try to navigate if navigation is available
              if (navigation) {
                try {
                  navigation.navigate(tab.key);
                } catch (error) {
                  console.log(`⚠️ Navigation failed for ${tab.key}:`, error);
                }
              } else {
                console.log(`⚠️ Navigation not available for ${tab.key}`);
              }
            }}
            badgeCount={tab.key === SCREEN_NAMES.NOTIFICATIONS ? 3 : 0}
          />
        ))}
      </View>
    );
  }

  // Use actual routes from navigation state
  const renderedTabs = state.routes.map((route, index) => {
    const { options } = descriptors[route.key];
    const isFocused = state.index === index;
    const tab = defaultTabs.find(t => t.key === route.name);

    console.log(`🔍 Tab ${index}: route.name=${route.name}, isFocused=${isFocused}, tab found=${!!tab}`);

    const onPress = () => {
      console.log(`🔍 Tab pressed: ${route.name}`);
      
      // Check if navigation is available before attempting to navigate
      if (!navigation) {
        console.log(`⚠️ Navigation not available for ${route.name}`);
        return;
      }

      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        try {
          // If we're on a stack screen (like TaskDetails), navigate to MainTabs first
          // then to the specific tab
          if (navigation.getState()?.routes?.length > 1) {
            // We're on a stack screen, navigate back to MainTabs first
            navigation.navigate('MainTabs', { screen: route.name });
          } else {
            // We're already on a tab screen, navigate normally
            navigation.navigate(route.name);
          }
        } catch (error) {
          console.log(`⚠️ Navigation failed for ${route.name}:`, error);
          // Fallback: try to navigate to MainTabs
          try {
            navigation.navigate('MainTabs', { screen: route.name });
          } catch (fallbackError) {
            console.log(`⚠️ Fallback navigation also failed for ${route.name}:`, fallbackError);
          }
        }
      }
    };

    if (!tab) {
      console.log(`⚠️ No tab found for route: ${route.name}`);
      return null;
    }

    return (
      <TabBarItem
        key={route.key}
        icon={tab.icon}
        label={tab.label}
        isActive={isFocused}
        onPress={onPress}
        badgeCount={route.name === SCREEN_NAMES.NOTIFICATIONS ? 3 : 0}
      />
    );
  }).filter(Boolean);

  // If no tabs were rendered from routes, fall back to default tabs
  if (renderedTabs.length === 0) {
    console.log('⚠️ TabBar: No tabs rendered from routes, using default tabs');
    return (
      <View style={styles.tabBar}>
        {defaultTabs.map((tab, index) => (
          <TabBarItem
            key={tab.key}
            icon={tab.icon}
            label={tab.label}
            isActive={index === 0}
            onPress={() => {
              console.log(`🔍 Fallback tab pressed: ${tab.key}`);
              if (navigation) {
                try {
                  // If we're on a stack screen, navigate to MainTabs first
                  if (navigation.getState()?.routes?.length > 1) {
                    navigation.navigate('MainTabs', { screen: tab.key });
                  } else {
                    navigation.navigate(tab.key);
                  }
                } catch (error) {
                  console.log(`⚠️ Navigation failed for ${tab.key}:`, error);
                  // Fallback: try to navigate to MainTabs
                  try {
                    navigation.navigate('MainTabs', { screen: tab.key });
                  } catch (fallbackError) {
                    console.log(`⚠️ Fallback navigation also failed for ${tab.key}:`, fallbackError);
                  }
                }
              } else {
                console.log(`⚠️ Navigation not available for ${tab.key}`);
              }
            }}
            badgeCount={tab.key === SCREEN_NAMES.NOTIFICATIONS ? 3 : 0}
          />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.tabBar}>
      {renderedTabs}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
    paddingBottom: SPACING.sm,
    paddingTop: SPACING.sm,
    height: 80,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tabBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs,
  },
  activeTabBarItem: {
    // Active state styling
  },
  disabledTabBarItem: {
    opacity: 0.5,
  },
  tabBarIconContainer: {
    position: 'relative',
    marginBottom: SPACING.xs,
  },
  tabBarIcon: {
    fontSize: FONTS.sizes.xl,
    color: COLORS.gray500,
  },
  activeTabBarIcon: {
    color: COLORS.primary,
  },
  tabBarLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.gray500,
    fontWeight: '500',
  },
  activeTabBarLabel: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  disabledTabBarLabel: {
    color: COLORS.gray400,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
  },
});

export default TabBar; 