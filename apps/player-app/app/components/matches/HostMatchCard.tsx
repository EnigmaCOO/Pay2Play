
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GlassCard from '@shared/ui/GlassCard';
import PrimaryButton from '@shared/ui/PrimaryButton';

const HostMatchCard = () => {
  return (
    <GlassCard>
        <View style={styles.card}>
            <Text style={styles.title}>5-a-side · Today 9 PM · DHA</Text>
            <Text style={styles.players}>Needs 2 players</Text>
            <PrimaryButton title="Join" onPress={() => {}} />
        </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
    card: {
        width: 250,
        marginRight: 10,
    },
  title: {
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  players: {
      color: '#14b8a6',
      marginVertical: 10,
  }
});

export default HostMatchCard;
