// components/profile/ExpertCard.tsx

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../../constants';

interface Expert {
  id: string;
  name: string;
  subject: string;
  rating: number;
  isFavorited?: boolean;
}

interface ExpertCardProps {
  expert: Expert;
  onFavoriteToggle: (expertId: string, isFavorited: boolean) => void;
  onHireExpert: (expert: Expert) => void;
}

const ExpertCard: React.FC<ExpertCardProps> = ({ expert, onFavoriteToggle, onHireExpert }) => {
  return (
    <View style={styles.container}>
      <View style={styles.mainInfo}>
        <Text style={styles.name}>{expert.name}</Text>
        <Text style={styles.subject}>{expert.subject}</Text>
        <Text style={styles.rating}>⭐ {expert.rating}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => onFavoriteToggle(expert.id, !expert.isFavorited)}
        >
          <Text style={styles.favoriteIcon}>
            {expert.isFavorited ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.hireButton}
          onPress={() => onHireExpert(expert)}
        >
          <Text style={styles.hireButtonText}>Hire</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const ExpertsList: React.FC<{
  experts: Expert[];
  onFavoriteToggle: (expertId: string, isFavorited: boolean) => void;
  onHireExpert: (expert: Expert) => void;
}> = ({ experts, onFavoriteToggle, onHireExpert }) => {
  return (
    <View style={styles.listContainer}>
      {experts.map(expert => (
        <ExpertCard
          key={expert.id}
          expert={expert}
          onFavoriteToggle={onFavoriteToggle}
          onHireExpert={onHireExpert}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    gap: 8,
  },
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mainInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
  },
  subject: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  rating: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  favoriteButton: {
    padding: 4,
  },
  favoriteIcon: {
    fontSize: 20,
  },
  hireButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  hireButtonText: {
    color: COLORS.surface,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ExpertCard;
