
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import ScreenBackground from '../../../../shared/ui/ScreenBackground';
import HomeHeader from '../../components/home/HomeHeader';
import HeroActionCard from '../../components/home/HeroActionCard';
import SectionHeader from '../../components/home/SectionHeader';
import HostMatchCard from '../../components/matches/HostMatchCard';
import VenueCard from '../../components/venues/VenueCard';
import EventMiniCard from '../../components/events/EventMiniCard';
import FilterChipsRow from '../../components/home/FilterChipsRow';

const HomeScreen = ({ navigation }) => {
  return (
    <ScreenBackground>
      <HomeHeader userName="Abdullah" location="Lahore" />
      <ScrollView>
        <View style={styles.container}>
            <FilterChipsRow />
            <HeroActionCard onPress={() => navigation.navigate('Venues')} />

            <SectionHeader title="Games needing players" cta="View all" onCtaPress={() => navigation.navigate('Matches')} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <HostMatchCard />
                <HostMatchCard />
            </ScrollView>

            <SectionHeader title="Top venues for you" cta="See all" onCtaPress={() => navigation.navigate('Venues')} />
            <VenueCard />
            <VenueCard />

            <SectionHeader title="Leagues & events" cta="All events" onCtaPress={() => { /* Navigate to events */ }} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <EventMiniCard />
                <EventMiniCard />
            </ScrollView>
        </View>
      </ScrollView>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

export default HomeScreen;
