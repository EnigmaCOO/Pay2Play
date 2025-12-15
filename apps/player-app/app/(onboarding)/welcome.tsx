import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenBackground from '@shared/ui/ScreenBackground';
import AppLogoHeader from '@shared/ui/AppLogoHeader';
import PrimaryButton from '@shared/ui/PrimaryButton';
import SecondaryButton from '@shared/ui/SecondaryButton';
import HeroOrb from '../components/onboarding/HeroOrb';
import FeaturePill from '../components/onboarding/FeaturePill';

const OnboardingWelcomeScreen = () => {
  const router = useRouter();

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <AppLogoHeader />
        <HeroOrb />
        <View style={styles.pillsContainer}>
          <FeaturePill text="Vetted venues" />
          <FeaturePill text="Real-time slots" />
          <FeaturePill text="Live discounts" />
        </View>
        <View style={styles.actionsContainer}>
          <PrimaryButton 
            title="Get Started" 
            onPress={() => router.push('/(onboarding)/phone-entry')} 
          />
          <SecondaryButton 
            title="Explore first" 
            onPress={() => { /* Deferred */ }} 
          />
          <View style={styles.bottomMeta}>
            <Text style={styles.loginText}>Already playing with Pay2Play? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')}>
              <Text style={styles.loginLink}>Log in</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.legalText}>
            By continuing, you agree to our Terms and Privacy Policy.
          </Text>
        </View>
      </View>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
  },
  pillsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  actionsContainer: {
    width: '100%',
  },
  bottomMeta: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  loginText: {
    color: '#94a3b8',
  },
  loginLink: {
    color: '#14b8a6',
    fontWeight: 'bold',
  },
  legalText: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
  }
});

export default OnboardingWelcomeScreen;
