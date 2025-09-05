// components/profile/ExpertCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ExpertCard = ({ 
  expert, 
  onFavoriteToggle, 
  onHireAgain 
}) => {
  return (
    <View style={styles.expertCard}>
      <View style={styles.expertMainInfo}>
        <View style={styles.expertHeader}>
          <Text style={styles.expertName}>{expert.name}</Text>
          <TouchableOpacity 
            onPress={() => onFavoriteToggle(expert.id, true)}
            style={styles.favoriteButton}
          >
            <Text style={styles.favoriteIcon}>❤️</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.expertSubject}>{expert.subject} Specialist</Text>
        
        <View style={styles.expertMetrics}>
          <View style={styles.expertMetric}>
            <Text style={styles.metricLabel}>Rating</Text>
            <Text style={styles.metricValue}>{expert.rating}⭐</Text>
          </View>
          <View style={styles.expertMetric}>
            <Text style={styles.metricLabel}>Tasks</Text>
            <Text style={styles.metricValue}>{expert.completedTasks}</Text>
          </View>
          <View style={styles.expertMetric}>
            <Text style={styles.metricLabel}>You Paid</Text>
            <Text style={styles.metricValue}>${expert.totalPaid}</Text>
          </View>
          <View style={styles.expertMetric}>
            <Text style={styles.metricLabel}>Avg Time</Text>
            <Text style={styles.metricValue}>{expert.avgDeliveryTime}</Text>
          </View>
        </View>
        
        <Text style={styles.expertLastWorked}>Last worked: {expert.lastWorked}</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.hireAgainButton}
        onPress={() => onHireAgain && onHireAgain(expert)}
      >
        <Text style={styles.hireAgainText}>Hire Again</Text>
      </TouchableOpacity>
    </View>
  );
};

const ExpertsList = ({ experts, onFavoriteToggle, onHireAgain }) => {
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>⭐ Favorite Experts</Text>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      
      {experts.map((expert) => (
        <ExpertCard
          key={expert.id}
          expert={expert}
          onFavoriteToggle={onFavoriteToggle}
          onHireAgain={onHireAgain}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  viewAllButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  viewAllText: {
    color: '#2e7d32',
    fontSize: 12,
    fontWeight: '600',
  },
  expertCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  expertMainInfo: {
    marginBottom: 12,
  },
  expertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  expertName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  favoriteButton: {
    padding: 4,
  },
  favoriteIcon: {
    fontSize: 16,
  },
  expertSubject: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  expertMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  expertMetric: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: 10,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
  expertLastWorked: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  hireAgainButton: {
    backgroundColor: '#2e7d32',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  hireAgainText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export { ExpertCard, ExpertsList };
export default ExpertCard;