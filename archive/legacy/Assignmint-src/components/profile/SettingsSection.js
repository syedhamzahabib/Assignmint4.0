// components/profile/SettingsSection.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const SettingItem = ({ icon, name, description, onPress, isLogout = false }) => {
  return (
    <TouchableOpacity 
      style={[styles.settingItem, isLogout && styles.logoutItem]}
      onPress={onPress}
    >
      <Text style={styles.settingIcon}>{icon}</Text>
      <View style={styles.settingText}>
        <Text style={[styles.settingName, isLogout && styles.logoutText]}>
          {name}
        </Text>
        <Text style={styles.settingDesc}>{description}</Text>
      </View>
      <Text style={styles.settingArrow}>›</Text>
    </TouchableOpacity>
  );
};

const SettingsSection = ({ preferences, onSettingPress }) => {
  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: () => {
            // Handle logout logic here
            Alert.alert('Signed Out', 'You have been signed out successfully');
          }
        }
      ]
    );
  };

  const getNotificationCount = () => {
    return Object.values(preferences.notifications).filter(Boolean).length;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>⚙️ Settings & Privacy</Text>
      
      <SettingItem
        icon="🔔"
        name="Notifications"
        description={`${getNotificationCount()} enabled`}
        onPress={() => onSettingPress && onSettingPress('notifications')}
      />

      <SettingItem
        icon="🔒"
        name="Privacy & Security"
        description={`Profile ${preferences.privacy.profileVisible ? 'public' : 'private'}`}
        onPress={() => onSettingPress && onSettingPress('privacy')}
      />

      <SettingItem
        icon="🌍"
        name="Language & Region"
        description={`${preferences.communication.preferredLanguage}, ${preferences.communication.timezone}`}
        onPress={() => onSettingPress && onSettingPress('language')}
      />

      <SettingItem
        icon="❓"
        name="Help & Support"
        description="Get help and contact support"
        onPress={() => onSettingPress && onSettingPress('help')}
      />

      <SettingItem
        icon="🚪"
        name="Sign Out"
        description="Sign out of your account"
        onPress={handleLogout}
        isLogout={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
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
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  settingText: {
    flex: 1,
  },
  settingName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 13,
    color: '#666',
  },
  settingArrow: {
    fontSize: 18,
    color: '#ccc',
    fontWeight: 'bold',
  },
  logoutText: {
    color: '#f44336',
  },
});

export default SettingsSection;