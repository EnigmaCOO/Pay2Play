import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from '../../lib/firebase';
import { 
  authenticateWithGoogle, 
  authenticateWithPhone, 
  verifyPhoneOtpAndComplete,
  authenticateWithEmail,
  cacheConfirmationResult,
  getCachedConfirmationResult,
  clearCachedConfirmationResult,
  clearRecaptchaVerifier
} from '../../lib/auth';
import ScreenBackground from '@shared/ui/ScreenBackground';
import AppLogoHeader from '@shared/ui/AppLogoHeader';
import PrimaryButton from '@shared/ui/PrimaryButton';
import SecondaryButton from '@shared/ui/SecondaryButton';
import GlassCard from '@shared/ui/GlassCard';
import { Ionicons } from '@expo/vector-icons';
import OtpInputRow from '../components/onboarding/OtpInputRow';

type AuthMethod = 'google' | 'phone' | 'email';

const AuthScreen = () => {
  const [authMethod, setAuthMethod] = useState<AuthMethod | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Clear reCAPTCHA verifier on mount and unmount
  useEffect(() => {
    if (Platform.OS === 'web') {
      clearRecaptchaVerifier();
      return () => {
        clearRecaptchaVerifier();
      };
    }
  }, []);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      if (Platform.OS === 'web') {
        const user = await authenticateWithGoogle();
        // Google users have complete profile, go to home
        router.replace('/(tabs)/home');
      } else {
        Alert.alert(
          'Coming Soon',
          'Google Sign-In on mobile is coming soon. Please use phone number or email for now.'
        );
      }
    } catch (error: any) {
      Alert.alert('Google Sign In Failed', error.message || 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSendOtp = async () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    try {
      const fullPhoneNumber = `+92${cleanPhone}`;
      const confirmationResult = await authenticateWithPhone(fullPhoneNumber);
      cacheConfirmationResult(fullPhoneNumber, confirmationResult);
      setOtpSent(true);
    } catch (error: any) {
      let errorMessage = error.message || 'Failed to send verification code. Please try again.';
      let errorTitle = 'Error';
      
      if (error.code === 'auth/invalid-app-credential' || error.code === 'auth/captcha-check-failed') {
        errorTitle = 'Configuration Required';
        if (error.isConfigError) {
          errorMessage = error.message;
        } else {
          errorMessage = 'Domain authorization required. Please contact support or check Firebase Console settings.';
        }
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many verification attempts. Please wait a few minutes before trying again.';
      }
      Alert.alert(errorTitle, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 4) {
      Alert.alert('Error', 'Please enter the complete OTP code');
      return;
    }

    setIsLoading(true);
    try {
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      const fullPhoneNumber = `+92${cleanPhone}`;
      const confirmationResult = getCachedConfirmationResult(fullPhoneNumber);
      
      if (!confirmationResult) {
        throw new Error('Verification session expired. Please request a new code.');
      }

      const { isNewUser } = await verifyPhoneOtpAndComplete(confirmationResult, otpCode);
      clearCachedConfirmationResult(fullPhoneNumber);

      if (isNewUser) {
        router.replace('/(onboarding)/complete-profile');
      } else {
        router.replace('/(tabs)/home');
      }
    } catch (error: any) {
      let errorMessage = error.message || 'Invalid OTP code. Please try again.';
      if (error.code === 'auth/invalid-verification-code') {
        errorMessage = 'Invalid OTP code. Please check and try again.';
      } else if (error.code === 'auth/code-expired') {
        errorMessage = 'OTP code has expired. Please request a new one.';
        setOtpSent(false);
        setOtp(['', '', '', '']);
      }
      Alert.alert('Verification Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const { isNewUser } = await authenticateWithEmail(email, password);
      
      if (isNewUser) {
        router.replace('/(onboarding)/complete-profile');
      } else {
        router.replace('/(tabs)/home');
      }
    } catch (error: any) {
      let errorMessage = error.message || 'Authentication failed. Please try again.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please sign in instead.';
      }
      Alert.alert('Authentication Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push('/(auth)/forgot-password');
  };

  const resetMethod = () => {
    setAuthMethod(null);
    setOtpSent(false);
    setOtp(['', '', '', '']);
    setPhoneNumber('');
    setEmail('');
    setPassword('');
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <AppLogoHeader />

          {!authMethod ? (
            <>
              <Text style={styles.title}>Welcome</Text>
              <Text style={styles.subtitle}>Choose how you'd like to sign in or create an account</Text>

              <View style={styles.methodButtons}>
                <SecondaryButton
                  title="Continue with Google"
                  onPress={() => handleGoogleAuth()}
                  disabled={isLoading}
                />
                
                <SecondaryButton
                  title="Continue with Phone"
                  onPress={() => setAuthMethod('phone')}
                  disabled={isLoading}
                />
                
                <SecondaryButton
                  title="Continue with Email"
                  onPress={() => setAuthMethod('email')}
                  disabled={isLoading}
                />
              </View>
            </>
          ) : authMethod === 'phone' ? (
            <>
              <Pressable onPress={resetMethod} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#94a3b8" />
                <Text style={styles.backButtonText}>Back</Text>
              </Pressable>

              <Text style={styles.title}>{otpSent ? 'Verify Phone' : 'Enter Phone Number'}</Text>
              <Text style={styles.subtitle}>
                {otpSent 
                  ? 'Enter the code sent to your phone'
                  : "We'll send you a verification code"}
              </Text>

              <GlassCard>
                {!otpSent ? (
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
                    <Text style={styles.label}>Verification Code</Text>
                    <OtpInputRow otp={otp} setOtp={setOtp} count={4} />
                    <Pressable onPress={handlePhoneSendOtp} style={styles.resendContainer}>
                      <Text style={styles.resendText}>Resend Code</Text>
                    </Pressable>
                  </View>
                )}
              </GlassCard>

              <View style={styles.actions}>
                <PrimaryButton
                  title={isLoading 
                    ? (otpSent ? "Verifying..." : "Sending Code...") 
                    : (otpSent ? "Verify" : "Send Code")}
                  onPress={otpSent ? handlePhoneVerifyOtp : handlePhoneSendOtp}
                  disabled={isLoading || (!otpSent && !phoneNumber) || (otpSent && otp.join('').length !== 4)}
                />
              </View>
            </>
          ) : (
            <>
              <Pressable onPress={resetMethod} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#94a3b8" />
                <Text style={styles.backButtonText}>Back</Text>
              </Pressable>

              <Text style={styles.title}>Sign in with Email</Text>
              <Text style={styles.subtitle}>Enter your email and password to continue</Text>

              <GlassCard>
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

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      placeholderTextColor="#64748b"
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                      editable={!isLoading}
                    />
                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons
                        name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                        size={20}
                        color="#94a3b8"
                      />
                    </Pressable>
                  </View>
                </View>

                <Pressable onPress={handleForgotPassword} style={styles.forgotPasswordContainer}>
                  <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </Pressable>
              </GlassCard>

              <View style={styles.actions}>
                <PrimaryButton
                  title={isLoading ? "Signing In..." : "Continue"}
                  onPress={handleEmailAuth}
                  disabled={isLoading}
                />
              </View>
            </>
          )}

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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#94a3b8',
    marginLeft: 8,
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
    fontFamily: 'Inter',
  },
  methodButtons: {
    marginTop: 24,
    gap: 12,
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
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPassword: {
    fontSize: 14,
    color: '#14b8a6',
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  actions: {
    marginTop: 24,
  },
  resendContainer: {
    alignSelf: 'center',
    marginTop: 16,
  },
  resendText: {
    fontSize: 14,
    color: '#14b8a6',
    fontWeight: '500',
    fontFamily: 'Inter',
  },
});

export default AuthScreen;
