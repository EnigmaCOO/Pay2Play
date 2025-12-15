
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import VenueHeader from '../../components/venues/VenueHeader';
import VenueImageCarousel from '../../components/venues/VenueImageCarousel';
import VenueInfoStrip from '../../components/venues/VenueInfoStrip';
import ScreenBackground from '@shared/ui/ScreenBackground';
import SegmentedTabs from '@shared/ui/SegmentedTabs';
import DateChipStrip from '@shared/ui/DateChipStrip';
import SlotGrid from '../../components/venues/SlotGrid';
import BookingFooterBar from '../../components/venues/BookingFooterBar';

const VenueDetailScreen = ({ navigation, route }) => {
  // const { venueId } = route.params;
  const [activeTab, setActiveTab] = useState('Availability');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Mock data for demonstration
  const dates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d;
  });

  return (
    <ScreenBackground>
        <VenueHeader name="Star Futsal Arena" onBack={() => navigation.goBack()} />
        <ScrollView>
            <VenueImageCarousel />
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
                        <SlotGrid onSelectSlot={setSelectedSlot} selectedSlot={selectedSlot}/>
                    </>
                )}
                {/* Add other tab views here */}
            </View>
        </ScrollView>
        {selectedSlot && <BookingFooterBar slot={selectedSlot} onContinue={() => navigation.navigate('BookingReview')} />}
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
    content: {
        padding: 16,
    }
});

export default VenueDetailScreen;
