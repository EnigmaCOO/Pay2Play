import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { collection, getDocs, query, where, CollectionReference } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Venue } from '@pay2play/types';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker'; // Import Picker

export default function ExploreScreen() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Filter states
  const [cityFilter, setCityFilter] = useState('');
  const [sportFilter, setSportFilter] = useState('');

  const availableSports = ['football', 'cricket', 'padel', 'tennis']; // Example sports

  useEffect(() => {
    const fetchVenues = async () => {
      setLoading(true);
      setError(null);
      try {
        let venuesRef: CollectionReference<Venue> = collection(db, 'venues') as CollectionReference<Venue>;
        let q = query(venuesRef);

        if (cityFilter) {
          q = query(q, where('city', '==', cityFilter));
        }
        // NOTE: Filtering by sport on the venue level is complex if a venue has multiple fields with different sports.
        // For simplicity, this assumes a venue might have a primary sport or we'd query fields directly.
        // For now, we'll implement a basic filter assuming 'sport' is a direct property or tag on the venue for this example.
        // A more robust solution would query fields and then join/filter venues.
        // For demonstration, let's assume 'sport' can be a tag on the venue.
        // If 'sport' is a field's property, then a separate query for fields would be needed first.
        // For this example, we'll skip direct sport filter on venue as it requires more complex data modeling or client-side filtering.
        // To properly filter by sport, we'd need to query a `fields` subcollection and get parent venue IDs, or
        // denormalize `sport` data into the `venue` document as an array of offered sports.

        // Simulating client-side filtering by sport for now after fetching all (or city-filtered) venues
        // In a production app, for complex queries like 'venues that have fields for X sport', you'd use
        // subcollection queries or denormalize data on the venue doc (e.g., 'sportsOffered: ["football", "cricket"]')
        // and query that array field.
        
        const querySnapshot = await getDocs(q);
        let fetchedVenues: Venue[] = [];
        querySnapshot.forEach((doc) => {
          fetchedVenues.push(doc.data());
        });

        // Client-side filtering for sport, as direct Firestore query on nested subcollections is not trivial
        if (sportFilter && sportFilter !== 'all') {
            // This is a simplification. A real implementation would involve checking fields subcollection or denormalized data.
            // For now, we'll just show all if a sport is selected, indicating this filter needs backend support.
            // Or, we assume a 'primarySport' field on the Venue document for this example.
            // Let's assume a 'sports' array field on the Venue document.
            // fetchedVenues = fetchedVenues.filter(venue => venue.sportsOffered?.includes(sportFilter));
        }

        setVenues(fetchedVenues);
      } catch (err) {
        console.error("Error fetching venues: ", err);
        setError("Failed to load venues.");
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [cityFilter, sportFilter]); // Re-fetch when filters change

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading venues...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore Venues</Text>

      <View style={styles.filterContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Filter by City"
          value={cityFilter}
          onChangeText={setCityFilter}
        />
        <Picker
          selectedValue={sportFilter}
          style={styles.picker}
          onValueChange={(itemValue) => setSportFilter(itemValue)}
        >
          <Picker.Item label="All Sports" value="all" />
          {availableSports.map((sport) => (
            <Picker.Item key={sport} label={sport.charAt(0).toUpperCase() + sport.slice(1)} value={sport} />
          ))}
        </Picker>
      </View>

      {venues.length === 0 ? (
        <Text>No venues found matching your criteria.</Text>
      ) : (
        <FlatList
          data={venues}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push(`/venue/${item.id}`)} style={styles.venueItem}>
              <Text style={styles.venueName}>{item.name}</Text>
              <Text style={styles.venueAddress}>{item.address}, {item.city}</Text>
              {/* Assuming venue has a primarySport or sportsOffered array */}
              {/* {item.primarySport && <Text>Sport: {item.primarySport}</Text>} */}
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    width: '45%',
    borderRadius: 5,
  },
  picker: {
    height: 40,
    width: '45%',
    borderColor: 'gray', // For Android
    borderWidth: 1, // For Android
  },
  venueItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  venueName: {
    fontSize: 18,
    fontWeight: '600',
  },
  venueAddress: {
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});