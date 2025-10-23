import { useStripe } from '@stripe/stripe-react-native';
import Config from 'react-native-config';

const API_BASE_URL = Config.API_BASE_URL || 'http://localhost:3000';

export interface PaymentIntentData {
  amount: number;
  currency?: string;
  customerId?: string;
  metadata?: Record<string, string>;
}

export interface PayoutData {
  amount: number;
  currency?: string;
  destination: string;
  description?: string;
}

export interface WalletBalance {
  available: number;
  pending: number;
  currency: string;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  description: string;
  type: 'credit' | 'debit';
  status: 'completed' | 'pending' | 'failed';
  date: string;
  metadata?: Record<string, string>;
}

/**
 * Create a PaymentIntent for task escrow
 */
export async function createPaymentIntent(data: PaymentIntentData) {
  try {
    console.log('💳 Creating PaymentIntent for amount:', data.amount);
    
    const response = await fetch(`${API_BASE_URL}/api/stripe/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    const result = await response.json();
    console.log('✅ PaymentIntent created:', result.paymentIntent.id);
    return result.paymentIntent;
  } catch (error) {
    console.error('❌ Error creating PaymentIntent:', error);
    throw error;
  }
}

/**
 * Confirm a PaymentIntent after payment method is attached
 */
export async function confirmPaymentIntent(paymentIntentId: string) {
  try {
    console.log('💳 Confirming PaymentIntent:', paymentIntentId);
    
    const response = await fetch(`${API_BASE_URL}/api/stripe/confirm-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentIntentId }),
    });

    if (!response.ok) {
      throw new Error('Failed to confirm payment intent');
    }

    const result = await response.json();
    console.log('✅ PaymentIntent confirmed:', result.paymentIntent.id);
    return result.paymentIntent;
  } catch (error) {
    console.error('❌ Error confirming PaymentIntent:', error);
    throw error;
  }
}

/**
 * Create a payout to expert's Stripe Connect account
 */
export async function createPayout(data: PayoutData) {
  try {
    console.log('💰 Creating payout for amount:', data.amount);
    
    const response = await fetch(`${API_BASE_URL}/api/stripe/create-payout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create payout');
    }

    const result = await response.json();
    console.log('✅ Payout created:', result.payout.id);
    return result.payout;
  } catch (error) {
    console.error('❌ Error creating payout:', error);
    throw error;
  }
}

/**
 * Get wallet balance for a user
 */
export async function getWalletBalance(userId: string): Promise<WalletBalance> {
  try {
    console.log('💰 Getting wallet balance for user:', userId);
    
    const response = await fetch(`${API_BASE_URL}/api/stripe/wallet-balance/${userId}`);

    if (!response.ok) {
      throw new Error('Failed to get wallet balance');
    }

    const result = await response.json();
    console.log('✅ Wallet balance retrieved:', result.balance);
    return result.balance;
  } catch (error) {
    console.error('❌ Error getting wallet balance:', error);
    throw error;
  }
}

/**
 * Get transaction history for a user
 */
export async function getTransactionHistory(userId: string, limit: number = 50): Promise<Transaction[]> {
  try {
    console.log('📊 Getting transaction history for user:', userId);
    
    const response = await fetch(`${API_BASE_URL}/api/stripe/transactions/${userId}?limit=${limit}`);

    if (!response.ok) {
      throw new Error('Failed to get transaction history');
    }

    const result = await response.json();
    console.log('✅ Transaction history retrieved:', result.transactions.length, 'transactions');
    return result.transactions;
  } catch (error) {
    console.error('❌ Error getting transaction history:', error);
    throw error;
  }
}

/**
 * Create a Stripe Connect account for a new expert
 */
export async function createConnectAccount(userId: string, email: string) {
  try {
    console.log('🔗 Creating Connect account for user:', userId);
    
    const response = await fetch(`${API_BASE_URL}/api/stripe/create-connect-account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, email }),
    });

    if (!response.ok) {
      throw new Error('Failed to create Connect account');
    }

    const result = await response.json();
    console.log('✅ Connect account created:', result.account.id);
    return result.account;
  } catch (error) {
    console.error('❌ Error creating Connect account:', error);
    throw error;
  }
}

/**
 * Create an account link for Stripe Connect onboarding
 */
export async function createAccountLink(accountId: string, refreshUrl: string, returnUrl: string) {
  try {
    console.log('🔗 Creating account link for account:', accountId);
    
    const response = await fetch(`${API_BASE_URL}/api/stripe/create-account-link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accountId, refreshUrl, returnUrl }),
    });

    if (!response.ok) {
      throw new Error('Failed to create account link');
    }

    const result = await response.json();
    console.log('✅ Account link created:', result.accountLink.url);
    return result.accountLink;
  } catch (error) {
    console.error('❌ Error creating account link:', error);
    throw error;
  }
}

export const stripeService = {
  createPaymentIntent,
  confirmPaymentIntent,
  createPayout,
  getWalletBalance,
  getTransactionHistory,
  createConnectAccount,
  createAccountLink,
};