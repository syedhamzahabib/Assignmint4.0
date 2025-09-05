// components/profile/modals/StatsModal.tsx

import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { COLORS } from '../../../constants';

interface StatsModalProps {
  visible: boolean;
  stats: any;
  onClose: () => void;
}

const StatsModal: React.FC<StatsModalProps> = ({ visible, stats, onClose }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Detailed Statistics</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats?.tasksCompleted || 0}</Text>
                <Text style={styles.statLabel}>Tasks Completed</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>${stats?.totalEarned?.toFixed(2) || '0.00'}</Text>
                <Text style={styles.statLabel}>Total Earned</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats?.avgRating?.toFixed(1) || '0.0'}</Text>
                <Text style={styles.statLabel}>Avg Rating</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats?.totalReviews || 0}</Text>
                <Text style={styles.statLabel}>Total Reviews</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performance Metrics</Text>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Response Time</Text>
              <Text style={styles.metricValue}>{stats?.responseTime || 'N/A'}</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Completion Rate</Text>
              <Text style={styles.metricValue}>{stats?.completionRate || 0}%</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>On-Time Delivery</Text>
              <Text style={styles.metricValue}>{stats?.onTimeDelivery || 0}%</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Repeat Clients</Text>
              <Text style={styles.metricValue}>{stats?.repeatClients || 0}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Financial Summary</Text>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Current Balance</Text>
              <Text style={styles.metricValue}>${stats?.currentBalance?.toFixed(2) || '0.00'}</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Average Per Task</Text>
              <Text style={styles.metricValue}>
                ${stats?.tasksCompleted ? (stats.totalEarned / stats.tasksCompleted).toFixed(2) : '0.00'}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: COLORS.textSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 16,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  metricItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  metricLabel: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default StatsModal;
