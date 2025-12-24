import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenBackground from '@shared/ui/ScreenBackground';
import HomeHeader from '../components/home/HomeHeader';
import FilterChipsRow from '../components/home/FilterChipsRow';
import HeroActionCard from '../components/home/HeroActionCard';
import SectionHeader from '../components/home/SectionHeader';
import HostMatchCard from '../components/matches/HostMatchCard';
import VenueCard from '../components/venues/VenueCard';
import EventMiniCard from '../components/events/EventMiniCard';

const HomeScreen = () => {
  const router = useRouter();

  return (
    <ScreenBackground>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader 
          userName="Abdullah" 
          location="Lahore" 
          onLocationPress={() => {}}
        />
        
        <FilterChipsRow 
          filters={['Tonight', 'This weekend', 'My sports']} 
          selectedFilter="Tonight"
          onFilterChange={(filter) => console.log('Filter:', filter)}
        />

        <View style={styles.heroContainer}>
          <HeroActionCard 
            onPress={() => router.push('/(tabs)/venues')} 
            onSeeAllPress={() => router.push('/(tabs)/venues')}
          />
        </View>

        {/* Section: Matches looking for players */}
        <View style={styles.sectionContainer}>
          <SectionHeader 
            title="Games needing players near you" 
            cta="View all" 
            onCtaPress={() => router.push('/(tabs)/matches')}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            <HostMatchCard 
              sport="Football" 
              format="5-a-side" 
              time="Tonight · 9:00 PM" 
              location="DHA Phase 5" 
              venue="Turf Arena" 
              playersNeeded={2} 
            />
            <HostMatchCard 
              sport="Cricket" 
              format="Tape Ball" 
              time="Tonight · 10:00 PM" 
              location="Model Town" 
              venue="C Block Park" 
              playersNeeded={4} 
            />
          </ScrollView>
        </View>

        {/* Section: Top venues */}
        <View style={styles.sectionContainer}>
          <SectionHeader 
            title="Top venues for you in Lahore" 
            cta="See all" 
            onCtaPress={() => router.push('/(tabs)/venues')}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            <VenueCard 
              name="Star Futsal Arena"
              area="DHA Phase 5"
              price="PKR 5,000 / hr"
              discount="Save 20%"
              nextSlot="Tonight: 8 PM"
              imageUrl="https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=600&auto=format&fit=crop"
            />
            <VenueCard 
              name="Smash Padel Court"
              area="Gulberg III"
              price="PKR 6,000 / hr"
              discount="Save 10%"
              nextSlot="Tomorrow: 6 PM"
              imageUrl="https://images.unsplash.com/photo-1626248982363-22b07e43d3b7?q=80&w=600&auto=format&fit=crop"
            />
          </ScrollView>
        </View>

        {/* Section: Leagues & Events */}
        <View style={styles.sectionContainer}>
          <SectionHeader 
            title="Leagues & events this month" 
            cta="All" 
            onCtaPress={() => {}}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            <EventMiniCard 
              title="Ramzan Night League"
              dateRange="Feb 10 – Mar 05"
              sport="Football"
            />
            <EventMiniCard 
              title="Weekend Padel Cup"
              dateRange="Mar 15 – Mar 16"
              sport="Padel"
            />
             <EventMiniCard 
              title="Corporate Cricket League"
              dateRange="Apr 01 – Apr 20"
              sport="Cricket"
            />
          </ScrollView>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20,
  },
  heroContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  horizontalScroll: {
    paddingBottom: 8,
  },
  bottomSpacer: {
    height: 100, // Space for bottom tab bar
  },
});

export default HomeScreen;
