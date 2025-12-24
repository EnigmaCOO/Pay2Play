
import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

const SecondaryButton = ({ title, onPress, disabled }: { title: string, onPress: () => void, disabled?: boolean }) => {
  return (
    <Pressable 
      onPress={onPress} 
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        disabled && styles.disabled
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 9999,
    alignItems: 'center',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#14b8a6',
  },
  pressed: {
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
    borderColor: '#94a3b8',
  },
  text: {
    color: '#14b8a6',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Inter',
  },
});

export default SecondaryButton;
