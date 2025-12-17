
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenBackground from '@shared/ui/ScreenBackground';
import AppHeader from '@shared/ui/AppHeader';
import GlassCard from '@shared/ui/GlassCard';

const RewardsScreen = () => {
  const router = useRouter();

  return (
    <ScreenBackground>
      <AppHeader title="Rewards & referrals" onBack={() => router.back()} />
      <Text style={styles.subtitle}>Earn credits by playing and inviting friends.</Text>

      <ScrollView>
        <GlassCard>
            <Text style={styles.sectionTitle}>Balance</Text>
            <Text style={styles.balance}>450 credits</Text>
            <Text style={styles.value}>≈ PKR 450</Text>
            <Text style={styles.helper}>You can use up to 30% of a booking with credits.</Text>
        </GlassCard>

        <View style={styles.row}>
            <TouchableOpacity style={styles.earnCard}>
                <Text style={styles.earnTitle}>Play more</Text>
                <Text style={styles.earnDesc}>100 credits per completed booking.</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.earnCard}>
                <Text style={styles.earnTitle}>Invite friends</Text>
                <Text style={styles.earnDesc}>250 credits per friend’s first game.</Text>
            </TouchableOpacity>
        </View>

        <GlassCard>
            <Text style={styles.sectionTitle}>Referral</Text>
            <Text style={styles.referralText}>Invite friends, get 250 credits each</Text>
            <View style={styles.codeContainer}>
                <Text style={styles.code}>ABD123</Text>
                <TouchableOpacity><Text style={styles.copy}>Copy</Text></TouchableOpacity>
            </View>
        </GlassCard>

        <Text style={styles.activityTitle}>Rewards activity</Text>
        <GlassCard>
            <View style={styles.activityRow}>
                <Text style={styles.activityAmt}>+200</Text>
                <View>
                    <Text style={styles.activityDesc}>Booking at Star Futsal Arena</Text>
                    <Text style={styles.activityDate}>25 Nov</Text>
                </View>
            </View>
            <View style={[styles.activityRow, styles.borderTop]}>
                <Text style={styles.activityAmt}>+250</Text>
                <View>
                    <Text style={styles.activityDesc}>Friend Ali joined & booked</Text>
                    <Text style={styles.activityDate}>21 Nov</Text>
                </View>
            </View>
            <View style={[styles.activityRow, styles.borderTop]}>
                <Text style={[styles.activityAmt, styles.negative]}>-150</Text>
                <View>
                    <Text style={styles.activityDesc}>Used on Turf Arena booking</Text>
                    <Text style={styles.activityDate}>18 Nov</Text>
                </View>
            </View>
        </GlassCard>
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
      color: 'white',
      fontWeight: 'bold',
      fontSize: 18,
      marginBottom: 8,
  },
  balance: {
      color: '#14b8a6',
      fontSize: 32,
      fontWeight: 'bold',
  },
  value: {
      color: 'white',
      fontSize: 18,
      marginBottom: 8,
  },
  helper: {
      color: '#94a3b8',
      fontSize: 12,
  },
  row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 10,
  },
  earnCard: {
      backgroundColor: 'rgba(30, 41, 59, 0.8)',
      padding: 16,
      borderRadius: 16,
      width: '48%',
      borderWidth: 1,
      borderColor: 'rgba(148, 163, 184, 0.5)',
  },
  earnTitle: {
      color: '#14b8a6',
      fontWeight: 'bold',
      marginBottom: 4,
  },
  earnDesc: {
      color: '#cbd5e1',
      fontSize: 12,
  },
  referralText: {
      color: 'white',
      marginBottom: 10,
  },
  codeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#0f172a',
      padding: 12,
      borderRadius: 8,
  },
  code: {
      color: '#14b8a6',
      fontSize: 20,
      fontWeight: 'bold',
      fontFamily: 'monospace',
  },
  copy: {
      color: '#94a3b8',
  },
  activityTitle: {
      color: '#94a3b8',
      marginTop: 20,
      marginBottom: 8,
      marginLeft: 4,
  },
  activityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
  },
  borderTop: {
      borderTopWidth: 1,
      borderTopColor: 'rgba(148, 163, 184, 0.2)',
  },
  activityAmt: {
      color: '#14b8a6',
      fontWeight: 'bold',
      fontSize: 16,
      width: 60,
  },
  negative: {
      color: '#f87171',
  },
  activityDesc: {
      color: 'white',
      fontSize: 14,
  },
  activityDate: {
      color: '#94a3b8',
      fontSize: 12,
  }
});

export default RewardsScreen;
