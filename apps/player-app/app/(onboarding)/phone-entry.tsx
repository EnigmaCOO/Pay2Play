import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, Platform } from 'react-native';
import { Href, useRouter } from 'expo-router';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import ScreenBackground from '@shared/ui/ScreenBackground';
import AppHeader from '@shared/ui/AppHeader';
import PrimaryButton from '@shared/ui/PrimaryButton';
import GlassCard from '@shared/ui/GlassCard';

const PhoneEntryScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleContinue = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid phone number');
      return;
    }

    setLoading(true);
    const fullPhoneNumber = `+92${phoneNumber.replace(/\D/g, '')}`;

    try {
      if (Platform.OS === 'web') {
        if (!(window as any).recaptchaVerifier) {
          (window as any).recaptchaVerifier = new RecaptchaVerifier(
            auth,
            'recaptcha-container',
            {
              size: 'invisible',
              callback: () => {
                console.log('reCAPTCHA solved');
              },
            }
          );
        }
        
        const appVerifier = (window as any).recaptchaVerifier;
        const confirmationResult = await signInWithPhoneNumber(auth, fullPhoneNumber, appVerifier);
        
        router.push({
          pathname: '/(onboarding)/otp-verification' as Href<'/onboarding/otp-verification'>,
          params: {
            confirmationResult: JSON.stringify(confirmationResult),
            phoneNumber: fullPhoneNumber,
          },
        });
      } else {
        Alert.alert(
          'Development Note',
          'Phone authentication on native platforms requires additional setup with Firebase. For now, please test on web.'
        );
      }
    } catch (error: any) {
      console.error('Phone auth error:', error);
      Alert.alert('Error', error.message || 'Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenBackground>
      <AppHeader title="Let's get your number" onBack={() => router.back()} stepIndicator="Step 2 of 3" />
      <View style={styles.container}>
        <Text style={styles.subtitle}>We'll use it to secure your bookings.</Text>
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
              editable={!loading}
            />
          </View>
        </GlassCard>
        <PrimaryButton 
          title={loading ? "Sending..." : "Continue"}
          onPress={handleContinue}
          disabled={loading}
        />
        <Text style={styles.hint}>We'll send you a one-time code.</Text>
        
        <div id="recaptcha-container"></div>
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
