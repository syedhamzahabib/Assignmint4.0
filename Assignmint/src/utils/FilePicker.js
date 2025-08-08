// utils/FilePicker.js - File picker utility for task deliveries
import { Alert } from 'react-native';

class FilePicker {
  // Supported file types
  static SUPPORTED_TYPES = {
    // Documents
    'pdf': { category: 'Document', icon: '📄' },
    'doc': { category: 'Document', icon: '📄' },
    'docx': { category: 'Document', icon: '📄' },
    'txt': { category: 'Document', icon: '📄' },
    'rtf': { category: 'Document', icon: '📄' },
    'odt': { category: 'Document', icon: '📄' },
    
    // Spreadsheets
    'xls': { category: 'Spreadsheet', icon: '📊' },
    'xlsx': { category: 'Spreadsheet', icon: '📊' },
    'csv': { category: 'Spreadsheet', icon: '📊' },
    'ods': { category: 'Spreadsheet', icon: '📊' },
    
    // Presentations
    'ppt': { category: 'Presentation', icon: '📊' },
    'pptx': { category: 'Presentation', icon: '📊' },
    'odp': { category: 'Presentation', icon: '📊' },
    
    // Code files
    'py': { category: 'Source Code', icon: '🐍' },
    'js': { category: 'Source Code', icon: '💻' },
    'jsx': { category: 'Source Code', icon: '⚛️' },
    'ts': { category: 'Source Code', icon: '💻' },
    'tsx': { category: 'Source Code', icon: '⚛️' },
    'html': { category: 'Source Code', icon: '🌐' },
    'css': { category: 'Source Code', icon: '🎨' },
    'java': { category: 'Source Code', icon: '☕' },
    'cpp': { category: 'Source Code', icon: '⚙️' },
    'c': { category: 'Source Code', icon: '⚙️' },
    'swift': { category: 'Source Code', icon: '🍎' },
    'kt': { category: 'Source Code', icon: '🤖' },
    'php': { category: 'Source Code', icon: '💻' },
    'rb': { category: 'Source Code', icon: '💎' },
    'go': { category: 'Source Code', icon: '💻' },
    'rust': { category: 'Source Code', icon: '🦀' },
    'sql': { category: 'Source Code', icon: '🗃️' },
    'sh': { category: 'Source Code', icon: '💻' },
    'bat': { category: 'Source Code', icon: '💻' },
    'json': { category: 'Data File', icon: '🔧' },
    'xml': { category: 'Data File', icon: '🔧' },
    'yaml': { category: 'Data File', icon: '🔧' },
    'yml': { category: 'Data File', icon: '🔧' },
    
    // Images
    'jpg': { category: 'Image', icon: '🖼️' },
    'jpeg': { category: 'Image', icon: '🖼️' },
    'png': { category: 'Image', icon: '🖼️' },
    'gif': { category: 'Image', icon: '🎞️' },
    'svg': { category: 'Image', icon: '🖼️' },
    'webp': { category: 'Image', icon: '🖼️' },
    'bmp': { category: 'Image', icon: '🖼️' },
    'tiff': { category: 'Image', icon: '🖼️' },
    
    // Archives
    'zip': { category: 'Archive', icon: '📦' },
    'rar': { category: 'Archive', icon: '📦' },
    '7z': { category: 'Archive', icon: '📦' },
    'tar': { category: 'Archive', icon: '📦' },
    'gz': { category: 'Archive', icon: '📦' },
    
    // Media
    'mp4': { category: 'Video', icon: '🎥' },
    'avi': { category: 'Video', icon: '🎥' },
    'mov': { category: 'Video', icon: '🎥' },
    'wmv': { category: 'Video', icon: '🎥' },
    'mp3': { category: 'Audio', icon: '🎵' },
    'wav': { category: 'Audio', icon: '🎵' },
    'flac': { category: 'Audio', icon: '🎵' },
    
    // Design files
    'psd': { category: 'Design', icon: '🎨' },
    'ai': { category: 'Design', icon: '🎨' },
    'sketch': { category: 'Design', icon: '🎨' },
    'fig': { category: 'Design', icon: '🎨' },
    'xd': { category: 'Design', icon: '🎨' },
    
    // Documentation
    'md': { category: 'Documentation', icon: '📋' },
    'readme': { category: 'Documentation', icon: '📋' },
  };

  // Web implementation using HTML5 File API
  static pickFilesWeb() {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.accept = Object.keys(this.SUPPORTED_TYPES).map(ext => `.${ext}`).join(',');
      
      input.onchange = (event) => {
        const files = Array.from(event.target.files);
        if (files.length > 0) {
          const processedFiles = files.map((file, index) => ({
            id: `file_${Date.now()}_${index}`,
            name: file.name,
            size: this.formatFileSize(file.size),
            type: file.name.split('.').pop().toLowerCase(),
            uploadTime: new Date().toISOString(),
            category: this.categorizeFile(file.name.split('.').pop().toLowerCase()),
            file: file,
            rawSize: file.size,
            uri: URL.createObjectURL(file)
          }));
          resolve(processedFiles);
        } else {
          resolve([]);
        }
      };
      
      input.onerror = () => {
        reject(new Error('File selection failed'));
      };
      
      input.click();
    });
  }

  // React Native implementation (requires react-native-document-picker)
  static async pickFilesNative() {
    try {
      // For React Native, you'll need to install and import:
      // npm install react-native-document-picker
      // import DocumentPicker from 'react-native-document-picker';
      
      // Mock implementation for demo
      return this.getMockFiles();
    } catch (error) {
      throw error;
    }
  }

  // Main method that chooses implementation based on platform
  static async pickFiles() {
    try {
      if (typeof window !== 'undefined' && window.document) {
        return await this.pickFilesWeb();
      } else {
        return await this.pickFilesNative();
      }
    } catch (error) {
      Alert.alert('File Selection Error', error.message);
      return [];
    }
  }

  // Camera picker for images
  static async pickImageFromCamera() {
    try {
      // For React Native, you'll need:
      // npm install react-native-image-picker
      // import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
      
      return [];
    } catch (error) {
      Alert.alert('Camera Error', error.message);
      return [];
    }
  }

  // Mock files for demo purposes
  static getMockFiles() {
    const mockFiles = [
      {
        id: `file_${Date.now()}_1`,
        name: 'solution_document.pdf',
        size: '2.4 MB',
        type: 'pdf',
        uploadTime: new Date().toISOString(),
        category: 'Document',
        rawSize: 2400000,
        uri: 'mock://file1'
      },
      {
        id: `file_${Date.now()}_2`,
        name: 'source_code.py',
        size: '15.2 KB',
        type: 'py',
        uploadTime: new Date().toISOString(),
        category: 'Source Code',
        rawSize: 15200,
        uri: 'mock://file2'
      }
    ];
    
    // Return random 1-2 files
    const numFiles = Math.floor(Math.random() * 2) + 1;
    return mockFiles.slice(0, numFiles);
  }

  // File categorization
  static categorizeFile(extension) {
    if (!extension) return 'Other File';
    
    const fileType = this.SUPPORTED_TYPES[extension.toLowerCase()];
    return fileType ? fileType.category : 'Other File';
  }

  // Format file size
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Validate file type
  static isValidFileType(filename) {
    if (!filename) return false;
    
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension && this.SUPPORTED_TYPES.hasOwnProperty(extension);
  }

  // Validate file size (in bytes)
  static isValidFileSize(size, maxSizeMB = 10) {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return size <= maxSizeBytes;
  }

  // Check total upload size
  static validateTotalSize(files, maxTotalMB = 50) {
    const totalSize = files.reduce((sum, file) => sum + (file.rawSize || 0), 0);
    const maxTotalBytes = maxTotalMB * 1024 * 1024;
    return {
      isValid: totalSize <= maxTotalBytes,
      totalSize: this.formatFileSize(totalSize),
      maxSize: this.formatFileSize(maxTotalBytes)
    };
  }

  // Get file icon
  static getFileIcon(type) {
    if (!type) return '📎';
    
    const fileType = this.SUPPORTED_TYPES[type.toLowerCase()];
    return fileType ? fileType.icon : '📎';
  }

  // Get common file types for a subject
  static getCommonFileTypes(subject) {
    const commonTypes = {
      'Math': ['pdf', 'docx', 'xlsx', 'jpg', 'png'],
      'Coding': ['py', 'js', 'html', 'css', 'java', 'cpp', 'json'],
      'Writing': ['docx', 'pdf', 'txt', 'md'],
      'Design': ['psd', 'ai', 'sketch', 'fig', 'png', 'jpg'],
      'Science': ['pdf', 'docx', 'xlsx', 'csv', 'jpg'],
      'Business': ['xlsx', 'pptx', 'pdf', 'docx', 'csv'],
      'Language': ['docx', 'pdf', 'txt', 'mp3', 'wav'],
      'Chemistry': ['pdf', 'xlsx', 'csv', 'jpg', 'png'],
      'Physics': ['pdf', 'xlsx', 'py', 'jpg', 'png'],
      'Psychology': ['pdf', 'docx', 'xlsx', 'pptx']
    };
    
    return commonTypes[subject] || ['pdf', 'docx', 'jpg', 'png'];
  }

  // Create quick files based on subject
  static createQuickFiles(subject, type = 'documents') {
    const baseTime = Date.now();
    const commonTypes = this.getCommonFileTypes(subject);
    
    if (type === 'code' && subject === 'Coding') {
      return [
        {
          id: `quick_${baseTime}_1`,
          name: 'solution.py',
          size: this.formatFileSize(15200),
          type: 'py',
          uploadTime: new Date().toISOString(),
          category: this.categorizeFile('py'),
          rawSize: 15200,
          uri: 'mock://solution.py'
        },
        {
          id: `quick_${baseTime}_2`,
          name: 'README.md',
          size: this.formatFileSize(2048),
          type: 'md',
          uploadTime: new Date().toISOString(),
          category: this.categorizeFile('md'),
          rawSize: 2048,
          uri: 'mock://readme.md'
        }
      ];
    }
    
    // Default document type
    const primaryType = commonTypes[0] || 'pdf';
    return [
      {
        id: `quick_${baseTime}_1`,
        name: `${subject.toLowerCase()}_solution.${primaryType}`,
        size: this.formatFileSize(2400000),
        type: primaryType,
        uploadTime: new Date().toISOString(),
        category: this.categorizeFile(primaryType),
        rawSize: 2400000,
        uri: `mock://solution.${primaryType}`
      }
    ];
  }

  // Batch file validation
  static validateFiles(files, options = {}) {
    const {
      maxFileSize = 10, // MB
      maxTotalSize = 50, // MB
      allowedTypes = null // null means all supported types
    } = options;
    
    const results = {
      valid: [],
      invalid: [],
      errors: []
    };
    
    for (const file of files) {
      const errors = [];
      
      // Check file type
      if (allowedTypes) {
        if (!allowedTypes.includes(file.type)) {
          errors.push(`File type '${file.type}' not allowed`);
        }
      } else if (!this.isValidFileType(file.name)) {
        errors.push(`File type '${file.type}' not supported`);
      }
      
      // Check file size
      if (!this.isValidFileSize(file.rawSize, maxFileSize)) {
        errors.push(`File size exceeds ${maxFileSize}MB limit`);
      }
      
      if (errors.length === 0) {
        results.valid.push(file);
      } else {
        results.invalid.push({ file, errors });
        results.errors.push(...errors.map(error => `${file.name}: ${error}`));
      }
    }
    
    // Check total size
    const totalSizeResult = this.validateTotalSize(results.valid, maxTotalSize);
    if (!totalSizeResult.isValid) {
      results.errors.push(`Total file size (${totalSizeResult.totalSize}) exceeds ${totalSizeResult.maxSize} limit`);
      // Move some files to invalid if total size exceeded
      while (results.valid.length > 0 && !this.validateTotalSize(results.valid, maxTotalSize).isValid) {
        const removed = results.valid.pop();
        results.invalid.push({ 
          file: removed, 
          errors: ['Removed due to total size limit'] 
        });
      }
    }
    
    return results;
  }

  // Get file preview URL (for images)
  static getPreviewUrl(file) {
    if (!file.uri || !this.isImageFile(file.type)) {
      return null;
    }
    
    return file.uri;
  }

  // Check if file is an image
  static isImageFile(type) {
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'tiff'];
    return imageTypes.includes(type?.toLowerCase());
  }

  // Check if file is a document
  static isDocumentFile(type) {
    const docTypes = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'];
    return docTypes.includes(type?.toLowerCase());
  }

  // Check if file is code
  static isCodeFile(type) {
    const codeTypes = ['py', 'js', 'jsx', 'ts', 'tsx', 'html', 'css', 'java', 'cpp', 'c', 'swift', 'kt', 'php', 'rb', 'go', 'rust', 'sql', 'sh', 'bat'];
    return codeTypes.includes(type?.toLowerCase());
  }

  // Generate file metadata
  static generateFileMetadata(file) {
    return {
      ...file,
      isImage: this.isImageFile(file.type),
      isDocument: this.isDocumentFile(file.type),
      isCode: this.isCodeFile(file.type),
      sizeInMB: (file.rawSize / (1024 * 1024)).toFixed(2),
      uploadedAt: new Date(file.uploadTime).toLocaleString(),
      previewUrl: this.getPreviewUrl(file)
    };
  }
}

export default FilePicker;