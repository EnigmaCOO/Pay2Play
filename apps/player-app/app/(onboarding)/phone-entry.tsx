
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenBackground from '@shared/ui/ScreenBackground';
import AppHeader from '@shared/ui/AppHeader';
import PrimaryButton from '@shared/ui/PrimaryButton';
import GlassCard from '@shared/ui/GlassCard';

const PhoneEntryScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();

  return (
    <ScreenBackground>
      <AppHeader title="Let’s get your number" onBack={() => router.back()} />
      <View style={styles.container}>
        <Text style={styles.subtitle}>We’ll use it to secure your bookings.</Text>
        <GlassCard>
          <Text style={styles.label}>Phone number</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.countryCode}>+92</Text>
            <TextInput
              style={styles.input}
              placeholder="3xx xxxxxxx"
              placeholderTextColor="#94a3b8"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>
        </GlassCard>
        <PrimaryButton 
          title="Continue" 
          onPress={() => router.push('/(onboarding)/otp-verification')} 
        />
        <Text style={styles.hint}>We’ll send you a one-time code.</Text>
      </View>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    color: '#FFFFFF',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  countryCode: {
    color: '#FFFFFF',
    fontSize: 18,
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    paddingVertical: 12,
  },
  hint: {
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 10,
  }
});

export default PhoneEntryScreen;
