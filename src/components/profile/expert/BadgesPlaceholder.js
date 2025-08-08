// components/profile/expert/BadgesPlaceholder.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const BadgesPlaceholder = ({ badges = [], onViewAllBadges, onEarnBadges }) => {
  // Mock badge data - you can replace this with real data later
  const mockBadges = [
    {
      id: 'first_task',
      name: 'First Completion',
      description: 'Complete your first task',
      icon: '🎯',
      earned: true,
      earnedDate: '2024-12-15',
      rarity: 'common'
    },
    {
      id: 'five_star',
      name: '5-Star Expert',
      description: 'Receive a 5-star rating',
      icon: '⭐',
      earned: true,
      earnedDate: '2024-12-20',
      rarity: 'common'
    },
    {
      id: 'fast_delivery',
      name: 'Speed Demon',
      description: 'Complete 5 tasks early',
      icon: '⚡',
      earned: true,
      earnedDate: '2025-01-10',
      rarity: 'uncommon'
    },
    {
      id: 'subject_master',
      name: 'Math Master',
      description: 'Complete 25 Math tasks',
      icon: '📊',
      earned: false,
      progress: 18,
      target: 25,
      rarity: 'rare'
    },
    {
      id: 'perfect_month',
      name: 'Perfect Month',
      description: 'All 5-star ratings for a month',
      icon: '🏆',
      earned: false,
      progress: 0,
      target: 1,
      rarity: 'legendary'
    },
    {
      id: 'loyal_client',
      name: 'Client Favorite',
      description: 'Get 3 repeat customers',
      icon: '💎',
      earned: false,
      progress: 1,
      target: 3,
      rarity: 'rare'
    }
  ];

  const getBadgeStyle = (rarity, earned) => {
    const styles = {
      common: { bg: '#e8f5e8', border: '#4caf50', text: '#2e7d32' },
      uncommon: { bg: '#e3f2fd', border: '#2196f3', text: '#1976d2' },
      rare: { bg: '#fff3e0', border: '#ff9800', text: '#f57c00' },
      epic: { bg: '#f3e5f5', border: '#9c27b0', text: '#7b1fa2' },
      legendary: { bg: '#ffebee', border: '#f44336', text: '#d32f2f' }
    };
    
    const style = styles[rarity] || styles.common;
    
    if (!earned) {
      return {
        bg: '#f5f5f5',
        border: '#e0e0e0',
        text: '#999'
      };
    }
    
    return style;
  };

  const earnedBadges = mockBadges.filter(badge => badge.earned);
  const nextBadges = mockBadges.filter(badge => !badge.earned).slice(0, 3);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>🏆 Achievements & Badges</Text>
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={onViewAllBadges}
        >
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Earned Badges */}
      {earnedBadges.length > 0 ? (
        <View style={styles.earnedSection}>
          <Text style={styles.subsectionTitle}>✨ Earned Badges ({earnedBadges.length})</Text>
          <View style={styles.badgesGrid}>
            {earnedBadges.slice(0, 6).map((badge) => {
              const badgeStyle = getBadgeStyle(badge.rarity, badge.earned);
              
              return (
                <TouchableOpacity
                  key={badge.id}
                  style={[
                    styles.badgeCard,
                    { 
                      backgroundColor: badgeStyle.bg,
                      borderColor: badgeStyle.border 
                    }
                  ]}
                >
                  <Text style={styles.badgeIcon}>{badge.icon}</Text>
                  <Text style={[styles.badgeName, { color: badgeStyle.text }]}>
                    {badge.name}
                  </Text>
                  <Text style={styles.badgeDate}>
                    {new Date(badge.earnedDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ) : (
        <View style={styles.noBadgesEarned}>
          <Text style={styles.noBadgesIcon}>🏆</Text>
          <Text style={styles.noBadgesTitle}>No Badges Earned Yet</Text>
          <Text style={styles.noBadgesText}>
            Complete tasks and provide great service to earn your first badge!
          </Text>
        </View>
      )}

      {/* Progress Toward Next Badges */}
      <View style={styles.progressSection}>
        <Text style={styles.subsectionTitle}>🎯 Progress Toward Next Badges</Text>
        
        {nextBadges.map((badge) => {
          const progress = badge.progress || 0;
          const target = badge.target || 1;
          const percentage = Math.min((progress / target) * 100, 100);
          const badgeStyle = getBadgeStyle(badge.rarity, false);
          
          return (
            <View key={badge.id} style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <View style={styles.progressLeft}>
                  <Text style={styles.progressIcon}>{badge.icon}</Text>
                  <View style={styles.progressInfo}>
                    <Text style={styles.progressName}>{badge.name}</Text>
                    <Text style={styles.progressDescription}>{badge.description}</Text>
                  </View>
                </View>
                <View style={styles.progressRight}>
                  <Text style={styles.progressText}>{progress}/{target}</Text>
                  <View style={[styles.rarityBadge, { backgroundColor: badgeStyle.border + '20' }]}>
                    <Text style={[styles.rarityText, { color: badgeStyle.border }]}>
                      {badge.rarity}
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressBarFill, 
                      { 
                        width: `${percentage}%`,
                        backgroundColor: badgeStyle.border 
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.progressPercentage}>{Math.round(percentage)}%</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Call to Action */}
      <TouchableOpacity 
        style={styles.earnMoreButton}
        onPress={onEarnBadges}
      >
        <Text style={styles.earnMoreIcon}>🚀</Text>
        <Text style={styles.earnMoreText}>Complete More Tasks to Earn Badges</Text>
      </TouchableOpacity>
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
  earnedSection: {
    marginBottom: 20,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badgeCard: {
    width: '30%',
    minWidth: 90,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
  },
  badgeIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  badgeName: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 12,
  },
  badgeDate: {
    fontSize: 8,
    color: '#666',
    textAlign: 'center',
  },
  noBadgesEarned: {
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 20,
  },
  noBadgesIcon: {
    fontSize: 48,
    marginBottom: 12,
    opacity: 0.5,
  },
  noBadgesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  noBadgesText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  progressLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  progressIcon: {
    fontSize: 20,
    marginRight: 12,
    opacity: 0.6,
  },
  progressInfo: {
    flex: 1,
  },
  progressName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  progressDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  progressRight: {
    alignItems: 'flex-end',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  rarityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  rarityText: {
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressPercentage: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
    minWidth: 35,
    textAlign: 'right',
  },
  earnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fff8',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#2e7d32',
    borderStyle: 'dashed',
  },
  earnMoreIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  earnMoreText: {
    fontSize: 14,
    color: '#2e7d32',
    fontWeight: '600',
  },
});

export default BadgesPlaceholder;