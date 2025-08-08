// src/components/common/TabBar.js
// Reusable bottom tab bar component

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../../constants';

const TabBarItem = ({ 
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

const TabBar = ({ 
  activeTab, 
  onTabPress, 
  unreadNotifications = 0,
  showWallet = false,
  style 
}) => {
  const tabs = [
    {
      id: 'home',
      icon: '🏠',
      label: 'Home',
    },
    {
      id: 'post',
      icon: '➕',
      label: 'Post',
    },
    {
      id: 'tasks',
      icon: '📋',
      label: 'My Tasks',
    },
    {
      id: 'notifications',
      icon: '🔔',
      label: 'Notifications',
      badgeCount: unreadNotifications,
    },
    {
      id: 'profile',
      icon: '👤',
      label: 'Profile',
    },
  ];

  // Don't show tab bar when wallet is open
  if (showWallet) {
    return null;
  }

  return (
    <View style={[styles.tabBar, style]}>
      {tabs.map((tab) => (
        <TabBarItem
          key={tab.id}
          icon={tab.icon}
          label={tab.label}
          isActive={activeTab === tab.id}
          onPress={() => onTabPress(tab.id)}
          badgeCount={tab.badgeCount}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
    paddingBottom: SPACING.xs,
    paddingTop: SPACING.sm,
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
    elevation: 8,
  },
  tabBarItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },
  activeTabBarItem: {
    // Add any specific styling for active tab if needed
  },
  disabledTabBarItem: {
    opacity: 0.5,
  },
  tabBarIconContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  tabBarIcon: {
    fontSize: 24,
    color: COLORS.gray500,
  },
  activeTabBarIcon: {
    color: COLORS.primary,
  },
  tabBarLabel: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.medium,
    color: COLORS.gray600,
    textAlign: 'center',
  },
  activeTabBarLabel: {
    color: COLORS.primary,
    fontWeight: FONTS.weights.semiBold,
  },
  disabledTabBarLabel: {
    color: COLORS.gray400,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -6,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  notificationBadgeText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
    textAlign: 'center',
  },
});

export default TabBar;