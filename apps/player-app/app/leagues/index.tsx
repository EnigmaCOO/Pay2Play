import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenBackground from '@shared/ui/ScreenBackground';
import AppHeader from '@shared/ui/AppHeader';
import EventCard from '../components/events/EventCard';
import FilterChipsRow from '../components/home/FilterChipsRow';

const LeaguesScreen = () => {
  const router = useRouter();
  
  const heroEvent = {
    id: '1',
    title: 'Ramzan Night League 2025',
    sport: 'Football · 7-a-side',
    date: '10 Mar to 5 Apr',
    location: 'Model Town Sports Complex',
    badge: 'Spots filling fast',
  };

  const upcomingLeagues = [
      {
          id: '2',
          title: 'Weekend 7-a-side Premier League',
          sport: 'Football · 7-a-side · 8 teams',
          date: '15 Jan to 10 Feb',
          location: 'Star Futsal Arena · DHA',
      },
  ];

  const oneDayEvents = [
    {
        id: '3',
        title: 'Sunday Padel Shootout',
        sport: 'Padel · Doubles · 16 teams',
        date: 'Sun 22 Dec · 4:00-11:00 PM',
        location: 'Padel Club Lahore · Gulberg',
        price: 'PKR 1500 per team',
    },
  ];

  return (
    <ScreenBackground>
      <AppHeader title="Leagues & events" onBack={() => router.back()} />
      <Text style={styles.subtitle}>Discover tournaments and special events.</Text>
      
      <View style={{ paddingHorizontal: 16 }}>
        <FilterChipsRow />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.heroCard}>
            <Text style={styles.heroTitle}>{heroEvent.title}</Text>
            <Text style={styles.heroDetails}>{heroEvent.sport}</Text>
            <Text style={styles.heroDetails}>{heroEvent.date}</Text>
            <Text style={styles.heroLocation}>{heroEvent.location}</Text>
            {/* Further hero styling needed */}
        </View>

        <Text style={styles.sectionTitle}>Upcoming leagues</Text>
        {upcomingLeagues.map(event => <EventCard key={event.id} {...event} />)}

        <Text style={styles.sectionTitle}>One-day events</Text>
        {oneDayEvents.map(event => <EventCard key={event.id} {...event} />)}
      </ScrollView>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
      padding: 16,
  },
  subtitle: {
      color: '#94a3b8',
      textAlign: 'center',
      marginBottom: 16,
  },
  heroCard: {
      backgroundColor: 'rgba(59, 130, 246, 0.3)',
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: '#3b82f6',
  },
  heroTitle: {
      color: 'white',
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 8,
  },
  heroDetails: {
      color: 'white',
      fontSize: 16,
  },
  heroLocation: {
      color: '#94a3b8',
      fontSize: 14,
      marginTop: 4,
  },
  sectionTitle: {
    color: '#94a3b8',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
    marginLeft: 4,
  }
});

export default LeaguesScreen;