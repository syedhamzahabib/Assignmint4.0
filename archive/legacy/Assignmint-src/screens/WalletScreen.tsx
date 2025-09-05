import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { COLORS } from '../constants';
import Icon, { Icons } from '../components/common/Icon';

// Mock wallet data
const mockWalletData = {
  balance: '$1,250.00',
  pendingAmount: '$320.00',
  totalEarnings: '$2,450.00',
  transactions: [
    {
      id: '1',
      type: 'credit',
      amount: '$120.00',
      description: 'Payment for "Business Case Study Analysis"',
      date: '2025-01-20',
      status: 'completed',
    },
    {
      id: '2',
      type: 'credit',
      amount: '$80.00',
      description: 'Payment for "Research Paper Writing"',
      date: '2025-01-18',
      status: 'completed',
    },
    {
      id: '3',
      type: 'debit',
      amount: '-$50.00',
      description: 'Withdrawal to Bank Account',
      date: '2025-01-15',
      status: 'completed',
    },
    {
      id: '4',
      type: 'credit',
      amount: '$95.00',
      description: 'Payment for "Chemistry Lab Report"',
      date: '2025-01-12',
      status: 'pending',
    },
  ],
};

const WalletScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const handleWithdraw = () => {
    Alert.alert('Withdraw Funds', 'Withdrawal feature coming soon!');
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
            <Text style={styles.balanceAmount}>{mockWalletData.balance}</Text>
            <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdraw}>
              <Text style={styles.withdrawButtonText}>Withdraw</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Pending Amount</Text>
            <Text style={styles.pendingAmount}>{mockWalletData.pendingAmount}</Text>
            <Text style={styles.pendingNote}>Will be available in 3-5 days</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{mockWalletData.transactions.length}</Text>
            <Text style={styles.statLabel}>Transactions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{mockWalletData.totalEarnings}</Text>
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

          {mockWalletData.transactions.map((transaction) => (
            <TouchableOpacity
              key={transaction.id}
              style={styles.transactionCard}
              onPress={() => handleViewTransaction(transaction)}
            >
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionDescription}>{transaction.description}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>

              <View style={styles.transactionAmount}>
                <Text style={[
                  styles.transactionAmountText,
                  { color: transaction.type === 'credit' ? COLORS.success : COLORS.error },
                ]}>
                  {transaction.amount}
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
          ))}
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
  withdrawButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  withdrawButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
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
