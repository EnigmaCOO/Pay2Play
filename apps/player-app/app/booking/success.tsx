
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenBackground from '../../shared/ui/ScreenBackground';
import PrimaryButton from '../../shared/ui/PrimaryButton';
import SecondaryButton from '../../shared/ui/SecondaryButton';

const BookingSuccessScreen = () => {
  const router = useRouter();

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <Text style={styles.title}>Booking Confirmed!</Text>
        <Text style={styles.subtitle}>Your game is locked in.</Text>
        
        {/* Simplified version of the booking summary */}
        <View style={styles.summaryCard}>
            <Text style={styles.summaryText}>Venue: Star Futsal Arena</Text>
            <Text style={styles.summaryText}>Date: Today, 8:00 PM</Text>
            <Text style={styles.summaryText}>Paid: PKR 3,800</Text>
        </View>

        <PrimaryButton 
          title="Host a match from this slot" 
          onPress={() => { /* Navigate to host match screen */ }} 
        />
        <SecondaryButton 
          title="View my bookings"
          onPress={() => router.push('/(tabs)/bookings')} 
        />
         <Text style={styles.footerText} onPress={() => router.replace('/(tabs)/home')}>Go to Home</Text>
      </View>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#94a3b8',
    marginBottom: 30,
  },
  summaryCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.5)',
  },
  summaryText: {
      color: '#FFFFFF',
      fontSize: 16,
      marginBottom: 8,
  },
  footerText: {
      color: '#14b8a6',
      marginTop: 20,
  }
});

export default BookingSuccessScreen;
