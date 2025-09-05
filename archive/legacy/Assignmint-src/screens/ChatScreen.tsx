import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
} from 'react-native';
import Icon, { Icons } from '../components/common/Icon';
import { COLORS } from '../constants';

const ChatScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock chat data
  const chats = [
    {
      id: '1',
      name: 'Sarah M.',
      lastMessage: 'Thanks for the quick delivery!',
      time: '2 min ago',
      unreadCount: 0,
      isOnline: true,
      taskTitle: 'Business Case Study',
      avatar: '👩‍💼',
    },
    {
      id: '2',
      name: 'Mike R.',
      lastMessage: 'Can you explain the methodology section?',
      time: '1 hour ago',
      unreadCount: 2,
      isOnline: false,
      taskTitle: 'Mobile App Development',
      avatar: '👨‍💻',
    },
    {
      id: '3',
      name: 'Emily T.',
      lastMessage: 'The design looks perfect!',
      time: '3 hours ago',
      unreadCount: 0,
      isOnline: true,
      taskTitle: 'Chemistry Lab Report',
      avatar: '👩‍🔬',
    },
    {
      id: '4',
      name: 'David L.',
      lastMessage: 'When can you start the project?',
      time: '1 day ago',
      unreadCount: 1,
      isOnline: false,
      taskTitle: 'Marketing Strategy Plan',
      avatar: '👨‍💼',
    },
  ];

  const handleChatPress = (chat: any) => {
    navigation.navigate('ChatThread', { chat });
  };

  const handleNewChat = () => {
    Alert.alert('New Chat', 'Start a new conversation feature coming soon!');
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.taskTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderChatItem = (chat: any) => (
    <TouchableOpacity
      key={chat.id}
      style={styles.chatItem}
      onPress={() => handleChatPress(chat)}
    >
      <View style={styles.chatAvatar}>
        <Text style={styles.avatarText}>{chat.avatar}</Text>
        {chat.isOnline && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{chat.name}</Text>
          <Text style={styles.chatTime}>{chat.time}</Text>
        </View>

        <Text style={styles.taskTitle}>{chat.taskTitle}</Text>

        <Text
          style={[
            styles.lastMessage,
            chat.unreadCount > 0 && styles.unreadMessage,
          ]}
          numberOfLines={1}
        >
          {chat.lastMessage}
        </Text>
      </View>

      {chat.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadCount}>{chat.unreadCount}</Text>
        </View>
      )}
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
          <Icon name={Icons.arrowBack} size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.newChatButton} onPress={handleNewChat}>
          <Icon name={Icons.add} size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name={Icons.search} size={20} color={COLORS.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations..."
          placeholderTextColor={COLORS.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickAction}>
          <Icon name={Icons.people} size={20} color={COLORS.primary} />
          <Text style={styles.quickActionText}>Group Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction}>
          <Icon name={Icons.notifications} size={20} color={COLORS.primary} />
          <Text style={styles.quickActionText}>Notifications</Text>
        </TouchableOpacity>
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
            <Icon name={Icons.chat} size={64} color={COLORS.textSecondary} />
            <Text style={styles.emptyTitle}>No conversations yet</Text>
            <Text style={styles.emptyText}>
              Start a conversation by accepting a task or posting one
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
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  newChatButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: 20,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickActionText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  chatsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chatAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  chatTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  taskTitle: {
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  unreadMessage: {
    color: COLORS.text,
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadCount: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default ChatScreen;
