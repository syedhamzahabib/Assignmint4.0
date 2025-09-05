// src/components/matching/ConfirmClaimButton.tsx - Button for experts to confirm their soft-claimed tasks
import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import reservationService from '../../services/matching/reservationService';
import { Task } from '../../types';

interface ConfirmClaimButtonProps {
  task: Task;
  expertId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onExpired?: () => void;
}

export const ConfirmClaimButton: React.FC<ConfirmClaimButtonProps> = ({
  task,
  expertId,
  onSuccess,
  onError,
  onExpired,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    // Check reservation status and start countdown
    const checkReservation = async () => {
      try {
        const reservation = await reservationService.getTaskReservation(task.id);
        if (reservation && reservation.reservedBy === expertId) {
          setTimeRemaining(reservation.timeRemaining);
          setIsExpired(false);
        } else {
          setIsExpired(true);
          onExpired?.();
        }
      } catch (error) {
        console.error('Error checking reservation:', error);
        setIsExpired(true);
      }
    };

    checkReservation();

    // Update countdown every second
    const interval = setInterval(async () => {
      try {
        const reservation = await reservationService.getTaskReservation(task.id);
        if (reservation && reservation.reservedBy === expertId) {
          const remaining = reservation.timeRemaining;
          setTimeRemaining(remaining);
          
          if (remaining <= 0) {
            setIsExpired(true);
            onExpired?.();
            clearInterval(interval);
          }
        } else {
          setIsExpired(true);
          onExpired?.();
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Error updating countdown:', error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [task.id, expertId, onExpired]);

  const formatTimeRemaining = (ms: number): string => {
    const minutes = Math.floor(ms / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleConfirmClaim = async () => {
    if (isLoading || isExpired) return;

    Alert.alert(
      'Confirm Task Claim',
      `Are you sure you want to claim "${task.title}"? This will permanently assign the task to you.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm Claim',
          style: 'default',
          onPress: async () => {
            setIsLoading(true);
            try {
              await reservationService.confirmClaim(task.id, expertId);
              
              Alert.alert(
                'Task Claimed!',
                `"${task.title}" is now permanently assigned to you.`,
                [{ text: 'OK', onPress: onSuccess }]
              );
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Failed to confirm claim';
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

  const isButtonDisabled = isLoading || isExpired;
  const isReservedByMe = task.status === 'reserved' && task.reservedBy === expertId;

  if (!isReservedByMe) {
    return null; // Don't show button if not reserved by this expert
  }

  if (isExpired) {
    return (
      <TouchableOpacity style={[styles.button, styles.buttonExpired]} disabled>
        <Text style={styles.buttonText}>Reservation Expired</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles.buttonConfirm,
        isButtonDisabled && styles.buttonDisabled,
      ]}
      onPress={handleConfirmClaim}
      disabled={isButtonDisabled}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text style={styles.buttonText}>
          Confirm Claim ({formatTimeRemaining(timeRemaining)})
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
  buttonConfirm: {
    backgroundColor: '#28a745',
  },
  buttonExpired: {
    backgroundColor: '#dc3545',
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

export default ConfirmClaimButton;
