import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { COLORS } from '../../constants';

interface ModalState {
  visible: boolean;
  title?: string;
  content?: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

interface ModalManagerContext {
  showModal: (config: Omit<ModalState, 'visible'>) => void;
  hideModal: () => void;
  ModalComponent: React.ReactNode;
}

export const useModal = (): ModalManagerContext => {
  const [modalState, setModalState] = useState<ModalState>({
    visible: false,
  });

  const showModal = useCallback((config: Omit<ModalState, 'visible'>) => {
    setModalState({
      ...config,
      visible: true,
    });
  }, []);

  const hideModal = useCallback(() => {
    setModalState(prev => ({ ...prev, visible: false }));
  }, []);

  const handleConfirm = useCallback(() => {
    modalState.onConfirm?.();
    hideModal();
  }, [modalState.onConfirm, hideModal]);

  const handleCancel = useCallback(() => {
    modalState.onCancel?.();
    hideModal();
  }, [modalState.onCancel, hideModal]);

  const ModalComponent = useMemo(() => (
    <Modal
      visible={modalState.visible}
      transparent
      animationType="fade"
      onRequestClose={hideModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {modalState.title && (
            <Text style={styles.modalTitle}>{modalState.title}</Text>
          )}
          
          {modalState.content && (
            <View style={styles.modalContent}>
              {modalState.content}
            </View>
          )}
          
          <View style={styles.modalActions}>
            {modalState.onCancel && (
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>
                  {modalState.cancelText || 'Cancel'}
                </Text>
              </TouchableOpacity>
            )}
            
            {modalState.onConfirm && (
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmButtonText}>
                  {modalState.confirmText || 'Confirm'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  ), [modalState, handleConfirm, handleCancel, hideModal]);

  return {
    showModal,
    hideModal,
    ModalComponent,
  };
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalContent: {
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.lightGray,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '600',
  },
}); 