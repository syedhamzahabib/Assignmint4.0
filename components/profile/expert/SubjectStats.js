// components/profile/expert/SubjectStats.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const SubjectStats = ({ subjectData, fadeAnim, onSubjectPress }) => {
  // Get color for each subject
  const getSubjectColor = (subject) => {
    const colors = {
      'Math': '#3f51b5',
      'Coding': '#00796b', 
      'Writing': '#d84315',
      'Physics': '#1976d2',
      'Chemistry': '#f57f17',
      'Language': '#00838f',
      'Design': '#6a1b9a',
      'Business': '#388e3c',
      'Psychology': '#7b1fa2',
      'Statistics': '#c62828',
      'Biology': '#689f38',
      'History': '#5d4037',
      'Engineering': '#455a64',
      'Art': '#e91e63'
    };
    return colors[subject] || '#9e9e9e';
  };

  // Get subject icon
  const getSubjectIcon = (subject) => {
    const icons = {
      'Math': '📊',
      'Coding': '💻',
      'Writing': '✍️', 
      'Physics': '⚛️',
      'Chemistry': '🧪',
      'Language': '🌍',
      'Design': '🎨',
      'Business': '💼',
      'Psychology': '🧠',
      'Statistics': '📈',
      'Biology': '🧬',
      'History': '🏛️',
      'Engineering': '⚙️',
      'Art': '🎭'
    };
    return icons[subject] || '📚';
  };

  // Calculate skill level based on task count
  const getSkillLevel = (taskCount) => {
    if (taskCount >= 50) return { level: 'Master', color: '#f44336', progress: 100 };
    if (taskCount >= 25) return { level: 'Expert', color: '#ff9800', progress: 80 };
    if (taskCount >= 10) return { level: 'Advanced', color: '#2196f3', progress: 60 };
    if (taskCount >= 5) return { level: 'Intermediate', color: '#4caf50', progress: 40 };
    return { level: 'Beginner', color: '#9e9e9e', progress: 20 };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>🎯 Subject Expertise</Text>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.subjectsGrid}>
        {subjectData.slice(0, 4).map((subject, index) => {
          const color = getSubjectColor(subject.name);
          const icon = getSubjectIcon(subject.name);
          const skill = getSkillLevel(subject.taskCount);
          
          return (
            <TouchableOpacity
              key={subject.name}
              style={[styles.subjectCard, { borderLeftColor: color }]}
              onPress={() => onSubjectPress && onSubjectPress(subject)}
              activeOpacity={0.7}
            >
              {/* Header */}
              <View style={styles.subjectHeader}>
                <View style={styles.subjectTitleContainer}>
                  <Text style={styles.subjectIcon}>{icon}</Text>
                  <Text style={styles.subjectName}>{subject.name}</Text>
                </View>
                <View style={[styles.skillBadge, { backgroundColor: skill.color + '20' }]}>
                  <Text style={[styles.skillText, { color: skill.color }]}>
                    {skill.level}
                  </Text>
                </View>
              </View>

              {/* Stats Row */}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color }]}>{subject.taskCount}</Text>
                  <Text style={styles.statLabel}>Tasks</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color }]}>★{subject.avgRating}</Text>
                  <Text style={styles.statLabel}>Rating</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color }]}>${subject.totalEarned}</Text>
                  <Text style={styles.statLabel}>Earned</Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${skill.progress}%`, backgroundColor: color }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>{skill.level}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {subjectData.length > 4 && (
        <TouchableOpacity style={styles.viewMoreButton}>
          <Text style={styles.viewMoreText}>View {subjectData.length - 4} More Subjects</Text>
        </TouchableOpacity>
      )}

      {/* Add New Subject Button */}
      <TouchableOpacity style={styles.addSubjectButton}>
        <Text style={styles.addSubjectIcon}>➕</Text>
        <Text style={styles.addSubjectText}>Add New Subject</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  viewAllButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  viewAllText: {
    color: '#2e7d32',
    fontSize: 12,
    fontWeight: '600',
  },
  subjectsGrid: {
    gap: 12,
  },
  subjectCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  subjectIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    flex: 1,
  },
  skillBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  skillText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '500',
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 4,
  },
  viewMoreButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  viewMoreText: {
    fontSize: 14,
    color: '#2e7d32',
    fontWeight: '600',
  },
  addSubjectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fff8',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 2,
    borderColor: '#2e7d32',
    borderStyle: 'dashed',
  },
  addSubjectIcon: {
    fontSize: 16,
    marginRight: 8,
    color: '#2e7d32',
  },
  addSubjectText: {
    fontSize: 14,
    color: '#2e7d32',
    fontWeight: '600',
  },
});

export default SubjectStats;