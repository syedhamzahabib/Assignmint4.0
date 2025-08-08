import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const ChatThreadScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { chat } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hi! I have a question about the business case study requirements.',
      sender: 'user',
      time: '10:30 AM',
      isRead: true,
    },
    {
      id: '2',
      text: 'Hello! I\'d be happy to help. What specific questions do you have?',
      sender: 'other',
      time: '10:32 AM',
      isRead: true,
    },
    {
      id: '3',
      text: 'I\'m not sure about the formatting requirements and the expected length.',
      sender: 'user',
      time: '10:35 AM',
      isRead: true,
    },
    {
      id: '4',
      text: 'The case study should be 8-10 pages, double-spaced, with APA formatting. I can provide you with a template if you\'d like.',
      sender: 'other',
      time: '10:37 AM',
      isRead: true,
    },
    {
      id: '5',
      text: 'That would be very helpful! Thank you so much.',
      sender: 'user',
      time: '10:40 AM',
      isRead: false,
    },
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: message.trim(),
        sender: 'user',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false,
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      
      // Simulate reply after 2 seconds
      setTimeout(() => {
        const reply = {
          id: (Date.now() + 1).toString(),
          text: 'You\'re welcome! I\'ll send the template right away.',
          sender: 'other',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: false,
        };
        setMessages(prev => [...prev, reply]);
      }, 2000);
    }
  };

  const renderMessage = (msg: any) => (
    <View
      key={msg.id}
      style={[
        styles.messageContainer,
        msg.sender === 'user' ? styles.userMessage : styles.otherMessage
      ]}
    >
      <View style={[
        styles.messageBubble,
        msg.sender === 'user' ? styles.userBubble : styles.otherBubble
      ]}>
        <Text style={[
          styles.messageText,
          msg.sender === 'user' ? styles.userMessageText : styles.otherMessageText
        ]}>
          {msg.text}
        </Text>
        <View style={styles.messageFooter}>
          <Text style={styles.messageTime}>{msg.time}</Text>
          {msg.sender === 'user' && (
            <Text style={styles.readStatus}>
              {msg.isRead ? '✓✓' : '✓'}
            </Text>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <View style={styles.headerAvatar}>
              <Text style={styles.avatarText}>{chat.avatar}</Text>
              {chat.isOnline && <View style={styles.onlineIndicator} />}
            </View>
            <View style={styles.headerText}>
              <Text style={styles.headerName}>{chat.name}</Text>
              <Text style={styles.headerStatus}>
                {chat.isOnline ? 'Online' : 'Last seen recently'}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.moreButton}>
            <Text style={styles.moreButtonText}>⋯</Text>
          </TouchableOpacity>
        </View>

        {/* Task Info */}
        <View style={styles.taskInfo}>
          <Text style={styles.taskInfoText}>📋 {chat.taskTitle}</Text>
        </View>

        {/* Messages */}
        <ScrollView 
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map(renderMessage)}
        </ScrollView>

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.messageInput}
              placeholder="Type a message..."
              placeholderTextColor="#8E8E93"
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
            />
            <TouchableOpacity 
              style={[
                styles.sendButton,
                !message.trim() && styles.sendButtonDisabled
              ]}
              onPress={handleSendMessage}
              disabled={!message.trim()}
            >
              <Text style={[
                styles.sendButtonText,
                !message.trim() && styles.sendButtonTextDisabled
              ]}>
                ➤
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#007AFF',
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  avatarText: {
    fontSize: 20,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#34C759',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  headerText: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  headerStatus: {
    fontSize: 12,
    color: '#8E8E93',
  },
  moreButton: {
    padding: 8,
  },
  moreButtonText: {
    fontSize: 20,
    color: '#8E8E93',
  },
  taskInfo: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  taskInfoText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  messageContainer: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: '#000000',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  messageTime: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    marginRight: 4,
  },
  readStatus: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    maxHeight: 100,
    paddingVertical: 4,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#E5E5EA',
  },
  sendButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  sendButtonTextDisabled: {
    color: '#8E8E93',
  },
});

export default ChatThreadScreen; 