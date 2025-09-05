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

const DownloadPreferencesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [autoDownload, setAutoDownload] = useState(false);
  const [wifiOnly, setWifiOnly] = useState(true);
  const [downloadQuality, setDownloadQuality] = useState('High');
  const [saveToGallery, setSaveToGallery] = useState(true);
  const [downloadNotifications, setDownloadNotifications] = useState(true);
  const [backgroundDownloads, setBackgroundDownloads] = useState(false);

  const handleQualitySelect = (quality: string) => {
    setDownloadQuality(quality);
    Alert.alert('Quality Changed', `Download quality set to ${quality}`);
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
        <Text style={styles.headerTitle}>Download Preferences</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Download Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Download Settings</Text>
        <View style={styles.menuContainer}>
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Auto Download</Text>
              <Text style={styles.settingDescription}>Automatically download new content</Text>
            </View>
            <Switch
              value={autoDownload}
              onValueChange={setAutoDownload}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={autoDownload ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Wi-Fi Only</Text>
              <Text style={styles.settingDescription}>Download only when connected to Wi-Fi</Text>
            </View>
            <Switch
              value={wifiOnly}
              onValueChange={setWifiOnly}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={wifiOnly ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Save to Gallery</Text>
              <Text style={styles.settingDescription}>Save downloaded images to photo gallery</Text>
            </View>
            <Switch
              value={saveToGallery}
              onValueChange={setSaveToGallery}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={saveToGallery ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Download Notifications</Text>
              <Text style={styles.settingDescription}>Show notifications for completed downloads</Text>
            </View>
            <Switch
              value={downloadNotifications}
              onValueChange={setDownloadNotifications}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={downloadNotifications ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Background Downloads</Text>
              <Text style={styles.settingDescription}>Continue downloads when app is closed</Text>
            </View>
            <Switch
              value={backgroundDownloads}
              onValueChange={setBackgroundDownloads}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={backgroundDownloads ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
        </View>
      </View>

      {/* Quality Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Download Quality</Text>
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleQualitySelect('Low')}
          >
            <View style={styles.menuItemContent}>
              <Text style={styles.menuIcon}>📱</Text>
              <Text style={styles.menuText}>Low (Save Data)</Text>
            </View>
            {downloadQuality === 'Low' && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleQualitySelect('Medium')}
          >
            <View style={styles.menuItemContent}>
              <Text style={styles.menuIcon}>💻</Text>
              <Text style={styles.menuText}>Medium (Balanced)</Text>
            </View>
            {downloadQuality === 'Medium' && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleQualitySelect('High')}
          >
            <View style={styles.menuItemContent}>
              <Text style={styles.menuIcon}>🖥️</Text>
              <Text style={styles.menuText}>High (Best Quality)</Text>
            </View>
            {downloadQuality === 'High' && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
        </View>
      </View>

      {/* Storage Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Storage</Text>
        <View style={styles.menuContainer}>
          <View style={styles.storageItem}>
            <View style={styles.storageContent}>
              <Text style={styles.storageLabel}>Downloaded Files</Text>
              <Text style={styles.storageValue}>2.3 GB</Text>
            </View>
            <TouchableOpacity style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.separator} />

          <View style={styles.storageItem}>
            <View style={styles.storageContent}>
              <Text style={styles.storageLabel}>Cache</Text>
              <Text style={styles.storageValue}>156 MB</Text>
            </View>
            <TouchableOpacity style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
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
  checkmark: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: 'bold',
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
  storageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  storageContent: {
    flex: 1,
  },
  storageLabel: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '400',
  },
  storageValue: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  clearButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginLeft: 52,
  },
});

export default DownloadPreferencesScreen;
