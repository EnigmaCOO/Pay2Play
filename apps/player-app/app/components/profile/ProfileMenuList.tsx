
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import GlassCard from '../../../shared/ui/GlassCard';

const ProfileMenuItem = ({ label, href }) => {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.push(href)}>
      <View style={styles.menuItem}>
        <Text style={styles.menuLabel}>{label}</Text>
        <Text style={styles.menuArrow}>›</Text>
      </View>
    </TouchableOpacity>
  );
};

const ProfileMenuList = () => {
  return (
    <GlassCard>
      <ProfileMenuItem label="My bookings" href="/(tabs)/bookings" />
      <ProfileMenuItem label="Rewards & referrals" href="/profile/rewards" />
      <ProfileMenuItem label="Payment methods" href="/profile/payments" />
      <ProfileMenuItem label="Account & settings" href="/profile/settings" />
      <ProfileMenuItem label="Help & support" href="/support" />
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.2)',
  },
  menuLabel: {
    color: 'white',
    fontSize: 16,
  },
  menuArrow: {
    color: '#94a3b8',
    fontSize: 20,
  }
});

export default ProfileMenuList;
