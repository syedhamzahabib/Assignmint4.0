import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';

const FilterModal = ({ 
  visible, 
  onClose, 
  onApplyFilters, 
  currentFilters,
  isRequester = true 
}) => {
  const [filters, setFilters] = useState(currentFilters);
  const [searchQuery, setSearchQuery] = useState(currentFilters.search || '');

  // Status options based on role
  const requesterStatuses = [
    { value: 'all', label: 'All Status', icon: '📋' },
    { value: 'in_progress', label: 'In Progress', icon: '🔄' },
    { value: 'pending_review', label: 'Pending Review', icon: '⏳' },
    { value: 'completed', label: 'Completed', icon: '✅' },
    { value: 'awaiting_expert', label: 'Finding Expert', icon: '👀' },
    { value: 'disputed', label: 'Disputed', icon: '⚠️' },
    { value: 'cancelled', label: 'Cancelled', icon: '❌' },
  ];

  const expertStatuses = [
    { value: 'all', label: 'All Status', icon: '📋' },
    { value: 'working', label: 'Working', icon: '🔨' },
    { value: 'delivered', label: 'Delivered', icon: '📤' },
    { value: 'payment_received', label: 'Payment Received', icon: '💰' },
    { value: 'revision_requested', label: 'Revision Requested', icon: '🔄' },
  ];

  const sortOptions = [
    { value: 'due_date_asc', label: 'Due Date (Closest First)', icon: '📅' },
    { value: 'due_date_desc', label: 'Due Date (Furthest First)', icon: '📅' },
    { value: 'price_desc', label: 'Price (High to Low)', icon: '💰' },
    { value: 'price_asc', label: 'Price (Low to High)', icon: '💰' },
    { value: 'recent', label: 'Recently Posted', icon: '🕒' },
  ];

  const urgencyOptions = [
    { value: 'all', label: 'All Urgency', icon: '📋' },
    { value: 'high', label: 'High Priority', icon: '🔥' },
    { value: 'medium', label: 'Medium Priority', icon: '⚡' },
    { value: 'low', label: 'Low Priority', icon: '🌱' },
  ];

  const statusOptions = isRequester ? requesterStatuses : expertStatuses;

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApply = () => {
    const finalFilters = {
      ...filters,
      search: searchQuery.trim()
    };
    onApplyFilters(finalFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      status: 'all',
      sortBy: 'due_date_asc',
      urgency: 'all',
      search: ''
    };
    setFilters(resetFilters);
    setSearchQuery('');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.status !== 'all') count++;
    if (filters.sortBy !== 'due_date_asc') count++;
    if (filters.urgency !== 'all') count++;
    if (searchQuery.trim()) count++;
    return count;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.title}>Filter & Sort</Text>
              {getActiveFiltersCount() > 0 && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>{getActiveFiltersCount()}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Search */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🔍 Search Tasks</Text>
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by title, subject, or person..."
                  placeholderTextColor="#999"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity 
                    onPress={() => setSearchQuery('')}
                    style={styles.clearSearch}
                  >
                    <Text style={styles.clearSearchText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Status Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📊 Filter by Status</Text>
              <View style={styles.optionsGrid}>
                {statusOptions.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.option,
                      filters.status === option.value && styles.selectedOption
                    ]}
                    onPress={() => updateFilter('status', option.value)}
                  >
                    <Text style={styles.optionIcon}>{option.icon}</Text>
                    <Text style={[
                      styles.optionText,
                      filters.status === option.value && styles.selectedOptionText
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Sort Options */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🔄 Sort by</Text>
              <View style={styles.optionsGrid}>
                {sortOptions.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.option,
                      filters.sortBy === option.value && styles.selectedOption
                    ]}
                    onPress={() => updateFilter('sortBy', option.value)}
                  >
                    <Text style={styles.optionIcon}>{option.icon}</Text>
                    <Text style={[
                      styles.optionText,
                      filters.sortBy === option.value && styles.selectedOptionText
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Urgency Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>⚡ Filter by Priority</Text>
              <View style={styles.optionsGrid}>
                {urgencyOptions.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.option,
                      filters.urgency === option.value && styles.selectedOption
                    ]}
                    onPress={() => updateFilter('urgency', option.value)}
                  >
                    <Text style={styles.optionIcon}>{option.icon}</Text>
                    <Text style={[
                      styles.optionText,
                      filters.urgency === option.value && styles.selectedOptionText
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Bottom spacing */}
            <View style={styles.bottomSpacer} />
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.resetButton} 
              onPress={handleReset}
            >
              <Text style={styles.resetButtonText}>Reset All</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.applyButton} 
              onPress={handleApply}
            >
              <Text style={styles.applyButtonText}>
                Apply Filters {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    marginRight: 8,
  },
  filterBadge: {
    backgroundColor: '#2e7d32',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
  },
  clearSearch: {
    padding: 4,
  },
  clearSearchText: {
    fontSize: 14,
    color: '#999',
    fontWeight: 'bold',
  },
  optionsGrid: {
    gap: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: '#e8f5e8',
    borderColor: '#2e7d32',
  },
  optionIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  optionText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#2e7d32',
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 20,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 12,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  resetButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  applyButton: {
    flex: 2,
    backgroundColor: '#2e7d32',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#2e7d32',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  applyButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default FilterModal;