import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

const AnalyticsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  // Mock analytics data
  const analyticsData = {
    tasksCompleted: 47,
    tasksPosted: 12,
    successRate: 98.5,
    onTimeDelivery: 97.2,
    averageRating: 4.8,
    trustedBy: 156,
    totalEarnings: 5240,
    monthlyGrowth: 23.5,
    responseTime: '2.3 hours',
    completionTime: '3.1 days',
  };

  const recentActivity = [
    {
      id: '1',
      type: 'completed',
      title: 'Business Case Study Analysis',
      amount: '$120',
      date: '2 hours ago',
      rating: 5.0,
    },
    {
      id: '2',
      type: 'posted',
      title: 'Research Paper Writing',
      amount: '$80',
      date: '1 day ago',
      status: 'In Progress',
    },
    {
      id: '3',
      type: 'completed',
      title: 'Chemistry Lab Report',
      amount: '$95',
      date: '3 days ago',
      rating: 4.8,
    },
    {
      id: '4',
      type: 'completed',
      title: 'Marketing Strategy Plan',
      amount: '$150',
      date: '1 week ago',
      rating: 5.0,
    },
  ];

  const renderStatCard = (title: string, value: string | number, subtitle?: string, icon?: string) => (
    <View style={styles.statCard}>
      {icon && <Text style={styles.statIcon}>{icon}</Text>}
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const renderActivityItem = (activity: any) => (
    <View key={activity.id} style={styles.activityItem}>
      <View style={styles.activityHeader}>
        <View style={styles.activityType}>
          <Text style={[
            styles.activityTypeText,
            activity.type === 'completed' ? styles.completedType : styles.postedType
          ]}>
            {activity.type === 'completed' ? '✓' : '📝'} {activity.type.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.activityAmount}>{activity.amount}</Text>
      </View>
      <Text style={styles.activityTitle}>{activity.title}</Text>
      <View style={styles.activityFooter}>
        <Text style={styles.activityDate}>{activity.date}</Text>
        {activity.rating && (
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>⭐ {activity.rating}</Text>
          </View>
        )}
        {activity.status && (
          <Text style={styles.statusText}>{activity.status}</Text>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analytics</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Text style={styles.shareButtonText}>📊</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Overview Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Overview</Text>
          <View style={styles.statsGrid}>
            {renderStatCard('Tasks Completed', analyticsData.tasksCompleted, 'Total completed tasks', '✅')}
            {renderStatCard('Tasks Posted', analyticsData.tasksPosted, 'Tasks you\'ve posted', '📝')}
            {renderStatCard('Success Rate', `${analyticsData.successRate}%`, 'Completion success', '📈')}
            {renderStatCard('On-time Delivery', `${analyticsData.onTimeDelivery}%`, 'Timely deliveries', '⏰')}
          </View>
        </View>

        {/* Key Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.metricsContainer}>
            <View style={styles.metricCard}>
              <Text style={styles.metricIcon}>⭐</Text>
              <Text style={styles.metricValue}>{analyticsData.averageRating}</Text>
              <Text style={styles.metricLabel}>Average Rating</Text>
              <Text style={styles.metricSubtitle}>Out of 5.0</Text>
            </View>
            
            <View style={styles.metricCard}>
              <Text style={styles.metricIcon}>🤝</Text>
              <Text style={styles.metricValue}>{analyticsData.trustedBy}</Text>
              <Text style={styles.metricLabel}>Trusted By</Text>
              <Text style={styles.metricSubtitle}>People</Text>
            </View>
            
            <View style={styles.metricCard}>
              <Text style={styles.metricIcon}>💰</Text>
              <Text style={styles.metricValue}>${analyticsData.totalEarnings}</Text>
              <Text style={styles.metricLabel}>Total Earnings</Text>
              <Text style={styles.metricSubtitle}>Lifetime</Text>
            </View>
            
            <View style={styles.metricCard}>
              <Text style={styles.metricIcon}>📈</Text>
              <Text style={styles.metricValue}>+{analyticsData.monthlyGrowth}%</Text>
              <Text style={styles.metricLabel}>Monthly Growth</Text>
              <Text style={styles.metricSubtitle}>This month</Text>
            </View>
          </View>
        </View>

        {/* Performance Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Details</Text>
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Average Response Time</Text>
              <Text style={styles.detailValue}>{analyticsData.responseTime}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Average Completion Time</Text>
              <Text style={styles.detailValue}>{analyticsData.completionTime}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Tasks This Month</Text>
              <Text style={styles.detailValue}>12</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Earnings This Month</Text>
              <Text style={styles.detailValue}>$890</Text>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.activityContainer}>
            {recentActivity.map(renderActivityItem)}
          </View>
        </View>

        {/* Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Insights</Text>
          <View style={styles.insightsContainer}>
            <View style={styles.insightCard}>
              <Text style={styles.insightIcon}>🎯</Text>
              <Text style={styles.insightTitle}>Top Performing Category</Text>
              <Text style={styles.insightValue}>Business & Marketing</Text>
              <Text style={styles.insightSubtitle}>Highest success rate at 100%</Text>
            </View>
            
            <View style={styles.insightCard}>
              <Text style={styles.insightIcon}>📊</Text>
              <Text style={styles.insightTitle}>Peak Activity Time</Text>
              <Text style={styles.insightValue}>Weekdays 2-6 PM</Text>
              <Text style={styles.insightSubtitle}>Best time for task completion</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  shareButton: {
    padding: 8,
  },
  shareButtonText: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  viewAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 16,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '47%',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  statSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 2,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 16,
    gap: 12,
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '47%',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
  },
  metricSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 2,
  },
  detailsContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  detailLabel: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '400',
  },
  detailValue: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  activityContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  activityItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityType: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activityTypeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  completedType: {
    color: '#34C759',
  },
  postedType: {
    color: '#007AFF',
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  activityTitle: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
    marginBottom: 8,
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityDate: {
    fontSize: 14,
    color: '#8E8E93',
  },
  ratingContainer: {
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 12,
    color: '#856404',
    fontWeight: '600',
  },
  statusText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  insightsContainer: {
    marginHorizontal: 16,
    gap: 12,
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  insightValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  insightSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
});

export default AnalyticsScreen; 