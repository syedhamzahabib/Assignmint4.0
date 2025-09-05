// src/components/matching/TaskMatchingBanner.tsx - Banner showing matching status for task owners
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Task } from '../../types';
import { config } from '../../config/environment';

interface TaskMatchingBannerProps {
  task: Task;
  onRefresh?: () => void;
}

export const TaskMatchingBanner: React.FC<TaskMatchingBannerProps> = ({
  task,
  onRefresh,
}) => {
  const [timeUntilNextWave, setTimeUntilNextWave] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!task.matching?.nextWaveAt) return;

    const updateCountdown = () => {
      const now = new Date();
      const nextWave = task.matching!.nextWaveAt;
      const timeRemaining = Math.max(0, nextWave.getTime() - now.getTime());
      setTimeUntilNextWave(timeRemaining);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [task.matching?.nextWaveAt]);

  const formatTimeRemaining = (ms: number): string => {
    const minutes = Math.floor(ms / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStatusText = (): string => {
    if (task.status === 'claimed') {
      return 'Task claimed by expert';
    }
    
    if (task.status === 'reserved') {
      return 'Task reserved by expert';
    }

    if (task.matching?.invitedNow) {
      if (task.matching.invitedNow >= 50) {
        return 'All eligible experts notified';
      }
      if (task.matching.invitedNow >= 25) {
        return `Expanded to ${task.matching.invitedNow} experts`;
      }
      return `Notified ${task.matching.invitedNow} experts`;
    }

    return 'No experts notified yet';
  };

  const getNextWaveText = (): string => {
    if (!task.matching?.nextWaveAt || task.status === 'claimed') {
      return '';
    }

    if (task.matching.invitedNow >= 50) {
      return 'All experts have been notified';
    }

    if (timeUntilNextWave > 0) {
      return `Next wave in ${formatTimeRemaining(timeUntilNextWave)}`;
    }

    return 'Expanding to more experts...';
  };

  const handleManualRefresh = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      // Import dynamically to avoid circular dependencies
      const { default: taskCreationTrigger } = await import('../../services/matching/onTaskCreate');
      await taskCreationTrigger.manuallyTriggerMatching(task.id);
      onRefresh?.();
    } catch (error) {
      console.error('Error manually triggering matching:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show banner for completed tasks
  if (task.status === 'completed' || task.status === 'submitted') {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.statusText}>{getStatusText()}</Text>
        {getNextWaveText() && (
          <Text style={styles.nextWaveText}>{getNextWaveText()}</Text>
        )}
      </View>
      
      {config.USE_MOCK_DATA && task.status === 'open' && (
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleManualRefresh}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#007bff" size="small" />
          ) : (
            <Text style={styles.refreshButtonText}>Refresh</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e3f2fd',
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 4,
  },
  nextWaveText: {
    fontSize: 14,
    color: '#42a5f5',
  },
  refreshButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 12,
  },
  refreshButtonText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default TaskMatchingBanner;
