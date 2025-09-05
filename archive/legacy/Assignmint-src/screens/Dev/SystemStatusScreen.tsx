import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, FONTS } from '../../constants';
import { pingFirebase, type FirebaseHealthResult } from '../../debug/firebaseHealth';

const SystemStatusScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [healthResult, setHealthResult] = useState<FirebaseHealthResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runHealthCheck = async () => {
    setIsLoading(true);
    try {
      const result = await pingFirebase();
      setHealthResult(result);
    } catch (error) {
      Alert.alert('Error', 'Health check failed. Please try again.');
      console.error('Health check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

  const getStatusIcon = (status: boolean) => {
    return status ? '✅' : '❌';
  };

  const getStatusColor = (status: boolean) => {
    return status ? COLORS.success || '#34C759' : COLORS.error || '#FF3B30';
  };

  const getConsoleUrl = () => {
    if (!healthResult?.projectId || healthResult.projectId === 'unknown') {
      return 'https://console.firebase.google.com/';
    }
    return `https://console.firebase.google.com/project/${healthResult.projectId}`;
  };

  return (
    <SafeAreaView style={styles.container} testID="system-status-screen">
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>System Status</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Firebase Health Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Firebase Health Status</Text>

          {healthResult && (
            <View style={styles.healthCard}>
              {/* Mode */}
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Mode:</Text>
                <View style={styles.statusValue}>
                  <Text style={[
                    styles.statusText,
                    { color: healthResult.mode === 'EMULATOR' ? COLORS.warning || '#FF9500' : COLORS.success || '#34C759' },
                  ]}>
                    {healthResult.mode}
                  </Text>
                  {healthResult.mode === 'EMULATOR' && (
                    <Text style={styles.emulatorNote}>(Development)</Text>
                  )}
                </View>
              </View>

              {/* Project Info */}
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Project ID:</Text>
                <Text style={styles.statusText}>{healthResult.projectId}</Text>
              </View>

              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Auth Domain:</Text>
                <Text style={styles.statusText}>{healthResult.authDomain}</Text>
              </View>

              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Storage Bucket:</Text>
                <Text style={styles.statusText}>{healthResult.storageBucket}</Text>
              </View>

              {/* Firestore Status */}
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Firestore:</Text>
                <View style={styles.statusValue}>
                  <Text style={[styles.statusText, { color: getStatusColor(healthResult.writeOk) }]}>
                    {getStatusIcon(healthResult.writeOk)} Write
                  </Text>
                  <Text style={[styles.statusText, { color: getStatusColor(healthResult.readOk) }]}>
                    {getStatusIcon(healthResult.readOk)} Read
                  </Text>
                </View>
              </View>

              {/* Storage Status */}
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Storage:</Text>
                <Text style={[styles.statusText, { color: getStatusColor(healthResult.storageOk) }]}>
                  {getStatusIcon(healthResult.storageOk)} Upload/Download
                </Text>
              </View>

              {/* Paths */}
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Health Doc:</Text>
                <Text style={styles.statusText}>{healthResult.docPath}</Text>
              </View>

              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Storage File:</Text>
                <Text style={styles.statusText}>{healthResult.filePath}</Text>
              </View>

              {/* Error Display */}
              {healthResult.error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorLabel}>Error:</Text>
                  <Text style={styles.errorText}>{healthResult.error}</Text>
                </View>
              )}
            </View>
          )}

          {/* Health Check Button */}
          <TouchableOpacity
            style={[styles.healthButton, isLoading && styles.disabledButton]}
            onPress={runHealthCheck}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Ionicons name="refresh" size={20} color={COLORS.white} />
                <Text style={styles.healthButtonText}>Run Health Check</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Firebase Console Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Firebase Console</Text>
          <View style={styles.consoleCard}>
            <Text style={styles.consoleText}>
              View your Firebase project data at:
            </Text>
            <Text style={styles.consoleUrl}>{getConsoleUrl()}</Text>

            <View style={styles.consolePaths}>
              <Text style={styles.consolePathTitle}>Data Locations:</Text>
              <Text style={styles.consolePath}>• Auth Users: Authentication → Users</Text>
              <Text style={styles.consolePath}>• Firestore: Firestore Database → Collections → debug/_health</Text>
              <Text style={styles.consolePath}>• Storage: Storage → Files → users/__health__/probe.txt</Text>
            </View>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <View style={styles.instructionsCard}>
            <Text style={styles.instructionText}>
              1. Run the health check to test Firebase connectivity
            </Text>
            <Text style={styles.instructionText}>
              2. Check the console logs for detailed results
            </Text>
            <Text style={styles.instructionText}>
              3. Verify data appears in Firebase Console
            </Text>
            <Text style={styles.instructionText}>
              4. Use emulators for development (FB_USE_PROD=false)
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: 16,
  },
  healthCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statusLabel: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
    color: COLORS.text,
    flex: 1,
  },
  statusValue: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    fontWeight: FONTS.weights.medium,
  },
  emulatorNote: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  errorContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: COLORS.error || '#FF3B30',
    borderRadius: 8,
  },
  errorLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
    marginBottom: 4,
  },
  errorText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.white,
  },
  healthButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  healthButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
  },
  consoleCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  consoleText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    marginBottom: 8,
  },
  consoleUrl: {
    fontSize: FONTS.sizes.md,
    color: COLORS.primary,
    fontWeight: FONTS.weights.semiBold,
    marginBottom: 16,
    textDecorationLine: 'underline',
  },
  consolePaths: {
    marginTop: 16,
  },
  consolePathTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: 8,
  },
  consolePath: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  instructionsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  instructionText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default SystemStatusScreen;
