
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const SlotGrid = ({ slots, onSelectSlot, selectedSlot }) => {
  return (
    <View style={styles.grid}>
      {slots.map((slot) => {
        const status = slot.isBooked ? 'Booked' : 'Available';
        const time = new Date(slot.startTime.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        return (
          <TouchableOpacity 
              key={slot.id} 
              style={[
                  styles.slot, 
                  styles[status.toLowerCase()],
                  selectedSlot?.id === slot.id && styles.selected
              ]} 
              onPress={() => onSelectSlot(slot)}
              disabled={status !== 'Available'}
          >
            <Text style={styles.slotText}>{time}</Text>
          </TouchableOpacity>
        )
      })}
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
