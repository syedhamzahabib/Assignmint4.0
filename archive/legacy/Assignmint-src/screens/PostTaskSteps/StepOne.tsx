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
import { COLORS, FONTS, SPACING, SUBJECTS, URGENCY_LEVELS } from '../../constants';

interface StepOneProps {
  navigation: any;
  route: any;
}

const StepOne: React.FC<StepOneProps> = ({ navigation, route }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState('');
  const [isForStudent, setIsForStudent] = useState<boolean | null>(null);
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);
  const [customSubject, setCustomSubject] = useState('');
  const [subjectSearch, setSubjectSearch] = useState('');

  // Enhanced subjects with extensive list and single "Other" option at the top
  const enhancedSubjects = [
    // Other (Customized) - Moved to top for easy access
    { id: 'custom', label: '📝 Other (customized)', value: 'custom', description: 'Specify a custom subject' },

    // Core Academic Subjects
    { id: 'mathematics', label: '📐 Mathematics', value: 'Mathematics', description: 'General math, algebra, calculus, statistics' },
    { id: 'calculus', label: '📊 Calculus', value: 'Calculus', description: 'Differential and integral calculus' },
    { id: 'algebra', label: '🔢 Algebra', value: 'Algebra', description: 'Linear algebra, abstract algebra' },
    { id: 'statistics', label: '📈 Statistics', value: 'Statistics', description: 'Probability, data analysis, statistical methods' },
    { id: 'geometry', label: '📐 Geometry', value: 'Geometry', description: 'Euclidean geometry, trigonometry' },

    // Sciences
    { id: 'physics', label: '⚡ Physics', value: 'Physics', description: 'Mechanics, thermodynamics, electromagnetism' },
    { id: 'chemistry', label: '🧪 Chemistry', value: 'Chemistry', description: 'Organic, inorganic, physical chemistry' },
    { id: 'biology', label: '🧬 Biology', value: 'Biology', description: 'Cell biology, genetics, ecology' },
    { id: 'anatomy', label: '🫀 Anatomy', value: 'Anatomy', description: 'Human anatomy and physiology' },
    { id: 'microbiology', label: '🦠 Microbiology', value: 'Microbiology', description: 'Bacteria, viruses, microorganisms' },

    // Computer Science & Programming
    { id: 'programming', label: '💻 Programming', value: 'Programming', description: 'General programming concepts' },
    { id: 'python', label: '🐍 Python', value: 'Python', description: 'Python programming language' },
    { id: 'java', label: '☕ Java', value: 'Java', description: 'Java programming language' },
    { id: 'javascript', label: '🟨 JavaScript', value: 'JavaScript', description: 'JavaScript and web development' },
    { id: 'cplusplus', label: '🔵 C++', value: 'C++', description: 'C++ programming language' },
    { id: 'csharp', label: '🟣 C#', value: 'C#', description: 'C# programming language' },
    { id: 'sql', label: '🗄️ SQL', value: 'SQL', description: 'Database management and queries' },
    { id: 'web_development', label: '🌐 Web Development', value: 'Web Development', description: 'HTML, CSS, frontend/backend' },
    { id: 'mobile_development', label: '📱 Mobile Development', value: 'Mobile Development', description: 'iOS, Android app development' },
    { id: 'data_science', label: '📊 Data Science', value: 'Data Science', description: 'Machine learning, data analysis' },
    { id: 'artificial_intelligence', label: '🤖 AI/ML', value: 'AI/ML', description: 'Artificial intelligence and machine learning' },

    // Languages & Literature
    { id: 'english', label: '📚 English', value: 'English', description: 'English literature and composition' },
    { id: 'spanish', label: '🇪🇸 Spanish', value: 'Spanish', description: 'Spanish language and literature' },
    { id: 'french', label: '🇫🇷 French', value: 'French', description: 'French language and literature' },
    { id: 'german', label: '🇩🇪 German', value: 'German', description: 'German language and literature' },
    { id: 'chinese', label: '🇨🇳 Chinese', value: 'Chinese', description: 'Chinese language and literature' },
    { id: 'japanese', label: '🇯🇵 Japanese', value: 'Japanese', description: 'Japanese language and literature' },
    { id: 'latin', label: '🏛️ Latin', value: 'Latin', description: 'Latin language and classical studies' },
    { id: 'creative_writing', label: '✍️ Creative Writing', value: 'Creative Writing', description: 'Fiction, poetry, creative essays' },
    { id: 'technical_writing', label: '📝 Technical Writing', value: 'Technical Writing', description: 'Technical documentation and reports' },

    // Business & Economics
    { id: 'business', label: '💼 Business', value: 'Business', description: 'General business studies' },
    { id: 'accounting', label: '💰 Accounting', value: 'Accounting', description: 'Financial accounting and bookkeeping' },
    { id: 'finance', label: '💳 Finance', value: 'Finance', description: 'Corporate finance, investments' },
    { id: 'economics', label: '📈 Economics', value: 'Economics', description: 'Microeconomics, macroeconomics' },
    { id: 'marketing', label: '📢 Marketing', value: 'Marketing', description: 'Digital marketing, market research' },
    { id: 'management', label: '👥 Management', value: 'Management', description: 'Business management and leadership' },

    // Social Sciences
    { id: 'psychology', label: '🧠 Psychology', value: 'Psychology', description: 'Clinical, cognitive, social psychology' },
    { id: 'sociology', label: '👥 Sociology', value: 'Sociology', description: 'Social behavior and society' },
    { id: 'political_science', label: '🏛️ Political Science', value: 'Political Science', description: 'Government and politics' },
    { id: 'history', label: '📜 History', value: 'History', description: 'World history, American history' },
    { id: 'geography', label: '🌍 Geography', value: 'Geography', description: 'Physical and human geography' },
    { id: 'anthropology', label: '🏺 Anthropology', value: 'Anthropology', description: 'Cultural and physical anthropology' },

    // Engineering
    { id: 'engineering', label: '⚙️ Engineering', value: 'Engineering', description: 'General engineering principles' },
    { id: 'mechanical_engineering', label: '🔧 Mechanical Engineering', value: 'Mechanical Engineering', description: 'Mechanical systems and design' },
    { id: 'electrical_engineering', label: '⚡ Electrical Engineering', value: 'Electrical Engineering', description: 'Electrical systems and circuits' },
    { id: 'civil_engineering', label: '🏗️ Civil Engineering', value: 'Civil Engineering', description: 'Infrastructure and construction' },
    { id: 'chemical_engineering', label: '🧪 Chemical Engineering', value: 'Chemical Engineering', description: 'Chemical processes and reactions' },
    { id: 'computer_engineering', label: '💻 Computer Engineering', value: 'Computer Engineering', description: 'Hardware and software systems' },

    // Health & Medicine
    { id: 'nursing', label: '🏥 Nursing', value: 'Nursing', description: 'Nursing practice and theory' },
    { id: 'pharmacy', label: '💊 Pharmacy', value: 'Pharmacy', description: 'Pharmaceutical studies' },
    { id: 'nutrition', label: '🥗 Nutrition', value: 'Nutrition', description: 'Dietetics and nutrition science' },
    { id: 'public_health', label: '🏥 Public Health', value: 'Public Health', description: 'Epidemiology and health policy' },

    // Arts & Design
    { id: 'art', label: '🎨 Art', value: 'Art', description: 'Fine arts and art history' },
    { id: 'design', label: '🎨 Design', value: 'Design', description: 'Graphic design and visual arts' },
    { id: 'architecture', label: '🏛️ Architecture', value: 'Architecture', description: 'Architectural design and theory' },
    { id: 'music', label: '🎵 Music', value: 'Music', description: 'Music theory and composition' },
    { id: 'film', label: '🎬 Film', value: 'Film', description: 'Film studies and production' },

    // Law & Criminal Justice
    { id: 'law', label: '⚖️ Law', value: 'Law', description: 'Legal studies and jurisprudence' },
    { id: 'criminal_justice', label: '👮 Criminal Justice', value: 'Criminal Justice', description: 'Criminal law and justice system' },

    // Education
    { id: 'education', label: '📚 Education', value: 'Education', description: 'Teaching and educational theory' },
    { id: 'special_education', label: '🎓 Special Education', value: 'Special Education', description: 'Special needs education' },

    // Environmental Studies
    { id: 'environmental_science', label: '🌱 Environmental Science', value: 'Environmental Science', description: 'Environmental studies and sustainability' },
    { id: 'sustainability', label: '♻️ Sustainability', value: 'Sustainability', description: 'Sustainable development and practices' },
  ];

  // Filter subjects based on search
  const filteredSubjects = enhancedSubjects.filter(subject =>
    subject.label.toLowerCase().includes(subjectSearch.toLowerCase()) ||
    subject.description?.toLowerCase().includes(subjectSearch.toLowerCase())
  );

  const handleSubjectSelect = (subject: any) => {
    try {
      console.log('Selecting subject:', subject);
      if (subject.value === 'custom') {
        setSelectedSubject('custom');
        setCustomSubject('');
      } else {
        setSelectedSubject(subject.value);
        setCustomSubject('');
      }
      setShowSubjectPicker(false);
      setSubjectSearch('');
    } catch (error) {
      console.error('Error selecting subject:', error);
    }
  };

  // Validation state
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const handleNext = () => {
    const errors: {[key: string]: string} = {};

    if (!taskTitle.trim()) {
      errors.taskTitle = 'Task title is required';
    }

    if (!selectedSubject) {
      errors.selectedSubject = 'Subject is required';
    } else if (selectedSubject === 'custom' && !customSubject.trim()) {
      errors.customSubject = 'Please specify your custom subject';
    }

    if (!selectedUrgency) {
      errors.selectedUrgency = 'Urgency level is required';
    }

    if (isForStudent === null) {
      errors.isForStudent = 'Please select if this is for a student';
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length === 0) {
      const finalSubject = selectedSubject === 'custom' ? customSubject : selectedSubject;
      navigation.navigate('StepTwo', {
        taskTitle,
        selectedSubject: finalSubject,
        selectedUrgency,
        isForStudent,
      });
    }
  };

  const isFormValid = taskTitle.trim() &&
    (selectedSubject === 'custom' ? customSubject.trim() : selectedSubject) &&
    selectedUrgency &&
    isForStudent !== null;

  const getBudgetHint = () => {
    if (!selectedUrgency) {return null;}

    switch (selectedUrgency) {
      case 'high':
        return '💡 Faster deadlines often require higher budget to attract expert help. Consider $50+ for urgent tasks.';
      case 'medium':
        return '💡 Medium priority tasks typically work well with $30-70 budgets.';
      case 'low':
        return '💡 Flexible deadlines allow for more competitive pricing. $20-50 is often sufficient.';
      default:
        return null;
    }
  };

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
            <Text style={styles.headerTitle}>Create Task</Text>
            <View style={styles.stepIndicator}>
              <Text style={styles.stepText}>Step 1 of 5</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '20%' }]} />
            </View>
          </View>

          {/* Task Title Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>💡</Text>
              <Text style={styles.sectionTitle}>Task Title</Text>
            </View>
            <Text style={styles.sectionSubtitle}>Give your task a clear, descriptive title</Text>
            <TextInput
              style={[
                styles.titleInput,
                validationErrors.taskTitle && styles.inputError,
              ]}
              placeholder="e.g., Help with calculus homework"
              placeholderTextColor={COLORS.textSecondary}
              value={taskTitle}
              onChangeText={(text) => {
                setTaskTitle(text);
                if (validationErrors.taskTitle) {
                  setValidationErrors(prev => ({ ...prev, taskTitle: '' }));
                }
              }}
              maxLength={100}
            />
            <Text style={styles.characterCount}>{taskTitle.length}/100</Text>
            {validationErrors.taskTitle && (
              <Text style={styles.errorText}>{validationErrors.taskTitle}</Text>
            )}
          </View>

          {/* Subject Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Subject</Text>
            <Text style={styles.sectionSubtitle}>Choose the academic subject</Text>

            <TouchableOpacity
              style={[
                styles.subjectPicker,
                selectedSubject && styles.subjectPickerSelected,
                validationErrors.selectedSubject && styles.inputError,
              ]}
              onPress={() => {
                try {
                  console.log('Opening subject picker');
                  setShowSubjectPicker(true);
                  if (validationErrors.selectedSubject) {
                    setValidationErrors(prev => ({ ...prev, selectedSubject: '' }));
                  }
                } catch (error) {
                  console.error('Error opening subject picker:', error);
                }
              }}
            >
              {selectedSubject ? (
                <View>
                  <Text style={styles.selectedSubjectText}>
                    {selectedSubject === 'custom' ? customSubject : selectedSubject}
                  </Text>
                  {selectedSubject === 'custom' && (
                    <Text style={styles.customSubjectLabel}>Custom subject</Text>
                  )}
                </View>
              ) : (
                <Text style={styles.subjectPickerPlaceholder}>Tap to search subjects</Text>
              )}
              <Text style={styles.subjectPickerArrow}>🔍</Text>
            </TouchableOpacity>

            {/* Custom Subject Input */}
            {selectedSubject === 'custom' && (
              <View style={styles.customSubjectContainer}>
                <TextInput
                  style={[
                    styles.customSubjectInput,
                    validationErrors.customSubject && styles.inputError,
                  ]}
                  placeholder="Type your custom subject..."
                  placeholderTextColor={COLORS.textSecondary}
                  value={customSubject}
                  onChangeText={(text) => {
                    setCustomSubject(text);
                    if (validationErrors.customSubject) {
                      setValidationErrors(prev => ({ ...prev, customSubject: '' }));
                    }
                  }}
                />
                {validationErrors.customSubject && (
                  <Text style={styles.errorText}>{validationErrors.customSubject}</Text>
                )}
              </View>
            )}

            {validationErrors.selectedSubject && (
              <Text style={styles.errorText}>{validationErrors.selectedSubject}</Text>
            )}
          </View>

          {/* Urgency Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Urgency Level</Text>
            <Text style={styles.sectionSubtitle}>How quickly do you need this completed?</Text>
            <View style={styles.urgencyContainer}>
              {URGENCY_LEVELS.map((urgency) => (
                <TouchableOpacity
                  key={urgency.id}
                  style={[
                    styles.urgencyButton,
                    selectedUrgency === urgency.value && styles.urgencyButtonSelected,
                  ]}
                  onPress={() => {
                    setSelectedUrgency(urgency.value);
                    if (validationErrors.selectedUrgency) {
                      setValidationErrors(prev => ({ ...prev, selectedUrgency: '' }));
                    }
                  }}
                >
                  <Text style={[
                    styles.urgencyButtonText,
                    selectedUrgency === urgency.value && styles.urgencyButtonTextSelected,
                  ]}>
                    {urgency.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {validationErrors.selectedUrgency && (
              <Text style={styles.errorText}>{validationErrors.selectedUrgency}</Text>
            )}

            {/* Budget Hint */}
            {getBudgetHint() && (
              <View style={styles.budgetHintContainer}>
                <Text style={styles.budgetHintText}>{getBudgetHint()}</Text>
              </View>
            )}
          </View>

          {/* Student Question */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Is this task for a student?</Text>
            <Text style={styles.sectionSubtitle}>This helps us match you with the right expert</Text>
            <View style={styles.radioContainer}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => {
                  setIsForStudent(true);
                  if (validationErrors.isForStudent) {
                    setValidationErrors(prev => ({ ...prev, isForStudent: '' }));
                  }
                }}
              >
                <View style={styles.radioButton}>
                  {isForStudent === true && <View style={styles.radioButtonSelected} />}
                </View>
                <Text style={styles.radioLabel}>Yes, I'm a student</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => {
                  setIsForStudent(false);
                  if (validationErrors.isForStudent) {
                    setValidationErrors(prev => ({ ...prev, isForStudent: '' }));
                  }
                }}
              >
                <View style={styles.radioButton}>
                  {isForStudent === false && <View style={styles.radioButtonSelected} />}
                </View>
                <Text style={styles.radioLabel}>No, I'm not a student</Text>
              </TouchableOpacity>
            </View>

            {validationErrors.isForStudent && (
              <Text style={styles.errorText}>{validationErrors.isForStudent}</Text>
            )}
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
              Next: Task Details →
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Custom Subject Picker Overlay */}
      {showSubjectPicker && (
        <View style={styles.overlay}>
          <View style={styles.overlayContent}>
            <View style={styles.overlayHeader}>
              <TouchableOpacity
                style={styles.overlayCloseButton}
                onPress={() => {
                  setShowSubjectPicker(false);
                  setSubjectSearch('');
                }}
              >
                <Text style={styles.overlayCloseText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.overlayTitle}>Search Subjects</Text>
              <View style={styles.overlaySpacer} />
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search subjects..."
                placeholderTextColor={COLORS.textSecondary}
                value={subjectSearch}
                onChangeText={setSubjectSearch}
                autoFocus
              />
            </View>

            <ScrollView style={styles.overlayList} showsVerticalScrollIndicator={false}>
              {filteredSubjects.length > 0 ? (
                filteredSubjects.map((subject) => (
                  <TouchableOpacity
                    key={subject.id}
                    style={styles.overlayItem}
                    onPress={() => handleSubjectSelect(subject)}
                  >
                    <Text style={styles.overlayItemLabel}>{subject.label}</Text>
                    {subject.description && (
                      <Text style={styles.overlayItemDescription}>{subject.description}</Text>
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>No subjects found</Text>
                  <Text style={styles.noResultsSubtext}>Try a different search term</Text>
                </View>
              )}
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
    overflow: 'hidden',
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
  titleInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
  },
  characterCount: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'right',
    marginTop: SPACING.xs,
  },
  subjectPicker: {
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
  subjectPickerSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  subjectPickerPlaceholder: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  selectedSubjectText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    fontWeight: FONTS.weights.medium,
  },
  customSubjectLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },
  subjectPickerArrow: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  customSubjectContainer: {
    marginTop: SPACING.md,
  },
  customSubjectInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
  },
  urgencyContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  urgencyButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  urgencyButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  urgencyButtonText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    fontWeight: FONTS.weights.medium,
  },
  urgencyButtonTextSelected: {
    color: COLORS.primary,
    fontWeight: FONTS.weights.semiBold,
  },
  budgetHintContainer: {
    backgroundColor: COLORS.primary + '10',
    borderRadius: 12,
    padding: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  budgetHintText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    lineHeight: 20,
  },
  radioContainer: {
    gap: SPACING.md,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  radioLabel: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
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
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
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
  noResultsContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  noResultsSubtext: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 2,
  },
  errorText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.error,
    marginTop: SPACING.xs,
    fontWeight: FONTS.weights.medium,
  },
});

export default StepOne;
