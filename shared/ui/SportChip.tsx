
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const SportChip = ({ label, selected, onPress }) => {
  return (
    <Pressable 
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.selectedChip,
        pressed && styles.pressed
      ]}
    >
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
    </Pressable>
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
  pressed: {
    opacity: 0.8,
  },
  label: {
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
  selectedLabel: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  }
});

export default SportChip;
