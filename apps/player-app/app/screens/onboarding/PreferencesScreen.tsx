
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenBackground from '../../../../shared/ui/ScreenBackground';
import AppHeader from '../../../../shared/ui/AppHeader';
import PrimaryButton from '../../../../shared/ui/PrimaryButton';
import GlassCard from '../../../../shared/ui/GlassCard';
import Chip from '../../../../shared/ui/Chip';
import NeighborhoodField from '../../components/onboarding/NeighborhoodField';
import StepIndicator from '../../components/onboarding/StepIndicator';


const PreferencesScreen = ({ navigation }) => {
  const [playTimes, setPlayTimes] = useState([]);
  const [gameStyles, setGameStyles] = useState([]);

  const togglePlayTime = (time) => {
    setPlayTimes(prev => 
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
    );
  };

  const toggleGameStyle = (style) => {
    setGameStyles(prev => 
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    );
  };

  return (
    <ScreenBackground>
      <AppHeader title="Where and when do you play?" onBack={() => navigation.goBack()} />
       <StepIndicator current={3} total={3} />
      <View style={styles.container}>
        <GlassCard>
          <Text style={styles.label}>City</Text>
          {/* Implement a dropdown component */}
          <Text style={styles.dropdown}>Lahore</Text>
        </GlassCard>
        <NeighborhoodField />
        <GlassCard>
          <Text style={styles.label}>When do you usually play?</Text>
          <View style={styles.chipContainer}>
            <Chip label="Weekday evenings" selected={playTimes.includes('Weekday evenings')} onPress={() => togglePlayTime('Weekday evenings')} />
            <Chip label="Weekend mornings" selected={playTimes.includes('Weekend mornings')} onPress={() => togglePlayTime('Weekend mornings')} />
            <Chip label="Weekend nights" selected={playTimes.includes('Weekend nights')} onPress={() => togglePlayTime('Weekend nights')} />
            <Chip label="Flexible" selected={playTimes.includes('Flexible')} onPress={() => togglePlayTime('Flexible')} />
          </View>
        </GlassCard>
        <GlassCard>
          <Text style={styles.label}>What kind of games do you want?</Text>
          <View style={styles.chipContainer}>
            <Chip label="Casual pickup" selected={gameStyles.includes('Casual pickup')} onPress={() => toggleGameStyle('Casual pickup')} />
            <Chip label="Competitive" selected={gameStyles.includes('Competitive')} onPress={() => toggleGameStyle('Competitive')} />
            <Chip label="Leagues" selected={gameStyles.includes('Leagues')} onPress={() => toggleGameStyle('Leagues')} />
          </View>
        </GlassCard>
        <PrimaryButton 
          title="Finish Setup" 
          onPress={() => navigation.navigate('Home')} 
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
  dropdown: {
      color: '#FFFFFF',
      fontSize: 16,
      backgroundColor: 'rgba(30, 41, 59, 0.8)',
      borderRadius: 8,
      padding: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default PreferencesScreen;
