
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function VenuesScreen() {
  const { data: venues, isLoading, isFetching, refetch, isError } = useQuery({
    queryKey: ['venues'],
    queryFn: () => api.get('/api/venues/search'),
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading venues...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Venues</Text>
        {isError && <Text style={styles.offline}>📡 Offline - Showing cached data</Text>}
      </View>
      <FlatList
        data={venues || []}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor="#0EA472" />
        }
        renderItem={({ item }) => (
          <View style={styles.venueCard}>
            <Text style={styles.venueName}>{item.name}</Text>
            <Text>{item.location}</Text>
            {item.sports?.length > 0 && (
              <Text style={styles.sports}>Sports: {item.sports.join(', ')}</Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No venues available</Text>
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
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    marginTop: 4,
  },
  venueCard: {
    padding: 16,
    margin: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#0EA472',
  },
  venueName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  sports: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#666',
  },
});
