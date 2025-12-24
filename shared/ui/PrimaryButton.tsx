
import React from 'react';
import { Pressable, Text, StyleSheet, Platform, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const PrimaryButton = ({ title, onPress, disabled }: { title: string, onPress: () => void, disabled?: boolean }) => {
  const content = (
    <View style={styles.contentContainer}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );

  if (Platform.OS === 'web') {
    return (
      <Pressable 
        onPress={onPress} 
        disabled={disabled}
        style={({ pressed }) => [
          styles.buttonContainer,
          styles.webButton,
          pressed && styles.pressed,
          disabled && styles.disabled
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <Pressable 
      onPress={onPress} 
      disabled={disabled}
      style={({ pressed }) => [
        styles.buttonContainer,
        pressed && styles.pressed,
        disabled && styles.disabled
      ]}
    >
      <LinearGradient
        colors={['#14b8a6', '#059669']}
        style={styles.gradient}
      >
        {content}
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginVertical: 10,
    borderRadius: 9999,
    overflow: 'hidden',
  },
  webButton: {
    backgroundColor: '#059669',
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  gradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Inter',
  },
});

export default PrimaryButton;
