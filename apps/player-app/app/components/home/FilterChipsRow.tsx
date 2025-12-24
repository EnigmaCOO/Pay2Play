
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Chip from '@shared/ui/Chip';

interface FilterChipsRowProps {
  filters?: string[];
  selectedFilter?: string;
  onFilterChange?: (filter: string) => void;
}

const FilterChipsRow = ({ 
  filters = ['Tonight', 'This weekend', 'My sports'], 
  selectedFilter = 'Tonight',
  onFilterChange 
}: FilterChipsRowProps) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {filters.map((filter) => (
        <Chip 
          key={filter} 
          label={filter} 
          selected={selectedFilter === filter} 
          onPress={() => onFilterChange?.(filter)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  contentContainer: {
    paddingHorizontal: 16,
    gap: 8
  }
});

export default FilterChipsRow;
