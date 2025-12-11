
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GlassCard from '../../../../shared/ui/GlassCard';

const EventMiniCard = () => {
  return (
    <GlassCard>
        <View style={styles.card}>
            <Text style={styles.title}>Ramzan Night League</Text>
            <Text style={styles.date}>Feb 10 – Mar 05</Text>
        </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
    card: {
        width: 200,
        marginRight: 10,
    },
  title: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  date: {
    color: '#94a3b8',
    marginTop: 4,
  }
});

export default EventMiniCard;
