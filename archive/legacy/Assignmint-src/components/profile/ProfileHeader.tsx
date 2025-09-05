// components/profile/ProfileHeader.tsx

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../../constants';

interface ProfileHeaderProps {
  profile: any;
  onUpdateNickname: (nickname: string) => void;
  onQuickAction: (action: string) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  onUpdateNickname,
  onQuickAction,
}) => {
  return (
    <View style={styles.container}>
      {/* Avatar and Basic Info */}
      <View style={styles.mainInfo}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>{profile.avatar}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.nickname}>{profile.nickname}</Text>
          <Text style={styles.email}>{profile.email}</Text>
          <Text style={styles.memberSince}>
            Member since {profile.memberSince} days
          </Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onQuickAction('wallet')}
        >
          <Text style={styles.actionIcon}>💰</Text>
          <Text style={styles.actionText}>Wallet</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onQuickAction('settings')}
        >
          <Text style={styles.actionIcon}>⚙️</Text>
          <Text style={styles.actionText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onQuickAction('help')}
        >
          <Text style={styles.actionIcon}>❓</Text>
          <Text style={styles.actionText}>Help</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  mainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatar: {
    fontSize: 32,
  },
  infoContainer: {
    flex: 1,
  },
  nickname: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});

export default ProfileHeader;
