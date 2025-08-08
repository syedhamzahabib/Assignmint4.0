// components/profile/expert/RatingsSummary.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const RatingsSummary = ({ ratingsData, onViewAllReviews }) => {
  // Calculate rating distribution
  const getRatingDistribution = (ratings) => {
    const distribution = [0, 0, 0, 0, 0]; // 1-star to 5-star
    ratings.forEach(rating => {
      if (rating >= 1 && rating <= 5) {
        distribution[rating - 1]++;
      }
    });
    return distribution;
  };

  // Get rating color based on value
  const getRatingColor = (rating) => {
    if (rating >= 4.8) return '#4caf50';
    if (rating >= 4.5) return '#8bc34a';
    if (rating >= 4.0) return '#ffc107';
    if (rating >= 3.5) return '#ff9800';
    return '#f44336';
  };

  // Create circular progress for rating
  const getCircularProgress = (rating) => {
    const percentage = (rating / 5) * 100;
    return percentage;
  };

  const distribution = getRatingDistribution(ratingsData?.individualRatings || []);
  const totalReviews = ratingsData?.totalReviews || 0;
  const avgRating = ratingsData?.avgRating || 0;
  const ratingColor = getRatingColor(avgRating);
  const circularProgress = getCircularProgress(avgRating);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>⭐ Ratings & Reviews</Text>
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={onViewAllReviews}
        >
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Rating Circle and Stats */}
        <View style={styles.leftSection}>
          {/* Simplified Rating Display */}
          <View style={styles.ratingDisplay}>
            <Text style={[styles.ratingNumber, { color: ratingColor }]}>
              {avgRating.toFixed(1)}
            </Text>
            <View style={styles.starsContainer}>
              <Text style={styles.ratingStars}>
                {'★'.repeat(Math.floor(avgRating))}
                {avgRating % 1 >= 0.5 ? '★' : ''}
                {'☆'.repeat(5 - Math.ceil(avgRating))}
              </Text>
            </View>
          </View>

          {/* Total Reviews */}
          <Text style={styles.totalReviews}>
            {totalReviews} review{totalReviews !== 1 ? 's' : ''}
          </Text>

          {/* Simplified Rating Breakdown */}
          <View style={styles.breakdown}>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = distribution[star - 1] || 0;
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              
              return (
                <View key={star} style={styles.breakdownRow}>
                  <Text style={styles.starLabel}>{star}★</Text>
                  <View style={styles.barContainer}>
                    <View style={styles.barBackground}>
                      <View 
                        style={[
                          styles.barFill, 
                          { 
                            width: `${percentage}%`,
                            backgroundColor: ratingColor
                          }
                        ]} 
                      />
                    </View>
                  </View>
                  <Text style={styles.countText}>{count}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Recent Reviews Preview */}
        <View style={styles.rightSection}>
          <Text style={styles.recentTitle}>Recent Reviews</Text>
          
          {ratingsData?.recentReviews && ratingsData.recentReviews.length > 0 ? (
            <View style={styles.reviewsList}>
              {ratingsData.recentReviews.slice(0, 2).map((review, index) => (
                <View key={index} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewStars}>
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </Text>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                  <Text style={styles.reviewText} numberOfLines={2}>
                    "{review.comment}"
                  </Text>
                  <Text style={styles.reviewAuthor}>- {review.requesterName}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.noReviews}>
              <Text style={styles.noReviewsIcon}>💬</Text>
              <Text style={styles.noReviewsText}>No reviews yet</Text>
              <Text style={styles.noReviewsSubtext}>
                Complete tasks to get reviews!
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.quickStats}>
        <View style={styles.quickStat}>
          <Text style={styles.quickStatNumber}>{ratingsData.responseRate || 98}%</Text>
          <Text style={styles.quickStatLabel}>Response Rate</Text>
        </View>
        <View style={styles.quickStat}>
          <Text style={styles.quickStatNumber}>{ratingsData.onTimeDelivery || 95}%</Text>
          <Text style={styles.quickStatLabel}>On-Time Delivery</Text>
        </View>
        <View style={styles.quickStat}>
          <Text style={styles.quickStatNumber}>{ratingsData.repeatClients || 12}</Text>
          <Text style={styles.quickStatLabel}>Repeat Clients</Text>
        </View>
      </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  content: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  leftSection: {
    flex: 1,
    alignItems: 'center',
    paddingRight: 12,
  },
  ratingDisplay: {
    alignItems: 'center',
    marginBottom: 12,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  ratingNumber: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 4,
  },
  starsContainer: {
    marginBottom: 4,
  },
  ratingStars: {
    fontSize: 14,
    color: '#ffc107',
  },
  totalReviews: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    fontWeight: '500',
  },
  breakdown: {
    width: '100%',
    gap: 4,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starLabel: {
    fontSize: 12,
    width: 20,
    color: '#666',
    fontWeight: '500',
  },
  barContainer: {
    flex: 1,
  },
  barBackground: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  countText: {
    fontSize: 11,
    color: '#666',
    width: 20,
    textAlign: 'right',
    fontWeight: '500',
  },
  rightSection: {
    flex: 1.2,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  reviewsList: {
    gap: 12,
  },
  reviewItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#4caf50',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  reviewStars: {
    fontSize: 12,
    color: '#ffc107',
    fontWeight: '600',
  },
  reviewDate: {
    fontSize: 10,
    color: '#999',
  },
  reviewText: {
    fontSize: 12,
    color: '#333',
    lineHeight: 16,
    marginBottom: 4,
    fontStyle: 'italic',
  },
  reviewAuthor: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
  },
  noReviews: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noReviewsIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  noReviewsText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    marginBottom: 4,
  },
  noReviewsSubtext: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 16,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  quickStat: {
    alignItems: 'center',
  },
  quickStatNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2e7d32',
    marginBottom: 2,
  },
  quickStatLabel: {
    fontSize: 10,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default RatingsSummary;