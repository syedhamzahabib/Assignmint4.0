// components/profile/expert/SubjectStats.tsx

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../../../constants';

interface SubjectStat {
  name: string;
  taskCount: number;
  avgRating: number;
  totalEarned: number;
  lastTask: string;
  lastTaskDate: string;
}

interface SubjectStatsProps {
  subjects: SubjectStat[];
  onSubjectPress: (subject: string) => void;
}

const SubjectStats: React.FC<SubjectStatsProps> = ({ subjects, onSubjectPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subject Performance</Text>
      
      {subjects.map((subject, index) => (
        <TouchableOpacity
          key={subject.name}
          style={styles.subjectItem}
          onPress={() => onSubjectPress(subject.name)}
        >
          <View style={styles.subjectHeader}>
            <Text style={styles.subjectName}>{subject.name}</Text>
            <Text style={styles.taskCount}>{subject.taskCount} tasks</Text>
          </View>
          
          <View style={styles.subjectStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Rating</Text>
              <Text style={styles.statValue}>⭐ {subject.avgRating.toFixed(1)}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Earned</Text>
              <Text style={styles.statValue}>${subject.totalEarned.toFixed(2)}</Text>
            </View>
          </View>
          
          <View style={styles.lastTask}>
            <Text style={styles.lastTaskLabel}>Last task:</Text>
            <Text style={styles.lastTaskText}>{subject.lastTask}</Text>
            <Text style={styles.lastTaskDate}>{subject.lastTaskDate}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  subjectItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  taskCount: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  subjectStats: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  statItem: {
    marginRight: 24,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  lastTask: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  lastTaskLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginRight: 4,
  },
  lastTaskText: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '500',
    marginRight: 8,
  },
  lastTaskDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});

export default SubjectStats; 