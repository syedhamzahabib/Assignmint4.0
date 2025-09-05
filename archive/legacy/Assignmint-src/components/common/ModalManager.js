// components/common/ModalManager.js - Fixed version with React import
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from 'react-native';

const ModalManager = ({ 
  visible, 
  onClose, 
  title, 
  message, 
  buttons = [], 
  loading = false,
  type = 'default' // 'default', 'success', 'error', 'warning', 'confirm'
}) => {
  const getModalStyle = () => {
    switch (type) {
      case 'success':
        return {
          icon: '✅',
          titleColor: '#4caf50',
          backgroundColor: '#e8f5e8'
        };
      case 'error':
        return {
          icon: '❌',
          titleColor: '#f44336',
          backgroundColor: '#ffebee'
        };
      case 'warning':
        return {
          icon: '⚠️',
          titleColor: '#ff9800',
          backgroundColor: '#fff3e0'
        };
      case 'confirm':
        return {
          icon: '❓',
          titleColor: '#2196f3',
          backgroundColor: '#e3f2fd'
        };
      default:
        return {
          icon: 'ℹ️',
          titleColor: '#111',
          backgroundColor: '#f8f9fa'
        };
    }
  };

  const modalStyle = getModalStyle();

  const renderButtons = () => {
    if (buttons.length === 0) {
      return (
        <TouchableOpacity style={styles.defaultButton} onPress={onClose}>
          <Text style={styles.defaultButtonText}>OK</Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.buttonContainer}>
        {buttons.map((button, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.button,
              button.style === 'cancel' && styles.cancelButton,
              button.style === 'destructive' && styles.destructiveButton,
              button.style === 'primary' && styles.primaryButton,
              loading && styles.disabledButton
            ]}
            onPress={button.onPress}
            disabled={loading}
          >
            <Text style={[
              styles.buttonText,
              button.style === 'cancel' && styles.cancelButtonText,
              button.style === 'destructive' && styles.destructiveButtonText,
              button.style === 'primary' && styles.primaryButtonText,
            ]}>
              {button.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContent, { backgroundColor: modalStyle.backgroundColor }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.modalIcon}>{modalStyle.icon}</Text>
            <Text style={[styles.modalTitle, { color: modalStyle.titleColor }]}>
              {title}
            </Text>
          </View>

          {/* Message */}
          {message && (
            <Text style={styles.modalMessage}>{message}</Text>
          )}

          {/* Loading Indicator */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={modalStyle.titleColor} />
              <Text style={styles.loadingText}>Processing...</Text>
            </View>
          )}

          {/* Buttons */}
          {!loading && renderButtons()}
        </View>
      </View>
    </Modal>
  );
};

// Hook for easier modal management
export const useModal = () => {
  const [modalState, setModalState] = React.useState({
    visible: false,
    title: '',
    message: '',
    buttons: [],
    loading: false,
    type: 'default'
  });

  const showModal = (config) => {
    setModalState({
      visible: true,
      title: config.title || '',
      message: config.message || '',
      buttons: config.buttons || [],
      loading: config.loading || false,
      type: config.type || 'default'
    });
  };

  const hideModal = () => {
    setModalState(prev => ({ ...prev, visible: false }));
  };

  const setLoading = (loading) => {
    setModalState(prev => ({ ...prev, loading }));
  };

  // Convenience methods
  const showSuccess = (title, message, buttons) => {
    showModal({ title, message, buttons, type: 'success' });
  };

  const showError = (title, message, buttons) => {
    showModal({ title, message, buttons, type: 'error' });
  };

  const showWarning = (title, message, buttons) => {
    showModal({ title, message, buttons, type: 'warning' });
  };

  const showConfirm = (title, message, onConfirm, onCancel) => {
    showModal({
      title,
      message,
      type: 'confirm',
      buttons: [
        { text: 'Cancel', style: 'cancel', onPress: onCancel || hideModal },
        { text: 'Confirm', style: 'primary', onPress: onConfirm }
      ]
    });
  };

  return {
    modalState,
    showModal,
    hideModal,
    setLoading,
    showSuccess,
    showError,
    showWarning,
    showConfirm,
    ModalComponent: () => (
      <ModalManager
        visible={modalState.visible}
        onClose={hideModal}
        title={modalState.title}
        message={modalState.message}
        buttons={modalState.buttons}
        loading={modalState.loading}
        type={modalState.type}
      />
    )
  };
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginBottom: 24,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderColor: '#e9ecef',
  },
  cancelButtonText: {
    color: '#666',
  },
  destructiveButton: {
    backgroundColor: '#f44336',
    borderColor: '#f44336',
  },
  destructiveButtonText: {
    color: '#fff',
  },
  primaryButton: {
    backgroundColor: '#2e7d32',
    borderColor: '#2e7d32',
  },
  primaryButtonText: {
    color: '#fff',
  },
  defaultButton: {
    backgroundColor: '#2e7d32',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  defaultButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default ModalManager;