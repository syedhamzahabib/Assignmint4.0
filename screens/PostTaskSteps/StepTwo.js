import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const StepTwo = ({ formData, updateFormData, onNext, onBack, currentStep }) => {
  const handleAddImages = () => {
    Alert.alert('Image Picker', 'Image picker would open here in a real app', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Add Images', 
        onPress: () => {
          // Mock adding images
          updateFormData('images', [
            { name: 'sample_image_1.jpg', size: '2.4 MB', type: 'image' },
            { name: 'sample_image_2.png', size: '1.8 MB', type: 'image' }
          ]);
          Alert.alert('Success', '2 images added!');
        }
      }
    ]);
  };

  const handleAddFiles = () => {
    Alert.alert('File Picker', 'File picker would open here in a real app', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Add Files', 
        onPress: () => {
          // Mock adding files
          updateFormData('files', [
            { name: 'requirements.pdf', size: '856 KB', type: 'pdf' },
            { name: 'template.docx', size: '1.2 MB', type: 'document' }
          ]);
          Alert.alert('Success', '2 files added!');
        }
      }
    ]);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header - Fixed with better spacing */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Post Task (2/5)</Text>
        
        <View style={styles.headerRight} />
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Description Section */}
        <View style={styles.section}>
          <Text style={styles.label}>🖊️ Describe Your Task</Text>
          <Text style={styles.subtitle}>
            Provide clear details about what you need done
          </Text>
          <TextInput
            style={styles.textArea}
            placeholder="Type or paste description here...

Example: I need help with 5 calculus problems involving derivatives and integrals. Please show all work step by step and explain your reasoning."
            placeholderTextColor="#999"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            value={formData.description}
            onChangeText={(text) => updateFormData('description', text)}
            maxLength={1000}
          />
          <Text style={styles.charCount}>{formData.description.length}/1000</Text>
        </View>

        {/* Images Section */}
        <View style={styles.section}>
          <Text style={styles.label}>🖼️ Add Images (Optional)</Text>
          <Text style={styles.subtitle}>
            Screenshots, diagrams, or reference images
          </Text>
          <TouchableOpacity style={styles.uploadButton} onPress={handleAddImages}>
            <Text style={styles.uploadIcon}>📷</Text>
            <View style={styles.uploadTextContainer}>
              <Text style={styles.uploadText}>
                {formData.images && formData.images.length > 0 
                  ? `${formData.images.length} image(s) selected` 
                  : 'Tap to add images'
                }
              </Text>
              <Text style={styles.uploadSubtext}>
                JPG, PNG up to 10MB each
              </Text>
            </View>
          </TouchableOpacity>
          
          {/* Show selected images */}
          {formData.images && formData.images.length > 0 && (
            <View style={styles.selectedFiles}>
              <Text style={styles.selectedTitle}>Selected Images:</Text>
              {formData.images.map((image, index) => (
                <View key={index} style={styles.fileItem}>
                  <Text style={styles.fileIcon}>🖼️</Text>
                  <View style={styles.fileInfo}>
                    <Text style={styles.fileName}>{image.name}</Text>
                    <Text style={styles.fileSize}>{image.size}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => {
                      const newImages = formData.images.filter((_, i) => i !== index);
                      updateFormData('images', newImages);
                    }}
                  >
                    <Text style={styles.removeText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Files Section */}
        <View style={styles.section}>
          <Text style={styles.label}>📎 Upload Files (Optional)</Text>
          <Text style={styles.subtitle}>
            Documents, templates, or reference materials
          </Text>
          <TouchableOpacity style={styles.uploadButton} onPress={handleAddFiles}>
            <Text style={styles.uploadIcon}>📄</Text>
            <View style={styles.uploadTextContainer}>
              <Text style={styles.uploadText}>
                {formData.files && formData.files.length > 0 
                  ? `${formData.files.length} file(s) selected` 
                  : 'Tap to upload files'
                }
              </Text>
              <Text style={styles.uploadSubtext}>
                PDF, DOC, TXT up to 25MB each
              </Text>
            </View>
          </TouchableOpacity>
          
          {/* Show selected files */}
          {formData.files && formData.files.length > 0 && (
            <View style={styles.selectedFiles}>
              <Text style={styles.selectedTitle}>Selected Files:</Text>
              {formData.files.map((file, index) => (
                <View key={index} style={styles.fileItem}>
                  <Text style={styles.fileIcon}>
                    {file.type === 'pdf' ? '📄' : 
                     file.type === 'document' ? '📝' : '📎'}
                  </Text>
                  <View style={styles.fileInfo}>
                    <Text style={styles.fileName}>{file.name}</Text>
                    <Text style={styles.fileSize}>{file.size}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => {
                      const newFiles = formData.files.filter((_, i) => i !== index);
                      updateFormData('files', newFiles);
                    }}
                  >
                    <Text style={styles.removeText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>💡 Tips for better results:</Text>
          <Text style={styles.tipsText}>
            • Be specific about what you need{'\n'}
            • Include any formatting requirements{'\n'}
            • Mention your deadline if urgent{'\n'}
            • Add examples if available
          </Text>
        </View>

        {/* Bottom spacing for button */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Fixed Next Button */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity 
          style={[
            styles.nextButton,
            !formData.description.trim() && styles.disabledButton
          ]} 
          onPress={onNext}
          disabled={!formData.description.trim()}
        >
          <Text style={styles.nextButtonText}>
            Next → ({formData.description.length > 0 ? 'Ready' : 'Add description'})
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    flex: 1,
  },
  backButtonText: {
    fontSize: 16, 
    color: '#2e7d32', 
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
    textAlign: 'center',
    flex: 2,
  },
  headerRight: { 
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100, // Extra space for fixed button
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 18,
  },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    color: '#111',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#999',
  },
  uploadButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e5e5',
    borderStyle: 'dashed',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  uploadIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  uploadTextContainer: {
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  uploadSubtext: {
    fontSize: 12,
    color: '#666',
  },
  selectedFiles: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 12,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  fileIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  fileSize: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#dc3545',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tipsSection: {
    backgroundColor: '#e8f5e8',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2e7d32',
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 13,
    color: '#2e7d32',
    lineHeight: 18,
  },
  bottomSpacer: {
    height: 20,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f4f5f9',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  nextButton: {
    backgroundColor: '#2e7d32',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#2e7d32',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default StepTwo;