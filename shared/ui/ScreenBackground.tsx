
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ScreenBackground = ({ children }) => {
  // On web, avoid expo-linear-gradient's NativeLinearGradient (which was causing
  // hook issues) and fall back to a simple solid background instead.
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {children}
        </ScrollView>
      </View>
    );
  }

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
