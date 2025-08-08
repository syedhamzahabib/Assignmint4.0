// screens/HomeScreen.js

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';

// Import services
import firestoreService from '../services/FirestoreService';
import { useAppState } from '../services/AppStateManager';

// Import components
import ManualMatchTaskCard from '../components/task/ManualMatchTaskCard';
import LoadingScreen, { ActionLoadingOverlay } from '../components/common/LoadingScreen';
import ErrorBoundary from '../components/common/ErrorBoundary';
import ConnectionStatusIndicator, { useConnectionStatus } from '../components/common/ConnectionStatusIndicator';

// Constants
const SUBJECTS = [
  { id: 'math', label: '📊 Math', value: 'Math' },
  { id: 'coding', label: '💻 Coding', value: 'Coding' },
  { id: 'writing', label: '✍️ Writing', value: 'Writing' },
  { id: 'design', label: '🎨 Design', value: 'Design' },
  { id: 'language', label: '🌍 Language', value: 'Language' },
  { id: 'science', label: '🔬 Science', value: 'Science' },
  { id: 'business', label: '💼 Business', value: 'Business' },
  { id: 'chemistry', label: '🧪 Chemistry', value: 'Chemistry' },
  { id: 'physics', label: '⚡ Physics', value: 'Physics' },
  { id: 'psychology', label: '🧠 Psychology', value: 'Psychology' },
  { id: 'other', label: '📋 Other', value: 'Other' },
];

const URGENCY_LEVELS = [
  { id: 'high', label: '🔥 High Priority', value: 'high' },
  { id: 'medium', label: '⚡ Medium Priority', value: 'medium' },
  { id: 'low', label: '🌱 Low Priority', value: 'low' },
];

const HomeScreen = ({ navigation }) => {
  // State management
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [acceptingTask, setAcceptingTask] = useState(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedUrgency, setSelectedUrgency] = useState('all');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Real-time subscription
  const [unsubscribe, setUnsubscribe] = useState(null);

  // App state for user role detection
  const { userRole } = useAppState();

  // Connection status hook
  const {
    isConnected,
    isRealTime,
    lastUpdate,
    updateConnectionStatus,
    markDataUpdate,
  } = useConnectionStatus();

  // Mock current user - replace with actual auth
  const currentUser = {
    id: 'expert123',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    rating: 4.8,
    completedTasks: 47,
    specialties: ['Math', 'Physics', 'Engineering'],
  };

  // Load manual match tasks
  const loadTasks = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) setLoading(true);
        setError(null);

        const filters = {
          subject:
            selectedSubjects.length === 1 ? selectedSubjects[0] : 'all',
          urgency: selectedUrgency,
          maxPrice: maxPrice ? parseFloat(maxPrice) : null,
          limit: 20,
        };

        let response;
        if (searchQuery.trim()) {
          response = await firestoreService.searchManualTasks(
            searchQuery,
            filters
          );
        } else {
          response = await firestoreService.getAvailableManualTasks(
            filters
          );
        }

        if (response.success) {
          setTasks(response.data);
          console.log(
            `📋 Loaded ${response.data.length} manual match tasks`
          );
        } else {
          setError(response.message);
          console.error('Failed to load tasks:', response.message);
        }
      } catch (error) {
        console.error('Error loading manual tasks:', error);
        setError('Failed to load tasks. Please try again.');
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [searchQuery, selectedSubjects, selectedUrgency, maxPrice]
  );

  // Set up real-time subscription for manual match tasks
  useEffect(() => {
    console.log(
      '🔄 Setting up real-time manual tasks subscription...'
    );

    const filters = {
      subject:
        selectedSubjects.length === 1 ? selectedSubjects[0] : 'all',
      urgency: selectedUrgency,
      sortBy: 'recent',
      limit: 20,
    };

    // Update connection status (initial attempt)
    updateConnectionStatus(true, false);

    const subscription = firestoreService.subscribeToManualTasks(
      filters,
      (response) => {
        if (response.success) {
          setTasks(response.data);
          setError(null);
          // Mark as real-time connected and record last update
          updateConnectionStatus(true, true);
          markDataUpdate();
          console.log(
            `🔄 Real-time update: ${response.data.length} manual tasks`
          );
        } else {
          setError(response.message);
          updateConnectionStatus(false, false);
          console.error(
            'Manual tasks subscription error:',
            response.message
          );
        }

        // Hide loading after first update
        if (loading) {
          setLoading(false);
        }
      }
    );

    if (subscription) {
      setUnsubscribe(() => subscription);
    } else {
      updateConnectionStatus(false, false);
      // Fallback to manual loading if subscription fails
      loadTasks();
    }

    // Cleanup subscription
    return () => {
      if (subscription) {
        console.log('🔄 Cleaning up manual tasks subscription');
        updateConnectionStatus(false, false);
        subscription();
      }
    };
  }, [selectedSubjects, selectedUrgency]);

  // Handle search with debouncing
  const handleSearch = useCallback(
    (query) => {
      setSearchQuery(query);

      // Debounce search
      const searchTimeout = setTimeout(() => {
        if (query.trim()) {
          loadTasks(false);
        }
      }, 500);

      return () => clearTimeout(searchTimeout);
    },
    [loadTasks]
  );

  // Handle refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTasks(false);
    setRefreshing(false);
  }, [loadTasks]);

  // Handle task acceptance
  const handleAcceptTask = useCallback(
    async (task) => {
      try {
        setAcceptingTask(task.id);

        console.log(
          '🎯 Expert accepting manual task:',
          task.title
        );

        // Show confirmation with task details
        Alert.alert(
          '🎯 Accept Manual Match Task',
          `Do you want to accept "${task.title}"?\n\nPrice: ${task.price}\nSubject: ${task.subject}\nRequester: ${task.requesterName}\nDeadline: ${new Date(
            task.deadline
          ).toLocaleDateString()}\n\n⚠️ Once accepted, you'll be assigned and can start working immediately.`,
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => setAcceptingTask(null),
            },
            {
              text: 'Accept Task',
              style: 'default',
              onPress: async () => {
                try {
                  const response = await firestoreService.acceptManualTask(
                    task.id,
                    currentUser.id,
                    currentUser
                  );

                  if (response.success) {
                    Alert.alert(
                      '🎉 Task Accepted Successfully!',
                      `You've been assigned to "${task.title}"!\n\nThe requester has been notified and you can now start working. The task has moved to your "My Tasks" section.`,
                      [
                        {
                          text: 'Start Working',
                          onPress: () =>
                            navigation?.navigate('UploadDelivery', {
                              task: {
                                ...task,
                                status: 'working',
                                assignedExpertId: currentUser.id,
                              },
                            }),
                        },
                        {
                          text: 'View My Tasks',
                          onPress: () =>
                            navigation?.navigate('MyTasks'),
                        },
                        {
                          text: 'Continue Browsing',
                          style: 'cancel',
                        },
                      ]
                    );

                    // Remove task from local state
                    setTasks((prev) =>
                      prev.filter((t) => t.id !== task.id)
                    );
                  } else {
                    Alert.alert(
                      'Unable to Accept Task',
                      response.message ||
                        'This task may no longer be available. Please try another task.',
                      [{ text: 'OK' }]
                    );
                  }
                } catch (error) {
                  console.error('Error accepting task:', error);
                  Alert.alert(
                    'Error',
                    'Failed to accept task. Please check your connection and try again.',
                    [{ text: 'OK' }]
                  );
                } finally {
                  setAcceptingTask(null);
                }
              },
            },
          ]
        );
      } catch (error) {
        console.error('Error in accept task handler:', error);
        Alert.alert(
          'Error',
          'Something went wrong. Please try again.'
        );
        setAcceptingTask(null);
      }
    },
    [currentUser, navigation]
  );

  // Handle view task details
  const handleViewTaskDetails = useCallback(
    (task) => {
      // Increment view count
      firestoreService.incrementTaskViews(task.id);

      // Navigate to task details
      navigation?.navigate('TaskDetails', {
        taskId: task.id,
        role: 'expert',
        task: task,
        isManualMatch: true,
      });
    },
    [navigation]
  );

  // Toggle subject selection
  const toggleSubjectSelection = useCallback((subjectValue) => {
    setSelectedSubjects((prev) => {
      const lowercaseValue = subjectValue.toLowerCase();
      if (prev.includes(lowercaseValue)) {
        return prev.filter((s) => s !== lowercaseValue);
      } else {
        return [...prev, lowercaseValue];
      }
    });
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedSubjects([]);
    setSelectedUrgency('all');
    setMaxPrice('');
  }, []);

  // Check if any filters are active
  const hasActiveFilters =
    searchQuery.trim() ||
    selectedSubjects.length > 0 ||
    selectedUrgency !== 'all' ||
    maxPrice.trim();

  // Filter tasks based on search and filters (client-side filtering for real-time updates)
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.subject.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.requesterName?.toLowerCase().includes(query)
      );
    }

    // Apply subject filter (client-side for real-time updates)
    if (selectedSubjects.length > 0) {
      filtered = filtered.filter((task) =>
        selectedSubjects.includes(task.subject.toLowerCase())
      );
    }

    // Apply urgency filter (client-side)
    if (selectedUrgency !== 'all') {
      filtered = filtered.filter(
        (task) => task.urgency === selectedUrgency
      );
    }

    // Apply price filter (client-side)
    if (maxPrice) {
      const maxPriceNum = parseFloat(maxPrice);
      filtered = filtered.filter((task) => {
        const taskPrice = parseFloat(task.price.replace('$', ''));
        return taskPrice <= maxPriceNum;
      });
    }

    // Sort by creation date (newest first)
    filtered.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return filtered;
  }, [tasks, searchQuery, selectedSubjects, selectedUrgency, maxPrice]);

  // Render task card
  const renderTaskCard = useCallback(
    ({ item }) => (
      <ManualMatchTaskCard
        task={item}
        onAccept={handleAcceptTask}
        onViewDetails={handleViewTaskDetails}
        isAccepting={acceptingTask === item.id}
      />
    ),
    [handleAcceptTask, handleViewTaskDetails, acceptingTask]
  );

  // Show different content for requesters
  if (userRole === 'requester') {
    return (
      <View style={styles.container}>
        <View style={styles.roleMessageContainer}>
          <Text style={styles.roleMessageIcon}>👑</Text>
          <Text style={styles.roleMessageTitle}>
            Requester Dashboard
          </Text>
          <Text style={styles.roleMessageText}>
            As a requester, you post tasks and experts can find
            them. Check your "My Tasks" section to see posted tasks
            and track progress.
          </Text>
          <View style={styles.roleActionButtons}>
            <TouchableOpacity
              style={styles.roleMessageButton}
              onPress={() => navigation?.navigate('MyTasks')}
            >
              <Text style={styles.roleMessageButtonText}>
                📂 View My Tasks
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.roleMessageButton,
                styles.roleMessageButtonSecondary,
              ]}
              onPress={() => navigation?.navigate('PostTask')}
            >
              <Text
                style={[
                  styles.roleMessageButtonText,
                  styles.roleMessageButtonTextSecondary,
                ]}
              >
                ➕ Post New Task
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // Loading state
  if (loading && tasks.length === 0) {
    return (
      <LoadingScreen
        message="Loading available tasks..."
        submessage="Finding manual match opportunities for experts"
      />
    );
  }

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.header}>
                🎯 Expert Marketplace
              </Text>
              <Text style={styles.headerSubtitle}>
                Manual Match Tasks • Choose your assignments
              </Text>
            </View>
            <TouchableOpacity
              style={styles.myTasksButton}
              onPress={() => navigation?.navigate('MyTasks')}
            >
              <Text style={styles.myTasksButtonText}>
                📂 My Tasks
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.resultContainer}>
            <Text style={styles.resultCount}>
              {filteredTasks.length} task
              {filteredTasks.length !== 1 ? 's' : ''} available
              {tasks.length !== filteredTasks.length &&
                ` (${tasks.length} total)`}
            </Text>
            {hasActiveFilters && (
              <TouchableOpacity
                onPress={clearAllFilters}
                style={styles.clearButton}
              >
                <Text style={styles.clearButtonText}>
                  Clear All
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Connection Status */}
        <ConnectionStatusIndicator
          isConnected={isConnected}
          isRealTime={isRealTime}
          lastUpdate={lastUpdate}
          onRefresh={() => loadTasks(false)}
          compact={true}
          style={styles.connectionStatus}
        />

        {/* Search and Filter Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search tasks by title, subject, or requester..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={handleSearch}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.clearSearchButton}
              >
                <Text style={styles.clearSearchText}>✕</Text>
              </TouchableOpacity>
            )}

            {/* Filter Button */}
            <TouchableOpacity
              onPress={() => setShowFilterModal(true)}
              style={[
                styles.filterButton,
                hasActiveFilters && styles.filterButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.filterIcon,
                  hasActiveFilters && styles.filterIconActive,
                ]}
              >
                ⚙️
              </Text>
              {hasActiveFilters && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>
                    {[
                      selectedSubjects.length > 0,
                      selectedUrgency !== 'all',
                      maxPrice.trim(),
                    ].filter(Boolean).length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <View style={styles.activeFiltersContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.activeFiltersContent}
            >
              {selectedSubjects.map((subject) => {
                const subjectData = SUBJECTS.find(
                  (s) => s.value.toLowerCase() === subject
                );
                return (
                  <View key={subject} style={styles.filterChip}>
                    <Text style={styles.filterChipText}>
                      {subjectData?.label || subject}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        toggleSubjectSelection(
                          subjectData?.value || subject
                        )
                      }
                      style={styles.filterChipRemove}
                    >
                      <Text style={styles.filterChipRemoveText}>
                        ✕
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}

              {selectedUrgency !== 'all' && (
                <View style={styles.filterChip}>
                  <Text style={styles.filterChipText}>
                    {
                      URGENCY_LEVELS.find(
                        (u) => u.value === selectedUrgency
                      )?.label || selectedUrgency
                    }
                  </Text>
                  <TouchableOpacity
                    onPress={() => setSelectedUrgency('all')}
                    style={styles.filterChipRemove}
                  >
                    <Text style={styles.filterChipRemoveText}>
                      ✕
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {maxPrice.trim() && (
                <View style={styles.filterChip}>
                  <Text style={styles.filterChipText}>
                    Max ${maxPrice}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setMaxPrice('')}
                    style={styles.filterChipRemove}
                  >
                    <Text style={styles.filterChipRemoveText}>
                      ✕
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        )}

        {/* Task List */}
        {filteredTasks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>
              {hasActiveFilters ? '🔍' : '🎯'}
            </Text>
            <Text style={styles.emptyTitle}>
              {hasActiveFilters
                ? 'No tasks match your filters'
                : 'No manual match tasks available'}
            </Text>
            <Text style={styles.emptyText}>
              {hasActiveFilters
                ? 'Try adjusting your search criteria or check back later for new opportunities'
                : 'Check back soon for new manual match assignments! Experts can choose tasks that match their skills.'}
            </Text>
            {hasActiveFilters && (
              <TouchableOpacity
                onPress={clearAllFilters}
                style={styles.emptyButton}
              >
                <Text style={styles.emptyButtonText}>
                  Clear Filters
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.emptyButton, styles.emptyButtonSecondary]}
              onPress={() => loadTasks()}
            >
              <Text
                style={[
                  styles.emptyButtonText,
                  styles.emptyButtonTextSecondary,
                ]}
              >
                🔄 Refresh Feed
              </Text>
            </TouchableOpacity>
          </View>
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
            ListHeaderComponent={
              <View style={styles.listHeader}>
                <Text style={styles.instructionText}>
                  💡 Pull down to refresh • Tap to view details • Accept
                  to claim tasks
                </Text>
                {error && (
                  <View style={styles.errorBanner}>
                    <Text style={styles.errorText}>
                      ⚠️ {error}
                    </Text>
                    <TouchableOpacity
                      onPress={() => loadTasks()}
                      style={styles.retryButton}
                    >
                      <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            }
            onEndReached={() => {
              // Load more tasks if needed
              if (tasks.length >= 20) {
                console.log('📄 Load more tasks...');
              }
            }}
            onEndReachedThreshold={0.1}
          />
        )}

        {/* Filter Modal */}
        <Modal
          visible={showFilterModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowFilterModal(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowFilterModal(false)}
          >
            <Pressable style={styles.modalContent}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Filter Tasks</Text>
                <TouchableOpacity
                  onPress={() => setShowFilterModal(false)}
                  style={styles.modalCloseButton}
                >
                  <Text style={styles.modalCloseText}>Done</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.modalScrollView}
                showsVerticalScrollIndicator={false}
              >
                {/* Subjects Filter */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>
                    📚 Subjects
                  </Text>
                  <View style={styles.subjectGrid}>
                    {SUBJECTS.map((subject) => {
                      const isSelected = selectedSubjects.includes(
                        subject.value.toLowerCase()
                      );
                      return (
                        <TouchableOpacity
                          key={subject.id}
                          style={[
                            styles.subjectItem,
                            isSelected && styles.subjectItemSelected,
                          ]}
                          onPress={() =>
                            toggleSubjectSelection(subject.value)
                          }
                        >
                          <Text
                            style={[
                              styles.subjectItemText,
                              isSelected &&
                                styles.subjectItemTextSelected,
                            ]}
                          >
                            {subject.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Urgency Filter */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>
                    ⚡ Priority Level
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.urgencyItem,
                      selectedUrgency === 'all' &&
                        styles.urgencyItemSelected,
                    ]}
                    onPress={() => setSelectedUrgency('all')}
                  >
                    <Text
                      style={[
                        styles.urgencyItemText,
                        selectedUrgency === 'all' &&
                          styles.urgencyItemTextSelected,
                      ]}
                    >
                      📋 All Priorities
                    </Text>
                  </TouchableOpacity>

                  {URGENCY_LEVELS.map((urgency) => {
                    const isSelected =
                      selectedUrgency === urgency.value;
                    return (
                      <TouchableOpacity
                        key={urgency.id}
                        style={[
                          styles.urgencyItem,
                          isSelected && styles.urgencyItemSelected,
                        ]}
                        onPress={() => setSelectedUrgency(urgency.value)}
                      >
                        <Text
                          style={[
                            styles.urgencyItemText,
                            isSelected &&
                              styles.urgencyItemTextSelected,
                          ]}
                        >
                          {urgency.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Price Filter */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>
                    💰 Maximum Price
                  </Text>
                  <View style={styles.priceInputContainer}>
                    <Text style={styles.priceSymbol}>$</Text>
                    <TextInput
                      style={styles.priceInput}
                      placeholder="100"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                      value={maxPrice}
                      onChangeText={(text) => {
                        const cleanText = text.replace(/[^0-9.]/g, '');
                        setMaxPrice(cleanText);
                      }}
                      maxLength={6}
                    />
                  </View>
                  {maxPrice.trim() && (
                    <Text style={styles.priceHint}>
                      Show tasks up to ${maxPrice}
                    </Text>
                  )}
                </View>

                {/* Clear Filters Button */}
                <TouchableOpacity
                  style={styles.clearFiltersButton}
                  onPress={clearAllFilters}
                >
                  <Text style={styles.clearFiltersButtonText}>
                    Clear All Filters
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>

        {/* Enhanced Loading overlay for task acceptance */}
        {acceptingTask && (
          <ActionLoadingOverlay
            visible={!!acceptingTask}
            message="Accepting task..."
            submessage="Assigning you to this manual match task..."
            onCancel={() => {
              Alert.alert(
                'Cancel Task Acceptance',
                'Are you sure you want to cancel accepting this task?',
                [
                  { text: 'Continue Accepting', style: 'cancel' },
                  { 
                    text: 'Cancel', 
                    style: 'destructive',
                    onPress: () => setAcceptingTask(null)
                  }
                ]
              );
            }}
          />
        )}
      </View>
    </ErrorBoundary>
  );
}; // End of HomeScreen component

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f5f9',
  },

  // Role message for requesters
  roleMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  roleMessageIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  roleMessageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  roleMessageText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    maxWidth: 320,
  },
  roleActionButtons: {
    gap: 12,
    width: '100%',
    maxWidth: 280,
  },
  roleMessageButton: {
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
  roleMessageButtonSecondary: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#2e7d32',
    shadowOpacity: 0,
    elevation: 0,
  },
  roleMessageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  roleMessageButtonTextSecondary: {
    color: '#2e7d32',
  },

  // Header
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  header: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  myTasksButton: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: '#2e7d32',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  myTasksButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  resultContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  clearButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  // Connection status indicator
  connectionStatus: {
    alignSelf: 'center',
    marginVertical: SPACING.xs,
  },

  // Search and filter
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  searchBar: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    color: '#666',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111',
    paddingVertical: 12,
  },
  clearSearchButton: {
    padding: 4,
    marginHorizontal: 4,
  },
  clearSearchText: {
    fontSize: 16,
    color: '#999',
    fontWeight: 'bold',
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    marginLeft: 4,
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: '#e8f5e8',
  },
  filterIcon: {
    fontSize: 18,
    color: '#666',
  },
  filterIconActive: {
    color: '#2e7d32',
  },
  filterBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#ff6b6b',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Active filters
  activeFiltersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
  activeFiltersContent: {
    paddingRight: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e8',
    borderRadius: 20,
    paddingVertical: 6,
    paddingLeft: 12,
    paddingRight: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  filterChipText: {
    fontSize: 14,
    color: '#2e7d32',
    fontWeight: '500',
    marginRight: 6,
  },
  filterChipRemove: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4caf50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterChipRemoveText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Task list
  listHeader: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  instructionText: {
    fontSize: 12,
    color: '#2e7d32',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 8,
  },
  errorBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
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
  taskList: {
    paddingBottom: 20,
  },

  // Empty state
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
    marginBottom: 24,
    maxWidth: 300,
  },
  emptyButton: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  emptyButtonSecondary: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#2e7d32',
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyButtonTextSecondary: {
    color: '#2e7d32',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  modalCloseButton: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalScrollView: {
    paddingHorizontal: 20,
  },

  // Filter sections
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },

  // Subject filter
  subjectGrid: {
    gap: 8,
  },
  subjectItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  subjectItemSelected: {
    backgroundColor: '#e8f5e8',
    borderColor: '#2e7d32',
  },
  subjectItemText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  subjectItemTextSelected: {
    color: '#2e7d32',
    fontWeight: '600',
  },

  // Urgency filter
  urgencyItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  urgencyItemSelected: {
    backgroundColor: '#e8f5e8',
    borderColor: '#2e7d32',
  },
  urgencyItemText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  urgencyItemTextSelected: {
    color: '#2e7d32',
    fontWeight: '600',
  },

  // Price filter
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  priceSymbol: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2e7d32',
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#111',
    fontWeight: '600',
  },
  priceHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },

  // Clear filters button
  clearFiltersButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  clearFiltersButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },

  // Loading overlay (no longer used here)
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
    marginTop: 16,
    fontWeight: '500',
  },
});

export default HomeScreen;
