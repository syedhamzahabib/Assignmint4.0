import React from 'react';
import { StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../constants';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: any;
}

const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = COLORS.text,
  style,
}) => {
  return (
    <Ionicons
      name={name as any}
      size={size}
      color={color}
      style={style}
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
  },
});

// Export icon names for easy access
export const Icons = {
  // Navigation
  home: 'home',
  'home-outline': 'home-outline',
  search: 'search',
  'search-outline': 'search-outline',
  settings: 'settings',
  'settings-outline': 'settings-outline',
  profile: 'person',
  'profile-outline': 'person-outline',
  notifications: 'notifications',
  'notifications-outline': 'notifications-outline',
  messages: 'chatbubble',
  'messages-outline': 'chatbubble-outline',
  back: 'arrow-back',
  close: 'close',
  menu: 'menu',
  'arrow-forward': 'arrow-forward',

  // Actions
  edit: 'create',
  'edit-outline': 'create-outline',
  delete: 'trash',
  'delete-outline': 'trash-outline',
  save: 'save',
  'save-outline': 'save-outline',
  upload: 'cloud-upload',
  'upload-outline': 'cloud-upload-outline',
  download: 'download',
  'download-outline': 'download-outline',
  refresh: 'refresh',
  'refresh-outline': 'refresh-outline',
  check: 'checkmark',
  'check-outline': 'checkmark-outline',
  add: 'add',
  'add-outline': 'add-outline',
  'add-circle': 'add-circle',
  'add-circle-outline': 'add-circle-outline',

  // Categories
  math: 'calculator',
  'math-outline': 'calculator-outline',
  coding: 'code',
  'coding-outline': 'code-outline',
  writing: 'create',
  'writing-outline': 'create-outline',
  design: 'color-palette',
  'design-outline': 'color-palette-outline',
  language: 'language',
  'language-outline': 'language-outline',
  chemistry: 'flask',
  'chemistry-outline': 'flask-outline',
  physics: 'nuclear',
  'physics-outline': 'nuclear-outline',
  business: 'business',
  'business-outline': 'business-outline',
  psychology: 'bulb',
  'psychology-outline': 'bulb-outline',
  statistics: 'analytics',
  'statistics-outline': 'analytics-outline',
  science: 'flask',
  'science-outline': 'flask-outline',
  biology: 'leaf',
  'biology-outline': 'leaf-outline',
  history: 'library',
  'history-outline': 'library-outline',
  engineering: 'construct',
  'engineering-outline': 'construct-outline',
  art: 'color-palette',
  'art-outline': 'color-palette-outline',

  // UI Elements
  help: 'help-circle',
  'help-outline': 'help-circle-outline',
  info: 'information-circle',
  'info-outline': 'information-circle-outline',
  warning: 'warning',
  'warning-outline': 'warning-outline',
  error: 'close-circle',
  'error-outline': 'close-circle-outline',
  success: 'checkmark-circle',
  'success-outline': 'checkmark-circle-outline',
  star: 'star',
  'star-outline': 'star-outline',
  heart: 'heart',
  'heart-outline': 'heart-outline',
  like: 'thumbs-up',
  'like-outline': 'thumbs-up-outline',
  share: 'share',
  'share-outline': 'share-outline',
  copy: 'copy',
  'copy-outline': 'copy-outline',
  calendar: 'calendar',
  'calendar-outline': 'calendar-outline',
  clock: 'time',
  'clock-outline': 'time-outline',
  timer: 'timer',
  'timer-outline': 'timer-outline',
  flag: 'flag',
  'flag-outline': 'flag-outline',

  // Communication
  email: 'mail',
  'email-outline': 'mail-outline',
  phone: 'call',
  'phone-outline': 'call-outline',
  video: 'videocam',
  'video-outline': 'videocam-outline',
  camera: 'camera',
  'camera-outline': 'camera-outline',
  image: 'image',
  'image-outline': 'image-outline',
  file: 'document',
  'file-outline': 'document-outline',
  attachment: 'attach',
  'attachment-outline': 'attach-outline',

  // AI & Tech
  ai: 'sparkles',
  'ai-outline': 'sparkles-outline',
  robot: 'hardware-chip',
  'robot-outline': 'hardware-chip-outline',
  brain: 'bulb',
  'brain-outline': 'bulb-outline',
  chip: 'hardware-chip',
  'chip-outline': 'hardware-chip-outline',
  network: 'globe',
  'network-outline': 'globe-outline',
  cloud: 'cloud',
  'cloud-outline': 'cloud-outline',
  database: 'server',
  'database-outline': 'server-outline',

  // Payment & Finance
  money: 'cash',
  'money-outline': 'cash-outline',
  card: 'card',
  'card-outline': 'card-outline',
  cash: 'cash',
  'cash-outline': 'cash-outline',
  wallet: 'wallet',
  'wallet-outline': 'wallet-outline',
  bank: 'business',
  'bank-outline': 'business-outline',
  payment: 'card',
  'payment-outline': 'card-outline',

  // Social
  users: 'people',
  'users-outline': 'people-outline',
  user: 'person',
  'user-outline': 'person-outline',
  group: 'people',
  'group-outline': 'people-outline',
  team: 'people',
  'team-outline': 'people-outline',
  community: 'people',
  'community-outline': 'people-outline',

  // Status
  online: 'ellipse',
  'online-outline': 'ellipse-outline',
  offline: 'close-circle',
  'offline-outline': 'close-circle-outline',
  busy: 'time',
  'busy-outline': 'time-outline',
  away: 'ellipse',
  'away-outline': 'ellipse-outline',

  // Tasks
  briefcase: 'briefcase',
  'briefcase-outline': 'briefcase-outline',
  task: 'checkbox',
  'task-outline': 'checkbox-outline',
  list: 'list',
  'list-outline': 'list-outline',

  // Additional icons for missing references
  book: 'book',
  'book-outline': 'book-outline',
  document: 'document',
  'document-outline': 'document-outline',
  send: 'send',
  'send-outline': 'send-outline',
  more: 'ellipsis-horizontal',
  'more-outline': 'ellipsis-horizontal-outline',
  calculator: 'calculator',
  'calculator-outline': 'calculator-outline',
  library: 'library',
  'library-outline': 'library-outline',
  school: 'school',
  'school-outline': 'school-outline',
  graduation: 'school',
  'graduation-outline': 'school-outline',
  chat: 'chatbubble',
  'chat-outline': 'chatbubble-outline',
  message: 'mail',
  'message-outline': 'mail-outline',
  call: 'call',
  'call-outline': 'call-outline',
  folder: 'folder',
  'folder-outline': 'folder-outline',
  pdf: 'document',
  'pdf-outline': 'document-outline',
  deadline: 'time',
  'deadline-outline': 'time-outline',
  priority: 'flag',
  'priority-outline': 'flag-outline',
  loading: 'reload',
  'loading-outline': 'reload-outline',
  analytics: 'analytics',
  'analytics-outline': 'analytics-outline',
  link: 'link',
  'link-outline': 'link-outline',
  filter: 'filter',
  'filter-outline': 'filter-outline',
  sort: 'funnel',
  'sort-outline': 'funnel-outline',

  // Additional missing icons
  apps: 'apps',
  'apps-outline': 'apps-outline',
  logo: 'logo-apple',
  'logo-outline': 'logo-apple-outline',
  shield: 'shield-checkmark',
  'shield-outline': 'shield-checkmark-outline',
  people: 'people',
  'people-outline': 'people-outline',
  flash: 'flash',
  'flash-outline': 'flash-outline',
  time: 'time',
  'time-outline': 'time-outline',
  checkmark: 'checkmark',
  'checkmark-outline': 'checkmark-outline',
  arrowBack: 'arrow-back',
  'arrow-back-outline': 'arrow-back-outline',

  // Default fallback
  default: 'help-circle',
  'default-outline': 'help-circle-outline',
};

export default Icon;
