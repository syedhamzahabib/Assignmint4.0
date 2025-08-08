import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TextInput,
} from 'react-native';

// Mock API for wallet operations (create as api/walletAPI.js)
const WalletAPI = {
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  async getWalletData() {
    await this.delay(500);
    return {
      success: true,
      data: {
        currentBalance: 125.50,
        totalEarned: 680.00,
        totalWithdrawn: 554.50,
        pendingPayouts: 45.00,
        transactions: [
          {
            id: 'txn_001',
            type: 'payment_received',
            amount: 25.00,
            description: 'Payment for "Statistics Homework Problems"',
            date: '2025-05-23T14:30:00Z',
            status: 'completed',
            taskId: 'task_123',
            requesterName: 'David Park'
          },
          {
            id: 'txn_002',
            type: 'payout_requested',
            amount: -50.00,
            description: 'Withdrawal to Bank Account ****1234',
            date: '2025-05-20T09:15:00Z',
            status: 'processing',
            payoutMethod: 'bank_transfer',
            estimatedArrival: '2025-05-22'
          },
          {
            id: 'txn_003',
            type: 'payment_received',
            amount: 40.00,
            description: 'Payment for "Build HTML/CSS Website"',
            date: '2025-05-18T16:45:00Z',
            status: 'completed',
            taskId: 'task_124',
            requesterName: 'Maria Garcia'
          },
          {
            id: 'txn_004',
            type: 'refund_issued',
            amount: -15.00,
            description: 'Partial refund for "Essay Writing Task"',
            date: '2025-05-15T11:20:00Z',
            status: 'completed',
            taskId: 'task_125',
            reason: 'Late delivery penalty'
          },
          {
            id: 'txn_005',
            type: 'payment_received',
            amount: 30.00,
            description: 'Payment for "Python Script Debugging"',
            date: '2025-05-12T13:00:00Z',
            status: 'completed',
            taskId: 'task_126',
            requesterName: 'Alex Johnson'
          },
          {
            id: 'txn_006',
            type: 'payout_requested',
            amount: -75.00,
            description: 'Withdrawal to PayPal',
            date: '2025-05-10T10:30:00Z',
            status: 'completed',
            payoutMethod: 'paypal',
            completedDate: '2025-05-11'
          },
          {
            id: 'txn_007',
            type: 'payment_received',
            amount: 22.00,
            description: 'Payment for "Spanish Translation"',
            date: '2025-05-08T14:15:00Z',
            status: 'completed',
            taskId: 'task_127',
            requesterName: 'Jennifer Lee'
          },
          {
            id: 'txn_008',
            type: 'service_fee',
            amount: -2.50,
            description: 'Platform service fee (5%)',
            date: '2025-05-08T14:16:00Z',
            status: 'completed',
            relatedTransaction: 'txn_007'
          }
        ],
        paymentMethods: [
          { id: 'pm_1', type: 'bank', name: 'Bank Account ****1234', isDefault: true },
          { id: 'pm_2', type: 'paypal', name: 'PayPal Account', isDefault: false },
          { id: 'pm_3', type: 'card', name: 'Debit Card ****5678', isDefault: false }
        ]
      }
    };
  },
  
  async withdrawFunds(amount, method) {
    await this.delay(1000);
    if (amount > 125.50) {
      throw { success: false, message: 'Insufficient balance' };
    }
    return { 
      success: true, 
      message: `Withdrawal of $${amount} initiated! Funds will arrive in 1-3 business days.`,
      transactionId: `txn_${Date.now()}`
    };
  },
  
  async addFunds(amount, method) {
    await this.delay(800);
    return { 
      success: true, 
      message: `$${amount} added to your wallet successfully!`,
      transactionId: `txn_${Date.now()}`
    };
  }
};

const WalletScreen = ({ navigation, route }) => {
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Filter states
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  // Withdraw/Add funds modal states
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  // Check if opened from PostTask (Step 5) for adding payment method
  const fromPostTask = route?.params?.fromPostTask || false;

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      const response = await WalletAPI.getWalletData();
      if (response.success) {
        setWalletData(response.data);
        // Set default payment method
        const defaultMethod = response.data.paymentMethods.find(pm => pm.isDefault);
        if (defaultMethod) {
          setSelectedPaymentMethod(defaultMethod);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWalletData();
    setRefreshing(false);
  };

  const handleWithdraw = async () => {
    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    
    if (withdrawAmount > walletData.currentBalance) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }

    try {
      setActionLoading(true);
      const response = await WalletAPI.withdrawFunds(withdrawAmount, selectedPaymentMethod);
      
      if (response.success) {
        // Update balance locally
        setWalletData(prev => ({
          ...prev,
          currentBalance: prev.currentBalance - withdrawAmount,
          totalWithdrawn: prev.totalWithdrawn + withdrawAmount,
          pendingPayouts: prev.pendingPayouts + withdrawAmount
        }));
        
        setShowWithdrawModal(false);
        setAmount('');
        Alert.alert('Success', response.message);
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Withdrawal failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddFunds = async () => {
    const addAmount = parseFloat(amount);
    if (isNaN(addAmount) || addAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    
    if (addAmount > 500) {
      Alert.alert('Error', 'Maximum add amount is $500 per transaction');
      return;
    }

    try {
      setActionLoading(true);
      const response = await WalletAPI.addFunds(addAmount, selectedPaymentMethod);
      
      if (response.success) {
        // Update balance locally
        setWalletData(prev => ({
          ...prev,
          currentBalance: prev.currentBalance + addAmount
        }));
        
        setShowAddFundsModal(false);
        setAmount('');
        Alert.alert('Success', response.message);
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to add funds');
    } finally {
      setActionLoading(false);
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'payment_received': return '💰';
      case 'payout_requested': return '📤';
      case 'refund_issued': return '↩️';
      case 'service_fee': return '🏦';
      default: return '💳';
    }
  };

  const getTransactionColor = (type, amount) => {
    if (amount > 0) return '#4caf50'; // Green for incoming
    return '#f44336'; // Red for outgoing
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      completed: { bg: '#e8f5e8', color: '#2e7d32', text: '✅ Completed' },
      processing: { bg: '#fff3e0', color: '#f57c00', text: '⏳ Processing' },
      pending: { bg: '#e3f2fd', color: '#1976d2', text: '🔄 Pending' },
      failed: { bg: '#ffebee', color: '#d32f2f', text: '❌ Failed' }
    };
    
    return statusStyles[status] || statusStyles.completed;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const getFilteredTransactions = () => {
    if (!walletData) return [];
    
    let filtered = walletData.transactions;
    
    switch (selectedFilter) {
      case 'received':
        filtered = filtered.filter(t => t.type === 'payment_received');
        break;
      case 'withdrawn':
        filtered = filtered.filter(t => t.type === 'payout_requested');
        break;
      case 'refunds':
        filtered = filtered.filter(t => t.type === 'refund_issued');
        break;
      case 'fees':
        filtered = filtered.filter(t => t.type === 'service_fee');
        break;
    }
    
    return filtered;
  };

  const filterOptions = [
    { key: 'all', label: 'All Transactions', icon: '📋' },
    { key: 'received', label: 'Payments Received', icon: '💰' },
    { key: 'withdrawn', label: 'Withdrawals', icon: '📤' },
    { key: 'refunds', label: 'Refunds', icon: '↩️' },
    { key: 'fees', label: 'Service Fees', icon: '🏦' }
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>💰 Wallet</Text>
          <View style={styles.headerRight} />
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2e7d32" />
          <Text style={styles.loadingText}>Loading your wallet...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!walletData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>💰 Wallet</Text>
          <View style={styles.headerRight} />
        </View>
        
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Failed to Load Wallet</Text>
          <Text style={styles.errorText}>Please check your connection and try again</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadWalletData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const filteredTransactions = getFilteredTransactions();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>💰 Wallet</Text>
        <TouchableOpacity onPress={() => setShowFilterModal(true)}>
          <Text style={styles.filterButton}>Filter</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2e7d32']}
          />
        }
      >
        {/* Current Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceAmount}>${walletData.currentBalance.toFixed(2)}</Text>
          
          {/* Action Buttons */}
          <View style={styles.balanceActions}>
            <TouchableOpacity 
              style={styles.withdrawButton}
              onPress={() => setShowWithdrawModal(true)}
            >
              <Text style={styles.withdrawButtonText}>📤 Withdraw</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.addFundsButton}
              onPress={() => setShowAddFundsModal(true)}
            >
              <Text style={styles.addFundsButtonText}>💳 Add Funds</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Wallet Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>📊 Wallet Summary</Text>
          
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryAmount}>${walletData.totalEarned.toFixed(2)}</Text>
              <Text style={styles.summaryLabel}>Total Earned</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryAmount}>${walletData.totalWithdrawn.toFixed(2)}</Text>
              <Text style={styles.summaryLabel}>Total Withdrawn</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryAmount}>${walletData.pendingPayouts.toFixed(2)}</Text>
              <Text style={styles.summaryLabel}>Pending Payouts</Text>
            </View>
          </View>
        </View>

        {/* Transaction History */}
        <View style={styles.transactionSection}>
          <View style={styles.transactionHeader}>
            <Text style={styles.sectionTitle}>📋 Transaction History</Text>
            <TouchableOpacity onPress={() => setShowFilterModal(true)}>
              <Text style={styles.filterLink}>
                {selectedFilter === 'all' ? 'Filter' : `${filterOptions.find(f => f.key === selectedFilter)?.label}`}
              </Text>
            </TouchableOpacity>
          </View>
          
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => {
              const statusBadge = getStatusBadge(transaction.status);
              const isPositive = transaction.amount > 0;
              
              return (
                <TouchableOpacity key={transaction.id} style={styles.transactionCard}>
                  <View style={styles.transactionLeft}>
                    <View style={styles.transactionIcon}>
                      <Text style={styles.transactionIconText}>
                        {getTransactionIcon(transaction.type)}
                      </Text>
                    </View>
                    
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionDescription} numberOfLines={2}>
                        {transaction.description}
                      </Text>
                      <Text style={styles.transactionDate}>
                        {formatDate(transaction.date)}
                      </Text>
                      
                      {/* Status Badge */}
                      <View style={[styles.statusBadge, { backgroundColor: statusBadge.bg }]}>
                        <Text style={[styles.statusText, { color: statusBadge.color }]}>
                          {statusBadge.text}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.transactionRight}>
                    <Text style={[
                      styles.transactionAmount,
                      { color: getTransactionColor(transaction.type, transaction.amount) }
                    ]}>
                      {isPositive ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </Text>
                    <Text style={styles.transactionArrow}>›</Text>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.emptyTransactions}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyTitle}>No Transactions</Text>
              <Text style={styles.emptyText}>
                {selectedFilter === 'all' 
                  ? 'You haven\'t made any transactions yet'
                  : `No ${filterOptions.find(f => f.key === selectedFilter)?.label.toLowerCase()} found`
                }
              </Text>
            </View>
          )}
        </View>

        {/* Info Tips */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>💡 Wallet Tips</Text>
          
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>🔒</Text>
            <Text style={styles.tipText}>
              Your funds are held securely with bank-level encryption
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>⏱️</Text>
            <Text style={styles.tipText}>
              Withdrawals typically arrive in 1-3 business days
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>💳</Text>
            <Text style={styles.tipText}>
              Adding funds is instant and secure via Stripe
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>📞</Text>
            <Text style={styles.tipText}>
              Need help? Contact support for wallet assistance
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Transactions</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.filterOption,
                  selectedFilter === option.key && styles.selectedFilterOption
                ]}
                onPress={() => {
                  setSelectedFilter(option.key);
                  setShowFilterModal(false);
                }}
              >
                <Text style={styles.filterOptionIcon}>{option.icon}</Text>
                <Text style={[
                  styles.filterOptionText,
                  selectedFilter === option.key && styles.selectedFilterOptionText
                ]}>
                  {option.label}
                </Text>
                {selectedFilter === option.key && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Withdraw Modal */}
      <Modal
        visible={showWithdrawModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowWithdrawModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>📤 Withdraw Funds</Text>
            <Text style={styles.modalSubtitle}>
              Available: ${walletData.currentBalance.toFixed(2)}
            </Text>
            
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Amount to withdraw:</Text>
              <View style={styles.amountInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.amountInput}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  placeholder="0.00"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Withdraw to:</Text>
              <TouchableOpacity style={styles.paymentMethodSelector}>
                <Text style={styles.paymentMethodText}>
                  {selectedPaymentMethod?.name || 'Select payment method'}
                </Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalCancel}
                onPress={() => {
                  setShowWithdrawModal(false);
                  setAmount('');
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalConfirm, actionLoading && styles.disabledButton]}
                onPress={handleWithdraw}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalConfirmText}>Withdraw</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Funds Modal */}
      <Modal
        visible={showAddFundsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddFundsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>💳 Add Funds</Text>
            <Text style={styles.modalSubtitle}>
              Add money to your AssignMint wallet
            </Text>
            
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Amount to add:</Text>
              <View style={styles.amountInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.amountInput}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  placeholder="0.00"
                  placeholderTextColor="#999"
                />
              </View>
              <Text style={styles.inputHint}>Maximum: $500 per transaction</Text>
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Payment method:</Text>
              <TouchableOpacity style={styles.paymentMethodSelector}>
                <Text style={styles.paymentMethodText}>
                  {selectedPaymentMethod?.name || 'Select payment method'}
                </Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalCancel}
                onPress={() => {
                  setShowAddFundsModal(false);
                  setAmount('');
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalConfirm, actionLoading && styles.disabledButton]}
                onPress={handleAddFunds}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalConfirmText}>Add Funds</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
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
  headerRight: {
    width: 50,
  },
  filterButton: {
    fontSize: 16,
    color: '#2e7d32',
    fontWeight: '500',
  },
  content: {
    flex: 1,
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
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Balance Card
  balanceCard: {
    backgroundColor: '#2e7d32',
    margin: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#2e7d32',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 8,
  },
  balanceLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 42,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 24,
  },
  balanceActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  withdrawButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  withdrawButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  addFundsButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  addFundsButtonText: {
    color: '#2e7d32',
    fontSize: 16,
    fontWeight: '600',
  },

  // Summary Card
  summaryCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2e7d32',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },

  // Transaction Section
  transactionSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterLink: {
    fontSize: 14,
    color: '#2e7d32',
    fontWeight: '500',
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionIconText: {
    fontSize: 18,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  transactionArrow: {
    fontSize: 16,
    color: '#ccc',
  },
  emptyTransactions: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },

  // Info Section
  infoSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipIcon: {
    fontSize: 16,
    marginRight: 12,
    marginTop: 2,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 20,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalClose: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
  },
  selectedFilterOption: {
    backgroundColor: '#e8f5e8',
    borderWidth: 1,
    borderColor: '#2e7d32',
  },
  filterOptionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  filterOptionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    fontWeight: '500',
  },
  selectedFilterOptionText: {
    color: '#2e7d32',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 16,
    color: '#2e7d32',
    fontWeight: 'bold',
  },

  // Input Styles
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2e7d32',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    paddingVertical: 16,
    color: '#111',
  },
  inputHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  paymentMethodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  paymentMethodText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  modalCancel: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  modalConfirm: {
    flex: 1,
    backgroundColor: '#2e7d32',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#2e7d32',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default WalletScreen;