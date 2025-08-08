import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  RefreshControl,
  Animated,
} from 'react-native';

// Dummy notification data
const dummyNotifications = [
  {
    id: 'notif_1',
    type: 'delivery_uploaded',
    icon: '📤',
    title: 'Delivery Uploaded',
    description: 'Alex Kumar has uploaded the completed work for "Fix bugs in Python script"',
    timestamp: '2 minutes ago',
    isRead: false,
    priority: 'high',
    taskId: 'req_2',
  },
  {
    id: 'notif_2',
    type: 'task_approved',
    icon: '✅',
    title: 'Task Approved & Payment Released',
    description: 'Your task "Write 500-word essay on Civil War" has been approved. Payment of $15 released to Emily Rodriguez.',
    timestamp: '1 hour ago',
    isRead: true,
    priority: 'medium',
    taskId: 'req_3',
  },
  {
    id: 'notif_3',
    type: 'new_application',
    icon: '👋',
    title: 'New Expert Application',
    description: 'Sarah Chen wants to work on your task "Design a logo for student group" - $18',
    timestamp: '3 hours ago',
    isRead: false,
    priority: 'medium',
    taskId: 'req_4',
  },
  {
    id: 'notif_4',
    type: 'reminder',
    icon: '⏰',
    title: 'Deadline Reminder',
    description: 'Your task "Solve 10 Calculus Problems" is due tomorrow at 11:59 PM',
    timestamp: '5 hours ago',
    isRead: true,
    priority: 'high',
    taskId: 'req_1',
  },
  {
    id: 'notif_5',
    type: 'payment_received',
    icon: '💰',
    title: 'Payment Received',
    description: 'You received $25 for completing "Solve Statistics homework problems"',
    timestamp: '1 day ago',
    isRead: true,
    priority: 'low',
    taskId: 'exp_3',
  },
  {
    id: 'notif_6',
    type: 'revision_requested',
    icon: '🔄',
    title: 'Revision Requested',
    description: 'David Park has requested revisions for "Chemistry Lab Report Analysis"',
    timestamp: '2 days ago',
    isRead: false,
    priority: 'high',
    taskId: 'exp_3',
  },
  {
    id: 'notif_7',
    type: 'task_completed',
    icon: '🎉',
    title: 'Task Completed Successfully',
    description: 'Congratulations! You\'ve completed "Build basic website in HTML/CSS" and earned 5⭐ rating',
    timestamp: '3 days ago',
    isRead: true,
    priority: 'low',
    taskId: 'exp_2',
  },
  {
    id: 'notif_8',
    type: 'system_update',
    icon: '🔧',
    title: 'App Update Available',
    description: 'New features available! Update to version 2.1.0 for improved task matching and bug fixes.',
    timestamp: '1 week ago',
    isRead: true,
    priority: 'low',
    taskId: null,
  },
];

const NotificationsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState(dummyNotifications);
  const [refreshing, setRefreshing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Fade in animation on mount
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'unread') {
      return !notification.isRead;
    }
    return true; // Show all notifications
  });

  // Get unread count for badge
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert('Refreshed', 'Notifications updated!');
    }, 1500);
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    Alert.alert('✅ Done', 'All notifications marked as read');
  };

  // Handle notification press
  const handleNotificationPress = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    // Navigate based on notification type
    if (notification.taskId) {
      Alert.alert(
        '📋 Navigate to Task',
        `This would navigate to task: ${notification.taskId}\n\nTitle: ${notification.title}`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'View Task', onPress: () => console.log('Navigate to task:', notification.taskId) }
        ]
      );
    } else {
      Alert.alert(
        'Notification Details',
        `${notification.title}\n\n${notification.description}\n\nTimestamp: ${notification.timestamp}`
      );
    }
  };

  // Get notification priority styling
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'high':
        return { borderLeftColor: '#f44336', borderLeftWidth: 4 };
      case 'medium':
        return { borderLeftColor: '#ff9800', borderLeftWidth: 3 };
      case 'low':
        return { borderLeftColor: '#4caf50', borderLeftWidth: 2 };
      default:
        return { borderLeftColor: '#e0e0e0', borderLeftWidth: 1 };
    }
  };

  // Render notification card
  const renderNotificationCard = (notification, index) => (
    <Animated.View
      key={notification.id}
      style={[
        styles.notificationCard,
        !notification.isRead && styles.unreadCard,
        getPriorityStyle(notification.priority),
        { opacity: fadeAnim }
      ]}
    >
      <TouchableOpacity
        onPress={() => handleNotificationPress(notification)}
        activeOpacity={0.7}
        style={styles.cardTouchable}
      >
        <View style={styles.cardContent}>
          {/* Icon and unread indicator */}
          <View style={styles.iconContainer}>
            <Text style={styles.notificationIcon}>{notification.icon}</Text>
            {!notification.isRead && <View style={styles.unreadDot} />}
          </View>

          {/* Content */}
          <View style={styles.textContainer}>
            <Text style={[
              styles.notificationTitle,
              !notification.isRead && styles.unreadTitle
            ]}>
              {notification.title}
            </Text>
            <Text style={styles.notificationDescription} numberOfLines={2}>
              {notification.description}
            </Text>
            <Text style={styles.timestamp}>{notification.timestamp}</Text>
          </View>

          {/* Action indicator */}
          <View style={styles.actionContainer}>
            <Text style={styles.actionArrow}>›</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Notifications 🔔</Text>
        
        <TouchableOpacity
          onPress={markAllAsRead}
          style={styles.markAllButton}
          disabled={unreadCount === 0}
        >
          <Text style={[
            styles.markAllText,
            unreadCount === 0 && styles.markAllTextDisabled
          ]}>
            Mark All
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Toggle */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            All
          </Text>
          <View style={styles.tabBadge}>
            <Text style={styles.tabBadgeText}>{notifications.length}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'unread' && styles.activeTab]}
          onPress={() => setActiveTab('unread')}
        >
          <Text style={[styles.tabText, activeTab === 'unread' && styles.activeTabText]}>
            Unread
          </Text>
          {unreadCount > 0 && (
            <View style={[styles.tabBadge, styles.unreadBadge]}>
              <Text style={[styles.tabBadgeText, styles.unreadBadgeText]}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Stats Bar */}
      {filteredNotifications.length > 0 && (
        <View style={styles.statsBar}>
          <Text style={styles.statsText}>
            {activeTab === 'all' 
              ? `${filteredNotifications.length} total notifications` 
              : `${filteredNotifications.length} unread notifications`
            }
          </Text>
          {unreadCount > 0 && activeTab === 'all' && (
            <Text style={styles.unreadStats}>• {unreadCount} unread</Text>
          )}
        </View>
      )}

      {/* Notifications List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2e7d32']}
            tintColor="#2e7d32"
          />
        }
      >
        {filteredNotifications.length > 0 ? (
          <>
            {filteredNotifications.map((notification, index) => 
              renderNotificationCard(notification, index)
            )}
            
            {/* Bottom spacing */}
            <View style={styles.bottomSpacer} />
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>
              {activeTab === 'unread' ? '🎉' : '📭'}
            </Text>
            <Text style={styles.emptyTitle}>
              {activeTab === 'unread' ? 'All caught up!' : 'No notifications'}
            </Text>
            <Text style={styles.emptyText}>
              {activeTab === 'unread' 
                ? 'You\'ve read all your notifications. Great job staying on top of things!'
                : 'You don\'t have any notifications yet. They\'ll appear here when you have updates on your tasks.'
              }
            </Text>
            
            {activeTab === 'unread' && (
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => setActiveTab('all')}
              >
                <Text style={styles.emptyButtonText}>View All Notifications</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>

      {/* Pull to refresh hint */}
      <View style={styles.hintContainer}>
        <Text style={styles.hintText}>💡 Pull down to refresh notifications</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f5f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    flex: 1,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2e7d32',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
    textAlign: 'center',
    flex: 2,
  },
  markAllButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    flex: 1,
    alignItems: 'flex-end',
  },
  markAllText: {
    fontSize: 13,
    color: '#2e7d32',
    fontWeight: '600',
  },
  markAllTextDisabled: {
    color: '#ccc',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#2e7d32',
    shadowColor: '#2e7d32',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  tabBadge: {
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#666',
  },
  unreadBadge: {
    backgroundColor: '#ff6b6b',
  },
  unreadBadgeText: {
    color: '#fff',
  },
  statsBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  statsText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  unreadStats: {
    fontSize: 14,
    color: '#ff6b6b',
    fontWeight: '500',
    marginLeft: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  notificationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  unreadCard: {
    backgroundColor: '#f8fff8',
    shadowOpacity: 0.1,
    elevation: 3,
  },
  cardTouchable: {
    borderRadius: 12,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  iconContainer: {
    position: 'relative',
    marginRight: 12,
    alignItems: 'center',
  },
  notificationIcon: {
    fontSize: 24,
    textAlign: 'center',
  },
  unreadDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff6b6b',
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  unreadTitle: {
    color: '#111',
    fontWeight: '700',
  },
  notificationDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 6,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  actionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8,
  },
  actionArrow: {
    fontSize: 18,
    color: '#ccc',
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 20,
  },
  hintContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f4f5f9',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  hintText: {
    fontSize: 12,
    color: '#2e7d32',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default NotificationsScreen;