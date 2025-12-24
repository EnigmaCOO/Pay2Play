import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { resetPassword } from '../../lib/auth';
import ScreenBackground from '@shared/ui/ScreenBackground';
import PrimaryButton from '@shared/ui/PrimaryButton';
import GlassCard from '@shared/ui/GlassCard';
import { Ionicons } from '@expo/vector-icons';

const ForgotPasswordScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleResetPassword = async () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    // Validate phone number format
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    try {
      // Format phone number with country code
      const fullPhoneNumber = `+92${cleanPhone}`;
      await resetPassword(fullPhoneNumber);
      Alert.alert(
        'Password Reset Email Sent',
        'Check your email for password reset instructions.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <Pressable 
          onPress={() => router.back()} 
          style={({pressed}) => [styles.backButton, pressed && styles.pressed]}
        >
          <Text style={styles.backButtonText}>‹ Back</Text>
        </Pressable>

        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          Enter your phone number and we’ll send you instructions to reset your password.
        </Text>

        <GlassCard>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
              <Text style={styles.countryCode}>+92</Text>
              <TextInput
                style={styles.input}
                placeholder="3xx xxxxxxx"
                placeholderTextColor="#64748b"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>
          </View>
        </GlassCard>

        <View style={styles.actions}>
          <PrimaryButton 
            title={isLoading ? "Sending..." : "Send Reset Link"}
            onPress={handleResetPassword}
            disabled={isLoading}
          />
        </View>
      </View>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  backButton: {
    marginBottom: 40,
  },
  backButtonText: {
    fontSize: 16,
    color: '#94a3b8',
    fontFamily: 'Inter',
  },
  title: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Outfit',
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    fontFamily: 'Inter',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#e2e8f0',
    marginBottom: 8,
    fontFamily: 'Inter',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#475569',
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 10,
  },
  countryCode: {
    color: '#FFFFFF',
    fontSize: 16,
    marginRight: 8,
    fontFamily: 'Inter',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
  actions: {
    marginTop: 24,
  },
  pressed: {
    opacity: 0.7,
  }
});

export default ForgotPasswordScreen;
