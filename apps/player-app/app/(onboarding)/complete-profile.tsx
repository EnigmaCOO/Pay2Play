import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from '../../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { updateProfile } from 'firebase/auth';
import ScreenBackground from '@shared/ui/ScreenBackground';
import AppHeader from '@shared/ui/AppHeader';
import PrimaryButton from '@shared/ui/PrimaryButton';
import GlassCard from '@shared/ui/GlassCard';
import AvatarCarousel from '../components/onboarding/AvatarCarousel';
import SportChip from '@shared/ui/SportChip';

const CompleteProfileScreen = () => {
  const [name, setName] = useState('');
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const toggleSport = (sport: string) => {
    setSelectedSports(prev => 
      prev.includes(sport) ? prev.filter(s => s !== sport) : [...prev, sport]
    );
  };

  const handleComplete = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (selectedSports.length === 0) {
      Alert.alert('Error', 'Please select at least one sport');
      return;
    }

    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'You must be signed in to complete your profile');
        router.replace('/(auth)/auth');
        return;
      }

      // Update Firebase Auth profile with display name
      if (name) {
        await updateProfile(user, { displayName: name });
      }

      // Update Firestore profile
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      const profileData: any = {
        displayName: name,
        preferredSports: selectedSports,
      };

      if (selectedAvatar) {
        profileData.photoURL = selectedAvatar;
        // Also update Firebase Auth photoURL
        await updateProfile(user, { photoURL: selectedAvatar });
      }

      if (userDoc.exists()) {
        await setDoc(userDocRef, { ...userDoc.data(), ...profileData }, { merge: true });
      } else {
        // Should not happen, but create if missing
        await setDoc(userDocRef, {
          id: user.uid,
          email: user.email || null,
          displayName: name,
          phoneNumber: user.phoneNumber || null,
          photoURL: selectedAvatar || null,
          preferredSports: selectedSports,
          roles: ['player'],
          balancePkr: 0,
          createdAt: new Date().toISOString(),
        });
      }

      // Navigate to home
      router.replace('/(tabs)/home');
    } catch (error: any) {
      console.error('Error completing profile:', error);
      Alert.alert('Error', error.message || 'Failed to complete profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <AppHeader 
          title="Complete your profile" 
          onBack={() => router.back()} 
        />
        <View style={styles.container}>
          <Text style={styles.subtitle}>
            Help us personalize your experience
          </Text>

          <View style={styles.avatarSection}>
            <AvatarCarousel onSelect={setSelectedAvatar} selectedAvatar={selectedAvatar} />
          </View>

          <GlassCard>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Your name</Text>
              <TextInput
                style={styles.input}
                placeholder="Muhammad Abdullah"
                placeholderTextColor="#64748b"
                value={name}
                onChangeText={setName}
                editable={!isLoading}
              />
            </View>
          </GlassCard>

          <GlassCard>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>What do you play?</Text>
              <View style={styles.chipContainer}>
                <SportChip 
                  label="Cricket" 
                  selected={selectedSports.includes('Cricket')}
                  onPress={() => toggleSport('Cricket')}
                />
                <SportChip 
                  label="Football"
                  selected={selectedSports.includes('Football')}
                  onPress={() => toggleSport('Football')}
                />
                <SportChip 
                  label="Padel"
                  selected={selectedSports.includes('Padel')}
                  onPress={() => toggleSport('Padel')}
                />
              </View>
            </View>
          </GlassCard>

          <View style={styles.actions}>
            <PrimaryButton 
              title={isLoading ? "Saving..." : "Complete Profile"} 
              onPress={handleComplete}
              disabled={isLoading || !name.trim() || selectedSports.length === 0}
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
    padding: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Inter',
  },
  avatarSection: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#e2e8f0',
    marginBottom: 8,
    fontFamily: 'Inter',
  },
  input: {
    fontSize: 16,
    color: '#FFFFFF',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Inter',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  actions: {
    marginTop: 24,
  },
});

export default CompleteProfileScreen;
