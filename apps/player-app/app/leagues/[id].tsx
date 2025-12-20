import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ScreenBackground from '@shared/ui/ScreenBackground';
import AppHeader from '@shared/ui/AppHeader';
import GlassCard from '@shared/ui/GlassCard';
import PrimaryButton from '@shared/ui/PrimaryButton';

const EventDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <ScreenBackground>
      <AppHeader title="Ramzan Night League 2025" onBack={() => router.back()} />
      <ScrollView>
        <View style={styles.banner}>
            <Text style={styles.bannerText}>Hero Banner Placeholder</Text>
            <View style={styles.bannerBadge}><Text style={styles.bannerBadgeText}>Slots open</Text></View>
        </View>

        <View style={styles.chips}>
            {['10 Mar – 5 Apr', 'Fri/Sat nights', 'Lahore', '7-a-side'].map((label, i) => (
                <View key={i} style={styles.chip}><Text style={styles.chipText}>{label}</Text></View>
            ))}
        </View>

        <GlassCard>
            <Text style={styles.cardTitle}>Summary</Text>
            <Text style={styles.detail}>Dates: 10 Mar – 5 Apr 2025</Text>
            <Text style={styles.detail}>Match days: Fri & Sat nights</Text>
            <Text style={styles.detail}>Venue: Model Town Sports Complex</Text>
            <Text style={styles.detail}>Format: 7-a-side · Group stage + knockouts</Text>
            <Text style={styles.detail}>Fee: PKR 25,000 per team</Text>
            <Text style={styles.detail}>Prizes: Trophy + medals + PKR 100,000</Text>
        </GlassCard>

        <GlassCard>
            <Text style={styles.cardTitle}>Rules & Format</Text>
            <Text style={styles.detail}>• Max 10 registered players per team</Text>
            <Text style={styles.detail}>• Rolling subs allowed</Text>
            <Text style={styles.detail}>• Standard 7-a-side rules</Text>
            <TouchableOpacity><Text style={styles.link}>Read more</Text></TouchableOpacity>
        </GlassCard>

        <GlassCard>
            <Text style={styles.cardTitle}>Registration</Text>
            <Text style={styles.detail}>Register via Pay2Play</Text>
            <Text style={styles.subDetail}>Tap below to send your details to the organizer.</Text>
            <View style={styles.regButtons}>
                <TouchableOpacity style={styles.regButton}><Text style={styles.regButtonText}>Register interest</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.regButton, styles.outline]}><Text style={[styles.regButtonText, styles.outlineText]}>WhatsApp</Text></TouchableOpacity>
            </View>
        </GlassCard>
      </ScrollView>

      <View style={styles.footer}>
          <View>
              <Text style={styles.footerPrice}>From PKR 25,000 / team</Text>
              <Text style={styles.footerClose}>Registration closes in 5 days</Text>
          </View>
          <PrimaryButton title="Register" onPress={() => {}} />
      </View>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  banner: {
      height: 150,
      backgroundColor: '#334155',
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
      position: 'relative',
  },
  bannerText: {
      color: '#94a3b8',
  },
  bannerBadge: {
      position: 'absolute',
      bottom: 10,
      right: 10,
      backgroundColor: '#10b981',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
  },
  bannerBadgeText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 12,
  },
  chips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 10,
  },
  chip: {
      backgroundColor: '#1e293b',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 20,
      marginRight: 8,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: '#334155',
  },
  chipText: {
      color: '#cbd5e1',
      fontSize: 12,
  },
  cardTitle: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
  },
  detail: {
      color: 'white',
      marginBottom: 4,
  },
  subDetail: {
      color: '#94a3b8',
      fontSize: 12,
      marginBottom: 10,
  },
  link: {
      color: '#3b82f6',
      marginTop: 4,
  },
  regButtons: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 10,
  },
  regButton: {
      backgroundColor: '#3b82f6',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
  },
  outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: '#3b82f6',
  },
  regButtonText: {
      color: 'white',
      fontWeight: 'bold',
  },
  outlineText: {
      color: '#3b82f6',
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
  footerPrice: {
      color: 'white',
      fontWeight: 'bold',
  },
  footerClose: {
      color: '#f87171',
      fontSize: 12,
  }
});

export default EventDetailScreen;