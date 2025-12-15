
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenBackground from '../../shared/ui/ScreenBackground';
import PrimaryButton from '../../shared/ui/PrimaryButton';

const MatchPublishedScreen = () => {
  const router = useRouter();

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <Text style={styles.title}>Match Published!</Text>
        <Text style={styles.subtitle}>Your game is now live.</Text>
        <PrimaryButton title="Go to Matches" onPress={() => router.replace('/(tabs)/matches')} />
      </View>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 18,
    marginBottom: 20,
  }
});

export default MatchPublishedScreen;
