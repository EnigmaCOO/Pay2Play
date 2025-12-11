
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AppLogoHeader = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Pay2Play</Text>
      <Text style={styles.tagline}>Pay less. Play more.</Text>
      <Text style={styles.subTagline}>Book a pitch in under 60 seconds.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tagline: {
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 8,
  },
  subTagline: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  }
});

export default AppLogoHeader;
