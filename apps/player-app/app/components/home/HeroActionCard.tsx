
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import GlassCard from '@shared/ui/GlassCard';
import PrimaryButton from '@shared/ui/PrimaryButton';

interface HeroActionCardProps {
  onPress: () => void;
  onSeeAllPress?: () => void;
}

const HeroActionCard = ({ onPress, onSeeAllPress }: HeroActionCardProps) => {
  return (
    <GlassCard>
      <View style={styles.container}>
        <Text style={styles.title}>Book a pitch in 60 seconds</Text>
        <Text style={styles.subtitle}>See real-time slots at vetted venues near you.</Text>
        <View style={styles.actionsRow}>
            <View style={styles.buttonContainer}>
                <PrimaryButton title="Book now" onPress={onPress} />
            </View>
            <Pressable onPress={onSeeAllPress}>
                <Text style={styles.secondaryLink}>See all venues →</Text>
            </Pressable>
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
    fontFamily: 'Outfit',
  },
  subtitle: {
    color: '#94a3b8',
    marginTop: 8,
    marginBottom: 16,
    fontFamily: 'Inter',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonContainer: {
      flex: 1,
      marginRight: 16,
  },
  secondaryLink: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '500',
      fontFamily: 'Inter',
  }
});

export default HeroActionCard;
