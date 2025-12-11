
import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenBackground from '../../shared/ui/ScreenBackground';
import AppHeader from '../../shared/ui/AppHeader';
import BookingSummaryCard from '../components/booking/BookingSummaryCard';
import PriceBreakdownCard from '../components/booking/PriceBreakdownCard';
import PaymentMethodSelector from '../components/booking/PaymentMethodSelector';
import PrimaryButton from '../../shared/ui/PrimaryButton';

const BookingReviewScreen = () => {
  const router = useRouter();

  // Mock data for now. This should be passed from the venue detail screen.
  const bookingDetails = {
      sport: 'Football · 5-a-side',
      dateTime: 'Today, 25 Nov · 8:00–9:00 PM',
      venue: 'Star Futsal Arena · DHA Phase 5',
      players: 10
  }

  const priceDetails = {
      basePrice: 5000,
      discount: 1000,
      credits: 200,
  }

  const finalPrice = priceDetails.basePrice - priceDetails.discount - priceDetails.credits;

  const handlePayment = () => {
      // Payment logic will be implemented here.
      // For now, navigate to a success screen.
      router.push('/booking/success');
  }

  return (
    <ScreenBackground>
      <AppHeader title="Booking review" onBack={() => router.back()} />
      <ScrollView>
        <View style={styles.container}>
            <BookingSummaryCard details={bookingDetails} />
            <PriceBreakdownCard details={priceDetails} />
            <PaymentMethodSelector />
            <PrimaryButton 
                title={`Confirm & Pay PKR ${finalPrice}`} 
                onPress={handlePayment} 
            />
            <Text style={styles.footerText}>By paying, your slot will be confirmed.</Text>
        </View>
      </ScrollView>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  footerText: {
      color: '#94a3b8',
      textAlign: 'center',
      marginTop: 10,
  }
});

export default BookingReviewScreen;
