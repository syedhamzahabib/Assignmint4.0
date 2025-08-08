// components/profile/expert/ExpertHeader.tsx

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../../../constants';

interface ExpertHeaderProps {
  profile: any;
  onUpdateBio: (bio: string) => void;
  onViewStats: () => void;
}

const ExpertHeader: React.FC<ExpertHeaderProps> = ({ profile, onUpdateBio, onViewStats }) => {
  return (
    <View style={styles.container}>
      <View style={styles.mainInfo}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>{profile.avatar}</Text>
          {profile.expertProfile?.isVerified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedIcon}>✓</Text>
            </View>
          )}
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{profile.nickname}</Text>
          <Text style={styles.specialties}>
            {profile.expertProfile?.specialties?.join(', ')}
          </Text>
          <Text style={styles.responseTime}>
            Response time: {profile.expertProfile?.responseTime}
          </Text>
        </View>
      </View>
      
      <View style={styles.bioContainer}>
        <Text style={styles.bioTitle}>About Me</Text>
        <Text style={styles.bioText}>
          {profile.expertProfile?.bio || 'No bio available'}
        </Text>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Bio</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profile.expertStats?.tasksCompleted || 0}</Text>
          <Text style={styles.statLabel}>Tasks Completed</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profile.expertStats?.avgRating?.toFixed(1) || '0.0'}</Text>
          <Text style={styles.statLabel}>Avg Rating</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profile.expertStats?.completionRate || 0}%</Text>
          <Text style={styles.statLabel}>Completion Rate</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    fontSize: 32,
    textAlign: 'center',
    lineHeight: 80,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.success,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedIcon: {
    color: COLORS.surface,
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  specialties: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  responseTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  bioContainer: {
    marginBottom: 16,
  },
  bioTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  bioText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  editButton: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    color: COLORS.surface,
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default ExpertHeader; 