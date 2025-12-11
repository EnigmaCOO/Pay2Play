
import React from 'react';
import { Text, StyleSheet } from 'react-native';

// Simple CountdownText component for demonstration
const CountdownText = () => {
    // Logic for countdown would be here
    return <Text style={styles.link}>Resend code in 00:34</Text>
}

const styles = StyleSheet.create({
  link: {
    color: '#14b8a6',
    fontWeight: 'bold',
  }
});

export default CountdownText;
