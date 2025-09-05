// components/profile/StatsCards.js
import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const StatsCards = ({ stats, fadeAnim }) => {
  return (
    <Animated.View style={[styles.statsContainer, { opacity: fadeAnim }]}>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{stats.tasksPosted}</Text>
        <Text style={styles.statLabel}>Tasks Posted</Text>
        <Text style={styles.statTrend}>+{stats.tasksThisMonth} this month</Text>
      </View>
      
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>${stats.totalSpent}</Text>
        <Text style={styles.statLabel}>Total Spent</Text>
        <Text style={styles.statTrend}>${stats.avgTaskValue} avg</Text>
      </View>
      
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{stats.avgRating}⭐</Text>
        <Text style={styles.statLabel}>Avg Rating</Text>
        <Text style={styles.statTrend}>{stats.successRate}% success</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2e7d32',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: 4,
  },
  statTrend: {
    fontSize: 10,
    color: '#2e7d32',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default StatsCards;