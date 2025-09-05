// components/taskDetails/TaskAttachmentsSection.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getFileIcon } from '../../utils/taskHelpers';

const TaskAttachmentsSection = ({ task }) => {
  const hasAttachments = task.attachments && task.attachments.length > 0;
  const hasDeliverables = task.deliverables && task.deliverables.length > 0;

  if (!hasAttachments && !hasDeliverables) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>📎 Files</Text>
      
      {/* Original Attachments */}
      {hasAttachments && (
        <View style={styles.filesCategory}>
          <Text style={styles.categoryTitle}>📁 Original Task Files</Text>
          {task.attachments.map((attachment, index) => (
            <TouchableOpacity key={index} style={styles.fileItem}>
              <View style={styles.fileIcon}>
                <Text style={styles.fileIconText}>
                  {getFileIcon(attachment.type)}
                </Text>
              </View>
              <View style={styles.fileInfo}>
                <Text style={styles.fileName}>{attachment.name}</Text>
                <Text style={styles.fileSize}>{attachment.size}</Text>
              </View>
              <Text style={styles.downloadIcon}>⬇️</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Deliverables */}
      {hasDeliverables && (
        <View style={styles.filesCategory}>
          <Text style={styles.categoryTitle}>📦 Delivered Files</Text>
          <View style={styles.deliverablesNote}>
            <Text style={styles.deliverablesNoteText}>
              ✅ Expert's completed work and deliverables
            </Text>
          </View>
          {task.deliverables.map((deliverable, index) => (
            <TouchableOpacity key={index} style={[styles.fileItem, styles.deliverableItem]}>
              <View style={styles.fileIcon}>
                <Text style={styles.fileIconText}>
                  {getFileIcon(deliverable.type)}
                </Text>
              </View>
              <View style={styles.fileInfo}>
                <Text style={styles.fileName}>{deliverable.name}</Text>
                <Text style={styles.fileSize}>{deliverable.size}</Text>
                {deliverable.uploadTime && (
                  <Text style={styles.fileTime}>
                    Delivered: {new Date(deliverable.uploadTime).toLocaleDateString()}
                  </Text>
                )}
              </View>
              <Text style={styles.downloadIcon}>⬇️</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
  },
  filesCategory: {
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  deliverablesNote: {
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#4caf50',
  },
  deliverablesNoteText: {
    fontSize: 12,
    color: '#2e7d32',
    fontWeight: '500',
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  deliverableItem: {
    backgroundColor: '#e8f5e8',
    borderColor: '#c8e6c9',
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fileIconText: {
    fontSize: 18,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    color: '#111',
    fontWeight: '500',
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 12,
    color: '#666',
  },
  fileTime: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  downloadIcon: {
    fontSize: 16,
  },
});

export default TaskAttachmentsSection;