import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { signInWithPhone } from '../../lib/auth';
import ScreenBackground from '@shared/ui/ScreenBackground';
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
      <View style={styles.container}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>P2P</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Sign in</Text>
        <Text style={styles.subtitle}>Please sign in to continue.</Text>

        {/* Phone Number Input */}
        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name="call-outline" size={28} color="#828282" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#828282"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>
        </View>

        {/* Password Input */}
        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name="lock-closed-outline" size={28} color="#777" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#777"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={28}
                color="#777"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordContainer}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Sign In Button */}
        <TouchableOpacity 
          style={styles.signInButton}
          onPress={handleSignIn}
          disabled={isLoading}
        >
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>

        {/* Google Sign In Button */}
        <TouchableOpacity 
          style={styles.googleButton}
          onPress={handleGoogleSignIn}
          disabled={isLoading}
        >
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don’t have an account? </Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={styles.signUpLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 35,
    paddingTop: 50,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#1F5E40',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#B4D7C5',
    fontSize: 40,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 48,
    color: '#C8C8C8',
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 30,
    color: '#6E6E6E',
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 87,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#535353',
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 31,
    color: '#FFFFFF',
    marginLeft: 20,
  },
  eyeIcon: {
    padding: 10,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 30,
    marginTop: 10,
  },
  forgotPassword: {
    fontSize: 34,
    color: '#9D9335',
    fontWeight: '400',
  },
  signInButton: {
    height: 91,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1F5E40',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  signInButtonText: {
    fontSize: 33,
    color: '#B4D7C5',
    fontWeight: '700',
  },
  googleButton: {
    height: 91,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#535353',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  googleButtonText: {
    fontSize: 28,
    color: '#C8C8C8',
    fontWeight: '600',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signUpText: {
    fontSize: 34,
    color: '#6F6F6F',
    fontWeight: '400',
  },
  signUpLink: {
    fontSize: 30,
    color: '#CCC',
    fontWeight: '700',
  },
});

export default SignInScreen;
