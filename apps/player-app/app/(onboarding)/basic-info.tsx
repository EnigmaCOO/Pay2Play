
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenBackground from '../../../shared/ui/ScreenBackground';
import AppHeader from '../../../shared/ui/AppHeader';
import PrimaryButton from '../../../shared/ui/PrimaryButton';
import GlassCard from '../../../shared/ui/GlassCard';
import AvatarCarousel from '../components/onboarding/AvatarCarousel';
import SportChip from '../../../shared/ui/SportChip';

const BasicInfoScreen = () => {
  const [name, setName] = useState('');
  const [selectedSports, setSelectedSports] = useState([]);
  const router = useRouter();

  const toggleSport = (sport) => {
    setSelectedSports(prev => 
      prev.includes(sport) ? prev.filter(s => s !== sport) : [...prev, sport]
    );
  };

  return (
    <ScreenBackground>
      <AppHeader title="Set up your player profile" onBack={() => router.back()} stepIndicator="Step 2 of 3"/>
      <View style={styles.container}>
        <AvatarCarousel />
        <GlassCard>
          <Text style={styles.label}>Your name</Text>
          <TextInput
            style={styles.input}
            placeholder="Muhammad Abdullah"
            placeholderTextColor="#94a3b8"
            value={name}
            onChangeText={setName}
          />
        </GlassCard>
        <GlassCard>
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
        </GlassCard>
        <PrimaryButton 
          title="Continue" 
          onPress={() => router.push('/(onboarding)/preferences')} 
        />
      </View>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    color: '#FFFFFF',
    fontSize: 16,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 8,
    padding: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  }
});

export default BasicInfoScreen;
