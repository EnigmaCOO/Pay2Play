
import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import GlassCard from '@shared/ui/GlassCard';

const PriceBreakdownCard = ({ details }) => {
  const total = details.basePrice - details.discount - details.credits;

  return (
    <GlassCard>
      <View style={styles.row}>
        <Text style={styles.text}>Base pitch price</Text>
        <Text style={styles.text}>PKR {details.basePrice}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.discountText}>Pay2Play discount</Text>
        <Text style={styles.discountText}>-PKR {details.discount}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Use credits ({details.credits} available)</Text>
        <Switch value={true} />
      </View>
       <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total to pay</Text>
        <Text style={styles.totalValue}>PKR {total}</Text>
      </View>
       <Text style={styles.savingsText}>You save PKR {details.discount + details.credits} today.</Text>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 8,
    },
    text: {
        color: '#FFFFFF',
    },
    discountText: {
        color: '#14b8a6',
    },
    divider: {
        height: 1,
        backgroundColor: '#475569',
        marginVertical: 10,
    },
    totalLabel: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    totalValue: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    savingsText: {
        color: '#14b8a6',
        textAlign: 'center',
        marginTop: 10,
    }
});

export default PriceBreakdownCard;
