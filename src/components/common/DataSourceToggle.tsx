// DataSourceToggle.tsx - Development component for switching data sources
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDataSource } from '../../hooks/useDataSource';
import { COLORS } from '../../constants';

export const DataSourceToggle: React.FC = () => {
  const {
    isUsingMock,
    connectionStatus,
    switchToMock,
    switchToFirestore,
    testConnection,
  } = useDataSource();

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return COLORS.success;
      case 'disconnected':
        return COLORS.error;
      case 'testing':
        return COLORS.warning;
      default:
        return COLORS.textSecondary;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'disconnected':
        return 'Disconnected';
      case 'testing':
        return 'Testing...';
      default:
        return 'Unknown';
    }
  };

  if (!__DEV__) {
    return null; // Only show in development
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Data Source</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.label}>Status:</Text>
        <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
        <Text style={styles.statusText}>{getStatusText()}</Text>
      </View>

      <View style={styles.sourceContainer}>
        <Text style={styles.label}>Current:</Text>
        <Text style={styles.sourceText}>
          {isUsingMock ? 'Mock Data' : 'Firestore'}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            isUsingMock && styles.activeButton,
            styles.mockButton,
          ]}
          onPress={switchToMock}
          disabled={isUsingMock}
        >
          <Text style={[
            styles.buttonText,
            isUsingMock && styles.activeButtonText,
          ]}>
            Mock
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            !isUsingMock && styles.activeButton,
            styles.firestoreButton,
          ]}
          onPress={switchToFirestore}
          disabled={!isUsingMock}
        >
          <Text style={[
            styles.buttonText,
            !isUsingMock && styles.activeButtonText,
          ]}>
            Firestore
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.testButton}
        onPress={testConnection}
      >
        <Text style={styles.testButtonText}>Test Connection</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 8,
    margin: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginRight: 8,
    minWidth: 60,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sourceText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  mockButton: {
    borderColor: COLORS.warning,
  },
  firestoreButton: {
    borderColor: COLORS.primary,
  },
  activeButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: COLORS.text,
  },
  activeButtonText: {
    color: COLORS.white,
  },
  testButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  testButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
});
