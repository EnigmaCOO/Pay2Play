
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const DateChipStrip = ({ dates, selectedDate, onSelectDate }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {dates.map((date) => (
        <TouchableOpacity key={date.toISOString()} onPress={() => onSelectDate(date)}>
          <View style={[styles.chip, selectedDate.toDateString() === date.toDateString() && styles.selectedChip]}>
            <Text style={styles.dateText}>{date.getDate()}</Text>
            <Text style={styles.dayText}>{date.toLocaleDateString('en-US', { weekday: 'short' })}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  chip: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    marginHorizontal: 4,
    alignItems: 'center',
    minWidth: 60,
    borderWidth: 1,
    borderColor: '#475569'
  },
  selectedChip: {
    backgroundColor: '#14b8a6',
    borderColor: '#14b8a6',
  },
  dateText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dayText: {
    color: '#94a3b8',
    fontSize: 12,
  },
});

export default DateChipStrip;
