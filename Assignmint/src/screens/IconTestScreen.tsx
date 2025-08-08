import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Icon, { Icons } from '../components/common/Icon';
import { COLORS } from '../constants';

const IconTestScreen: React.FC = () => {
  const iconGroups = [
    {
      title: 'Navigation & UI',
      icons: [
        { name: Icons.home, label: 'Home' },
        { name: Icons.search, label: 'Search' },
        { name: Icons.settings, label: 'Settings' },
        { name: Icons.profile, label: 'Profile' },
        { name: Icons.notifications, label: 'Notifications' },
        { name: Icons.messages, label: 'Messages' },
        { name: Icons.back, label: 'Back' },
        { name: Icons.close, label: 'Close' },
        { name: Icons.menu, label: 'Menu' },
        { name: Icons.more, label: 'More' },
      ]
    },
    {
      title: 'Actions',
      icons: [
        { name: Icons.add, label: 'Add' },
        { name: Icons.edit, label: 'Edit' },
        { name: Icons.delete, label: 'Delete' },
        { name: Icons.save, label: 'Save' },
        { name: Icons.send, label: 'Send' },
        { name: Icons.share, label: 'Share' },
        { name: Icons.download, label: 'Download' },
        { name: Icons.upload, label: 'Upload' },
        { name: Icons.refresh, label: 'Refresh' },
        { name: Icons.check, label: 'Check' },
      ]
    },
    {
      title: 'Education & Learning',
      icons: [
        { name: Icons.book, label: 'Book' },
        { name: Icons.brain, label: 'Brain' },
        { name: Icons.calculator, label: 'Calculator' },
        { name: Icons.document, label: 'Document' },
        { name: Icons.library, label: 'Library' },
        { name: Icons.school, label: 'School' },
        { name: Icons.graduation, label: 'Graduation' },
      ]
    },
    {
      title: 'Communication',
      icons: [
        { name: Icons.chat, label: 'Chat' },
        { name: Icons.message, label: 'Message' },
        { name: Icons.call, label: 'Call' },
        { name: Icons.video, label: 'Video' },
      ]
    },
    {
      title: 'Media & Files',
      icons: [
        { name: Icons.camera, label: 'Camera' },
        { name: Icons.image, label: 'Image' },
        { name: Icons.file, label: 'File' },
        { name: Icons.folder, label: 'Folder' },
        { name: Icons.attachment, label: 'Attachment' },
        { name: Icons.pdf, label: 'PDF' },
      ]
    },
    {
      title: 'Tasks & Projects',
      icons: [
        { name: Icons.task, label: 'Task' },
        { name: Icons.list, label: 'List' },
        { name: Icons.calendar, label: 'Calendar' },
        { name: Icons.clock, label: 'Clock' },
        { name: Icons.deadline, label: 'Deadline' },
        { name: Icons.priority, label: 'Priority' },
      ]
    },
    {
      title: 'Subjects',
      icons: [
        { name: Icons.math, label: 'Math' },
        { name: Icons.science, label: 'Science' },
        { name: Icons.writing, label: 'Writing' },
        { name: Icons.coding, label: 'Coding' },
        { name: Icons.design, label: 'Design' },
        { name: Icons.language, label: 'Language' },
        { name: Icons.business, label: 'Business' },
      ]
    },
    {
      title: 'Status & Feedback',
      icons: [
        { name: Icons.success, label: 'Success' },
        { name: Icons.error, label: 'Error' },
        { name: Icons.warning, label: 'Warning' },
        { name: Icons.info, label: 'Info' },
        { name: Icons.loading, label: 'Loading' },
        { name: Icons.analytics, label: 'Analytics' },
      ]
    },
    {
      title: 'Payment & Finance',
      icons: [
        { name: Icons.wallet, label: 'Wallet' },
        { name: Icons.card, label: 'Card' },
        { name: Icons.money, label: 'Money' },
        { name: Icons.payment, label: 'Payment' },
      ]
    },
    {
      title: 'Social & User',
      icons: [
        { name: Icons.user, label: 'User' },
        { name: Icons.users, label: 'Users' },
        { name: Icons.star, label: 'Star' },
        { name: Icons.heart, label: 'Heart' },
        { name: Icons.like, label: 'Like' },
      ]
    },
    {
      title: 'AI & Technology',
      icons: [
        { name: Icons.ai, label: 'AI' },
        { name: Icons.chip, label: 'Chip' },
      ]
    },
    {
      title: 'Misc',
      icons: [
        { name: Icons.help, label: 'Help' },
        { name: Icons.link, label: 'Link' },
        { name: Icons.copy, label: 'Copy' },
        { name: Icons.filter, label: 'Filter' },
        { name: Icons.sort, label: 'Sort' },
      ]
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Icon Test Screen</Text>
        <Text style={styles.headerSubtitle}>Testing vector icons on iOS</Text>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {iconGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.iconGroup}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <View style={styles.iconGrid}>
              {group.icons.map((icon, iconIndex) => (
                <View key={iconIndex} style={styles.iconItem}>
                  <Icon 
                    name={icon.name} 
                    size={24} 
                    color={COLORS.primary} 
                  />
                  <Text style={styles.iconLabel}>{icon.label}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  iconGroup: {
    margin: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  iconItem: {
    alignItems: 'center',
    width: 80,
  },
  iconLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default IconTestScreen;
