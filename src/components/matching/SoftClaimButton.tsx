// src/components/matching/SoftClaimButton.tsx - Button for experts to soft-claim tasks
import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import reservationService from '../../services/matching/reservationService';
import { Task } from '../../types';

interface SoftClaimButtonProps {
  task: Task;
  expertId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  disabled?: boolean;
}

export const SoftClaimButton: React.FC<SoftClaimButtonProps> = ({
  task,
  expertId,
  onSuccess,
  onError,
  disabled = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSoftClaim = async () => {
    if (disabled || isLoading) return;

    Alert.alert(
      'Soft Claim Task',
      `This will reserve "${task.title}" for you for 15 minutes. You'll need to confirm within that time to claim it permanently.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Soft Claim',
          style: 'default',
          onPress: async () => {
            setIsLoading(true);
            try {
              await reservationService.softClaim(task.id, expertId);
              
              Alert.alert(
                'Task Reserved!',
                `"${task.title}" is now reserved for you. You have 15 minutes to confirm your claim.`,
                [{ text: 'OK', onPress: onSuccess }]
              );
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Failed to soft-claim task';
              Alert.alert('Error', errorMessage);
              onError?.(errorMessage);
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const isTaskAvailable = task.status === 'open';
  const isButtonDisabled = disabled || isLoading || !isTaskAvailable;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isButtonDisabled && styles.buttonDisabled,
        isTaskAvailable && styles.buttonAvailable,
      ]}
      onPress={handleSoftClaim}
      disabled={isButtonDisabled}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text style={styles.buttonText}>
          {isTaskAvailable ? 'Soft Claim (15:00)' : 'Not Available'}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonAvailable: {
    backgroundColor: '#007bff',
  },
  buttonDisabled: {
    backgroundColor: '#e9ecef',
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default SoftClaimButton;
