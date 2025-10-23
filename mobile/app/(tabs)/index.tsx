
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to P2P Sports</Text>
        <Text style={styles.subtitle}>Find games, book venues, play sports!</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <Text style={styles.placeholder}>🏏 Find a Cricket Game</Text>
        <Text style={styles.placeholder}>⚽ Book a Football Venue</Text>
        <Text style={styles.placeholder}>🎾 Join a Padel Match</Text>
      </View>

      {user && (
        <View style={styles.section}>
          <Text style={styles.info}>Logged in as: {user.phoneNumber}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#0EA472',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  placeholder: {
    fontSize: 16,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 12,
  },
  info: {
    fontSize: 14,
    color: '#666',
  },
});
