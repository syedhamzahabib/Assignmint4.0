// screens/ProfileScreen.js - Enhanced with Expert Profile
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Animated,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

// Import existing components
import ProfileHeader from '../components/profile/ProfileHeader';
import StatsCards from '../components/profile/StatsCards';
import SpendingChart from '../components/profile/SpendingChart';
import TaskOverview from '../components/profile/TaskOverview';
import { ExpertsList } from '../components/profile/ExpertCard';
import { PaymentMethodsList } from '../components/profile/PaymentMethodCard';
import WalletPreview from '../components/profile/WalletPreview';
import SettingsSection from '../components/profile/SettingsSection';

// Import new Expert components
import ExpertHeader from '../components/profile/expert/ExpertHeader';
import SubjectStats from '../components/profile/expert/SubjectStats';
import RatingsSummary from '../components/profile/expert/RatingsSummary';
import TaskHistory from '../components/profile/expert/TaskHistory';
import BadgesPlaceholder from '../components/profile/expert/BadgesPlaceholder';

// Import modals
import StatsModal from '../components/profile/modals/StatsModal';
import AchievementsModal from '../components/profile/modals/AchievementsModal';

// Enhanced Mock API with Expert Profile data
const ProfileAPI = {
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  async getUserProfile() {
    await this.delay(800);
    return {
      success: true,
      data: {
        id: 'user123',
        nickname: 'Sarah M.',
        email: 'sarah.m@example.com',
        joinDate: '2024-01-15',
        avatar: '👩‍💼',
        memberSince: 156, // days
        
        // Enhanced Expert Profile
        expertProfile: {
          bio: 'Math & coding expert with 5+ years of tutoring experience. I love helping students understand complex concepts!',
          specialties: ['Math', 'Physics', 'Coding'],
          availableHours: 'Mon-Fri 9AM-8PM PST',
          responseTime: '< 2 hours',
          isVerified: true,
          portfolioItems: [
            { type: 'sample', title: 'Calculus Problem Solutions', url: '#' },
            { type: 'certificate', title: 'MIT Mathematics Certificate', url: '#' }
          ]
        },
        
        // Enhanced Expert Stats
        expertStats: {
          tasksCompleted: 47,
          totalEarned: 1285.00,
          avgRating: 4.8,
          totalReviews: 42,
          responseTime: '1.8 hours',
          completionRate: 96,
          currentBalance: 245.25,
          onTimeDelivery: 98,
          repeatClients: 18,
          
          // Subject breakdown
          subjectStats: [
            {
              name: 'Math',
              taskCount: 22,
              avgRating: 4.9,
              totalEarned: 580.00,
              lastTask: 'Advanced Calculus Problems',
              lastTaskDate: '2 days ago'
            },
            {
              name: 'Physics',
              taskCount: 15,
              avgRating: 4.7,
              totalEarned: 425.00,
              lastTask: 'Quantum Mechanics Homework',
              lastTaskDate: '1 week ago'
            },
            {
              name: 'Coding',
              taskCount: 10,
              avgRating: 4.8,
              totalEarned: 280.00,
              lastTask: 'Python Data Analysis Script',
              lastTaskDate: '3 days ago'
            }
          ],
          
          // Task history
          taskHistory: [
            {
              id: 'exp_task_1',
              title: 'Advanced Calculus Integration Problems',
              subject: 'Math',
              price: '$35',
              requesterName: 'David Chen',
              status: 'payment_received',
              rating: 5,
              completedDate: '2025-05-23',
              feedback: 'Excellent work with clear explanations!'
            },
            {
              id: 'exp_task_2',
              title: 'Python Data Visualization Script',
              subject: 'Coding',
              price: '$28',
              requesterName: 'Lisa Park',
              status: 'completed',
              rating: 5,
              completedDate: '2025-05-20',
              feedback: 'Perfect code and great documentation.'
            },
            {
              id: 'exp_task_3',
              title: 'Quantum Physics Problem Set',
              subject: 'Physics',
              price: '$32',
              requesterName: 'Mike Johnson',
              status: 'delivered',
              completedDate: '2025-05-18'
            },
            {
              id: 'exp_task_4',
              title: 'Linear Algebra Matrix Operations',
              subject: 'Math',
              price: '$25',
              requesterName: 'Emma Wilson',
              status: 'working',
              acceptedDate: '2025-05-24'
            }
          ],
          
          // Ratings breakdown
          ratingsData: {
            avgRating: 4.8,
            totalReviews: 42,
            individualRatings: [5,5,5,4,5,5,4,5,5,5,4,5,5,5,3,5,5,4,5,5,5,4,5,5,5,4,5,5,5,5,5,4,5,5,5,4,5,5,5,5,5,4], // Sample ratings
            responseRate: 98,
            onTimeDelivery: 96,
            repeatClients: 18,
            recentReviews: [
              {
                rating: 5,
                comment: 'Amazing work! Sarah explained everything clearly and delivered early.',
                requesterName: 'David C.',
                date: '2 days ago',
              },
              {
                rating: 5,
                comment: 'Best expert I\'ve worked with. Will definitely hire again!',
                requesterName: 'Lisa P.',
                date: '5 days ago',
              },
              {
                rating: 4,
                comment: 'Good work, minor formatting issues but overall satisfied.',
                requesterName: 'Mike J.',
                date: '1 week ago',
              }
            ]
          }
        },
        
        // Existing requester stats (same as before)
        requesterStats: {
          tasksPosted: 23,
          totalSpent: 845.50,
          avgRating: 4.8,
          completedTasks: 20,
          cancelledTasks: 2,
          disputedTasks: 1,
          avgResponseTime: '2.3 hours',
          preferredSubjects: ['Math', 'Coding', 'Writing'],
          monthlySpending: [
            { month: 'Jan', amount: 125 },
            { month: 'Feb', amount: 180 },
            { month: 'Mar', amount: 220 },
            { month: 'Apr', amount: 195 },
            { month: 'May', amount: 125.50 },
          ],
          recentActivity: [
            { date: '2025-05-23', action: 'Approved task', task: 'Python Script Debug' },
            { date: '2025-05-21', action: 'Posted new task', task: 'Statistics Analysis' },
            { date: '2025-05-19', action: 'Disputed task', task: 'Chemistry Lab Report' },
          ]
        },
        
        // Rest of existing data...
        preferences: {
          theme: 'light',
          notifications: {
            taskUpdates: true,
            messages: true,
            payments: true,
            marketing: false,
            weeklyDigest: true,
          },
          privacy: {
            profileVisible: true,
            showStats: true,
            allowMessages: true,
            showActivity: false,
          },
          communication: {
            preferredLanguage: 'English',
            timezone: 'PST',
            autoResponder: false,
          }
        },
        
        favoriteExperts: [
          { 
            id: 'exp1', 
            name: 'Alex Kumar', 
            rating: 4.9, 
            completedTasks: 15, 
            subject: 'Coding',
            lastWorked: '2025-05-20',
            totalPaid: 185.00,
            avgDeliveryTime: '1.8 days'
          },
          { 
            id: 'exp2', 
            name: 'Emily Rodriguez', 
            rating: 4.7, 
            completedTasks: 8, 
            subject: 'Writing',
            lastWorked: '2025-05-15',
            totalPaid: 120.00,
            avgDeliveryTime: '2.1 days'
          },
        ],
        
        paymentMethods: [
          { 
            id: 'pm1', 
            type: 'card', 
            name: 'Visa •••• 4242', 
            isDefault: true,
            expiryMonth: 12,
            expiryYear: 2027,
            lastUsed: '2025-05-23'
          },
          { 
            id: 'pm2', 
            type: 'paypal', 
            name: 'PayPal Account', 
            isDefault: false,
            email: 'sarah.m@example.com',
            lastUsed: '2025-05-01'
          },
        ],
        
        achievements: [
          { id: 'first_task', name: 'First Task Posted', icon: '🎯', unlocked: true, date: '2024-01-18' },
          { id: 'five_star', name: '5-Star Requester', icon: '⭐', unlocked: true, date: '2024-02-10' },
          { id: 'big_spender', name: 'Big Spender ($500+)', icon: '💰', unlocked: true, date: '2024-04-15' },
          { id: 'expert_finder', name: 'Expert Finder (10+ tasks)', icon: '🔍', unlocked: true, date: '2024-03-20' },
          { id: 'speed_poster', name: 'Speed Poster', icon: '⚡', unlocked: false, date: null },
        ],
        
        quickStats: {
          tasksThisMonth: 5,
          avgTaskValue: 36.76,
          favoriteTimeOfDay: 'Evening',
          mostUsedSubject: 'Math',
          successRate: 95,
        }
      }
    };
  },
  
  async updateProfile(updates) {
    await this.delay(1200);
    console.log('📝 Updating profile:', updates);
    
    if (updates.nickname && updates.nickname.length < 2) {
      throw { success: false, message: 'Nickname must be at least 2 characters' };
    }
    
    if (updates.bio && updates.bio.length > 120) {
      throw { success: false, message: 'Bio must be less than 120 characters' };
    }
    
    return { success: true, message: 'Profile updated successfully! ✨' };
  },
  
  async toggleFavoriteExpert(expertId, shouldFavorite) {
    await this.delay(600);
    return { 
      success: true, 
      message: shouldFavorite ? 'Expert added to favorites!' : 'Expert removed from favorites' 
    };
  },
};

const ProfileScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('requester');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [profile, fadeAnim]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await ProfileAPI.getUserProfile();
      if (response.success) {
        setProfile(response.data);
        
        // Auto-determine tab based on activity
        const hasExpertActivity = response.data.expertStats.tasksCompleted > 0;
        const hasRequesterActivity = response.data.requesterStats.tasksPosted > 0;
        
        if (hasExpertActivity && hasRequesterActivity) {
          // If user is active in both, default to expert if they have more expert activity
          setActiveTab(
            response.data.expertStats.tasksCompleted >= response.data.requesterStats.tasksPosted 
              ? 'expert' : 'requester'
          );
        } else if (hasExpertActivity) {
          setActiveTab('expert');
        } else {
          setActiveTab('requester');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  };

  const handleUpdateNickname = async (newNickname) => {
    try {
      const response = await ProfileAPI.updateProfile({ nickname: newNickname });
      if (response.success) {
        setProfile(prev => ({ ...prev, nickname: newNickname }));
        Alert.alert('Success! 🎉', response.message);
      }
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateBio = async (newBio) => {
    try {
      const response = await ProfileAPI.updateProfile({ bio: newBio });
      if (response.success) {
        setProfile(prev => ({ 
          ...prev, 
          expertProfile: { ...prev.expertProfile, bio: newBio }
        }));
        Alert.alert('Success! 🎉', response.message);
      }
    } catch (error) {
      throw error;
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'stats':
        setShowStatsModal(true);
        break;
      case 'achievements':
        setShowAchievementsModal(true);
        break;
      case 'wallet':
      case 'earnings':
        navigation && navigation.navigate('Wallet');
        break;
      case 'portfolio':
        Alert.alert('Portfolio', 'Portfolio feature coming soon! 💼');
        break;
      case 'reviews':
        Alert.alert('Reviews', 'Detailed reviews feature coming soon! ⭐');
        break;
    }
  };

  const handleFavoriteToggle = async (expertId, isFavorited) => {
    try {
      const response = await ProfileAPI.toggleFavoriteExpert(expertId, !isFavorited);
      if (response.success) {
        setProfile(prev => ({
          ...prev,
          favoriteExperts: isFavorited 
            ? prev.favoriteExperts.filter(e => e.id !== expertId)
            : [...prev.favoriteExperts]
        }));
        Alert.alert('Updated!', response.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

  const handleHireExpert = (expert) => {
    Alert.alert(
      '🎯 Hire Expert',
      `Would you like to create a new task for ${expert.name}?\n\nThey specialize in ${expert.subject} and have completed ${expert.completedTasks} tasks with a ${expert.rating}⭐ rating.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Create Task', onPress: () => {
          Alert.alert('Coming Soon!', 'Expert hiring integration coming soon!');
        }}
      ]
    );
  };

  const handleWalletActions = {
    onOpenWallet: () => navigation && navigation.navigate('Wallet'),
    onQuickWithdraw: () => navigation && navigation.navigate('Wallet', { action: 'withdraw' }),
  };

  const handlePaymentActions = {
    onEdit: (method) => Alert.alert('Edit Payment', `Edit ${method.name} - Coming soon!`),
    onAdd: () => Alert.alert('Add Payment', 'Add new payment method - Coming soon!'),
  };

  const handleSettingsPress = (setting) => {
    Alert.alert('Settings', `${setting} settings - Coming soon!`);
  };

  // Expert-specific handlers
  const handleSubjectPress = (subject) => {
    Alert.alert('Subject Details', `View detailed ${subject.name} statistics - Coming soon!`);
  };

  const handleViewAllReviews = () => {
    Alert.alert('All Reviews', 'View all reviews feature coming soon! ⭐');
  };

  const handleTaskPress = (task) => {
    Alert.alert('Task Details', `View details for "${task.title}" - Coming soon!`);
  };

  const handleViewAllTasks = () => {
    Alert.alert('All Tasks', 'View all completed tasks - Coming soon!');
  };

  const handleBadgeActions = {
    onViewAllBadges: () => Alert.alert('All Badges', 'View all badges feature coming soon! 🏆'),
    onEarnBadges: () => Alert.alert('Earn Badges', 'Browse available tasks to earn more badges!'),
  };

  if (loading) {
    return (
      <LoadingScreen 
        message="Loading your profile..."
        submessage="Getting user data, stats, and preferences ready..."
        showAnimation={true}
        size="large"
      />
    );
  }
  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>😔</Text>
          <Text style={styles.errorText}>Failed to load profile</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadProfile}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderTabToggle = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'requester' && styles.activeTab]}
        onPress={() => setActiveTab('requester')}
      >
        <Text style={[styles.tabText, activeTab === 'requester' && styles.activeTabText]}>
          Requester ✅
        </Text>
        <View style={[styles.tabBadge, activeTab === 'requester' && styles.activeTabBadge]}>
          <Text style={[styles.tabBadgeText, activeTab === 'requester' && styles.activeTabBadgeText]}>
            {profile.requesterStats.tasksPosted}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'expert' && styles.activeTab]}
        onPress={() => setActiveTab('expert')}
      >
        <Text style={[styles.tabText, activeTab === 'expert' && styles.activeTabText]}>
          Expert 🎓
        </Text>
        <View style={[styles.tabBadge, activeTab === 'expert' && styles.activeTabBadge]}>
          <Text style={[styles.tabBadgeText, activeTab === 'expert' && styles.activeTabBadgeText]}>
            {profile.expertStats.tasksCompleted}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderRequesterView = () => (
    <Animated.View style={[styles.roleContent, { opacity: fadeAnim }]}>
      <StatsCards 
        stats={{
          tasksPosted: profile.requesterStats.tasksPosted,
          totalSpent: profile.requesterStats.totalSpent,
          avgRating: profile.requesterStats.avgRating,
          tasksThisMonth: profile.quickStats.tasksThisMonth,
          avgTaskValue: profile.quickStats.avgTaskValue,
          successRate: profile.quickStats.successRate,
        }}
        fadeAnim={fadeAnim}
      />

      <SpendingChart 
        monthlyData={profile.requesterStats.monthlySpending}
        maxAmount={250}
      />

      <TaskOverview stats={profile.requesterStats} />

      <ExpertsList
        experts={profile.favoriteExperts}
        onFavoriteToggle={handleFavoriteToggle}
        onHireAgain={handleHireExpert}
      />

      <PaymentMethodsList
        paymentMethods={profile.paymentMethods}
        onEdit={handlePaymentActions.onEdit}
        onAdd={handlePaymentActions.onAdd}
      />

      <WalletPreview
        balance={profile.expertStats.currentBalance}
        onOpenWallet={handleWalletActions.onOpenWallet}
        onQuickWithdraw={handleWalletActions.onQuickWithdraw}
      />
    </Animated.View>
  );

  const renderExpertView = () => (
    <Animated.View style={[styles.roleContent, { opacity: fadeAnim }]}>
      <SubjectStats 
        subjectData={profile.expertStats.subjectStats}
        fadeAnim={fadeAnim}
        onSubjectPress={handleSubjectPress}
      />

      <RatingsSummary 
        ratingsData={profile.expertStats.ratingsData}
        onViewAllReviews={handleViewAllReviews}
      />

      <TaskHistory 
        taskHistory={profile.expertStats.taskHistory}
        onViewAllTasks={handleViewAllTasks}
        onTaskPress={handleTaskPress}
      />

      <WalletPreview
        balance={profile.expertStats.currentBalance}
        onOpenWallet={handleWalletActions.onOpenWallet}
        onQuickWithdraw={handleWalletActions.onQuickWithdraw}
      />

      <BadgesPlaceholder 
        onViewAllBadges={handleBadgeActions.onViewAllBadges}
        onEarnBadges={handleBadgeActions.onEarnBadges}
      />
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2e7d32']}
          />
        }
      >
        {/* Dynamic Header Based on Active Tab */}
        {activeTab === 'expert' ? (
          <ExpertHeader
            profile={profile}
            fadeAnim={fadeAnim}
            onUpdateBio={handleUpdateBio}
            onQuickAction={handleQuickAction}
          />
        ) : (
          <ProfileHeader
            profile={profile}
            fadeAnim={fadeAnim}
            onUpdateNickname={handleUpdateNickname}
            onQuickAction={handleQuickAction}
          />
        )}

        {renderTabToggle()}
        
        {activeTab === 'requester' ? renderRequesterView() : renderExpertView()}
        
        <SettingsSection
          preferences={profile.preferences}
          onSettingPress={handleSettingsPress}
        />
        
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Modals */}
      <StatsModal
        visible={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        profile={profile}
      />

      <AchievementsModal
        visible={showAchievementsModal}
        onClose={() => setShowAchievementsModal(false)}
        achievements={profile.achievements}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f5f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
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
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
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
  activeTabBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#666',
  },
  activeTabBadgeText: {
    color: '#fff',
  },
  roleContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  bottomSpacer: {
    height: 20,
  },
});

export default ProfileScreen;