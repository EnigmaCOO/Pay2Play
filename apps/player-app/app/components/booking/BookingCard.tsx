
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GlassCard from '@shared/ui/GlassCard';
import { Booking } from '@pay2play/types';

const BookingCard = ({ booking }: { booking: Booking }) => {
  const slotStart = booking.slotStartTime;
  const slotDate = slotStart ? new Date(slotStart.seconds * 1000) : null;
  const isUpcoming = slotDate ? slotDate > new Date() : false;
  const status = isUpcoming ? 'Confirmed' : 'Completed';

  const dateLabel = slotDate ? slotDate.toLocaleDateString() : 'Date TBD';
  const venueName = booking.venueName ?? 'Unknown venue';
  const fieldName = booking.fieldName ?? 'Field TBD';

  return (
    <GlassCard>
      <View style={styles.cardHeader}>
        <Text style={styles.date}>{dateLabel}</Text>
        <Text style={[styles.status, isUpcoming ? styles.confirmed : styles.completed]}>{status}</Text>
      </View>
      <Text style={styles.venueName}>{venueName}</Text>
      <Text style={styles.details}>{fieldName}</Text>
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
