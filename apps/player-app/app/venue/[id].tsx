import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Text, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db, functions, auth } from '../../lib/firebase';
import { Venue, Field, Slot } from '@pay2play/types';
import { httpsCallable } from 'firebase/functions';
import { onAuthStateChanged } from 'firebase/auth';

import VenueHeader from '../components/venues/VenueHeader';
import VenueImageCarousel from '../components/venues/VenueImageCarousel';
import VenueInfoStrip from '../components/venues/VenueInfoStrip';
import ScreenBackground from '@shared/ui/ScreenBackground';
import SegmentedTabs from '@shared/ui/SegmentedTabs';
import DateChipStrip from '@shared/ui/DateChipStrip';
import SlotGrid from '../components/venues/SlotGrid';
import BookingFooterBar from '../components/venues/BookingFooterBar';

const getAvailableSlotsCallable = httpsCallable(functions, 'getAvailableSlots');
const createBookingCallable = httpsCallable(functions, 'createBooking');

export default function VenueDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [activeTab, setActiveTab] = useState('Availability');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [fetchingSlots, setFetchingSlots] = useState(false);

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const fetchVenueDetails = async () => {
      if (!id || typeof id !== 'string') {
        setError('Invalid Venue ID.');
        setLoading(false);
        return;
      }

      try {
        const venueDocRef = doc(db, 'venues', id);
        const venueDocSnap = await getDoc(venueDocRef);

        if (venueDocSnap.exists()) {
          const fetchedVenue = venueDocSnap.data() as Venue;
          setVenue(fetchedVenue);

          const fieldsCollectionRef = collection(db, `venues/${id}/fields`);
          const fieldsQuerySnapshot = await getDocs(fieldsCollectionRef);
          const fetchedFields: Field[] = [];
          fieldsQuerySnapshot.forEach(fieldDoc => {
            fetchedFields.push(fieldDoc.data() as Field);
          });
          setFields(fetchedFields);
          if (fetchedFields.length > 0) {
            setSelectedField(fetchedFields[0]);
          }

        } else {
          setError('Venue not found.');
        }
      } catch (err) {
        console.error("Error fetching venue details: ", err);
        setError("Failed to load venue details.");
      } finally {
        setLoading(false);
      }
    };

    fetchVenueDetails();

    return () => unsubscribeAuth();
  }, [id]);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedField) {
        setAvailableSlots([]);
        return;
      }

      setFetchingSlots(true);
      setError(null);
      try {
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        const result: any = await getAvailableSlotsCallable({
          fieldId: selectedField.id,
          startDate: startOfDay.toISOString(),
          endDate: endOfDay.toISOString(),
        });

        if (result.data && result.data.success) {
          setAvailableSlots(result.data.slots);
        } else {
          setError(result.data?.message || "Failed to fetch slots.");
        }
      } catch (err: any) {
        console.error("Error fetching available slots: ", err);
        setError(err.message || "Failed to fetch available slots.");
      } finally {
        setFetchingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedField, selectedDate]);

  const handleBooking = () => {
      if (!selectedSlot) {
          Alert.alert("No slot selected", "Please select a slot to continue.");
          return;
      }
      // For now, navigate to a placeholder booking review screen.
      // We will create this screen next.
      router.push('/booking/review');
  }

  if (loading) {
    return (
      <ScreenBackground>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </ScreenBackground>
    );
  }

  if (error) {
    return (
      <ScreenBackground>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'red' }}>{error}</Text>
        </View>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
        <VenueHeader name={venue?.name || 'Venue'} onBack={() => router.back()} />
        <ScrollView>
            <VenueImageCarousel images={venue?.imageUrls}/>
            <View style={styles.content}>
                <VenueInfoStrip rating="4.7" price="5,000" discount="20%" />
                <SegmentedTabs 
                    tabs={['About', 'Availability', 'Location']}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />
                {activeTab === 'Availability' && (
                    <>
                        <DateChipStrip dates={dates} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
                        {fetchingSlots ? <ActivityIndicator color="#fff" /> : 
                          <SlotGrid slots={availableSlots} onSelectSlot={setSelectedSlot} selectedSlot={selectedSlot}/>
                        }
                    </>
                )}
                {activeTab === 'About' && <Text style={{color: 'white'}}>{venue?.description}</Text>}
            </View>
        </ScrollView>
        {selectedSlot && <BookingFooterBar slot={selectedSlot} onContinue={handleBooking} />}
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    alignItems: 'center',
  },
  venueImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  venueName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  venueAddress: {
    fontSize: 18,
    color: '#555',
    marginBottom: 5,
    textAlign: 'center',
  },
  venueDescription: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  fieldSelectionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  fieldSelectionButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
  },
  selectedFieldButton: {
    backgroundColor: '#4CAF50',
  },
  selectedFieldButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dateSelectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  selectedDateText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  slotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  slotButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedSlotButton: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  selectedSlotButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bookingSummary: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  bookingSummaryText: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  loginPrompt: {
    color: 'orange',
    marginTop: 10,
  },
  paymentSection: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#e8f5e9', // Light green background
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#a5d6a7',
  }
});