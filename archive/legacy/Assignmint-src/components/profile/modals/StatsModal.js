// components/profile/modals/StatsModal.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const StatsModal = ({ visible, onClose, profile }) => {
  if (!profile) return null;

  const { requesterStats, quickStats } = profile;

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
            <Text style={styles.modalTitle}>📊 Your Statistics</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>📝</Text>
                <Text style={styles.statValue}>{requesterStats.tasksPosted}</Text>
                <Text style={styles.statName}>Total Tasks</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>💰</Text>
                <Text style={styles.statValue}>${requesterStats.totalSpent}</Text>
                <Text style={styles.statName}>Total Spent</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>⭐</Text>
                <Text style={styles.statValue}>{requesterStats.avgRating}</Text>
                <Text style={styles.statName}>Avg Rating</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>⚡</Text>
                <Text style={styles.statValue}>{requesterStats.avgResponseTime}</Text>
                <Text style={styles.statName}>Response Time</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>🎯</Text>
                <Text style={styles.statValue}>{quickStats.successRate}%</Text>
                <Text style={styles.statName}>Success Rate</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>📚</Text>
                <Text style={styles.statValue}>{quickStats.mostUsedSubject}</Text>
                <Text style={styles.statName}>Top Subject</Text>
              </View>
            </View>
            
            <View style={styles.preferredSubjects}>
              <Text style={styles.subsectionTitle}>📋 Preferred Subjects</Text>
              <View style={styles.subjectTags}>
                {requesterStats.preferredSubjects.map((subject, index) => (
                  <View key={index} style={styles.subjectTag}>
                    <Text style={styles.subjectTagText}>{subject}</Text>
                  </View>
                ))}
              </View>
            </View>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  statItem: {
    width: (screenWidth - 80) / 2,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2e7d32',
    marginBottom: 4,
  },
  statName: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  preferredSubjects: {
    marginTop: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  subjectTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  subjectTag: {
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  subjectTagText: {
    fontSize: 12,
    color: '#2e7d32',
    fontWeight: '600',
  },
});

export default StatsModal;