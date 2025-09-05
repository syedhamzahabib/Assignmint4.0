import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Switch,
} from 'react-native';

const NotificationPreferencesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [taskUpdates, setTaskUpdates] = useState(true);
  const [paymentAlerts, setPaymentAlerts] = useState(true);
  const [newMessages, setNewMessages] = useState(true);
  const [deadlineReminders, setDeadlineReminders] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

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
        <Text style={styles.headerTitle}>Notification Preferences</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Push Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Push Notifications</Text>
        <View style={styles.menuContainer}>
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Text style={styles.settingDescription}>Receive notifications on your device</Text>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={pushNotifications ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Task Updates</Text>
              <Text style={styles.settingDescription}>When task status changes</Text>
            </View>
            <Switch
              value={taskUpdates}
              onValueChange={setTaskUpdates}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={taskUpdates ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Payment Alerts</Text>
              <Text style={styles.settingDescription}>Payment confirmations and updates</Text>
            </View>
            <Switch
              value={paymentAlerts}
              onValueChange={setPaymentAlerts}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={paymentAlerts ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>New Messages</Text>
              <Text style={styles.settingDescription}>When you receive new messages</Text>
            </View>
            <Switch
              value={newMessages}
              onValueChange={setNewMessages}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={newMessages ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Deadline Reminders</Text>
              <Text style={styles.settingDescription}>Remind you of upcoming deadlines</Text>
            </View>
            <Switch
              value={deadlineReminders}
              onValueChange={setDeadlineReminders}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={deadlineReminders ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
        </View>
      </View>

      {/* Email Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Email Notifications</Text>
        <View style={styles.menuContainer}>
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Email Notifications</Text>
              <Text style={styles.settingDescription}>Receive notifications via email</Text>
            </View>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={emailNotifications ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Marketing Emails</Text>
              <Text style={styles.settingDescription}>Receive promotional content</Text>
            </View>
            <Switch
              value={marketingEmails}
              onValueChange={setMarketingEmails}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={marketingEmails ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Weekly Digest</Text>
              <Text style={styles.settingDescription}>Weekly summary of your activity</Text>
            </View>
            <Switch
              value={weeklyDigest}
              onValueChange={setWeeklyDigest}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={weeklyDigest ? '#f5dd4b' : '#f4f3f4'}
            />
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
  separator: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginLeft: 16,
  },
});

export default NotificationPreferencesScreen;
