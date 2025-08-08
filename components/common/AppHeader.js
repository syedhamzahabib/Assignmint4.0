// components/common/AppHeader.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../../constants';

const AppHeader = ({ 
  title = "AssignMint", 
  subtitle = "Assignment Help Marketplace",
  showProfile = false,
  onProfilePress,
  style 
}) => {
  return (
    <View style={[styles.header, style]}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && (
          <Text style={styles.subtitle}>{subtitle}</Text>
        )}
      </View>
      
      {showProfile && (
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={onProfilePress}
        >
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export const HomeHeader = ({ onProfilePress }) => {
  return (
    <AppHeader 
      title="Welcome Back! 👋"
      subtitle="Find help with your assignments"
      showProfile={true}
      onProfilePress={onProfilePress}
    />
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
    shadowColor: COLORS.black,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.gray900,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.gray600,
    fontWeight: FONTS.weights.medium,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  profileIcon: {
    fontSize: 20,
  },
});

export default AppHeader;