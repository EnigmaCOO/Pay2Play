
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const AppHeader = ({ title, onBack, stepIndicator }) => {
  return (
    <View style={styles.header}>
      <Pressable 
        onPress={onBack}
        style={({ pressed }) => [
          styles.backButtonContainer,
          pressed && styles.pressed
        ]}
      >
        <Text style={styles.backButton}>‹</Text>
      </Pressable>
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
  backButtonContainer: {
    padding: 8,
  },
  pressed: {
    opacity: 0.7,
  },
  backButton: {
    color: '#FFFFFF',
    fontSize: 32,
    fontFamily: 'Inter',
    lineHeight: 32,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Outfit',
  },
  stepIndicator: {
    color: '#94a3b8',
    fontSize: 14,
    fontFamily: 'Inter',
  }
});

export default AppHeader;
