// screens/MyTasksScreen.js - Updated with ConnectionStatusIndicator integration

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Alert,
  RefreshControl,
} from 'react-native';

// Import services
import firestoreService from '../services/FirestoreService';
import { useAppState } from '../services/AppStateManager';

// Import components
import EnhancedTaskCard from '../components/task/EnhancedTaskCard';
import FilterModal from '../components/FilterModal';
import LoadingScreen from '../components/common/LoadingScreen';
import TaskActionModal from '../components/TaskActionModal'; // For task-specific actions
import ErrorBoundary from '../components/common/ErrorBoundary';

// ADDED: Connection status imports
import ConnectionStatusIndicator, { useConnectionStatus } from '../components/common/ConnectionStatusIndicator';

const RoleToggle = ({ activeRole, onRoleChange, requesterStats, expertStats }) => (
  <View style={styles.tabContainer}>
    <TouchableOpacity
      style={[styles.roleTab, activeRole === 'requester' && styles.activeRoleTab]}
      onPress={() => onRoleChange('requester')}
    >
      <Text style={[styles.roleTabText, activeRole === 'requester' && styles.activeRoleTabText]}>
        Requester ✅
      </Text>
      <View style={styles.roleTabBadge}>
        <Text style={styles.roleTabBadgeText}>{requesterStats.total}</Text>
      </View>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.roleTab, activeRole === 'expert' && styles.activeRoleTab]}
      onPress={() => onRoleChange('expert')}
    >
      <Text style={[styles.roleTabText, activeRole === 'expert' && styles.activeRoleTabText]}>
        Expert 🎓
      </Text>
      <View style={styles.roleTabBadge}>
        <Text style={styles.roleTabBadgeText}>{expertStats.total}</Text>
      </View>
    </TouchableOpacity>
  </View>
);

const StatsCards = ({ stats }) => (
  <View style={styles.statsContainer}>
    <View style={styles.statCard}>
      <Text style={styles.statNumber}>{stats.active || 0}</Text>
      <Text style={styles.statLabel}>Active</Text>
    </View>
    <View style={styles.statCard}>
      <Text style={styles.statNumber}>{stats.completed || 0}</Text>
      <Text style={styles.statLabel}>Completed</Text>
    </View>
    <View style={styles.statCard}>
      <Text style={styles.statNumber}>{stats.overdue || 0}</Text>
      <Text style={styles.statLabel}>Overdue</Text>
    </View>
    <View style={styles.statCard}>
      <Text style={styles.statNumber}>{stats.total || 0}</Text>
      <Text style={styles.statLabel}>Total</Text>
    </View>
  </View>
);

const EmptyState = ({ role, onCreateTask, onBrowseTasks }) => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyIcon}>
      {role === 'requester' ? '📝' : '🔍'}
    </Text>
    <Text style={styles.emptyTitle}>
      {role === 'requester' ? 'No tasks posted yet' : 'No tasks accepted yet'}
    </Text>
    <Text style={styles.emptyText}>
      {role === 'requester'
        ? "Start by posting your first assignment"
        : "Browse available tasks and accept one to get started"
      }
    </Text>
    <View style={styles.emptyActions}>
      {role === 'requester' ? (
        <TouchableOpacity style={styles.emptyButton} onPress={onCreateTask}>
          <Text style={styles.emptyButtonText}>➕ Post Your First Task</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.emptyButton} onPress={onBrowseTasks}>
          <Text style={styles.emptyButtonText}>🎯 Browse Available Tasks</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const MyTasksScreen = ({ navigation }) => {
  const [userRole, setUserRole] = useState('requester');
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0, overdue: 0 });
  const [requesterStats, setRequesterStats] = useState({ total: 0 });
  const [expertStats, setExpertStats] = useState({ total: 0 });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    sortBy: 'due_date_asc',
    urgency: 'all',
    search: ''
  });

  // ADDED: TaskActionModal state
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedTaskForAction, setSelectedTaskForAction] = useState(null);
  const [actionType, setActionType] = useState(null);

  // Real-time subscriptions
  const [requesterUnsubscribe, setRequesterUnsubscribe] = useState(null);
  const [expertUnsubscribe, setExpertUnsubscribe] = useState(null);

  // Mock user ID - replace with actual auth
  const userId = 'user123';

  // ADDED: Connection status hook
  const {
    isConnected,
    isRealTime,
    lastUpdate,
    updateConnectionStatus,
    markDataUpdate,
  } = useConnectionStatus();

  // Calculate statistics from tasks
  const calculateStats = useCallback((taskList) => {
    const total = taskList.length;
    const active = taskList.filter(t =>
      ['in_progress', 'working', 'pending_review', 'awaiting_expert'].includes(t.status)
    ).length;
    const completed = taskList.filter(t =>
      ['completed', 'payment_received'].includes(t.status)
    ).length;
    const overdue = taskList.filter(t => {
      if (!t.deadline) return false;
      const due = new Date(t.deadline);
      const now = new Date();
      return due < now && !['completed', 'payment_received', 'cancelled'].includes(t.status);
    }).length;

    return { total, active, completed, overdue };
  }, []);

  // Load tasks for specific role
  const loadTasks = useCallback(async (role = userRole) => {
    try {
      setLoading(true);
      setError(null);

      const response = await firestoreService.getTasksByUser(userId, role);

      if (response.success) {
        setTasks(response.data);
        const newStats = calculateStats(response.data);
        setStats(newStats);

        if (role === 'requester') {
          setRequesterStats({ total: response.data.length, ...newStats });
        } else {
          setExpertStats({ total: response.data.length, ...newStats });
        }
      }
    } catch (err) {
      console.error(`Failed to load ${role} tasks:`, err);
      setError(err.message || `Failed to load ${role} tasks`);
    } finally {
      setLoading(false);
    }
  }, [userRole, userId, calculateStats]);

  // ADDED: Set up real-time subscriptions for both roles with connection status
  useEffect(() => {
    console.log('🔄 Setting up real-time subscriptions for My Tasks...');

    // Initial connection attempt
    updateConnectionStatus(true, false);

    // Requester tasks subscription
    const reqSub = firestoreService.subscribeToUserTasks(userId, 'requester', (response) => {
      if (response.success) {
        const newStats = calculateStats(response.data);
        setRequesterStats({ total: response.data.length, ...newStats });

        if (userRole === 'requester') {
          setTasks(response.data);
          setStats(newStats);
          setError(null);
          updateConnectionStatus(true, true); // Mark as real-time connected
          markDataUpdate(); // Update lastUpdate timestamp
        }
      } else {
        console.error('Requester tasks subscription error:', response.message);
        if (userRole === 'requester') {
          updateConnectionStatus(false, false);
        }
      }
    });

    // Expert tasks subscription
    const expSub = firestoreService.subscribeToUserTasks(userId, 'expert', (response) => {
      if (response.success) {
        const newStats = calculateStats(response.data);
        setExpertStats({ total: response.data.length, ...newStats });

        if (userRole === 'expert') {
          setTasks(response.data);
          setStats(newStats);
          setError(null);
          updateConnectionStatus(true, true); // Mark as real-time connected
          markDataUpdate();
        }
      } else {
        console.error('Expert tasks subscription error:', response.message);
        if (userRole === 'expert') {
          updateConnectionStatus(false, false);
        }
      }
    });

    setRequesterUnsubscribe(() => reqSub);
    setExpertUnsubscribe(() => expSub);

    // Cleanup subscriptions on unmount or dependency change
    return () => {
      updateConnectionStatus(false, false);
      if (reqSub) {
        console.log('🔄 Cleaning up requester tasks subscription');
        reqSub();
      }
      if (expSub) {
        console.log('🔄 Cleaning up expert tasks subscription');
        expSub();
      }
    };
  }, [userId, userRole, calculateStats, updateConnectionStatus, markDataUpdate]);

  // Handle role change
  const handleRoleChange = useCallback((newRole) => {
    if (newRole !== userRole) {
      setUserRole(newRole);
      setError(null);

      // If cached data exists, subscription callbacks will update. Otherwise, manually load.
      if ((newRole === 'requester' && requesterStats.total === 0) ||
          (newRole === 'expert' && expertStats.total === 0)) {
        loadTasks(newRole);
      }
    }
  }, [userRole, requesterStats.total, expertStats.total, loadTasks]);

  // Handle refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  }, [loadTasks]);

  // Handle task press
  const handleTaskPress = useCallback((task) => {
    navigation?.navigate('TaskDetails', {
      taskId: task.id,
      role: userRole,
      task: task
    });
  }, [navigation, userRole]);

  // Handle task actions
  const handleTaskAction = useCallback((task) => {
    const actions = [
      { text: 'Cancel', style: 'cancel' },
      {
        text: '👀 View Details',
        onPress: () => handleTaskPress(task)
      }
    ];

    if (userRole === 'expert') {
      if (task.status === 'working') {
        actions.splice(1, 0, {
          text: '📤 Upload Delivery',
          onPress: () => navigation?.navigate('UploadDelivery', { task })
        });
      } else if (task.status === 'revision_requested') {
        actions.splice(1, 0, {
          text: '🔄 Submit Revision',
          onPress: () => navigation?.navigate('UploadDelivery', { task })
        });
      }
    } else {
      // Requester-specific actions
      if (task.status === 'pending_review') {
        actions.splice(1, 0, {
          text: '✅ Review & Approve',
          onPress: () => {
            setSelectedTaskForAction(task);
            setActionType('review');
            setShowActionModal(true);
          }
        });
        actions.splice(2, 0, {
          text: '🚩 Dispute',
          onPress: () => {
            setSelectedTaskForAction(task);
            setActionType('dispute');
            setShowActionModal(true);
          }
        });
      } else if (task.status === 'awaiting_expert') {
        actions.splice(1, 0, {
          text: '✏️ Edit Task',
          onPress: () => Alert.alert('Edit Task', 'Task editing feature coming soon!')
        });
      }
    }

    Alert.alert(
      `🎯 ${task.title}`,
      `Status: ${task.status}\nPrice: ${task.price}\n${
        userRole === 'requester' && task.assignedExpertName
          ? `Expert: ${task.assignedExpertName}\n`
          : userRole === 'expert' && task.requesterName
            ? `Requester: ${task.requesterName}\n`
            : ''
      }Due: ${task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}\n\nSelect an action:`,
      actions
    );
  }, [handleTaskPress, navigation, userRole]);

  // Handle action completion from TaskActionModal
  const handleActionComplete = useCallback((action, actionData) => {
    console.log(`✅ Action ${action} completed:`, actionData);
    loadTasks(); // Refresh the task list
    setShowActionModal(false);
    setSelectedTaskForAction(null);
    setActionType(null);
  }, [loadTasks]);

  const handleCreateTask = useCallback(() => {
    navigation?.navigate('PostTask');
  }, [navigation]);

  const handleBrowseTasks = useCallback(() => {
    navigation?.navigate('Home');
  }, [navigation]);

  const handleApplyFilters = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  // Filter tasks based on filters state
  const filteredTasks = React.useMemo(() => {
    let filtered = [...tasks];

    if (filters.status !== 'all') {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    if (filters.search.trim()) {
      const query = filters.search.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.subject.toLowerCase().includes(query) ||
        (task.assignedExpertName && task.assignedExpertName.toLowerCase().includes(query)) ||
        (task.requesterName && task.requesterName.toLowerCase().includes(query))
      );
    }

    if (filters.urgency !== 'all') {
      filtered = filtered.filter(task => task.urgency === filters.urgency);
    }

    switch (filters.sortBy) {
      case 'due_date_asc':
        filtered.sort((a, b) => {
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline) - new Date(b.deadline);
        });
        break;
      case 'due_date_desc':
        filtered.sort((a, b) => {
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(b.deadline) - new Date(a.deadline);
        });
        break;
      case 'price_desc':
        filtered.sort((a, b) => {
          const priceA = parseFloat(a.price?.replace('$', '') || '0');
          const priceB = parseFloat(b.price?.replace('$', '') || '0');
          return priceB - priceA;
        });
        break;
      case 'recent':
        filtered.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.assignedAt);
          const dateB = new Date(b.createdAt || b.assignedAt);
          return dateB - dateA;
        });
        break;
    }

    return filtered;
  }, [tasks, filters]);

  // Render each task card
  const renderTaskCard = useCallback(({ item }) => (
    <EnhancedTaskCard
      task={item}
      onPress={handleTaskPress}
      onAction={handleTaskAction}
      isRequester={userRole === 'requester'}
      showActions={true}
      compact={false}
    />
  ), [handleTaskPress, handleTaskAction, userRole]);

  const handleBackPress = () => {
    if (navigation?.goBack) {
      navigation.goBack();
    }
  };

  // Initial loading view
  if (loading && tasks.length === 0 && !error) {
    return (
      <LoadingScreen
        message={`Loading your ${userRole} tasks...`}
        submessage={
          userRole === 'requester'
            ? "Fetching posted tasks and expert assignments..."
            : "Finding your accepted tasks and delivery status..."
        }
        showAnimation={true}
        size="large"
      />
    );
  }

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Tasks 📂</Text>
          <TouchableOpacity onPress={() => setShowFilterModal(true)}>
            <Text style={styles.filterButton}>Filter</Text>
          </TouchableOpacity>
        </View>

        {/* Role Toggle */}
        <RoleToggle
          activeRole={userRole}
          onRoleChange={handleRoleChange}
          requesterStats={requesterStats}
          expertStats={expertStats}
        />

        {/* ADDED: Connection Status Indicator */}
        <ConnectionStatusIndicator
          isConnected={isConnected}
          isRealTime={isRealTime}
          lastUpdate={lastUpdate}
          onRefresh={onRefresh}
          compact={true}
          style={styles.connectionStatus}
        />

        {/* Statistics */}
        <StatsCards stats={stats} />

        {/* Task Count and Instructions */}
        <View style={styles.taskCountContainer}>
          <Text style={styles.taskCount}>
            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} found
            {tasks.length !== filteredTasks.length && ` (${tasks.length} total)`}
          </Text>
          <Text style={styles.instructionText}>
            💡 Pull down to refresh • Tap cards for actions
            {userRole === 'requester' && ' • Green status = Expert assigned!'}
          </Text>
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
            <TouchableOpacity onPress={() => loadTasks()} style={styles.retryButton}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Task List or Empty State */}
        {filteredTasks.length === 0 ? (
          <EmptyState
            role={userRole}
            onCreateTask={handleCreateTask}
            onBrowseTasks={handleBrowseTasks}
          />
        ) : (
          <FlatList
            data={filteredTasks}
            keyExtractor={(item) => item.id}
            renderItem={renderTaskCard}
            contentContainerStyle={styles.taskList}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#2e7d32']}
                tintColor="#2e7d32"
              />
            }
          />
        )}

        {/* Filter Modal */}
        <FilterModal
          visible={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          onApplyFilters={handleApplyFilters}
          currentFilters={filters}
          isRequester={userRole === 'requester'}
        />

        {/* Task Action Modal */}
        <TaskActionModal
          visible={showActionModal}
          onClose={() => {
            setShowActionModal(false);
            setSelectedTaskForAction(null);
            setActionType(null);
          }}
          task={selectedTaskForAction}
          actionType={actionType}
          isRequester={userRole === 'requester'}
          onActionComplete={handleActionComplete}
          navigation={navigation}
        />
      </SafeAreaView>
    </ErrorBoundary>
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
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    backgroundColor: '#fff',
  },
  backButton: {
    fontSize: 16,
    color: '#2e7d32',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  filterButton: {
    fontSize: 16,
    color: '#2e7d32',
    fontWeight: '500',
  },

  // Role Toggle Styles
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  roleTab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  activeRoleTab: {
    backgroundColor: '#2e7d32',
    shadowColor: '#2e7d32',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  roleTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeRoleTabText: {
    color: '#fff',
  },
  roleTabBadge: {
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  roleTabBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#666',
  },

  // ADDED: Connection Status style
  connectionStatus: {
    alignSelf: 'center',
    marginVertical: 4,
  },

  // Stats Styles
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2e7d32',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },

  // Task Count & Instructions
  taskCountContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  taskCount: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  instructionText: {
    fontSize: 12,
    color: '#2e7d32',
    marginTop: 4,
    fontWeight: '500',
    lineHeight: 16,
  },

  // Error Banner
  errorBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorText: {
    fontSize: 14,
    color: '#c62828',
    flex: 1,
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  retryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  // Task List
  taskList: {
    paddingBottom: 20,
  },

  // Empty State
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
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    maxWidth: 280,
  },
  emptyActions: {
    gap: 12,
  },
  emptyButton: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#2e7d32',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default MyTasksScreen;
