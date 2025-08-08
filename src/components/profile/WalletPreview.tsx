// components/profile/WalletPreview.tsx

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../../constants';

interface WalletPreviewProps {
  balance: number;
  pendingPayments: number;
  onPress: () => void;
}

const WalletPreview: React.FC<WalletPreviewProps> = ({ balance, pendingPayments, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title}>Wallet</Text>
        <Text style={styles.arrow}>›</Text>
      </View>
      
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>${balance.toFixed(2)}</Text>
      </View>
      
      {pendingPayments > 0 && (
        <View style={styles.pendingContainer}>
          <Text style={styles.pendingLabel}>Pending Payments</Text>
          <Text style={styles.pendingAmount}>${pendingPayments.toFixed(2)}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  arrow: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
  balanceContainer: {
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  pendingContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  pendingLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  pendingAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.warning,
  },
});

export default WalletPreview; 