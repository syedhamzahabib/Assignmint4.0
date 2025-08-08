// components/FilterModal.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import { COLORS, SUBJECTS, URGENCY_LEVELS } from '../constants';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, onApply }) => {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedUrgency, setSelectedUrgency] = useState<string>('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubjectToggle = (subjectId: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleUrgencySelect = (urgency: string) => {
    setSelectedUrgency(prev => prev === urgency ? '' : urgency);
  };

  const handleApply = () => {
    const filters = {
      subjects: selectedSubjects,
      urgency: selectedUrgency,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      searchQuery: searchQuery.trim(),
    };
    onApply(filters);
  };

  const handleReset = () => {
    setSelectedSubjects([]);
    setSelectedUrgency('');
    setMinPrice('');
    setMaxPrice('');
    setSearchQuery('');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Filter Tasks</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Search */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Search</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search tasks..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Subjects */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Subjects</Text>
            <View style={styles.subjectsGrid}>
              {SUBJECTS.map(subject => (
                <TouchableOpacity
                  key={subject.id}
                  style={[
                    styles.subjectChip,
                    selectedSubjects.includes(subject.id) && styles.selectedChip
                  ]}
                  onPress={() => handleSubjectToggle(subject.id)}
                >
                  <Text style={[
                    styles.subjectChipText,
                    selectedSubjects.includes(subject.id) && styles.selectedChipText
                  ]}>
                    {subject.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Urgency */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Priority Level</Text>
            <View style={styles.urgencyContainer}>
              {URGENCY_LEVELS.map(urgency => (
                <TouchableOpacity
                  key={urgency.id}
                  style={[
                    styles.urgencyChip,
                    selectedUrgency === urgency.id && styles.selectedChip
                  ]}
                  onPress={() => handleUrgencySelect(urgency.id)}
                >
                  <Text style={[
                    styles.urgencyChipText,
                    selectedUrgency === urgency.id && styles.selectedChipText
                  ]}>
                    {urgency.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Price Range */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price Range</Text>
            <View style={styles.priceContainer}>
              <View style={styles.priceInputContainer}>
                <Text style={styles.priceLabel}>Min</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="0"
                  value={minPrice}
                  onChangeText={setMinPrice}
                  keyboardType="numeric"
                />
              </View>
              <Text style={styles.priceSeparator}>-</Text>
              <View style={styles.priceInputContainer}>
                <Text style={styles.priceLabel}>Max</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="1000"
                  value={maxPrice}
                  onChangeText={setMaxPrice}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: COLORS.textSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  subjectChip: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  subjectChipText: {
    fontSize: 14,
    color: COLORS.text,
  },
  selectedChipText: {
    color: COLORS.surface,
  },
  urgencyContainer: {
    gap: 8,
  },
  urgencyChip: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  urgencyChipText: {
    fontSize: 14,
    color: COLORS.text,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priceInputContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  priceInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  priceSeparator: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 20,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.surface,
    gap: 12,
  },
  resetButton: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  applyButton: {
    flex: 2,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.surface,
  },
});

export default FilterModal; 