import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants';
import Icon, { Icons } from '../components/common/Icon';
import { firestoreService } from '../services/firestoreService';
import { useAuth } from '../state/AuthProvider';
import { Task } from '../types/firestore';

const MyTasksScreen: React.FC = () => {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('All');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMyTasks = async () => {
    if (!user) {
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      setError(null);
      
      // Get tasks created by user (as requester)
      let createdTasks: Task[] = [];
      try {
        createdTasks = await firestoreService.getTasks({
          createdBy: user.uid,
          limit: 50,
        });
      } catch (error) {
        console.warn('⚠️ Failed to load created tasks:', error);
      }
      
      // Get tasks completed by user (as expert)
      let completedTasks: Task[] = [];
      try {
        completedTasks = await firestoreService.getTasks({
          completedBy: user.uid,
          limit: 50,
        });
      } catch (error) {
        console.warn('⚠️ Failed to load completed tasks:', error);
      }
      
      // Combine and deduplicate tasks
      const allTasks = [...createdTasks, ...completedTasks];
      const uniqueTasks = allTasks.filter((task, index, self) => 
        index === self.findIndex(t => t.id === task.id)
      );
      
      console.log('📱 MyTasks loaded:', uniqueTasks.length);
      setTasks(uniqueTasks);
    } catch (error: any) {
      console.error('❌ Error loading my tasks:', error);
      setError(error?.message || 'Failed to load tasks');
      setTasks([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadMyTasks();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadMyTasks();
  };

  const filters = [
    { id: 'All', label: 'All Tasks', icon: Icons.task },
    { id: 'Active', label: 'Active', icon: Icons.clock },
    { id: 'In Progress', label: 'In Progress', icon: Icons.check },
    { id: 'Completed', label: 'Completed', icon: Icons.check },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return COLORS.primary;
      case 'IN_PROGRESS': return COLORS.warning;
      case 'COMPLETED': return COLORS.success;
      case 'CANCELLED': return COLORS.error;
      default: return COLORS.textSecondary;
    }
  };

  const getActionButtonStyle = (action: string) => {
    switch (action) {
      case 'View': return { backgroundColor: COLORS.primary };
      case 'Edit': return { backgroundColor: COLORS.info };
      case 'Cancel': return { backgroundColor: COLORS.error };
      case 'Review': return { backgroundColor: COLORS.success };
      case 'Message': return { backgroundColor: COLORS.warning };
      default: return { backgroundColor: COLORS.primary };
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (activeFilter === 'All') {return true;}
    if (activeFilter === 'Active') {return task.status === 'open';}
    if (activeFilter === 'In Progress') {return task.status === 'in_progress';}
    if (activeFilter === 'Completed') {return task.status === 'completed';}
    return true;
  });

  const TaskCard: React.FC<{ task: any }> = ({ task }) => {
    // Calculate time remaining
    const deadline = new Date(task.deadline);
    const now = new Date();
    const timeDiff = deadline.getTime() - now.getTime();
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    let timeRemaining = '';
    if (timeDiff <= 0) {
      timeRemaining = 'Overdue';
    } else if (days > 0) {
      timeRemaining = `${days}d ${hours}h`;
    } else {
      timeRemaining = `${hours}h`;
    }

    // Check if task has auto-assigned expert
    const hasAssignedExpert = task.assignedExpert && task.assignedExpertName;
    const isAutoMatched = task.autoMatch && task.matchingType === 'auto';

    return (
      <View style={styles.taskCard}>
        <View style={styles.taskHeader}>
          <View style={styles.taskMeta}>
            <Text style={styles.taskDate}>Posted {new Date(task.createdAt).toLocaleDateString()}</Text>
            <View style={styles.statusContainer}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(task.status) }]}>
                  {task.status.replace('_', ' ')}
                </Text>
              </View>
              {isAutoMatched && (
                <View style={[styles.autoMatchBadge, { backgroundColor: COLORS.success + '20' }]}>
                  <Text style={[styles.autoMatchText, { color: COLORS.success }]}>
                    🤖 Auto
                  </Text>
                </View>
              )}
            </View>
          </View>
          <Text style={styles.taskPrice}>${task.price}</Text>
        </View>

        <Text style={styles.taskTitle}>{task.title}</Text>
        <Text style={styles.taskDescription}>{task.description}</Text>

        {/* Show assigned expert if auto-matched */}
        {hasAssignedExpert && (
          <View style={styles.assignedExpertContainer}>
            <View style={styles.assignedExpertInfo}>
              <Icon name={Icons.user} size={16} color={COLORS.success} />
              <Text style={styles.assignedExpertLabel}>Assigned Expert:</Text>
              <Text style={styles.assignedExpertName}>{task.assignedExpertName}</Text>
            </View>
            <View style={styles.assignedExpertBadge}>
              <Text style={styles.assignedExpertBadgeText}>✓ Assigned</Text>
            </View>
          </View>
        )}

        <View style={styles.taskFooter}>
          <View style={styles.taskInfo}>
            <View style={styles.timeInfo}>
              <Icon name={Icons.clock} size={16} color={COLORS.textSecondary} />
              <Text style={styles.timeText}>
                {timeRemaining === 'Overdue' ? 'Overdue' : `Due in ${timeRemaining}`}
              </Text>
            </View>
            <View style={styles.applicantsInfo}>
              <Icon name={Icons.users} size={16} color={COLORS.textSecondary} />
              <Text style={styles.applicantsText}>
                {hasAssignedExpert ? '1 expert assigned' : `${task.applicants?.length || 0} applicants`}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.actionButton, getActionButtonStyle('View')]}
            onPress={() => console.log(`View task: ${task.id}`)}
          >
            <Text style={styles.actionButtonText}>
              {hasAssignedExpert ? 'Chat' : 'View'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Icon name={Icons.menu} size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Posted Tasks</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Icon name={Icons.notifications} size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{tasks.filter(t => t.status === 'open').length}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{tasks.filter(t => t.status === 'in_progress').length}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{tasks.filter(t => t.status === 'completed').length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {tasks.length}
            </Text>
            <Text style={styles.statLabel}>Total Tasks</Text>
          </View>
        </View>

        {/* Filter Section */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Filter Tasks</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterButton,
                  activeFilter === filter.id && styles.filterButtonActive,
                ]}
                onPress={() => setActiveFilter(filter.id)}
              >
                <Icon name={filter.icon} size={20} color={activeFilter === filter.id ? COLORS.white : COLORS.textSecondary} />
                <Text style={[
                  styles.filterText,
                  activeFilter === filter.id && styles.filterTextActive,
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Loading State */}
        {loading && (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading your tasks...</Text>
          </View>
        )}

        {/* Error State */}
        {error && !loading && (
          <View style={styles.errorState}>
            <Icon name={Icons.alert} size={48} color={COLORS.error} />
            <Text style={styles.errorTitle}>Failed to load tasks</Text>
            <Text style={styles.errorDescription}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadMyTasks}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Posted Tasks Section */}
        {filteredTasks.length > 0 && (
          <View style={styles.taskSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Posted Tasks</Text>
              <Text style={styles.taskCount}>({filteredTasks.length})</Text>
            </View>
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </View>
        )}

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <View style={styles.emptyState}>
            <Icon name={Icons.task} size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyTitle}>No tasks found</Text>
            <Text style={styles.emptyDescription}>
              {activeFilter === 'All'
                ? "You haven't posted any tasks yet. Tap the Post tab to create your first task!"
                : `No ${activeFilter.toLowerCase()} tasks found. Try changing your filter.`
              }
            </Text>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    fontSize: 20,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationIcon: {
    fontSize: 18,
  },
  content: {
    flex: 1,
  },
  filterSection: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  filterScroll: {
    marginTop: SPACING.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterIcon: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  filterText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    color: COLORS.textSecondary,
  },
  filterTextActive: {
    color: COLORS.white,
  },
  taskSection: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
  },
  taskCount: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  taskCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  taskMeta: {
    flex: 1,
  },
  taskDate: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  statusText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
    textTransform: 'uppercase',
  },
  taskPrice: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
  },
  taskTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  taskDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskInfo: {
    flex: 1,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  timeIcon: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  timeText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  applicantsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  applicantsText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  actionButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptyDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: SPACING.xl,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statCard: {
    alignItems: 'center',
    width: '25%',
  },
  statNumber: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  loadingState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
  },
  loadingText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  errorState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
  },
  errorTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.error,
    marginBottom: SPACING.sm,
  },
  errorDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 20,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  autoMatchBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  autoMatchText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
    textTransform: 'uppercase',
  },
  assignedExpertContainer: {
    backgroundColor: COLORS.success + '10',
    borderRadius: 12,
    padding: SPACING.md,
    marginVertical: SPACING.sm,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.success,
  },
  assignedExpertInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  assignedExpertLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
    marginRight: SPACING.xs,
  },
  assignedExpertName: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.success,
  },
  assignedExpertBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  assignedExpertBadgeText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
  },
});

export default MyTasksScreen;
