
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GlassCard from '@shared/ui/GlassCard';

const BookingSummaryCard = ({ details }) => {
  return (
    <GlassCard>
      <View style={styles.row}>
        <Text style={styles.icon}>⚽</Text>
        <Text style={styles.text}>{details.sport}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.icon}>📅</Text>
        <Text style={styles.text}>{details.dateTime}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.icon}>📍</Text>
        <Text style={styles.text}>{details.venue}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.icon}>👥</Text>
        <Text style={styles.text}>Approx. {details.players} players</Text>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
    },
    icon: {
        fontSize: 18,
        marginRight: 10,
    },
    text: {
        color: '#FFFFFF',
        fontSize: 16,
    }
});

export default BookingSummaryCard;
