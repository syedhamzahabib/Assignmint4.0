import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants';
import Icon, { Icons } from '../components/common/Icon';

interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'ACTIVE' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  price: string;
  remainingTime: string;
  applicants: number;
  action: 'View' | 'Edit' | 'Cancel' | 'Review' | 'Message';
}

const MyTasksScreen: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  // Sample posted task data - tasks the user has created
  const postedTasks: Task[] = [
    {
      id: '1',
      title: 'Calculus Assignment Help',
      description: 'Need assistance with calculus problems and concepts. Looking for someone with strong math background.',
      date: 'Posted Oct 1, 2023',
      status: 'ACTIVE',
      price: '$50',
      remainingTime: '3d 12h',
      applicants: 5,
      action: 'View'
    },
    {
      id: '2',
      title: 'Graphic Design Project',
      description: 'Create a logo and branding materials for a startup. Need modern, professional design.',
      date: 'Posted Sep 28, 2023',
      status: 'IN_PROGRESS',
      price: '$75',
      remainingTime: '2d 5h',
      applicants: 3,
      action: 'Message'
    },
    {
      id: '3',
      title: 'Content Writing Task',
      description: 'Write a 1500-word article on technology trends. SEO optimized content needed.',
      date: 'Posted Oct 5, 2023',
      status: 'ACTIVE',
      price: '$40',
      remainingTime: '5h',
      applicants: 8,
      action: 'Edit'
    },
    {
      id: '4',
      title: 'Python Web Development',
      description: 'Build a Flask web application with user authentication. Full-stack development required.',
      date: 'Posted Oct 4, 2023',
      status: 'ACTIVE',
      price: '$120',
      remainingTime: '4h',
      applicants: 2,
      action: 'View'
    },
    {
      id: '5',
      title: 'Business Case Study',
      description: 'Analyze a business case and provide strategic recommendations. MBA level analysis.',
      date: 'Posted Oct 7, 2023',
      status: 'COMPLETED',
      price: '$95',
      remainingTime: 'Completed',
      applicants: 4,
      action: 'Review'
    },
    {
      id: '6',
      title: 'Social Media Graphics',
      description: 'Design social media posts for a marketing campaign. Need 10 posts with consistent branding.',
      date: 'Posted Oct 3, 2023',
      status: 'COMPLETED',
      price: '$35',
      remainingTime: 'Completed',
      applicants: 6,
      action: 'Review'
    },
    {
      id: '7',
      title: 'Chemistry Lab Report',
      description: 'Write a comprehensive lab report for organic chemistry. Include data analysis and conclusions.',
      date: 'Posted Oct 6, 2023',
      status: 'IN_PROGRESS',
      price: '$65',
      remainingTime: '6h',
      applicants: 1,
      action: 'Message'
    },
    {
      id: '8',
      title: 'Mobile App UI Design',
      description: 'Design user interface for a fitness tracking app. Modern, clean design with good UX.',
      date: 'Posted Oct 8, 2023',
      status: 'ACTIVE',
      price: '$150',
      remainingTime: '1d 8h',
      applicants: 7,
      action: 'View'
    }
  ];

  const filters = [
    { id: 'All', label: 'All Tasks', icon: Icons.task },
    { id: 'Active', label: 'Active', icon: Icons.clock },
    { id: 'In Progress', label: 'In Progress', icon: Icons.check },
    { id: 'Completed', label: 'Completed', icon: Icons.check }
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

  const filteredTasks = postedTasks.filter(task => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Active') return task.status === 'ACTIVE';
    if (activeFilter === 'In Progress') return task.status === 'IN_PROGRESS';
    if (activeFilter === 'Completed') return task.status === 'COMPLETED';
    return true;
  });

  const TaskCard: React.FC<{ task: Task }> = ({ task }) => (
    <View style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <View style={styles.taskMeta}>
          <Text style={styles.taskDate}>{task.date}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(task.status) }]}>
              {task.status.replace('_', ' ')}
            </Text>
          </View>
        </View>
        <Text style={styles.taskPrice}>{task.price}</Text>
      </View>
      
      <Text style={styles.taskTitle}>{task.title}</Text>
      <Text style={styles.taskDescription}>{task.description}</Text>
      
      <View style={styles.taskFooter}>
        <View style={styles.taskInfo}>
          <View style={styles.timeInfo}>
            <Icon name={Icons.clock} size={16} color={COLORS.textSecondary} />
            <Text style={styles.timeText}>
              {task.remainingTime === 'Completed' ? 'Completed' : `Due in ${task.remainingTime}`}
            </Text>
          </View>
          <View style={styles.applicantsInfo}>
            <Icon name={Icons.users} size={16} color={COLORS.textSecondary} />
            <Text style={styles.applicantsText}>{task.applicants} applicants</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.actionButton, getActionButtonStyle(task.action)]}
          onPress={() => console.log(`${task.action} task: ${task.id}`)}
        >
          <Text style={styles.actionButtonText}>{task.action}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{postedTasks.filter(t => t.status === 'ACTIVE').length}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{postedTasks.filter(t => t.status === 'IN_PROGRESS').length}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{postedTasks.filter(t => t.status === 'COMPLETED').length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {postedTasks.reduce((sum, task) => sum + task.applicants, 0)}
            </Text>
            <Text style={styles.statLabel}>Total Applicants</Text>
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
                  activeFilter === filter.id && styles.filterButtonActive
                ]}
                onPress={() => setActiveFilter(filter.id)}
              >
                <Icon name={filter.icon} size={20} color={activeFilter === filter.id ? COLORS.white : COLORS.textSecondary} />
                <Text style={[
                  styles.filterText,
                  activeFilter === filter.id && styles.filterTextActive
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

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
});

export default MyTasksScreen; 