// components/profile/SpendingChart.js
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const SpendingChart = ({ monthlyData, maxAmount = 250 }) => {
  const getSpendingColor = (amount) => {
    if (amount > 200) return '#f44336';
    if (amount > 150) return '#ff9800';
    return '#4caf50';
  };

  // Calculate chart width based on screen size
  const chartWidth = screenWidth - 64; // Account for padding
  const barWidth = (chartWidth - 40) / monthlyData.length; // Account for margins

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>📈 Monthly Spending</Text>
      
      <View style={styles.chartWrapper}>
        <View style={[styles.chartContainer, { width: chartWidth }]}>
          {monthlyData.map((month, index) => (
            <View key={month.month} style={[styles.chartBar, { width: barWidth }]}>
              <View 
                style={[
                  styles.chartBarFill, 
                  { 
                    height: Math.max((month.amount / maxAmount) * 80, 8), // Min height of 8
                    backgroundColor: getSpendingColor(month.amount)
                  }
                ]} 
              />
              <Text style={styles.chartBarLabel} numberOfLines={1}>
                {month.month}
              </Text>
              <Text style={styles.chartBarValue} numberOfLines={1}>
                ${month.amount}
              </Text>
            </View>
          ))}
        </View>
        
        {/* Y-axis labels */}
        <View style={styles.yAxisLabels}>
          <Text style={styles.yAxisLabel}>${maxAmount}</Text>
          <Text style={styles.yAxisLabel}>${Math.round(maxAmount * 0.75)}</Text>
          <Text style={styles.yAxisLabel}>${Math.round(maxAmount * 0.5)}</Text>
          <Text style={styles.yAxisLabel}>${Math.round(maxAmount * 0.25)}</Text>
          <Text style={styles.yAxisLabel}>$0</Text>
        </View>
      </View>
      
      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#4caf50' }]} />
          <Text style={styles.legendText}>Under $150</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#ff9800' }]} />
          <Text style={styles.legendText}>$150-200</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#f44336' }]} />
          <Text style={styles.legendText}>Over $200</Text>
        </View>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 16,
  },
  chartWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
    paddingLeft: 30, // Space for Y-axis labels
    paddingBottom: 30, // Space for X-axis labels
    paddingTop: 10,
  },
  chartBar: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 2,
  },
  chartBarFill: {
    width: '80%',
    borderRadius: 3,
    minHeight: 8,
    marginBottom: 8,
  },
  chartBarLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 2,
  },
  chartBarValue: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
  },
  yAxisLabels: {
    position: 'absolute',
    left: 0,
    top: 10,
    bottom: 30,
    width: 25,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  yAxisLabel: {
    fontSize: 9,
    color: '#999',
    fontWeight: '500',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
});

export default SpendingChart;