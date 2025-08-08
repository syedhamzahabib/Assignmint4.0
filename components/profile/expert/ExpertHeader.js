// components/profile/expert/ExpertHeader.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Animated,
  Alert,
} from 'react-native';

const ExpertHeader = ({ 
  profile, 
  fadeAnim, 
  onUpdateBio,
  onQuickAction 
}) => {
  const [editingBio, setEditingBio] = useState(false);
  const [newBio, setNewBio] = useState(profile.expertProfile?.bio || '');

  const handleUpdateBio = async () => {
    if (!newBio.trim()) {
      Alert.alert('Error', 'Bio cannot be empty');
      return;
    }
    
    try {
      await onUpdateBio(newBio.trim());
      setEditingBio(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update bio');
    }
  };

  const getExpertLevel = (tasksCompleted) => {
    if (tasksCompleted < 5) return { text: 'New Expert', color: '#4caf50', icon: '🌱' };
    if (tasksCompleted < 25) return { text: 'Rising Star', color: '#2196f3', icon: '⭐' };
    if (tasksCompleted < 50) return { text: 'Experienced', color: '#ff9800', icon: '🏅' };
    if (tasksCompleted < 100) return { text: 'Expert Pro', color: '#9c27b0', icon: '👑' };
    return { text: 'Master Expert', color: '#f44336', icon: '🔥' };
  };

  const expertLevel = getExpertLevel(profile.expertStats.tasksCompleted);

  return (
    <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
      <View style={styles.profileInfo}>
        {/* Enhanced Avatar with Expert Indicator */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            <Text style={styles.avatar}>{profile.avatar}</Text>
            <View style={[styles.expertBadge, { backgroundColor: expertLevel.color }]}>
              <Text style={styles.expertBadgeIcon}>{expertLevel.icon}</Text>
            </View>
          </View>
          <View style={styles.onlineIndicator} />
        </View>
        
        <View style={styles.userInfo}>
          {/* Name and Level */}
          <View style={styles.nameContainer}>
            <Text style={styles.nickname}>{profile.nickname}</Text>
            <View style={[styles.levelBadge, { backgroundColor: expertLevel.color + '20' }]}>
              <Text style={[styles.levelText, { color: expertLevel.color }]}>
                {expertLevel.text}
              </Text>
            </View>
          </View>
          
          {/* Editable Bio */}
          {editingBio ? (
            <View style={styles.editContainer}>
              <TextInput
                style={styles.editInput}
                value={newBio}
                onChangeText={setNewBio}
                placeholder="Tell clients about your expertise..."
                maxLength={120}
                multiline
                numberOfLines={2}
                autoFocus
              />
              <View style={styles.editButtons}>
                <TouchableOpacity 
                  onPress={() => setEditingBio(false)}
                  style={styles.editButtonCancel}
                >
                  <Text style={styles.editButtonText}>❌</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleUpdateBio}
                  style={styles.editButtonSave}
                >
                  <Text style={styles.editButtonText}>✅</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.charCount}>{newBio.length}/120</Text>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.bioContainer} 
              onPress={() => setEditingBio(true)}
            >
              <Text style={styles.bio}>
                {profile.expertProfile?.bio || 'Tap to add your expert bio...'}
              </Text>
              <Text style={styles.editIcon}>✏️</Text>
            </TouchableOpacity>
          )}

          {/* Quick Stats Row */}
          <View style={styles.quickStats}>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatNumber}>{profile.expertStats.tasksCompleted}</Text>
              <Text style={styles.quickStatLabel}>Tasks</Text>
            </View>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatNumber}>★{profile.expertStats.avgRating}</Text>
              <Text style={styles.quickStatLabel}>Rating</Text>
            </View>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatNumber}>${profile.expertStats.totalEarned}</Text>
              <Text style={styles.quickStatLabel}>Earned</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Expert Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => onQuickAction('portfolio')}
        >
          <Text style={styles.quickActionIcon}>💼</Text>
          <Text style={styles.quickActionText}>Portfolio</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => onQuickAction('reviews')}
        >
          <Text style={styles.quickActionIcon}>⭐</Text>
          <Text style={styles.quickActionText}>Reviews</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => onQuickAction('wallet')}
        >
          <Text style={styles.quickActionIcon}>💰</Text>
          <Text style={styles.quickActionText}>Earnings</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  avatarContainer: {
    marginRight: 16,
    position: 'relative',
  },
  avatarWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatar: {
    fontSize: 36,
  },
  expertBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  expertBadgeIcon: {
    fontSize: 12,
  },
  onlineIndicator: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4caf50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 8,
  },
  nickname: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bioContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  bio: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
    flex: 1,
    fontStyle: 'italic',
  },
  editIcon: {
    fontSize: 14,
    opacity: 0.7,
    marginLeft: 8,
  },
  editContainer: {
    marginBottom: 12,
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#2e7d32',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: '#f8fff8',
    marginBottom: 8,
    textAlignVertical: 'top',
  },
  editButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  editButtonCancel: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#ffebee',
  },
  editButtonSave: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#e8f5e8',
  },
  editButtonText: {
    fontSize: 16,
  },
  charCount: {
    fontSize: 11,
    color: '#999',
    textAlign: 'right',
  },
  quickStats: {
    flexDirection: 'row',
    gap: 16,
  },
  quickStat: {
    alignItems: 'center',
  },
  quickStatNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2e7d32',
    marginBottom: 2,
  },
  quickStatLabel: {
    fontSize: 10,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  quickActionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  quickActionText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
});

export default ExpertHeader;