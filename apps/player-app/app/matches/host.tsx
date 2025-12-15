
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenBackground from '../../shared/ui/ScreenBackground';
import AppHeader from '../../shared/ui/AppHeader';
import GlassCard from '../../shared/ui/GlassCard';
import PrimaryButton from '../../shared/ui/PrimaryButton';
import Chip from '../../shared/ui/Chip';

const HostMatchSetupScreen = () => {
  const router = useRouter();
  const [matchTitle, setMatchTitle] = useState('5-a-side high tempo');
  const [playersNeeded, setPlayersNeeded] = useState(2);
  const [skillLevel, setSkillLevel] = useState('Intermediate');
  const [gameType, setGameType] = useState('Friendly');
  const [notes, setNotes] = useState('');
  const [cost, setCost] = useState('400');

  return (
    <ScreenBackground>
      <AppHeader title="Host a match" onBack={() => router.back()} />
      <Text style={styles.subtitle}>Turn this booking into a game others can join.</Text>

      <ScrollView>
        <GlassCard>
            <Text style={styles.sectionTitle}>Linked Booking</Text>
            <Text style={styles.bookingTitle}>Star Futsal Arena</Text>
            <Text style={styles.bookingDetails}>Today · 8:00–9:00 PM · Football · Court A</Text>
            <Text style={styles.bookingDetails}>DHA Phase 5</Text>
            <TouchableOpacity><Text style={styles.link}>Change booking ▾</Text></TouchableOpacity>
        </GlassCard>

        <GlassCard>
            <Text style={styles.sectionTitle}>Game Details</Text>
            
            <Text style={styles.label}>Match title</Text>
            <TextInput 
                style={styles.input} 
                value={matchTitle} 
                onChangeText={setMatchTitle}
                placeholderTextColor="#94a3b8"
            />

            <Text style={styles.label}>Players needed</Text>
            <View style={styles.stepper}>
                <TouchableOpacity onPress={() => setPlayersNeeded(Math.max(1, playersNeeded - 1))}><Text style={styles.stepperBtn}>-</Text></TouchableOpacity>
                <Text style={styles.stepperVal}>{playersNeeded}</Text>
                <TouchableOpacity onPress={() => setPlayersNeeded(playersNeeded + 1)}><Text style={styles.stepperBtn}>+</Text></TouchableOpacity>
            </View>
            <Text style={styles.helper}>Total players: 10</Text>

            <Text style={styles.label}>Skill level</Text>
            <View style={styles.chips}>
                {['Casual', 'Intermediate', 'Competitive'].map(lvl => (
                    <Chip key={lvl} label={lvl} selected={skillLevel === lvl} onPress={() => setSkillLevel(lvl)} />
                ))}
            </View>

            <Text style={styles.label}>Game type</Text>
            <View style={styles.chips}>
                {['Friendly', 'Competitive'].map(type => (
                    <Chip key={type} label={type} selected={gameType === type} onPress={() => setGameType(type)} />
                ))}
            </View>

            <Text style={styles.label}>Notes to players (optional)</Text>
            <TextInput 
                style={[styles.input, { height: 80 }]} 
                multiline 
                value={notes} 
                onChangeText={setNotes}
                placeholder="e.g. Bring turf shoes..."
                placeholderTextColor="#94a3b8"
            />
        </GlassCard>

        <GlassCard>
            <Text style={styles.sectionTitle}>Visibility & Cost</Text>
            <Text style={styles.label}>Cost per player (optional)</Text>
            <TextInput 
                style={styles.input} 
                value={cost} 
                onChangeText={setCost}
                keyboardType="numeric"
                placeholder="PKR"
                placeholderTextColor="#94a3b8"
            />
            <Text style={styles.helper}>Players will pay you directly at the venue.</Text>
        </GlassCard>

        <PrimaryButton title="Publish Match" onPress={() => router.push('/matches/success')} />
        <Text style={styles.footerText}>We’ll list it under Matches instantly.</Text>
      </ScrollView>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  subtitle: {
      color: '#94a3b8',
      textAlign: 'center',
      marginBottom: 16,
  },
  sectionTitle: {
      color: '#14b8a6',
      fontWeight: 'bold',
      marginBottom: 10,
      fontSize: 16,
  },
  bookingTitle: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 18,
  },
  bookingDetails: {
      color: '#cbd5e1',
      marginVertical: 2,
  },
  link: {
      color: '#14b8a6',
      marginTop: 8,
  },
  label: {
      color: 'white',
      marginTop: 12,
      marginBottom: 4,
  },
  input: {
      backgroundColor: 'rgba(30, 41, 59, 0.8)',
      borderRadius: 8,
      padding: 12,
      color: 'white',
      borderWidth: 1,
      borderColor: '#475569',
  },
  stepper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(30, 41, 59, 0.8)',
      borderRadius: 8,
      alignSelf: 'flex-start',
      borderWidth: 1,
      borderColor: '#475569',
  },
  stepperBtn: {
      color: 'white',
      fontSize: 24,
      paddingHorizontal: 16,
      paddingVertical: 8,
  },
  stepperVal: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
      paddingHorizontal: 8,
  },
  helper: {
      color: '#94a3b8',
      fontSize: 12,
      marginTop: 4,
  },
  chips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
  },
  footerText: {
      color: '#94a3b8',
      textAlign: 'center',
      marginBottom: 20,
  }
});

export default HostMatchSetupScreen;
