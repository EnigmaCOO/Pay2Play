
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const SportChip = ({ label, selected, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.chip, selected && styles.selectedChip]}>
        <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 9999,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    margin: 4,
    borderWidth: 1,
    borderColor: '#475569',
  },
  selectedChip: {
    backgroundColor: '#14b8a6',
    borderColor: '#14b8a6',
  },
  label: {
    color: '#FFFFFF',
  },
  selectedLabel: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  }
});

export default SportChip;
