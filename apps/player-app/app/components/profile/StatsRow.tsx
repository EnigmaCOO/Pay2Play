
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GlassCard from '@shared/ui/GlassCard';

const StatItem = ({ label, value }) => (
  <View style={styles.statItem}>
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const StatsRow = ({ stats }) => {
  const { games, venues, credits } = stats || {};
  return (
    <View style={styles.container}>
      <StatItem label="Games Played" value={games || 0} />
      <StatItem label="Venues Tried" value={venues || 0} />
      <StatItem label="Credits" value={credits || 0} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  statItem: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    width: '30%',
  },
  value: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  label: {
    color: '#94a3b8',
    fontSize: 12,
  }
});

export default StatsRow;
