
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GlassCard from '../../../shared/ui/GlassCard';
import { Booking } from '@pay2play/types';

const BookingCard = ({ booking }: { booking: Booking }) => {
  const isUpcoming = new Date(booking.slotStartTime.seconds * 1000) > new Date();
  const status = isUpcoming ? 'Confirmed' : 'Completed';

  return (
    <GlassCard>
      <View style={styles.cardHeader}>
        <Text style={styles.date}>{new Date(booking.slotStartTime.seconds * 1000).toLocaleDateString()}</Text>
        <Text style={[styles.status, isUpcoming ? styles.confirmed : styles.completed]}>{status}</Text>
      </View>
      <Text style={styles.venueName}>{booking.venueName}</Text>
      <Text style={styles.details}>{booking.fieldName}</Text>
      <View style={styles.footer}>
        <Text style={styles.price}>Paid: PKR {booking.amountPkr}</Text>
        {/* Add View details button here */}
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  date: {
    color: '#94a3b8',
  },
  status: {
    fontWeight: 'bold',
  },
  confirmed: {
    color: '#14b8a6',
  },
  completed: {
    color: '#6b7280',
  },
  venueName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  details: {
    color: '#94a3b8',
    marginVertical: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  price: {
    color: 'white',
  }
});

export default BookingCard;
