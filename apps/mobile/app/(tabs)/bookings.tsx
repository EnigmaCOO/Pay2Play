import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/lib/api';
import { format, isPast } from 'date-fns';
import type { BookingWithDetails } from '@shared/schema';
import { BookingCardSkeleton } from '@/components/SkeletonLoader';

type TabType = 'upcoming' | 'past';

const sportColors: Record<string, string> = {
  cricket: '#f97316',
  football: '#3b82f6',
  futsal: '#3b82f6',
  padel: '#a855f7',
};

export default function BookingsScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');

  const { data: bookings = [], isLoading, refetch } = useQuery<BookingWithDetails[]>({
    queryKey: ['/api/bookings/me', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return [];
      const response = await apiClient.get(`/api/bookings/me/${user.uid}`);
      return response.data;
    },
    enabled: !!user?.uid,
  });

  const upcomingBookings = bookings.filter(
    (b) => !isPast(new Date(b.slot.endTime)) && b.status !== 'cancelled'
  );

  const pastBookings = bookings.filter(
    (b) => isPast(new Date(b.slot.endTime)) || b.status === 'cancelled'
  );

  const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-navy-800">
        <View className="flex-1">
          <View className="px-6 py-4 border-b border-navy-700">
            <Text className="text-3xl font-bold text-white">
              Bookings
            </Text>
            <Text className="text-navy-300 mt-1">
              Manage your reservations
            </Text>
          </View>
          <ScrollView className="px-6 py-4">
            <BookingCardSkeleton />
            <BookingCardSkeleton />
            <BookingCardSkeleton />
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-navy-800">
      <View className="flex-1">
        <View className="px-6 py-4 border-b border-navy-700">
          <Text className="text-3xl font-bold text-white">
            Bookings
          </Text>
          <Text className="text-navy-300 mt-1">
            Manage your reservations
          </Text>
        </View>

        {/* Tabs */}
        <View className="px-6 py-4">
          <View className="flex-row bg-navy-700 rounded-lg p-1">
            <TouchableOpacity
              className={`flex-1 py-2 rounded-md ${activeTab === 'upcoming' ? 'bg-teal' : ''}`}
              onPress={() => setActiveTab('upcoming')}
              data-testid="button-tab-upcoming"
            >
              <Text className={`text-center font-semibold ${activeTab === 'upcoming' ? 'text-white' : 'text-navy-300'}`}>
                Upcoming ({upcomingBookings.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-2 rounded-md ${activeTab === 'past' ? 'bg-teal' : ''}`}
              onPress={() => setActiveTab('past')}
              data-testid="button-tab-past"
            >
              <Text className={`text-center font-semibold ${activeTab === 'past' ? 'text-white' : 'text-navy-300'}`}>
                Past ({pastBookings.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          className="flex-1 px-6"
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              tintColor="#14b8a6"
            />
          }
        >
          {displayedBookings.length > 0 ? (
            displayedBookings.map((booking, index) => (
              <View
                key={booking.id}
                className="bg-navy-700 rounded-xl mb-4"
                data-testid={`booking-card-${index}`}
              >
                <View className="p-4">
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                      <View className="flex-row items-center mb-2">
                        <Ionicons
                          name={
                            booking.slot.field.sport === 'cricket' ? 'baseball' :
                            booking.slot.field.sport === 'football' || booking.slot.field.sport === 'futsal' ? 'football' :
                            'tennisball'
                          }
                          size={20}
                          color={sportColors[booking.slot.field.sport] || '#14b8a6'}
                        />
                        <Text className="text-white font-bold text-lg ml-2">
                          {booking.slot.field.venue.name}
                        </Text>
                      </View>
                      <Text className="text-navy-300 mb-1">
                        {booking.slot.field.name}
                      </Text>
                    </View>
                    <View 
                      className={`px-3 py-1 rounded-full ${
                        booking.status === 'confirmed' ? 'bg-teal/20' :
                        booking.status === 'cancelled' ? 'bg-red-500/20' :
                        'bg-navy-600'
                      }`}
                    >
                      <Text 
                        className={`text-xs font-semibold uppercase ${
                          booking.status === 'confirmed' ? 'text-teal' :
                          booking.status === 'cancelled' ? 'text-red-400' :
                          'text-navy-300'
                        }`}
                      >
                        {booking.status}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center mb-2">
                    <Ionicons name="calendar-outline" size={16} color="#8dabc9" />
                    <Text className="text-navy-300 text-sm ml-2">
                      {format(new Date(booking.slot.startTime), 'EEE, MMM d, yyyy')}
                    </Text>
                  </View>

                  <View className="flex-row items-center mb-3">
                    <Ionicons name="time-outline" size={16} color="#8dabc9" />
                    <Text className="text-navy-300 text-sm ml-2">
                      {format(new Date(booking.slot.startTime), 'h:mm a')} - {format(new Date(booking.slot.endTime), 'h:mm a')}
                    </Text>
                  </View>

                  <View className="flex-row items-center justify-between pt-3 border-t border-navy-600">
                    <View className="flex-row items-center">
                      <Ionicons name="location-outline" size={16} color="#8dabc9" />
                      <Text className="text-navy-400 text-sm ml-1">
                        {booking.slot.field.venue.city}
                      </Text>
                    </View>
                    <Text className="text-gold font-bold text-lg">
                      PKR {booking.amountPkr.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View className="py-12 items-center">
              <View className="w-20 h-20 rounded-full bg-navy-700 items-center justify-center mb-4">
                <Ionicons 
                  name={activeTab === 'upcoming' ? 'calendar-outline' : 'time-outline'} 
                  size={40} 
                  color="#374151" 
                />
              </View>
              <Text className="text-white text-lg font-semibold mb-2">
                {activeTab === 'upcoming' ? 'No Upcoming Bookings' : 'No Past Bookings'}
              </Text>
              <Text className="text-navy-400 text-sm text-center px-8">
                {activeTab === 'upcoming' 
                  ? 'Book a facility to start playing'
                  : 'Your booking history will appear here'
                }
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
