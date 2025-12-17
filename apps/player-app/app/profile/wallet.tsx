import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenBackground from '@shared/ui/ScreenBackground';
import AppHeader from '@shared/ui/AppHeader';
import GlassCard from '@shared/ui/GlassCard';

const WalletScreen = () => {
  const router = useRouter();

  return (
    <ScreenBackground>
      <AppHeader title="Wallet" onBack={() => router.back()} />
      <Text style={styles.subtitle}>Your credits, savings, and history.</Text>

      <ScrollView>
        <GlassCard>
            <Text style={styles.sectionTitle}>Available balance</Text>
            <Text style={styles.balance}>450 credits</Text>
            <Text style={styles.value}>≈ PKR 450</Text>
            <View style={styles.badge}><Text style={styles.badgeText}>Up to 30% per booking</Text></View>
            <View style={styles.statsRow}>
                <Text style={styles.stat}>Total saved: PKR 3,200</Text>
                <Text style={styles.stat}>Expiring soon: 0</Text>
            </View>
        </GlassCard>

        <View style={styles.chips}>
            <View style={[styles.chip, styles.activeChip]}><Text style={styles.activeChipText}>Available · 450</Text></View>
            <View style={styles.chip}><Text style={styles.chipText}>Locked · 0</Text></View>
            <View style={styles.chip}><Text style={styles.chipText}>Expiring · 0</Text></View>
        </View>

        <GlassCard>
            <Text style={styles.sectionTitle}>How your wallet works</Text>
            <Text style={styles.detail}>• 100 credits per completed booking.</Text>
            <Text style={styles.detail}>• 250 credits per friend’s first game.</Text>
            <Text style={styles.detail}>• Use up to 30% of a booking with credits.</Text>
            <Text style={styles.detail}>• 1 credit ≈ PKR 1.</Text>
            <TouchableOpacity><Text style={styles.link}>View referral options →</Text></TouchableOpacity>
        </GlassCard>

        <Text style={styles.activityTitle}>Activity</Text>
        <GlassCard>
            <View style={styles.activityRow}>
                <Text style={styles.activityAmt}>+200</Text>
                <View>
                    <Text style={styles.activityDesc}>Booking at Star Futsal Arena</Text>
                    <Text style={styles.activityDate}>Football · 5-a-side</Text>
                </View>
                <View style={styles.activityBadge}><Text style={styles.activityBadgeText}>Earned</Text></View>
            </View>
            {/* More rows... */}
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
      fontSize: 16,
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
  badge: {
      backgroundColor: 'rgba(20, 184, 166, 0.2)',
      alignSelf: 'flex-start',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      marginBottom: 12,
  },
  badgeText: {
      color: '#14b8a6',
      fontSize: 12,
      fontWeight: 'bold',
  },
  statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderTopWidth: 1,
      borderTopColor: 'rgba(148, 163, 184, 0.2)',
      paddingTop: 12,
  },
  stat: {
      color: '#94a3b8',
      fontSize: 12,
  },
  chips: {
      flexDirection: 'row',
      marginBottom: 16,
  },
  chip: {
      backgroundColor: 'rgba(30, 41, 59, 0.8)',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 8,
      borderWidth: 1,
      borderColor: 'rgba(148, 163, 184, 0.5)',
  },
  activeChip: {
      backgroundColor: '#14b8a6',
      borderColor: '#14b8a6',
  },
  chipText: {
      color: '#cbd5e1',
      fontSize: 12,
  },
  activeChipText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 12,
  },
  detail: {
      color: '#cbd5e1',
      marginBottom: 4,
  },
  link: {
      color: '#14b8a6',
      marginTop: 8,
  },
  activityTitle: {
      color: '#94a3b8',
      marginBottom: 8,
      marginLeft: 4,
  },
  activityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
  },
  activityAmt: {
      color: '#14b8a6',
      fontWeight: 'bold',
      fontSize: 16,
      width: 50,
  },
  activityDesc: {
      color: 'white',
      fontSize: 14,
  },
  activityDate: {
      color: '#94a3b8',
      fontSize: 12,
  },
  activityBadge: {
      backgroundColor: 'rgba(20, 184, 166, 0.2)',
      marginLeft: 'auto',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
  },
  activityBadgeText: {
      color: '#14b8a6',
      fontSize: 10,
      fontWeight: 'bold',
  }
});

export default WalletScreen;