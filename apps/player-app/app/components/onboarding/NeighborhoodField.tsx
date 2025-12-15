
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import GlassCard from '@shared/ui/GlassCard';
import Chip from '@shared/ui/Chip';

const popularAreas = ['DHA', 'Gulberg', 'Johar Town', 'Model Town', 'Cantt'];

const NeighborhoodField = () => {
  const [area, setArea] = useState('');

  return (
    <GlassCard>
      <Text style={styles.label}>Neighborhood</Text>
      <TextInput
        style={styles.input}
        placeholder="Type to search your area..."
        placeholderTextColor="#94a3b8"
        value={area}
        onChangeText={setArea}
      />
      <View style={styles.chipContainer}>
        {popularAreas.map(a => (
          <Chip key={a} label={a} selected={area === a} onPress={() => setArea(a)} />
        ))}
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  label: {
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    color: '#FFFFFF',
    fontSize: 16,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default NeighborhoodField;
