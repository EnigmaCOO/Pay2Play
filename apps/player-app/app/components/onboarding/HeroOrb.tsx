
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HeroOrb = () => {
  // Animation would be added here
  return (
    <View style={styles.orb}>
      <Text style={styles.text}>Animated Orb</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  orb: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(20, 184, 166, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
    // Add glow/shadow effects
  },
  text: {
    color: '#FFFFFF',
    fontSize: 18,
  }
});

export default HeroOrb;
