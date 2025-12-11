import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { Booking } from '@pay2play/types';
import { onAuthStateChanged } from 'firebase/auth';
import ScreenBackground from '../../shared/ui/ScreenBackground';
import BookingCard from '../components/booking/BookingCard';
import SegmentedTabs from '../../shared/ui/SegmentedTabs';

export default function MyBookingsScreen() {
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Upcoming');

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); 
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const bookingsRef = collection(db, 'bookings');
    const userBookingsQuery = query(
      bookingsRef,
      where('userId', '==', user.uid),
      orderBy('slotStartTime', 'desc')
    );

    const unsubscribeBookings = onSnapshot(
      userBookingsQuery,
      (querySnapshot) => {
        const fetchedBookings: Booking[] = [];
        querySnapshot.forEach((doc) => {
          fetchedBookings.push(doc.data() as Booking);
        });
        setBookings(fetchedBookings);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching bookings: ", err);
        setError("Failed to load your bookings.");
        setLoading(false);
      }
    );

    return () => unsubscribeBookings();
  }, [user]);

  const filteredBookings = bookings.filter(b => {
      const isUpcoming = new Date(b.slotStartTime.seconds * 1000) > new Date();
      return activeTab === 'Upcoming' ? isUpcoming : !isUpcoming;
  });

  if (loading) {
    return (
      <ScreenBackground>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </ScreenBackground>
    );
  }

  if (!user) {
    return (
      <ScreenBackground>
        <View style={styles.container}>
          <Text style={styles.messageText}>Please log in to view your bookings.</Text>
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
        <Text style={styles.title}>My Bookings</Text>
        <SegmentedTabs 
            tabs={['Upcoming', 'Past']}
            activeTab={activeTab}
            onTabChange={setActiveTab}
        />
        {filteredBookings.length === 0 ? (
          <Text style={styles.messageText}>You have no {activeTab.toLowerCase()} bookings.</Text>
        ) : (
          <FlatList
            data={filteredBookings}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <BookingCard booking={item} />}
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
  messageText: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});
