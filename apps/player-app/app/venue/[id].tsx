import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, Image as RNImage, Button, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db, functions, auth } from '../../lib/firebase';
import { Venue, Field, Slot } from '@pay2play/types';
import { httpsCallable } from 'firebase/functions';
import { onAuthStateChanged } from 'firebase/auth';

const getAvailableSlotsCallable = httpsCallable(functions, 'getAvailableSlots');
const createBookingCallable = httpsCallable(functions, 'createBooking');
const createPaymentIntentCallable = httpsCallable(functions, 'createPaymentIntent'); // New callable function

export default function VenueDetailScreen() {
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState<any>(null);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [fetchingSlots, setFetchingSlots] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [latestBookingId, setLatestBookingId] = useState<string | null>(null); // To store booking ID for payment
  const [paymentLoading, setPaymentLoading] = useState(false);

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
          setAvailableSlots(result.data.slots.sort((a: Slot, b: Slot) => a.startTime.toMillis() - b.startTime.toMillis()));
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

  const handleBooking = async () => {
    if (!user) {
      Alert.alert("Authentication Required", "Please log in to make a booking.");
      return;
    }
    if (!selectedSlot) {
      Alert.alert("No Slot Selected", "Please select a time slot to book.");
      return;
    }

    setBookingLoading(true);
    try {
      const result: any = await createBookingCallable({ slotId: selectedSlot.id });
      if (result.data && result.data.success) {
        Alert.alert("Booking Successful!", `Your booking ID: ${result.data.bookingId}`);
        setLatestBookingId(result.data.bookingId); // Store booking ID for payment
        setSelectedSlot(null); // Clear selected slot
        // Re-fetch slots to update availability
        if (selectedField) {
            const startOfDay = new Date(selectedDate);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(selectedDate);
            endOfDay.setHours(23, 59, 59, 999);
            const refetchResult: any = await getAvailableSlotsCallable({
                fieldId: selectedField.id,
                startDate: startOfDay.toISOString(),
                endDate: endOfDay.toISOString(),
            });
            if (refetchResult.data && refetchResult.data.success) {
                setAvailableSlots(refetchResult.data.slots.sort((a: Slot, b: Slot) => a.startTime.toMillis() - b.startTime.toMillis()));
            }
        }
      } else {
        Alert.alert("Booking Failed", result.data?.message || "Could not create booking.");
      }
    } catch (err: any) {
      console.error("Error creating booking:", err);
      Alert.alert("Booking Error", err.message || "An unexpected error occurred during booking.");
    } finally {
      setBookingLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!latestBookingId) {
      Alert.alert("Error", "No booking ID found for payment.");
      return;
    }

    setPaymentLoading(true);
    try {
      const result: any = await createPaymentIntentCallable({ bookingId: latestBookingId });
      if (result.data && result.data.success) {
        Alert.alert("Payment Intent Created!", `Client Secret: ${result.data.clientSecret}\n\nIn a real app, this would be used by a payment SDK.`);
        // Here you would typically use Stripe's SDK to complete the payment
        setLatestBookingId(null); // Clear booking ID after payment intent
      } else {
        Alert.alert("Payment Failed", result.data?.message || "Could not create payment intent.");
      }
    } catch (err: any) {
      console.error("Error creating payment intent:", err);
      Alert.alert("Payment Error", err.message || "An unexpected error occurred during payment intent creation.");
    } finally {
      setPaymentLoading(false);
    }
  };


  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading venue details...</Text>
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

  if (!venue) {
    return (
      <View style={styles.container}>
        <Text>No venue data available.</Text>
      </View>
    );
  }

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.venueName}>{venue.name}</Text>
        {venue.imageUrls && venue.imageUrls.length > 0 && (
          <RNImage source={{ uri: venue.imageUrls[0] }} style={styles.venueImage} />
        )}
        <Text style={styles.venueAddress}>{venue.address}, {venue.city}</Text>
        <Text style={styles.venueDescription}>{venue.description}</Text>

        <Text style={styles.sectionTitle}>Fields:</Text>
        {fields.length === 0 ? (
          <Text>No fields available for this venue.</Text>
        ) : (
          <View style={styles.fieldSelectionContainer}>
            {fields.map((field) => (
              <TouchableOpacity
                key={field.id}
                style={[
                  styles.fieldSelectionButton,
                  selectedField?.id === field.id && styles.selectedFieldButton,
                ]}
                onPress={() => setSelectedField(field)}
              >
                <Text style={selectedField?.id === field.id && styles.selectedFieldButtonText}>{field.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {selectedField && (
          <>
            <Text style={styles.sectionTitle}>Select Date:</Text>
            <View style={styles.dateSelectionContainer}>
              <Button title="Previous Day" onPress={() => setSelectedDate(prev => {
                  const newDate = new Date(prev);
                  newDate.setDate(prev.getDate() - 1);
                  return newDate;
              })} />
              <Text style={styles.selectedDateText}>{formatDate(selectedDate)}</Text>
              <Button title="Next Day" onPress={() => setSelectedDate(prev => {
                  const newDate = new Date(prev);
                  newDate.setDate(prev.getDate() + 1);
                  return newDate;
              })} />
            </View>

            <Text style={styles.sectionTitle}>Available Slots ({selectedField.name}):</Text>
            {fetchingSlots ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : availableSlots.length === 0 ? (
              <Text>No slots available for this date and field.</Text>
            ) : (
              <View style={styles.slotsContainer}>
                {availableSlots.map((slot) => (
                  <TouchableOpacity
                    key={slot.id}
                    style={[
                      styles.slotButton,
                      selectedSlot?.id === slot.id && styles.selectedSlotButton,
                    ]}
                    onPress={() => setSelectedSlot(slot)}
                  >
                    <Text style={selectedSlot?.id === slot.id && styles.selectedSlotButtonText}>
                      {new Date(slot.startTime.toMillis()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {selectedSlot && (
              <View style={styles.bookingSummary}>
                <Text style={styles.bookingSummaryText}>Selected Slot: {new Date(selectedSlot.startTime.toMillis()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                <Text style={styles.bookingSummaryText}>Price: PKR {selectedField.pricePerHourPkr}</Text>
                <Button
                  title={bookingLoading ? "Booking..." : "Book Now"}
                  onPress={handleBooking}
                  disabled={bookingLoading || !user || latestBookingId !== null} // Disable if booking or payment in progress
                />
                 {!user && <Text style={styles.loginPrompt}>Login to book this slot</Text>}
              </View>
            )}

            {latestBookingId && (
              <View style={styles.paymentSection}>
                <Text style={styles.sectionTitle}>Payment:</Text>
                <Text>Booking created, proceed to payment.</Text>
                <Button
                  title={paymentLoading ? "Processing Payment..." : "Pay Now"}
                  onPress={handlePayment}
                  disabled={paymentLoading || !user}
                />
              </View>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}

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