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

const AppearanceSettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [autoTheme, setAutoTheme] = useState(true);
  const [largeText, setLargeText] = useState(false);
  const [boldText, setBoldText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  const handleThemeChange = (theme: string) => {
    Alert.alert('Theme Changed', `Switched to ${theme} theme`);
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
        <Text style={styles.headerTitle}>Appearance</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Theme Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Theme</Text>
        <View style={styles.menuContainer}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => handleThemeChange('Light')}
          >
            <View style={styles.menuItemContent}>
              <Text style={styles.menuIcon}>☀️</Text>
              <Text style={styles.menuText}>Light</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          
          <View style={styles.separator} />
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => handleThemeChange('Dark')}
          >
            <View style={styles.menuItemContent}>
              <Text style={styles.menuIcon}>🌙</Text>
              <Text style={styles.menuText}>Dark</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          
          <View style={styles.separator} />
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => handleThemeChange('System')}
          >
            <View style={styles.menuItemContent}>
              <Text style={styles.menuIcon}>⚙️</Text>
              <Text style={styles.menuText}>System</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Display Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Display</Text>
        <View style={styles.menuContainer}>
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Text style={styles.settingDescription}>Use dark appearance</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={darkMode ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Auto Theme</Text>
              <Text style={styles.settingDescription}>Follow system appearance</Text>
            </View>
            <Switch
              value={autoTheme}
              onValueChange={setAutoTheme}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={autoTheme ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Large Text</Text>
              <Text style={styles.settingDescription}>Increase text size</Text>
            </View>
            <Switch
              value={largeText}
              onValueChange={setLargeText}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={largeText ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Bold Text</Text>
              <Text style={styles.settingDescription}>Use bold text throughout</Text>
            </View>
            <Switch
              value={boldText}
              onValueChange={setBoldText}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={boldText ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>High Contrast</Text>
              <Text style={styles.settingDescription}>Increase contrast</Text>
            </View>
            <Switch
              value={highContrast}
              onValueChange={setHighContrast}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={highContrast ? '#f5dd4b' : '#f4f3f4'}
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
  separator: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginLeft: 52,
  },
});

export default AppearanceSettingsScreen; 