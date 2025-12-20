
import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';

const OtpInputRow = ({ otp, setOtp }) => {
  // This is a simplified version. A real implementation would use individual inputs
  // and manage focus between them.
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        maxLength={6}
        keyboardType="number-pad"
        value={otp}
        onChangeText={setOtp}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  input: {
    color: '#FFFFFF',
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 10,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 8,
    padding: 16,
    width: '100%',
  },
});

export default OtpInputRow;
