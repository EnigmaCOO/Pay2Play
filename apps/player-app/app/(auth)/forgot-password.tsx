import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert, ScrollView } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { resetPassword } from '../../lib/auth';
import ScreenBackground from '@shared/ui/ScreenBackground';
import PrimaryButton from '@shared/ui/PrimaryButton';
import GlassCard from '@shared/ui/GlassCard';
import { Ionicons } from '@expo/vector-icons';

type ResetMethod = 'phone' | 'email';

const ForgotPasswordScreen = () => {
  const [resetMethod, setResetMethod] = useState<ResetMethod>('email');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleResetPassword = async () => {
    if (resetMethod === 'phone') {
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
              onPress: () => router.replace('/(auth)/auth' as Href),
            },
          ]
        );
      } catch (error: any) {
        Alert.alert('Error', error.message || 'Failed to send password reset email');
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!email) {
        Alert.alert('Error', 'Please enter your email address');
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Alert.alert('Error', 'Please enter a valid email address');
        return;
      }

      setIsLoading(true);
      try {
        await sendPasswordResetEmail(auth, email);
        Alert.alert(
          'Password Reset Email Sent',
          'Check your email for password reset instructions.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(auth)/auth' as Href),
            },
          ]
        );
      } catch (error: any) {
        let errorMessage = error.message || 'Failed to send password reset email';
        if (error.code === 'auth/user-not-found') {
          errorMessage = 'No account found with this email address';
        }
        Alert.alert('Error', errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Pressable 
            onPress={() => router.replace('/(auth)/auth' as Href)} 
            style={({pressed}) => [styles.backButton, pressed && styles.pressed]}
          >
            <Text style={styles.backButtonText}>‹ Back</Text>
          </Pressable>

          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Enter your {resetMethod === 'phone' ? 'phone number' : 'email'} and we'll send you instructions to reset your password.
          </Text>

          <View style={styles.methodSelector}>
            <Pressable
              style={({ pressed }) => [
                styles.methodButton,
                resetMethod === 'email' && styles.methodButtonActive,
                pressed && styles.pressed
              ]}
              onPress={() => {
                setResetMethod('email');
                setPhoneNumber('');
              }}
            >
              <Ionicons 
                name="mail-outline" 
                size={20} 
                color={resetMethod === 'email' ? '#14b8a6' : '#94a3b8'} 
              />
              <Text style={[
                styles.methodButtonText,
                resetMethod === 'email' && styles.methodButtonTextActive
              ]}>
                Email
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.methodButton,
                resetMethod === 'phone' && styles.methodButtonActive,
                pressed && styles.pressed
              ]}
              onPress={() => {
                setResetMethod('phone');
                setEmail('');
              }}
            >
              <Ionicons 
                name="call-outline" 
                size={20} 
                color={resetMethod === 'phone' ? '#14b8a6' : '#94a3b8'} 
              />
              <Text style={[
                styles.methodButtonText,
                resetMethod === 'phone' && styles.methodButtonTextActive
              ]}>
                Phone
              </Text>
            </Pressable>
          </View>

          <GlassCard>
            {resetMethod === 'phone' ? (
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
                    editable={!isLoading}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="your.email@example.com"
                    placeholderTextColor="#64748b"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    editable={!isLoading}
                  />
                </View>
              </View>
            )}
          </GlassCard>

          <View style={styles.actions}>
            <PrimaryButton 
              title={isLoading ? "Sending..." : "Send Reset Link"}
              onPress={handleResetPassword}
              disabled={isLoading}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
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
  methodSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  methodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#475569',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    gap: 8,
  },
  methodButtonActive: {
    borderColor: '#14b8a6',
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
  },
  methodButtonText: {
    fontSize: 14,
    color: '#94a3b8',
    fontFamily: 'Inter',
    fontWeight: '500',
  },
  methodButtonTextActive: {
    color: '#14b8a6',
    fontWeight: '600',
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
