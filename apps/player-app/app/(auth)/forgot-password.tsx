import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { resetPassword } from '../../lib/auth';
import ScreenBackground from '@shared/ui/ScreenBackground';
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

    setIsLoading(true);
    try {
      await resetPassword(phoneNumber);
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
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>‹ Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          Enter your phone number and we'll send you instructions to reset your password.
        </Text>

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

        <TouchableOpacity 
          style={styles.resetButton}
          onPress={handleResetPassword}
          disabled={isLoading}
        >
          <Text style={styles.resetButtonText}>Send Reset Link</Text>
        </TouchableOpacity>
      </View>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 35,
    paddingTop: 50,
  },
  backButton: {
    marginBottom: 40,
  },
  backButtonText: {
    fontSize: 24,
    color: '#C8C8C8',
  },
  title: {
    fontSize: 42,
    color: '#C8C8C8',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 26,
    color: '#6E6E6E',
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 36,
  },
  inputWrapper: {
    marginBottom: 30,
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
  resetButton: {
    height: 91,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1F5E40',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 33,
    color: '#B4D7C5',
    fontWeight: '700',
  },
});

export default ForgotPasswordScreen;
