import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  PanResponder,
  Dimensions,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

// Custom Slider Component
const CustomSlider = ({ value, onValueChange, minimumValue = 0, maximumValue = 100 }) => {
  const [sliderWidth, setSliderWidth] = useState(0);
  
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    
    onPanResponderGrant: (event) => {
      updateSliderValue(event.nativeEvent.locationX);
    },
    
    onPanResponderMove: (event) => {
      updateSliderValue(event.nativeEvent.locationX);
    },
  });
  
  const updateSliderValue = (locationX) => {
    if (sliderWidth === 0) return;
    
    const percentage = Math.max(0, Math.min(1, locationX / sliderWidth));
    const newValue = Math.round(minimumValue + percentage * (maximumValue - minimumValue));
    onValueChange(newValue);
  };
  
  const thumbPosition = ((value - minimumValue) / (maximumValue - minimumValue)) * sliderWidth;
  
  return (
    <View style={styles.sliderContainer}>
      <View
        style={styles.sliderTrack}
        onLayout={(event) => setSliderWidth(event.nativeEvent.layout.width)}
        {...panResponder.panHandlers}
      >
        <View style={[styles.sliderFill, { width: thumbPosition }]} />
        <View style={[styles.sliderThumb, { left: thumbPosition - 12 }]} />
      </View>
      
      {/* Value labels */}
      <View style={styles.sliderLabels}>
        <Text style={styles.sliderLabel}>0%</Text>
        <Text style={styles.sliderValueText}>{value}%</Text>
        <Text style={styles.sliderLabel}>100%</Text>
      </View>
    </View>
  );
};

const StepThree = ({ formData, updateFormData, onNext, onBack, currentStep }) => {
  const aiOptions = [
    {
      id: 'none',
      title: 'No AI',
      subtitle: 'Human tutor only',
      icon: '👨‍🏫',
      description: 'Get help from experienced human experts only',
      benefits: ['Personal attention', 'Complex problem-solving', 'Learning & mentoring', 'Original creativity']
    },
    {
      id: 'partial',
      title: 'Partial AI',
      subtitle: 'AI assistance with human oversight', 
      icon: '🤖',
      description: 'Combine AI efficiency with human expertise',
      benefits: ['Best of both worlds', 'Quality control', 'Cost-effective', 'Faster than human-only']
    },
    {
      id: 'full',
      title: 'Full AI (100%)',
      subtitle: 'Complete AI solution',
      icon: '🚀',
      description: 'Fast, automated solutions powered by AI',
      benefits: ['Fastest delivery', 'Available 24/7', 'Most affordable', 'Consistent quality']
    },
  ];

  const selectAILevel = (level) => {
    updateFormData('aiLevel', level);
    // Set default percentage when switching to partial AI
    if (level === 'partial' && !formData.aiPercentage) {
      updateFormData('aiPercentage', 50);
    }
  };

  const handleSliderChange = (value) => {
    updateFormData('aiPercentage', value);
  };

  const getAIDescription = (percentage) => {
    if (percentage <= 25) {
      return {
        title: 'AI-Assisted Human Work',
        description: 'AI provides research and initial analysis, human expert does the main work',
        breakdown: ['AI: Research & data gathering', 'Human: Analysis & problem solving', 'Human: Final review & quality check']
      };
    } else if (percentage <= 50) {
      return {
        title: 'Balanced Collaboration', 
        description: 'Equal partnership between AI efficiency and human expertise',
        breakdown: ['AI: Initial draft & calculations', 'Human: Review & refinement', 'Both: Quality assurance']
      };
    } else if (percentage <= 75) {
      return {
        title: 'AI-Driven with Human Polish',
        description: 'AI handles most work, human provides final touches and verification',
        breakdown: ['AI: Main problem solving', 'AI: Initial solution', 'Human: Final review & polish']
      };
    } else {
      return {
        title: 'Mostly Automated',
        description: 'AI does nearly everything with minimal human oversight',
        breakdown: ['AI: Complete solution', 'AI: Quality checks', 'Human: Final approval only']
      };
    }
  };

  const renderPartialAISection = () => {
    if (formData.aiLevel !== 'partial') return null;
    
    const aiDesc = getAIDescription(formData.aiPercentage || 50);
    
    return (
      <View style={styles.partialAISection}>
        <View style={styles.percentageContainer}>
          <Text style={styles.percentageLabel}>🎯 AI Assistance Level</Text>
          <Text style={styles.currentPercentage}>{formData.aiPercentage || 50}%</Text>
          
          <CustomSlider 
            value={formData.aiPercentage || 50}
            onValueChange={handleSliderChange}
            minimumValue={10}
            maximumValue={90}
          />
          
          <View style={styles.aiDescriptionCard}>
            <Text style={styles.aiDescTitle}>{aiDesc.title}</Text>
            <Text style={styles.aiDescText}>{aiDesc.description}</Text>
            
            <View style={styles.breakdownSection}>
              <Text style={styles.breakdownTitle}>How it works:</Text>
              {aiDesc.breakdown.map((item, index) => (
                <View key={index} style={styles.breakdownItem}>
                  <Text style={styles.breakdownBullet}>•</Text>
                  <Text style={styles.breakdownText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header - Fixed with better spacing */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Post Task (3/5)</Text>
        
        <View style={styles.headerRight} />
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.section}>
          <Text style={styles.label}>🤖 Choose AI Level</Text>
          <Text style={styles.subtitle}>
            Select how much AI assistance you want for your task
          </Text>

          {/* AI Options */}
          {aiOptions.map((option, index) => (
            <React.Fragment key={option.id}>
              <TouchableOpacity
                style={[
                  styles.optionCard,
                  formData.aiLevel === option.id && styles.selectedOption,
                ]}
                onPress={() => selectAILevel(option.id)}
                activeOpacity={0.7}
              >
                <View style={styles.optionContent}>
                  <View style={styles.radioContainer}>
                    <View style={[
                      styles.radioOuter,
                      formData.aiLevel === option.id && styles.radioSelected,
                    ]}>
                      {formData.aiLevel === option.id && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                  </View>

                  <Text style={styles.optionIcon}>{option.icon}</Text>

                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>{option.title}</Text>
                    <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                    <Text style={styles.optionDescription}>{option.description}</Text>
                    
                    {/* Benefits */}
                    <View style={styles.benefitsList}>
                      {option.benefits.map((benefit, i) => (
                        <Text key={i} style={styles.benefitItem}>• {benefit}</Text>
                      ))}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              
              {/* Insert Partial AI Section after Partial AI option */}
              {option.id === 'partial' && renderPartialAISection()}
            </React.Fragment>
          ))}

          {/* Recommendation */}
          <View style={styles.recommendationSection}>
            <Text style={styles.recommendationTitle}>💡 Our Recommendation</Text>
            <View style={styles.recommendationCard}>
              <Text style={styles.recommendationText}>
                {formData.subject === 'Math' || formData.subject === 'Science' ? 
                  '🎯 For Math & Science: Try Partial AI (30-50%) - AI can handle calculations while humans explain concepts' :
                  formData.subject === 'Writing' ? 
                  '✍️ For Writing: Human Only or Partial AI (20-30%) - Creativity and voice need human touch' :
                  formData.subject === 'Coding' ?
                  '💻 For Coding: Partial AI (50-70%) works great - AI codes, humans review and optimize' :
                  '🎯 For most tasks: Partial AI (40-60%) gives you the best balance of speed and quality'
                }
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Fixed Next Button */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={onNext}
        >
          <Text style={styles.nextButtonText}>
            Next → ({formData.aiLevel === 'none' ? 'Human Only' : 
                     formData.aiLevel === 'partial' ? `${formData.aiPercentage || 50}% AI` : 
                     'Full AI'})
          </Text>
        </TouchableOpacity>
      </View>
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
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    flex: 1,
  },
  backButtonText: {
    fontSize: 16, 
    color: '#2e7d32', 
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
    textAlign: 'center',
    flex: 2,
  },
  headerRight: { 
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  section: {
    flex: 1,
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
    marginBottom: 20,
    lineHeight: 18,
  },
  optionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  selectedOption: {
    borderColor: '#2e7d32',
    backgroundColor: '#f8fff8',
    shadowColor: '#2e7d32',
    shadowOpacity: 0.1,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  radioContainer: { 
    marginRight: 12,
    marginTop: 2,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: { 
    borderColor: '#2e7d32' 
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2e7d32',
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },
  optionTextContainer: { 
    flex: 1 
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  optionDescription: {
    fontSize: 13,
    color: '#888',
    lineHeight: 18,
    marginBottom: 8,
  },
  benefitsList: {
    gap: 2,
  },
  benefitItem: {
    fontSize: 12,
    color: '#2e7d32',
    lineHeight: 16,
  },
  partialAISection: {
    marginBottom: 16,
  },
  percentageContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#2e7d32',
    shadowColor: '#2e7d32',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  percentageLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 8,
    textAlign: 'center',
  },
  currentPercentage: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2e7d32',
    textAlign: 'center',
    marginBottom: 20,
  },
  
  // Custom Slider Styles
  sliderContainer: {
    marginBottom: 20,
  },
  sliderTrack: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    position: 'relative',
  },
  sliderFill: {
    height: 8,
    backgroundColor: '#2e7d32',
    borderRadius: 4,
  },
  sliderThumb: {
    position: 'absolute',
    top: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2e7d32',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  sliderValueText: {
    fontSize: 16,
    color: '#2e7d32',
    fontWeight: '700',
  },
  
  aiDescriptionCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2e7d32',
  },
  aiDescTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  aiDescText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  breakdownSection: {
    marginTop: 8,
  },
  breakdownTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 6,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  breakdownBullet: {
    fontSize: 14,
    color: '#2e7d32',
    marginRight: 6,
    fontWeight: 'bold',
    marginTop: 1,
  },
  breakdownText: {
    fontSize: 12,
    color: '#555',
    flex: 1,
    lineHeight: 16,
  },
  recommendationSection: {
    marginTop: 24,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  recommendationCard: {
    backgroundColor: '#fff3e0',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },
  recommendationText: {
    fontSize: 14,
    color: '#e65100',
    lineHeight: 20,
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
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default StepThree;