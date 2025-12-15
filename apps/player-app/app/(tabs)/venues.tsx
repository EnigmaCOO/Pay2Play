import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { collection, getDocs, query, where, CollectionReference } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Venue } from '@pay2play/types';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker'; // Import Picker
import ScreenBackground from '@shared/ui/ScreenBackground';
import VenueCard from '../components/venues/VenueCard';

export default function VenuesScreen() {
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
        
        const querySnapshot = await getDocs(q);
        let fetchedVenues: Venue[] = [];
        querySnapshot.forEach((doc) => {
          fetchedVenues.push({id: doc.id, ...doc.data()} as Venue);
        });

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
      <ScreenBackground>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </ScreenBackground>
    );
  }

  if (error) {
    return (
      <ScreenBackground>
        <View style={styles.container}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <Text style={styles.title}>Explore Venues</Text>

        <View style={styles.filterContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Filter by City"
            value={cityFilter}
            onChangeText={setCityFilter}
            placeholderTextColor="#94a3b8"
          />
          <Picker
            selectedValue={sportFilter}
            style={styles.picker}
            onValueChange={(itemValue) => setSportFilter(itemValue)}
            dropdownIconColor="#94a3b8"
          >
            <Picker.Item label="All Sports" value="all" />
            {availableSports.map((sport) => (
              <Picker.Item key={sport} label={sport.charAt(0).toUpperCase() + sport.slice(1)} value={sport} />
            ))}
          </Picker>
        </View>

        {venues.length === 0 ? (
          <Text style={{color: 'white'}}>No venues found matching your criteria.</Text>
        ) : (
          <FlatList
            data={venues}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable onPress={() => router.push(`/venue/${item.id}`)}>
                <VenueCard venue={item} />
              </Pressable>
            )}
          />
        )}
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
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
    borderColor: '#475569',
    borderWidth: 1,
    paddingHorizontal: 10,
    width: '45%',
    borderRadius: 8,
    color: 'white',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
  },
  picker: {
    height: 40,
    width: '45%',
    color: 'white',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderWidth: 0,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});