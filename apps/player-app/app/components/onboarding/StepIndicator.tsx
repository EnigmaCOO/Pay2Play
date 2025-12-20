
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StepIndicator = ({ current, total }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Step {current} of {total}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    paddingHorizontal: 16,
  },
  text: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: 'bold',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#475569'
  },
});

export default StepIndicator;
