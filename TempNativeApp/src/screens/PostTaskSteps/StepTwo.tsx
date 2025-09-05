import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { COLORS } from '../../constants';

interface StepTwoProps {
  formData: {
    description: string;
    specialInstructions: string;
  };
  updateFormData: (field: string, value: any) => void;
}

const StepTwo: React.FC<StepTwoProps> = ({ formData, updateFormData }) => {
  const [activeField, setActiveField] = useState<'description' | 'specialInstructions' | null>(null);

  const insertTemplate = (template: string) => {
    const currentValue = formData[activeField || 'description'];
    const newValue = currentValue + '\n\n' + template;
    updateFormData(activeField || 'description', newValue);
  };

  const descriptionTemplates = [
    {
      title: '📝 Essay Template',
      content: 'Please write an essay on [TOPIC] with the following requirements:\n• Word count: [NUMBER] words\n• Format: [FORMAT]\n• Include: [REQUIREMENTS]\n• Sources: [NUMBER] academic sources\n• Due date: [DATE]',
    },
    {
      title: '📊 Research Template',
      content: 'I need help with a research project on [TOPIC]:\n• Research question: [QUESTION]\n• Methodology: [METHOD]\n• Data analysis: [ANALYSIS TYPE]\n• Expected outcomes: [OUTCOMES]\n• Format: [FORMAT]',
    },
    {
      title: '💻 Coding Template',
      content: 'I need help with a programming assignment:\n• Language: [PROGRAMMING LANGUAGE]\n• Problem: [DESCRIPTION]\n• Requirements: [REQUIREMENTS]\n• Deliverables: [FILES NEEDED]\n• Testing: [TESTING REQUIREMENTS]',
    },
    {
      title: '🧮 Math Template',
      content: 'I need help with a mathematics problem:\n• Topic: [TOPIC]\n• Problem: [PROBLEM DESCRIPTION]\n• Show all work and steps\n• Explain the solution process\n• Include any relevant formulas',
    },
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <Text style={styles.headerTitle}>Post Task (2/5)</Text>
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
          <Text style={styles.welcomeTitle}>📋 Describe Your Task</Text>
          <Text style={styles.welcomeText}>
            Provide detailed information about your assignment requirements and any special instructions.
          </Text>
        </View>

        {/* Task Description */}
        <View style={styles.section}>
          <Text style={styles.label}>📝 Task Description *</Text>
          <Text style={styles.subtitle}>
            Describe your assignment in detail. Include specific requirements, topics, and any relevant information.
          </Text>

          <TextInput
            style={[
              styles.textArea,
              activeField === 'description' && styles.textAreaFocused,
            ]}
            value={formData.description}
            onChangeText={(value) => updateFormData('description', value)}
            onFocus={() => setActiveField('description')}
            onBlur={() => setActiveField(null)}
            placeholder="Describe your assignment requirements, including:
• Specific topics or problems to cover
• Required format or structure
• Any specific sources or references needed
• Additional context or background information
• Page count, word count, or other requirements"
            placeholderTextColor={COLORS.textSecondary}
            multiline
            numberOfLines={8}
            maxLength={1000}
            textAlignVertical="top"
          />

          <View style={styles.fieldFooter}>
            <Text style={styles.characterCount}>
              {formData.description.length}/1000 characters
            </Text>
            {activeField === 'description' && (
              <TouchableOpacity
                style={styles.templateButton}
                onPress={() => {/* Show template modal */}}
              >
                <Text style={styles.templateButtonText}>📋 Templates</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Special Instructions */}
        <View style={styles.section}>
          <Text style={styles.label}>⚙️ Special Instructions (Optional)</Text>
          <Text style={styles.subtitle}>
            Add any additional requirements, preferences, or specific instructions
          </Text>

          <TextInput
            style={[
              styles.textArea,
              activeField === 'specialInstructions' && styles.textAreaFocused,
            ]}
            value={formData.specialInstructions}
            onChangeText={(value) => updateFormData('specialInstructions', value)}
            onFocus={() => setActiveField('specialInstructions')}
            onBlur={() => setActiveField(null)}
            placeholder="e.g., Please include step-by-step solutions, Use APA citation style, Submit in PDF format, Include diagrams or charts, Follow specific formatting guidelines"
            placeholderTextColor={COLORS.textSecondary}
            multiline
            numberOfLines={4}
            maxLength={500}
            textAlignVertical="top"
          />

          <Text style={styles.characterCount}>
            {formData.specialInstructions.length}/500 characters
          </Text>
        </View>

        {/* Quick Templates */}
        {activeField && (
          <View style={styles.templatesSection}>
            <Text style={styles.templatesTitle}>💡 Quick Templates</Text>
            <Text style={styles.templatesSubtitle}>
              Tap to insert a template into your {activeField === 'description' ? 'description' : 'special instructions'}
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.templatesList}
            >
              {descriptionTemplates.map((template, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.templateCard}
                  onPress={() => insertTemplate(template.content)}
                >
                  <Text style={styles.templateCardTitle}>{template.title}</Text>
                  <Text style={styles.templateCardPreview}>
                    {template.content.substring(0, 60)}...
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>💡 Tips for a great description:</Text>
          <Text style={styles.tipText}>• Be specific about what you need</Text>
          <Text style={styles.tipText}>• Include page/word count requirements</Text>
          <Text style={styles.tipText}>• Mention any specific formatting needs</Text>
          <Text style={styles.tipText}>• Provide relevant background context</Text>
          <Text style={styles.tipText}>• Include any deadlines or time constraints</Text>
          <Text style={styles.tipText}>• Specify citation style if required</Text>
          <Text style={styles.tipText}>• Mention any files or attachments needed</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: {
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  welcomeSection: {
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  section: {
    marginBottom: 25,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  textArea: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  textAreaFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.lightGray,
  },
  fieldFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  characterCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  templateButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  templateButtonText: {
    fontSize: 12,
    color: COLORS.surface,
    fontWeight: '500',
  },
  templatesSection: {
    marginBottom: 25,
  },
  templatesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  templatesSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  templatesList: {
    paddingRight: 20,
  },
  templateCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 200,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  templateCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  templateCardPreview: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  tipsSection: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 6,
    lineHeight: 20,
  },
});

export default StepTwo;
