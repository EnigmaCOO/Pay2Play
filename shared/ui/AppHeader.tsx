
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const AppHeader = ({ title, onBack, stepIndicator }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.backButton}>‹</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      {stepIndicator && <Text style={styles.stepIndicator}>{stepIndicator}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    height: 60,
  },
  backButton: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  stepIndicator: {
    color: '#94a3b8',
    fontSize: 14,
  }
});

export default AppHeader;
