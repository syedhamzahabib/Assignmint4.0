// components/profile/WalletPreview.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const WalletPreview = ({ balance, onOpenWallet, onQuickWithdraw }) => {
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>💰 Wallet Overview</Text>
        <TouchableOpacity 
          onPress={onOpenWallet}
          style={styles.viewAllButton}
        >
          <Text style={styles.viewAllText}>Open Wallet →</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.walletPreview}>
        <View style={styles.walletBalance}>
          <Text style={styles.walletAmount}>${balance.toFixed(2)}</Text>
          <Text style={styles.walletLabel}>Available Balance</Text>
        </View>
        <TouchableOpacity 
          style={styles.quickWithdrawButton}
          onPress={onQuickWithdraw}
        >
          <Text style={styles.quickWithdrawText}>Quick Withdraw</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  viewAllButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  viewAllText: {
    color: '#2e7d32',
    fontSize: 12,
    fontWeight: '600',
  },
  walletPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e8f5e8',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2e7d32',
  },
  walletBalance: {
    flex: 1,
  },
  walletAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2e7d32',
    marginBottom: 4,
  },
  walletLabel: {
    fontSize: 12,
    color: '#2e7d32',
    fontWeight: '500',
  },
  quickWithdrawButton: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  quickWithdrawText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default WalletPreview;