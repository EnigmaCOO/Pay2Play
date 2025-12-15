
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ScreenBackground from '../../shared/ui/ScreenBackground';
import AppHeader from '../../shared/ui/AppHeader';
import GlassCard from '../../shared/ui/GlassCard';
import PrimaryButton from '../../shared/ui/PrimaryButton';

const MatchDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Mock data
  const match = {
      title: '5-a-side high tempo',
      host: 'Abdullah Faisal',
      time: 'Today · 8:00–9:00 PM',
      venue: 'Star Futsal Arena · DHA Phase 5',
      confirmed: true,
      filled: 8,
      total: 10,
      skill: 'Intermediate',
      type: 'Friendly',
      cost: 'PKR 400',
      note: 'Bring turf shoes, no studs please.'
  };

  return (
    <ScreenBackground>
      <AppHeader title="Match details" onBack={() => router.back()} />
      <ScrollView>
        <View style={styles.header}>
            <View style={styles.badge}><Text style={styles.badgeText}>Host-led · Slot confirmed</Text></View>
            <View style={[styles.badge, styles.sportBadge]}><Text style={styles.badgeText}>Football</Text></View>
        </View>
        <Text style={styles.title}>{match.title}</Text>
        <Text style={styles.host}>Host: {match.host} · Verified host</Text>

        <GlassCard>
            <Text style={styles.cardInfo}>{match.time}</Text>
            <Text style={styles.cardInfo}>{match.venue}</Text>
            <Text style={styles.confirmed}>Slot confirmed via Pay2Play</Text>
        </GlassCard>

        <GlassCard>
            <View style={styles.playersRow}>
                {/* Avatars placeholder */}
                <View style={styles.avatarCircle} />
                <View style={styles.avatarCircle} />
                <View style={styles.avatarCircle} />
                <Text style={styles.morePlayers}>+5</Text>
            </View>
            <Text style={styles.progressText}>{match.filled} of {match.total} spots filled</Text>
            <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${(match.filled/match.total)*100}%` }]} />
            </View>
            <View style={styles.chips}>
                <View style={styles.chip}><Text style={styles.chipText}>Skill: {match.skill}</Text></View>
                <View style={styles.chip}><Text style={styles.chipText}>Game: {match.type}</Text></View>
            </View>
        </GlassCard>

        <GlassCard>
            <Text style={styles.detailLine}>Game type: {match.type}</Text>
            <Text style={styles.detailLine}>Payment: {match.cost} each · Pay at venue</Text>
            <Text style={styles.detailLine}>Notes from host:</Text>
            <Text style={styles.note}>{match.note}</Text>
        </GlassCard>
      </ScrollView>

      <View style={styles.footer}>
          <View>
              <Text style={styles.footerText}>Needs {match.total - match.filled} more players</Text>
              <Text style={styles.footerSub}>Tonight · 8:00–9:00 PM</Text>
          </View>
          <PrimaryButton title="Request to join" onPress={() => {/* Join logic */}} />
      </View>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  header: {
      flexDirection: 'row',
      marginTop: 10,
  },
  badge: {
    backgroundColor: 'rgba(20, 184, 166, 0.2)',
    padding: 4,
    borderRadius: 4,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#14b8a6',
  },
  sportBadge: {
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  title: {
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold',
      marginVertical: 8,
  },
  host: {
      color: '#94a3b8',
      marginBottom: 16,
  },
  cardInfo: {
      color: 'white',
      fontSize: 16,
      marginBottom: 4,
  },
  confirmed: {
      color: '#14b8a6',
      marginTop: 8,
  },
  playersRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
  },
  avatarCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#475569',
      marginRight: -8,
      borderWidth: 2,
      borderColor: '#1e293b',
  },
  morePlayers: {
      color: 'white',
      marginLeft: 16,
  },
  progressText: {
      color: '#14b8a6',
      marginBottom: 4,
  },
  progressBar: {
      height: 6,
      backgroundColor: '#334155',
      borderRadius: 3,
      marginBottom: 10,
  },
  progressFill: {
      height: 6,
      backgroundColor: '#14b8a6',
      borderRadius: 3,
  },
  chips: {
      flexDirection: 'row',
  },
  chip: {
      backgroundColor: '#334155',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      marginRight: 8,
  },
  chipText: {
      color: 'white',
      fontSize: 12,
  },
  detailLine: {
      color: 'white',
      marginBottom: 4,
  },
  note: {
      color: '#94a3b8',
      fontStyle: 'italic',
  },
  footer: {
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: '#334155',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  footerText: {
      color: '#14b8a6',
      fontWeight: 'bold',
  },
  footerSub: {
      color: 'white',
  }
});

export default MatchDetailScreen;
