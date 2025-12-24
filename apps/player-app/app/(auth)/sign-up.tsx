import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert, ScrollView, Platform } from 'react-native';
import { useRouter, Href } from 'expo-router';
import type { Href as ExpoHref } from 'expo-router';
import { sendPhoneOtp, cacheConfirmationResult, clearRecaptchaVerifier } from '../../lib/auth';
import { Ionicons } from '@expo/vector-icons';
import ScreenBackground from '@shared/ui/ScreenBackground';
import AppLogoHeader from '@shared/ui/AppLogoHeader';
import PrimaryButton from '@shared/ui/PrimaryButton';
import SecondaryButton from '@shared/ui/SecondaryButton';
import GlassCard from '@shared/ui/GlassCard';

const SignUpScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<'sms' | 'whatsapp'>('sms');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Clear reCAPTCHA verifier on mount and unmount to avoid stale instances
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Clear any existing verifier when component mounts
      clearRecaptchaVerifier();
      
      return () => {
        // Clear verifier when component unmounts
        clearRecaptchaVerifier();
      };
    }
  }, []);

  const handleSignUp = async () => {
    // Validate required fields
    if (!name || !phoneNumber) {
      Alert.alert('Error', 'Please fill in name and phone number');
      return;
    }

    // If email is provided, password is required
    if (email && !password) {
      Alert.alert('Error', 'Password is required when email is provided');
      return;
    }

    // If password is provided, it must be at least 6 characters
    if (password && password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
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

      if (Platform.OS === 'web') {
        // Send OTP via Firebase Phone Auth
        const confirmationResult = await sendPhoneOtp(fullPhoneNumber);
        
        // Cache confirmation result (can't be serialized in route params)
        cacheConfirmationResult(fullPhoneNumber, confirmationResult);
        
        // Navigate to OTP verification with user data
        router.push({
          pathname: '/(onboarding)/otp-verification' as any,
          params: {
            phoneNumber: fullPhoneNumber,
            name: name,
            email: email || '',
            password: password || '',
            isSignUp: 'true',
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
      
      // Log error code for debugging (without exposing sensitive details)
      if (error.code) {
        console.warn('Phone auth error code:', error.code);
      }

      let errorMessage = 'Failed to send verification code. Please try again.';
      let errorTitle = 'Sign Up Failed';

      // Handle specific error codes with user-friendly messages
      if (error.code === 'auth/invalid-app-credential') {
        errorMessage = 'We had trouble verifying your device. Please refresh the page and try again. If this continues, contact support at Pay2Play.fun.';
        errorTitle = 'Verification Error';
      } else if (error.code === 'auth/invalid-phone-number' || error.code === 'auth/missing-phone-number') {
        errorMessage = 'Invalid phone number format. Please enter a valid 10-digit phone number.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many verification attempts. Please wait a few minutes before trying again.';
      } else if (error.message) {
        // Use the normalized error message if available
        errorMessage = error.message;
      }

      Alert.alert(errorTitle, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = () => {
    router.push('/(auth)/sign-in' as ExpoHref);
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <AppLogoHeader />

          <Text style={styles.title}>Sign up</Text>
          <Text style={styles.subtitle}>
            Create your account to start playing.
          </Text>

          <GlassCard>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Your Name"
                  placeholderTextColor="#64748b"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number <Text style={styles.required}>*</Text></Text>
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
              <Text style={styles.hintText}>Required for OTP verification</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email (Optional)</Text>
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
                />
              </View>
            </View>

            {email ? (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password <Text style={styles.required}>*</Text></Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#64748b"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                    <Ionicons 
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'} 
                      size={20} 
                      color="#94a3b8" 
                    />
                  </Pressable>
                </View>
                <Text style={styles.hintText}>Required when email is provided</Text>
              </View>
            ) : null}

            {/* Verification Method Section - Simplified */}
            <View style={styles.verificationSection}>
              <Text style={styles.verificationLabel}>OTP Verification Method</Text>
              <View style={styles.verificationOptions}>
                <Pressable 
                  style={({pressed}) => [
                    styles.verificationOption, 
                    verificationMethod === 'sms' && styles.verificationOptionSelected,
                    pressed && styles.pressed
                  ]}
                  onPress={() => setVerificationMethod('sms')}
                >
                  <Ionicons name="chatbox-outline" size={20} color={verificationMethod === 'sms' ? '#14b8a6' : '#94a3b8'} />
                  <Text style={[styles.verificationText, verificationMethod === 'sms' && styles.verificationTextSelected]}>SMS</Text>
                </Pressable>

                <Pressable 
                  style={({pressed}) => [
                    styles.verificationOption, 
                    verificationMethod === 'whatsapp' && styles.verificationOptionSelected,
                    pressed && styles.pressed
                  ]}
                  onPress={() => setVerificationMethod('whatsapp')}
                >
                  <Ionicons name="logo-whatsapp" size={20} color={verificationMethod === 'whatsapp' ? '#14b8a6' : '#94a3b8'} />
                  <Text style={[styles.verificationText, verificationMethod === 'whatsapp' && styles.verificationTextSelected]}>WhatsApp</Text>
                </Pressable>
              </View>
            </View>
          </GlassCard>

          <View style={styles.actions}>
            <PrimaryButton 
              title={isLoading ? "Sending OTP..." : "Send Verification Code"}
              onPress={handleSignUp}
              disabled={isLoading}
            />
            
            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Already have an account? </Text>
              <Pressable onPress={handleSignIn} style={({pressed}) => pressed && styles.pressed}>
                <Text style={styles.signInLink}>Sign in</Text>
              </Pressable>
            </View>
          </View>

          {Platform.OS === 'web' && (
            <div id="recaptcha-container"></div>
          )}
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
    paddingTop: 40,
    paddingBottom: 40,
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
  required: {
    color: '#ef4444',
  },
  hintText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    fontFamily: 'Inter',
  },
  eyeIcon: {
    padding: 4,
  },
  pressed: {
    opacity: 0.7,
  },
  verificationSection: {
    marginTop: 8,
    marginBottom: 8,
  },
  verificationLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#e2e8f0',
    marginBottom: 12,
    fontFamily: 'Inter',
  },
  verificationOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  verificationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#475569',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
  },
  verificationOptionSelected: {
    borderColor: '#14b8a6',
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
  },
  verificationText: {
    fontSize: 14,
    color: '#94a3b8',
    marginLeft: 8,
    fontFamily: 'Inter',
  },
  verificationTextSelected: {
    color: '#14b8a6',
    fontWeight: '600',
  },
  actions: {
    marginTop: 24,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  signInText: {
    fontSize: 14,
    color: '#94a3b8',
    fontFamily: 'Inter',
  },
  signInLink: {
    fontSize: 14,
    color: '#14b8a6',
    fontWeight: '700',
    fontFamily: 'Inter',
  },
});

export default SignUpScreen;
