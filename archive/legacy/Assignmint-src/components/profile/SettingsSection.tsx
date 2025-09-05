// components/profile/SettingsSection.tsx

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../../constants';

interface SettingsSectionProps {
  settings: any;
  onSettingPress: (setting: string) => void;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ settings, onSettingPress }) => {
  const settingsItems = [
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy & Security', icon: '🔒' },
    { id: 'payment', label: 'Payment Settings', icon: '💳' },
    { id: 'help', label: 'Help & Support', icon: '❓' },
    { id: 'about', label: 'About AssignMint', icon: 'ℹ️' },
    { id: 'logout', label: 'Logout', icon: '🚪' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {settingsItems.map(item => (
        <TouchableOpacity
          key={item.id}
          style={styles.settingItem}
          onPress={() => onSettingPress(item.id)}
        >
          <View style={styles.settingInfo}>
            <Text style={styles.settingIcon}>{item.icon}</Text>
            <Text style={styles.settingLabel}>{item.label}</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 20,
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  arrow: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
});

export default SettingsSection;
