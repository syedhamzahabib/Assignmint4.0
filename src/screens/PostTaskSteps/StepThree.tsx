import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  Dimensions,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { COLORS, FONTS, SPACING } from '../../constants';

interface StepThreeProps {
  navigation: any;
  route: any;
}

const { width } = Dimensions.get('window');
const SLIDER_WIDTH = width - 80; // Account for padding
const THUMB_SIZE = 24;

const StepThree: React.FC<StepThreeProps> = ({ navigation, route }) => {
  const { taskTitle, selectedSubject, selectedUrgency, isForStudent } = route.params;

  const [aiRangeMin, setAiRangeMin] = useState(30);
  const [aiRangeMax, setAiRangeMax] = useState(70);
  const [aiTaskExplainer, setAiTaskExplainer] = useState(true);
  const [summaryOnDelivery, setSummaryOnDelivery] = useState(true);
  const [draggingMin, setDraggingMin] = useState(false);
  const [draggingMax, setDraggingMax] = useState(false);

  const minThumbRef = useRef(null);
  const maxThumbRef = useRef(null);

  const getAiLevelDescription = () => {
    const average = Math.round((aiRangeMin + aiRangeMax) / 2);
    if (average >= 80) return "High AI Assistance - AI will provide detailed guidance and suggestions";
    if (average >= 60) return "Moderate AI Assistance - AI will offer helpful insights and structure";
    if (average >= 40) return "Balanced AI Assistance - AI will provide basic guidance and suggestions";
    if (average >= 20) return "Light AI Assistance - AI will offer minimal suggestions only";
    return "Minimal AI Assistance - AI will offer basic suggestions only";
  };

  const getAiSuggestion = () => {
    if (selectedSubject?.toLowerCase().includes('essay') || selectedSubject?.toLowerCase().includes('writing')) {
      return "💡 For essays, try 40-70% AI assistance for structure and ideas while maintaining your voice.";
    } else if (selectedSubject?.toLowerCase().includes('math') || selectedSubject?.toLowerCase().includes('calculus')) {
      return "💡 For math problems, 20-50% AI assistance works well for step-by-step guidance.";
    } else if (selectedSubject?.toLowerCase().includes('programming') || selectedSubject?.toLowerCase().includes('code')) {
      return "💡 For programming, 30-60% AI assistance helps with logic and debugging.";
    } else if (selectedSubject?.toLowerCase().includes('science') || selectedSubject?.toLowerCase().includes('lab')) {
      return "💡 For science assignments, 25-55% AI assistance provides good research guidance.";
    }
    return "💡 Adjust the range to control how much AI assistance you want. Higher values mean more AI involvement.";
  };

  const onMinThumbGestureEvent = (event: any) => {
    const { translationX } = event.nativeEvent;
    const newPosition = Math.max(0, Math.min(aiRangeMax - 10, (aiRangeMin / 100) * SLIDER_WIDTH + translationX));
    const newValue = Math.round((newPosition / SLIDER_WIDTH) * 100);
    setAiRangeMin(newValue);
  };

  const onMaxThumbGestureEvent = (event: any) => {
    const { translationX } = event.nativeEvent;
    const newPosition = Math.max(aiRangeMin + 10, Math.min(SLIDER_WIDTH, (aiRangeMax / 100) * SLIDER_WIDTH + translationX));
    const newValue = Math.round((newPosition / SLIDER_WIDTH) * 100);
    setAiRangeMax(newValue);
  };

  const onMinThumbStateChange = (event: any) => {
    if (event.nativeEvent.state === State.BEGAN) {
      setDraggingMin(true);
    } else if (event.nativeEvent.state === State.END) {
      setDraggingMin(false);
    }
  };

  const onMaxThumbStateChange = (event: any) => {
    if (event.nativeEvent.state === State.BEGAN) {
      setDraggingMax(true);
    } else if (event.nativeEvent.state === State.END) {
      setDraggingMax(false);
    }
  };

  const handleNext = () => {
    navigation.navigate('StepFour', {
      taskTitle,
      selectedSubject,
      selectedUrgency,
      isForStudent,
      aiRangeMin,
      aiRangeMax,
      aiTaskExplainer,
      summaryOnDelivery,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AI Assistance</Text>
          <View style={styles.stepIndicator}>
            <Text style={styles.stepText}>Step 3 of 5</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '60%' }]} />
          </View>
        </View>

        {/* AI Level Overview */}
        <View style={styles.aiLevelCard}>
          <Text style={styles.aiLevelTitle}>Current Range</Text>
          <Text style={styles.aiLevelDescription}>{getAiLevelDescription()}</Text>
          <View style={styles.aiLevelBar}>
            <View style={[styles.aiLevelFill, { left: `${aiRangeMin}%`, width: `${aiRangeMax - aiRangeMin}%` }]} />
          </View>
          <Text style={styles.aiLevelPercentage}>{aiRangeMin}% - {aiRangeMax}% AI Assistance</Text>
        </View>

        {/* Draggable Range Slider */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🎛️</Text>
            <Text style={styles.sectionTitle}>AI Assistance Range</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Drag the dots to set your preferred AI involvement range
          </Text>

          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>Preferred AI involvement: {aiRangeMin}% to {aiRangeMax}%</Text>
            
            <View style={styles.sliderTrack}>
              <View style={[styles.sliderFill, {
                left: `${aiRangeMin}%`,
                width: `${aiRangeMax - aiRangeMin}%`
              }]} />
              
              {/* Min Thumb */}
              <PanGestureHandler
                ref={minThumbRef}
                onGestureEvent={onMinThumbGestureEvent}
                onHandlerStateChange={onMinThumbStateChange}
              >
                <View style={[
                  styles.sliderThumb,
                  { left: `${aiRangeMin}%` },
                  draggingMin && styles.sliderThumbActive
                ]}>
                  <Text style={styles.thumbLabel}>{aiRangeMin}%</Text>
                </View>
              </PanGestureHandler>
              
              {/* Max Thumb */}
              <PanGestureHandler
                ref={maxThumbRef}
                onGestureEvent={onMaxThumbGestureEvent}
                onHandlerStateChange={onMaxThumbStateChange}
              >
                <View style={[
                  styles.sliderThumb,
                  { left: `${aiRangeMax}%` },
                  draggingMax && styles.sliderThumbActive
                ]}>
                  <Text style={styles.thumbLabel}>{aiRangeMax}%</Text>
                </View>
              </PanGestureHandler>
            </View>
            
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderMinLabel}>0%</Text>
              <Text style={styles.sliderMaxLabel}>100%</Text>
            </View>
          </View>
        </View>

        {/* AI Features */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🤖</Text>
            <Text style={styles.sectionTitle}>AI Features</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Enable additional AI assistance features</Text>
          
          <View style={styles.featureContainer}>
            <View style={styles.featureRow}>
              <View style={styles.featureInfo}>
                <Text style={styles.featureTitle}>AI Task Explainer</Text>
                <Text style={styles.featureDescription}>
                  AI will explain the task requirements and provide guidance
                </Text>
              </View>
              <Switch
                value={aiTaskExplainer}
                onValueChange={setAiTaskExplainer}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor={COLORS.white}
              />
            </View>
            
            <View style={styles.featureRow}>
              <View style={styles.featureInfo}>
                <Text style={styles.featureTitle}>Summary on Delivery</Text>
                <Text style={styles.featureDescription}>
                  AI will provide a summary of the completed work
                </Text>
              </View>
              <Switch
                value={summaryOnDelivery}
                onValueChange={setSummaryOnDelivery}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor={COLORS.white}
              />
            </View>
          </View>
        </View>

        {/* AI Suggestion */}
        <View style={styles.suggestionContainer}>
          <Text style={styles.suggestionText}>{getAiSuggestion()}</Text>
        </View>

        {/* Info Notice */}
        <View style={styles.infoNotice}>
          <Text style={styles.infoNoticeText}>
            Note: While most tasks are picked up quickly, there's no guarantee an expert will accept your request. We recommend planning ahead for urgent or high-value tasks.
          </Text>
        </View>

        {/* Spacer for bottom button */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Next Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            Next: Budget & Deadline →
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  aiLevelCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  aiLevelTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  aiLevelDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 18,
  },
  aiLevelBar: {
    height: 8,
    backgroundColor: COLORS.gray200,
    borderRadius: 4,
    marginBottom: SPACING.xs,
    position: 'relative',
  },
  aiLevelFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
    position: 'absolute',
  },
  aiLevelPercentage: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    color: COLORS.primary,
    textAlign: 'center',
  },
  sliderContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sliderLabel: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: COLORS.gray200,
    borderRadius: 3,
    marginBottom: SPACING.sm,
    position: 'relative',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
    position: 'absolute',
  },
  sliderThumb: {
    position: 'absolute',
    top: -5,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    backgroundColor: COLORS.primary,
    borderRadius: THUMB_SIZE / 2,
    borderWidth: 2,
    borderColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderThumbActive: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  thumbLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.white,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  sliderMinLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  sliderMaxLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  quickAdjustContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  quickAdjustButton: {
    backgroundColor: COLORS.gray100,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  quickAdjustText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    color: COLORS.text,
  },
  presetContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
  },
  presetTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  presetButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  presetButton: {
    flex: 1,
    backgroundColor: COLORS.gray100,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    alignItems: 'center',
  },
  presetButtonText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    color: COLORS.text,
  },
  toggleContainer: {
    gap: SPACING.md,
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  toggleInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  toggleLabel: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  toggleDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  suggestionContainer: {
    backgroundColor: COLORS.primary + '10',
    borderRadius: 12,
    padding: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  suggestionText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    lineHeight: 20,
  },
  infoContainer: {
    backgroundColor: COLORS.gray100,
    borderRadius: 12,
    padding: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.gray400,
  },
  infoTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  infoText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
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
  nextButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.white,
  },
  featureContainer: {
    gap: SPACING.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  featureInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  featureTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  featureDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  infoNotice: {
    backgroundColor: COLORS.gray100,
    borderRadius: 12,
    padding: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.gray400,
    marginTop: SPACING.md,
  },
  infoNoticeText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});

export default StepThree; 