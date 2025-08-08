import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { COLORS, FONTS, SPACING } from '../../constants';

interface StepTwoProps {
  navigation: any;
  route: any;
}

const StepTwo: React.FC<StepTwoProps> = ({ navigation, route }) => {
  const { taskTitle, selectedSubject, selectedUrgency, isForStudent } = route.params;
  
  const [description, setDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customTemplate, setCustomTemplate] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);

  // Enhanced templates with better options
  const templates = [
    { id: 'mla', label: '📝 MLA Essay', value: 'MLA Essay', description: 'Standard academic essay format' },
    { id: 'apa', label: '📄 APA Report', value: 'APA Report', description: 'Research paper format' },
    { id: 'math', label: '🔢 Math Problem Set', value: 'Math Problem Set', description: 'Step-by-step solutions' },
    { id: 'code', label: '💻 Code Assignment', value: 'Code Assignment', description: 'Programming projects' },
    { id: 'lab', label: '🧪 Lab Report', value: 'Lab Report', description: 'Scientific experiment write-up' },
    { id: 'custom', label: '📋 Other (type your own)', value: 'custom', description: 'Specify custom format' }
  ];

  const handleNext = () => {
    if (!description.trim()) {
      return;
    }

    const finalTemplate = selectedTemplate === 'custom' ? customTemplate : selectedTemplate;
    if (selectedTemplate === 'custom' && !customTemplate.trim()) {
      return;
    }

    navigation.navigate('StepThree', {
      taskTitle,
      selectedSubject,
      selectedUrgency,
      isForStudent,
      description,
      selectedTemplate: finalTemplate,
      uploadedFiles,
    });
  };

  const isFormValid = description.trim() && 
    (selectedTemplate === 'custom' ? customTemplate.trim() : selectedTemplate);

  const getSubjectInstructions = () => {
    const subject = selectedSubject?.toLowerCase() || '';
    
    if (subject.includes('essay') || subject.includes('writing') || subject.includes('english')) {
      return {
        title: "📝 Essay Writing Tips",
        tips: [
          "Include page length, double-spacing, and preferred font",
          "Specify citation style (MLA, APA, Chicago, etc.)",
          "Mention any specific requirements or guidelines",
          "You may also attach example essays if available"
        ]
      };
    } else if (subject.includes('math') || subject.includes('calculus') || subject.includes('algebra')) {
      return {
        title: "🔢 Math Problem Tips",
        tips: [
          "Specify any preferred solving method or approach",
          "Mention if you need step-by-step work shown",
          "Include any specific formulas or theorems to use",
          "Let us know if you need explanations with the solutions"
        ]
      };
    } else if (subject.includes('programming') || subject.includes('coding') || subject.includes('code')) {
      return {
        title: "💻 Programming Tips",
        tips: [
          "Specify the programming language required",
          "Mention any frameworks or libraries to use",
          "Include expected output format or requirements",
          "Describe any specific algorithms or approaches needed"
        ]
      };
    } else if (subject.includes('lab') || subject.includes('science') || subject.includes('chemistry')) {
      return {
        title: "🧪 Lab Report Tips",
        tips: [
          "Include experiment objectives and procedures",
          "Specify any required sections (Abstract, Methods, Results, etc.)",
          "Mention any specific formatting requirements",
          "Include any data or observations to be analyzed"
        ]
      };
    } else {
      return {
        title: "📋 General Tips",
        tips: [
          "Be specific about your requirements and expectations",
          "Include any relevant guidelines or rubrics",
          "Mention any specific sources or references needed",
          "Attach any relevant files or examples if available"
        ]
      };
    }
  };

  const handleTemplateSelect = (template: any) => {
    if (template.value === 'custom') {
      setSelectedTemplate('custom');
      setCustomTemplate('');
    } else {
      setSelectedTemplate(template.value);
      setCustomTemplate('');
    }
    setShowTemplatePicker(false);
  };

  const subjectInstructions = getSubjectInstructions();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Task Details</Text>
            <View style={styles.stepIndicator}>
              <Text style={styles.stepText}>Step 2 of 5</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '40%' }]} />
            </View>
          </View>

          {/* Task Description */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>📝</Text>
              <Text style={styles.sectionTitle}>Task Description</Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              Provide detailed instructions for your task
            </Text>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Describe what you need help with, including any specific requirements, guidelines, or expectations..."
              placeholderTextColor={COLORS.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              maxLength={1000}
            />
            <Text style={styles.characterCount}>{description.length}/1000</Text>
          </View>

          {/* Template Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Format/Template (Optional)</Text>
            <Text style={styles.sectionSubtitle}>Choose a format that matches your needs</Text>
            
            <TouchableOpacity
              style={[
                styles.templatePicker,
                selectedTemplate && styles.templatePickerSelected
              ]}
              onPress={() => setShowTemplatePicker(true)}
            >
              {selectedTemplate ? (
                <View>
                  <Text style={styles.selectedTemplateText}>
                    {selectedTemplate === 'custom' ? customTemplate : selectedTemplate}
                  </Text>
                  {selectedTemplate === 'custom' && (
                    <Text style={styles.customTemplateLabel}>Custom template</Text>
                  )}
                </View>
              ) : (
                <Text style={styles.templatePickerPlaceholder}>Tap to select format (optional)</Text>
              )}
              <Text style={styles.templatePickerArrow}>▼</Text>
            </TouchableOpacity>

            {/* Custom Template Input */}
            {selectedTemplate === 'custom' && (
              <View style={styles.customTemplateContainer}>
                <TextInput
                  style={styles.customTemplateInput}
                  placeholder="Describe your custom format or style..."
                  placeholderTextColor={COLORS.textSecondary}
                  value={customTemplate}
                  onChangeText={setCustomTemplate}
                />
              </View>
            )}
          </View>

          {/* File Upload Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Attachments (Optional)</Text>
            <Text style={styles.sectionSubtitle}>Upload relevant files, examples, or guidelines</Text>
            
            <TouchableOpacity style={styles.uploadButton}>
              <Text style={styles.uploadIcon}>📎</Text>
              <Text style={styles.uploadText}>Tap to upload files</Text>
              <Text style={styles.uploadSubtext}>PDF, DOCX, PNG, JPG up to 10MB</Text>
            </TouchableOpacity>

            {uploadedFiles.length > 0 && (
              <View style={styles.uploadedFilesContainer}>
                <Text style={styles.uploadedFilesTitle}>Uploaded Files:</Text>
                {uploadedFiles.map((file, index) => (
                  <View key={index} style={styles.uploadedFileItem}>
                    <Text style={styles.uploadedFileName}>{file}</Text>
                    <TouchableOpacity style={styles.removeFileButton}>
                      <Text style={styles.removeFileText}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Subject-Specific Instructions */}
          <View style={styles.section}>
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsTitle}>{subjectInstructions.title}</Text>
              {subjectInstructions.tips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Spacer for bottom button */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Next Button */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[styles.nextButton, !isFormValid && styles.nextButtonDisabled]}
            onPress={handleNext}
            disabled={!isFormValid}
          >
            <Text style={[styles.nextButtonText, !isFormValid && styles.nextButtonTextDisabled]}>
              Next: AI Assistance →
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Custom Template Picker Overlay */}
      {showTemplatePicker && (
        <View style={styles.overlay}>
          <View style={styles.overlayContent}>
            <View style={styles.overlayHeader}>
              <TouchableOpacity
                style={styles.overlayCloseButton}
                onPress={() => setShowTemplatePicker(false)}
              >
                <Text style={styles.overlayCloseText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.overlayTitle}>Choose Template</Text>
              <View style={styles.overlaySpacer} />
            </View>

            <ScrollView style={styles.overlayList} showsVerticalScrollIndicator={false}>
              {templates.map((template) => (
                <TouchableOpacity
                  key={template.id}
                  style={styles.overlayItem}
                  onPress={() => handleTemplateSelect(template)}
                >
                  <Text style={styles.overlayItemLabel}>{template.label}</Text>
                  <Text style={styles.overlayItemDescription}>{template.description}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: COLORS.text,
  },
  headerTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.text,
  },
  stepIndicator: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  stepText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    color: COLORS.white,
  },
  progressContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.gray200,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  sectionSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
    minHeight: 120,
  },
  characterCount: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'right',
    marginTop: SPACING.xs,
  },
  templatePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  templatePickerSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  templatePickerPlaceholder: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  selectedTemplateText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    fontWeight: FONTS.weights.medium,
  },
  customTemplateLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },
  templatePickerArrow: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  customTemplateContainer: {
    marginTop: SPACING.md,
  },
  customTemplateInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: SPACING.xl,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  uploadIcon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  uploadText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  uploadSubtext: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  uploadedFilesContainer: {
    marginTop: SPACING.md,
  },
  uploadedFilesTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  uploadedFileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.gray100,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  uploadedFileName: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    flex: 1,
  },
  removeFileButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeFileText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.white,
    fontWeight: FONTS.weights.bold,
  },
  instructionsContainer: {
    backgroundColor: COLORS.primary + '10',
    borderRadius: 12,
    padding: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  instructionsTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: SPACING.xs,
  },
  tipBullet: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    marginRight: SPACING.sm,
    fontWeight: FONTS.weights.bold,
  },
  tipText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    flex: 1,
    lineHeight: 18,
  },
  bottomSpacer: {
    height: 100,
  },
  bottomContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: COLORS.gray300,
  },
  nextButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.white,
  },
  nextButtonTextDisabled: {
    color: COLORS.textSecondary,
  },
  // Overlay styles (replacing Modal)
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  overlayContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  overlayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  overlayCloseButton: {
    paddingVertical: SPACING.sm,
  },
  overlayCloseText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.primary,
    fontWeight: FONTS.weights.medium,
  },
  overlayTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.text,
  },
  overlaySpacer: {
    width: 60,
  },
  overlayList: {
    maxHeight: 400,
  },
  overlayItem: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  overlayItemLabel: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  overlayItemDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
});

export default StepTwo; 