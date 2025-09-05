// components/profile/SpendingChart.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../../constants';

interface SpendingChartProps {
  data: any[];
}

const SpendingChart: React.FC<SpendingChartProps> = ({ data }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Spending</Text>
      <View style={styles.chartContainer}>
        <Text style={styles.placeholderText}>📊 Spending Chart</Text>
        <Text style={styles.placeholderSubtext}>
          Visual representation of your spending over time
        </Text>
      </View>
    </View>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  chartContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
  },
  placeholderText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  placeholderSubtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default SpendingChart;
