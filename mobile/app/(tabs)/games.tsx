import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { storage, CACHE_KEYS } from '@/lib/storage';
import { useEffect, useState } from 'react';

export default function GamesScreen() {
  const [cachedGames, setCachedGames] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const { data: games, isLoading, refetch, isFetching, isError } = useQuery({
    queryKey: ['games'],
    queryFn: async () => {
      const data = await api.get('/api/games/search?sport=all');
      // Cache the data
      await storage.set(CACHE_KEYS.GAMES, data);
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
  });

  // Load cached data on mount
  useEffect(() => {
    const loadCache = async () => {
      const cached = await storage.get(CACHE_KEYS.GAMES);
      if (cached) {
        setCachedGames(cached as any[]);
      }
    };
    loadCache();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const displayGames = games || cachedGames;

  if (isLoading && displayGames.length === 0) {
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
        {isError && <Text style={styles.offline}>📡 Offline - Showing cached data</Text>}
      </View>
      <FlatList
        data={displayGames}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor="#0EA472"
          />
        }
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
  offline: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
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