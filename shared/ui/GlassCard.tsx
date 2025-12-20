
import React from 'react';
import { View, StyleSheet } from 'react-native';

const GlassCard = ({ children }) => {
  return (
    <View style={styles.card}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.5)',
  },
});

export default GlassCard;
