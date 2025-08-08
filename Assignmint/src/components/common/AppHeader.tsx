import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../../constants';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showProfile?: boolean;
  onProfilePress?: () => void;
  showBack?: boolean;
  onBackPress?: () => void;
  rightAction?: {
    icon: string;
    onPress: () => void;
  };
  style?: any;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title = "AssignMint",
  subtitle = "Assignment Help Marketplace",
  showProfile = false,
  onProfilePress,
  showBack = false,
  onBackPress,
  rightAction,
  style,
}) => {
  return (
    <View style={[styles.header, style]}>
      {/* Left Section */}
      <View style={styles.leftSection}>
        {showBack && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={onBackPress}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Center Section */}
      <View style={styles.centerSection}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && (
          <Text style={styles.subtitle}>{subtitle}</Text>
        )}
      </View>

      {/* Right Section */}
      <View style={styles.rightSection}>
        {rightAction && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={rightAction.onPress}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>{rightAction.icon}</Text>
          </TouchableOpacity>
        )}
        
        {showProfile && (
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={onProfilePress}
            activeOpacity={0.7}
          >
            <View style={styles.profileAvatar}>
              <Text style={styles.profileIcon}>👤</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export const HomeHeader: React.FC<{ onProfilePress?: () => void }> = ({ onProfilePress }) => {
  return (
    <AppHeader 
      title="Welcome Back! 👋"
      subtitle="Find help with your assignments"
      showProfile={true}
      onProfilePress={onProfilePress}
    />
  );
};

export const TaskHeader: React.FC<{ 
  title: string;
  onBackPress: () => void;
  rightAction?: {
    icon: string;
    onPress: () => void;
  };
}> = ({ title, onBackPress, rightAction }) => {
  return (
    <AppHeader 
      title={title}
      showBack={true}
      onBackPress={onBackPress}
      rightAction={rightAction}
    />
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  backIcon: {
    fontSize: 18,
    color: COLORS.text,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionIcon: {
    fontSize: 18,
    color: COLORS.text,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.surface,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileIcon: {
    fontSize: 16,
    color: COLORS.surface,
  },
});

export default AppHeader; 