import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';

const BetaFeaturesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [aiAssistant, setAiAssistant] = useState(false);
  const [voiceCommands, setVoiceCommands] = useState(false);
  const [advancedAnalytics, setAdvancedAnalytics] = useState(true);
  const [experimentalUI, setExperimentalUI] = useState(false);
  const [betaNotifications, setBetaNotifications] = useState(true);
  const [autoSuggestions, setAutoSuggestions] = useState(false);

  const handleFeatureToggle = (featureName: string, enabled: boolean) => {
    Alert.alert(
      'Beta Feature',
      `${featureName} has been ${enabled ? 'enabled' : 'disabled'}. This feature is experimental and may not work as expected.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Beta Features</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Warning Banner */}
      <View style={styles.warningBanner}>
        <Text style={styles.warningIcon}>⚠️</Text>
        <Text style={styles.warningText}>
          These features are experimental and may be unstable. Use at your own risk.
        </Text>
      </View>

      {/* Beta Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experimental Features</Text>
        <View style={styles.menuContainer}>
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>AI Assistant</Text>
              <Text style={styles.settingDescription}>Smart AI-powered task suggestions</Text>
            </View>
            <Switch
              value={aiAssistant}
              onValueChange={(value) => {
                setAiAssistant(value);
                handleFeatureToggle('AI Assistant', value);
              }}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={aiAssistant ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Voice Commands</Text>
              <Text style={styles.settingDescription}>Control app with voice commands</Text>
            </View>
            <Switch
              value={voiceCommands}
              onValueChange={(value) => {
                setVoiceCommands(value);
                handleFeatureToggle('Voice Commands', value);
              }}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={voiceCommands ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Advanced Analytics</Text>
              <Text style={styles.settingDescription}>Detailed performance insights</Text>
            </View>
            <Switch
              value={advancedAnalytics}
              onValueChange={(value) => {
                setAdvancedAnalytics(value);
                handleFeatureToggle('Advanced Analytics', value);
              }}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={advancedAnalytics ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Experimental UI</Text>
              <Text style={styles.settingDescription}>Try new interface designs</Text>
            </View>
            <Switch
              value={experimentalUI}
              onValueChange={(value) => {
                setExperimentalUI(value);
                handleFeatureToggle('Experimental UI', value);
              }}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={experimentalUI ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Auto Suggestions</Text>
              <Text style={styles.settingDescription}>Smart task and content suggestions</Text>
            </View>
            <Switch
              value={autoSuggestions}
              onValueChange={(value) => {
                setAutoSuggestions(value);
                handleFeatureToggle('Auto Suggestions', value);
              }}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={autoSuggestions ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
        </View>
      </View>

      {/* Beta Program */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Beta Program</Text>
        <View style={styles.menuContainer}>
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Beta Notifications</Text>
              <Text style={styles.settingDescription}>Receive updates about new beta features</Text>
            </View>
            <Switch
              value={betaNotifications}
              onValueChange={setBetaNotifications}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={betaNotifications ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.separator} />
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuIcon}>📊</Text>
              <Text style={styles.menuText}>Send Feedback</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          
          <View style={styles.separator} />
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuIcon}>📝</Text>
              <Text style={styles.menuText}>Report Bug</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Version Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Version Information</Text>
        <View style={styles.menuContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>App Version</Text>
            <Text style={styles.infoValue}>1.0.0 (Beta)</Text>
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Build Number</Text>
            <Text style={styles.infoValue}>2024.1.15</Text>
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Beta Program</Text>
            <Text style={styles.infoValue}>Active</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  placeholder: {
    width: 40,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFEAA7',
  },
  warningIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#856404',
    fontWeight: '500',
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  menuText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '400',
  },
  chevron: {
    fontSize: 18,
    color: '#8E8E93',
    fontWeight: '300',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '400',
  },
  settingDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  infoLabel: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '400',
  },
  infoValue: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '400',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginLeft: 16,
  },
});

export default BetaFeaturesScreen; 