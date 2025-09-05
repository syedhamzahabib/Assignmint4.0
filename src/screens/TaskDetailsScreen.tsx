import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import Icon, { Icons } from '../components/common/Icon';
import { COLORS } from '../constants';
import API from '../lib/api';

const TaskDetailsScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { taskId } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState<any>(null);

  // Mock task data
  const mockTask = {
    id: taskId || '1',
    title: 'Business Case Study Analysis',
    description: 'Analyze the competitive landscape for a new tech startup and provide strategic recommendations for market entry. The analysis should include competitor analysis, market size estimation, and go-to-market strategy.',
    budget: 500,
    deadline: '2023-12-15',
    subject: 'Business',
    urgency: 'high',
    aiLevel: 'assisted',
    status: 'open',
    postedBy: 'Sarah M.',
    postedDate: '2023-11-20',
    attachments: [
      { name: 'Case Study Brief.pdf', size: '2.3 MB' },
      { name: 'Market Data.xlsx', size: '1.1 MB' },
    ],
    requirements: [
      'Minimum 15 pages',
      'Include executive summary',
      'Use APA formatting',
      'Include 5+ sources',
    ],
    tags: ['Business Strategy', 'Market Analysis', 'Competitive Intelligence'],
  };

  useEffect(() => {
    const loadTask = async () => {
      if (!taskId) return;
      
      try {
        setLoading(true);
        const response = await API.getTask(taskId);
        console.log('📱 TaskDetails API response:', response);
        setTask(response.task);
      } catch (error: any) {
        console.error('❌ Error loading task:', error);
        Alert.alert('Error', 'Failed to load task details');
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [taskId]);

  const handleAccept = () => {
    Alert.alert(
      'Accept Task',
      'Are you sure you want to accept this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: () => {
            Alert.alert('Success', 'Task accepted! You can now start working on it.');
            navigation.navigate('MyTasks');
          },
        },
      ]
    );
  };

  const handleNegotiate = () => {
    navigation.navigate('ChatThread', {
      chat: {
        id: '1',
        name: mockTask.postedBy,
        taskTitle: mockTask.title,
      },
    });
  };

  const handleReport = () => {
    Alert.alert(
      'Report Task',
      'What issue would you like to report?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Inappropriate Content', onPress: () => Alert.alert('Reported', 'Thank you for your report.') },
        { text: 'Spam', onPress: () => Alert.alert('Reported', 'Thank you for your report.') },
        { text: 'Other', onPress: () => Alert.alert('Reported', 'Thank you for your report.') },
      ]
    );
  };

  const handleShare = () => {
    Alert.alert('Share', 'Sharing feature coming soon!');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Icon name={Icons.loading} size={32} color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading task details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!task) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name={Icons.error} size={64} color={COLORS.error} />
          <Text style={styles.errorTitle}>Task Not Found</Text>
          <Text style={styles.errorText}>The requested task could not be found.</Text>
          <TouchableOpacity style={styles.errorButton} onPress={() => navigation.goBack()}>
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} testID="taskDetails.screen">
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name={Icons.arrowBack} size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Details</Text>
        <TouchableOpacity style={styles.moreButton} onPress={handleReport}>
          <Icon name={Icons.more} size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Task Header */}
        <View style={styles.taskHeader}>
          <View style={styles.subjectBadge}>
            <Text style={styles.subjectBadgeText}>{task.subject}</Text>
          </View>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <Text style={styles.taskDescription}>{task.description}</Text>
        </View>

        {/* Task Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Icon name={Icons.money} size={20} color={COLORS.success} />
            <Text style={styles.statLabel}>Budget</Text>
            <Text style={styles.statValue}>${task.budget}</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name={Icons.time} size={20} color={COLORS.warning} />
            <Text style={styles.statLabel}>Deadline</Text>
            <Text style={styles.statValue}>{task.deadline}</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name={Icons.flash} size={20} color={COLORS.primary} />
            <Text style={styles.statLabel}>Urgency</Text>
            <Text style={styles.statValue}>{task.urgency}</Text>
          </View>
        </View>

        {/* Requirements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          {task.requirements.map((req: string, index: number) => (
            <View key={index} style={styles.requirementItem}>
              <Icon name={Icons.checkmark} size={16} color={COLORS.success} />
              <Text style={styles.requirementText}>{req}</Text>
            </View>
          ))}
        </View>

        {/* Attachments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attachments</Text>
          {task.attachments.map((file: any, index: number) => (
            <View key={index} style={styles.attachmentItem}>
              <Icon name={Icons.document} size={20} color={COLORS.primary} />
              <View style={styles.attachmentInfo}>
                <Text style={styles.attachmentName}>{file.name}</Text>
                <Text style={styles.attachmentSize}>{file.size}</Text>
              </View>
              <TouchableOpacity style={styles.downloadButton}>
                <Icon name={Icons.download} size={16} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Tags */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tags</Text>
          <View style={styles.tagsContainer}>
            {task.tags.map((tag: string, index: number) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Posted Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Posted by</Text>
          <View style={styles.postedInfo}>
            <View style={styles.userAvatar}>
              <Icon name={Icons.user} size={24} color={COLORS.textSecondary} />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{task.postedBy}</Text>
              <Text style={styles.postedDate}>Posted on {task.postedDate}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Icon name={Icons.share} size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <View style={styles.mainActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.negotiateButton]}
            onPress={handleNegotiate}
          >
            <Text style={styles.negotiateButtonText}>Negotiate</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={handleAccept}
          >
            <Text style={styles.acceptButtonText}>Accept Task</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  moreButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  errorButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  taskHeader: {
    marginTop: 20,
    marginBottom: 24,
  },
  subjectBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  subjectBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  taskTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  taskDescription: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 8,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  attachmentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  attachmentName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  attachmentSize: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  downloadButton: {
    padding: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: COLORS.gray100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: COLORS.text,
  },
  postedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  postedDate: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  shareButton: {
    padding: 12,
    marginRight: 12,
  },
  mainActions: {
    flex: 1,
    flexDirection: 'row',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  negotiateButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  acceptButton: {
    backgroundColor: COLORS.primary,
  },
  negotiateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default TaskDetailsScreen;
