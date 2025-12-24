import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';

interface OtpInputRowProps {
  otp: string[];
  setOtp: (otp: string[]) => void;
  count?: number;
}

const OtpInputRow = ({ otp, setOtp, count = 4 }: OtpInputRowProps) => {
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) {
      text = text.slice(-1);
    }

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < count - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.inputWrapper}>
          <TextInput
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={[
              styles.input,
              otp[index] && styles.inputFilled,
            ]}
            maxLength={1}
            keyboardType="number-pad"
            value={otp[index] || ''}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            selectTextOnFocus
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    marginVertical: 30,
  },
  inputWrapper: {
    width: 76,
    height: 76,
  },
  input: {
    width: 76,
    height: 76,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#175236',
    backgroundColor: 'rgba(12, 114, 63, 0.3)',
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputFilled: {
    backgroundColor: 'rgba(12, 114, 63, 0.5)',
  },
});

export default OtpInputRow;
