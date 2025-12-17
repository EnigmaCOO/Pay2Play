
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenBackground from '@shared/ui/ScreenBackground';
import FilterChipsRow from '../components/home/FilterChipsRow'; // Reusing for now
import MatchCard from '../components/matches/MatchCard';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function MatchesScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState('Near me');

  const matches = [
    {
      id: '1',
      type: 'host-led',
      sport: 'Football',
      title: '5-a-side high tempo',
      time: 'Tonight · 9:00–10:00 PM',
      location: 'Star Futsal Arena · DHA Phase 5',
      playersInfo: 'Host + 5 joined · Needs 2 players',
      paymentInfo: 'PKR 400 each',
      badge: 'Host-led · Slot confirmed',
      actionLabel: 'Join now',
    },
    {
      id: '2',
      type: 'lfp',
      sport: 'Cricket',
      title: 'Casual tape-ball in DHA',
      time: 'Friday · 11:00 PM – 1:00 AM',
      location: 'DHA · Looking for ground',
      playersInfo: 'Host + 2 joined · Needs 4 players',
      paymentInfo: 'Pay at venue',
      badge: 'Looking for players',
      actionLabel: 'Request to join',
    }
  ];

  return (
    <ScreenBackground>
      <View style={styles.header}>
        <Text style={styles.title}>Matches</Text>
        <TouchableOpacity>
            <Text style={styles.filterText}>Filters ▾</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>Find games you can join today</Text>
      
      <View style={styles.filters}>
        <FilterChipsRow />
      </View>

      <TouchableOpacity style={styles.hostButton} onPress={() => router.push('/matches/host')}>
        <IconSymbol name="plus" size={20} color="#14b8a6" /> 
        <Text style={styles.hostButtonText}>Host a match</Text>
      </TouchableOpacity>

      <View style={styles.list}>
        {matches.map((match) => (
            <MatchCard 
                key={match.id}
                type={match.type as any}
                sport={match.sport}
                title={match.title}
                time={match.time}
                location={match.location}
                playersInfo={match.playersInfo}
                paymentInfo={match.paymentInfo}
                badge={match.badge}
                actionLabel={match.actionLabel}
                onAction={() => router.push(`/matches/${match.id}`)}
            />
        ))}
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  filterText: {
      color: '#14b8a6',
      fontSize: 16,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 16,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  filters: {
      paddingHorizontal: 16,
  },
  hostButton: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      marginHorizontal: 16,
      marginVertical: 10,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#14b8a6',
  },
  hostButtonText: {
      color: '#14b8a6',
      fontWeight: 'bold',
      marginLeft: 8,
  },
  list: {
      padding: 16,
  }
});
