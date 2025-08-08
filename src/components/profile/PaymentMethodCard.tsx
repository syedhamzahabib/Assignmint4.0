// components/profile/PaymentMethodCard.tsx

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../../constants';

interface PaymentMethod {
  id: string;
  type: string;
  last4?: string;
  email?: string;
  isDefault: boolean;
}

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod;
  onPress: () => void;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({ paymentMethod, onPress }) => {
  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'credit_card':
      case 'debit_card':
        return '💳';
      case 'paypal':
        return 'PayPal';
      case 'apple_pay':
        return 'Apple Pay';
      case 'google_pay':
        return 'Google Pay';
      default:
        return '💳';
    }
  };

  const getPaymentText = (paymentMethod: PaymentMethod) => {
    if (paymentMethod.last4) {
      return `•••• ${paymentMethod.last4}`;
    }
    if (paymentMethod.email) {
      return paymentMethod.email;
    }
    return paymentMethod.type.replace('_', ' ').toUpperCase();
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.mainInfo}>
        <Text style={styles.icon}>{getPaymentIcon(paymentMethod.type)}</Text>
        <View style={styles.textContainer}>
          <Text style={styles.paymentText}>{getPaymentText(paymentMethod)}</Text>
          {paymentMethod.isDefault && (
            <Text style={styles.defaultText}>Default</Text>
          )}
        </View>
      </View>
      
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
};

export const PaymentMethodsList: React.FC<{
  paymentMethods: PaymentMethod[];
  onAddMethod: () => void;
}> = ({ paymentMethods, onAddMethod }) => {
  return (
    <View style={styles.listContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Payment Methods</Text>
        <TouchableOpacity onPress={onAddMethod}>
          <Text style={styles.addText}>+ Add</Text>
        </TouchableOpacity>
      </View>
      
      {paymentMethods.map(paymentMethod => (
        <PaymentMethodCard
          key={paymentMethod.id}
          paymentMethod={paymentMethod}
          onPress={() => console.log('Edit payment method:', paymentMethod.id)}
        />
      ))}
      
      {paymentMethods.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No payment methods added</Text>
          <TouchableOpacity style={styles.addButton} onPress={onAddMethod}>
            <Text style={styles.addButtonText}>Add Payment Method</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
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
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  addText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  mainInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  paymentText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  defaultText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  arrow: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
  emptyState: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default PaymentMethodCard; 