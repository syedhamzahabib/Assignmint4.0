// components/profile/PaymentMethodCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const PaymentMethodCard = ({ method, onEdit }) => {
  return (
    <View style={styles.paymentCard}>
      <View style={styles.paymentLeft}>
        <Text style={styles.paymentIcon}>
          {method.type === 'card' ? '💳' : 
           method.type === 'paypal' ? '🅿️' : '🏦'}
        </Text>
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentName}>{method.name}</Text>
          {method.isDefault && (
            <Text style={styles.defaultBadge}>Default</Text>
          )}
          <Text style={styles.paymentDetails}>
            {method.type === 'card' 
              ? `Expires ${method.expiryMonth}/${method.expiryYear}` 
              : method.email
            }
          </Text>
          <Text style={styles.lastUsed}>Last used: {method.lastUsed}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.editPaymentButton}
        onPress={() => onEdit && onEdit(method)}
      >
        <Text style={styles.editPaymentText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );
};

const PaymentMethodsList = ({ paymentMethods, onEdit, onAdd }) => {
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>💳 Payment Methods</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => onAdd && onAdd()}
        >
          <Text style={styles.addButtonText}>+ Add New</Text>
        </TouchableOpacity>
      </View>
      
      {paymentMethods.map((method) => (
        <PaymentMethodCard
          key={method.id}
          method={method}
          onEdit={onEdit}
        />
      ))}
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
  addButton: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    color: '#111',
    fontWeight: '500',
    marginBottom: 4,
  },
  defaultBadge: {
    backgroundColor: '#2e7d32',
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    textTransform: 'uppercase',
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  paymentDetails: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  lastUsed: {
    fontSize: 12,
    color: '#999',
  },
  editPaymentButton: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editPaymentText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
  },
});

export { PaymentMethodCard, PaymentMethodsList };
export default PaymentMethodCard;