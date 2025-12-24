import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { signInWithPhone } from '../../lib/auth';
import ScreenBackground from '@shared/ui/ScreenBackground';
import AppLogoHeader from '@shared/ui/AppLogoHeader';
import PrimaryButton from '@shared/ui/PrimaryButton';
import SecondaryButton from '@shared/ui/SecondaryButton';
import GlassCard from '@shared/ui/GlassCard';
import { Ionicons } from '@expo/vector-icons';

const SignInScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    if (!phoneNumber || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await signInWithPhone(phoneNumber, password);
      router.replace('/(tabs)/home');
    } catch (error: any) {
      let errorMessage = error.message;
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid phone number or password';
      }
      Alert.alert('Sign In Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      if (Platform.OS === 'web') {
        // Web platform - use popup
        const { signInWithPopup } = await import('firebase/auth');
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        router.replace('/(tabs)/home');
      } else {
        // Mobile platform - show alert for now
        // TODO: Implement Google Sign-In for mobile using expo-auth-session or @react-native-google-signin/google-signin
        Alert.alert(
          'Coming Soon',
          'Google Sign-In on mobile is coming soon. Please use phone number and password for now.'
        );
      }
    } catch (error: any) {
      Alert.alert('Google Sign In Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push('/(auth)/forgot-password');
  };

  const handleSignUp = () => {
    router.push('/(auth)/sign-up');
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <AppLogoHeader />

          <Text style={styles.title}>Sign in</Text>
          <Text style={styles.subtitle}>Welcome back! Please sign in to continue.</Text>

          <GlassCard>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="+92 3xx xxxxxxx"
                  placeholderTextColor="#64748b"
                  inputMode="tel"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
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
              title={isLoading ? "Signing In..." : "Sign In"}
              onPress={handleSignIn}
              disabled={isLoading}
            />

            <View style={styles.separator}>
              <Text style={styles.separatorText}>OR</Text>
            </View>

            <SecondaryButton 
              title="Sign in with Google"
              onPress={handleGoogleSignIn}
              disabled={isLoading}
            />

            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don’t have an account? </Text>
              <Pressable onPress={handleSignUp}>
                <Text style={styles.signUpLink}>Sign up</Text>
              </Pressable>
            </View>
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
  separator: {
    alignItems: 'center',
    marginVertical: 16,
  },
  separatorText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  signUpText: {
    fontSize: 14,
    color: '#94a3b8',
    fontFamily: 'Inter',
  },
  signUpLink: {
    fontSize: 14,
    color: '#14b8a6',
    fontWeight: '700',
    fontFamily: 'Inter',
  },
});

export default SignInScreen;
