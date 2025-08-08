// screens/UploadDeliveryScreen.js - Enhanced with Manual Match integration and ActionLoadingOverlay

import React, { useState, useEffect } from 'react';
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
  Animated,
  Platform,
} from 'react-native';
import { TasksAPI } from '../api/tasks';
import firestoreService from '../services/FirestoreService';
import FilePicker from '../utils/FilePicker';
import ErrorBoundary from '../components/common/ErrorBoundary';
import LoadingScreen, { ActionLoadingOverlay } from '../components/common/LoadingScreen';

const UploadDeliveryScreen = ({ route, navigation }) => {
  const { task } = route.params || {};
  
  const [deliveryFiles, setDeliveryFiles] = useState([]);
  const [deliveryMessage, setDeliveryMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [taskDetails, setTaskDetails] = useState(task || null);
  const [loading, setLoading] = useState(!task);

  // Mock user ID - replace with actual auth
  const userId = 'expert123';

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Load full task details if not provided
    if (!task && route.params?.taskId) {
      loadTaskDetails(route.params.taskId);
    }
  }, []);

  // Load task details for Manual Match tasks
  const loadTaskDetails = async (taskId) => {
    try {
      setLoading(true);
      const response = await firestoreService.getTaskById(taskId);
      
      if (response.success) {
        setTaskDetails(response.data);
        
        // Verify expert is assigned to this task
        if (response.data.assignedExpertId !== userId) {
          Alert.alert(
            'Access Denied',
            'You are not assigned to this task.',
            [{ text: 'OK', onPress: () => navigation.goBack() }]
          );
          return;
        }
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to load task details:', error);
      Alert.alert(
        'Error',
        'Failed to load task details. Please try again.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } finally {
      setLoading(false);
    }
  };

  // Safety check for task
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2e7d32" />
          <Text style={styles.loadingText}>Loading task details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!taskDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>📤 Upload Delivery</Text>
          <View style={styles.headerRight} />
        </View>
        
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>❌</Text>
          <Text style={styles.errorTitle}>No Task Found</Text>
          <Text style={styles.errorText}>Unable to load task information.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // File picker integration
  const handleFilePicker = async () => {
    try {
      const selectedFiles = await FilePicker.pickFiles();
      
      if (selectedFiles.length > 0) {
        // Validate files using FilePicker utility
        const validFiles = selectedFiles.filter(file => {
          if (!FilePicker.isValidFileType(file.name)) {
            Alert.alert('Invalid File Type', `${file.name} is not a supported file type`);
            return false;
          }
          if (!FilePicker.isValidFileSize(file.rawSize, 10)) {
            Alert.alert('File Too Large', `${file.name} exceeds 10MB limit`);
            return false;
          }
          return true;
        });

        if (validFiles.length === 0) {
          return;
        }

        // Check total size including existing files
        const allFiles = [...deliveryFiles, ...validFiles];
        const sizeValidation = FilePicker.validateTotalSize(allFiles, 50);
        
        if (!sizeValidation.isValid) {
          Alert.alert(
            'Total Size Exceeded', 
            `Total size (${sizeValidation.totalSize}) would exceed ${sizeValidation.maxSize} limit. Please remove some files or choose smaller files.`
          );
          return;
        }

        // Add valid files
        setDeliveryFiles(prev => [...prev, ...validFiles]);
        simulateUploadProgress();
        
        Alert.alert(
          '📁 Files Added',
          `Successfully added ${validFiles.length} file(s) to your delivery.`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('File Selection Error', error.message);
    }
  };

  // Camera picker for images
  const handleImagePicker = async () => {
    try {
      const selectedImages = await FilePicker.pickImageFromCamera();
      
      if (selectedImages.length > 0) {
        // Check total size
        const allFiles = [...deliveryFiles, ...selectedImages];
        const sizeValidation = FilePicker.validateTotalSize(allFiles, 50);
        
        if (!sizeValidation.isValid) {
          Alert.alert(
            'Total Size Exceeded', 
            `Adding images would exceed ${sizeValidation.maxSize} limit.`
          );
          return;
        }

        setDeliveryFiles(prev => [...prev, ...selectedImages]);
        simulateUploadProgress();
        
        Alert.alert('📷 Image Added', 'Image successfully added to your delivery.');
      }
    } catch (error) {
      Alert.alert('Camera Error', error.message);
    }
  };

  // Enhanced file picker with multiple options
  const showFilePickerOptions = () => {
    Alert.alert(
      '📁 Add Files',
      'Choose how you want to add files to your delivery:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: '📁 Browse Files', 
          onPress: handleFilePicker
        },
        { 
          text: '📷 Take Photo', 
          onPress: handleImagePicker
        },
        { 
          text: '🎯 Quick Add', 
          onPress: () => showQuickAddOptions()
        },
      ]
    );
  };

  // Quick add options for common file types
  const showQuickAddOptions = () => {
    Alert.alert(
      '🎯 Quick Add Common Files',
      'Add typical files for your subject:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: taskDetails.subject === 'Math' ? '📊 Math Solutions' : '📄 Documents', 
          onPress: () => addQuickFiles('documents')
        },
        { 
          text: taskDetails.subject === 'Coding' ? '💻 Code Files' : '🖼️ Images', 
          onPress: () => addQuickFiles('code')
        },
        { 
          text: '📁 Browse All Files', 
          onPress: handleFilePicker
        },
      ]
    );
  };

  // Add common file types based on subject
  const addQuickFiles = (type) => {
    const mockFiles = {
      documents: [
        {
          id: `quick_${Date.now()}_1`,
          name: `${taskDetails.subject.toLowerCase()}_solution.pdf`,
          size: FilePicker.formatFileSize(2400000),
          type: 'pdf',
          uploadTime: new Date().toISOString(),
          category: FilePicker.categorizeFile('pdf'),
          rawSize: 2400000,
          uri: 'mock://solution.pdf'
        }
      ],
      code: [
        {
          id: `quick_${Date.now()}_2`,
          name: taskDetails.subject === 'Coding' ? 'solution.py' : 'analysis.py',
          size: FilePicker.formatFileSize(15200),
          type: 'py',
          uploadTime: new Date().toISOString(),
          category: FilePicker.categorizeFile('py'),
          rawSize: 15200,
          uri: 'mock://code.py'
        }
      ]
    };

    const newFiles = mockFiles[type] || mockFiles.documents;
    setDeliveryFiles(prev => [...prev, ...newFiles]);
    simulateUploadProgress();
  };

  // Helper functions
  const calculateDaysLeft = (dueDate) => {
    if (!dueDate) return { text: 'No due date', isNormal: true };
    
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: `${Math.abs(diffDays)} days overdue`, isOverdue: true };
    if (diffDays === 0) return { text: 'Due today', isUrgent: true };
    if (diffDays === 1) return { text: '1 day left', isUrgent: true };
    return { text: `${diffDays} days left`, isNormal: true };
  };

  const getSubjectColor = (subject) => {
    const colors = {
      'Math': '#3f51b5',
      'Coding': '#00796b',
      'Writing': '#d84315',
      'Design': '#6a1b9a',
      'Language': '#00838f',
      'Chemistry': '#f57f17',
      'Physics': '#1976d2',
      'Business': '#388e3c',
      'Psychology': '#7b1fa2'
    };
    return colors[subject] || '#9e9e9e';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const daysLeftInfo = calculateDaysLeft(taskDetails.deadline);
  const subjectColor = getSubjectColor(taskDetails.subject);

  // Upload progress simulation
  const simulateUploadProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 150);
  };

  // Remove file with confirmation
  const removeFile = (fileId) => {
    const file = deliveryFiles.find(f => f.id === fileId);
    Alert.alert(
      'Remove File',
      `Remove "${file.name}" from your delivery?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            setDeliveryFiles(prev => prev.filter(file => file.id !== fileId));
          }
        }
      ]
    );
  };

  // Enhanced message templates for Manual Match
  const messageTemplates = [
    {
      id: 'manual_standard',
      title: '✅ Manual Match Completion',
      message: `Hi ${taskDetails.requesterName || 'there'}! I was excited to work on your "${taskDetails.title}" task that you posted on the expert marketplace. I've completed all requirements as specified and believe the solution meets your expectations. Please find the deliverable files attached. I chose to work on this task because it aligns perfectly with my expertise in ${taskDetails.subject}. Please review and let me know if you need any clarifications!`
    },
    {
      id: 'manual_early',
      title: '⚡ Early Manual Match Delivery',
      message: `Great news! I've completed your "${taskDetails.title}" task ahead of schedule. As an expert who specifically chose to work on your assignment from the marketplace, I wanted to deliver exceptional results. The solution exceeds the basic requirements and includes additional insights that might be helpful. I'm proud to have been selected for this manual match task!`
    },
    {
      id: 'manual_revision',
      title: '🔄 Manual Match Revision',
      message: `Thank you for your detailed feedback on the "${taskDetails.title}" task. As the expert you selected for this manual match assignment, I've carefully addressed all your points and made the necessary revisions. I appreciate your trust in choosing me from the available experts, and I believe this updated version better meets your expectations. Please let me know if any further adjustments are needed.`
    }
  ];

  // Handle delivery submission with Manual Match integration
  const handleSubmitDelivery = async () => {
    // Enhanced validation
    if (deliveryFiles.length === 0) {
      Alert.alert(
        'No Files Selected', 
        'Please add at least one file to your delivery before submitting.',
        [{ text: 'Add Files', onPress: showFilePickerOptions }]
      );
      return;
    }

    // Final size validation
    const sizeValidation = FilePicker.validateTotalSize(deliveryFiles, 50);
    if (!sizeValidation.isValid) {
      Alert.alert(
        'Files Too Large',
        `Total file size (${sizeValidation.totalSize}) exceeds the 50MB limit. Please remove some files or compress them.`,
        [{ text: 'OK' }]
      );
      return;
    }

    if (deliveryMessage.trim().length < 10) {
      Alert.alert(
        'Delivery Message Required',
        'A brief message helps the requester understand your delivery. Please add at least 10 characters.',
        [
          { text: 'Skip Message', onPress: () => submitDelivery() },
          { text: 'Add Message', style: 'cancel' }
        ]
      );
      return;
    }

    submitDelivery();
  };

  const submitDelivery = async () => {
    try {
      setUploading(true);

      // Get total size for reporting
      const sizeValidation = FilePicker.validateTotalSize(deliveryFiles, 50);
      
      const deliveryData = {
        files: deliveryFiles.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type,
          category: file.category,
          uploadTime: file.uploadTime
        })),
        message: deliveryMessage.trim() || 'Delivery completed as requested.',
        deliveryDate: new Date().toISOString(),
        totalFiles: deliveryFiles.length,
        totalSize: sizeValidation.totalSize,
        fileCategories: [...new Set(deliveryFiles.map(f => f.category))],
        // Manual Match specific data
        isManualMatch: taskDetails.matchingType === 'manual',
        expertId: userId,
        expertName: 'Current Expert', // Replace with actual expert name
      };

      console.log('📤 Submitting delivery:', deliveryData);
      console.log('📁 File details:', deliveryFiles.map(f => ({ 
        name: f.name, 
        size: f.rawSize, 
        category: f.category,
        type: f.type
      })));

      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Submit through Firestore service for Manual Match tasks
      const response = await firestoreService.submitTaskDelivery(
        taskDetails.id,
        userId,
        deliveryData
      );

      if (response.success) {
        // Enhanced success message for Manual Match
        Alert.alert(
          '🎉 Delivery Uploaded Successfully!',
          `Your work for "${taskDetails.title}" has been delivered!\n\n✅ ${deliveryFiles.length} file(s) uploaded\n📦 Total size: ${sizeValidation.totalSize}\n📝 Delivery message sent\n⏰ Delivered ${daysLeftInfo.isOverdue ? 'late' : daysLeftInfo.isUrgent ? 'on time' : 'early'}\n${taskDetails.matchingType === 'manual' ? '\n🎯 Manual Match task completed!' : ''}\n\n${taskDetails.requesterName || 'The requester'} will be notified and can now review your work.`,
          [
            {
              text: 'View My Tasks',
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Home' }],
                });
              }
            },
            {
              text: 'Done',
              style: 'default',
              onPress: () => navigation.goBack()
            }
          ]
        );
      }
    } catch (error) {
      console.error('❌ Delivery upload failed:', error);
      Alert.alert(
        'Upload Failed',
        error.message || 'Failed to upload your delivery. Please check your connection and try again.',
        [
          { text: 'Retry', onPress: handleSubmitDelivery },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Drag and drop support for web
  const handleDragOver = Platform.OS === 'web' ? (e) => {
    e.preventDefault();
    e.stopPropagation();
  } : undefined;

  const handleDrop = Platform.OS === 'web' ? async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      // Process dropped files using FilePicker utility
      const processedFiles = files.map((file, index) => ({
        id: `dropped_${Date.now()}_${index}`,
        name: file.name,
        size: FilePicker.formatFileSize(file.size),
        type: file.name.split('.').pop().toLowerCase(),
        uploadTime: new Date().toISOString(),
        category: FilePicker.categorizeFile(file.name.split('.').pop().toLowerCase()),
        file: file,
        rawSize: file.size,
        uri: URL.createObjectURL(file)
      }));

      // Validate dropped files
      const validFiles = processedFiles.filter(file => {
        if (!FilePicker.isValidFileType(file.name)) {
          Alert.alert('Invalid File Type', `${file.name} is not supported`);
          return false;
        }
        if (!FilePicker.isValidFileSize(file.rawSize, 10)) {
          Alert.alert('File Too Large', `${file.name} exceeds 10MB limit`);
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        // Check total size
        const allFiles = [...deliveryFiles, ...validFiles];
        const sizeValidation = FilePicker.validateTotalSize(allFiles, 50);
        
        if (!sizeValidation.isValid) {
          Alert.alert(
            'Total Size Exceeded', 
            `Dropping these files would exceed ${sizeValidation.maxSize} limit.`
          );
          return;
        }

        setDeliveryFiles(prev => [...prev, ...validFiles]);
        simulateUploadProgress();
        
        Alert.alert(
          '📁 Files Dropped',
          `Successfully added ${validFiles.length} file(s) via drag & drop.`
        );
      }
    }
  } : undefined;

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
        {/* Enhanced Loading overlay with progress */}
        {uploading && (
          <ActionLoadingOverlay
            visible={uploading}
            message="Uploading delivery..."
            submessage={`Submitting ${deliveryFiles.length} file(s) and delivery message...`}
            progress={uploadProgress}
            onCancel={() => {
              Alert.alert(
                'Cancel Upload',
                'Are you sure you want to cancel the upload?',
                [
                  { text: 'Continue Upload', style: 'cancel' },
                  { 
                    text: 'Cancel', 
                    style: 'destructive',
                    onPress: () => setUploading(false)
                  }
                ]
              );
            }}
          />
        )}

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>📤 Upload Delivery</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Enhanced Task Information Card for Manual Match */}
          <Animated.View style={[styles.taskInfoCard, { opacity: fadeAnim }]}>
            <View style={styles.taskHeader}>
              <View style={styles.taskTitleContainer}>
                <Text style={styles.taskTitle} numberOfLines={2}>
                  {taskDetails.title}
                </Text>
                <View style={styles.badgeContainer}>
                  <View style={[styles.subjectBadge, { backgroundColor: subjectColor }]}>
                    <Text style={styles.subjectText}>{taskDetails.subject}</Text>
                  </View>
                  {taskDetails.matchingType === 'manual' && (
                    <View style={styles.manualMatchBadge}>
                      <Text style={styles.manualMatchText}>🎯 MANUAL MATCH</Text>
                    </View>
                  )}
                </View>
              </View>
              <Text style={styles.taskPrice}>{taskDetails.price}</Text>
            </View>

            <View style={styles.taskDetails}>
              <View style={styles.taskDetailRow}>
                <Text style={styles.taskDetailLabel}>👤 Requester:</Text>
                <Text style={styles.taskDetailValue}>{taskDetails.requesterName || 'Not specified'}</Text>
              </View>
              <View style={styles.taskDetailRow}>
                <Text style={styles.taskDetailLabel}>📅 Due Date:</Text>
                <Text style={[
                  styles.taskDetailValue,
                  daysLeftInfo.isOverdue && styles.overdueText,
                  daysLeftInfo.isUrgent && styles.urgentText
                ]}>
                  {formatDate(taskDetails.deadline)} • {daysLeftInfo.text}
                </Text>
              </View>
              <View style={styles.taskDetailRow}>
                <Text style={styles.taskDetailLabel}>🎯 Assignment Type:</Text>
                <Text style={styles.taskDetailValue}>
                  {taskDetails.matchingType === 'manual' ? 'Manual Match (You were chosen!)' : 'Auto-assigned'}
                </Text>
              </View>
              {taskDetails.status === 'revision_requested' && (
                <View style={styles.revisionNotice}>
                  <Text style={styles.revisionIcon}>🔄</Text>
                  <Text style={styles.revisionText}>
                    Revision requested - please address the feedback before resubmitting
                  </Text>
                </View>
              )}
            </View>
          </Animated.View>

          {/* Enhanced File Upload Section */}
          <Animated.View style={[styles.uploadSection, { opacity: fadeAnim }]}>
            <Text style={styles.sectionTitle}>📁 Delivery Files</Text>
            <Text style={styles.sectionSubtitle}>
              Upload your completed work files • Max 50MB total • 10MB per file
            </Text>

            {/* Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <View style={styles.progressContainer}>
                <Text style={styles.progressLabel}>Processing files...</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${Math.min(uploadProgress, 100)}%` }]} />
                </View>
                <Text style={styles.progressText}>{Math.round(uploadProgress)}%</Text>
              </View>
            )}

            {/* Enhanced Upload Button with multiple options */}
            <View style={styles.uploadOptionsContainer}>
              <TouchableOpacity 
                style={[styles.uploadButton, deliveryFiles.length > 0 && styles.uploadButtonActive]}
                onPress={showFilePickerOptions}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <Text style={styles.uploadButtonIcon}>
                  {deliveryFiles.length > 0 ? '📁' : '⬆️'}
                </Text>
                <Text style={styles.uploadButtonText}>
                  {deliveryFiles.length > 0 ? 'Add More Files' : 'Click to Add Files'}
                </Text>
                <Text style={styles.uploadButtonSubtext}>
                  {Platform.OS === 'web' ? 'Or drag and drop files here' : 'Browse or take photos'}
                </Text>
                <Text style={styles.uploadButtonFormats}>
                  PDF, DOC, images, code files, archives, etc.
                </Text>
              </TouchableOpacity>

              {/* Quick action buttons */}
              <View style={styles.quickButtons}>
                <TouchableOpacity 
                  style={styles.quickButton}
                  onPress={handleFilePicker}
                >
                  <Text style={styles.quickButtonIcon}>📁</Text>
                  <Text style={styles.quickButtonText}>Browse</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.quickButton}
                  onPress={handleImagePicker}
                >
                  <Text style={styles.quickButtonIcon}>📷</Text>
                  <Text style={styles.quickButtonText}>Camera</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.quickButton}
                  onPress={() => showQuickAddOptions()}
                >
                  <Text style={styles.quickButtonIcon}>🎯</Text>
                  <Text style={styles.quickButtonText}>Quick</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Enhanced Files List */}
            {deliveryFiles.length > 0 && (
              <View style={styles.filesContainer}>
                <View style={styles.filesHeader}>
                  <Text style={styles.filesTitle}>
                    📋 Selected Files ({deliveryFiles.length})
                  </Text>
                  <Text style={styles.filesSize}>
                    Total: {FilePicker.formatFileSize(deliveryFiles.reduce((sum, file) => sum + file.rawSize, 0))}
                  </Text>
                </View>
                
                {deliveryFiles.map((file, index) => (
                  <Animated.View 
                    key={file.id}
                    style={[
                      styles.fileItem,
                      { 
                        opacity: fadeAnim,
                        transform: [{
                          translateX: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [50, 0],
                          })
                        }]
                      }
                    ]}
                  >
                    <View style={styles.fileIcon}>
                      <Text style={styles.fileIconText}>
                        {FilePicker.getFileIcon(file.type)}
                      </Text>
                    </View>
                    
                    <View style={styles.fileInfo}>
                      <Text style={styles.fileName}>{file.name}</Text>
                      <Text style={styles.fileCategory}>{file.category}</Text>
                      <View style={styles.fileMetadata}>
                        <Text style={styles.fileSize}>{file.size}</Text>
                        <Text style={styles.fileTime}>
                          • Added {new Date(file.uploadTime).toLocaleTimeString()}
                        </Text>
                      </View>
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.removeFileButton}
                      onPress={() => removeFile(file.id)}
                    >
                      <Text style={styles.removeFileText}>✕</Text>
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>
            )}
          </Animated.View>

          {/* Enhanced Message Section for Manual Match */}
          <Animated.View style={[styles.messageSection, { opacity: fadeAnim }]}>
            <Text style={styles.sectionTitle}>💬 Delivery Message</Text>
            <Text style={styles.sectionSubtitle}>
              Add a professional message about your completed work
              {taskDetails.matchingType === 'manual' && ' (Manual Match delivery)'}
            </Text>
            
            <View style={styles.messageInputContainer}>
              <TextInput
                style={styles.messageInput}
                placeholder="Add a professional message about your delivery..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={5}
                value={deliveryMessage}
                onChangeText={setDeliveryMessage}
                maxLength={500}
                textAlignVertical="top"
              />
              <View style={styles.messageInputFooter}>
                <Text style={styles.charCount}>
                  {deliveryMessage.length}/500 characters
                </Text>
                {deliveryMessage.length >= 10 && (
                  <Text style={styles.validMessage}>✓ Good message!</Text>
                )}
              </View>
            </View>

            {/* Enhanced Message Templates for Manual Match */}
            <View style={styles.templatesContainer}>
              <Text style={styles.templatesTitle}>💡 Quick Templates:</Text>
              <View style={styles.templatesGrid}>
                {messageTemplates.map((template) => (
                  <TouchableOpacity 
                    key={template.id}
                    style={styles.templateCard}
                    onPress={() => setDeliveryMessage(template.message)}
                  >
                    <Text style={styles.templateTitle}>{template.title}</Text>
                    <Text style={styles.templatePreview} numberOfLines={2}>
                      {template.message.substring(0, 80)}...
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Animated.View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Enhanced Fixed Bottom Submit Button */}
        <Animated.View style={[styles.submitContainer, { opacity: fadeAnim }]}>
          <View style={styles.submitSummary}>
            <Text style={styles.submitSummaryText}>
              📁 {deliveryFiles.length} file(s) • 💬 {deliveryMessage.length > 10 ? 'Message ready' : 'Add message'} • {daysLeftInfo.isOverdue ? '⚠️ Late' : daysLeftInfo.isUrgent ? '⏰ Due today' : '✅ On time'}
              {taskDetails.matchingType === 'manual' && ' • 🎯 Manual Match'}
            </Text>
            {deliveryFiles.length > 0 && (
              <Text style={styles.submitSummarySize}>
                Total size: {FilePicker.formatFileSize(deliveryFiles.reduce((sum, file) => sum + file.rawSize, 0))}
              </Text>
            )}
          </View>
          
          <TouchableOpacity 
            style={[
              styles.submitButton, 
              uploading && styles.submitButtonDisabled,
              deliveryFiles.length === 0 && styles.submitButtonInactive
            ]}
            onPress={handleSubmitDelivery}
            disabled={uploading || deliveryFiles.length === 0}
          >
            {uploading ? (
              <View style={styles.submitButtonContent}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.submitButtonText}>Uploading... {Math.round(uploadProgress)}%</Text>
              </View>
            ) : (
              <View style={styles.submitButtonContent}>
                <Text style={styles.submitButtonIcon}>📤</Text>
                <Text style={styles.submitButtonText}>
                  {taskDetails.status === 'revision_requested' ? 'Submit Revision' : 
                   taskDetails.matchingType === 'manual' ? 'Deliver Manual Match Task' : 'Upload & Deliver'}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f5f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
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
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
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
  
  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Enhanced Task Info Card with Manual Match support
  taskInfoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  taskTitleContainer: {
    flex: 1,
    marginRight: 16,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
    lineHeight: 24,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  subjectBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  subjectText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // NEW - Manual Match badge
  manualMatchBadge: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  manualMatchText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  taskPrice: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2e7d32',
  },
  taskDetails: {
    gap: 8,
  },
  taskDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskDetailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  taskDetailValue: {
    fontSize: 14,
    color: '#111',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 8,
  },
  overdueText: {
    color: '#f44336',
  },
  urgentText: {
    color: '#ff9800',
  },
  revisionNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3e0',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },
  revisionIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  revisionText: {
    fontSize: 13,
    color: '#f57c00',
    flex: 1,
    fontWeight: '500',
  },

  // Upload Section
  uploadSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
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
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  
  // Progress
  progressContainer: {
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4caf50',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    fontWeight: '600',
  },
  
  // Upload Options
  uploadOptionsContainer: {
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  uploadButtonActive: {
    backgroundColor: '#f8fff8',
    borderColor: '#2e7d32',
    borderStyle: 'solid',
  },
  uploadButtonIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  uploadButtonSubtext: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  uploadButtonFormats: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  
  // Quick Buttons
  quickButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  quickButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  quickButtonIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  quickButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  
  // Files Container
  filesContainer: {
    backgroundColor: '#f8fff8',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e8f5e8',
  },
  filesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  filesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2e7d32',
  },
  filesSize: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
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
    fontWeight: '600',
    color: '#111',
    marginBottom: 2,
  },
  fileCategory: {
    fontSize: 11,
    color: '#2e7d32',
    fontWeight: '500',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fileMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileSize: {
    fontSize: 12,
    color: '#666',
  },
  fileTime: {
    fontSize: 11,
    color: '#999',
  },
  removeFileButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffebee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeFileText: {
    fontSize: 16,
    color: '#f44336',
    fontWeight: 'bold',
  },

  // Message Section
  messageSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  messageInputContainer: {
    marginBottom: 16,
  },
  messageInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#e9ecef',
    color: '#111',
    textAlignVertical: 'top',
  },
  messageInputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  charCount: {
    fontSize: 12,
    color: '#999',
  },
  validMessage: {
    fontSize: 12,
    color: '#4caf50',
    fontWeight: '600',
  },
  
  // Templates
  templatesContainer: {
    marginTop: 8,
  },
  templatesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  templatesGrid: {
    gap: 8,
  },
  templateCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  templateTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  templatePreview: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },

  // Submit Section
  bottomSpacer: {
    height: 120,
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
  submitSummary: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  submitSummaryText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  submitSummarySize: {
    fontSize: 12,
    color: '#2e7d32',
    textAlign: 'center',
    marginTop: 2,
    fontWeight: '600',
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
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonInactive: {
    backgroundColor: '#e0e0e0',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitButtonIcon: {
    fontSize: 18,
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default UploadDeliveryScreen;
