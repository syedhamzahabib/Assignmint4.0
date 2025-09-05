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

interface StepFourProps {
  navigation: any;
  route: any;
}

const StepFour: React.FC<StepFourProps> = ({ navigation, route }) => {
  const {
    taskTitle,
    selectedSubject,
    selectedUrgency,
    isForStudent,
    description,
    selectedTemplate,
    uploadedFiles,
    aiRangeMin, // Fixed: was aiPrecision
    aiRangeMax, // Fixed: was aiOriginality
    aiTaskExplainer,
    summaryOnDelivery,
  } = route.params;

  const [budget, setBudget] = useState('');
  const [budgetCursorPosition, setBudgetCursorPosition] = useState(0);
  const [deadline, setDeadline] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('');
  const [matchingPreference, setMatchingPreference] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setDeadline(formatDate(date));
  };

  const handleTimeChange = (date: Date) => {
    setSelectedTime(date);
    setDeadlineTime(formatTime(date));
  };

  const handleHourScroll = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    const hourIndex = Math.round(contentOffset.y / 40);
    const hour = Math.max(1, Math.min(12, hourIndex + 1));

    const newTime = new Date(selectedTime);
    const isPM = newTime.getHours() >= 12;
    newTime.setHours(isPM ? hour + 12 : hour);
    setSelectedTime(newTime);
  };

  const handleMinuteScroll = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    const minuteIndex = Math.round(contentOffset.y / 40);
    const minute = Math.max(0, Math.min(59, minuteIndex));

    const newTime = new Date(selectedTime);
    newTime.setMinutes(minute);
    setSelectedTime(newTime);
  };

  const handlePeriodScroll = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    const periodIndex = Math.round(contentOffset.y / 40);
    const period = periodIndex === 0 ? 'AM' : 'PM';

    const newTime = new Date(selectedTime);
    const currentHour = newTime.getHours();
    const isCurrentlyPM = currentHour >= 12;

    if (period === 'AM' && isCurrentlyPM) {
      newTime.setHours(currentHour - 12);
    } else if (period === 'PM' && !isCurrentlyPM) {
      newTime.setHours(currentHour + 12);
    }
    setSelectedTime(newTime);
  };

  const getFullDeadline = () => {
    if (!deadline && !deadlineTime) {return '';}
    if (deadline && deadlineTime) {return `${deadline} at ${deadlineTime}`;}
    return deadline || deadlineTime;
  };

  // Budget suggestions based on urgency and subject
  const getBudgetSuggestions = () => {
    const suggestions = [];

    if (selectedUrgency === 'high') {
      suggestions.push({ amount: '50', label: 'Quick Turnaround' });
      suggestions.push({ amount: '75', label: 'Priority Service' });
      suggestions.push({ amount: '100', label: 'Express Delivery' });
    } else if (selectedUrgency === 'medium') {
      suggestions.push({ amount: '30', label: 'Standard Service' });
      suggestions.push({ amount: '50', label: 'Quality Work' });
      suggestions.push({ amount: '70', label: 'Premium Service' });
    } else {
      suggestions.push({ amount: '20', label: 'Basic Service' });
      suggestions.push({ amount: '35', label: 'Standard Quality' });
      suggestions.push({ amount: '50', label: 'High Quality' });
    }

    return suggestions;
  };

  const getBudgetHint = () => {
    const subject = selectedSubject?.toLowerCase() || '';

    if (selectedUrgency === 'high') {
      return '💡 Urgent tasks typically need higher budgets ($50+) to attract experts quickly.';
    } else if (subject.includes('essay') || subject.includes('writing')) {
      return '💡 Essays typically range from $30-70 depending on length and complexity.';
    } else if (subject.includes('math') || subject.includes('calculus')) {
      return '💡 Math problems usually cost $25-60 based on difficulty and number of problems.';
    } else if (subject.includes('programming') || subject.includes('coding')) {
      return '💡 Programming projects typically range from $40-100+ depending on complexity.';
    } else if (subject.includes('lab') || subject.includes('science')) {
      return '💡 Lab reports usually cost $35-80 depending on the experiment complexity.';
    }

    return '💡 More complex or urgent tasks usually attract experts faster with higher budgets.';
  };

  const formatBudget = (value: string) => {
    // Remove all non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');

    if (numericValue === '') {return '';}

    // Handle decimal points - only allow one
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      // More than one decimal point, keep only the first
      const wholePart = parts[0];
      const decimalPart = parts.slice(1).join('');
      const formatted = `${wholePart}.${decimalPart}`;
      return formatted;
    }

    // Limit decimal places to 2 (cents)
    if (parts.length === 2 && parts[1].length > 2) {
      const wholePart = parts[0];
      const decimalPart = parts[1].substring(0, 2);
      const formatted = `${wholePart}.${decimalPart}`;
      return formatted;
    }

    return numericValue;
  };

  const handleBudgetChange = (value: string) => {
    const formatted = formatBudget(value);
    setBudget(formatted);
  };

  const handleBudgetSuggestion = (amount: string) => {
    setBudget(amount);
  };

  const getBudgetDisplayValue = () => {
    if (!budget) {return '';}

    // Add commas for thousands in the whole number part
    const parts = budget.split('.');
    if (parts.length === 1) {
      const number = parseInt(parts[0], 10);
      if (isNaN(number)) {return budget;}
      return number.toLocaleString();
    } else {
      const wholePart = parseInt(parts[0], 10);
      const decimalPart = parts[1];
      if (isNaN(wholePart)) {return budget;}
      return `${wholePart.toLocaleString()}.${decimalPart}`;
    }
  };

  const handleNext = () => {
    if (!budget || !deadline || !matchingPreference) {
      return;
    }

    navigation.navigate('StepFive', {
      taskTitle,
      selectedSubject,
      selectedUrgency,
      isForStudent,
      description,
      selectedTemplate,
      uploadedFiles,
      aiRangeMin, // Fixed parameter name
      aiRangeMax, // Fixed parameter name
      aiTaskExplainer,
      summaryOnDelivery,
      budget,
      deadline,
      deadlineTime,
      matchingPreference,
    });
  };

  const isFormValid = budget && deadline && matchingPreference;

  const budgetSuggestions = getBudgetSuggestions();

  const generateCalendarDays = (currentDate: Date) => {
    const days: any[] = [];
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // Calculate the day of the week for the first day of the month
    const startDayOfWeek = firstDayOfMonth.getDay();

    // Add days from the previous month to fill the grid
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(firstDayOfMonth);
      date.setDate(firstDayOfMonth.getDate() - i);
      days.push({ dayNumber: date.getDate(), isCurrentMonth: false, isToday: false });
    }

    // Add days of the current month
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const date = new Date(currentDate);
      date.setDate(i);
      days.push({
        dayNumber: i,
        isCurrentMonth: true,
        isToday: date.toDateString() === new Date().toDateString(),
        isSelected: date.toDateString() === selectedDate.toDateString(),
        date: date,
      });
    }

    // Add days from the next month to fill the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 columns = 42
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(lastDayOfMonth);
      date.setDate(lastDayOfMonth.getDate() + i);
      days.push({ dayNumber: date.getDate(), isCurrentMonth: false, isToday: false });
    }

    return days;
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
            <Text style={styles.headerTitle}>Budget & Deadline</Text>
            <View style={styles.stepIndicator}>
              <Text style={styles.stepText}>Step 4 of 5</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '80%' }]} />
            </View>
          </View>

          {/* Budget Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>💰</Text>
              <Text style={styles.sectionTitle}>Budget</Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              Set your budget to attract the right experts
            </Text>

            <View style={styles.budgetInputContainer}>
              <Text style={styles.budgetDollarSign}>$</Text>
              <TextInput
                style={styles.budgetInput}
                placeholder="0.00"
                placeholderTextColor={COLORS.textSecondary}
                value={getBudgetDisplayValue()}
                onChangeText={handleBudgetChange}
                keyboardType="decimal-pad"
                maxLength={15}
                onSelectionChange={(e) => setBudgetCursorPosition(e.nativeEvent.selection.start)}
                testID="post.price"
              />
            </View>

            {/* Budget Suggestions */}
            <View style={styles.budgetSuggestionsContainer}>
              <Text style={styles.budgetSuggestionsTitle}>Quick Suggestions:</Text>
              <View style={styles.budgetSuggestionsGrid}>
                {budgetSuggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.budgetSuggestionButton}
                    onPress={() => handleBudgetSuggestion(suggestion.amount)}
                  >
                    <Text style={styles.budgetSuggestionAmount}>${suggestion.amount}</Text>
                    <Text style={styles.budgetSuggestionLabel}>{suggestion.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Budget Hint */}
            <View style={styles.budgetHintContainer}>
              <Text style={styles.budgetHintText}>{getBudgetHint()}</Text>
            </View>
          </View>

          {/* Deadline Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>⏰</Text>
              <Text style={styles.sectionTitle}>Deadline</Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              When do you need this completed?
            </Text>

            <View style={styles.deadlineContainer}>
              {/* Date Picker */}
              <TouchableOpacity
                style={styles.deadlineButton}
                onPress={() => setShowDatePicker(true)}
                testID="post.deadline"
              >
                <Text style={styles.deadlineButtonIcon}>📅</Text>
                <View style={styles.deadlineButtonContent}>
                  <Text style={styles.deadlineButtonLabel}>Date</Text>
                  <Text style={styles.deadlineButtonValue}>
                    {deadline || 'Select date'}
                  </Text>
                </View>
                <Text style={styles.deadlineButtonArrow}>›</Text>
              </TouchableOpacity>

              {/* Time Picker */}
              <TouchableOpacity
                style={styles.deadlineButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.deadlineButtonIcon}>🕐</Text>
                <View style={styles.deadlineButtonContent}>
                  <Text style={styles.deadlineButtonLabel}>Time</Text>
                  <Text style={styles.deadlineButtonValue}>
                    {deadlineTime || 'Select time'}
                  </Text>
                </View>
                <Text style={styles.deadlineButtonArrow}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Full Deadline Display */}
            {getFullDeadline() && (
              <View style={styles.fullDeadlineContainer}>
                <Text style={styles.fullDeadlineLabel}>Complete Deadline:</Text>
                <Text style={styles.fullDeadlineValue}>{getFullDeadline()}</Text>
              </View>
            )}
          </View>

          {/* Matching Preference */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Matching Preference</Text>
            <Text style={styles.sectionSubtitle}>
              How would you like to find your expert?
            </Text>

            <View style={styles.matchingContainer}>
              <TouchableOpacity
                style={[
                  styles.matchingButton,
                  matchingPreference === 'auto' && styles.matchingButtonSelected,
                ]}
                onPress={() => setMatchingPreference('auto')}
              >
                <Text style={styles.matchingIcon}>⚡</Text>
                <Text style={styles.matchingTitle}>Auto-Match</Text>
                <Text style={styles.matchingDescription}>
                  We'll automatically find and assign the best expert for your task
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.matchingButton,
                  matchingPreference === 'manual' && styles.matchingButtonSelected,
                ]}
                onPress={() => setMatchingPreference('manual')}
              >
                <Text style={styles.matchingIcon}>👀</Text>
                <Text style={styles.matchingTitle}>Manual Review</Text>
                <Text style={styles.matchingDescription}>
                  You'll review and choose from expert proposals
                </Text>
              </TouchableOpacity>
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
              Next: Review & Payment →
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* iOS-Style Date Picker Overlay */}
      {showDatePicker && (
        <View style={styles.overlay}>
          <View style={styles.overlayContent}>
            <View style={styles.overlayHeader}>
              <TouchableOpacity
                style={styles.overlayCloseButton}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.overlayCloseText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.overlayTitle}>Select Date</Text>
              <TouchableOpacity
                style={styles.overlayDoneButton}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.overlayDoneText}>Done</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.calendarContainer}>
              {/* Calendar Header */}
              <View style={styles.calendarHeader}>
                <Text style={styles.calendarMonth}>
                  {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </Text>
              </View>

              {/* Calendar Grid */}
              <View style={styles.calendarGrid}>
                {/* Day headers */}
                <View style={styles.calendarDaysHeader}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <Text key={day} style={styles.calendarDayHeader}>{day}</Text>
                  ))}
                </View>

                {/* Calendar days */}
                <View style={styles.calendarDays}>
                  {generateCalendarDays(selectedDate).map((day, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.calendarDay,
                        day.isSelected && styles.calendarDaySelected,
                        day.isToday && styles.calendarDayToday,
                        !day.isCurrentMonth && styles.calendarDayOtherMonth,
                      ]}
                      onPress={() => day.isCurrentMonth && handleDateChange(day.date)}
                      disabled={!day.isCurrentMonth}
                    >
                      <Text style={[
                        styles.calendarDayText,
                        day.isSelected && styles.calendarDayTextSelected,
                        day.isToday && styles.calendarDayTextToday,
                        !day.isCurrentMonth && styles.calendarDayTextOtherMonth,
                      ]}>
                        {day.dayNumber}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Month Navigation */}
              <View style={styles.calendarNavigation}>
                <TouchableOpacity
                  style={styles.calendarNavButton}
                  onPress={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setMonth(newDate.getMonth() - 1);
                    setSelectedDate(newDate);
                  }}
                >
                  <Text style={styles.calendarNavButtonText}>‹</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.calendarNavButton}
                  onPress={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setMonth(newDate.getMonth() + 1);
                    setSelectedDate(newDate);
                  }}
                >
                  <Text style={styles.calendarNavButtonText}>›</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* iOS-Style Time Picker Overlay */}
      {showTimePicker && (
        <View style={styles.overlay}>
          <View style={styles.overlayContent}>
            <View style={styles.overlayHeader}>
              <TouchableOpacity
                style={styles.overlayCloseButton}
                onPress={() => setShowTimePicker(false)}
              >
                <Text style={styles.overlayCloseText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.overlayTitle}>Select Time</Text>
              <TouchableOpacity
                style={styles.overlayDoneButton}
                onPress={() => setShowTimePicker(false)}
              >
                <Text style={styles.overlayDoneText}>Done</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.clockContainer}>
              {/* Clock Display */}
              <View style={styles.clockDisplay}>
                <Text style={styles.clockTime}>
                  {formatTime(selectedTime)}
                </Text>
              </View>

              {/* iOS-Style Scrollable Time Picker */}
              <View style={styles.iosTimePickerContainer}>
                {/* Hours Column */}
                <View style={styles.iosTimePickerColumn}>
                  <ScrollView
                    style={styles.iosTimePickerScroll}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.iosTimePickerContent}
                    snapToInterval={40}
                    decelerationRate="fast"
                    onMomentumScrollEnd={handleHourScroll}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                      <View
                        key={hour}
                        style={[
                          styles.iosTimePickerItem,
                          selectedTime.getHours() % 12 === hour && styles.iosTimePickerItemSelected,
                        ]}
                      >
                        <Text style={[
                          styles.iosTimePickerItemText,
                          selectedTime.getHours() % 12 === hour && styles.iosTimePickerItemTextSelected,
                        ]}>
                          {hour}
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>

                {/* Separator */}
                <View style={styles.iosTimePickerSeparator}>
                  <Text style={styles.iosTimePickerSeparatorText}>:</Text>
                </View>

                {/* Minutes Column */}
                <View style={styles.iosTimePickerColumn}>
                  <ScrollView
                    style={styles.iosTimePickerScroll}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.iosTimePickerContent}
                    snapToInterval={40}
                    decelerationRate="fast"
                    onMomentumScrollEnd={handleMinuteScroll}
                  >
                    {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                      <View
                        key={minute}
                        style={[
                          styles.iosTimePickerItem,
                          selectedTime.getMinutes() === minute && styles.iosTimePickerItemSelected,
                        ]}
                      >
                        <Text style={[
                          styles.iosTimePickerItemText,
                          selectedTime.getMinutes() === minute && styles.iosTimePickerItemTextSelected,
                        ]}>
                          {minute.toString().padStart(2, '0')}
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>

                {/* AM/PM Column */}
                <View style={styles.iosTimePickerColumn}>
                  <ScrollView
                    style={styles.iosTimePickerScroll}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.iosTimePickerContent}
                    snapToInterval={40}
                    decelerationRate="fast"
                    onMomentumScrollEnd={handlePeriodScroll}
                  >
                    {['AM', 'PM'].map((period) => (
                      <View
                        key={period}
                        style={[
                          styles.iosTimePickerItem,
                          ((period === 'AM' && selectedTime.getHours() < 12) ||
                           (period === 'PM' && selectedTime.getHours() >= 12)) && styles.iosTimePickerItemSelected,
                        ]}
                      >
                        <Text style={[
                          styles.iosTimePickerItemText,
                          ((period === 'AM' && selectedTime.getHours() < 12) ||
                           (period === 'PM' && selectedTime.getHours() >= 12)) && styles.iosTimePickerItemTextSelected,
                        ]}>
                          {period}
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </View>

              {/* Selection Indicator */}
              <View style={styles.iosTimePickerSelectionIndicator} />
            </View>
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
  budgetInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  budgetDollarSign: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.text,
    marginRight: SPACING.xs,
  },
  budgetInput: {
    flex: 1,
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.text,
    paddingVertical: 0,
  },
  budgetSuggestionsContainer: {
    marginBottom: SPACING.md,
  },
  budgetSuggestionsTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  budgetSuggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  budgetSuggestionButton: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  budgetSuggestionAmount: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  budgetSuggestionLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
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
  deadlineContainer: {
    gap: SPACING.md,
  },
  deadlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  deadlineButtonIcon: {
    fontSize: 20,
    marginRight: SPACING.md,
  },
  deadlineButtonContent: {
    flex: 1,
  },
  deadlineButtonLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  deadlineButtonValue: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
    color: COLORS.text,
  },
  deadlineButtonArrow: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  fullDeadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: SPACING.md,
  },
  fullDeadlineLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginRight: SPACING.sm,
  },
  fullDeadlineValue: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
    color: COLORS.text,
  },
  matchingContainer: {
    gap: SPACING.md,
  },
  matchingButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  matchingButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  matchingIcon: {
    fontSize: 24,
    marginBottom: SPACING.sm,
  },
  matchingTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  matchingDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  overlayCloseButton: {
    padding: SPACING.sm,
  },
  overlayCloseText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  overlayTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.text,
  },
  overlayDoneButton: {
    padding: SPACING.sm,
  },
  overlayDoneText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.primary,
    fontWeight: FONTS.weights.medium,
  },
  overlayPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  overlayPlaceholderText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  overlayTestButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 12,
  },
  overlayTestButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
    color: COLORS.white,
  },
  // New styles for calendar and clock pickers
  calendarContainer: {
    padding: SPACING.md,
  },
  calendarHeader: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  calendarMonth: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.text,
  },
  calendarGrid: {
    marginBottom: SPACING.md,
  },
  calendarDaysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.sm,
  },
  calendarDayHeader: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  calendarDays: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  calendarDay: {
    width: '14%', // 7 columns
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SPACING.xs,
    borderRadius: 10,
  },
  calendarDayText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
  },
  calendarDaySelected: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },
  calendarDayTextSelected: {
    color: COLORS.white,
  },
  calendarDayToday: {
    backgroundColor: COLORS.primary + '10',
    borderRadius: 10,
  },
  calendarDayTextToday: {
    color: COLORS.primary,
  },
  calendarDayOtherMonth: {
    color: COLORS.textSecondary,
  },
  calendarDayTextOtherMonth: {
    color: COLORS.textSecondary,
  },
  calendarNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
  },
  calendarNavButton: {
    padding: SPACING.sm,
  },
  calendarNavButtonText: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.primary,
    fontWeight: FONTS.weights.medium,
  },
  clockContainer: {
    padding: SPACING.md,
  },
  clockDisplay: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  clockTime: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  timePickerColumn: {
    flex: 1,
    alignItems: 'center',
  },
  timePickerLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  timePickerScroll: {
    maxHeight: 150,
  },
  timePickerItem: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  timePickerItemSelected: {
    backgroundColor: COLORS.primary + '10',
    borderColor: COLORS.primary,
  },
  timePickerItemText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
  },
  timePickerItemTextSelected: {
    color: COLORS.primary,
  },
  ampmContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  ampmButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ampmButtonSelected: {
    backgroundColor: COLORS.primary + '10',
    borderColor: COLORS.primary,
  },
  ampmButtonText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
  },
  ampmButtonTextSelected: {
    color: COLORS.primary,
  },
  // New styles for iOS-style time picker
  iosTimePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: SPACING.md,
    height: 200,
    position: 'relative',
  },
  iosTimePickerColumn: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
  },
  iosTimePickerScroll: {
    height: '100%',
    width: '100%',
  },
  iosTimePickerContent: {
    alignItems: 'center',
    paddingVertical: 80, // Add padding to center the selection
  },
  iosTimePickerItem: {
    height: 40,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },
  iosTimePickerItemSelected: {
    backgroundColor: 'transparent',
  },
  iosTimePickerItemText: {
    fontSize: FONTS.sizes.xl,
    color: COLORS.textSecondary,
    fontWeight: FONTS.weights.medium,
  },
  iosTimePickerItemTextSelected: {
    color: COLORS.text,
    fontWeight: FONTS.weights.bold,
    fontSize: FONTS.sizes.xxl,
  },
  iosTimePickerSeparator: {
    paddingHorizontal: SPACING.md,
    height: 40,
    justifyContent: 'center',
  },
  iosTimePickerSeparatorText: {
    fontSize: FONTS.sizes.xxl,
    color: COLORS.text,
    fontWeight: FONTS.weights.bold,
  },
  iosTimePickerSelectionIndicator: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: COLORS.primary + '10',
    borderRadius: 8,
    marginTop: -20,
    zIndex: -1,
  },
});

export default StepFour;
