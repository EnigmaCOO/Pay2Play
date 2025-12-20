
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import GlassCard from '@shared/ui/GlassCard';

const paymentMethods = ['JazzCash', 'Easypaisa', 'Card (Visa/Mastercard)'];

const PaymentMethodSelector = () => {
    const [selected, setSelected] = useState(paymentMethods[0]);

  return (
    <GlassCard>
      <Text style={styles.title}>Choose how you want to pay</Text>
      {paymentMethods.map(method => (
          <TouchableOpacity key={method} onPress={() => setSelected(method)} style={styles.method}>
              <View style={[styles.radio, selected === method && styles.radioSelected]} />
              <Text style={styles.methodText}>{method}</Text>
          </TouchableOpacity>
      ))}
    </GlassCard>
  );
};

const styles = StyleSheet.create({
    title: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    method: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#94a3b8',
        marginRight: 12,
    },
    radioSelected: {
        borderColor: '#14b8a6',
        backgroundColor: '#14b8a6',
    },
    methodText: {
        color: '#FFFFFF',
        fontSize: 16,
    }
});

export default PaymentMethodSelector;
