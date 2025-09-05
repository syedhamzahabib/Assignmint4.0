// components/profile/expert/RatingsSummary.tsx

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../../../constants';

interface RatingsSummaryProps {
  rating: number;
  totalReviews: number;
  onViewAll: () => void;
}

const RatingsSummary: React.FC<RatingsSummaryProps> = ({ rating, totalReviews, onViewAll }) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }

    if (hasHalfStar) {
      stars.push('⭐');
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push('☆');
    }

    return stars.join('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rating & Reviews</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.ratingContainer}>
        <View style={styles.ratingMain}>
          <Text style={styles.ratingValue}>{rating.toFixed(1)}</Text>
          <Text style={styles.stars}>{renderStars(rating)}</Text>
          <Text style={styles.reviewCount}>{totalReviews} reviews</Text>
        </View>

        <View style={styles.ratingBreakdown}>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownLabel}>5★</Text>
            <View style={styles.breakdownBar}>
              <View style={[styles.breakdownFill, { width: '80%' }]} />
            </View>
            <Text style={styles.breakdownCount}>34</Text>
          </View>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownLabel}>4★</Text>
            <View style={styles.breakdownBar}>
              <View style={[styles.breakdownFill, { width: '15%' }]} />
            </View>
            <Text style={styles.breakdownCount}>6</Text>
          </View>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownLabel}>3★</Text>
            <View style={styles.breakdownBar}>
              <View style={[styles.breakdownFill, { width: '5%' }]} />
            </View>
            <Text style={styles.breakdownCount}>2</Text>
          </View>
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
  ratingContainer: {
    flexDirection: 'row',
  },
  ratingMain: {
    alignItems: 'center',
    marginRight: 24,
  },
  ratingValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  stars: {
    fontSize: 16,
    marginBottom: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  ratingBreakdown: {
    flex: 1,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  breakdownLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    width: 20,
  },
  breakdownBar: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  breakdownFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  breakdownCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    width: 20,
    textAlign: 'right',
  },
});

export default RatingsSummary;
