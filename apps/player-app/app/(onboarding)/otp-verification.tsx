
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenBackground from '@shared/ui/ScreenBackground';
import AppHeader from '@shared/ui/AppHeader';
import PrimaryButton from '@shared/ui/PrimaryButton';
import OtpInputRow from '../components/onboarding/OtpInputRow';
import CountdownText from '../components/onboarding/CountdownText';

const OtpVerificationScreen = () => {
  const [otp, setOtp] = useState('');
  const router = useRouter();

  return (
    <ScreenBackground>
      <AppHeader title="Enter the 6-digit code" onBack={() => router.back()} />
      <View style={styles.container}>
        <Text style={styles.subtitle}>We’ve sent it to +92 3XX-XXXXXXX</Text>
        <OtpInputRow otp={otp} setOtp={setOtp} />
        <View style={styles.actions}>
          <CountdownText />
          <TouchableOpacity onPress={() => router.replace('/(onboarding)/phone-entry')}>
            <Text style={styles.link}>Change number</Text>
          </TouchableOpacity>
        </View>
        <PrimaryButton 
          title="Verify & Continue" 
          onPress={() => router.push('/(onboarding)/basic-info')} 
          disabled={otp.length !== 6}
        />
      </View>
    </ScreenBackground>
  );
};

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
