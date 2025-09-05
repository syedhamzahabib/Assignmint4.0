// components/profile/StatsCards.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../../constants';

interface StatsCardsProps {
  stats: {
    totalSpent?: number;
    tasksPosted?: number;
    avgRating?: number;
    memberSince?: number;
  };
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardValue}>
          ${stats.totalSpent?.toFixed(2) || '0.00'}
        </Text>
        <Text style={styles.cardLabel}>Total Spent</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardValue}>
          {stats.tasksPosted || 0}
        </Text>
        <Text style={styles.cardLabel}>Tasks Posted</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardValue}>
          {stats.avgRating?.toFixed(1) || '0.0'}
        </Text>
        <Text style={styles.cardLabel}>Avg Rating</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardValue}>
          {stats.memberSince || 0}
        </Text>
        <Text style={styles.cardLabel}>Days</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default StatsCards;
