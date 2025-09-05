// components/profile/expert/BadgesPlaceholder.tsx

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../../../constants';

interface BadgesPlaceholderProps {
  onPress: () => void;
}

const BadgesPlaceholder: React.FC<BadgesPlaceholderProps> = ({ onPress }) => {
  const badges = [
    { id: 1, name: 'Top Performer', icon: '🏆', color: COLORS.primary },
    { id: 2, name: 'Quick Responder', icon: '⚡', color: COLORS.success },
    { id: 3, name: 'Quality Expert', icon: '⭐', color: COLORS.warning },
    { id: 4, name: 'Reliable', icon: '✅', color: COLORS.success },
  ];

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title}>Badges & Achievements</Text>
        <Text style={styles.seeAllText}>See All</Text>
      </View>

      <View style={styles.badgesContainer}>
        {badges.map(badge => (
          <View key={badge.id} style={styles.badgeItem}>
            <View style={[styles.badgeIcon, { backgroundColor: badge.color }]}>
              <Text style={styles.badgeIconText}>{badge.icon}</Text>
            </View>
            <Text style={styles.badgeName}>{badge.name}</Text>
          </View>
        ))}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Badges Earned</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>Achievements</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>156</Text>
          <Text style={styles.statLabel}>Days Active</Text>
        </View>
      </View>
    </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  badgeItem: {
    alignItems: 'center',
  },
  badgeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeIconText: {
    fontSize: 20,
  },
  badgeName: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '500',
    textAlign: 'center',
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

export default BadgesPlaceholder;
