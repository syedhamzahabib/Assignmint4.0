import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { COLORS } from '../constants';
import Icon, { Icons } from '../components/common/Icon';
import { useAuth } from '../state/AuthProvider';
import { GuestModeBanner } from '../components/common/GuestModeBanner';
import { taskService } from '../services/taskService';
import { Task } from '../types';
import API from '../lib/api';
import Config from 'react-native-config';
import session from '../lib/session';

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user, logout, mode, isGuestMode } = useAuth();

  const handleAccept = () => {
    Alert.alert('Accept', 'Task accepted!');
  };

  const handleNegotiate = () => {
    navigation.navigate('ChatThread', {
      chat: {
        id: '1',
        name: 'John Smith',
        taskTitle: 'Graphic Design Task',
      },
    });
  };

  const handleBestDeal = () => {
    navigation.navigate('HomeStack', { screen: 'TaskDetails', params: { taskId: '1' } });
  };

  const handleViewTask = () => {
    navigation.navigate('HomeStack', { screen: 'TaskDetails', params: { taskId: '1' } });
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  // Dev sign-in and load tasks
  useEffect(() => {
    console.log('📡 Loading tasks from API');
    console.log('🔧 API_BASE_URL:', Config.API_BASE_URL);
    
    const initializeApp = async () => {
      try {
        // Dev sign-in (replace with real auth flow later)
        const currentUser = session.getCurrentUser();
        if (!currentUser) {
          console.log('🔐 Attempting dev sign-in...');
          await session.signIn('dev@assignmint.com', 'devpassword123');
        }
        
        // Load tasks
        const response = await API.getTasks();
        console.log('📡 API response:', response);
        setTasks(response.tasks || []);
        setLoading(false);
        setRefreshing(false);
      } catch (error) {
        console.error('❌ Error initializing app:', error);
        setLoading(false);
        setRefreshing(false);
      }
    };

    initializeApp();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await API.getTasks();
      setTasks(response.tasks || []);
    } catch (error) {
      console.error('❌ Error refreshing tasks:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const formatDate = (date: Date | string) => {
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString();
    }
    return date.toLocaleDateString();
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(0)}`;
  };

  const getAILevelText = (level: number) => {
    if (level >= 70) return 'High';
    if (level >= 40) return 'Medium';
    return 'Low';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Debug Proof - Auth Mode and User Info */}
      <View style={styles.userProofContainer}>
        <Text style={styles.userProofText} testID="auth-mode">
          Mode: {mode || 'None'} | {isGuestMode ? 'Guest Mode' : user?.email || 'No user'}
        </Text>
      </View>

      {/* Guest Mode Banner */}
      <GuestModeBanner
        onSignIn={() => {
          // Navigate to auth flow
          // This will be handled by the navigation structure
        }}
        onDismiss={() => {
          // Could implement dismiss logic here
        }}
      />

      {/* Top Navigation Bar */}
      <View style={styles.topBar}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search assignments, subjects, experts..."
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Icon name={Icons.notifications} size={20} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('Messages')}
          >
            <Icon name={Icons.messages} size={20} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleLogout}
          >
            <Icon name={Icons.logout} size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Feed Content */}
      <ScrollView
        style={styles.feedContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        testID="tab.home"
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading tasks...</Text>
          </View>
        ) : tasks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name={Icons.search} size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyTitle}>No tasks available</Text>
            <Text style={styles.emptyText}>Check back later for new opportunities!</Text>
          </View>
        ) : (
          tasks.map((task) => (
            <TouchableOpacity
              key={task.taskId}
              style={styles.taskCard}
              onPress={() => navigation.navigate('HomeStack', { screen: 'TaskDetails', params: { taskId: task.taskId } })}
            >
              <View style={styles.userHeader}>
                <View style={styles.userInfo}>
                  <View style={styles.avatarPlaceholder}>
                    <Icon name={Icons.user} size={24} color={COLORS.textSecondary} />
                  </View>
                  <View style={styles.userDetails}>
                    <Text style={styles.userName}>{task.ownerName}</Text>
                    <Text style={styles.taskType}>offering {task.subject} Task</Text>
                  </View>
                </View>
              </View>

              <View style={styles.subjectBadge}>
                <Text style={styles.subjectBadgeText}>{task.subject}</Text>
              </View>

              <Text style={styles.taskTitle}>{task.title}</Text>

              {task.description && (
                <Text style={styles.taskDescription} numberOfLines={3}>
                  {task.description}
                </Text>
              )}

              <View style={styles.taskDetails}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Budget:</Text>
                  <Text style={styles.detailValue}>{formatPrice(task.price)}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Deadline:</Text>
                  <Text style={styles.detailValue}>{formatDate(task.deadlineISO)}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>AI Assistance:</Text>
                  <Text style={styles.detailValue}>{getAILevelText(task.aiLevel || 50)}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Urgency:</Text>
                  <Text style={[styles.detailValue, { 
                    color: task.urgency === 'high' ? '#FF6B6B' : 
                           task.urgency === 'medium' ? '#FFB366' : '#4ECDC4' 
                  }]}>
                    {task.urgency.charAt(0).toUpperCase() + task.urgency.slice(1)}
                  </Text>
                </View>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.acceptButton]}
                                            onPress={(e) => {
                            e.stopPropagation();
                            handleAccept();
                          }}
                        >
                          <Text style={styles.acceptButtonText}>Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.actionButton, styles.negotiateButton]}
                          onPress={(e) => {
                            e.stopPropagation();
                            handleNegotiate();
                          }}
                        >
                          <Text style={styles.negotiateButtonText}>Negotiate</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.actionButton, styles.bestDealButton]}
                          onPress={(e) => {
                            e.stopPropagation();
                            navigation.navigate('HomeStack', { screen: 'TaskDetails', params: { taskId: task.taskId } });
                          }}
                        >
                          <Text style={styles.bestDealButtonText}>View Details</Text>
                        </TouchableOpacity>
              </View>

              <View style={styles.socialButtons}>
                <TouchableOpacity style={styles.socialButton}>
                  <Icon name={Icons.like} size={16} color={COLORS.textSecondary} />
                  <Text style={styles.socialText}>Like</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Icon name={Icons.messages} size={16} color={COLORS.textSecondary} />
                  <Text style={styles.socialText}>Comment</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Icon name={Icons.share} size={16} color={COLORS.textSecondary} />
                  <Text style={styles.socialText}>Share</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
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
  userProofContainer: {
    backgroundColor: '#F0F0F0',
    padding: 8,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  userProofText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuButton: {
    padding: 8,
    marginRight: 12,
  },
  menuIcon: {
    fontSize: 24,
    color: '#000000',
  },
  searchContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInput: {
    fontSize: 16,
    color: '#000000',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  headerButtonIcon: {
    fontSize: 20,
    color: '#007AFF',
  },
  feedContainer: {
    flex: 1,
  },
  feedContent: {
    padding: 16,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userHeader: {
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 24,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 2,
  },
  taskType: {
    fontSize: 14,
    color: '#8E8E93',
  },
  subjectBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#007AFF20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  subjectBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
  },
  taskDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 16,
  },
  previewImageContainer: {
    marginBottom: 16,
  },
  previewImagePlaceholder: {
    width: '100%',
    height: 140,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  previewImageText: {
    fontSize: 32,
    marginBottom: 8,
  },
  previewImageLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  taskDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#34C759',
  },
  negotiateButton: {
    backgroundColor: '#FF9500',
  },
  bestDealButton: {
    backgroundColor: '#007AFF',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  negotiateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  bestDealButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  socialButton: {
    alignItems: 'center',
    flex: 1,
  },
  socialIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  socialText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#8E8E93',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
});

export default HomeScreen;
