import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { COLORS } from '../constants';
import Icon, { Icons } from '../components/common/Icon';

const MessagesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock chat data
  const chats = [
    {
      id: '1',
      name: 'Sarah M.',
      avatar: 'user',
      lastMessage: 'Thank you for the excellent work on the business case study!',
      time: '2 min ago',
      unreadCount: 2,
      isOnline: true,
      taskTitle: 'Business Case Study Analysis',
    },
    {
      id: '2',
      name: 'Mike R.',
      avatar: 'user',
      lastMessage: 'I have a question about the research paper requirements.',
      time: '1 hour ago',
      unreadCount: 0,
      isOnline: false,
      taskTitle: 'Research Paper Writing',
    },
    {
      id: '3',
      name: 'Emily T.',
      avatar: 'user',
      lastMessage: 'The chemistry lab report looks perfect. Great job!',
      time: '3 hours ago',
      unreadCount: 0,
      isOnline: true,
      taskTitle: 'Chemistry Lab Report',
    },
    {
      id: '4',
      name: 'David L.',
      avatar: 'user',
      lastMessage: 'Can we discuss the marketing strategy plan?',
      time: '1 day ago',
      unreadCount: 1,
      isOnline: false,
      taskTitle: 'Marketing Strategy Plan',
    },
    {
      id: '5',
      name: 'Alex K.',
      avatar: 'user',
      lastMessage: 'I\'ve started working on the graphic design project.',
      time: '2 days ago',
      unreadCount: 0,
      isOnline: true,
      taskTitle: 'Graphic Design Project',
    },
    {
      id: '6',
      name: 'John S.',
      avatar: 'user',
      lastMessage: 'The mobile app development is progressing well.',
      time: '3 days ago',
      unreadCount: 0,
      isOnline: false,
      taskTitle: 'Mobile App Development',
    },
    {
      id: '7',
      name: 'Lisa W.',
      avatar: 'user',
      lastMessage: 'I need some clarification on the programming assignment.',
      time: '1 week ago',
      unreadCount: 0,
      isOnline: false,
      taskTitle: 'Programming Assignment',
    },
  ];

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.taskTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChatPress = (chat: any) => {
    navigation.navigate('ChatThread', { chat });
  };

  const renderChatItem = (chat: any) => (
    <TouchableOpacity
      key={chat.id}
      style={styles.chatItem}
      onPress={() => handleChatPress(chat)}
    >
      <View style={styles.chatAvatar}>
        <Icon name={Icons.user} size={24} color={COLORS.textSecondary} />
        {chat.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{chat.name}</Text>
          <Text style={styles.chatTime}>{chat.time}</Text>
        </View>
        
        <Text style={styles.taskTitle}>{chat.taskTitle}</Text>
        
        <View style={styles.messageRow}>
          <Text 
            style={[
              styles.lastMessage,
              chat.unreadCount > 0 && styles.unreadMessage
            ]}
            numberOfLines={1}
          >
            {chat.lastMessage}
          </Text>
          
          {chat.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{chat.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.newMessageButton}>
          <Icon name={Icons.edit} size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name={Icons.search} size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <Icon name={Icons.close} size={16} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickActionsScroll}
        >
          <TouchableOpacity style={styles.quickActionButton}>
            <Icon name={Icons.edit} size={20} color={COLORS.text} />
            <Text style={styles.quickActionText}>New Task</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <Icon name={Icons.users} size={20} color={COLORS.text} />
            <Text style={styles.quickActionText}>Group Chat</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <Icon name={Icons.star} size={20} color={COLORS.text} />
            <Text style={styles.quickActionText}>Favorites</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <Icon name={Icons.task} size={20} color={COLORS.text} />
            <Text style={styles.quickActionText}>Archived</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Chats List */}
      <ScrollView 
        style={styles.chatsList}
        showsVerticalScrollIndicator={false}
      >
        {filteredChats.length > 0 ? (
          filteredChats.map(renderChatItem)
        ) : (
          <View style={styles.emptyState}>
            <Icon name={Icons.messages} size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyStateTitle}>No conversations found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Start a conversation by posting a task or reaching out to experts'
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  newMessageButton: {
    padding: 8,
  },
  newMessageIcon: {
    fontSize: 20,
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    color: '#8E8E93',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  quickActions: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  quickActionsScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  quickActionButton: {
    alignItems: 'center',
    marginRight: 24,
    minWidth: 60,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  quickActionText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  chatsList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  chatAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  avatarText: {
    fontSize: 24,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#34C759',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  chatTime: {
    fontSize: 12,
    color: '#8E8E93',
  },
  taskTitle: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    marginBottom: 4,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    fontSize: 14,
    color: '#8E8E93',
    flex: 1,
    marginRight: 8,
  },
  unreadMessage: {
    color: '#000000',
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadCount: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

export default MessagesScreen; 