
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

interface HomeHeaderProps {
  userName: string;
  location: string;
  onLocationPress?: () => void;
}

const HomeHeader = ({ userName, location, onLocationPress }: HomeHeaderProps) => {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>Hey, {userName} 👋</Text>
        <Text style={styles.prompt}>Ready to play this week?</Text>
      </View>
      <Pressable onPress={onLocationPress} style={({pressed}) => [styles.locationChip, pressed && styles.pressed]}>
        <Text style={styles.locationText}>📍 {location} ▾</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Outfit',
  },
  prompt: {
    color: '#94a3b8',
    fontFamily: 'Inter',
  },
  locationChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 9999,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
  },
  pressed: {
    opacity: 0.8,
  },
  locationText: {
    color: '#FFFFFF',
    fontFamily: 'Inter',
    fontWeight: '500',
  }
});

export default HomeHeader;
