
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FeaturePill = ({ text }) => {
  return (
    <View style={styles.pill}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 9999,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.5)',
  },
  text: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default FeaturePill;
