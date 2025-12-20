
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import GlassCard from '@shared/ui/GlassCard';
import PrimaryButton from '@shared/ui/PrimaryButton';

const HeroActionCard = ({ onPress }) => {
  return (
    <GlassCard>
      <View style={styles.container}>
        <Text style={styles.title}>Book a pitch in 60 seconds</Text>
        <Text style={styles.subtitle}>See real-time slots at vetted venues near you.</Text>
        <View style={styles.buttonContainer}>
            <PrimaryButton title="Book Now" onPress={onPress} />
        </View>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    color: '#94a3b8',
    marginTop: 8,
    marginBottom: 16,
  },
  buttonContainer: {
      alignSelf: 'flex-start'
  }
});

export default HeroActionCard;
