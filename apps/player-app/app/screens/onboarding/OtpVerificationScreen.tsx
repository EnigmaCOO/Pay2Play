
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ScreenBackground from '../../../../shared/ui/ScreenBackground';
import AppHeader from '../../../../shared/ui/AppHeader';
import PrimaryButton from '../../../../shared/ui/PrimaryButton';
import OtpInputRow from '../../components/onboarding/OtpInputRow';
import CountdownText from '../../components/onboarding/CountdownText';

const OtpVerificationScreen = ({ navigation }) => {
  const [otp, setOtp] = useState('');

  return (
    <ScreenBackground>
      <AppHeader title="Enter the 6-digit code" onBack={() => navigation.goBack()} />
      <View style={styles.container}>
        <Text style={styles.subtitle}>We’ve sent it to +92 3XX-XXXXXXX</Text>
        <OtpInputRow otp={otp} setOtp={setOtp} />
        <View style={styles.actions}>
          <CountdownText />
          <TouchableOpacity onPress={() => navigation.navigate('PhoneEntry')}>
            <Text style={styles.link}>Change number</Text>
          </TouchableOpacity>
        </View>
        <PrimaryButton 
          title="Verify & Continue" 
          onPress={() => navigation.navigate('BasicInfo')} 
          disabled={otp.length !== 6}
        />
      </View>
    </ScreenBackground>
  );
};

// Simple CountdownText component for demonstration
const CountdownText = () => {
    // Logic for countdown would be here
    return <Text style={styles.link}>Resend code in 00:34</Text>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 20,
  },
  link: {
    color: '#14b8a6',
    fontWeight: 'bold',
  }
});

export default OtpVerificationScreen;
