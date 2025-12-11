
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PrimaryButton from '../../../../shared/ui/PrimaryButton';

const BookingFooterBar = ({ slot, onContinue }) => {
  const time = new Date(slot.startTime.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={styles.footer}>
      <View>
        <Text style={styles.time}>Today · {time}</Text>
        <Text style={styles.price}>PKR 4,000 <Text style={styles.oldPrice}>PKR 5,000</Text></Text>
        <Text style={styles.savings}>You save PKR 1,000</Text>
      </View>
      <PrimaryButton title="Continue →" onPress={onContinue} />
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderTopWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.5)',
  },
  time: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  price: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
  },
  oldPrice: {
      textDecorationLine: 'line-through',
      color: '#94a3b8',
      fontWeight: 'normal',
  },
  savings: {
    color: '#14b8a6',
    fontSize: 12,
  },
});

export default BookingFooterBar;
