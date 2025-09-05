// components/profile/modals/AchievementsModal.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';

const AchievementsModal = ({ visible, onClose, achievements }) => {
  if (!achievements) return null;

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>🏆 Your Achievements</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.achievementSubtitle}>
              {unlockedCount} of {achievements.length} unlocked
            </Text>
            
            {achievements.map((achievement) => (
              <View 
                key={achievement.id} 
                style={[
                  styles.achievementItem,
                  !achievement.unlocked && styles.achievementLocked
                ]}
              >
                <Text style={[
                  styles.achievementIcon,
                  !achievement.unlocked && styles.achievementIconLocked
                ]}>
                  {achievement.unlocked ? achievement.icon : '🔒'}
                </Text>
                <View style={styles.achievementInfo}>
                  <Text style={[
                    styles.achievementName,
                    !achievement.unlocked && styles.achievementNameLocked
                  ]}>
                    {achievement.name}
                  </Text>
                  <Text style={styles.achievementDate}>
                    {achievement.unlocked 
                      ? `Unlocked ${achievement.date}` 
                      : 'Keep going to unlock!'
                    }
                  </Text>
                </View>
                {achievement.unlocked && (
                  <Text style={styles.achievementCheck}>✅</Text>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
  modalClose: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
    padding: 4,
  },
  achievementSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  achievementLocked: {
    backgroundColor: '#f5f5f5',
    opacity: 0.6,
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  achievementIconLocked: {
    opacity: 0.4,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  achievementNameLocked: {
    color: '#999',
  },
  achievementDate: {
    fontSize: 12,
    color: '#666',
  },
  achievementCheck: {
    fontSize: 16,
  },
});

export default AchievementsModal;