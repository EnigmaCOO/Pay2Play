
import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import BookingSummaryCard from '../../components/booking/BookingSummaryCard';
import PriceBreakdownCard from '../../components/booking/PriceBreakdownCard';
import PaymentMethodSelector from '../../components/booking/PaymentMethodSelector';
import ScreenBackground from '@shared/ui/ScreenBackground';
import AppHeader from '@shared/ui/AppHeader';
import PrimaryButton from '@shared/ui/PrimaryButton';


const BookingReviewScreen = ({ navigation }) => {
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

  return (
    <ScreenBackground>
      <AppHeader title="Booking review" onBack={() => navigation.goBack()} />
      <ScrollView>
        <View style={styles.container}>
            <BookingSummaryCard details={bookingDetails} />
            <PriceBreakdownCard details={priceDetails} />
            <PaymentMethodSelector />
            <PrimaryButton 
                title={`Confirm & Pay PKR ${finalPrice}`} 
                onPress={() => { /* Handle Payment */}} 
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
