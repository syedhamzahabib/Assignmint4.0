import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { COLORS } from '../constants';
import Icon, { Icons } from '../components/common/Icon';
import { useAuth } from '../state/AuthProvider';
import { stripeService, WalletBalance, Transaction } from '../services/stripeService';
import { STRIPE_ENABLED } from '../config/environment';

const WalletScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const { presentPaymentSheet, initPaymentSheet } = useStripe();
  const [walletData, setWalletData] = useState<WalletBalance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Load wallet data from Stripe
  useEffect(() => {
    const loadWalletData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        if (STRIPE_ENABLED) {
          const balance = await stripeService.getWalletBalance(user.uid);
          setWalletData(balance);
          const transactionHistory = await stripeService.getTransactionHistory(user.uid, 50);
          setTransactions(transactionHistory);
        } else {
          // Mock data when Stripe is disabled
          setWalletData({
            available: 0,
            pending: 0,
            currency: 'usd'
          });
          setTransactions([]);
        }

      } catch (error) {
        console.error('❌ Error loading wallet data:', error);
        Alert.alert('Error', 'Failed to load wallet data. Please try again.');
        // Fallback to mock data on error
        setWalletData({
          available: 0,
          pending: 0,
          currency: 'usd'
        });
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    loadWalletData();
  }, [user]);

  const handleAddFunds = async () => {
    try {
      console.log('💰 Adding funds to wallet...');
      
      if (!STRIPE_ENABLED) {
        Alert.alert('Coming Soon', 'Payment integration is being set up. Please check back later.');
        return;
      }

      // TODO: Implement Stripe PaymentSheet for adding funds
      Alert.alert('Coming Soon', 'Add funds feature will be available soon!');

    } catch (error) {
      console.error('❌ Error adding funds:', error);
      Alert.alert('Error', 'Failed to add funds. Please try again.');
    }
  };
  const handleWithdraw = async () => {
    try {
      console.log('💰 Withdrawing funds from wallet...');
      
      if (!user) {
        Alert.alert('Error', 'Please log in to withdraw funds.');
        return;
      }

      // For now, show coming soon message
      // In production, this would open Stripe Connect payout flow
      Alert.alert(
        'Withdraw Funds', 
        'Withdrawal feature is being set up. You\'ll be able to withdraw funds to your bank account once Stripe Connect is fully configured.',
        [
          { text: 'OK', style: 'default' },
          { 
            text: 'Set Up Payouts', 
            onPress: () => {
              // This would open Stripe Connect onboarding
              Alert.alert('Coming Soon', 'Stripe Connect setup will be available soon!');
            }
          }
        ]
      );
    } catch (error) {
      console.error('❌ Error withdrawing funds:', error);
      Alert.alert('Error', 'Failed to process withdrawal. Please try again.');
    }
  };

  const handleAddPaymentMethod = () => {
    Alert.alert('Add Payment Method', 'Payment method feature coming soon!');
  };

  const handleViewTransaction = (transaction: any) => {
    Alert.alert('Transaction Details', `Transaction ID: ${transaction.id}\nAmount: ${transaction.amount}\nDate: ${transaction.date}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wallet</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Balance Cards */}
        <View style={styles.balanceSection}>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>
              ${walletData?.available?.toFixed(2) || '0.00'}
            </Text>
            <TouchableOpacity style={styles.addFundsButton} onPress={handleAddFunds}>
              <Text style={styles.addFundsButtonText}>Add Funds</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Pending Amount</Text>
            <Text style={styles.pendingAmount}>
              ${walletData?.pending?.toFixed(2) || '0.00'}
            </Text>
            <Text style={styles.pendingNote}>Will be available in 3-5 days</Text>
            <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdraw}>
              <Text style={styles.withdrawButtonText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{transactions.length}</Text>
            <Text style={styles.statLabel}>Transactions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              ${transactions
                .filter(t => t.type === 'credit' && t.status === 'completed')
                .reduce((sum, t) => sum + t.amount, 0)
                .toFixed(0)}
            </Text>
            <Text style={styles.statLabel}>Total Earnings</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Methods</Text>
            <TouchableOpacity onPress={handleAddPaymentMethod}>
              <Text style={styles.addButton}>+ Add</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.paymentMethodCard}>
            <View style={styles.paymentMethodInfo}>
              <Icon name={Icons.wallet} size={24} color={COLORS.text} />
              <View>
                <Text style={styles.paymentMethodName}>Bank Account</Text>
                <Text style={styles.paymentMethodDetails}>****1234</Text>
              </View>
            </View>
            <Text style={styles.paymentMethodStatus}>Default</Text>
          </View>
        </View>

        {/* Transaction History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.loadingText}>Loading transactions...</Text>
            </View>
          ) : transactions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No transactions yet</Text>
            </View>
          ) : (
            transactions.map((transaction) => (
              <TouchableOpacity
                key={transaction.id}
                style={styles.transactionCard}
                onPress={() => handleViewTransaction(transaction)}
              >
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionDescription}>{transaction.description}</Text>
                  <Text style={styles.transactionDate}>
                    {new Date(transaction.date).toLocaleDateString()}
                  </Text>
                </View>

                <View style={styles.transactionAmount}>
                  <Text style={[
                    styles.transactionAmountText,
                    { color: transaction.type === 'credit' ? COLORS.success : COLORS.error },
                  ]}>
                    {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: transaction.status === 'completed' ? COLORS.success + '20' : COLORS.warning + '20' },
                  ]}>
                    <Text style={[
                      styles.statusText,
                      { color: transaction.status === 'completed' ? COLORS.success : COLORS.warning },
                    ]}>
                      {transaction.status}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name={Icons.analytics} size={24} color={COLORS.text} />
              <Text style={styles.actionLabel}>View Reports</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Icon name={Icons.document} size={24} color={COLORS.text} />
              <Text style={styles.actionLabel}>Tax Documents</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Icon name={Icons.settings} size={24} color={COLORS.text} />
              <Text style={styles.actionLabel}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 20,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  balanceSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  balanceCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 12,
  },
  pendingAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.warning,
    marginBottom: 8,
  },
  pendingNote: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  addFundsButton: {
    backgroundColor: COLORS.success,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addFundsButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  withdrawButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  withdrawButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  addButton: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  paymentMethodCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  paymentMethodDetails: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  paymentMethodStatus: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  transactionInfo: {
    flex: 1,
    marginRight: 12,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    padding: 16,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    color: COLORS.text,
    textAlign: 'center',
  },
});

export default WalletScreen;
