import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
// FIXED: Import FirestoreService instead of TasksAPI
import firestoreService from '../services/FirestoreService';

const TaskActionScreen = ({ route, navigation }) => {
  const { taskId, role, action, task } = route.params;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    feedback: '',
    disputeReason: '',
    files: [],
    message: ''
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      let actionData = {};
      let validationError = null;
      
      switch (action) {
        case 'review':
          if (!formData.feedback.trim()) {
            validationError = 'Please provide feedback';
          } else {
            actionData = {
              rating: formData.rating,
              feedback: formData.feedback,
              approved: true
            };
          }
          break;
          
        case 'dispute':
          if (!formData.disputeReason.trim()) {
            validationError = 'Please provide a dispute reason';
          } else {
            actionData = {
              reason: formData.disputeReason,
              files: formData.files
            };
          }
          break;
          
        case 'upload':
          if (formData.files.length === 0) {
            validationError = 'Please select files to upload';
          } else {
            actionData = {
              files: formData.files,
              message: formData.message
            };
          }
          break;
      }

      if (validationError) {
        Alert.alert('Required Field', validationError);
        return;
      }

      // FIXED: Use firestoreService.submitTaskAction instead of TasksAPI
      const response = await firestoreService.submitTaskAction(taskId, action, role, actionData);
      
      if (response.success) {
        Alert.alert('Success', response.message, [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]);
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (action) {
      case 'review': return 'Review & Approve Task';
      case 'dispute': return 'File a Dispute';
      case 'upload': return 'Upload Delivery';
      default: return 'Task Action';
    }
  };

  const getSubmitButtonText = () => {
    switch (action) {
      case 'review': return 'Approve & Submit Review';
      case 'dispute': return 'Submit Dispute';
      case 'upload': return 'Upload Files';
      default: return 'Submit';
    }
  };

  const getRatingLabel = (rating) => {
    const labels = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent' };
    return labels[rating] || 'Good';
  };

  const renderActionContent = () => {
    switch (action) {
      case 'review':
        return (
          <>
            {/* Rating Section */}
            <View style={styles.section}>
              <Text style={styles.label}>Rating</Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map(star => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setFormData(prev => ({ ...prev, rating: star }))}
                    style={styles.starButton}
                  >
                    <Text style={[
                      styles.star,
                      star <= formData.rating && styles.starSelected
                    ]}>
                      ⭐
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.ratingText}>
                {formData.rating}/5 - {getRatingLabel(formData.rating)}
              </Text>
            </View>

            {/* Feedback Section */}
            <View style={styles.section}>
              <Text style={styles.label}>Feedback *</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Share your thoughts about the completed work..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                value={formData.feedback}
                onChangeText={(text) => setFormData(prev => ({ ...prev, feedback: text }))}
                maxLength={500}
              />
              <Text style={styles.charCount}>{formData.feedback.length}/500</Text>
            </View>
          </>
        );

      case 'dispute':
        return (
          <>
            <View style={styles.section}>
              <Text style={styles.label}>Dispute Reason *</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Describe the issue in detail..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                value={formData.disputeReason}
                onChangeText={(text) => setFormData(prev => ({ ...prev, disputeReason: text }))}
                maxLength={1000}
              />
              <Text style={styles.charCount}>{formData.disputeReason.length}/1000</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Supporting Files (Optional)</Text>
              <TouchableOpacity style={styles.fileUploadButton}>
                <Text style={styles.fileUploadIcon}>📎</Text>
                <Text style={styles.fileUploadText}>Add supporting documents</Text>
              </TouchableOpacity>
            </View>
          </>
        );

      case 'upload':
        return (
          <>
            <View style={styles.section}>
              <Text style={styles.label}>Files *</Text>
              <TouchableOpacity 
                style={styles.fileUploadButton}
                onPress={() => {
                  // Mock file selection - in real app this would open file picker
                  Alert.alert('File Picker', 'File picker would open here. For demo, adding mock files.', [
                    {
                      text: 'Cancel',
                      style: 'cancel'
                    },
                    {
                      text: 'Add Files',
                      onPress: () => {
                        setFormData(prev => ({
                          ...prev,
                          files: [
                            { name: 'completed_work.pdf', size: '2.4 MB' },
                            { name: 'additional_notes.txt', size: '1.2 KB' }
                          ]
                        }));
                      }
                    }
                  ]);
                }}
              >
                <Text style={styles.fileUploadIcon}>📁</Text>
                <Text style={styles.fileUploadText}>
                  {formData.files.length > 0 ? 'Change Files' : 'Select files to upload'}
                </Text>
              </TouchableOpacity>
              
              {formData.files.length > 0 && (
                <View style={styles.selectedFiles}>
                  <Text style={styles.filesHeader}>Selected Files:</Text>
                  {formData.files.map((file, index) => (
                    <View key={index} style={styles.fileItem}>
                      <Text style={styles.fileName}>📄 {file.name}</Text>
                      <Text style={styles.fileSize}>{file.size}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Message (Optional)</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Add a message about your delivery..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
                value={formData.message}
                onChangeText={(text) => setFormData(prev => ({ ...prev, message: text }))}
                maxLength={300}
              />
              <Text style={styles.charCount}>{formData.message.length}/300</Text>
            </View>
          </>
        );

      default:
        return (
          <View style={styles.section}>
            <Text style={styles.comingSoon}>This action is coming soon!</Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getTitle()}</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Task Info */}
        <View style={styles.taskInfo}>
          <Text style={styles.taskTitle}>{task?.title}</Text>
          <Text style={styles.taskPrice}>{task?.price}</Text>
        </View>

        {/* Action Content */}
        {renderActionContent()}

        {/* Bottom spacing for submit button */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.submitContainer}>
        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.disabledButton]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>{getSubmitButtonText()}</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f5f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  backButton: {
    fontSize: 16,
    color: '#2e7d32',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  headerRight: {
    width: 50,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  taskInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    flex: 1,
    marginRight: 12,
  },
  taskPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2e7d32',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  starButton: {
    marginRight: 4,
  },
  star: {
    fontSize: 32,
    opacity: 0.3,
  },
  starSelected: {
    opacity: 1,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    fontWeight: '500',
  },
  textArea: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#e9ecef',
    color: '#111',
    textAlignVertical: 'top',
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  fileUploadButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  fileUploadIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  fileUploadText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  selectedFiles: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
  },
  filesHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 8,
  },
  fileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  fileName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  fileSize: {
    fontSize: 12,
    color: '#666',
  },
  comingSoon: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  bottomSpacer: {
    height: 80,
  },
  submitContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 8,
    elevation: 8,
  },
  submitButton: {
    backgroundColor: '#2e7d32',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#2e7d32',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default TaskActionScreen;