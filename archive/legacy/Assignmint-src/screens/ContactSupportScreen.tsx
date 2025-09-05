import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const ContactSupportScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('alex.johnson@email.com');
  const [category, setCategory] = useState('General');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supportCategories = [
    'General',
    'Technical Issue',
    'Payment Problem',
    'Account Issue',
    'Task Related',
    'Dispute',
    'Feature Request',
    'Bug Report',
  ];

  const handleSubmit = () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Missing Information', 'Please fill in both subject and message fields.');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Support Request Submitted',
        'Thank you for contacting us! We\'ll get back to you within 24 hours.',
        [
          {
            text: 'OK',
            onPress: () => {
              setSubject('');
              setMessage('');
              navigation.goBack();
            },
          },
        ]
      );
    }, 2000);
  };

  const handleCategorySelect = (selectedCategory: string) => {
    setCategory(selectedCategory);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Contact Support</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Support Info */}
          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>💬</Text>
              <Text style={styles.infoTitle}>We're here to help!</Text>
              <Text style={styles.infoText}>
                Our support team typically responds within 24 hours. For urgent issues, please include as much detail as possible.
              </Text>
            </View>
          </View>

          {/* Contact Form */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Support Request</Text>

            {/* Category Selection */}
            <View style={styles.categorySection}>
              <Text style={styles.inputLabel}>Category</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScroll}
              >
                {supportCategories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryChip,
                      category === cat && styles.categoryChipSelected,
                    ]}
                    onPress={() => handleCategorySelect(cat)}
                  >
                    <Text style={[
                      styles.categoryChipText,
                      category === cat && styles.categoryChipTextSelected,
                    ]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Email Input */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#8E8E93"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Subject Input */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Subject</Text>
              <TextInput
                style={styles.input}
                value={subject}
                onChangeText={setSubject}
                placeholder="Brief description of your issue"
                placeholderTextColor="#8E8E93"
                maxLength={100}
              />
              <Text style={styles.characterCount}>{subject.length}/100</Text>
            </View>

            {/* Message Input */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Message</Text>
              <TextInput
                style={[styles.input, styles.messageInput]}
                value={message}
                onChangeText={setMessage}
                placeholder="Please describe your issue in detail..."
                placeholderTextColor="#8E8E93"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                maxLength={1000}
              />
              <Text style={styles.characterCount}>{message.length}/1000</Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!subject.trim() || !message.trim() || isSubmitting) && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!subject.trim() || !message.trim() || isSubmitting}
            >
              <Text style={[
                styles.submitButtonText,
                (!subject.trim() || !message.trim() || isSubmitting) && styles.submitButtonTextDisabled,
              ]}>
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Alternative Contact Methods */}
          <View style={styles.alternativeSection}>
            <Text style={styles.sectionTitle}>Other Ways to Get Help</Text>

            <View style={styles.alternativeCard}>
              <Text style={styles.alternativeIcon}>📚</Text>
              <Text style={styles.alternativeTitle}>Help Center</Text>
              <Text style={styles.alternativeText}>Browse our comprehensive help articles</Text>
              <TouchableOpacity style={styles.alternativeButton}>
                <Text style={styles.alternativeButtonText}>Visit Help Center</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.alternativeCard}>
              <Text style={styles.alternativeIcon}>💬</Text>
              <Text style={styles.alternativeTitle}>Live Chat</Text>
              <Text style={styles.alternativeText}>Chat with our support team (Mon-Fri, 9AM-6PM)</Text>
              <TouchableOpacity style={styles.alternativeButton}>
                <Text style={styles.alternativeButtonText}>Start Chat</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.alternativeCard}>
              <Text style={styles.alternativeIcon}>📧</Text>
              <Text style={styles.alternativeTitle}>Email Support</Text>
              <Text style={styles.alternativeText}>Send us an email directly</Text>
              <TouchableOpacity style={styles.alternativeButton}>
                <Text style={styles.alternativeButtonText}>support@assignmint.com</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  keyboardAvoidingView: {
    flex: 1,
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
  content: {
    flex: 1,
  },
  infoSection: {
    marginTop: 16,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
  formSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  categorySection: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryChip: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  categoryChipSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  categoryChipTextSelected: {
    color: '#FFFFFF',
  },
  inputSection: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
  },
  messageInput: {
    height: 120,
    paddingTop: 12,
  },
  characterCount: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'right',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  submitButtonDisabled: {
    backgroundColor: '#E5E5EA',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonTextDisabled: {
    color: '#8E8E93',
  },
  alternativeSection: {
    marginBottom: 24,
  },
  alternativeCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alternativeIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  alternativeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  alternativeText: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
    lineHeight: 20,
  },
  alternativeButton: {
    alignSelf: 'flex-start',
  },
  alternativeButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ContactSupportScreen;
