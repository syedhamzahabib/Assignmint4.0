import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';

const SettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const handleAppearance = () => {
    navigation.navigate('AppearanceSettings');
  };

  const handleNotificationPreferences = () => {
    navigation.navigate('NotificationPreferences');
  };

  const handleLanguageSelection = () => {
    navigation.navigate('LanguageSelection');
  };

  const handleDownloadPreferences = () => {
    navigation.navigate('DownloadPreferences');
  };

  const handleBetaFeatures = () => {
    navigation.navigate('BetaFeatures');
  };

  const handleAddPaymentMethod = () => {
    navigation.navigate('AddPaymentMethod');
  };

  const handleContactSupport = () => {
    navigation.navigate('ContactSupport');
  };

  const handleTermsOfService = () => {
    navigation.navigate('TermsOfService');
  };

  const handlePrivacyPolicy = () => {
    navigation.navigate('PrivacyPolicy');
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            // Handle sign out logic here
            Alert.alert('Signed Out', 'You have been successfully signed out.');
          },
        },
      ]
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
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      {/* App Settings Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={handleAppearance}>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuIcon}>👁️</Text>
              <Text style={styles.menuText}>Appearance</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          
          <View style={styles.separator} />
          
          <TouchableOpacity style={styles.menuItem} onPress={handleNotificationPreferences}>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuIcon}>🔔</Text>
              <Text style={styles.menuText}>Notification Preferences</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          
          <View style={styles.separator} />
          
          <TouchableOpacity style={styles.menuItem} onPress={handleLanguageSelection}>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuIcon}>🌍</Text>
              <Text style={styles.menuText}>Language Selection</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          
          <View style={styles.separator} />
          
          <TouchableOpacity style={styles.menuItem} onPress={handleDownloadPreferences}>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuIcon}>⬇️</Text>
              <Text style={styles.menuText}>Download Preferences</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          
          <View style={styles.separator} />
          
          <TouchableOpacity style={styles.menuItem} onPress={handleBetaFeatures}>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuIcon}>🧪</Text>
              <Text style={styles.menuText}>Beta Features</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Account & Payment Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Account & Payment</Text>
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={handleAddPaymentMethod}>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuIcon}>💳</Text>
              <Text style={styles.menuText}>Add Payment Method</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Support & Legal Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Support & Legal</Text>
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={handleContactSupport}>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuIcon}>🎧</Text>
              <Text style={styles.menuText}>Contact Support</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          
          <View style={styles.separator} />
          
          <TouchableOpacity style={styles.menuItem} onPress={handleTermsOfService}>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuIcon}>📄</Text>
              <Text style={styles.menuText}>Terms of Service</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          
          <View style={styles.separator} />
          
          <TouchableOpacity style={styles.menuItem} onPress={handlePrivacyPolicy}>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuIcon}>🔒</Text>
              <Text style={styles.menuText}>Privacy Policy</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sign Out Section */}
      <View style={styles.sectionContainer}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutIcon}>🚪</Text>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
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
  sectionContainer: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    marginHorizontal: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
  separator: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginLeft: 52,
  },
  signOutButton: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  signOutText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '500',
  },
});

export default SettingsScreen; 