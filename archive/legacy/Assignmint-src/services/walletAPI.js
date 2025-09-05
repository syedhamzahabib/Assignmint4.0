// Mock API for wallet operations - replace with real Stripe integration
const WalletAPI = {
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  async getWalletData(userId = 'user123') {
    console.log('📡 WalletAPI: Loading wallet data...');
    await this.delay(500 + Math.random() * 500);
    
    // Simulate occasional network errors (2% chance)
    if (Math.random() < 0.02) {
      throw {
        success: false,
        error: 'Network Error',
        message: 'Failed to fetch wallet data. Please check your connection.'
      };
    }
    
    try {
      const walletData = {
        currentBalance: 125.50,
        totalEarned: 680.00,
        totalWithdrawn: 554.50,
        pendingPayouts: 45.00,
        
        // Recent transactions (mock data)
        transactions: [
          {
            id: 'txn_001',
            type: 'payment_received',
            amount: 25.00,
            description: 'Payment for "Statistics Homework Problems"',
            date: '2025-05-23T14:30:00Z',
            status: 'completed',
            taskId: 'task_123',
            requesterName: 'David Park',
            serviceFee: 1.25 // 5% platform fee
          },
          {
            id: 'txn_002',
            type: 'payout_requested',
            amount: -50.00,
            description: 'Withdrawal to Bank Account ****1234',
            date: '2025-05-20T09:15:00Z',
            status: 'processing',
            payoutMethod: 'bank_transfer',
            estimatedArrival: '2025-05-22T12:00:00Z',
            payoutId: 'payout_abc123'
          },
          {
            id: 'txn_003',
            type: 'payment_received',
            amount: 40.00,
            description: 'Payment for "Build HTML/CSS Website"',
            date: '2025-05-18T16:45:00Z',
            status: 'completed',
            taskId: 'task_124',
            requesterName: 'Maria Garcia',
            serviceFee: 2.00
          },
          {
            id: 'txn_004',
            type: 'refund_issued',
            amount: -15.00,
            description: 'Partial refund for "Essay Writing Task"',
            date: '2025-05-15T11:20:00Z',
            status: 'completed',
            taskId: 'task_125',
            reason: 'Late delivery penalty',
            refundId: 'ref_xyz789'
          },
          {
            id: 'txn_005',
            type: 'payment_received',
            amount: 30.00,
            description: 'Payment for "Python Script Debugging"',
            date: '2025-05-12T13:00:00Z',
            status: 'completed',
            taskId: 'task_126',
            requesterName: 'Alex Johnson',
            serviceFee: 1.50
          },
          {
            id: 'txn_006',
            type: 'payout_requested',
            amount: -75.00,
            description: 'Withdrawal to PayPal',
            date: '2025-05-10T10:30:00Z',
            status: 'completed',
            payoutMethod: 'paypal',
            completedDate: '2025-05-11T14:22:00Z',
            payoutId: 'payout_def456'
          },
          {
            id: 'txn_007',
            type: 'payment_received',
            amount: 22.00,
            description: 'Payment for "Spanish Translation"',
            date: '2025-05-08T14:15:00Z',
            status: 'completed',
            taskId: 'task_127',
            requesterName: 'Jennifer Lee',
            serviceFee: 1.10
          },
          {
            id: 'txn_008',
            type: 'service_fee',
            amount: -2.50,
            description: 'Platform service fee (5%)',
            date: '2025-05-08T14:16:00Z',
            status: 'completed',
            relatedTransaction: 'txn_007',
            feePercentage: 5
          }
        ],
        
        // Available payment methods
        paymentMethods: [
          { 
            id: 'pm_1', 
            type: 'bank', 
            name: 'Bank Account ****1234', 
            isDefault: true,
            verified: true,
            last4: '1234'
          },
          { 
            id: 'pm_2', 
            type: 'paypal', 
            name: 'PayPal Account', 
            isDefault: false,
            verified: true,
            email: 'user@example.com'
          },
          { 
            id: 'pm_3', 
            type: 'card', 
            name: 'Debit Card ****5678', 
            isDefault: false,
            verified: true,
            last4: '5678'
          }
        ]
      };
      
      console.log('✅ WalletAPI: Wallet data loaded successfully');
      
      return {
        success: true,
        data: walletData,
        message: 'Wallet data fetched successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ WalletAPI Error:', error);
      throw {
        success: false,
        error: 'Data Error',
        message: 'Failed to process wallet data'
      };
    }
  },
  
  async withdrawFunds(amount, paymentMethod, userId = 'user123') {
    console.log(`📡 WalletAPI: Withdrawing $${amount} to ${paymentMethod.name}...`);
    await this.delay(800 + Math.random() * 1200); // 800-2000ms delay
    
    // Validate amount
    if (amount <= 0) {
      throw {
        success: false,
        error: 'Invalid Amount',
        message: 'Withdrawal amount must be greater than $0'
      };
    }
    
    if (amount > 125.50) { // Mock current balance check
      throw {
        success: false,
        error: 'Insufficient Balance',
        message: 'Insufficient funds for this withdrawal'
      };
    }
    
    if (amount > 1000) {
      throw {
        success: false,
        error: 'Amount Limit',
        message: 'Maximum withdrawal amount is $1,000 per transaction'
      };
    }
    
    // Simulate occasional failures (3% chance)
    if (Math.random() < 0.03) {
      throw {
        success: false,
        error: 'Withdrawal Failed',
        message: 'Unable to process withdrawal. Please try again or contact support.'
      };
    }
    
    try {
      const withdrawalId = `withdraw_${Date.now()}`;
      const estimatedArrival = new Date();
      estimatedArrival.setDate(estimatedArrival.getDate() + 2); // 2 days from now
      
      const result = {
        success: true,
        data: {
          withdrawalId,
          amount,
          paymentMethod: {
            id: paymentMethod.id,
            name: paymentMethod.name,
            type: paymentMethod.type
          },
          status: 'processing',
          estimatedArrival: estimatedArrival.toISOString(),
          transactionId: `txn_${Date.now()}`,
          timestamp: new Date().toISOString()
        },
        message: `Withdrawal of $${amount.toFixed(2)} initiated! Funds will arrive in 1-3 business days.`
      };
      
      console.log(`✅ WalletAPI: Withdrawal successful - ${withdrawalId}`);
      return result;
    } catch (error) {
      console.error('❌ WalletAPI Withdrawal Error:', error);
      throw {
        success: false,
        error: 'Processing Error',
        message: 'Failed to process withdrawal'
      };
    }
  },
  
  async addFunds(amount, paymentMethod, userId = 'user123') {
    console.log(`📡 WalletAPI: Adding $${amount} from ${paymentMethod.name}...`);
    await this.delay(600 + Math.random() * 800); // 600-1400ms delay
    
    // Validate amount
    if (amount <= 0) {
      throw {
        success: false,
        error: 'Invalid Amount',
        message: 'Add funds amount must be greater than $0'
      };
    }
    
    if (amount > 500) {
      throw {
        success: false,
        error: 'Amount Limit',
        message: 'Maximum add funds amount is $500 per transaction'
      };
    }
    
    // Simulate occasional payment failures (2% chance)
    if (Math.random() < 0.02) {
      throw {
        success: false,
        error: 'Payment Failed',
        message: 'Payment method declined. Please try a different payment method.'
      };
    }
    
    try {
      const paymentId = `payment_${Date.now()}`;
      
      const result = {
        success: true,
        data: {
          paymentId,
          amount,
          paymentMethod: {
            id: paymentMethod.id,
            name: paymentMethod.name,
            type: paymentMethod.type
          },
          status: 'completed',
          transactionId: `txn_${Date.now()}`,
          timestamp: new Date().toISOString()
        },
        message: `$${amount.toFixed(2)} added to your wallet successfully!`
      };
      
      console.log(`✅ WalletAPI: Add funds successful - ${paymentId}`);
      return result;
    } catch (error) {
      console.error('❌ WalletAPI Add Funds Error:', error);
      throw {
        success: false,
        error: 'Processing Error',
        message: 'Failed to add funds'
      };
    }
  },
  
  async getTransactionHistory(userId = 'user123', filters = {}) {
    console.log(`📡 WalletAPI: Loading transaction history with filters:`, filters);
    await this.delay(300 + Math.random() * 400);
    
    try {
      // This would normally fetch from your database
      const walletResponse = await this.getWalletData(userId);
      let transactions = walletResponse.data.transactions;
      
      // Apply filters
      if (filters.type && filters.type !== 'all') {
        transactions = transactions.filter(t => t.type === filters.type);
      }
      
      if (filters.status && filters.status !== 'all') {
        transactions = transactions.filter(t => t.status === filters.status);
      }
      
      if (filters.dateFrom) {
        transactions = transactions.filter(t => new Date(t.date) >= new Date(filters.dateFrom));
      }
      
      if (filters.dateTo) {
        transactions = transactions.filter(t => new Date(t.date) <= new Date(filters.dateTo));
      }
      
      // Sort by date (newest first)
      transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      console.log(`✅ WalletAPI: Found ${transactions.length} transactions`);
      
      return {
        success: true,
        data: transactions,
        total: transactions.length,
        filters: filters,
        message: 'Transaction history fetched successfully'
      };
    } catch (error) {
      console.error('❌ WalletAPI Transaction History Error:', error);
      throw {
        success: false,
        error: 'Fetch Error',
        message: 'Failed to load transaction history'
      };
    }
  },
  
  async getPaymentMethods(userId = 'user123') {
    console.log(`📡 WalletAPI: Loading payment methods...`);
    await this.delay(200 + Math.random() * 300);
    
    try {
      const paymentMethods = [
        { 
          id: 'pm_1', 
          type: 'bank', 
          name: 'Bank Account ****1234', 
          isDefault: true,
          verified: true,
          last4: '1234',
          bankName: 'Chase Bank'
        },
        { 
          id: 'pm_2', 
          type: 'paypal', 
          name: 'PayPal Account', 
          isDefault: false,
          verified: true,
          email: 'user@example.com'
        },
        { 
          id: 'pm_3', 
          type: 'card', 
          name: 'Debit Card ****5678', 
          isDefault: false,
          verified: true,
          last4: '5678',
          brand: 'Visa'
        }
      ];
      
      console.log(`✅ WalletAPI: Loaded ${paymentMethods.length} payment methods`);
      
      return {
        success: true,
        data: paymentMethods,
        message: 'Payment methods fetched successfully'
      };
    } catch (error) {
      console.error('❌ WalletAPI Payment Methods Error:', error);
      throw {
        success: false,
        error: 'Fetch Error',
        message: 'Failed to load payment methods'
      };
    }
  }
};

export default WalletAPI;