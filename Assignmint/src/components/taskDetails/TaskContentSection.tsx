import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { COLORS } from '../../constants';
import Icon, { Icons } from '../common/Icon';

interface TaskContentSectionProps {
  task: {
    description: string;
    specialInstructions?: string;
    aiLevel: string;
    aiPercentage?: number;
  };
}

const TaskContentSection: React.FC<TaskContentSectionProps> = ({ task }) => {
  const getAILevelIcon = (aiLevel: string) => {
    switch (aiLevel) {
      case 'none': return Icons.user;
      case 'assisted': return Icons.ai;
      case 'enhanced': return Icons.brain;
      case 'ai_heavy': return Icons.chip;
      default: return Icons.user;
    }
  };

  const getAILevelText = (aiLevel: string) => {
    switch (aiLevel) {
      case 'none': return 'No AI';
      case 'assisted': return 'AI Assisted';
      case 'enhanced': return 'AI Enhanced';
      case 'ai_heavy': return 'AI Heavy';
      default: return 'No AI';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Task Description</Text>
      
      <View style={styles.contentCard}>
        <Text style={styles.description}>
          {task.description}
        </Text>
      </View>

      {/* Special Instructions */}
      {task.specialInstructions && task.specialInstructions.trim() && (
        <View style={styles.specialInstructionsContainer}>
          <Text style={styles.specialInstructionsTitle}>Special Instructions</Text>
          <View style={styles.specialInstructionsCard}>
            <Text style={styles.specialInstructionsText}>
              {task.specialInstructions}
            </Text>
          </View>
        </View>
      )}

      {/* AI Settings */}
      <View style={styles.aiSettingsContainer}>
        <Text style={styles.aiSettingsTitle}>AI Settings</Text>
        <View style={styles.aiSettingsCard}>
          <View style={styles.aiLevelRow}>
            <Icon name={getAILevelIcon(task.aiLevel)} size={24} color={COLORS.text} />
            <View style={styles.aiLevelInfo}>
              <Text style={styles.aiLevelText}>
                {getAILevelText(task.aiLevel)}
              </Text>
              <Text style={styles.aiLevelDescription}>
                {task.aiLevel === 'none' 
                  ? 'Traditional human work with no AI assistance'
                  : task.aiLevel === 'assisted'
                  ? 'AI helps with research and drafting'
                  : task.aiLevel === 'enhanced'
                  ? 'AI generates content with human review'
                  : 'Primarily AI with human oversight'
                }
              </Text>
            </View>
          </View>
          
          {task.aiLevel !== 'none' && task.aiPercentage && (
            <View style={styles.aiPercentageRow}>
              <Text style={styles.aiPercentageLabel}>AI Involvement:</Text>
              <Text style={styles.aiPercentageValue}>{task.aiPercentage}%</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  contentCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
  specialInstructionsContainer: {
    marginBottom: 16,
  },
  specialInstructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  specialInstructionsCard: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  specialInstructionsText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  aiSettingsContainer: {
    marginBottom: 16,
  },
  aiSettingsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  aiSettingsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  aiLevelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiLevelIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  aiLevelInfo: {
    flex: 1,
  },
  aiLevelText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  aiLevelDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  aiPercentageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  aiPercentageLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  aiPercentageValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
});

export default TaskContentSection; 