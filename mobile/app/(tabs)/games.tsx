
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function GamesScreen() {
  const { data: games, isLoading } = useQuery({
    queryKey: ['games'],
    queryFn: () => api.get('/api/games/search?sport=all'),
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading games...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pickup Games</Text>
      </View>
      <FlatList
        data={games || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.gameCard}>
            <Text style={styles.gameSport}>{item.sport.toUpperCase()}</Text>
            <Text>{item.currentPlayers}/{item.maxPlayers} players</Text>
            <Text>PKR {item.pricePerPlayerPkr} per player</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No games available</Text>
        }
      />
    </View>
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
  },
  gameCard: {
    padding: 16,
    margin: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#0EA472',
  },
  gameSport: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#666',
  },
});
