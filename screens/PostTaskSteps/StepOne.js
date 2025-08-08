import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const subjects = [
  { id: 'math', label: '📊 Math', value: 'Math', description: 'Algebra, Calculus, Statistics, Geometry' },
  { id: 'coding', label: '💻 Coding', value: 'Coding', description: 'Programming, Web Dev, Mobile Apps' },
  { id: 'writing', label: '✍️ Writing', value: 'Writing', description: 'Essays, Reports, Creative Writing' },
  { id: 'design', label: '🎨 Design', value: 'Design', description: 'Graphics, UI/UX, Logos, Branding' },
  { id: 'language', label: '🌍 Language', value: 'Language', description: 'Translation, Grammar, Literature' },
  { id: 'science', label: '🔬 Science', value: 'Science', description: 'Biology, Chemistry, Physics, Labs' },
  { id: 'business', label: '💼 Business', value: 'Business', description: 'Marketing, Finance, Strategy, Plans' },
  { id: 'engineering', label: '⚙️ Engineering', value: 'Engineering', description: 'Mechanical, Electrical, Civil, Software' },
  { id: 'psychology', label: '🧠 Psychology', value: 'Psychology', description: 'Research, Analysis, Case Studies' },
  { id: 'history', label: '🏛️ History', value: 'History', description: 'Research, Essays, Timeline Analysis' },
  { id: 'other', label: '📋 Other', value: 'Other', description: 'Something else not listed above' },
];

const StepOne = ({ formData, updateFormData, onNext, currentStep }) => {
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [subjectSearch, setSubjectSearch] = useState('');

  const selectSubject = (subject) => {
    updateFormData('subject', subject.value);
    setShowSubjectDropdown(false);
    setSubjectSearch('');
  };

  const filteredSubjects = subjects.filter(subject =>
    subject.label.toLowerCase().includes(subjectSearch.toLowerCase()) ||
    subject.description.toLowerCase().includes(subjectSearch.toLowerCase())
  );

  const getSelectedSubject = () => {
    return subjects.find(s => s.value === formData.subject);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header - Fixed */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>{/* Spacer */}</View>
        <Text style={styles.headerTitle}>Post Task (1/5)</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>🚀 Let's Create Your Task</Text>
          <Text style={styles.welcomeText}>
            Start by telling us what subject you need help with and give your task a clear title.
          </Text>
        </View>

        {/* Subject Dropdown */}
        <View style={styles.section}>
          <Text style={styles.label}>📚 Subject *</Text>
          <Text style={styles.subtitle}>What category does your task fall into?</Text>
          
          <TouchableOpacity
            style={[
              styles.dropdown,
              formData.subject && styles.dropdownSelected
            ]}
            onPress={() => setShowSubjectDropdown(true)}
            activeOpacity={0.7}
          >
            <View style={styles.dropdownContent}>
              {formData.subject ? (
                <View style={styles.selectedSubjectContainer}>
                  <Text style={styles.selectedSubjectLabel}>
                    {getSelectedSubject()?.label}
                  </Text>
                  <Text style={styles.selectedSubjectDescription}>
                    {getSelectedSubject()?.description}
                  </Text>
                </View>
              ) : (
                <View style={styles.placeholderContainer}>
                  <Text style={styles.placeholderText}>Select Subject</Text>
                  <Text style={styles.placeholderSubtext}>Choose the main category</Text>
                </View>
              )}
            </View>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* Task Title */}
        <View style={styles.section}>
          <Text style={styles.label}>📌 Task Title *</Text>
          <Text style={styles.subtitle}>Write a clear, specific title that describes what you need</Text>
          
          <TextInput
            style={[
              styles.input,
              formData.title && styles.inputFilled
            ]}
            placeholder="e.g., Solve 5 calculus derivative problems with explanations"
            placeholderTextColor="#999"
            value={formData.title}
            onChangeText={(text) => updateFormData('title', text)}
            maxLength={100}
          />
          <View style={styles.inputFooter}>
            <Text style={styles.charCount}>{formData.title.length}/100</Text>
            {formData.title.length > 0 && (
              <Text style={styles.validationText}>
                {formData.title.length >= 10 ? '✅ Good title!' : '⚠️ Make it more specific'}
              </Text>
            )}
          </View>
        </View>

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>💡 Tips for a Great Title:</Text>
          <Text style={styles.tipsText}>
            • Be specific about what you need{'\n'}
            • Mention the quantity (e.g., "5 problems", "500 words"){'\n'}
            • Include key details (e.g., "with step-by-step solutions"){'\n'}
            • Avoid vague terms like "help me" or "do my work"
          </Text>
        </View>

        {/* Examples Section */}
        <View style={styles.examplesSection}>
          <Text style={styles.examplesTitle}>✨ Good Examples:</Text>
          <View style={styles.examplesList}>
            <View style={styles.exampleItem}>
              <Text style={styles.exampleSubject}>Math:</Text>
              <Text style={styles.exampleText}>"Solve 10 calculus integration problems with detailed steps"</Text>
            </View>
            <View style={styles.exampleItem}>
              <Text style={styles.exampleSubject}>Writing:</Text>
              <Text style={styles.exampleText}>"Write 500-word essay on climate change in APA format"</Text>
            </View>
            <View style={styles.exampleItem}>
              <Text style={styles.exampleSubject}>Coding:</Text>
              <Text style={styles.exampleText}>"Debug Python script and add error handling"</Text>
            </View>
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Fixed Next Button */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity 
          style={[
            styles.nextButton,
            (!formData.subject || !formData.title.trim()) && styles.disabledButton
          ]} 
          onPress={onNext}
          disabled={!formData.subject || !formData.title.trim()}
        >
          <Text style={styles.nextButtonText}>
            Next → {(!formData.subject || !formData.title.trim()) 
              ? 'Complete Required Fields' 
              : 'Describe Your Task'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Subject Selection Modal */}
      <Modal
        visible={showSubjectDropdown}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSubjectDropdown(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowSubjectDropdown(false)}
        >
          <Pressable style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Subject</Text>
              <TouchableOpacity 
                onPress={() => setShowSubjectDropdown(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search subjects..."
                placeholderTextColor="#999"
                value={subjectSearch}
                onChangeText={setSubjectSearch}
              />
            </View>

            <FlatList
              data={filteredSubjects}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    formData.subject === item.value && styles.selectedModalItem
                  ]}
                  onPress={() => selectSubject(item)}
                >
                  <View style={styles.modalItemContent}>
                    <Text style={[
                      styles.modalItemText,
                      formData.subject === item.value && styles.selectedModalItemText
                    ]}>
                      {item.label}
                    </Text>
                    <Text style={styles.modalItemDescription}>
                      {item.description}
                    </Text>
                  </View>
                  {formData.subject === item.value && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.emptySearch}>
                  <Text style={styles.emptySearchText}>No subjects found</Text>
                  <Text style={styles.emptySearchSubtext}>Try a different search term</Text>
                </View>
              }
            />
          </Pressable>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#f4f5f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerLeft: { flex: 1 },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
    textAlign: 'center',
  },
  headerRight: { flex: 1 },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  welcomeSection: {
    backgroundColor: '#e8f5e8',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#2e7d32',
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2e7d32',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 15,
    color: '#2e7d32',
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 18,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  dropdownSelected: {
    borderColor: '#2e7d32',
    backgroundColor: '#f8fff8',
  },
  dropdownContent: {
    flex: 1,
  },
  selectedSubjectContainer: {
    // Container for selected subject
  },
  selectedSubjectLabel: {
    fontSize: 16,
    color: '#111',
    fontWeight: '600',
    marginBottom: 2,
  },
  selectedSubjectDescription: {
    fontSize: 13,
    color: '#666',
  },
  placeholderContainer: {
    // Container for placeholder
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 2,
  },
  placeholderSubtext: {
    fontSize: 13,
    color: '#bbb',
  },
  dropdownArrow: { 
    fontSize: 12, 
    color: '#666',
    marginLeft: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    color: '#111',
  },
  inputFilled: {
    borderColor: '#2e7d32',
    backgroundColor: '#f8fff8',
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  charCount: {
    fontSize: 12,
    color: '#999',
  },
  validationText: {
    fontSize: 12,
    fontWeight: '500',
  },
  tipsSection: {
    backgroundColor: '#fff3e0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e65100',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 13,
    color: '#e65100',
    lineHeight: 18,
  },
  examplesSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  examplesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  examplesList: {
    gap: 12,
  },
  exampleItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  exampleSubject: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 4,
  },
  exampleText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
  },
  bottomSpacer: {
    height: 20,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f4f5f9',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  nextButton: {
    backgroundColor: '#2e7d32',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#2e7d32',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    color: '#666',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111',
    paddingVertical: 12,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedModalItem: {
    backgroundColor: '#f8fff8',
    borderBottomColor: '#e8f5e8',
  },
  modalItemContent: {
    flex: 1,
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
  },
  selectedModalItemText: {
    color: '#2e7d32',
    fontWeight: '600',
  },
  modalItemDescription: {
    fontSize: 13,
    color: '#666',
  },
  checkmark: {
    fontSize: 18,
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  emptySearch: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptySearchText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  emptySearchSubtext: {
    fontSize: 14,
    color: '#666',
  },
});

export default StepOne;