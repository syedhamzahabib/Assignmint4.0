import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants';
import Icon, { Icons } from '../components/common/Icon';

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleAccept = () => {
    Alert.alert('Accept', 'Task accepted!');
  };

  const handleNegotiate = () => {
    navigation.navigate('ChatThread', { 
      chat: { 
        id: '1', 
        name: 'John Smith', 
        taskTitle: 'Graphic Design Task' 
      } 
    });
  };

  const handleBestDeal = () => {
    navigation.navigate('TaskDetails', { taskId: '1' });
  };

  const handleViewTask = () => {
    navigation.navigate('TaskDetails', { taskId: '1' });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Top Navigation Bar */}
      <View style={styles.topBar}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search assignments, subjects, experts..."
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Icon name={Icons.notifications} size={20} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('Messages')}
          >
            <Icon name={Icons.messages} size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Feed Content */}
      <ScrollView 
        style={styles.feedContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedContent}
      >
        {/* First Task Card */}
        <TouchableOpacity style={styles.taskCard} onPress={handleViewTask}>
          <View style={styles.userHeader}>
            <View style={styles.userInfo}>
              <View style={styles.avatarPlaceholder}>
                <Icon name={Icons.user} size={24} color={COLORS.textSecondary} />
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>John Smith</Text>
                <Text style={styles.taskType}>offering Graphic Design Task</Text>
              </View>
            </View>
          </View>

          <View style={styles.subjectBadge}>
            <Text style={styles.subjectBadgeText}>Graphic Design</Text>
          </View>

          <Text style={styles.taskDescription}>
            A detailed description of the graphic design assignment that requires creativity and proficiency in Adobe Photoshop and Illustrator.
          </Text>

          <View style={styles.previewImageContainer}>
            <View style={styles.previewImagePlaceholder}>
              <Icon name={Icons.image} size={32} color={COLORS.textSecondary} />
              <Text style={styles.previewImageLabel}>Preview Image</Text>
            </View>
          </View>

          <View style={styles.taskDetails}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Budget:</Text>
              <Text style={styles.detailValue}>$500</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Deadline:</Text>
              <Text style={styles.detailValue}>10/31/2023</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>AI Assistance:</Text>
              <Text style={styles.detailValue}>High</Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.acceptButton]}
              onPress={handleAccept}
            >
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.negotiateButton]}
              onPress={handleNegotiate}
            >
              <Text style={styles.negotiateButtonText}>Negotiate</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.bestDealButton]}
              onPress={handleBestDeal}
            >
              <Text style={styles.bestDealButtonText}>Best Deal</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton}>
              <Icon name={Icons.like} size={16} color={COLORS.textSecondary} />
              <Text style={styles.socialText}>Like</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Icon name={Icons.messages} size={16} color={COLORS.textSecondary} />
              <Text style={styles.socialText}>Comment</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Icon name={Icons.share} size={16} color={COLORS.textSecondary} />
              <Text style={styles.socialText}>Share</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Second Task Card */}
        <TouchableOpacity style={styles.taskCard} onPress={handleViewTask}>
          <View style={styles.userHeader}>
            <View style={styles.userInfo}>
              <View style={styles.avatarPlaceholder}>
                <Icon name={Icons.user} size={24} color={COLORS.textSecondary} />
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>Emily Davis</Text>
                <Text style={styles.taskType}>offering Content writing Task</Text>
              </View>
            </View>
          </View>

          <View style={styles.subjectBadge}>
            <Text style={styles.subjectBadgeText}>Content writing</Text>
          </View>

          <Text style={styles.taskDescription}>
            Create engaging content for a tech blog that covers the latest trends in artificial intelligence and machine learning.
          </Text>

          <View style={styles.previewImageContainer}>
            <View style={styles.previewImagePlaceholder}>
              <Icon name={Icons.image} size={32} color={COLORS.textSecondary} />
              <Text style={styles.previewImageLabel}>Preview Image</Text>
            </View>
          </View>

          <View style={styles.taskDetails}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Budget:</Text>
              <Text style={styles.detailValue}>$300</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Deadline:</Text>
              <Text style={styles.detailValue}>11/15/2023</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>AI Assistance:</Text>
              <Text style={styles.detailValue}>Medium</Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.acceptButton]}
              onPress={handleAccept}
            >
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.negotiateButton]}
              onPress={handleNegotiate}
            >
              <Text style={styles.negotiateButtonText}>Negotiate</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.bestDealButton]}
              onPress={handleBestDeal}
            >
              <Text style={styles.bestDealButtonText}>Best Deal</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton}>
              <Icon name={Icons.like} size={16} color={COLORS.textSecondary} />
              <Text style={styles.socialText}>Like</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Icon name={Icons.messages} size={16} color={COLORS.textSecondary} />
              <Text style={styles.socialText}>Comment</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Icon name={Icons.share} size={16} color={COLORS.textSecondary} />
              <Text style={styles.socialText}>Share</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuButton: {
    padding: 8,
    marginRight: 12,
  },
  menuIcon: {
    fontSize: 24,
    color: '#000000',
  },
  searchContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInput: {
    fontSize: 16,
    color: '#000000',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  headerButtonIcon: {
    fontSize: 20,
    color: '#007AFF',
  },
  feedContainer: {
    flex: 1,
  },
  feedContent: {
    padding: 16,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userHeader: {
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 24,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 2,
  },
  taskType: {
    fontSize: 14,
    color: '#8E8E93',
  },
  subjectBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#007AFF20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  subjectBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
  },
  taskDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 16,
  },
  previewImageContainer: {
    marginBottom: 16,
  },
  previewImagePlaceholder: {
    width: '100%',
    height: 140,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  previewImageText: {
    fontSize: 32,
    marginBottom: 8,
  },
  previewImageLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  taskDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#34C759',
  },
  negotiateButton: {
    backgroundColor: '#FF9500',
  },
  bestDealButton: {
    backgroundColor: '#007AFF',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  negotiateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  bestDealButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  socialButton: {
    alignItems: 'center',
    flex: 1,
  },
  socialIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  socialText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
});

export default HomeScreen; 