// components/profile/modals/AchievementsModal.tsx

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

interface AchievementsModalProps {
  visible: boolean;
  onClose: () => void;
}

const AchievementsModal: React.FC<AchievementsModalProps> = ({ visible, onClose }) => {
  const achievements = [
    { id: 1, name: 'Top Performer', icon: '🏆', description: 'Complete 50+ tasks with 4.5+ rating', earned: true },
    { id: 2, name: 'Quick Responder', icon: '⚡', description: 'Respond to 90% of messages within 2 hours', earned: true },
    { id: 3, name: 'Quality Expert', icon: '⭐', description: 'Maintain 4.8+ rating for 30 days', earned: true },
    { id: 4, name: 'Reliable', icon: '✅', description: 'Complete 100 tasks on time', earned: false },
    { id: 5, name: 'Communication Pro', icon: '💬', description: 'Receive 50+ positive communication reviews', earned: false },
    { id: 6, name: 'Subject Master', icon: '🎓', description: 'Complete 25+ tasks in a single subject', earned: false },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Achievements & Badges</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.summary}>
            <Text style={styles.summaryText}>
              You've earned <Text style={styles.highlight}>3 out of 6</Text> achievements!
            </Text>
          </View>

          <View style={styles.achievementsList}>
            {achievements.map(achievement => (
              <View key={achievement.id} style={styles.achievementItem}>
                <View style={[
                  styles.achievementIcon,
                  { backgroundColor: achievement.earned ? COLORS.primary : COLORS.lightGray }
                ]}>
                  <Text style={styles.achievementIconText}>{achievement.icon}</Text>
                </View>
                
                <View style={styles.achievementInfo}>
                  <Text style={[
                    styles.achievementName,
                    { color: achievement.earned ? COLORS.text : COLORS.textSecondary }
                  ]}>
                    {achievement.name}
                  </Text>
                  <Text style={styles.achievementDescription}>
                    {achievement.description}
                  </Text>
                </View>
                
                <View style={styles.achievementStatus}>
                  {achievement.earned ? (
                    <Text style={styles.earnedText}>✓ Earned</Text>
                  ) : (
                    <Text style={styles.pendingText}>In Progress</Text>
                  )}
                </View>
              </View>
            ))}
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
  summary: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
  },
  highlight: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  achievementsList: {
    gap: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementIconText: {
    fontSize: 20,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  achievementStatus: {
    alignItems: 'flex-end',
  },
  earnedText: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: '600',
  },
  pendingText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});

export default AchievementsModal; 