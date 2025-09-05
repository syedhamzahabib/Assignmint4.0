// components/task/ManualMatchTaskCard.js
// Specialized task card for manual matching tasks on the public feed

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

const ManualMatchTaskCard = ({ 
  task, 
  onAccept, 
  onViewDetails, 
  isAccepting = false 
}) => {
  // Safety check
  if (!task) return null;

  // Get subject color
  const getSubjectColor = (subject) => {
    const colors = {
      'math': '#3f51b5',
      'coding': '#00796b',
      'writing': '#d84315',
      'design': '#6a1b9a',
      'language': '#00838f',
      'chemistry': '#f57f17',
      'physics': '#1976d2',
      'business': '#388e3c',
      'psychology': '#7b1fa2',
      'statistics': '#c62828',
      'science': '#1976d2',
      'biology': '#689f38',
      'history': '#5d4037',
      'engineering': '#455a64',
      'art': '#e91e63'
    };
    return colors[subject?.toLowerCase()] || '#9e9e9e';
  };

  // Get urgency styling
  const getUrgencyStyle = (urgency) => {
    switch (urgency) {
      case 'high': return { backgroundColor: '#ffebee', color: '#f44336', icon: '🔥' };
      case 'medium': return { backgroundColor: '#fff3e0', color: '#ff9800', icon: '⚡' };
      case 'low': return { backgroundColor: '#e8f5e8', color: '#4caf50', icon: '🌱' };
      default: return { backgroundColor: '#f5f5f5', color: '#757575', icon: '📋' };
    }
  };

  // Calculate time left
  const getTimeLeft = (deadline) => {
    if (!deadline) return { text: 'No deadline', color: '#666' };
    
    const now = new Date();
    const due = new Date(deadline);
    const diffMs = due - now;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMs < 0) return { text: 'Overdue', color: '#f44336' };
    if (diffHours < 24) return { text: `${diffHours}h left`, color: '#ff9800' };
    if (diffDays === 1) return { text: '1 day left', color: '#ff9800' };
    return { text: `${diffDays} days left`, color: '#4caf50' };
  };

  // Format relative time
  const getRelativeTime = (timestamp) => {
    if (!timestamp) return 'Recently';
    
    const now = new Date();
    const posted = new Date(timestamp);
    const diffMs = now - posted;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  const urgencyStyle = getUrgencyStyle(task.urgency);
  const timeLeft = getTimeLeft(task.deadline);
  const relativeTime = getRelativeTime(task.createdAt);

  return (
    <View style={styles.card}>
      {/* Header with price and urgency */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.price}>{task.price}</Text>
          <Text style={styles.priceLabel}>Budget</Text>
        </View>
        
        <View style={styles.headerRight}>
          <View style={[styles.urgencyBadge, { backgroundColor: urgencyStyle.backgroundColor }]}>
            <Text style={[styles.urgencyText, { color: urgencyStyle.color }]}>
              {urgencyStyle.icon} {task.urgency?.toUpperCase() || 'MEDIUM'}
            </Text>
          </View>
        </View>
      </View>

      {/* Title and subject */}
      <TouchableOpacity 
        style={styles.contentArea}
        onPress={() => onViewDetails && onViewDetails(task)}
        activeOpacity={0.7}
      >
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={2}>
            {task.title}
          </Text>
          <View style={[styles.subjectBadge, { backgroundColor: getSubjectColor(task.subject) }]}>
            <Text style={styles.subjectText}>{task.subject}</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={3}>
          {task.description}
        </Text>

        {/* Metadata row */}
        <View style={styles.metadataRow}>
          <View style={styles.metadataItem}>
            <Text style={styles.metadataIcon}>📅</Text>
            <Text style={[styles.metadataText, { color: timeLeft.color }]}>
              {timeLeft.text}
            </Text>
          </View>
          
          {task.estimatedHours && (
            <View style={styles.metadataItem}>
              <Text style={styles.metadataIcon}>⏱️</Text>
              <Text style={styles.metadataText}>{task.estimatedHours}h</Text>
            </View>
          )}
          
          <View style={styles.metadataItem}>
            <Text style={styles.metadataIcon}>👤</Text>
            <Text style={styles.metadataText}>{task.requesterName}</Text>
          </View>
          
          <View style={styles.metadataItem}>
            <Text style={styles.metadataIcon}>🕒</Text>
            <Text style={styles.metadataText}>{relativeTime}</Text>
          </View>
        </View>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <View style={styles.tagsRow}>
            {task.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
            {task.tags.length > 3 && (
              <Text style={styles.moreTags}>+{task.tags.length - 3}</Text>
            )}
          </View>
        )}
      </TouchableOpacity>

      {/* Action buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={styles.viewButton}
          onPress={() => onViewDetails && onViewDetails(task)}
          disabled={isAccepting}
        >
          <Text style={styles.viewButtonText}>👀 View Details</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.acceptButton,
            isAccepting && styles.acceptButtonLoading
          ]}
          onPress={() => onAccept && onAccept(task)}
          disabled={isAccepting}
        >
          {isAccepting ? (
            <View style={styles.acceptButtonLoading}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.acceptButtonText}>Accepting...</Text>
            </View>
          ) : (
            <Text style={styles.acceptButtonText}>🎯 Accept Task</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Statistics footer */}
      <View style={styles.statsFooter}>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>👁️</Text>
          <Text style={styles.statText}>{task.viewCount || 0} views</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>📋</Text>
          <Text style={styles.statText}>Manual Match</Text>
        </View>
        
        {task.aiLevel && task.aiLevel !== 'none' && (
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🤖</Text>
            <Text style={styles.statText}>
              {task.aiLevel === 'partial' ? `${task.aiPercentage}% AI` : 'Full AI'}
            </Text>
          </View>
        )}
      </View>

      {/* Special instructions indicator */}
      {task.specialInstructions && task.specialInstructions.trim() && (
        <View style={styles.instructionsIndicator}>
          <Text style={styles.instructionsIcon}>📝</Text>
          <Text style={styles.instructionsText}>Has special instructions</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    overflow: 'hidden',
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerLeft: {
    alignItems: 'flex-start',
  },
  price: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2e7d32',
    marginBottom: 2,
  },
  priceLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  urgencyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  urgencyText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  // Content area
  contentArea: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    flex: 1,
    marginRight: 12,
    lineHeight: 24,
  },
  subjectBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  subjectText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  // Description
  description: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginBottom: 16,
  },
  
  // Metadata
  metadataRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metadataIcon: {
    fontSize: 12,
  },
  metadataText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  
  // Tags
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  moreTags: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
    fontStyle: 'italic',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  
  // Action buttons
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    gap: 12,
  },
  viewButton: {
    flex: 1,
    backgroundColor: '#e9ecef',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },
  acceptButton: {
    flex: 2,
    backgroundColor: '#2e7d32',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#2e7d32',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  acceptButtonLoading: {
    opacity: 0.7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  
  // Stats footer
  statsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statIcon: {
    fontSize: 12,
  },
  statText: {
    fontSize: 11,
    color: '#6c757d',
    fontWeight: '500',
  },
  
  // Special instructions indicator
  instructionsIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff3cd',
    borderTopWidth: 1,
    borderTopColor: '#ffeaa7',
    gap: 6,
  },
  instructionsIcon: {
    fontSize: 12,
  },
  instructionsText: {
    fontSize: 12,
    color: '#856404',
    fontWeight: '500',
  },
});

export default ManualMatchTaskCard;