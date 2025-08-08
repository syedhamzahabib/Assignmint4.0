import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
} from 'react-native';

const LanguageSelectionScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'es', name: 'Spanish', native: 'Español' },
    { code: 'fr', name: 'French', native: 'Français' },
    { code: 'de', name: 'German', native: 'Deutsch' },
    { code: 'it', name: 'Italian', native: 'Italiano' },
    { code: 'pt', name: 'Portuguese', native: 'Português' },
    { code: 'ru', name: 'Russian', native: 'Русский' },
    { code: 'ja', name: 'Japanese', native: '日本語' },
    { code: 'ko', name: 'Korean', native: '한국어' },
    { code: 'zh', name: 'Chinese (Simplified)', native: '中文 (简体)' },
    { code: 'ar', name: 'Arabic', native: 'العربية' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'tr', name: 'Turkish', native: 'Türkçe' },
    { code: 'nl', name: 'Dutch', native: 'Nederlands' },
    { code: 'pl', name: 'Polish', native: 'Polski' },
    { code: 'sv', name: 'Swedish', native: 'Svenska' },
    { code: 'da', name: 'Danish', native: 'Dansk' },
    { code: 'no', name: 'Norwegian', native: 'Norsk' },
    { code: 'fi', name: 'Finnish', native: 'Suomi' },
    { code: 'cs', name: 'Czech', native: 'Čeština' },
  ];

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.native.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    // Here you would typically save the language preference
    navigation.goBack();
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
        <Text style={styles.headerTitle}>Language Selection</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search languages..."
          placeholderTextColor="#8E8E93"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Language List */}
      <ScrollView style={styles.languageList} showsVerticalScrollIndicator={false}>
        <View style={styles.menuContainer}>
          {filteredLanguages.map((language, index) => (
            <View key={language.code}>
              <TouchableOpacity 
                style={styles.languageItem}
                onPress={() => handleLanguageSelect(language.name)}
              >
                <View style={styles.languageContent}>
                  <Text style={styles.languageName}>{language.name}</Text>
                  <Text style={styles.languageNative}>{language.native}</Text>
                </View>
                {selectedLanguage === language.name && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
              {index < filteredLanguages.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </View>
      </ScrollView>
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  searchInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
  },
  languageList: {
    flex: 1,
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  languageContent: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '400',
  },
  languageNative: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  checkmark: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginLeft: 16,
  },
});

export default LanguageSelectionScreen; 