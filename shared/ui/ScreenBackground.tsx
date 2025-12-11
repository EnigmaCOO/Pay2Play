
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ScreenBackground = ({ children }) => {
  return (
    <LinearGradient
      colors={['#020617', '#0b1120']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {children}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  }
});

export default ScreenBackground;
