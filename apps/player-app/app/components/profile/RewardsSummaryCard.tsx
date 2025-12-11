
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GlassCard from '../../../shared/ui/GlassCard';
import PrimaryButton from '../../../shared/ui/PrimaryButton';
import { useRouter } from 'expo-router';

const RewardsSummaryCard = ({ rewards }) => {
  const { credits, totalSaved, biggestDiscount } = rewards || {};
  const router = useRouter();

  return (
    <GlassCard>
      <Text style={styles.title}>Rewards & Savings</Text>
      <Text style={styles.credits}>{credits || 0} credits</Text>
      <Text style={styles.details}>Worth PKR {credits || 0} on future bookings.</Text>
      <Text style={styles.details}>Total saved so far: PKR {totalSaved || 0}</Text>
      <Text style={styles.details}>Biggest discount: PKR {biggestDiscount || 0}</Text>
      <PrimaryButton title="View rewards & invite friends" onPress={() => router.push('/profile/rewards')} />
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  credits: {
    color: '#14b8a6',
    fontSize: 24,
    fontWeight: 'bold',
  },
  details: {
    color: '#94a3b8',
    marginVertical: 4,
  }
});

export default RewardsSummaryCard;
