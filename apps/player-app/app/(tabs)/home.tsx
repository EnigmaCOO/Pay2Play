import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import DashboardHeader from '../components/home/DashboardHeader';
import BookNowBanner from '../components/home/BookNowBanner';
import ActionGridCard from '../components/home/ActionGridCard';
import VisitStoreBanner from '../components/home/VisitStoreBanner';
import UpcomingMatchCard from '../components/home/UpcomingMatchCard';

const HomeScreen = () => {
  const router = useRouter();

  const renderAcademiesIcon = () => (
    <View style={styles.iconWrapper}>
      <View style={styles.academyIcon}>
        <View style={styles.academyCircle} />
        <View style={styles.academyBase} />
      </View>
    </View>
  );

  const renderTeamsIcon = () => (
    <View style={styles.iconWrapper}>
      <View style={styles.teamsIcon}>
        <View style={styles.personCircle} />
        <View style={styles.personCircle} />
      </View>
    </View>
  );

  const renderTournamentsIcon = () => (
    <View style={styles.iconWrapper}>
      <View style={styles.tournamentIcon}>
        <View style={styles.nodeCircle} />
        <View style={styles.nodeCircle} />
        <View style={styles.nodeCircle} />
        <View style={styles.connectorLine} />
      </View>
    </View>
  );

  const renderLeaguesIcon = () => (
    <View style={styles.iconWrapper}>
      <View style={styles.trophyIcon}>
        <View style={styles.trophyCup} />
        <View style={styles.trophyBase} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <DashboardHeader
          onWalletPress={() => router.push('/profile/wallet')}
          onNotificationPress={() => {}}
          onProfilePress={() => router.push('/(tabs)/profile')}
        />
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <BookNowBanner onPress={() => router.push('/(tabs)/venues')} />
          
          <View style={styles.actionsGrid}>
            <ActionGridCard
              title="Academies"
              icon={renderAcademiesIcon()}
              onPress={() => {}}
            />
            <ActionGridCard
              title="Teams"
              icon={renderTeamsIcon()}
              onPress={() => {}}
            />
            <ActionGridCard
              title="Tournaments"
              icon={renderTournamentsIcon()}
              onPress={() => {}}
            />
            <ActionGridCard
              title="Leagues"
              icon={renderLeaguesIcon()}
              onPress={() => router.push('/leagues')}
            />
          </View>

          <VisitStoreBanner onPress={() => {}} />

          <View style={styles.upcomingSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Matches</Text>
              <Text style={styles.viewAll}>View all</Text>
            </View>
            
            <UpcomingMatchCard
              title="2v2 Padel"
              organizer="Hajra"
              players={0}
              maxPlayers={4}
              onPress={() => router.push('/matches')}
            />
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
  },
  upcomingSection: {
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  viewAll: {
    fontSize: 14,
    color: '#f59e0b',
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 100,
  },
  iconWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  academyIcon: {
    alignItems: 'center',
  },
  academyCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginBottom: 2,
  },
  academyBase: {
    width: 20,
    height: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderTopWidth: 0,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  teamsIcon: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  personCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  tournamentIcon: {
    position: 'relative',
    width: 36,
    height: 32,
  },
  nodeCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    position: 'absolute',
  },
  connectorLine: {
    position: 'absolute',
    top: 16,
    left: 6,
    right: 6,
    height: 2,
    backgroundColor: '#FFFFFF',
  },
  trophyIcon: {
    alignItems: 'center',
  },
  trophyCup: {
    width: 28,
    height: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomWidth: 0,
    marginBottom: 2,
  },
  trophyBase: {
    width: 20,
    height: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
});

export default HomeScreen;
