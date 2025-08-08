import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { COLORS } from '../constants';
import Icon, { Icons } from '../components/common/Icon';

const NotificationsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  // Mock notifications data
  const notifications = [
    {
      id: '1',
      type: 'task_accepted',
      title: 'Task Accepted',
      message: 'Your "Business Case Study Analysis" task was accepted by Sarah M.',
      time: '2 minutes ago',
      isRead: false,
      avatar: 'user',
      category: 'today',
    },
    {
      id: '2',
      type: 'review_received',
      title: 'New Review Received',
      message: 'You received a 5-star review for "Marketing Strategy Plan"',
      time: '1 hour ago',
      isRead: false,
      avatar: '⭐',
      category: 'today',
    },
    {
      id: '3',
      type: 'new_bid',
      title: 'New Bid Received',
      message: 'Mike R. placed a bid of $120 on your "Research Paper" task',
      time: '3 hours ago',
      isRead: true,
      avatar: '💰',
      category: 'today',
    },
    {
      id: '4',
      type: 'deadline_reminder',
      title: 'Deadline Reminder',
      message: 'Your "Chemistry Lab Report" task is due in 24 hours',
      time: '5 hours ago',
      isRead: true,
      avatar: '⏰',
      category: 'today',
    },
    {
      id: '5',
      type: 'payment_received',
      title: 'Payment Received',
      message: 'You received $95 for completing "Chemistry Lab Report"',
      time: '1 day ago',
      isRead: true,
      avatar: '💳',
      category: 'week',
    },
    {
      id: '6',
      type: 'task_completed',
      title: 'Task Completed',
      message: 'Your "Mobile App Development" task was marked as completed',
      time: '2 days ago',
      isRead: true,
      avatar: '✅',
      category: 'week',
    },
    {
      id: '7',
      type: 'new_message',
      title: 'New Message',
      message: 'David L. sent you a message about "Marketing Strategy Plan"',
      time: '3 days ago',
      isRead: true,
      avatar: 'message',
      category: 'earlier',
    },
    {
      id: '8',
      type: 'system_update',
      title: 'System Update',
      message: 'New features available: Enhanced bidding system and real-time chat',
      time: '1 week ago',
      isRead: true,
      avatar: '🔧',
      category: 'earlier',
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task_accepted':
        return Icons.check;
      case 'review_received':
        return Icons.star;
      case 'new_bid':
        return Icons.money;
      case 'deadline_reminder':
        return Icons.clock;
      case 'payment_received':
        return Icons.payment;
      case 'task_completed':
        return Icons.success;
      case 'new_message':
        return Icons.messages;
      case 'system_update':
        return Icons.settings;
      default:
        return Icons.notifications;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'task_accepted':
        return '#34C759';
      case 'review_received':
        return '#FFD700';
      case 'new_bid':
        return '#007AFF';
      case 'deadline_reminder':
        return '#FF9500';
      case 'payment_received':
        return '#34C759';
      case 'task_completed':
        return '#34C759';
      case 'new_message':
        return '#007AFF';
      case 'system_update':
        return '#8E8E93';
      default:
        return '#007AFF';
    }
  };

  const filterNotifications = () => {
    if (activeFilter === 'all') return notifications;
    return notifications.filter(notification => notification.category === activeFilter);
  };

  const groupedNotifications = filterNotifications().reduce((groups, notification) => {
    const category = notification.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(notification);
    return groups;
  }, {} as Record<string, typeof notifications>);

  const renderNotificationItem = (notification: any) => (
    <TouchableOpacity
      key={notification.id}
      style={[
        styles.notificationItem,
        !notification.isRead && styles.unreadNotification
      ]}
    >
      <View style={styles.notificationAvatar}>
        <Icon name={Icons.user} size={24} color={COLORS.textSecondary} />
        {!notification.isRead && (
          <View style={[styles.unreadDot, { backgroundColor: getNotificationColor(notification.type) }]} />
        )}
      </View>
      
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{notification.title}</Text>
          <Text style={styles.notificationTime}>{notification.time}</Text>
        </View>
        <Text style={styles.notificationMessage}>{notification.message}</Text>
      </View>
      
      <View style={styles.notificationIcon}>
        <Icon name={getNotificationIcon(notification.type)} size={20} color={getNotificationColor(notification.type)} />
      </View>
    </TouchableOpacity>
  );

  const renderNotificationGroup = (category: string, notifications: any[]) => {
    const categoryLabels = {
      today: 'Today',
      week: 'This Week',
      earlier: 'Earlier',
    };

    return (
      <View key={category} style={styles.notificationGroup}>
        <Text style={styles.groupTitle}>{categoryLabels[category as keyof typeof categoryLabels]}</Text>
        {notifications.map(renderNotificationItem)}
      </View>
    );
  };

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
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.markAllReadButton}>
          <Text style={styles.markAllReadText}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {[
            { key: 'all', label: 'All' },
            { key: 'today', label: 'Today' },
            { key: 'week', label: 'This Week' },
            { key: 'earlier', label: 'Earlier' },
          ].map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterTab,
                activeFilter === filter.key && styles.activeFilterTab
              ]}
              onPress={() => setActiveFilter(filter.key)}
            >
              <Text style={[
                styles.filterTabText,
                activeFilter === filter.key && styles.activeFilterTabText
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Notifications List */}
      <ScrollView 
        style={styles.notificationsList}
        showsVerticalScrollIndicator={false}
      >
        {Object.entries(groupedNotifications).map(([category, notifications]) =>
          renderNotificationGroup(category, notifications)
        )}
        
        {Object.keys(groupedNotifications).length === 0 && (
          <View style={styles.emptyState}>
            <Icon name={Icons.notifications} size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyStateTitle}>No notifications</Text>
            <Text style={styles.emptyStateText}>
              You're all caught up! New notifications will appear here.
            </Text>
          </View>
        )}
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
  markAllReadButton: {
    padding: 8,
  },
  markAllReadText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  filterScroll: {
    paddingHorizontal: 16,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
  },
  activeFilterTab: {
    backgroundColor: '#007AFF',
  },
  filterTabText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  activeFilterTabText: {
    color: '#FFFFFF',
  },
  notificationsList: {
    flex: 1,
  },
  notificationGroup: {
    marginTop: 16,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    marginHorizontal: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  unreadNotification: {
    backgroundColor: '#F8F9FF',
  },
  notificationAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  avatarText: {
    fontSize: 20,
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  notificationContent: {
    flex: 1,
    marginRight: 12,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  notificationTime: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  notificationIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

export default NotificationsScreen; 