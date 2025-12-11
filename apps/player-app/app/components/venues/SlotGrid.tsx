
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const slots = [
    { id: '1', time: '6:00-7:00', status: 'Booked' },
    { id: '2', time: '7:00-8:00', status: 'Available' },
    { id: '3', time: '8:00-9:00', status: 'Available' },
    { id: '4', time: '9:00-10:00', status: 'Unavailable' },
];

const SlotGrid = ({ onSelectSlot, selectedSlot }) => {
  return (
    <View style={styles.grid}>
      {slots.map((slot) => (
        <TouchableOpacity 
            key={slot.id} 
            style={[
                styles.slot, 
                styles[slot.status.toLowerCase()],
                selectedSlot?.id === slot.id && styles.selected
            ]} 
            onPress={() => onSelectSlot(slot)}
            disabled={slot.status !== 'Available'}
        >
          <Text style={styles.slotText}>{slot.time}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  slot: {
    width: '48%',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
  },
  available: {
      backgroundColor: 'rgba(30, 41, 59, 0.8)',
      borderWidth: 1,
      borderColor: '#14b8a6'
  },
  booked: {
    backgroundColor: '#374151',
  },
  unavailable: {
    backgroundColor: '#1f2937',
  },
  selected: {
    backgroundColor: '#14b8a6',
    transform: [{ scale: 1.05 }]
  },
  slotText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default SlotGrid;
