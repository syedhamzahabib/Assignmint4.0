import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon, { Icons } from '../components/common/Icon';
import { useAuth } from '../state/AuthProvider';
import { analytics, ANALYTICS_EVENTS } from '../services/AnalyticsService';
import { DEV_MODE, COLORS } from '../constants';
import { firestoreService } from '../services/firestoreService';
import { stripeService } from '../services/stripeService';
import { User, Task, Transaction } from '../types/firestore';

const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { logout, user, mode } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [walletData, setWalletData] = useState<any>(null);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Load user data from Firestore
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Load user profile
        const profile = await firestoreService.getUser(user.uid);
        if (profile) {
          setUserData(profile);
        } else {
          // Create user profile if it doesn't exist
          const newUser: Omit<User, 'uid' | 'createdAt' | 'updatedAt'> = {
            email: user.email || '',
            displayName: user.displayName || user.email || 'Unknown User',
            photoURL: user.photoURL || undefined,
            role: 'both',
            trustScore: 100,
            rating: 5.0,
            totalReviews: 0,
            tasksCompleted: 0,
            tasksPosted: 0,
            totalEarnings: 0,
            badges: [],
            isVerified: false,
            preferences: {
              notifications: true,
              emailUpdates: true,
              language: 'en',
            },
          };
          
          const userId = await firestoreService.createUser(newUser);
          const createdUser = await firestoreService.getUser(userId);
          setUserData(createdUser);
        }

        // Load wallet data
        try {
          const wallet = await stripeService.getWalletBalance(user.uid);
          setWalletData(wallet);
        } catch (error) {
          console.warn('⚠️ Wallet data not available:', error);
          setWalletData({
            balance: 0,
            pendingBalance: 0,
            totalEarnings: 0,
            totalWithdrawn: 0,
          });
        }

        // Load recent tasks
        try {
          const tasks = await firestoreService.getTasks({
            createdBy: user.uid,
            limit: 10,
          });
          setRecentTasks(tasks);
        } catch (error) {
          console.warn('⚠️ Recent tasks not available:', error);
          setRecentTasks([]);
        }

        // Load recent transactions
        try {
          const transactions = await stripeService.getTransactionHistory(user.uid, 10);
          setRecentTransactions(transactions);
        } catch (error) {
          console.warn('⚠️ Transaction history not available:', error);
          setRecentTransactions([]);
        }

      } catch (error) {
        console.error('❌ Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  // Mock recent activity
  const recentActivity = [
    {
      id: '1',
      type: 'completed',
      title: 'Business Case Study Analysis',
      amount: '$120',
      date: '2 hours ago',
      status: 'Completed',
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
      status: 'Completed',
    },
    {
      id: '4',
      type: 'posted',
      title: 'Marketing Strategy Plan',
      amount: '$150',
      date: '1 week ago',
      status: 'Bidding',
    },
  ];

  // Mock reviews
  const reviews = [
    {
      id: '1',
      project: 'Business Case Study Analysis',
      rating: 5.0,
      comment: 'Excellent work with great attention to detail. Delivered on time and exceeded expectations.',
      reviewer: 'Sarah M.',
      date: '2 hours ago',
    },
    {
      id: '2',
      project: 'Mobile App Development',
      rating: 4.8,
      comment: 'Outstanding design and attention to detail. Very professional and responsive.',
      reviewer: 'Mike R.',
      date: '1 day ago',
    },
    {
      id: '3',
      project: 'Chemistry Lab Report',
      rating: 4.9,
      comment: 'High-quality work, well-researched and properly formatted. Highly recommended!',
      reviewer: 'Emily T.',
      date: '3 days ago',
    },
    {
      id: '4',
      project: 'Marketing Strategy Plan',
      rating: 5.0,
      comment: 'Exceptional work! The strategy was comprehensive and well-executed.',
      reviewer: 'David L.',
      date: '1 week ago',
    },
  ];

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  const handleWithdraw = () => {
    Alert.alert('Withdraw Funds', 'Withdrawal feature coming soon!');
  };

  const handleLinkPayment = () => {
    Alert.alert('Link Payment Method', 'Payment method linking feature coming soon!');
  };

  const handleTestIcons = () => {
    navigation.navigate('IconTest');
  };

  const handleScreenCatalog = () => {
    navigation.navigate('ScreenCatalog');
  };

  const handleToggleMode = () => {
    if (mode === 'guest') {
      // Switch to user mode with mock user
      const mockUser = {
        id: 'dev-user-id',
        email: 'dev@assignmint.com',
        name: 'Dev User',
        hasPaymentMethod: false,
      };
      // The original code had upgradeFromGuest here, but upgradeFromGuest is removed from useAuthStore.
      // This function is no longer relevant for switching modes.
      // For now, we'll just log a message or remove it if it's truly obsolete.
      // Since the prompt doesn't explicitly ask to remove this function,
      // I'll keep it but note its potential redundancy.
      console.log('Switching to user mode with mock user:', mockUser);
    } else {
      // Switch to guest mode
      // The original code had setGuestMode here, but setGuestMode is removed from useAuthStore.
      // This function is no longer relevant for switching modes.
      // For now, we'll just log a message or remove it if it's truly obsolete.
      // Since the prompt doesn't explicitly ask to remove this function,
      // I'll keep it but note its potential redundancy.
      console.log('Switching to guest mode');
    }
  };

  const handleMenuPress = (menuItem: string) => {
    switch (menuItem) {
      case 'Settings':
        navigation.navigate('Settings');
        break;
      case 'Wallet':
        navigation.navigate('Wallet');
        break;
      case 'Analytics':
        navigation.navigate('Analytics');
        break;
      case 'Contact Support':
        navigation.navigate('ContactSupport');
        break;
      case 'Terms of Service':
        navigation.navigate('TermsOfService');
        break;
      case 'Privacy Policy':
        navigation.navigate('PrivacyPolicy');
        break;
      case 'Add Payment Method':
        navigation.navigate('Payments');
        break;
      case 'Sign Out':
        Alert.alert(
          'Sign Out',
          'Are you sure you want to sign out?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Sign Out',
              style: 'destructive',
              onPress: async () => {
                try {
                  analytics.track(ANALYTICS_EVENTS.SIGN_OUT);
                  await logout();
                  // AuthProvider will automatically switch to auth stack
                  console.log('✅ Logout successful');
                } catch (error) {
                  console.error('❌ Logout failed:', error);
                  Alert.alert('Error', 'Failed to sign out. Please try again.');
                }
              },
            },
          ]
        );
        break;
      default:
        break;
    }
  };

  const renderOverviewTab = () => {
    if (loading) {
      return (
        <View style={styles.tabContent}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        </View>
      );
    }

    if (!userData) {
      return (
        <View style={styles.tabContent}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Unable to load profile data</Text>
            <Text style={styles.errorSubtext}>Please try again later</Text>
          </View>
        </View>
      );
    }

    return (
      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Icon name={Icons.star} size={24} color="#FFD700" />
              <Text style={styles.statValue}>{userData.rating || 0}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statCard}>
              <Icon name={Icons.check} size={24} color="#34C759" />
              <Text style={styles.statValue}>{userData.tasksCompleted || 0}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statCard}>
              <Icon name={Icons.edit} size={24} color="#007AFF" />
              <Text style={styles.statValue}>{userData.tasksPosted || 0}</Text>
              <Text style={styles.statLabel}>Posted</Text>
            </View>
            <View style={styles.statCard}>
              <Icon name={Icons.money} size={24} color="#34C759" />
              <Text style={styles.statValue}>${walletData?.totalEarnings || 0}</Text>
              <Text style={styles.statLabel}>Earned</Text>
            </View>
          </View>
        </View>

      {/* Badges */}
      <View style={styles.badgesSection}>
        <Text style={styles.sectionTitle}>Badges & Achievements</Text>
        <View style={styles.badgesContainer}>
          {userData.badges.map((badge, index) => (
            <View key={index} style={styles.badgeItem}>
              <Icon name={Icons.star} size={16} color="#FFD700" />
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Recent Reviews Preview */}
      <View style={styles.reviewsPreviewSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Reviews</Text>
          <TouchableOpacity onPress={() => setActiveTab('reviews')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        {reviews.slice(0, 2).map((review) => (
          <View key={review.id} style={styles.reviewPreviewCard}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewProject}>{review.project}</Text>
              <View style={styles.ratingContainer}>
                <Icon name={Icons.star} size={12} color="#856404" />
                <Text style={styles.ratingText}> {review.rating}</Text>
              </View>
            </View>
            <Text style={styles.reviewComment} numberOfLines={2}>
              {review.comment}
            </Text>
            <Text style={styles.reviewDate}>{review.date}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
  };

  const renderActivityTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.activitySection}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {recentActivity.map((activity) => (
          <View key={activity.id} style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <View style={styles.activityType}>
                <Text style={[
                  styles.activityTypeText,
                  activity.type === 'completed' ? styles.completedType : styles.postedType,
                ]}>
                  {activity.type === 'completed' ? (
                    <Icon name={Icons.check} size={12} color="#34C759" />
                  ) : (
                    <Icon name={Icons.edit} size={12} color="#007AFF" />
                  )} {activity.type.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.activityAmount}>{activity.amount}</Text>
            </View>
            <Text style={styles.activityTitle}>{activity.title}</Text>
            <View style={styles.activityFooter}>
              <Text style={styles.activityDate}>{activity.date}</Text>
              <Text style={styles.activityStatus}>{activity.status}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderReviewsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.reviewsSection}>
        <View style={styles.reviewsHeader}>
          <Text style={styles.sectionTitle}>All Reviews</Text>
          <Text style={styles.reviewsCount}>{reviews.length} reviews</Text>
        </View>
        {reviews.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewCardHeader}>
              <Text style={styles.reviewProject}>{review.project}</Text>
              <View style={styles.ratingContainer}>
                <Icon name={Icons.star} size={12} color="#856404" />
                <Text style={styles.ratingText}> {review.rating}</Text>
              </View>
            </View>
            <Text style={styles.reviewComment}>{review.comment}</Text>
            <View style={styles.reviewFooter}>
              <Text style={styles.reviewerName}>— {review.reviewer}</Text>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderWalletTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.walletSection}>
        {/* Balance Overview */}
        <View style={styles.balanceSection}>
          <Text style={styles.sectionTitle}>Balance Overview</Text>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>${userData.availableBalance}</Text>
            <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdraw}>
              <Text style={styles.withdrawButtonText}>Withdraw</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Total Earned</Text>
            <Text style={styles.balanceAmount}>${userData.totalEarnings}</Text>
          </View>

          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Total Withdrawn</Text>
            <Text style={styles.balanceAmount}>${userData.withdrawnAmount}</Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          <TouchableOpacity style={styles.linkPaymentButton} onPress={handleLinkPayment}>
            <Icon name={Icons.add} size={20} color="#007AFF" />
            <Text style={styles.linkPaymentText}>Link Payment Method</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {recentActivity.slice(0, 3).map((activity) => (
            <View key={activity.id} style={styles.transactionCard}>
              <View style={styles.transactionHeader}>
                <Text style={styles.transactionTitle}>{activity.title}</Text>
                <Text style={styles.transactionAmount}>{activity.amount}</Text>
              </View>
              <View style={styles.transactionFooter}>
                <Text style={styles.transactionDate}>{activity.date}</Text>
                <Text style={styles.transactionStatus}>{activity.status}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'activity':
        return renderActivityTab();
      case 'reviews':
        return renderReviewsTab();
      case 'wallet':
        return renderWalletTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with User Info */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Icon name={Icons.user} size={24} color="#8E8E93" />
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{userData?.name || 'Loading...'}</Text>
            <Text style={styles.userTitle}>{userData?.title || 'User'}</Text>
            <View style={styles.trustScoreContainer}>
              <Text style={styles.trustScoreLabel}>Trust Score:</Text>
              <Text style={styles.trustScore}>{userData?.trustScore || 0}%</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.settingsButton} onPress={handleSettings}>
          <Icon name={Icons.settings} size={24} color="#8E8E93" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsButton} onPress={handleTestIcons}>
          <Icon name={Icons.help} size={24} color="#8E8E93" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsButton} onPress={handleScreenCatalog}>
          <Icon name={Icons.apps} size={24} color="#8E8E93" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.settingsButton} 
          onPress={() => handleMenuPress('Sign Out')}
          testID="settings.signout"
        >
          <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      {/* DEV MODE Toggle */}
      {DEV_MODE && (
        <View style={styles.devToggleContainer}>
          <Text style={styles.devToggleLabel}>DEV: {mode === 'guest' ? 'Guest' : 'User'} Mode</Text>
          <TouchableOpacity
            style={[styles.devToggleButton, mode === 'guest' ? styles.devToggleGuest : styles.devToggleUser]}
            onPress={handleToggleMode}
          >
            <Text style={styles.devToggleButtonText}>
              Switch to {mode === 'guest' ? 'User' : 'Guest'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Guest Sign-In CTA */}
      {mode === 'guest' && !user && (
        <View style={styles.guestSignInContainer}>
          <Text style={styles.guestSignInTitle}>Ready to unlock full features?</Text>
          <Text style={styles.guestSignInSubtitle}>Sign in or create an account to access all AssignMint features</Text>
          <TouchableOpacity
            style={styles.guestSignInButton}
            onPress={() => {
              // The original code had clearAuth() here, but clearAuth is removed from useAuthStore.
              // This function is no longer relevant for switching modes.
              // For now, we'll just log a message or remove it if it's truly obsolete.
              // Since the prompt doesn't explicitly ask to remove this function,
              // I'll keep it but note its potential redundancy.
              console.log('Attempting to sign in/create account as guest');
            }}
          >
            <Text style={styles.guestSignInButtonText}>Sign In / Create Account</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollContent}
        >
          {[
            { key: 'overview', label: 'Overview', icon: Icons.analytics },
            { key: 'activity', label: 'Activity', icon: Icons.edit },
            { key: 'reviews', label: 'Reviews', icon: Icons.star },
            { key: 'wallet', label: 'Wallet', icon: Icons.money },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.activeTab]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Icon
                name={tab.icon}
                size={16}
                color={activeTab === tab.key ? '#FFFFFF' : '#8E8E93'}
              />
              <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Tab Content */}
      {renderTabContent()}
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E5E5EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatar: {
    fontSize: 24,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  userTitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  trustScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trustScoreLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginRight: 4,
  },
  trustScore: {
    fontSize: 12,
    fontWeight: '600',
    color: '#34C759',
  },
  settingsButton: {
    padding: 8,
  },
  settingsIcon: {
    fontSize: 24,
  },
  tabContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  tabScrollContent: {
    paddingHorizontal: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  tabContent: {
    flex: 1,
  },
  statsSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginHorizontal: 16,
    marginBottom: 12,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
  badgesSection: {
    marginTop: 24,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 16,
    gap: 8,
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  badgeIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000000',
  },
  reviewsPreviewSection: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  reviewPreviewCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewProject: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
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
  reviewComment: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: '#8E8E93',
  },
  activitySection: {
    marginTop: 16,
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  activityStatus: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  reviewsSection: {
    marginTop: 16,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  reviewsCount: {
    fontSize: 14,
    color: '#8E8E93',
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  reviewerName: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  walletSection: {
    marginTop: 16,
  },
  balanceSection: {
    marginBottom: 24,
  },
  balanceCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  withdrawButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  withdrawButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  paymentSection: {
    marginBottom: 24,
  },
  linkPaymentButton: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  linkPaymentIcon: {
    fontSize: 20,
    color: '#007AFF',
    marginRight: 12,
  },
  linkPaymentText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  transactionsSection: {
    marginBottom: 24,
  },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionTitle: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
    flex: 1,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionDate: {
    fontSize: 14,
    color: '#8E8E93',
  },
  transactionStatus: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  // DEV MODE Toggle Styles
  devToggleContainer: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  devToggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  devToggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  devToggleGuest: {
    backgroundColor: '#FF3B30',
  },
  devToggleUser: {
    backgroundColor: '#34C759',
  },
  devToggleButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Guest Sign-In CTA Styles
  guestSignInContainer: {
    backgroundColor: '#007AFF',
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  guestSignInTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  guestSignInSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 20,
  },
  guestSignInButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  guestSignInButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  // Loading and Error States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.text,
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error || '#FF3B30',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary || '#8E8E93',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default ProfileScreen;
