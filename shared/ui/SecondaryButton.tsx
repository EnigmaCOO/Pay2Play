
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const SecondaryButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
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
  text: {
    color: '#14b8a6',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SecondaryButton;
