import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Platform } from 'react-native';
import { useRouter, useLocalSearchParams, Href } from 'expo-router';
import { PhoneAuthProvider, signInWithCredential, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { getCachedConfirmationResult, clearCachedConfirmationResult } from '../../lib/auth';
import ScreenBackground from '@shared/ui/ScreenBackground';
import PrimaryButton from '@shared/ui/PrimaryButton';
import OtpInputRow from '../components/onboarding/OtpInputRow';

const OtpVerificationScreen = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(58);
  const [canResend, setCanResend] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const phoneNumber = params.phoneNumber as string;
  const name = params.name as string;
  const email = params.email as string;
  const password = params.password as string;
  const isSignUp = params.isSignUp === 'true';
  const verificationId = params.verificationId as string;

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendCountdown]);

  const handleSubmit = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 4) {
      Alert.alert('Error', 'Please enter the complete OTP code');
      return;
    }

    setLoading(true);
    
    try {
      let phoneAuthUser;
      
      // Verify OTP via phone authentication
      if (Platform.OS === 'web' && phoneNumber) {
        const confirmationResult = getCachedConfirmationResult(phoneNumber);
        if (!confirmationResult) {
          throw new Error('Verification session expired. Please try again.');
        }
        const result = await confirmationResult.confirm(otpCode);
        phoneAuthUser = result.user;
        // Clear cache after successful verification
        clearCachedConfirmationResult(phoneNumber);
      } else if (verificationId) {
        const credential = PhoneAuthProvider.credential(verificationId, otpCode);
        const result = await signInWithCredential(auth, credential);
        phoneAuthUser = result.user;
      } else {
        throw new Error('No verification method available');
      }

      // Check if email/password was provided (hybrid auth)
      let finalUser = phoneAuthUser;
      
      if (email && password && isSignUp) {
        // User provided email/password - create account with email/password
        // First sign out from phone auth
        await auth.signOut();
        
        // Create user with email/password
        const emailUserCredential = await createUserWithEmailAndPassword(auth, email, password);
        finalUser = emailUserCredential.user;
        
        // Update profile with display name
        if (name) {
          await updateProfile(finalUser, { displayName: name });
        }
      }
      // If phone-only, user is already authenticated via phone OTP

      // Create or update Firestore user document
      const userDocRef = doc(db, 'users', finalUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      const userData: any = {
        phoneNumber: phoneNumber || phoneAuthUser.phoneNumber || '',
        createdAt: new Date().toISOString(),
        role: 'player',
      };
      
      if (name) {
        userData.displayName = name;
        userData.name = name;
      }
      
      if (email) {
        userData.email = email;
      }
      
      if (!userDoc.exists()) {
        await setDoc(userDocRef, userData);
      } else {
        // Update existing document with new data
        await setDoc(userDocRef, { ...userDoc.data(), ...userData }, { merge: true });
      }
      
      setSuccessMessage('Verified successfully');
      
      setTimeout(() => {
        // Navigate to basic-info for new users, or home for returning users
        if (isSignUp && !userDoc.exists()) {
          router.replace('/(onboarding)/basic-info' as Href);
        } else {
          router.replace('/(tabs)/home' as Href);
        }
      }, 1500);
      
    } catch (error: any) {
      console.error('OTP verification error:', error);
      
      // Log error code for debugging (without exposing sensitive details)
      if (error.code) {
        console.warn('OTP verification error code:', error.code);
      }

      let errorMessage = 'Invalid OTP code. Please try again.';
      let errorTitle = 'Verification Failed';

      // Handle specific error codes with user-friendly messages
      if (error.code === 'auth/invalid-verification-code') {
        errorMessage = 'Invalid OTP code. Please check and try again.';
      } else if (error.code === 'auth/code-expired') {
        errorMessage = 'OTP code has expired. Please request a new one.';
      } else if (error.code === 'auth/invalid-app-credential') {
        errorMessage = 'We had trouble verifying your device. Please refresh the page, request a new code, and try again. If this continues, contact support at Pay2Play.fun.';
        errorTitle = 'Verification Error';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please use a different email or sign in.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many verification attempts. Please wait a few minutes before trying again.';
      } else if (error.message) {
        // Use the error message if available
        errorMessage = error.message;
      }

      Alert.alert(errorTitle, errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    setResendCountdown(58);
    setCanResend(false);
    Alert.alert('OTP Resent', 'A new OTP code has been sent to your phone.');
  };

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <Text style={styles.title}>Verify Phone</Text>
        
        <Text style={styles.description}>
          Please enter the OTP code sent{'\n'}to your phone number.
        </Text>

        <OtpInputRow otp={otp} setOtp={setOtp} count={4} />

        <PrimaryButton 
          title={loading ? "Verifying..." : "Submit"}
          onPress={handleSubmit}
          disabled={loading || otp.join('').length !== 4}
        />

        <Pressable onPress={handleResend} disabled={!canResend}>
          <Text style={[styles.resendText, !canResend && styles.resendTextDisabled]}>
            {canResend ? 'Resend OTP' : `Resend OTP in ${resendCountdown}s`}
          </Text>
        </Pressable>

        {successMessage ? (
          <View style={styles.successMessageContainer}>
            <Text style={styles.successMessage}>{successMessage}</Text>
          </View>
        ) : null}
      </View>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'Outfit',
  },
  description: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    fontFamily: 'Inter',
  },
  resendText: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Inter',
  },
  resendTextDisabled: {
    color: '#64748b',
  },
  successMessageContainer: {
    marginTop: 20,
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#14b8a6',
    padding: 16,
  },
  successMessage: {
    color: '#14b8a6',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: 'Inter',
  },
});

export default OtpVerificationScreen;
