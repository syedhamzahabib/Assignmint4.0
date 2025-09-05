import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants';
import { useAIChat } from '../hooks/useAIChat';
import Icon, { Icons } from '../components/common/Icon';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  subject?: string;
  attachments?: Array<{
    type: 'image' | 'pdf' | 'document';
    uri: string;
    name: string;
  }>;
}

interface ChatSession {
  id: string;
  title: string;
  subject: string;
  createdAt: Date;
  lastMessage: string;
}

const { width: screenWidth } = Dimensions.get('window');

const AIAssistantScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [inputText, setInputText] = useState('');
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [showSessionsModal, setShowSessionsModal] = useState(false);

  // Use the AI chat hook
  const {
    messages,
    isTyping,
    currentSubject,
    explanationMode,
    chatSessions,
    currentSessionId,
    sendMessage,
    processImage,
    processDocument,
    createNewChat,
    loadSession,
    deleteSession,
    clearChat,
    toggleExplanationMode,
  } = useAIChat('mock-user-id'); // TODO: Replace with actual user ID from auth

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) {return;}

    await sendMessage(inputText);
    setInputText('');
  };

  const handleTakePhoto = () => {
    setShowAttachmentModal(false);
    Alert.alert(
      'Camera Feature',
      'Camera integration will be implemented here. This will:\n\n• Open camera to take photo\n• Use OCR to extract text\n• Detect subject automatically\n• Provide contextual help',
      [{ text: 'OK' }]
    );
  };

  const handleUploadDocument = () => {
    setShowAttachmentModal(false);
    Alert.alert(
      'Document Upload',
      'Document picker will be implemented here. This will:\n\n• Select PDFs, images, documents\n• Extract text and content\n• Analyze subject matter\n• Provide relevant assistance',
      [{ text: 'OK' }]
    );
  };

  const handleCreateNewChat = async () => {
    await createNewChat();
    setShowSessionsModal(false);
  };

  const renderMessage = (message: Message) => (
    <View
      key={message.id}
      style={[
        styles.messageContainer,
        message.isUser ? styles.userMessage : styles.aiMessage,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          message.isUser ? styles.userBubble : styles.aiBubble,
        ]}
      >
        {!message.isUser && message.subject && (
          <View style={styles.subjectBadge}>
            <Text style={styles.subjectBadgeText}>{message.subject}</Text>
          </View>
        )}

        <Text
          style={[
            styles.messageText,
            message.isUser ? styles.userMessageText : styles.aiMessageText,
          ]}
        >
          {message.text}
        </Text>

        {message.attachments && message.attachments.length > 0 && (
          <View style={styles.attachmentContainer}>
            {message.attachments.map((attachment, index) => (
              <View key={index} style={styles.attachmentItem}>
                <Icon
                  name={attachment.type === 'image' ? Icons.camera : Icons.document}
                  size={16}
                  color={COLORS.textSecondary}
                  style={styles.attachmentIcon}
                />
                <Text style={styles.attachmentName}>{attachment.name}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.timestamp}>
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </View>
  );

  const renderChatSession = (session: ChatSession) => (
    <TouchableOpacity
      key={session.id}
      style={styles.sessionItem}
      onPress={async () => {
        setShowSessionsModal(false);
        await loadSession(session.id);
      }}
    >
      <View style={styles.sessionHeader}>
        <Text style={styles.sessionTitle}>{session.title}</Text>
        <Text style={styles.sessionSubject}>{session.subject}</Text>
      </View>
      <Text style={styles.sessionLastMessage}>{session.lastMessage}</Text>
      <Text style={styles.sessionDate}>
        {session.createdAt.toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>AI Assistant</Text>
          <Text style={styles.headerSubtitle}>
            {currentSubject ? `${currentSubject} • Smart Mode` : 'Your study companion'}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowSessionsModal(true)}
          >
            <Icon name={Icons.book} size={20} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={toggleExplanationMode}
          >
            <Icon
              name={explanationMode ? Icons.brain : Icons.help}
              size={20}
              color={COLORS.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(renderMessage)}

        {isTyping && (
          <View style={[styles.messageContainer, styles.aiMessage]}>
            <View style={[styles.messageBubble, styles.aiBubble]}>
              <View style={styles.typingIndicator}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Text style={styles.typingText}>AI is thinking...</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.attachmentButton}
          onPress={() => setShowAttachmentModal(true)}
        >
          <Icon name={Icons.attachment} size={20} color={COLORS.text} />
        </TouchableOpacity>

        <TextInput
          style={styles.textInput}
          placeholder="Ask me anything about your assignment..."
          placeholderTextColor={COLORS.textSecondary}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={1000}
        />

        <TouchableOpacity
          style={[
            styles.sendButton,
            !inputText.trim() && styles.sendButtonDisabled,
          ]}
          onPress={handleSendMessage}
          disabled={!inputText.trim()}
        >
          <Icon name={Icons.send} size={16} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Attachment Modal */}
      <Modal
        visible={showAttachmentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAttachmentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Attachment</Text>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleTakePhoto}
            >
              <Icon name={Icons.camera} size={24} color={COLORS.text} style={styles.modalOptionIcon} />
              <View style={styles.modalOptionContent}>
                <Text style={styles.modalOptionText}>Take Photo</Text>
                <Text style={styles.modalOptionSubtext}>Use camera to capture assignment</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleUploadDocument}
            >
              <Icon name={Icons.document} size={24} color={COLORS.text} style={styles.modalOptionIcon} />
              <View style={styles.modalOptionContent}>
                <Text style={styles.modalOptionText}>Upload Document</Text>
                <Text style={styles.modalOptionSubtext}>Select PDF, image, or document</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowAttachmentModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Sessions Modal */}
      <Modal
        visible={showSessionsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSessionsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.sessionsModalContent]}>
            <View style={styles.sessionsHeader}>
              <Text style={styles.modalTitle}>Chat Sessions</Text>
              <TouchableOpacity
                style={styles.newChatButton}
                onPress={handleCreateNewChat}
              >
                <Icon name={Icons.add} size={16} color={COLORS.white} style={{ marginRight: 4 }} />
                <Text style={styles.newChatButtonText}>New Chat</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.sessionsList}>
              {chatSessions.map(renderChatSession)}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowSessionsModal(false)}
            >
              <Text style={styles.modalCancelText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.surface,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: SPACING.sm,
    marginLeft: SPACING.xs,
  },
  headerButtonIcon: {
    fontSize: 18,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: SPACING.md,
  },
  messageContainer: {
    marginBottom: SPACING.md,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '85%',
    padding: SPACING.md,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  subjectBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: SPACING.xs,
  },
  subjectBadgeText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.white,
    fontWeight: FONTS.weights.medium,
  },
  messageText: {
    fontSize: FONTS.sizes.md,
    lineHeight: 22,
  },
  userMessageText: {
    color: COLORS.white,
  },
  aiMessageText: {
    color: COLORS.text,
  },
  attachmentContainer: {
    marginTop: SPACING.sm,
    padding: SPACING.sm,
    backgroundColor: COLORS.gray100,
    borderRadius: 8,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  attachmentIcon: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  attachmentName: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  timestamp: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    alignSelf: 'flex-end',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  attachmentButton: {
    padding: SPACING.sm,
    marginRight: SPACING.sm,
  },
  textInput: {
    flex: 1,
    backgroundColor: COLORS.gray100,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    maxHeight: 100,
  },
  sendButton: {
    padding: SPACING.sm,
    marginLeft: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.gray300,
  },
  sendIcon: {
    fontSize: 16,
    color: COLORS.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: SPACING.lg,
    maxHeight: '80%',
  },
  sessionsModalContent: {
    maxHeight: '90%',
  },
  sessionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  newChatButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  newChatButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
  },
  sessionsList: {
    maxHeight: 400,
  },
  sessionItem: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  sessionTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
    color: COLORS.text,
  },
  sessionSubject: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.primary,
    backgroundColor: COLORS.gray100,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: 8,
  },
  sessionLastMessage: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  sessionDate: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
  },
  modalTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalOptionIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  modalOptionContent: {
    flex: 1,
  },
  modalOptionText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    fontWeight: FONTS.weights.medium,
  },
  modalOptionSubtext: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  modalCancel: {
    marginTop: SPACING.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.primary,
    fontWeight: FONTS.weights.medium,
  },
});

export default AIAssistantScreen;
