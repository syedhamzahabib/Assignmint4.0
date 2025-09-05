// components/profile/ProfileHeader.js
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

const ProfileHeader = ({ 
  profile, 
  fadeAnim, 
  onUpdateNickname,
  onQuickAction 
}) => {
  const [editingNickname, setEditingNickname] = useState(false);
  const [newNickname, setNewNickname] = useState(profile.nickname);

  const getMembershipBadge = (days) => {
    if (days < 30) return { text: 'New Member', color: '#4caf50', icon: '🌱' };
    if (days < 90) return { text: 'Active Member', color: '#2196f3', icon: '⚡' };
    if (days < 180) return { text: 'Trusted Member', color: '#ff9800', icon: '🏅' };
    return { text: 'VIP Member', color: '#9c27b0', icon: '👑' };
  };

  const handleUpdateNickname = async () => {
    if (!newNickname.trim()) {
      Alert.alert('Error', 'Nickname cannot be empty');
      return;
    }
    
    try {
      await onUpdateNickname(newNickname.trim());
      setEditingNickname(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update nickname');
    }
  };

  const membershipBadge = getMembershipBadge(profile.memberSince);

  return (
    <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
      <View style={styles.profileInfo}>
        {/* Enhanced Avatar with Status */}
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>{profile.avatar}</Text>
          <View style={styles.onlineIndicator} />
        </View>
        
        <View style={styles.userInfo}>
          {/* Editable Nickname with Animation */}
          {editingNickname ? (
            <View style={styles.editContainer}>
              <TextInput
                style={styles.editInput}
                value={newNickname}
                onChangeText={setNewNickname}
                placeholder="Enter nickname"
                maxLength={30}
                autoFocus
              />
              <View style={styles.editButtons}>
                <TouchableOpacity 
                  onPress={() => setEditingNickname(false)}
                  style={styles.editButtonCancel}
                >
                  <Text style={styles.editButtonText}>❌</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleUpdateNickname}
                  style={styles.editButtonSave}
                >
                  <Text style={styles.editButtonText}>✅</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.nicknameContainer} 
              onPress={() => setEditingNickname(true)}
            >
              <Text style={styles.nickname}>{profile.nickname}</Text>
              <Text style={styles.editIcon}>✏️</Text>
            </TouchableOpacity>
          )}
          
          <Text style={styles.email}>{profile.email}</Text>
          
          {/* Enhanced membership info */}
          <View style={styles.membershipContainer}>
            <View style={[styles.membershipBadge, { backgroundColor: membershipBadge.color + '20' }]}>
              <Text style={styles.membershipIcon}>{membershipBadge.icon}</Text>
              <Text style={[styles.membershipText, { color: membershipBadge.color }]}>
                {membershipBadge.text}
              </Text>
            </View>
            <Text style={styles.joinDate}>
              {profile.memberSince} days • Joined {new Date(profile.joinDate).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Action Buttons */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => onQuickAction('stats')}
        >
          <Text style={styles.quickActionIcon}>📊</Text>
          <Text style={styles.quickActionText}>Stats</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => onQuickAction('achievements')}
        >
          <Text style={styles.quickActionIcon}>🏆</Text>
          <Text style={styles.quickActionText}>Awards</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => onQuickAction('wallet')}
        >
          <Text style={styles.quickActionIcon}>💰</Text>
          <Text style={styles.quickActionText}>Wallet</Text>
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
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  avatar: {
    fontSize: 36,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
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
  nicknameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  nickname: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
    marginRight: 8,
  },
  editIcon: {
    fontSize: 16,
    opacity: 0.7,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  membershipContainer: {
    gap: 6,
  },
  membershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  membershipIcon: {
    fontSize: 12,
  },
  membershipText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  joinDate: {
    fontSize: 13,
    color: '#999',
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  editInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#2e7d32',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
    backgroundColor: '#f8fff8',
  },
  editButtons: {
    flexDirection: 'row',
    gap: 8,
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

export default ProfileHeader;