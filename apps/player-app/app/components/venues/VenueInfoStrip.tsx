
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GlassCard from '../../../../shared/ui/GlassCard';

const VenueInfoStrip = ({ rating, price, discount }) => {
  return (
    <GlassCard>
      <View style={styles.strip}>
        <Text style={styles.text}>★ {rating}</Text>
        <Text style={styles.text}>From PKR {price}/hr</Text>
        <Text style={styles.text}>Save up to {discount}</Text>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  strip: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
});

export default VenueInfoStrip;
