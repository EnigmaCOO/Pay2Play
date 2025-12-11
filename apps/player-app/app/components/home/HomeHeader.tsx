
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HomeHeader = ({ userName, location }) => {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>Hey, {userName} 👋</Text>
        <Text style={styles.prompt}>Ready to play this week?</Text>
      </View>
      <View style={styles.locationChip}>
        <Text style={styles.locationText}>📍 {location}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  prompt: {
    color: '#94a3b8',
  },
  locationChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 9999,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
  },
  locationText: {
    color: '#FFFFFF',
  }
});

export default HomeHeader;
